<template>
  <div>
    <!-- <input type="text" v-model="username"/>
     <input type="password" v-model="password"/>
     <button @click="login">
        登录
     </button> -->
  </div>
</template>
<script>
import { talentPortrait } from "../js/url"
export default {
  name: "login",
  data () {
    return {
      theRequest: {}
    }
  },
  created () {

  },
  mounted () {
    this.login()
  },
  methods: {
    login () {
      var url = this.$route.query; //获取url中"?"符后的字串  
      this.theRequest = url
      // var theRequest = new Object();
      // console.log( theRequest );
      // if (url.indexOf("?") != -1) {
      //   var str = url.substr(1);
      //   strs = str.split("&");
      //   for (var i = 0; i < strs.length; i++) {
      //     this.theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      //   }
      // }
      var token = localStorage.getItem("accessToken");
      if (this.theRequest.naughty == undefined && this.theRequest.veryStrong == undefined && token == null) {
        //未登录 跳转到登录 	
        //   window.location.href = "http://120.25.66.101:7777/auth/login"
      }

      //跳转方登录   目标方未登录则异步登录
   
        //没有时间戳跳转到
        if (this.theRequest.v == undefined) {
          //  window.location.href = "http://120.25.66.101:7777/auth/login"
        } else {
          this.$ajax.get(`${this.baseUrl}new/login?naughty=${this.theRequest.naughty}&veryStrong=${this.theRequest.veryStrong}&v=${this.theRequest.v}`).then(res => {
            let data = JSON.parse(res.data);
            if (data.msg == "登录成功") {
              console.log(data);
              //登录成功 把登录信息存储 保存登录信息
              localStorage.setItem("accessToken", data.data.accessToken);
              localStorage.setItem("userTypeId", data.data.userTypeId);
              localStorage.setItem("schoolId", data.data.schoolId);
              localStorage.setItem("classId", data.data.classId);
              localStorage.setItem("userId", data.data.userId);
              sessionStorage.setItem("photo", JSON.stringify(data.data.photo));
              if (data.data.userTypeId == 0) {
                let userId = localStorage.getItem("userId");
                let classId = localStorage.getItem("classId");
                this.$ajax(this.baseUrl + talentPortrait, {
                  headers: {
                    accessToken: localStorage.getItem("accessToken")
                  },
                  params: {
                    userId: userId
                  }
                }).then(res => {
                  let data = JSON.parse(res.data)
                  sessionStorage.setItem("info", JSON.stringify(data.data[0]));
                  this.$router.push({ path: "/integralPortrait", query: { classId: classId, userId: userId } });
                })
              } else {
                this.$router.push("/talentSearch");
              }
              // //成功跳转到指定页
              // if (this.theRequest.toUrl != undefined) {
              //   // window.location.href = this.theRequest.toUrl
              // } else {
              //   //跳转到首页
              //   // window.location.href = "http://120.25.66.101:7777"
              // }
            } else {
              //首页或登录页
              //  window.location.href = "http://120.25.66.101:7777/auth/login"
              alert(data.msg)
            }
          })
        }
    
    }
  }
}
</script>