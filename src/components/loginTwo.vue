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
import { talentPortrait } from "../js/url";
export default {
  name: "login",
  data() {
    return {
      theRequest: {},
    };
  },
  created() {},
  mounted() {
    this.login();
  },
  methods: {
    login() {
      var url = this.$route.query; //获取url中"?"符后的字串
      this.theRequest = url;
      console.log(url);
      //跳转方登录   目标方未登录则异步登录
      //没有时间戳跳转到
      if (this.theRequest.accessToken == undefined) {
        window.location.href = "http://profession.etechedu.com/#/login";
      } else {
        console.log(this.theRequest.accessToken);
        localStorage.setItem("accessToken", this.theRequest.accessToken);
        this.$ajax
          .get(`https://apprentice-server.etechedu.com/new/getUserInfo`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            let data = JSON.parse(res.data);
            if (data.code == 200) {
              //登录成功 把登录信息存储 保存登录信息
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
                    accessToken: localStorage.getItem("accessToken"),
                  },
                  params: {
                    userId: userId,
                  },
                }).then((res) => {
                  let data = JSON.parse(res.data);
                  sessionStorage.setItem("info", JSON.stringify(data.data[0]));
                  this.$router.push({
                    path: "/integralPortrait",
                    query: { classId: classId, userId: userId },
                  });
                });
              } else {
                this.$router.push("/talentSearch");
              }
            } else {
              //首页或登录页
              window.location.href = "http://profession.etechedu.com/#/login";
              alert(data.msg);
            }
          });
      }
    },
  },
};
</script>