const numberOptions = ['min', 'max', 'from', 'to'];

// Slider Class
// ----------------------------
export class FlexRange {
    originalElement = null;
    sliderElement = null;
    updateType = null;
    events = {};

    options = {
        min: 0,
        max: 100,
        from: null,
        to: null,
    };

    preciseValues = {};

    constructor(target, options = {}) {
        // get the target element
        const originalElement = target instanceof HTMLElement ? target : document.querySelector(target);
        if (!originalElement) return;

        this.originalElement = originalElement;

        // assign options
        setOptions(this, options);

        // initialize the slider
        hideOriginalEl(this.originalElement);
        this.sliderElement = createSliderElements(this.originalElement);
        updateElements(this.sliderElement, this.options);
        createEventListeners(this);
    }

    // update the slider with new values
    update(options, triggerEvent = true) {
        if (options.from && this.options.from != options.from) this.updateType = 'from';
        if (options.to && this.options.to != options.to) this.updateType = 'to';

        Object.assign(this.options, options);
        constrainOptions(this);
        updateElements(this.sliderElement, this.options);
        if (triggerEvent) publishEvent('update', this);
        return this;
    }

    // register event listener
    on(event, listener) {
        subscribeEvent(event, listener, this);
    }
}

function constrainOptions(slider) {
    // prevent left handle from exceeding min/max values
    if (slider.options.from < slider.options.min) slider.options.from = slider.options.min;
    if (slider.options.from > slider.options.max) slider.options.from = slider.options.max;

    // prevent overlapping of handles
    if (slider.options.from > slider.options.to && slider.updateType == 'from') slider.options.from = slider.options.to;
    if (slider.options.to < slider.options.from && slider.updateType == 'to') slider.options.to = slider.options.from;

    // prevent right handle from exceeding min/max values
    if (slider.options.to > slider.options.max) slider.options.to = slider.options.max;
    if (slider.options.to < slider.options.min) slider.options.to = slider.options.min;
}

function setOptions(slider, options) {
    assignOptions(slider.options, slider.originalElement.dataset)
    assignOptions(slider.options, options);

    if (!('from' in slider.originalElement.dataset) && !('from' in options)) slider.options.from = slider.options.min;
    if (!('to' in slider.originalElement.dataset) && !('to' in options)) slider.options.to = slider.options.max;

    constrainOptions(slider);

    slider.preciseValues.from = slider.options.from;
    slider.preciseValues.to = slider.options.to;
}

function assignOptions(targetOptions, sourceOptions) {
    // assign number options
    for (const item of numberOptions) {
        if (item in sourceOptions) targetOptions[item] = Number(sourceOptions[item]);
    }
}

function subscribeEvent(event, listener, slider) {
    if (!slider.events[event]) {
        slider.events[event] = [];
    }
    if (!slider.events[event].includes(listener)) {
        slider.events[event].push(listener);
    }
}

function publishEvent(event, slider) {
    const listeners = slider.events[event];
    if (!listeners) return;

    for (let listener of listeners) {
        listener({ values: slider.options });
    }
}

function updateElements(sliderEl, options) {
    updateHandles(sliderEl, options);
    updateBar(sliderEl, options);
}

function updateBar(sliderEl, options) {
    const barEl = sliderEl.querySelector('.range-slider-bar');

    const from = mapRange(options.from, options.min, options.max, 0, 100);
    const to = mapRange(options.to, options.min, options.max, 0, 100);

    barEl.style.left = `${from}%`;
    barEl.style.width = `${to - from}%`;
}

function updateHandles(sliderEl, options) {
    const handleFromEl = sliderEl.querySelector('.range-slider-handle.from');
    const handleToEl = sliderEl.querySelector('.range-slider-handle.to');

    const from = mapRange(options.from, options.min, options.max, 0, 100);
    const to = mapRange(options.to, options.min, options.max, 0, 100);

    handleFromEl.style.left = `${from}%`;
    handleToEl.style.left = `${to}%`;
}

function createEventListeners(slider) {
    const handles = slider.sliderElement.querySelectorAll('.range-slider-handle');
    let targetHandle, mouseStartPosX, deltaX, mouseToHandleOffset, sliderBoundingBox, sliderWidth, maxOffset, handleWidth, leftHandle, rightHandle;

    const getHandlePos = (pixelValue) => {
        return mapRange(pixelValue, 0, sliderWidth, slider.options.min, slider.options.max);
    }

    const getHandleOffset = (mouseX) => {
        deltaX = mouseStartPosX - mouseX;
        let handleOffset = getHandlePos(targetHandle.offsetLeft - deltaX);

        // constrain handles to slider bounding box
        const isOutOfSliderConstrainLeft = (mouseX < sliderBoundingBox.x + mouseToHandleOffset - handleWidth / 2);
        const isOutOfSliderConstrainRight = (mouseX > sliderBoundingBox.x + sliderWidth - mouseToHandleOffset + handleWidth / 2);

        if (isOutOfSliderConstrainLeft) handleOffset = slider.options.min;
        if (isOutOfSliderConstrainRight) handleOffset = maxOffset;

        if (targetHandle.classList.contains('from') && mouseX > rightHandle.getBoundingClientRect().x + mouseToHandleOffset) {
            handleOffset = slider.preciseValues.to;

        } else if (targetHandle.classList.contains('to') && mouseX < leftHandle.getBoundingClientRect().x + mouseToHandleOffset) {
            handleOffset = slider.preciseValues.from;
        }

        return handleOffset;
    }

    const mouseDragHandler = event => {
        const handleOffset = getHandleOffset(event.clientX);
        const handleOffsetFixed = toFixed(handleOffset, 2);

        if (targetHandle.classList.contains('from')) {
            slider.preciseValues.from = handleOffset;
            slider.update({ from: handleOffsetFixed });

        } else if (targetHandle.classList.contains('to')) {
            slider.preciseValues.to = handleOffset;
            slider.update({ to: handleOffsetFixed });
        }

        slider.sliderElement.classList.add('dragging');

        publishEvent('change', slider);
        mouseStartPosX = event.clientX;
    }

    const mouseUpHandler = () => {
        // stop dragging when mouse is released
        document.removeEventListener('mousemove', mouseDragHandler);
        slider.sliderElement.classList.remove('dragging');
    }

    const mouseDownHandler = event => {
        mouseStartPosX = event.clientX;
        targetHandle = event.target;
        leftHandle = Array.from(handles).filter(handle => handle.classList.contains('from'))[0];
        rightHandle = Array.from(handles).filter(handle => handle.classList.contains('to'))[0];
        mouseToHandleOffset = mouseStartPosX - targetHandle.getBoundingClientRect().x;
        sliderBoundingBox = slider.sliderElement.getBoundingClientRect();
        sliderWidth = sliderBoundingBox.width;
        handleWidth = targetHandle.offsetWidth;
        maxOffset = getHandlePos(sliderWidth);

        handles.forEach(handle => handle.classList.remove('handle-active'));
        targetHandle.classList.add('handle-active');

        document.addEventListener('mousemove', mouseDragHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }

    handles.forEach(handle => handle.addEventListener('mousedown', mouseDownHandler));
}

function hideOriginalEl(targetEl) {
    targetEl.style.display = 'none';
    targetEl.hidden = true;
}

function createSliderElements(targetEl) {
    const wrapper = createElement('div', 'range-slider');
    const bar = createElement('div', 'range-slider-bar');
    const handleFrom = createElement('div', ['range-slider-handle', 'from']);
    const handleTo = createElement('div', ['range-slider-handle', 'to']);

    wrapper.append(bar, handleFrom, handleTo);

    // instert wrapper after targetEl
    targetEl.parentNode.insertBefore(wrapper, targetEl.nextSibling);

    return wrapper;
}

// Utilities
// ----------------------------

function createElement(type, className, attributesObj) {
    const element = document.createElement(type);
    if (Array.isArray(className)) {
        for (const name of className) element.classList.add(name);
    } else if (className) {
        element.classList.add(className);
    }
    for (const attrName in attributesObj) element.setAttribute(attrName, attributesObj[attrName]);
    return element;
}

function toFixed(num, precision) {
    const factor = Math.pow(10, precision);
    return Math.round((num + Number.EPSILON) * factor) / factor;
}

// Re-maps a number from one range to another.
export function mapRange(value, fromIn, toIn, fromOut, toOut) {
    return fromOut + (toOut - fromOut) * (value - fromIn) / (toIn - fromIn);
}