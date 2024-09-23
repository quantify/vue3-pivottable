
# Vue3 Pivottable for PrimeVue4 - Minimal Typescript support

It is a Vue port of the jQuery-based [PivotTable.js](https://pivottable.js.org/)

The component was styled with primevue4 css variables to integrate with the new architecture.
Minimal Typescript support was added.

## Installation

```shall
npm i https://github.com/chikko80/vue3-pivottable
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
