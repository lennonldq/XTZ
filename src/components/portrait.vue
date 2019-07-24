<template>
    <el-main>
       <div class="container">
             <Aside class="aside"></Aside>
             <div class="containBox">
               <transition name="fade">
                 <router-view :baseInfo="baseInfo"></router-view>
               </transition>
             </div>
       </div>
    </el-main>
</template>

<script>
    import Aside from "../aside/aside"
    import CompositePortrait from "../portrait/compositePortrait"
    export default {
       name:"Portrait",
       data(){
         return{
           baseInfo:{
             classname:"",
             username:"",
             schoolname:""
           },
         }
       },
      created(){
         this.getBaseInfo()
      },
      methods:{
        getBaseInfo(){ // 基本信息
          let info = JSON.parse(sessionStorage.getItem("info"));
          this.baseInfo.username = info.username + '同学';
          this.baseInfo.schoolname = info.schoolname;
          this.baseInfo.classname = info.classname;
          this.baseInfo.photo = info.photo;
        },
      },
       components:{
         Aside,
         CompositePortrait
       },
    }
</script>
<style scoped>
  .mainWarp{
     border-radius: 0;
     box-shadow: none;
     overflow: visible;
  }
  .container{
     display: flex;
     position: relative;
  }
  .container .aside{
     width: 180px;
     margin-right: 40px;
     box-shadow: 0 0 18px 0px #c8c6c6;
  }
  .container .containBox{
    flex: 1;
    position: relative;

  }
  .container .containBox .main{
     top:0
  }

 </style>
