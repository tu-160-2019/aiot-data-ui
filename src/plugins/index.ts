import modal from './modal'
import cache from './cache'

import { App } from 'vue'

export default function installPlugin(app: App) {

  // 模态框对象
  app.config.globalProperties.$modal = modal

  // 缓存对象
  app.config.globalProperties.$cache = cache

}
