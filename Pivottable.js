import TableRenderer from "./TableRenderer";
import defaultProps from "./helper/defaultProps";
import * as Vue from "vue";
export default {
  name: "vue-pivottable",
  props: defaultProps.props,
  computed: {
    renderers() {
      return TableRenderer[
        this.rendererName in TableRenderer
          ? this.rendererName
          : Object.keys(TableRenderer)[0]
      ];
    },
  },
  render() {
    return Vue.h(this.renderers, { ...this.$props });
  },
};
