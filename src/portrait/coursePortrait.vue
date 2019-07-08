<template>
  <div class="main">
    <div class="header">
      <div class="titleBox">
        <div><img
            src="../assets/images/pho.png"
            alt=""
          ></div>
        <p>{{ baseInfo.username }}</p>
        <p>{{ baseInfo.schoolname }}</p>
        <p>{{ baseInfo.classname }}</p>
      </div>
      <router-link
        tag="button"
        :to="{path:'/integralPortrait',query:{classId:$route.query.classId,userId:$route.query.userId}}"
      >
        返回上页
      </router-link>
      <!-- <div
        class="synchronization"
        @click="synchronization()"
        style="line-height: 80px;"
      >
        学校人才培养方案
      </div> -->
      <div
        class="synchronization"
        @click="synchronization()"
      >
        <div class="one">同步数据</div>
        <div class="two" v-if="gtime">上次同步:{{gtime | gTime}} </div>
      </div>
    </div>
    <div class="module">
      <p class="title">课程学习情况</p>
      <!-- <p class='schoolYear'>{{`${baseInfo.username}的${large}${largeWord}，${small}${smallWord}；`}}</p> -->
      <!-- <p class='schoolYear'>
        <span>{{`${baseInfo.username}在本${schools}的课程学习过程中；`}}</span>
        <span v-if="large.length >0">{{`${large}等${largenuber}门课程掌握较好，高于或等于平均水平,`}}</span>
        <span v-if="small.length > 0">{{`${small}等${smallnuber}门课程掌握较为一般，低于平均水平，有待加强提高`}}</span>
      </p> -->
      <div
        class="ExperimentalResult"
        v-if="large.length>0&& small.length > 0"
      >
        <span>{{`${baseInfo.username}在本${schools}的课程学习过程中：`}}</span>
        <div
          class="touRed"
          v-if="large.length>0"
        >
          <span
            v-for="item of large"
            :key="item"
            class="btRed"
          >{{item}}、 </span>
          <span>{{`等${largenuber}门课程掌握较好，高于或等于平均水平,`}}</span>
        </div>
        <div
          v-if="small.length > 0"
          class="touRed"
        >
          在
          <span
            v-for="item of small"
            :key="item"
            class="btRed"
          >{{item}}、 </span>
          <span>{{`等${smallnuber}门课程掌握较为一般，低于平均水平，有待加强提高；`}}</span>
        </div>

      </div>
      <div class="course">
      </div>

    </div>
    <div class="module">
      <p class="title">学习轨迹跟踪</p>
      <p class="trajectoryDetail">
        {{
        `${baseInfo.username}在本学期的课程学习过程中,作业成绩平均分为${typeScore3}分，${compareScore3}班级平均分${sumTypeScore3}分，课程练习成绩平均分为${typeScore2}分,${compareScore2}班级平均分${sumTypeScore2}分，考试成绩为${typeScore1}分,${compareScore1}班级平均分${sumTypeScore1}分；
        ${higherThan}`
        }}
      </p>
      <div class="trajectory">
        <div
          class="achievementChart"
          ref="achievementChart"
        ></div>
      </div>

    </div>

    <div class="module">
      <div class="title integral">
        <div class="LEF">课程积分情况</div>
        <div class="RIT">
          <span>当前课程积分:</span>
          <el-button v-popover:popover4>积分明细</el-button>
        </div>
      </div>
      <div
        class="scoreChart"
        ref="scoreChart"
      ></div>
    </div>

    <el-popover
      ref="popover4"
      placement="right"
      width="800"
      trigger="click"
      class="tan"
    >
      <div class="statistics_title">
        <div class="integral">
          <label>选择学期</label>
          <select v-model="sendIntegralData.termid">
            <option
              :value="item.termid"
              v-for="(item,index) in semesterList"
              :key="index"
            >{{item.termName}}</option>
          </select>
        </div>
        <div class="integral">
          <label>课程名称</label>
          <select v-model="sendIntegralData.courseid">
            <option
              :value="item.courseid"
              v-for="(item,index) in courseNameList"
              :key="index"
            >{{item.coursename}}</option>

          </select>
        </div>
        <button
          class="tanBtn"
          @click="seachData"
        >搜索</button>
      </div>
      <!-- 列表 -->
      <div class="tableBox">
        <el-table
          v-loading="loading"
          :empty-text="emptyText"
          element-loading-text="拼命加载中"
          :header-row-style="headerStyle"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="integralTime"
            label="日期"
            width="300"
          ></el-table-column>
          <el-table-column label="积分">
            <template slot-scope="scope">
              <p :style="{color:scope.row.integralValue>0?'#e64f15':'#10859d'}">
                <span v-if="scope.row.integralValue>=0">+</span>
                {{ scope.row.integralValue }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="integralName"
            label="来源"
          ></el-table-column>

        </el-table>
        <Pagination
          v-show="tableData.length"
          :current="current"
          :totalPage="totalPage"
          @changePageHandler="changePage"
        ></Pagination>
      </div>
    </el-popover>
  </div>

  <!-- 弹框列表 -->

</template>

<script>
import Pagination from "../views/pagination";
import {
  courseIntegral,
  learningTrajectoryTracking,
  learningSituation,
  semester,
  curriculum,
  integralStatistics,
  updateData,
  selectSynchroLog
} from "../js/url"
export default {
  props: ['baseInfo'],
  name: "CompositePortrait",
  components: {
    Pagination
  },
  data () {
    return {
      // 弹框数据
      sendIntegralData: {
        userId: "",
        termid: '',//学期选择
        courseid: '',//课程选择
        pageNum: 1,
        pageSize: 10, assessModuleId: 1
      },
      // 获取的学期
      semesterList: [],

      // 获取课程名称
      courseNameList: [],
      loading: true,
      emptyText: "暂无数据",
      current: 1,
      headerStyle: {
        height: '60px',
        backgroundColor: '#10859d',
        color: 'dimgrey',
      },
      // 列表数据
      tableData: [],
      totalPage: 1,
      excellentList: [],//学习轨迹跟踪优于
      failListL: [],  //学习轨迹跟踪低于
      minType: '',
      minPersent: "", //最小占比

      typeScore3: "",//作业成绩
      sumTypeScore3: "", // 班级作业成绩
      compareScore3: "", //个人与班级比较
      ContrastScore3: "",

      typeScore2: "",//课堂练习成绩
      sumTypeScore2: "", // 班级课堂练习成绩
      compareScore2: "", //个人与班级比较
      ContrastScore2: "",

      typeScore1: "", //考试成绩
      sumTypeScore1: "",//班级考试成绩
      compareScore1: "", //个人与班级比较
      ContrastScore1: "",

      // 优于低于
      higherThan: [],

      trajectoryData: [],

      situationData: [],
      // 课程学习情况文字描述
      large: [],
      small: [],
      // 高于文字
      largenuber: 0,
      // 低于文字
      smallnuber: 0,
      //学期？学年
      schools: '',
      //更新数据时间
      gtime: ''
    }
  },
  mounted () {
    this.getsemester();
    this.getcurriculum();
    this.getIntegralData();
    this.getLearningTrajectoryTrackingData();
    this.getLearningSituationData();
    this.getIntegralStatistics();
    this.Updatetime();
  },
  methods: {
    getIntegralData () { //获取课程画像数据
      let { userId, classId } = this.$route.query;
      this.$ajax.get(this.baseUrl + courseIntegral, {
        params: { userId, classId }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          let termid = [], integralValue = [], sumIntegralValue = [];
          for (let i = 0; i < data.data.length; i++) {
            termid.push(data.data[i].termid);

            integralValue.push(data.data[i].integralValue);
            sumIntegralValue.push(data.data[i].sumIntegralValue)
          }
          this.courseIntegralEchart(termid, integralValue, sumIntegralValue)
        } else {
          this.$message({ type: 'error', message: "请求出错，请联系技术人员" })
        }

      }).catch(() => {
        this.$message({ type: 'error', message: "请求出错，请联系技术人员" })
      })
    },

    courseIntegralEchart (termid, integralValue, sumIntegralValue) { // 课程积分情况
      // console.log(termid, integralValue, sumIntegralValue);

      let scoreChart = this.$echart.init(this.$refs.scoreChart);
      scoreChart.setOption({
        grid: {
          left: 80,
          right: 80,
          top: 100,
          bottom: 50,
          containLabel: true
        },
        //图标头
        legend: {
          data: ['个人积分', '班级平均积分'],
          icon: "rect",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          y: "30",
          itemWidth: 20,

          itemHeight: 10,

          itemGap: 40,
          textStyle: { fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },

        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: termid
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '个人积分',
            type: 'line',
            stack: '总量',
            areaStyle: {              normal: {
                color: "#93dfe0"
              }            },
            itemStyle: {
              normal: {
                color: '#8cd5c2', //改变折线点的颜色
                lineStyle: {
                  color: '#17c6c3' //改变折线颜色
                }
              }
            },
            data: integralValue
          },
          {
            name: '班级平均积分',
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: false,
                position: 'top'
              }
            },
            areaStyle: {              normal: {
                color: "#d4cae8"
              }            },
            itemStyle: {
              normal: {
                color: '#b29fdd', //改变折线点的颜色
                lineStyle: {
                  color: '#b29fdd' //改变折线颜色
                }
              }
            },
            data: sumIntegralValue
          }
        ]
      })
    },
    getLearningTrajectoryTrackingData () { // 获取学习轨迹跟踪数据
      let { userId, classId } = this.$route.query;
      this.$ajax.get(this.baseUrl + learningTrajectoryTracking, {
        params: { userId, classId }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          let typeCount = [], typeArr = ["考试次数", "课堂练习次数", "作业次数"];
          let sumTypeScore = [], typeScore = [], numArr = [];
          this.typeScore3 = this.gitdata(data.data.typeScore3);//个人作业成成绩
          this.sumTypeScore3 = this.gitdata(data.data.sumTypeScore3);//班级作业成绩
          this.compareScore3 = this.compare(this.typeScore3, this.sumTypeScore3); //个人与班级比较

          this.typeScore2 = this.gitdata(data.data.typeScore2);//个人课堂练习成绩
          this.sumTypeScore2 = this.gitdata(data.data.sumTypeScore2);//班级课堂练习成绩
          this.compareScore2 = this.compare(this.typeScore2, this.sumTypeScore2);//个人与班级比较

          this.typeScore1 = this.gitdata(data.data.typeScore1);//个人考试成绩
          this.sumTypeScore1 = this.gitdata(data.data.sumTypeScore1);//班级考试成绩
          this.compareScore1 = this.compare(this.typeScore1, this.typeScore1);//个人与班级比较

          this.contrast(this.typeScore3, this.sumTypeScore3, "平时表现(作业)");
          this.contrast(this.typeScore2, this.sumTypeScore2, "课堂练习");
          this.contrast(this.typeScore1, this.typeScore1, "考试表现")
          for (let attr in data.data) {
            if (attr.indexOf("typeCount") > -1) {
              typeCount.push({
                value: parseInt(data.data[attr]),
              })
            }
            if (attr.indexOf("sumTypeScore") > -1) {
              // console.log(data.data[attr]);

              sumTypeScore.push(this.gitdata(data.data[attr]))
            }
            if (attr.indexOf("typeScore") > -1) {
              typeScore.push(this.gitdata(data.data[attr]))
            }
          }



          for (let i = 0; i < typeCount.length; i++) {
            typeCount[i].name = typeArr[i];
            numArr.push(typeCount[i].value)
          }
          let max = Math.max.apply(Math, numArr); // 先找出最大的那个
          let min = Math.min.apply(Math, numArr); // 先找出最小的那个
          let total = numArr.reduce((i, x) => { return i + x }); // 求和
          this.maxPersent = this.commonJs.percentNum(max, total);
          this.minPersent = this.commonJs.percentNum(min, total);
          for (let k = 0; k < typeCount.length; k++) {
            if (max == typeCount[k].value) {
              this.maxType = typeCount[k].name
            }
            if (min == typeCount[k].value) {
              this.minType = typeCount[k].name
            }
          }
          this.achievementEchart(sumTypeScore, typeScore)
        }
      })
    },
    // 判断是否为null
    gitdata (data) {
      if (data == null) {
        data = 0
      } else {
        data = parseInt(data)
      }
      return data;
    },

    // 比较个人分与班级平均分
    compare (arr1, arr2) {
      if (arr1 >= arr2) {
        return "高于或等于"
      } else if (arr1 < arr2) {
        return "低于"
      }
    },
    contrast (arr1, arr2, name) {
      if (arr1 >= arr2) {
        this.higherThan.push(name + "优于平均水平")
      } else if (arr1 < arr2) {
        this.higherThan.push(name + "低于平均水平，有待加强")
      }
    },



    // 比较个人分与班级优于与低于



    //        班级分   , 个人分
    achievementEchart (sumTypeScore, typeScore) {//学习类型成绩
      let achievementChart = this.$echart.init(this.$refs.achievementChart);
      achievementChart.setOption({
        legend: {
          data: ['个人平均分', '班级平均分'],
          top: 60
        },
        title: {
          text: '学习类型成绩',
          left: 'center',
          top: 40,
          textStyle: {
            color: "#444444",
            fontWeight: "normal"
          }
        },
        tooltip: {
          trigger: "item"
        },
        splitLine: {
          show: true,
          lineStyle: {
            width: 10,
            color: '#286fbb' // 图表背景网格线的颜色
          }
        },
        textStyle: {
          color: '#444444'
        },
        color: ["#f09796", "#9ac5f4"],
        radar: [
          {
            indicator: [
              { text: '考试成绩', max: 100 },
              { text: '课堂学习成绩', max: 100 },
              { text: '平时成绩（作业）', max: 100 },
            ],
            center: ['50%', '65%'],
            radius: '80%',
            splitLine: {
              show: true,    //去掉网格线
              lineStyle: {
                width: 4,
                color: "#7384f4"
              }
            },
            splitArea: {
              areaStyle: {
                color: ["#fff", "#fff", "#7384f4"]
              }
            }
          },
        ],
        series: [
          {
            name: "",
            type: 'radar',
            itemStyle: {
              normal: {
                areaStyle: {
                  type: 'default',
                  backgroundColor: "green"
                }
              }
            },
            data: [
              {
                value: typeScore,
                name: '个人平均分'
              },
              {
                value: sumTypeScore,
                name: '班级平均分'
              }
            ]
          }
        ]
      })
    },
    getLearningSituationData () { // 获取课程情况数据
      let { userId, classId } = this.$route.query;
      this.$ajax.get(this.baseUrl + learningSituation, {
        params: { userId, classId }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          let str = '';
          for (let i in data.data) {
            this.situationData.push(data.data[i]);
          }
          //  计算出课程学习情况的最多和最少
          for (let j = 0; j < this.situationData.length; j++) {


            for (let i = 0; i < this.situationData[j].length; i++) {
              if (this.situationData[j][i].integralValue >= this.situationData[j][i].sumIntegralValue && this.large.length <= 4) {
                this.large.push(this.situationData[j][i].integralName + "  ");
              } else if (this.situationData[j][i].integralValue < this.situationData[j][i].sumIntegralValue && this.small.length <= 4) {
                this.small.push(this.situationData[j][i].integralName + "  ")
              }
            }
          }
          this.largenuber = this.large.length;
          this.smallnuber = this.small.length;



          // 判断学期还是学年
          if (this.situationData.length == 1) {
            this.schools = "学期"
          } else if (this.situationData.length > 1) {
            this.schools = "学年"
          }

          let integralName = [], integralValue = [], sumIntegralValue = [];
          let schollyear = [];

          for (let i = 0; i < this.situationData.length; i++) {
            integralName.push([]);
            integralValue.push([]);
            sumIntegralValue.push([]);
            schollyear.push([]);
            for (let k = 0; k < this.situationData[i].length; k++) {
              integralName[i].push({ name: this.situationData[i][k].integralName, max: 100 });
              // console.log(integralName[i]);

              integralValue[i].push(this.situationData[i][k].integralValue);
              sumIntegralValue[i].push(this.situationData[i][k].sumIntegralValue);
              schollyear[i].push('第' + this.situationData[i][k].termid + '学期')
            }
          }
          for (let i = 0; i < this.situationData.length; i++) {
            str += `<div class="fistYearChart"
                         style="width: 490px;height: 450px;float:left"
                         id="fistYearChart${i}">
                        </div>`;
          }
          document.querySelector(".course").innerHTML = str;
          let schollyearis = [];
          for (let j = 0; j < schollyear.length; j++) {
            schollyearis[j] = schollyear[j][0]
          }
          // console.log(integralName);
          for (let k = 0; k < this.situationData.length; k++) {
            this.learningSituationEchart(
              document.getElementById("fistYearChart" + k),
              schollyearis[k],
              integralName[k],
              integralValue[k],
              sumIntegralValue[k]
            )
          }
        }

      })
    },
    words () {

    },
    learningSituationEchart (el, year, integralName, integralValue, sumIntegralValue) { // 课程学习情况

      let fistYearChart = this.$echart.init(el);

      let stu = this.baseInfo.username;
      fistYearChart.setOption({
        title: {
          text: year,
          textStyle: {
            color: "#444",
            fontWeight: "normal"
          },
          x: "center",
          y: 0,
        },
        splitLine: {
          lineStyle: {
            width: 6,
          }
        },
        color: ["#7edfb4", '#b6a2de'],
        legend: {
          top: 40,
          icon: 'rect',
          itemWidth: 20,
          itemHeight: 20,
          data: [stu, '班级平均'],
        },
        tooltip: {
          trigger: 'item',
          confine: true
        },
        radar: {
          name: {
            textStyle: {
              color: '#444',
              lineHeight: 20,
            },

          },
          indicator: integralName,
          radius: 120,
          splitLine: {
            show: true,    //去掉网格线
            lineStyle: {
              width: 2
            }
          },
        },
        series: [{
          name: '预算 vs 开销',
          type: 'radar',
          data: [
            {
              value: integralValue,
              name: stu
            },
            {
              value: sumIntegralValue,
              name: '班级平均'
            }
          ]
        }]
      })
    },

    // 点击跳转静态表格
    // synchronization () {
    //   let routeData = this.$router.resolve({ path: '/company' });
    //   window.open(routeData.href, '_blank');
    // },

    // 点击更新同步数据
    synchronization () {
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + updateData, {
        params: { userId, assessModuleId: 1 }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          location.reload()
          this.$router.go(0)

        }
      })

    },

    // 同步数据时间获取
    Updatetime () {
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + selectSynchroLog, {
        params: {
          assessModuleId: 1,
          userId
        }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          this.gtime = data.data.createtime

        }
      })
    },


    //获取学期接口
    getsemester () {
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + semester, {
        params: { userId }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          this.semesterList = data.data;
        }
      })
    },


    //获取课程名称接口
    getcurriculum () {
      let { userId } = this.$route.query;
      console.log();

      this.$ajax.get(this.baseUrl + curriculum, {
        params: {
          userId,
          termid: this.sendIntegralData.termid
        }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          this.courseNameList = data.data;
        }

      })
    },

    //  获取积分明细列表
    getIntegralStatistics () { //获取积分统计
      this.sendIntegralData.userId = this.$route.query.userId;
      this.tableData = [];
      this.loading = true;
      this.$ajax.get(this.baseUrl + integralStatistics, {
        params: this.sendIntegralData
      }).then(res => {
        let data = JSON.parse(res.data);
        this.loading = false;
        this.tableData = [];
        if (data.code == 200) {
          this.tableData = JSON.parse(JSON.stringify(data.data));
          this.totalPage = data.totalPages;
          this.tableData.forEach((item) => {
            item.integralTime = item.integralTime.substring(0, 10);
            item.integralValue = parseInt(item.integralValue);
          });
        }
      }).catch(err => {
        this.loading = false;
        this.tableData = [];
        if (err.message.indexOf('timeout') > -1) {
          this.emptyText = "请求超时,请刷新重试！"
        } else {
          this.emptyText = "请求出错，请稍后重试！"
        }
      })
    },
    seachData () { // 点击搜索查询
      this.getIntegralStatistics()

    },
    changePage (current, everyShowNum) {
      this.current = current;
      this.everyShowNum = everyShowNum;
      this.sendIntegralData.pageNum = this.current;
      this.getIntegralStatistics();
    }
  }
}
</script>
<style scoped>
@import '../style/portrait.css';
.scoreChart {
  height: 400px;
}
.dataShow {
  height: 300px;
  flex: 1;
  border-left: 1px solid #ccc;
}
.dataShow ul {
  padding-top: 30px;
}
.dataShow ul li {
  width: 50%;
  display: inline-block;
  text-indent: 60px;
  line-height: 50px;
  color: #444444;
}
.dataShow ul li span {
  color: #95706d;
}

.module .evaluatMain {
  padding: 20px;
}
.module .evaluatMain .interest {
  display: flex;
  margin-bottom: 20px;
}
.module .evaluatMain .interest p,
.module .evaluatMain .potentialBox p {
  width: 120px;
  height: 30px;
  border-radius: 15px;
  background-color: #10859d;
  color: #fff;
  text-align: center;
  line-height: 30px;
}
.module .ExperimentalResult {
  padding-top: 46px;
  padding-bottom: 30px;
  width: 912px;
  color: #444;
  margin: 0 auto;
  line-height: 24px;
}
.module .evaluatMain .interest span {
  display: block;
  flex: 1;
  height: 30px;
  line-height: 30px;
  text-indent: 24px;
  font-size: 14px;
  color: #444444;
}
.module .evaluatMain .potentialBox .potentialChart {
  height: 350px;
}
.module .labelBox {
  width: 840px;
  margin: 0 auto;
}
.module .trajectory {
  height: 460px;
  display: flex;
}
.module .trajectory .proportionChart,
.module .trajectory .achievementChart {
  flex: 1;
}
.module .trajectoryDetail,
.module .schoolYear {
  width: 875px;
  margin: 0 auto;
  color: #444444;
  line-height: 26px;
  padding-top: 60px;
}
.module .course {
  padding-top: 50px;
  overflow: hidden;
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
  content: '';
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
  background: url('../assets/images/search.png') 72px center no-repeat;
  background-color: #12849c;
  font-size: 15px;
  box-shadow: 2px 2px 5px #b1b0b0;
}
.el-popper .tableBox {
  padding: 0px 34px;
}
.module .touRed .btRed {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='%23F30' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/%3E%3C/svg%3E")
    repeat-x 0 100%;
  background-size: 20px auto;
  display: inline-block;
  padding-bottom: 4px;
  margin-right: 4px;
}
</style>
