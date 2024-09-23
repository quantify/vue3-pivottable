// index.d.ts

import { DefineComponent, Plugin } from "vue";

// Declare the Vue components
export const VuePivottable: DefineComponent<{}, {}, any>;
export const VuePivottableUi: DefineComponent<{}, {}, any>;

// Declare the utilities
export const PivotUtilities: {
    aggregatorTemplates: any;
    aggregators: any;
    derivers: any;
    locales: any;
    naturalSort: any;
    numberFormat: any;
    getSort: any;
    sortAs: any;
    PivotData: any;
};

// Declare the renderers
export const Renderer: {
    TableRenderer: DefineComponent<{}, {}, any>;
};

// Declare the plugin for Vue
declare const Vue3PivotTablePlugin: Plugin;

// Export the plugin as the default export
export default Vue3PivotTablePlugin;
