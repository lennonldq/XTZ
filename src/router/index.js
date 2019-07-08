import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login' //登录页
import Logintwo from '@/components/loginTwo' //登录页
import Home from '@/components/home' //首页
import Company from '@/components/company' // 企业
import IntegralPortrait from '@/components/integralPortrait' //积分画像
import Portrait from '@/components/portrait' //放所有画像的组件
import TalentSearch from '@/components/talentSearch' // 人才搜索

//画像部分路由
import CompositePortrait from "../portrait/compositePortrait"            //综合画像
import CoursePortrait from "../portrait/coursePortrait"                  //课程画像
import PracticalPortrait from "../portrait/practicalPortrait"            //实验实训画像
import ActualPortrait from "../portrait/actualPortrait"                  //实战运营画像
import ApprenticeshipPortrait from "../portrait/apprenticeshipPortrait"  //学徒制画像
import EntrepreneurialPortrait from "../portrait/entrepreneurialPortrait" //创业画像
import EmploymentPortrait from "../portrait/employmentPortrait" //实训就业画像
import TaskPortrait  from "../portrait/taskPortrait.vue" //企业任务画像
import CertifiedPortrai from "../portrait/certifiedPortrai" //认证画像
import CompetitionPortrait from "../portrait/competitionPortrait" //竞赛画像
// import { resolve } from 'dns';
Vue.use(Router)
let router =  new Router({
  linkActiveClass:"is-active",
  routes: [
    {path:'/',
    name:"主页面",
    redirect:'/login'
  },
    {
      path: '/login',
      name: 'Login',
      component:(resolve)=>require(['@/components/login'],resolve)
    },
    {
      path: '/loginTwo',
      name: 'Logintwo',
      component: resolve=>require(['@/components/loginTwo'],resolve)
    },
    {
      path: '/home',
      name: 'Home',
      component:  resolve=>require(['@/components/home'],resolve),
      meta:{
        auth:true,
        requireAuth: true,
      }
    },
    {
      path: '/company',
      name: 'Company',
      component:  resolve=>require(['@/components/company'],resolve),
      meta:{
        auth:true, requireAuth: true,
      }
    },
    {
      path:"/integralPortrait",
      name: 'IntegralPortrait',
      component:  resolve=>require(['@/components/integralPortrait'],resolve),
      meta:{
        auth:true, requireAuth: true,
        title: '职业画像'
      }
    },
    {
      path: '/portrait',
      component: resolve=>require(['@/components/portrait'],resolve),
      meta:{
        auth:true, requireAuth: true,
      },
      children:[
        {
          path:"compositePortrait",
          name:"CompositePortrait",
          component: resolve=>require(['../portrait/compositePortrait'],resolve)
        },{
          path:"coursePortrait",
          name:"CoursePortrait",
          component:resolve=>require(['../portrait/coursePortrait'],resolve)
        },{
          path:"practicalPortrait",
          name:"PracticalPortrait",
          component:resolve=>require(['../portrait/practicalPortrait'],resolve)
        },{
          path:"actualPortrait",
          name:"ActualPortrait",
          component:resolve=>require(['../portrait/actualPortrait'],resolve)
        },{
          path:"apprenticeshipPortrait",
          name:"ApprenticeshipPortrait",
          component:resolve=>require(['../portrait/apprenticeshipPortrait'],resolve)
        },{
          path:"entrepreneurialPortrait",
          name:"EntrepreneurialPortrait",
          component:resolve=>require(['../portrait/entrepreneurialPortrait'],resolve)
        },{
          path:'employmentPortrait',
          name:"EmploymentPortrait",
          component:resolve=>require(['../portrait/employmentPortrait'],resolve)
        },{
          path:"taskPortrait",
          name:"TaskPortrait",
          component:resolve=>require(['../portrait/taskPortrait'],resolve)
        },{
          path:"certifiedPortrai",
          name:"CertifiedPortrai",
          component:resolve=>require(['../portrait/certifiedPortrai'],resolve)
        },{
          path:"competitionPortrait",
          name:"CompetitionPortrait",
          component:resolve=>require(['../portrait/competitionPortrait'],resolve)
        }
      ]
    },
    {
      path: '/talentSearch',
      name: 'TalentSearch',
      component: resolve=>require(['@/components/talentSearch'],resolve),
      meta:{
        auth:true,
        keepAlive:false
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + '-'+JSON.parse(sessionStorage.getItem("info")).username
    }
  // console.log(to,from,next);

  if (to.matched.some(record => record.meta.auth)){  // 判断该路由是否需要登录权限
    if (localStorage.getItem("userTypeId")) {  // 判断当前的userTypeId是否存在
      next();
    }
    else {
      console.log( next());
      next({
        path: '/login',
      })
      console.log( next());
    }
  }
  else {
    next()
  }
});
export default router
