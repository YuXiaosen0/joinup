"use strict";
const api_http = require("./http.js");
require("../stores/user.js");
const getTeamList = (themeId) => {
  return api_http.http(`/team/list?themeId=${themeId}`, {
    "pageNo": 1,
    "pageSize": 100,
    "isAsc": true,
    "sortBy": "name"
  }, "POST");
};
const getThemeList = () => {
  return api_http.http(`/theme/list`, "", "GET");
};
const getTeamDetails = (teamId) => {
  return api_http.http(`/team/${teamId}`, "", "GET");
};
const getSwiperList = () => {
  return api_http.http(`/message/announcement/list`, "", "GET");
};
const getAnnouncementDetails = (announcementId) => {
  return api_http.http(`/message/announcement/${announcementId}`, "", "GET");
};
const applyToJoin = (teamId, joinReason) => {
  return api_http.http(`/team/${teamId}/join/apply`, { "reason": joinReason }, "POST");
};
const getApplicationList = (teamId) => {
  return api_http.http(`/team/${teamId}/join/list`, "", "GET");
};
const processApplication = (teamId, applicationId, action, comment) => {
  return api_http.http(`/team/${teamId}/join/review/${applicationId}`, {
    "action": action,
    "comment": comment
  }, "POST");
};
const leaveTeamApi = (teamId) => {
  return api_http.http(`/team/${teamId}/leave`, "", "POST");
};
const judgeRole = (teamId) => {
  return api_http.http(`/team/${teamId}/role`, "", "GET");
};
const kickMember = (teamId, userId) => {
  return api_http.http(`/team/${teamId}/kick/${userId}`, "", "POST");
};
const searchTeam = async (searchString) => {
  return api_http.http(`/team/search?keyword=${searchString.keyward}`, { searchString }, "GET");
};
const login = (code) => {
  return api_http.http("/user/wxLogin", { code }, "POST");
};
const getUserInfo = () => {
  return api_http.http("/user/info", "d", "GET");
};
const modifyUserInfo = (data) => {
  return api_http.http("/user", data, "PUT");
};
const sendVerifyCode = (data) => {
  return api_http.http("/verify", data, "POST");
};
const yanzheng = (data) => {
  return api_http.http("/user/verify", data, "POST");
};
const signClass = (id) => {
  return api_http.http(`/course/sign?courseScheduleId=${id}`, "r", "POST");
};
const getCourseInfo = (data) => {
  return api_http.http(`/course/list?date=${data}`, "d", "GET");
};
const getSign = (status) => {
  return api_http.http(`/course/task/list?status=${status}`, "d", "GET");
};
const addSign = (courseId) => {
  return api_http.http(`/course/task/add`, { courseId }, "POST");
};
const deleteSign = (Id) => {
  return api_http.http(`/course/task/${Id}`, "r", "DELETE");
};
const getSignRecord = (data) => {
  return api_http.http(`/course/log`, data, "POST");
};
const listAll = () => {
  return api_http.http(`/interest/all`, "d", "GET");
};
const getMyInterest = () => {
  return api_http.http(`/interest/my`, "d", "GET");
};
const addMyInterest = (interestId) => {
  return api_http.http(`/interest/add?interestId=${interestId}`, {}, "POST");
};
const deleteMyInterest = (interestId) => {
  return api_http.http(`/interest/${interestId}`, "d", "DELETE");
};
const boyaAuthentication = () => {
  return api_http.http(`/boya/authentication`, "d", "POST");
};
const feedback = (data) => {
  return api_http.http(`/message/feedback/add`, data, "POST");
};
exports.addMyInterest = addMyInterest;
exports.addSign = addSign;
exports.applyToJoin = applyToJoin;
exports.boyaAuthentication = boyaAuthentication;
exports.deleteMyInterest = deleteMyInterest;
exports.deleteSign = deleteSign;
exports.feedback = feedback;
exports.getAnnouncementDetails = getAnnouncementDetails;
exports.getApplicationList = getApplicationList;
exports.getCourseInfo = getCourseInfo;
exports.getMyInterest = getMyInterest;
exports.getSign = getSign;
exports.getSignRecord = getSignRecord;
exports.getSwiperList = getSwiperList;
exports.getTeamDetails = getTeamDetails;
exports.getTeamList = getTeamList;
exports.getThemeList = getThemeList;
exports.getUserInfo = getUserInfo;
exports.judgeRole = judgeRole;
exports.kickMember = kickMember;
exports.leaveTeamApi = leaveTeamApi;
exports.listAll = listAll;
exports.login = login;
exports.modifyUserInfo = modifyUserInfo;
exports.processApplication = processApplication;
exports.searchTeam = searchTeam;
exports.sendVerifyCode = sendVerifyCode;
exports.signClass = signClass;
exports.yanzheng = yanzheng;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/api.js.map
