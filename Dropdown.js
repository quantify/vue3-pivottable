import { h } from "vue";
export default {
  props: ["value", "values", "changeValue"],
  emits: ["input"],
  render() {
    return h(
      "select",
      {
        class: "pvtDropdown",
        onChange: (e) => this.$emit("input", e.target.value),
      },
      this.values.map((val) => {
        return h(
          "option",
          {
            value: val,
            key: `dropdown-${val}`,
            selected: val === this.value,
          },
          val
        );
      })
    );
  },
};
