import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'

Vue.use(Router);

export default new Router({ //【路由，项目根目录'/'】
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})
