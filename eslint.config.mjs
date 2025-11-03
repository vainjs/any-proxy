import config from '@vainjs/eslint-config'
import pluginVue from 'eslint-plugin-vue'

/** @type {import("eslint").Linter.Config} */
export default [...config, ...pluginVue.configs['flat/recommended']]
