//基本设置
import axios from 'axios';
import Vue from '../../main'
import ip from './const';

axios.defaults.baseURL = ip.IP; //请求的时候，baseURL+接口URL（不通过代理 需要解决跨域问题）
axios.defaults.timeout = 80000;//超时时间
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true; //允许跨域

/*
* 在axios配置文件里面加入拦截器
* 每次发起请求，拦截在这里
* */
axios.interceptors.request.use(config => {
  const headers = config.headers;
  let token = localStorage.getItem('token');
  if(token !== null){
    headers['token'] = token; //登录后，往头部添加token
  }
  // console.log(config);
  return config;

}, err => {
  Vue.$message.error('无法连接到服务器');
  return Promise.reject(err);
});

/*
* 添加响应拦截器，捕捉后台反馈
* */
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  Vue.$message.error('服务器异常');
  return Promise.reject(error);
});

export default axios;
