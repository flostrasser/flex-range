# FlexRange

A flexible vanilla JavaScript range slider

> Note: This is an experimental project. Its not recommended to use it in production.

### [CodePen Demo](https://codepen.io/flostrasser/pen/mdWBMrg)

---

## Installation

```sh
npm install flex-range
```

> or import from cdn: `import { FlexRange } from 'https://cdn.skypack.dev/flex-range'`

## Usage

### HTML:

```html
<input id="slider" type="range" />
```

All slider options can also be set with data-attributes:

```html
<input id="slider" type="range" data-min="0" data-max="100" data-from="10" data-to="90" />
```

### JS:

```js
import { FlexRange } from 'flex-range';

// initialize slider instance
const slider = new FlexRange('#slider', {
    min: 0,
    max: 100,
    from: 10,
    to: 90,
});

// update slider values
slider.update({ from: 20, to: 80 });

// listen to changes
slider.on('change', (event) => {
    console.log(event.values);
});
```

> Note: to prevent the slider from firing the `change` event when calling `update()`, set the second argument to `false` (e.g. `slider.update({ from: 1 }, false)`).

Options:

| Name | Description          |
| ---- | -------------------- |
| min  | minimum value        |
| max  | maximum value        |
| from | initial value 'from' |
| to   | initial value 'to'   |

Methods:

| Name     | Description                            |
| -------- | -------------------------------------- |
| update() | update one or more slider values       |
| reset()  | reset the slider to its initial values |
| on()     | listen to events                       |

Events:

| Name   | Description                                                   |
| ------ | ------------------------------------------------------------- |
| change | fires when a slider value changes                             |
| update | fires only when the slider values get updated with `update()` |
| reset  | fires on form reset or when `reset()` is called               |

### SCSS:

```scss
@use 'flex-range';
```

## Customize

Example for overriding variables:

```scss
@use 'flex-range' with (
    $fr-primary-color: #0150ce,
    $fr-bar-width: 0.2rem,
    $fr-handle-size: 1.25rem,
    $fr-handle-color: #0150ce,
    $fr-handle-border: none,
);
```

All default variables:

```scss
// general variables
$fr-primary-color: hsl(0deg, 0%, 33%) !default;

// bar variables
$fr-bar-width: 0.2rem !default;
$fr-bar-color: hsl(0deg, 0%, 80%) !default;
$fr-bar-range-color: $fr-primary-color !default;

// handle variables
$fr-handle-size: 2rem !default;
$fr-handle-color: white !default;
$fr-handle-border-color: $fr-primary-color !default;
$fr-handle-active-color: $fr-primary-color !default;
$fr-handle-border: 0.2rem solid $fr-handle-border-color !default;
$fr-handle-border-radius: 50% !default;
$fr-handle-shadow: none !default;
```

---

## License

MIT
