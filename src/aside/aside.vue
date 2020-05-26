<template>
  <aside>
    <ul class="menuList">
      <router-link tag="li"
                   v-for="(item,index) in menuList"
                   :key="index"
                   :to="{path:item.path,query:{classId:$route.query.classId,userId:$route.query.userId}}">
        {{ item.title }}
      </router-link>
    </ul>
  </aside>
</template>
<script>
export default {
  data() {
    return {
      inx: 0,
      menuList: [
        {
          path: "/portrait/compositePortrait",
          title: "综合画像"
        },
        {
          path: "/portrait/coursePortrait",
          title: "课程画像"
        },
        {
          path: "/portrait/practicalPortrait",
          title: "实验实训画像"
        },
        {
          path: "/portrait/actualPortrait",
          title: "实战运营画像"
        },
        // {
        //   path: "/portrait/apprenticeshipPortrait",
        //   title: "益企学画像"
        // },
        {
          path: "/portrait/entrepreneurialPortrait",
          title: "创业画像"
        },
        {
          path: "/portrait/employmentPortrait",
          title: "实习就业画像"
        },
        {
          path: "/portrait/taskPortrait",
          title: "任务外包画像"
        },
        {
          path: "/portrait/certifiedPortrai",
          title: "认证画像"
        },
        {
          title: "竞赛画像",
          path: "/portrait/competitionPortrait"
        }
      ]
    };
  }
};
</script>
<style scope>
.menuList li {
  height: 80px;
  line-height: 80px;
  text-indent: 58px;
  color: #444444;
  transition: all 0.4s;
  cursor: pointer;
  font-weight: bold;
  border-left: 10px solid #fff;
  background-position: 24px center;
  background-repeat: no-repeat;
}
.menuList li:nth-child(1) {
  background-image: url("../assets/images/01.png");
}
.menuList li:nth-child(1)[class="router-link-exact-active is-active"] {
  background-image: url("../assets/images/01_act.png");
}
.menuList li:nth-child(2) {
  background-image: url("../assets/images/02.png");
}
.menuList li:nth-child(2)[class="router-link-exact-active is-active"] {
  background-image: url("../assets/images/02_act.png");
}
.menuList li:nth-child(3) {
  background-image: url("../assets/images/03.png");
}
.menuList li:nth-child(3)[class="router-link-exact-active is-active"] {
  background-image: url("../assets/images/03_act.png");
}
.menuList li:nth-child(4) {
  background-image: url("../assets/images/04.png");
}
.menuList li:nth-child(4)[class="router-link-exact-active is-active"] {
  background-image: url("../assets/images/04_act.png");
}
.menuList li:nth-child(5) {
  background-image: url("../assets/images/05.png");
}
.menuList li:nth-child(5)[class="router-link-exact-active is-active"] {
  background-image: url("../assets/images/05_act.png");
}
.menuList li:nth-child(6) {
  background-image: url("../assets/images/06.png");
}
.menuList li:nth-child(6)[class="router-link-exact-active is-active"] {
  background-image: url("../assets/images/06_act.png");
}
.menuList li:nth-child(7) {
  background-image: url("../assets/images/07.png");
}
.menuList li:nth-child(7)[class="router-link-exact-active is-active"] {
  background-image: url("../assets/images/07_act.png");
}
.menuList li:nth-child(8) {
  background-image: url("../assets/images/08.png");
}
.menuList li:nth-child(8)[class="router-link-exact-active is-active"] {
  background-image: url("../assets/images/08_act.png");
}
.menuList li:nth-child(9) {
  background-image: url("../assets/images/09.png");
}
.menuList li:nth-child(9)[class="router-link-exact-active is-active"] {
  background-image: url("../assets/images/09_act.png");
}
.menuList li:nth-child(10) {
  background-image: url("../assets/images/10.png");
}
.menuList li:nth-child(10)[class="router-link-exact-active is-active"] {
  background-image: url("../assets/images/10_act.png");
}
.menuList .is-active {
  border-left: 10px solid #10859d;
  color: #10859d;
}
</style>
