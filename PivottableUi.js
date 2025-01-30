import common from "./helper/defaultProps";
import DraggableAttribute from "./DraggableAttribute";
import Dropdown from "./Dropdown";
import Pivottable from "./Pivottable";
import { PivotData, getSort, aggregators, sortAs } from "./helper/utils";
import draggable from "vuedraggable";
import TableRenderer from "./TableRenderer";
import * as Vue from "vue";
import "./pivottable.css";

export default {
  name: "vue-pivottable-ui",
  props: {
    hiddenAttributes: {
      type: Array,
      default: function () {
        return [];
      },
    },
    hiddenFromAggregators: {
      type: Array,
      default: function () {
        return [];
      },
    },
    hiddenFromDragDrop: {
      type: Array,
      default: function () {
        return [];
      },
    },
    sortonlyFromDragDrop: {
      type: Array,
      default: function () {
        return [];
      },
    },
    disabledFromDragDrop: {
      type: Array,
      default: function () {
        return [];
      },
    },
    menuLimit: {
      type: Number,
      default: 500,
    },
    ...common.props,
  },
  emits: [
    "update:items",
    "update:rows",
    "update:cols",
    "update:aggregatorName",
    "update:vals",
  ],
  computed: {
    rendererItems () {
      return Object.keys(this.renderers || {}).length > 0
        ? this.renderers
        : TableRenderer
    },
    renderers() {
      return this.rendererItems;
    },
    numValsAllowed() {
      return (
        aggregators[this.propsData.aggregatorName || this.aggregatorName]([])()
          .numInputs || 0
      );
    },
    rowAttrs() {
      return this.propsData.rows.filter(
        (e) =>
          !this.hiddenAttributes.includes(e) &&
          !this.hiddenFromDragDrop.includes(e)
      );
    },
    colAttrs() {
      return this.propsData.cols.filter(
        (e) =>
          !this.hiddenAttributes.includes(e) &&
          !this.hiddenFromDragDrop.includes(e)
      );
    },
    unusedAttrs() {
      return Object.keys(this.attrValues)
        .filter(
          (e) =>
            !this.propsData.rows.includes(e) &&
            !this.propsData.cols.includes(e) &&
            !this.hiddenAttributes.includes(e) &&
            !this.hiddenFromDragDrop.includes(e)
        )
        .sort(sortAs(this.unusedOrder));
    },
  },
  data() {
    return {
      propsData: {
        aggregatorName: "",
        rendererName: "",
        rowOrder: "key_a_to_z",
        colOrder: "key_a_to_z",
        data: [],
        vals: [],
        cols: [],
        rows: [],
        valueFilter: {},
      },
      openStatus: {},
      attrValues: {},
      unusedOrder: [],
      zIndices: {},
      maxZIndex: 1000,
      openDropdown: false,
      materializedInput: [],
      sortIcons: {
        key_a_to_z: {
          rowSymbol: "↕",
          colSymbol: "↔",
          next: "value_a_to_z",
        },
        value_a_to_z: {
          rowSymbol: "↓",
          colSymbol: "→",
          next: "value_z_to_a",
        },
        value_z_to_a: {
          rowSymbol: "↑",
          colSymbol: "←",
          next: "key_a_to_z",
        },
      },
    };
  },
  beforeUpdated(nextProps) {
    this.materializeInput(nextProps.data);
  },
  created() {
    this.materializeInput(this.data);
    this.propsData.vals = this.vals.slice();
    this.propsData.rows = this.rows;
    this.propsData.cols = this.cols;
    this.unusedOrder = this.unusedAttrs;
    Object.keys(this.attrValues).map(this.assignValue);
    Object.keys(this.openStatus).map(this.assignValue);
  },
  watch: {
    data() {
      this.materializeInput(this.data);
      this.propsData.vals = this.vals.slice();
      this.propsData.rows = this.rows;
      this.propsData.cols = this.cols;
      this.unusedOrder = this.unusedAttrs;
      Object.keys(this.attrValues).map(this.assignValue);
      Object.keys(this.openStatus).map(this.assignValue);
    },
    // Watch for changes in items
    "propsData.items": {
      handler(newVal) {
        this.$emit("update:items", newVal);
      },
      deep: true,
    },
    // Watch for changes in rows
    "propsData.rows": {
      handler(newVal) {
        this.$emit("update:rows", newVal);
      },
      deep: true,
    },
    // Watch for changes in cols
    "propsData.cols": {
      handler(newVal) {
        this.$emit("update:cols", newVal);
      },
      deep: true,
    },
    // Watch for changes in aggregatorName
    "propsData.aggregatorName": {
      handler(newVal) {
        this.$emit("update:aggregatorName", newVal);
      },
    },
    // Watch for changes in vals
    "propsData.vals": {
      handler(newVal) {
        this.$emit("update:vals", newVal);
      },
      deep: true,
    },
  },
  methods: {
    assignValue(field) {
      this.propsData.valueFilter = {
        ...this.propsData.valueFilter,
        [field]: {},
      };
    },
    propUpdater(key) {
      return (value) => {
        this.propsData[key] = value;
      };
    },
    updateValueFilter({ attribute, valueFilter }) {
      this.propsData.valueFilter[attribute] = { ...valueFilter };
    },
    moveFilterBoxToTop({ attribute }) {
      this.maxZIndex += 1;
      this.zIndices[attribute] = this.maxZIndex + 1;
    },
    openFilterBox({ attribute, open }) {
      for (const attr in this.openStatus) {
        this.openStatus[attr] = false;
      }
      this.openStatus[attribute] = open;
    },
    materializeInput(nextData) {
      if (this.propsData.data === nextData) {
        return;
      }
      this.propsData.data = nextData;
      const attrValues = {};
      const materializedInput = [];
      let recordsProcessed = 0;
      PivotData.forEachRecord(
        this.data,
        this.derivedAttributes,
        function (record) {
          materializedInput.push(record);
          for (const attr of Object.keys(record)) {
            if (!(attr in attrValues)) {
              attrValues[attr] = {};
              if (recordsProcessed > 0) {
                attrValues[attr].null = recordsProcessed;
              }
            }
          }
          for (const attr in attrValues) {
            const value = attr in record ? record[attr] : "null";
            if (!(value in attrValues[attr])) {
              attrValues[attr][value] = 0;
            }
            attrValues[attr][value]++;
          }
          recordsProcessed++;
        }
      );
      this.materializedInput = materializedInput;
      this.attrValues = attrValues;
    },
    makeDnDCell(items, onChange, classes, h) {
      return h(
        draggable,
        {
          list: items,
          group: "sharted",
          ghostClass: ".pvtPlaceholder",
          filter: ".pvtFilterBox",
          preventOnFilter: false,
          tag: "td",
          class: classes,
          onSort: onChange.bind(this),
          itemKey: (x) => x,
        },
        {
          item: ({ element }) =>
            h(DraggableAttribute, {
              sortable:
                this.sortonlyFromDragDrop.includes(element) ||
                !this.disabledFromDragDrop.includes(element),
              draggable:
                !this.sortonlyFromDragDrop.includes(element) &&
                !this.disabledFromDragDrop.includes(element),
              name: element,
              key: element,
              attrValues: this.attrValues[element],
              sorter: getSort(this.sorters, element),
              menuLimit: this.menuLimit,
              zIndex: this.zIndices[element] || this.maxZIndex,
              valueFilter: this.propsData.valueFilter[element],
              open: this.openStatus[element],
              "onUpdate:filter": this.updateValueFilter,
              "onMoveToTop:filterbox": this.moveFilterBoxToTop,
              "onOpen:filterbox": this.openFilterBox,
            }),
        }
      );
    },
    rendererCell(rendererName, h) {
      return this.$slots.rendererCell
        ? h(
            "td",
            {
              class: ["pvtRenderers pvtVals pvtText"],
            },
            this.$slots.rendererCell
          )
        : h(
            "td",
            {
              class: ["pvtRenderers"],
            },
            [
              h(Dropdown, {
                values: Object.keys(this.renderers),
                value: rendererName,
                onInput: (value) => {
                  this.propUpdater("rendererName")(value);
                },
              }),
            ]
          );
    },
    aggregatorCell(aggregatorName, vals, h) {
      return this.$slots.aggregatorCell
        ? h(
            "td",
            {
              class: ["pvtVals pvtText"],
            },
            this.$slots.aggregatorCell
          )
        : h(
            "td",
            {
              class: ["pvtVals"],
            },
            [
              h("div", [
                h(Dropdown, {
                  style: {
                    display: "inline-block",
                  },
                  values: Object.keys(aggregators),
                  value: aggregatorName,
                  onInput: (value) => {
                    this.propUpdater("aggregatorName")(value);
                  },
                }),
                h(
                  "a",
                  {
                    class: ["pvtRowOrder"],
                    role: "button",
                    onClick: () => {
                      this.propUpdater("rowOrder")(
                        this.sortIcons[this.propsData.rowOrder].next
                      );
                    },
                  },
                  this.sortIcons[this.propsData.rowOrder].rowSymbol
                ),
                h(
                  "a",
                  {
                    class: ["pvtColOrder"],
                    role: "button",
                    onClick: () => {
                      this.propUpdater("colOrder")(
                        this.sortIcons[this.propsData.colOrder].next
                      );
                    },
                  },
                  this.sortIcons[this.propsData.colOrder].colSymbol
                ),
              ]),
              this.numValsAllowed > 0
                ? new Array(this.numValsAllowed).fill().map((n, i) => [
                    h(Dropdown, {
                      values: Object.keys(this.attrValues).filter(
                        (e) =>
                          !this.hiddenAttributes.includes(e) &&
                          !this.hiddenFromAggregators.includes(e)
                      ),
                      value: vals[i],
                      onInput: (value) => {
                        this.propsData.vals.splice(i, 1, value);
                      },
                    }),
                  ])
                : undefined,
            ]
          );
    },
    outputCell(props, h) {
      return h(
        "td",
        {
          class: ["pvtOutput"],
        },
        [h(Pivottable, props)]
      );
    },
  },
  render() {
    if (this.data.length < 1) return;

    let rendererName = this.propsData.rendererName || this.rendererName;
    if (!this.renderers[rendererName]) {
      rendererName = Object.keys(this.renderers)[0];
    }

    const aggregatorName = this.propsData.aggregatorName || this.aggregatorName;
    const vals = this.propsData.vals;
    const unusedAttrsCell = this.makeDnDCell(
      this.unusedAttrs,
      (e) => {
        const item = e.item.getAttribute("data-id");
        if (
          this.sortonlyFromDragDrop.includes(item) &&
          (!e.from.classList.contains("pvtUnused") ||
            !e.to.classList.contains("pvtUnused"))
        ) {
          return;
        }
        if (e.from.classList.contains("pvtUnused")) {
          this.unusedOrder.splice(e.oldIndex, 1);
        }
        if (e.to.classList.contains("pvtUnused")) {
          this.unusedOrder.splice(e.newIndex, 0, item);
        }
      },
      `pvtAxisContainer pvtUnused pvtHorizList`,
      Vue.h
    );
    const colAttrsCell = this.makeDnDCell(
      this.colAttrs,
      (e) => {
        const item = e.item.getAttribute("data-id");
        if (
          this.sortonlyFromDragDrop.includes(item) &&
          (!e.from.classList.contains("pvtCols") ||
            !e.to.classList.contains("pvtCols"))
        ) {
          return;
        }
        if (e.from.classList.contains("pvtCols")) {
          this.propsData.cols.splice(e.oldIndex, 1);
        }
        if (e.to.classList.contains("pvtCols")) {
          this.propsData.cols.splice(e.newIndex, 0, item);
        }
      },
      "pvtAxisContainer pvtHorizList pvtCols",
      Vue.h
    );
    const rowAttrsCell = this.makeDnDCell(
      this.rowAttrs,
      (e) => {
        const item = e.item.getAttribute("data-id");
        if (
          this.sortonlyFromDragDrop.includes(item) &&
          (!e.from.classList.contains("pvtRows") ||
            !e.to.classList.contains("pvtRows"))
        ) {
          return;
        }
        if (e.from.classList.contains("pvtRows")) {
          this.propsData.rows.splice(e.oldIndex, 1);
        }
        if (e.to.classList.contains("pvtRows")) {
          this.propsData.rows.splice(e.newIndex, 0, item);
        }
      },
      "pvtAxisContainer pvtVertList pvtRows",
      Vue.h
    );
    const props = {
      ...this.$props,
      data: this.materializedInput,
      rowOrder: this.propsData.rowOrder,
      colOrder: this.propsData.colOrder,
      valueFilter: this.propsData.valueFilter,
      rows: this.propsData.rows,
      cols: this.propsData.cols,
      rendererName,
      aggregatorName,
      vals,
    };

    const rendererCell = this.rendererCell(rendererName, Vue.h);
    const aggregatorCell = this.aggregatorCell(aggregatorName, vals, Vue.h);
    const outputCell = this.outputCell(props, Vue.h);

    return Vue.h(
      "table",
      {
        class: ["pvtUi"],
      },
      [
        Vue.h("tbody", [
          Vue.h("tr", [rendererCell, unusedAttrsCell]),
          Vue.h("tr", [aggregatorCell, colAttrsCell]),
          Vue.h("tr", [rowAttrsCell, outputCell]),
        ]),
      ]
    );
  },
};
