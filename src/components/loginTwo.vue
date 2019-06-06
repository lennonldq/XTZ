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
export default {
  name: "login",
  data () {
    return {
      theRequest: {}
    }
  },
  created () {

  },
  mounted(){
         this.login()
  },
  methods: {
    login () {
      var url = this.$route.query; //获取url中"?"符后的字串  
      
      console.log(url);
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
      console.log( this.theRequest );
        console.log(this.theRequest.naughty);
      var token = localStorage.getItem("accessToken");
      if (this.theRequest.naughty == undefined && this.theRequest.veryStrong == undefined && token == null) {
       
        //未登录 跳转到登录 	
      //   window.location.href = "http://120.25.66.101:7777/auth/login"
      }

      //跳转方登录   目标方未登录则异步登录
      if (this.theRequest.naughty != undefined && this.theRequest.veryStrong != undefined && token == null) {
        //没有时间戳跳转到
        if (this.theRequest.v == undefined) {
         //  window.location.href = "http://120.25.66.101:7777/auth/login"
        } else {
         //  
         console.log(this.theRequest.naughty);
         
           this.$ajax.get(`http://124.172.243.65:8092/new/login?naughty=${this.theRequest.naughty}&veryStrong=${this.theRequest.veryStrong}&v=${this.theRequest.v}`).then(res=>{
              let data = JSON.parse(res.data);
              console.log(data);
              console.log(data.msg);
              if(data.msg == "登录成功"){
               //保存登录信息
                // sessionStorage.setItem("token", data.data.accessToken);
                  localStorage.setItem("accessToken", data.data.accessToken);
                localStorage.setItem("userTypeId",data.data.userTypeId);
                localStorage.setItem("schoolId",data.data.schoolId);
                this.$router.push("/talentSearch");

               //  console.log(data.accessToken);
                
                // //成功跳转到指定页
                // if (this.theRequest.toUrl != undefined) {
                //   // window.location.href = this.theRequest.toUrl
                // } else {
                //   //跳转到首页
                //   // window.location.href = "http://120.25.66.101:7777"
                // }
             }else{
                 //首页或登录页
               //  window.location.href = "http://120.25.66.101:7777/auth/login"
             }

          })
        }
      }


      //跳转方和目标方 都登录  转到目标url
      if (this.theRequest.naughty != undefined && this.theRequest.veryStrong != undefined && token != null) {
       this.$router.push("/talentSearch");
      }
      //跳转方为登录 目标方 都登录  转到目标url
      if (this.theRequest.naughty == undefined && this.theRequest.veryStrong == undefined && token != null) {
       this.$router.push("/talentSearch");
      }
    }
  }
}
</script>