<template>
    <el-header class="header">
      <div class="headerMain">
          <p class="logo"></p>
          <ul class="navList">
            <router-link v-for="item,index in navList" tag="li" :key="index" :to="item.path">
              {{ item.title }}
            </router-link>
          </ul>
          <div class="phoBox">
             <p class="btn">下载APP</p>
             <p class="ling"><span>1</span></p>
             <p class="pho"></p>
          </div>
      </div>
    </el-header>
</template>

<script>
    export default {
       name:"Header",
       data(){
          return{
             navList:[
               {title:"返回首页",path:"/talentSearch"},
               {title:"企业服务",path:"/company"},
             ]
          }
       }
    }
</script>
<style scoped>
  .header{
     height: 82px !important;
     margin-bottom: 40px;
     box-shadow: 0 0 40px 2px #c8c6c6;
  }
  .header .headerMain{
    width: 1200px;
    margin: 0 auto;
  }
  .header .headerMain .phoBox{
    float: right;
    display: flex;
    line-height: 82px;
  }
  .header .headerMain .phoBox .ling{
    height: 82px;
    width: 24px;
    margin:0 20px;
    position: relative;
    background: url("../assets/images/ling.png") center no-repeat;
  }
  .header .headerMain .phoBox .ling span{
    display: block;
    position: absolute;
    width: 14px;
    height: 14px;
    line-height: 12px;
    text-align: center;
    background-color: red;
    color: #fff;
    top: 26px;
    right:-6px;
    font-size: 12px;
    border-radius: 50%;
  }
  .header .headerMain .phoBox .pho{
    width: 49px;
    background: url("../assets/images/pho.png") center no-repeat;
  }
  .header .headerMain .logo{
     width: 174px;
     height: 82px;
     float: left;
     background: url("../assets/images/logo.png") center no-repeat;
  }
  .header .headerMain .navList{
    display: flex;
    padding-left: 38px;
    float: left;
  }
  .header .headerMain .navList .is-active{
     color: #0187a2;
  }

  .header .navList li{
     color:#000;
     padding: 0 40px;
     cursor: pointer;
     line-height: 82px;
  }
  .header .navList li:nth-child(1){
     background: url("../assets/images/home_act.png") 12px 30px no-repeat;
  }
  .header .navList li:nth-child(2){
    background: url("../assets/images/com.png") 12px 30px no-repeat;
  }
</style>
