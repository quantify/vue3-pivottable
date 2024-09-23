// Import your components and utilities
import VuePivottable from './Pivottable'
import VuePivottableUi from './PivottableUi'
import TableRenderer from './TableRenderer'

import {
  aggregatorTemplates,
  aggregators,
  derivers,
  locales,
  naturalSort,
  numberFormat,
  getSort,
  sortAs,
  PivotData
} from './helper/utils'

// Bundle utilities and renderers
const PivotUtilities = {
  aggregatorTemplates,
  aggregators,
  derivers,
  locales,
  naturalSort,
  numberFormat,
  getSort,
  sortAs,
  PivotData
}

const Renderer = {
  TableRenderer
}

// Collect components for easy registration
const components = {
  VuePivottable,
  VuePivottableUi
}

// Define the install method for the plugin
const install = (app) => {
  // Register each component globally
  Object.values(components).forEach(component => {
    app.component(component.name, component)
  })
}

// Export individual components and utilities
export {
  VuePivottable,
  VuePivottableUi,
  PivotUtilities,
  Renderer
}

// Export the plugin as the default export
export default {
  install
}
