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
Vue.use(Router)
let router =  new Router({
  linkActiveClass:"is-active",
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/loginTwo',
      name: 'Logintwo',
      component: Logintwo
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta:{
        auth:true
      }
    },
    {
      path: '/company',
      name: 'Company',
      component: Company,
      meta:{
        auth:true
      }
    },
    {
      path:"/integralPortrait",
      name: 'IntegralPortrait',
      component: IntegralPortrait,
      meta:{
        auth:true
      }
    },
    {
      path: '/portrait',
      component:Portrait,
      meta:{
        auth:true,
      },
      children:[
        {
          path:"compositePortrait",
          name:"CompositePortrait",
          component:CompositePortrait
        },{
          path:"coursePortrait",
          name:"CoursePortrait",
          component:CoursePortrait
        },{
          path:"practicalPortrait",
          name:"PracticalPortrait",
          component:PracticalPortrait
        },{
          path:"actualPortrait",
          name:"ActualPortrait",
          component:ActualPortrait
        },{
          path:"apprenticeshipPortrait",
          name:"ApprenticeshipPortrait",
          component:ApprenticeshipPortrait
        },{
          path:"entrepreneurialPortrait",
          name:"EntrepreneurialPortrait",
          component:EntrepreneurialPortrait
        },{
          path:'employmentPortrait',
          name:"EmploymentPortrait",
          component:EmploymentPortrait
        },{
          path:"taskPortrait",
          name:"TaskPortrait",
          component:TaskPortrait
        },{
          path:"certifiedPortrai",
          name:"CertifiedPortrai",
          component:CertifiedPortrai
        },{
          path:"competitionPortrait",
          name:"CompetitionPortrait",
          component:CompetitionPortrait
        }
      ]
    },
    {
      path: '/talentSearch',
      name: 'TalentSearch',
      component: TalentSearch,
      meta:{
        auth:true,
        keepAlive:true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)){  // 判断该路由是否需要登录权限
    if (localStorage.getItem("userTypeId")) {  // 判断当前的userTypeId是否存在
      next();
    }
    else {
      next({
        path: '/login',
      })
    }
  }
  else {
    next();
  }
});
export default router
