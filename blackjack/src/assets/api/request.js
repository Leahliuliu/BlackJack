//请求
import axios from './base'
import url from './url'

/*
* 【玩家注册】
* */
export function register(username, password, verifyCode) {
  return axios.post(url.REGISTER, {username: username, password: password}, {headers: {verifyCode: verifyCode}})
    .then(data => data.data);
}

/*
* 玩家登录
* */
export function login(username, password) {
  return axios.post(url.LOGIN, {username: username, password: password})
    .then(data => data.data);
}

/*
* 退出登录
* */
export function exit() {
  return axios.post(url.EXIT, {})
    .then(data => data.data);
}

/*
* 更新玩家得分
* */
export function updateGrade(grade) {
  return axios.post(url.UPDATEGRADE, {grade: grade})
    .then(data => data.data);
}

/*
* 玩家修改密码
* */
export function updatePassword(password) {
  return axios.post(url.UPDATEPASSWORD, {password: password})
    .then(data => data.data);
}


