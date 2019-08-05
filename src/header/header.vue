<template>
  <el-header class="header">
    <div class="headerMain">
      <p class="logo"><img
          src="../assets/images/logo.png"
          alt=""
        > </p>
      <ul class="navList">
        <li>
          <a
            v-if="typeId==8"
            href="https://etech-edu.com/edu/cloudSchool"
          >返回首页</a>
          <a
            v-else-if="typeId==9"
            href="https://etech-edu.com/edu/cloudTeacher"
          >返回首页</a>
          <a
            v-else-if="typeId==0"
            href="https://etech-edu.com/edu/cloudStudent"
          >返回首页</a>
          <a
            v-else-if="typeId==3"
            href="https://etech-edu.com/edu/cloudEnterprise"
          >返回首页</a>
          <a
            v-else-if="typeId==1"
            href="https://etech-edu.com/edu/cloudAdmin"
          >返回首页</a>
        </li>
        <li>
          <a href="https://etech-edu.com/enterprise/index">企业服务</a>
        </li>
      </ul>

      <ul class="fotRit">
        <li
          v-for="(item,index) in jingList"
          :key="index"
          @click="tojing(item.path)"
        >{{item.title}}</li>
      </ul>
      <div class="phoBox">
        <!-- <p class="btn">下载APP</p> -->
        <!-- <p class="ling"> -->
        <!-- <span></span><span></span> -->
        <!-- </p> -->
        <el-dropdown
          class="but"
          @command="handleCommand"
        >
          <span class="el-dropdown-link">
            <i class="pho">
              <!-- <img
                v-if="baseInfo"
                :src="`https://etech-edu.com/${baseInfo}`"
                alt=""
              > -->
              <img
                v-if="baseInfo"
                :src="`https://etech-edu.com/${baseInfo}`"
                alt=""
              >
              <img
                v-else
                src="../assets/images/pho.png"
                alt=""
              >
            </i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>个人资料</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item> -->
            <el-dropdown-item command="退出">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

  </el-header>
</template>

<script>
export default {
  name: "Header",
  data () {
    return {
      // usertypeid:0,
      navList: [
        { title: "返回首页", path: "/talentSearch" },
        // { title: "企业服务", path: "/company" },
      ],
      jingList: [
        { title: "学校人才培养方案", path: "/company" },
        { title: "积分制规则说明", path: "/home" }
      ],
      baseInfo: '',
      typeId: ""
    }
  },
  created () {
    // this.init();
    this.getBaseInfo();
  },
  methods: {
    // init(){
    //      this.usertypeid =  localStorage.getItem("userTypeId");
    //        if(this.usertypeid == null){
    //           this.usertypeid=0
    //        }
    // },
    handleCommand () {
      localStorage.clear();
      sessionStorage.clear();
      this.typeId==8
             window.location.href="https://etech-edu.com/auth/login";
   
    },
    tojing (path) {
      let routeData = this.$router.resolve({ path });
      window.open(routeData.href, '_blank');
    },
    getBaseInfo () {
      
      // 图片
      this.baseInfo = JSON.parse(sessionStorage.getItem("photo"));
      console.log(this.baseInfo);
  
      this.typeId = localStorage.getItem("userTypeId");
      // this.$set(this,'baseInfo',JSON.parse(sessionStorage.getItem("photo")))
      console.log(this.$set(this, 'baseInfo', JSON.parse(sessionStorage.getItem("photo"))));
      console.log(this.typeId);
      
      // this.$set(this.baseInfo,JSON.parse(sessionStorage.getItem("photo")))
    },
  }
}
</script>
<style scoped>
.header {
  height: 82px !important;
  margin-bottom: 40px;
  box-shadow: 0 0 40px 2px #c8c6c6;
}
.header .headerMain {
  width: 1200px;
  margin: 0 auto;
  display: flex;
}
.header .headerMain .phoBox {
  float: right;
  display: flex;
  line-height: 82px;
}
.header .headerMain .phoBox .ling {
  height: 82px;
  width: 24px;
  margin: 0 20px;
  position: relative;
  background: url('../assets/images/ling.png') center no-repeat;
}
.header .headerMain .phoBox .ling span {
  display: block;
  position: absolute;
  width: 14px;
  height: 14px;
  line-height: 12px;
  text-align: center;
  background-color: red;
  color: #fff;
  top: 26px;
  right: -6px;
  font-size: 12px;
  border-radius: 50%;
}
.header .headerMain .phoBox .but {
  padding-top: 14px;
}
.header .headerMain .phoBox .but .el-dropdown-link .pho {
  display: block;
  height: 50px;
  width: 50px;
}
.header .headerMain .phoBox .but .el-dropdown-link .pho img {
  height: 50px;
  width: 50px;
  border-radius: 25px;
}
.header .headerMain .logo {
  width: 180px;
  height: 82px;
  float: left;
  padding-top: 12px;
}
.header .headerMain .logo img {
  width: 173px;
  height: 54px;
}
.header .headerMain .navList {
  display: flex;
  padding-left: 32px;
  float: left;
}
.header .headerMain .navList .is-active {
  color: #0187a2;
}

.header .navList li {
  color: #000000;
  padding: 0 40px;
  cursor: pointer;
  line-height: 82px;
}
.header .navList li a {
  text-decoration: none;
  color: #000000;
}
.header .navList li:nth-child(1) {
  background: url('../assets/images/home_act.png') 12px 30px no-repeat;
}
.header .navList li:nth-child(2) {
  background: url('../assets/images/com.png') 12px 30px no-repeat;
}
.header .headerMain .fotRit {
  display: flex;
  /* padding-right: 38px; */
  /* float: right; */
  padding-left: 42px;
}
.header .headerMain .fotRit .is-active {
  color: #0187a2;
}
.header .fotRit li {
  color: #000;
  padding: 0 40px;
  cursor: pointer;
  line-height: 82px;
}
.navList {
  width: 36%;
}
</style>
