
# Vue3 Pivottable

Drop-in replacement of [vue-pivottable](https://github.com/Seungwoo321/vue-pivottable) with Vue3 support.

## Installation

```shall
npm install @quantify/vue3-pivottable
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

## Events (added)

Additionally the component emits events when internal settings have changed

```
@update:items
@update:rows
@update:cols
@update:aggregatorName
@update:vals
```

## License

MIT

## Credits

* [PivotTable.js](https://pivottable.js.org/)
* [Seungwoo321](https://github.com/Seungwoo321/vue-pivottable)
* [brettcodling](https://github.com/brettcodling/vue3-pivottable)
* [chikko80](https://github.com/chikko80/vue3-pivottable)
