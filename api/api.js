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
	return http('/user',data,'PUT')
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
//获得学生的签到记录
export const getSignRecord = (data) => {
	return http(`/course/log`,data,'POST')
}
//listAll
export const listAll = () => {
	return http(`/interest/all`,'d','GET')
}
//获取用户的兴趣
export const getMyInterest = () => {
	return http(`/interest/my`,'d','GET')
}
//添加用户兴趣
export const addMyInterest = (interestId) => {
	return http(`/interest/add?interestId=${interestId}`,{},'POST')
}
//删除用户兴趣
export const deleteMyInterest = (interestId) => {
	return http(`/interest/${interestId}`,'d','DELETE')
}
// 博雅选课认证
export const boyaAuthentication = () => {
	return http(`/boya/authentication`,'d','POST')
}
//查询目前所有博雅课程
export const getBoyaCourse = (data) => {
	return http(`/boya/get-course`,data,'GET')
}
//直接选一门博雅课程
export const xuanBoya = (course_id) => {
	return http(`/boya/choose-course`,{course_id},'POST')
}
//查看所有已选的博雅课程
export const lookupYiXuan = () => {
	return http(`/boya/choose-course`,'d','GET')
}
//退选一门博雅课程
export const deleteBoya = (select_id) => {
	return http(`/boya/choose-course/${select_id}`,'d','DELETE')
}
//预约抢课
export const appointBoya = (course_id) => {
	return http(`/boya/appointment`,{course_id},'POST')
}
// 获取当前所有预约请求
export const getAppointList = () => {
	return http(`/boya/appointment`,'d','GET')
}
//撤销预约
export const cancelAppoint = (appointment_id) => {
	return http(`/boya/appointment/${appointment_id}`,'d','DELETE')
}



