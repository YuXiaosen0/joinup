import http from "./http.js";
import {useUserStore} from '../stores/user.js'
//首页信息
export const getIndexList = () => {
	return http('/test/hello','d','GET')
}
// 登录
export const login = (code) => {
	return http('/user/wxLogin', { code }, 'POST')
}
// 获取用户信息
export const getUserInfo = () => {
	return http('/user/info','d','GET')
}
// 修改用户信息
export const modifyUserInfo = (data) => {
	return http('/user',{data},'PUT')
}
// 发送验证码
export const sendVerifyCode = (data) => {
	return http('/verify',data,'POST')
}
// 进行北航身份验证
export const yanzheng = (data) => {
	return http('/user/verify',data,'POST')
}
export const searchList = async (params) => {
  // 实现搜索逻辑
  // 例如：
  // const response = await request('/api/search', params);
  // return response;
  return null
}
export const signClass = (id) => {
	return http(`/course/sign?courseScheduleId=${id}`,'r','POST')
}
// 获取课程信息
export const getCourseInfo = (data) => {
	return http(`/course/list?date=${data}`,'d','GET')
}

// 获取签到任务列表
export const getSign = (status) => {
	return http(`/course/task/list?status=${status}`,'d','GET')
}
//添加签到任务
export const addSign = (courseId) => {
	return http(`/course/task/add`,{courseId},'POST')
}
//删除签到任务,传入任务id
export const deleteSign = (Id) => {
	return http(`/course/task/${Id}`,'r','DELETE')
}