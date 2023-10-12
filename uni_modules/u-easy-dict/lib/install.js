import Dict from './Dict'
import { mergeOptions } from './DictOptions'

export default function install(Vue, options) {
  mergeOptions(options)
  const dict = new Dict()
  dict.init(options)
  dict.ready.then(() => {
    options.onReady && options.onReady(dict)
  })
  
  // #ifndef VUE3
  Vue.prototype.$dict = dict
  // #endif
  // #ifdef VUE3
  Vue.config.globalProperties.$dict = $dict;
  // #endif
}
