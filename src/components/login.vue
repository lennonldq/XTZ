<template>
  <div>
     <input type="text" v-model="username"/>
     <input type="password" v-model="password"/>
     <button @click="login">
        登录
     </button>
  </div>
</template>
<script>
  export default {
     name:"login",
     data(){
       return{
         username:"t001",
         password:""
       }
     },
     methods:{
       login(){
          this.$ajax.get(`http://124.172.243.65:8096/xtz/account/login?username=${this.username}&password=${this.password}`).then(res=>{
              let data = JSON.parse(res.data);
              if(data.code == 200){
                 localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("userTypeId",data.userTypeId);
                localStorage.setItem("schoolId",data.schoolId);
                this.$router.push("/talentSearch");
             }else{
                 alert('账号或密码不对')
             }

          })
       }
     }
  }
</script>
