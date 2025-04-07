import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建一个 Pinia 实例
const pinia = createPinia()
//// 使用持久化插件，使状态在页面刷新后仍然保持
pinia.use(persist)

export default pinia

export * from './user'