<template>
  <div class="from">
    <div class="nar">
      <div class="logo1"><img
          src="../assets/images/logo1.jpg"
          alt=""
          style="    width: 200px;
    display: block;
    margin: 0 auto;"
        ></div>
      <div class="fromContent">
        <div class="wenzi"><img
            src="../assets/images/47.png"
            alt=""
            style="width: 250px;
            display: block;
             margin: 0 auto;"
          ></div>
        <div class="contentIpt">
          <span>用户名</span>
          <el-input
            v-model="formLabelAlign.username"
            clearable
          >
          </el-input>

        </div>
        <div class="contentIpt">
          <span>密&nbsp;&nbsp;&nbsp;码</span>
          <el-input
            type="password"
            v-model="formLabelAlign.password"
            auto-complete="off"
          ></el-input>
        </div>
        <div
          class="dl"
          style="    padding-left: 76px;"
        >
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { talentPortrait } from "../js/url"
export default {
  name: "login",
  data () {
    return {
      formLabelAlign: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login () {
      this.$ajax.get(`https://apprentice-server.etechedu.com/xtz/account/login?username=${this.formLabelAlign.username}&password=${this.formLabelAlign.password}`).then(res => {
        let data = JSON.parse(res.data);
        // 登录成功 把登录信息存储到localStorage
        if (data.code == 200) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userTypeId", data.userTypeId);
          localStorage.setItem("schoolId", data.schoolId);
          localStorage.setItem("classId", data.classId);
          localStorage.setItem("userId", data.userId);
          sessionStorage.setItem("photo", JSON.stringify(data.photo));
          // 判断当账号是学生时
          if (data.userTypeId == 0) {
            let userId = localStorage.getItem("userId");
            let classId = localStorage.getItem("classId");
            // 请求接口
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
              let routeData = this.$router.resolve({ path: "/integralPortrait", query: { classId: classId, userId: userId } });
              window.open(routeData.href, '_blank');
            })
          } else {
            this.$router.push("/talentSearch");
          }

        } else {
          alert('账号或密码不对')
        }

      })
    }
  }
}
</script>
<style scoped>
.from {
  margin: 130px auto;
  outline-color: invert;
  outline-style: none;
  outline-width: 0px;
  border: none;
  border-style: none;
  text-shadow: none;
  -webkit-appearance: none;
  -webkit-user-select: text;
  outline-color: transparent;
  box-shadow: none;
}
.from .nar .elform {
  width: 400px;
  height: 260px;
  border: 1px solid #c0c4cc;
  padding-top: 20px;
  margin: 0 auto;
}
.el-input {
  width: 80%;
}
.el-button {
  width: 80%;
}
.fromContent {
  width: 400px;
  height: 260px;
  border: 1px solid #c0c4cc;
  padding-top: 20px;
  margin: 0 auto;
}
.fromContent .contentIpt {
  display: flex;
  padding-bottom: 22px;
  width: 82%;
}
.fromContent .contentIpt > span {
  display: block;
  width: 65px;
  display: block;
  line-height: 40px;
  color: #606266;
  padding-left: 20px;
  font-size: 14px;
}
</style>