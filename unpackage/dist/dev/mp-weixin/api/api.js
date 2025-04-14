"use strict";
const api_http = require("./http.js");
require("../stores/user.js");
const getIndexList = () => {
  return api_http.http("/test/hello", "d", "GET");
};
const login = (code) => {
  return api_http.http("/user/wxLogin", { code }, "POST");
};
const getUserInfo = () => {
  return api_http.http("/user/info", "d", "GET");
};
const modifyUserInfo = (data) => {
  return api_http.http("/user", { data }, "PUT");
};
const sendVerifyCode = (data) => {
  return api_http.http("/verify", data, "POST");
};
const yanzheng = (data) => {
  return api_http.http("/user/verify", data, "POST");
};
const searchList = async (params) => {
  return null;
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
exports.addSign = addSign;
exports.deleteSign = deleteSign;
exports.getCourseInfo = getCourseInfo;
exports.getIndexList = getIndexList;
exports.getSign = getSign;
exports.getUserInfo = getUserInfo;
exports.login = login;
exports.modifyUserInfo = modifyUserInfo;
exports.searchList = searchList;
exports.sendVerifyCode = sendVerifyCode;
exports.signClass = signClass;
exports.yanzheng = yanzheng;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/api.js.map
