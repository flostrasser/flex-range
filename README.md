# flex-range

A flexible vanilla JavaScript range slider

## Installation

```sh
npm install flex-range
```

## Usage

### HTML:

```html
<input id="slider" type="range" data-min="10" data-max="80" />
```

### JS:

```js
import { FlexRange } from 'flex-range';

const slider = new FlexRange('#slider');
```

or with options:

```js
const slider = new FlexRange('#slider', {
    min: 0,
    max: 100,
    from: 10,
    to: 80,
});
```

### SCSS:

```scss
@use 'flex-range';
```

## Customize

Example for overriding variables:

```scss
@use 'flex-range' with (
    $fr-primary-color: #4285f4;
    $fr-bar-width: 0.25rem;
    $fr-handle-size: 1.25rem;
    $fr-handle-color: #4285f4;
    $fr-handle-border: none;
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

## License

MIT
