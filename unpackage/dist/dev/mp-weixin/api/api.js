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
  return api_http.http(`/team/search?keyword=${searchString}`, { searchString }, "GET");
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
const getSignRecord = (data) => {
  return api_http.http(`/course/log`, data, "POST");
};
exports.applyToJoin = applyToJoin;
exports.getAnnouncementDetails = getAnnouncementDetails;
exports.getApplicationList = getApplicationList;
exports.getSignRecord = getSignRecord;
exports.getSwiperList = getSwiperList;
exports.getTeamDetails = getTeamDetails;
exports.getTeamList = getTeamList;
exports.getThemeList = getThemeList;
exports.getUserInfo = getUserInfo;
exports.judgeRole = judgeRole;
exports.kickMember = kickMember;
exports.leaveTeamApi = leaveTeamApi;
exports.login = login;
exports.modifyUserInfo = modifyUserInfo;
exports.processApplication = processApplication;
exports.searchTeam = searchTeam;
exports.sendVerifyCode = sendVerifyCode;
exports.yanzheng = yanzheng;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/api.js.map
