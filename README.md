
# Vue3 Pivottable

It is a Vue port of the jQuery-based [PivotTable.js](https://pivottable.js.org/)

## Installation

```shall
npm i https://github.com/brettcodling/vue3-pivottable
```

## Usage

* Vue Pivottable

```html
<template>
  <vue-pivottable
    :data="[{color: 'blue', shape: 'circle'},{color: 'red', shape: 'triangle'}]"
    :rows="['color']"
    :cols="['shape']"
  >
  </vue-pivottable>
</template>

<script>
import { VuePivottableUi } from 'vue3-pivottable'
export default {
  components: {
    VuePivottableUi
  }
}
</script>
```

* Vue Pivottable Ui

```html
<template>
  <VuePivottableUi
    :data="[{color: 'blue', shape: 'circle'},{color: 'red', shape: 'triangle'}]"
    :rows="['color']"
    :cols="['shape']"
  />
</template>
```

## License

MIT
