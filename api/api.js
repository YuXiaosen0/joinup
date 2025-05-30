import http from "./http";
export const getTeamList = ( themeId ) => {
  return http(`/team/list?themeId=${themeId}`, {
    "pageNo": 1,
    "pageSize": 100,
    "isAsc": true,
    "sortBy": "name"
	}, 'POST')
}
// 获取主题列表
export const getThemeList = () => {
	return http(`/theme/list`, '', 'GET')
}

// 获取队伍详情
export const getTeamDetails = (teamId) => {
	return http(`/team/${teamId}`, '', 'GET')
}

// 获取公告（轮播图）列表
export const getSwiperList = () => {
	return http(`/message/announcement/list`, '', 'GET')
}

// 获取公告详情
export const getAnnouncementDetails = (announcementId) => {
	return http(`/message/announcement/${announcementId}`, '', 'GET')
}

//申请加入队伍
export const applyToJoin = (teamId, joinReason) => {
  return http(`/team/${teamId}/join/apply`, { "applicationMessage":joinReason }, 'POST')
}

// 获取申请列表
export const getApplicationList = (teamId) => {
	return http(`/team/${teamId}/join/list`, '', 'GET')
}

// 审批加入请求 0同意 1拒绝
export const processApplication = (teamId, applicationId, action, comment) => {
	return http(`/team/${teamId}/join/review/${applicationId}`, {
		"action": action,
		"comment": comment
	  }, 'POST')
}

// 退出队伍
export const leaveTeamApi = (teamId) => {
	return http(`/team/${teamId}/leave`, '', 'POST')
}

// 判断身份
export const judgeRole = (teamId) => {
	return http(`/team/${teamId}/role`, '', 'GET')
}

// 踢出成员
export const kickMember = (teamId, userId) => {
	return http(`/team/${teamId}/kick/${userId}`, '', 'POST')
}

export const searchTeam = async (searchString) => {
  return http(`/team/search?keyword=${searchString}`, '', 'GET')
};

// 创建标签
export const applyCreateTag = (name, description) => {
  return http(`/tag/apply`, {
	  "name":name,
	  "description":description
  }, 'POST')
}

//修改队伍信息
export const modifyTeam = (teamId, name, description, open, maxMembers, cover) => {
  return http(`/team/${teamId}`, {
	  "name":name,
	  "description":description,
	  "open":open,
	  "maxMembers":maxMembers,
	  "cover":cover
  }, 'PUT')
}

// 上传浏览记录
export const uploadBrowse = (teamId) => {
	return http(`/team/${teamId}/browse`, '', 'POST')
}

//获取浏览记录
export const getBrowse = () => {
	return http(`/team/browse`, '', 'GET')
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
  return http(`/boya/authentication/`,'d','POST')
}
//查询目前所有博雅课程
export const getBoyaCourse = (data) => {
	return http(`/boya/get-course/`,data,'POST')
}
//直接选一门博雅课程
export const xuanBoya = (course_id) => {
	return http(`/boya/choose-course/`,course_id,'POST')
}
//查看所有已选的博雅课程
export const lookupYiXuan = () => {
	return http(`/boya/choose-course/`,'d','GET')
}
//退选一门博雅课程
export const deleteBoya = (select_id) => {
	return http(`/boya/choose-course/${select_id}/`,'d','DELETE')
}
//预约抢课
export const appointBoya = (data) => {
	return http(`/boya/appoint-course/`,data,'POST')
}
// 获取当前所有预约请求
export const getAppointList = () => {
	return http(`/boya/appoint-course/`,'d','GET')
}
//撤销预约
export const cancelAppoint = (appointment_id) => {
	return http(`/boya/appoint-course/${appointment_id}/`,'d','DELETE')
}
//用户提交反馈
export const feedback = (data) => {
	return http(`/message/feedback/add`,data,'POST')
}
//创建新的队伍
export const createNewTeam = (data) => {
	return http('/team/add',data,'POST')
}
//解散已有的队伍, 传入队伍id
export const deleteTeam = (teamId) => {
	return http(`/team/${teamId}`,'r','DELETE')
}
//推出已有的队伍, 传入队伍id
export const quitTeam = (teamId) => {
	return http(`/team/${teamId}/leave`,{},'POST')
}	
//获取与用户有关的队伍
export const getMyTeam = (role) => {
	return http('/team/my/list',role,'GET')
}
//获取用户收到的消息
export const getMyMessage = (data) => {
	return http('/message/site/list',data,'GET')
}
//将消息标记为已读
export const markMessageRead = (messageId) => {
	return http(`/message/site/read/${messageId}`,'r','POST')
}
//删除已有消息
export const deleteMessage = (id) => {
	return http(`/message/site/${id}`,'r','DELETE')
}
//获取所有标签
export const getAllTags = () => {
	return http(`/tag/list`, 'd', 'GET')
}
//获取新的token
export const getNewToken = () => {
	return http(`/user/refreshToken`, 'd', 'GET')
}
//上传文件
export const uploadFile=(file) => {
	return http(`/oss/file/upload`, file, 'POST')
}

export const updateToken = async () => {
  try {
    const res = await getNewToken()
	console.log('获取新的token:')
    if (res) {
		console.log(res)
      // 更新本地存储的token
      uni.setStorageSync('token', res.token)
	  console.log('更新token成功:', uni.getStorageSync('token'))
      return true
    }
    return false
  } catch (error) {
    console.error('更新token失败:', error)
    return false
  }
  }
//分页获取会话列表
export const getListByPage=(num,size) => {
	return http(`/conversation/list?type&pageNumber=${num}&pageSize=${size}`,'d' , 'GET')
}
//获取会话的聊天记录
export const getConversionRecord=(conversationId,lastSelectId,pageSize) => {
	return http(`/message/chat/${conversationId}?lastSelectId=${lastSelectId}&pageSize=${pageSize}`,'d' , 'GET')
}
//发起会话
export const faQiConversation=(userId) => {
	return http(`/conversation/create?userId=${userId}`,'d' , 'POST')
}
//发起会话
export const faQiDuiWuConversation=(teamId) => {
	return http(`/conversation/create?teamId=${teamId}`,'d' , 'POST')
}
//清零未读信息数目
export const clearUnread=(conversationId) => {
	return http(`/conversation/${conversationId}/read`,'d' , 'POST')
}
//获取会话详情
export const getConDetail=(conversationId) => {
	return http(`/conversation/${conversationId}`,'d' , 'GET')
}
//消息记录查询
export const searchMessagesApi=(conversationId,data) => {
	return http(`/message/chat/${conversationId}/filter`,data , 'POST')
}
// //通知后端所在的会话id
// export const noticeId=(conversationId) => {
// 	return http(`/conversation/noticeId`,conversationId , 'POST')
// }
// //likai
// export const clearUn=() => {
// 	return http(`/conversation/exit`,'d' , 'DELETE')
// }

