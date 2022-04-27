import * as Vue from "vue";
export default {
  name: "draggable-attribute",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    sortable: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: true,
    },
    attrValues: {
      type: Object,
      required: true,
    },
    valueFilter: {
      type: Object,
      default: function () {
        return {};
      },
    },
    sorter: {
      type: Function,
      required: true,
    },
    menuLimit: Number,
    zIndex: Number,
  },
  data() {
    return {
      // open: false,
      filterText: "",
      attribute: "",
      values: [],
      filter: {},
    };
  },
  computed: {
    disabled() {
      return !this.sortable && !this.draggable;
    },
    sortonly() {
      return this.sortable && !this.draggable;
    },
  },
  methods: {
    setValuesInFilter(attribute, values) {
      const valueFilter = values.reduce((r, v) => {
        r[v] = true;
        return r;
      }, {});
      this.$emit("update:filter", { attribute, valueFilter });
    },
    addValuesToFilter(attribute, values) {
      const valueFilter = values.reduce(
        (r, v) => {
          r[v] = true;
          return r;
        },
        {
          ...this.valueFilter,
        }
      );
      this.$emit("update:filter", { attribute, valueFilter });
    },
    removeValuesFromFilter(attribute, values) {
      const valueFilter = values.reduce(
        (r, v) => {
          if (r[v]) {
            delete r[v];
          }
          return r;
        },
        {
          ...this.valueFilter,
        }
      );
      this.$emit("update:filter", { attribute, valueFilter });
    },
    moveFilterBoxToTop(attribute) {
      this.$emit("moveToTop:filterbox", { attribute });
    },
    toggleValue(value) {
      if (value in this.valueFilter) {
        this.removeValuesFromFilter(this.name, [value]);
      } else {
        this.addValuesToFilter(this.name, [value]);
      }
    },
    matchesFilter(x) {
      return x
        .toLowerCase()
        .trim()
        .includes(this.filterText.toLowerCase().trim());
    },
    selectOnly(e, value) {
      e.stopPropagation();
      this.value = value;
      this.setValuesInFilter(
        this.name,
        Object.keys(this.attrValues).filter((y) => y !== value)
      );
    },
    getFilterBox() {
      const showMenu = Object.keys(this.attrValues).length < this.menuLimit;
      const values = Object.keys(this.attrValues);
      const shown = values
        .filter(this.matchesFilter.bind(this))
        .sort(this.sorter);
      return Vue.h(
        "div",
        {
          class: ["pvtFilterBox"],
          style: {
            display: "block",
            cursor: "initial",
            zIndex: this.zIndex,
          },
          onClick: () => this.moveFilterBoxToTop(this.name),
        },
        [
          Vue.h(
            "div",
            {
              class: "pvtSearchContainer",
            },
            [
              showMenu || Vue.h("p", "too many values to show"),
              showMenu &&
                Vue.h("input", {
                  class: ["pvtSearch"],
                  type: "text",
                  placeholder: "Filter Values",
                  value: this.filterText,
                  onInput: (e) => {
                    this.filterText = e.target.value;
                    this.$emit("input", e.target.value);
                  },
                }),
              Vue.h("a", {
                class: ["pvtFilterTextClear"],
                onclick: () => {
                  this.filterText = "";
                },
              }),
              Vue.h(
                "a",
                {
                  class: ["pvtButton"],
                  role: "button",
                  onClick: () =>
                    this.removeValuesFromFilter(
                      this.name,
                      Object.keys(this.attrValues).filter(
                        this.matchesFilter.bind(this)
                      )
                    ),
                },
                `Select ${
                  values.length === shown.length ? "All" : shown.length
                }`
              ),
              Vue.h(
                "a",
                {
                  class: ["pvtButton"],
                  role: "button",
                  onClick: () =>
                    this.addValuesToFilter(
                      this.name,
                      Object.keys(this.attrValues).filter(
                        this.matchesFilter.bind(this)
                      )
                    ),
                },
                `Deselect ${
                  values.length === shown.length ? "All" : shown.length
                }`
              ),
            ]
          ),
          showMenu &&
            Vue.h(
              "div",
              {
                class: ["pvtCheckContainer"],
              },
              [
                ...shown.map((x) => {
                  const checked = !(x in this.valueFilter);
                  return Vue.h(
                    "p",
                    {
                      class: {
                        selected: checked,
                      },
                      key: x,
                      onClick: () => this.toggleValue(x),
                    },
                    [
                      Vue.h("input", {
                        type: "checkbox",
                        checked: checked,
                      }),
                      x,
                      Vue.h(
                        "a",
                        {
                          class: ["pvtOnly"],
                          onClick: (e) => this.selectOnly(e, x),
                        },
                        "only"
                      ),
                      Vue.h("a", {
                        class: ["pvtOnlySpacer"],
                      }),
                    ]
                  );
                }),
              ]
            ),
        ]
      );
    },
    toggleFilterBox() {
      this.openFilterBox(this.name, !this.open);
      this.moveFilterBoxToTop(this.name);
    },
    openFilterBox(attribute, open) {
      this.$emit("open:filterbox", { attribute, open });
    },
  },
  render() {
    const filtered =
      Object.keys(this.valueFilter).length !== 0 ? " pvtFilteredAttribute" : "";
    const spanClass = ["pvtAttr" + filtered];
    if (this.sortonly) {
      spanClass.push("sortonly");
    }
    if (this.disabled) {
      spanClass.push("disabled");
    }
    return Vue.h(
      "li",
      {
        "data-id": !this.disabled ? this.name : undefined,
      },
      [
        Vue.h(
          "span",
          {
            class: spanClass,
          },
          [
            this.name,
            !this.disabled
              ? Vue.h(
                  "span",
                  {
                    class: ["pvtTriangle"],
                    onClick: this.toggleFilterBox.bind(this),
                  },
                  "  ▾"
                )
              : undefined,
            this.open ? this.getFilterBox() : undefined,
          ]
        ),
      ]
    );
  },
};
