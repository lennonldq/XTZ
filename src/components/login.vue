<template>
  <div class="from">
    <!-- <el-input
      placeholder="请输入用户名"
      v-model="username"
      clearable
    >
    </el-input>

    <el-input
      placeholder="请输入密码"
      v-model="password"
      clearable
    >
    </el-input> -->
    <!-- <input
      type="text"
      v-model="username"
    /> -->
    <!-- <input
      type="password"
      v-model="password"
    /> -->
    <!-- <button @click="login">
      登录
    </button> -->
    <el-form
      class="elform"
      label-width="80px"
      :model="formLabelAlign"
    >
      <el-form-item label="用户名">
        <el-input v-model="formLabelAlign.username"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="pass"
      >
        <el-input
          type="password"
          v-model="formLabelAlign.password"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="login"
          class="denglu"
          size="medium"
          width="90%"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "login",
  data () {
    return {
      formLabelAlign: {
        username: '',
        password: '',
      },
      //   username: "t001",
      //   password: ""
    }
  },
  methods: {
    login () {
      this.$ajax.get(`http://124.172.243.65:8092/xtz/account/login?username=${this.formLabelAlign.username}&password=${this.formLabelAlign.password}`).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userTypeId", data.userTypeId);
          localStorage.setItem("schoolId", data.schoolId);
          this.$router.push("/talentSearch");
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
  width: 500px;
  /* height: 300px; */
  /* border: 1px solid rgb(99, 98, 98); */
  margin: 200px auto;
}
.elform {
  margin: 50px 10px;
}
.el-input {
    
    width: 80%;
}
 .el-button {
  width: 80%;
}
</style>
