import TableRenderer from "./TableRenderer";
import defaultProps from "./helper/defaultProps";
import { h } from "vue";

export default {
  name: "vue-pivottable",
  props: defaultProps.props,
  computed: {
    rendererItems () {
      return Object.keys(this.renderers || {}).length
        ? this.renderers
        : TableRenderer
    },
  },
  render() {
    const renderer = this.rendererItems[this.rendererName] || Object.keys(TableRenderer)[0]
    return h(renderer, { ...this.$props });
  },
};
