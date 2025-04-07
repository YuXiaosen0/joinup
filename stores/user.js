import { defineStore } from "pinia"
import { ref } from "vue"
//// 定义一个名为 "user" 的 store，提供了设置和移除令牌的功能，并且通过持久化插件确保状态在页面刷新后不会丢失。
export const useUserStore = defineStore("user",() => {
    const token = ref("")

    const setToken = (newToken) => {
        token.value = newToken
    }

    const removeToken = () => {
        token.value = ""
    }

    return {
        token,
        setToken,
        removeToken,
    }
},{
    persist: true,
}
)
