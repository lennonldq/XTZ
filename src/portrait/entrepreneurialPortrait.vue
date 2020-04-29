<template>
  <div class="main">
    <div class="header">
      <div class="titleBox">
        <div>
          <img v-if="baseInfo.photo"
               :src="`https://etech-edu.com/${baseInfo.photo}`"
               alt="">
          <img v-else
               src="../assets/images/pho.png"
               alt="">
        </div>
        <p>{{ baseInfo.username }}</p>
        <p>{{ baseInfo.schoolname }}</p>
        <p>{{ baseInfo.classname }}</p>
      </div>
      <router-link tag="button"
                   :to="{path:'/integralPortrait',query:{classId:$route.query.classId,userId:$route.query.userId}}">
        返回上页
      </router-link>
      <div class="synchronization"
           @click="synchronization()">
        <div class="one">同步数据</div>
        <div class="two"
             v-if="gtime">上次同步:{{gtime | gTime}} </div>
      </div>
    </div>

    <div class="scoreBoxsm">
      <div class="module">
        <p class="title">创业知识跟踪</p>
        <div class="follow"
             v-if="pioneerGeneral!==null  || pioneerPlan!==null ">
          <p>创业通识<br /><span>{{pioneerGeneral}}%</span></p>
          <p>创业计划书<br /><span>{{ pioneerPlan }}%</span></p>
          <div ref="follow1"></div>
          <div ref="follow2"></div>
        </div>
        <div class="wei"
             v-else>未有具体数据</div>
      </div>
      <div class="module">
        <p class="title">项目参与</p>
        <div class="join"
             v-if="pioneerRelease!==null  && pioneerParticipate!==null">
          <p>创业项目发布</p>
          <p>创业参与项目</p>
          <span>创业项目发布数为{{pioneerRelease}}个，参与数为{{pioneerParticipate}}个</span>
          <div ref="join1"></div>
          <div ref="join2"></div>
        </div>
        <div class="wei"
             v-else>未有具体数据</div>
      </div>
    </div>

    <div class="module">
      <div class="title integral">
        <div class="LEF">创业积分情况</div>
        <div class="RIT">
          <span>当前创业积分:&nbsp;{{jicurrent}}分</span>
          <el-button v-popover:popover4>积分明细</el-button>
        </div>
      </div>
      <div class="scoreChart"
           ref="scoreChart"></div>
    </div>
    <el-popover ref="popover4"
                placement="right"
                width="800"
                trigger="click"
                class="tan"
                v-model="shu">
      <div class="statistics_title">
        <div class="integral">
          <label>选择学期</label>
          <select v-model="sendIntegralData.termid"
                  @change="getcurriculum()">
            <option :value="item.termid"
                    v-for="(item,index) in semesterList"
                    :key="index">{{item.termName}}</option>
          </select>
        </div>
        <div class="integral">
          <label>课程名称</label>
          <select v-model="sendIntegralData.courseid">
            <option :value="item.courseid"
                    v-for="(item,index) in courseNameList"
                    :key="index">{{item.coursename}}</option>

          </select>
        </div>
        <button class="tanBtn"
                @click="seachData">搜索</button>
        <div class="x"
             @click="shu = false">X</div>
      </div>
      <!-- 列表 -->
      <div class="tableBox">
        <el-table v-loading="loading"
                  :empty-text="emptyText"
                  element-loading-text="拼命加载中"
                  :header-row-style="headerStyle"
                  :data="tableData"
                  style="width: 100%">
          <el-table-column prop="integralTime"
                           label="日期"
                           width="300"></el-table-column>
          <el-table-column label="积分">
            <template slot-scope="scope">
              <p :style="{color:scope.row.integralValue>0?'#e64f15':'#10859d'}">
                <span v-if="scope.row.integralValue>=0">+</span>
                {{ scope.row.integralValue }}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="integralName"
                           label="来源"></el-table-column>

        </el-table>
        <Pagination v-show="tableData.length"
                    :current="current"
                    :totalPage="totalPage"
                    @changePageHandler="changePage"></Pagination>
      </div>
    </el-popover>
  </div>
</template>

<script>
import Pagination from "../views/pagination";
import {
  entrepreneurPortrait,
  pioneerInfo,
  semester,
  curriculum,
  integralStatistics,
  updateData,
  selectSynchroLog,
  assessModules
} from "../js/url";
export default {
  props: ["baseInfo"],
  name: "EntrepreneurialPortrait",
  components: {
    Pagination
  },
  data() {
    return {
      // 弹框数据
      shu: false,
      sendIntegralData: {
        userId: "",
        termid: "", //学期选择
        courseid: "", //课程选择
        pageNum: 1,
        pageSize: 10,
        assessModuleId: 5
      },
      // 获取的学期
      semesterList: [{ termName: "全部学期", termid: "" }],

      // 获取课程名称
      courseNameList: [{ coursename: "全部课程", courseid: "" }],
      loading: true,
      emptyText: "暂无数据",
      current: 1,
      headerStyle: {
        height: "60px",
        backgroundColor: "#10859d",
        color: "dimgrey"
      },
      // 列表数据
      tableData: [],
      totalPage: 1,
      pioneerGeneral: "",
      pioneerPlan: "",

      pioneerRelease: "", //创业项目发布数
      pioneerParticipate: "",
      //更新数据时间
      gtime: "",
      // 当前积分
      jicurrent: ""
    };
  },
  mounted() {
    this.getsemester();
    this.getcurriculum();
    this.getIntegralStatistics();
    this.getEntrepreneurPortraitData();
    this.getPioneerInfo(), this.Updatetime();
    this.getPortrait();
  },
  methods: {
    scoreEchart(termid, integralValue, sumIntegralValue) {
      // 综合能力
      let scoreChart = this.$echart.init(this.$refs.scoreChart);
      scoreChart.setOption({
        grid: {
          left: 80,
          right: 80,
          top: 100,
          bottom: 50,
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },

        toolbox: {
          show: true
        },
        legend: {
          data: ["个人积分", "班级平均积分"],
          icon: "rect", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          y: "30",
          itemWidth: 20,

          itemHeight: 10,

          itemGap: 40,
          textStyle: { fontSize: 16 }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: termid,
            axisLine: {
              lineStyle: {
                color: "#008acd",
                width: 2 //这里是为了突出显示加上的
              }
            },
            axisLabel: {
              color: "#333333" //刻度线标签颜色
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#008acd",
                width: 2 //这里是为了突出显示加上的
              }
            },
            axisLabel: {
              color: "#333333" //刻度线标签颜色
            }
          }
        ],
        series: [
          {
            name: "个人积分",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: { type: "default" },
                color: "#90dcdd",
                lineStyle: {
                  color: "#3bc7cb"
                }
              }
            },
            data: integralValue
          },
          {
            name: "班级平均积分",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: { type: "default" },
                color: "#d7cdeb",
                lineStyle: {
                  color: "#b6a2de"
                }
              }
            },
            data: sumIntegralValue
          }
        ]
      });
    },

    followEchart(el, title, color, colorArr, data) {
      console.log(el, title, color, colorArr, data);

      // 创业知识跟踪
      let followChart = this.$echart.init(el, title, color, colorArr, data);
      followChart.setOption({
        title: {
          text: title,
          x: "center",
          fontWeight: "normal",
          textStyle: {
            fontWeight: "normal"
          }
        },
        color: colorArr,
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data
          }
        ]
      });
    },
    joinEchart(el, color, value, item) {
      let joinChart = this.$echart.init(el);
      joinChart.setOption({
        tooltip: {
          trigger: "item"
        },
        color: color,
        series: [
          {
            type: "pie",
            radius: "55%",
            label: {
              normal: {
                show: false
              }
            },
            center: ["50%", "60%"],
            data: [
              {
                value: value,
                name: item,
                itemStyle: { normal: { color: color } }
              }
            ]
          }
        ]
      });
    },
    getEntrepreneurPortraitData() {
      // 获取创业积分数据
      let { userId, classId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + entrepreneurPortrait, {
          params: { userId, classId }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            let termid = [],
              integralValue = [],
              sumIntegralValue = [];
            for (let i = 0; i < data.data.length; i++) {
              termid.push(data.data[i].termid);
              integralValue.push(data.data[i].integralValue);
              sumIntegralValue.push(data.data[i].sumIntegralValue);
            }
            this.scoreEchart(termid, integralValue, sumIntegralValue);
          }
        });
    },

    getPioneerInfo() {
      //获取创业知识跟踪与项目参与
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + pioneerInfo, {
          params: { userId }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            this.pioneerGeneral = data.data[0].pioneerGeneral; //创业通识学习完成度
            this.pioneerPlan = data.data[0].pioneerPlan; //创业计划书完成度
            this.pioneerRelease = data.data[0].pioneerRelease; //创业项目发布数
            this.pioneerParticipate = data.data[0].pioneerParticipate; //pioneerParticipate
            this.followEchart(
              this.$refs.follow1,
              `创业通识学习完成度${this.pioneerGeneral}%`,
              "#7384f4",
              ["#7384f4", "#dadada"],
              [
                { value: this.pioneerGeneral, name: "" },
                { value: 100 - this.pioneerGeneral, name: "" }
              ]
            );
            this.followEchart(
              this.$refs.follow2,
              `创业计划书学习完成度${this.pioneerPlan}%`,
              "#7edfb4",
              ["#7edfb4", "#dadada"],
              [
                { value: this.pioneerPlan, name: "直接访问" },
                { value: 100 - this.pioneerPlan, name: "" }
              ]
            );

            this.joinEchart(
              this.$refs.join2,
              "#7edfb4",
              this.pioneerParticipate,
              "创业项目参与数"
            );
            this.joinEchart(
              this.$refs.join1,
              " #7384f4",
              this.pioneerRelease,
              "创业项目发布数"
            );
          }
        });
    },
    getPortrait() {
      //获取当前积分

      this.$ajax
        .get(this.baseUrl + assessModules, { params: this.$route.query })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].assessModuleId == 5) {
                this.jicurrent = data.data[i].integralValue;
              }
            }
          }
        });
    },

    //获取学期接口
    getsemester() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + semester, {
          params: { userId }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            for (let i = 0; i < data.data.length; i++) {
              this.semesterList.push(data.data[i]);
            }
          }
        });
    },

    //获取课程名称接口
    getcurriculum() {
      if (this.sendIntegralData.termid == "") {
        this.courseNameList = [{ coursename: "全部课程", courseid: "" }];
      } else {
        let { userId } = this.$route.query;
        this.$ajax
          .get(this.baseUrl + curriculum, {
            params: {
              userId,
              termid: this.sendIntegralData.termid
            }
          })
          .then(res => {
            let data = JSON.parse(res.data);
            if (data.code == 200) {
              for (let i = 0; i < data.data.length; i++) {
                this.courseNameList.push(data.data[i]);
              }
            }
          });
      }
    },

    //  获取积分明细列表
    getIntegralStatistics() {
      //获取积分统计
      this.sendIntegralData.userId = this.$route.query.userId;
      this.tableData = [];
      this.loading = true;
      this.$ajax
        .get(this.baseUrl + integralStatistics, {
          params: this.sendIntegralData
        })
        .then(res => {
          let data = JSON.parse(res.data);
          this.loading = false;
          this.tableData = [];
          if (data.code == 200) {
            this.tableData = JSON.parse(JSON.stringify(data.data));
            this.totalPage = data.totalPages;
            this.tableData.forEach(item => {
              item.integralTime = item.integralTime.substring(0, 10);
              item.integralValue = parseInt(item.integralValue);
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.tableData = [];
          if (err.message.indexOf("timeout") > -1) {
            this.emptyText = "请求超时,请刷新重试！";
          } else {
            this.emptyText = "请求出错，请稍后重试！";
          }
        });
    },
    seachData() {
      // 点击搜索查询
      this.getIntegralStatistics();
    },
    changePage(current, everyShowNum) {
      this.current = current;
      this.everyShowNum = everyShowNum;
      this.sendIntegralData.pageNum = this.current;
      this.getIntegralStatistics();
    },
    // 点击更新同步数据
    synchronization() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + updateData, {
          params: { userId, assessModuleId: 5 }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            location.reload();
            this.$router.go(0);
          }
        });
    },

    // 同步数据时间获取
    Updatetime() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + selectSynchroLog, {
          params: {
            assessModuleId: 5,
            userId
          }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            this.gtime = data.data.createtime;
          }
        });
    }
  }
};
</script>
<style>
@import "../style/portrait.css";
.scoreChart {
  height: 400px;
}
.scoreBoxsm {
  display: flex;
  height: 450px;
  justify-content: space-between;
  margin-bottom: 36px;
}
.scoreBoxsm .module {
  width: 470px;
  margin-bottom: 0;
}
.scoreBoxsm .module .follow {
  display: flex;
  height: 329px;
  padding-top: 60px;
  position: relative;
}
.scoreBoxsm .module .follow > div {
  width: 50%;
}
.scoreBoxsm .module .follow > p {
  position: absolute;
  text-align: center;
  width: 50%;
  top: 206px;
  line-height: 24px;
}
.scoreBoxsm .module .follow > p span {
  color: #e64f15;
}
.scoreBoxsm .module .follow > p:nth-of-type(1) {
  left: 0;
  color: #7384f4;
}
.scoreBoxsm .module .follow > p:nth-of-type(2) {
  right: 0;
  color: #7edfb4;
}
.scoreBoxsm .module .wei {
  text-align: center;
  line-height: 329px;
}
.scoreBoxsm .module {
  position: relative;
}
.scoreBoxsm .module .join > div {
  position: absolute;
}
.scoreBoxsm .module .join > p {
  position: absolute;
  font-size: 13px;
}
.scoreBoxsm .module .join > div:nth-of-type(1) {
  width: 240px;
  height: 240px;
  top: 106px;
  left: 20px;
  z-index: 2;
}
.scoreBoxsm .module .join > div:nth-of-type(2) {
  width: 360px;
  height: 360px;
  top: 50px;
  left: 80px;
}
.scoreBoxsm .module .join p:nth-of-type(1) {
  top: 162px;
  left: 70px;
  color: #7384f4;
}
.scoreBoxsm .module .join p:nth-of-type(2) {
  top: 158px;
  left: 306px;
  color: #7edfb4;
}
.scoreBoxsm .module .join > span {
  position: absolute;
  top: 112px;
  left: 100px;
  color: #444;
}

.module .integral {
  display: flex;
  justify-content: space-between;
  padding-right: 30px;
}
.module .integral .RIT {
  display: flex;
}
.module .integral .RIT > span {
  display: block;
  padding-right: 14px;
}

.el-popper .statistics_title {
  height: 45px;
  line-height: 45px;
  border-bottom: #dcdcdc solid 2px;
  display: flex;
  position: relative;
}
.el-popper .statistics_title .titleName {
  text-indent: 36px;
  position: relative;
  width: 392px;
  float: left;
}

.el-popper .statistics_title .titleName:after {
  display: block;
  position: absolute;
  width: 6px;
  height: 30px;
  background-color: #0088a0;
  content: "";
  top: 8px;
  color: #444444;
  left: 20px;
}
.el-popper .statistics_title .time {
  float: left;
  width: 400px;
}
.el-popper .statistics_title .time label {
  float: left;
}
.el-popper .statistics_title .time .el-input__inner {
  float: left;
  border: none;
  padding-top: 12px;
}
.el-popper .statistics_title .time .el-input__inner .el-input__icon {
  display: none;
}
.el-popper .statistics_title .time span {
  color: #adadad;
  position: relative;
  top: -2px;
}
.el-popper .statistics_title .time input {
  width: 110px;
  height: 28px;
  border-radius: 4px;
  box-sizing: border-box;
  border: 2px solid #adadad;
  position: relative;
  top: -2px;
}
.el-popper .statistics_title .integral {
  width: 180px;
  padding: 0 20px;
}
.el-popper .statistics_title .integral:nth-child(2) {
  width: 180px;
  padding-left: 0;
}
.el-popper .statistics_title .integral select {
  width: 110px;
  height: 32px;
  border: 2px solid #adadad;
  border-radius: 4px;
}
.tanBtn {
  width: 110px;
  height: 30px;
  line-height: 30px;
  text-align: left;
  text-indent: 30px;
  margin-top: 8px;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: url("../assets/images/search.png") 72px center no-repeat;
  background-color: #12849c;
  font-size: 15px;
  box-shadow: 2px 2px 5px #b1b0b0;
}
.el-popper .tableBox {
  padding: 0px 34px;
}
.x {
  position: absolute;
  right: 32px;
  font-size: 20px;
  cursor: pointer;
}
</style>