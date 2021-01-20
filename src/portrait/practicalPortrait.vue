<template>
  <div class="main">
    <div class="header">
      <div class="titleBox">
        <div>
          <img v-if="baseInfo.photo"
               :src="`https://etechedu.com/${baseInfo.photo}`"
               alt="" />
          <img v-else
               src="../assets/images/pho.png"
               alt="" />
        </div>
        <p>{{ baseInfo.username }}</p>
        <p>{{ baseInfo.schoolname }}</p>
        <p>{{ baseInfo.classname }}</p>
      </div>
      <router-link tag="button"
                   :to="{
          path: '/integralPortrait',
          query: { classId: $route.query.classId, userId: $route.query.userId }
        }">
        返回上页
      </router-link>
      <div class="synchronization"
           @click="synchronization()">
        <div class="one">同步数据</div>
        <div class="two"
             v-if="gtime">上次同步:{{ gtime | gTime }}</div>
      </div>
    </div>

    <div class="module">
      <p class="title">实训得分</p>
      <div v-if="nuber > 0"
           class="ExperimentalResult">
        <span>{{ `${baseInfo.username}实训中涉及：` }}</span>
        <div class="touRed">
          <span v-for="item of operateName"
                :key="item"
                class="btRed">{{ item }}、
          </span>
          <span>{{ `等${nuber}个系统的实训实训,达标率为:` }}</span>
          <span style="color: #0088a0">{{ rate }}</span>
        </div>
        <div v-if="skilled.length > 0"
             class="touRed">
          在
          <span v-for="item of skilled"
                :key="item"
                class="btRed">{{ item }}、
          </span>
          <span>等系统中能熟悉掌握系统的相关步骤；</span>
        </div>
        <div v-if="secondary.length > 0"
             class="touRed">
          在
          <span v-for="item of secondary"
                :key="item"
                class="btRed">{{ item }}、
          </span>
          <span>等系统中能掌握基本的步骤，有待提高；</span>
        </div>
        <div v-if="unfamiliar.length > 0"
             class="touRed">
          在
          <span v-for="item of unfamiliar"
                :key="item"
                class="btRed">{{ item }}、
          </span>
          <span>等系统中未能完成系统大部分操作，系统操作生疏，需进一步加强；</span>
        </div>
      </div>

      <p v-else
         class="wu">暂无数据</p>

      <div class="histogramChart"
           ref="histogramChart"></div>
    </div>

    <div class="module">
      <p class="title">岗位得分</p>
      <!-- <p
        v-if="jobScoreList.length > 0"
        class="ExperimentalResult"
      >
        {{`
        ${baseInfo.username}同学实训过程中，共参与${postName}等${participate}个系统技能训练，按岗位进行计分，达标率：
        `}}<span style="color: #0088a0">{{rateScore}}%</span>
        <span v-if="postSkilled.length > 0"> {{`其中在${postSkilled}能够熟悉掌握相关岗位技能，`}}</span>
        <span v-if="postSecondary.length > 0">{{`在${postSecondary}中能掌握基本的岗位技能`}}</span>
        <span v-if="postUnfamiliar.length > 0"> {{ `而在${postUnfamiliar}岗位及鞥呢训练中掌握较差，需进一步加强`}}</span>
      </p> -->
      <div v-if="jobScoreList.length > 0"
           class="ExperimentalResult">
        <span>{{ `${baseInfo.username}同学实训过程中,共参与` }}</span>
        <div class="touRed">
          <span v-for="item of postName"
                :key="item"
                class="btRed">{{ item }}、
          </span>
          <span>{{
            `等${participate}个系统技能训练，按岗位进行计分，达标率：`
          }}</span>
          <span style="color: #0088a0">{{ rateScore }}%</span>
        </div>
        <div v-if="postSkilled.length > 0"
             class="touRed">
          其中在
          <span v-for="item of postSkilled"
                :key="item"
                class="btRed">{{ item }}、
          </span>
          <span>能够熟悉掌握相关岗位技能；</span>
        </div>
        <div v-if="postSecondary.length > 0"
             class="touRed">
          在
          <span v-for="item of postSecondary"
                :key="item"
                class="btRed">{{ item }}、
          </span>
          <span>中能掌握基本的岗位技能</span>
        </div>
        <div v-if="postUnfamiliar.length > 0"
             class="touRed">
          而在
          <span v-for="item of postUnfamiliar"
                :key="item"
                class="btRed">{{ item }}、
          </span>
          <span>岗位技能训练中掌握较差，需进一步加强</span>
        </div>
      </div>
      <p v-else
         class="wu">暂无数据</p>
      <div class="postHistogramChart"
           ref="postHistogramChart"></div>
    </div>
    <div class="module">
      <div class="title integral">
        <div class="LEF">实训积分情况</div>
        <div class="RIT">
          <span>当前实训积分:&nbsp;{{ jicurrent }}分</span>
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
                    v-for="(item, index) in semesterList"
                    :key="index">{{ item.termName }}</option>
          </select>
        </div>
        <div class="integral">
          <label>课程名称</label>
          <select v-model="sendIntegralData.courseid">
            <option :value="item.courseid"
                    v-for="(item, index) in courseNameList"
                    :key="index">{{ item.coursename }}</option>
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
              <p :style="{
                  color: scope.row.integralValue > 0 ? '#e64f15' : '#10859d'
                }">
                <span v-if="scope.row.integralValue >= 0">+</span>
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
  experimentalTrainingPortrait,
  experimentalTraining,
  getJobScore,
  semester,
  curriculum,
  integralStatistics,
  updateData,
  selectSynchroLog,
  assessModules,
} from "../js/url";

export default {
  props: ["baseInfo"],
  name: "PracticalPortrait",
  components: {
    Pagination,
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
        assessModuleId: 2,
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
        color: "dimgrey",
      },
      // 列表数据
      tableData: [],
      totalPage: 1,

      // 实验实训数据
      dataList: [],
      //  岗位得分数据
      jobScoreList: [],
      // 岗位达标率
      rateScore: "",
      // 岗位得分超过80的
      postSkilled: [],
      //岗位得分60-80的
      postSecondary: [],
      //岗位的分低于60
      postUnfamiliar: [],
      // 岗位参与个数
      participate: 0,
      //岗位参与名字
      postName: [],

      // 实训得分超过80的
      skilled: [],
      //实训得分60-80的
      secondary: [],
      //实训的分低于60
      unfamiliar: [],
      // 实训得分达标率
      rate: "",
      // 实训得分个数
      nuber: 0,
      //实训参与名字
      operateName: [],
      // 实训掌握好的
      good: [],
      //实训掌握较差
      difference: [],
      // 实训分数占比
      score_rateArr: [],
      //更新数据时间
      gtime: "",
      jicurrent: "",
    };
  },
  mounted() {
    this.getsemester();
    this.getcurriculum();
    this.getIntegralStatistics();
    this.getExperimentalTrainingPortraitData();
    this.getExperimentalTrainingData();
    this.getjobScore();
    this.Updatetime();
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
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },

        toolbox: {
          show: true,
        },
        legend: {
          data: ["个人积分", "班级平均积分"],
          icon: "rect", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          y: "30",
          itemWidth: 20,

          itemHeight: 10,

          itemGap: 40,
          textStyle: { fontSize: 16 },
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
                width: 2, //这里是为了突出显示加上的
              },
            },
            axisLabel: {
              color: "#333333", //刻度线标签颜色
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#008acd",
                width: 2, //这里是为了突出显示加上的
              },
            },
            axisLabel: {
              color: "#333333", //刻度线标签颜色
            },
          },
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
                  color: "#3bc7cb",
                },
              },
            },
            data: integralValue,
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
                  color: "#bfaee2",
                },
              },
            },
            data: sumIntegralValue,
          },
        ],
      });
    },

    histogramEchart(type_nameArr, scoreArr) {
      //实训得分
      console.log(type_nameArr, scoreArr);
      let histogramChart = this.$echart.init(this.$refs.histogramChart);
      histogramChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            let str = "";
            str += `${params[0].name}<br/>实训得分:${params[0].data}`;
            return str;
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: 0,
          left: "20",
          right: "4%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              width: 2,
              color: "#408829",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#444444", //坐标值得具体的颜色
            },
          },
        },
        yAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              width: 2,
              color: "#408829",
            },
          },
          axisLabel: {
            show: true,
            interval: 0,
            formatter: function (params) {
              var newParamsName = "";
              var paramsNameNumber = params.length;
              var provideNumber = 10; //一行显示几个字
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = "";
                  var start = p * provideNumber;
                  var end = start + provideNumber;
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            },
            textStyle: {
              color: "#444444", //坐标值得具体的颜色
            },
          },
          data: type_nameArr,
        },
        series: [
          {
            name: "分数占比",
            type: "bar",
            stack: "总量",
            barWidth: 60,

            barMaxWidth: 60,
            label: {
              normal: {
                show: true,
                position: "insideRight",
              },
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = [
                    "#a9cba2",
                    "#a9cba2",
                    "#a9cba2",
                    "#a9cba2",
                    "#c2dabd",
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
            data: scoreArr,
          },
        ],
      });
    },

    postHistogramEchart(type_nameArr, scoreArr) {
      //岗位得分
      let postHistogramChart = this.$echart.init(this.$refs.postHistogramChart);
      postHistogramChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            let str = "";
            str += `${params[0].name}<br/>岗位得分:${params[0].data}`;
            return str;
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        // legend: {
        //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        // },
        grid: {
          top: 0,
          right: "4%",
          left: "20",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              width: 2,
              color: "#008acd",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              width: 2,
            },
          },
          axisLabel: {
            textStyle: {
              color: "#444444",
            },
          },
        },
        yAxis: {
          type: "category",
          axisLabel: {
            show: true,
            interval: 0,
            formatter: function (params) {
              var newParamsName = "";
              var paramsNameNumber = params.length;
              var provideNumber = 10; //一行显示几个字
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = "";
                  var start = p * provideNumber;
                  var end = start + provideNumber;
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            },
            textStyle: {
              color: "#444444", //坐标值得具体的颜色
            },
          },

          data: type_nameArr,
        },
        series: [
          {
            name: "分数占比",
            type: "bar",
            barMaxWidth: 60,
            stack: "总量",
            barWidth: 60,
            label: {
              normal: {
                show: true,
                position: "insideRight",
              },
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  let colorList = [
                    "#5ab1ef",
                    "#5ab1ef",
                    "#5ab1ef",
                    "#5ab1ef",
                    "#5ab1ef",
                    "#5ab1ef",
                    "#5ab1ef",
                    "#5ab1ef",
                    "#5ab1ef",
                    "#8bc8f3",
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
            data: scoreArr,
          },
        ],
      });
    },

    getPortrait() {
      //获取当前积分

      this.$ajax
        .get(this.baseUrl + assessModules, { params: this.$route.query })
        .then((res) => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].assessModuleId == 2) {
                this.jicurrent = data.data[i].integralValue;
              }
            }
          }
        });
    },
    getExperimentalTrainingPortraitData() {
      // 获取实验实训积分数据
      let { userId, classId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + experimentalTrainingPortrait, {
          params: { userId, classId, typeId: 2 },
        })
        .then((res) => {
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
    getExperimentalTrainingData() {
      // 获取实验数据
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + experimentalTraining, {
          params: { userId, typeId: 2 },
        })
        .then((res) => {
          let data = JSON.parse(res.data);
          if ((data.code = 200)) {
            this.dataList = data.data;
            let type_name = [],
              valueArr = [];
            let type_nameArr = [],
              scoreArr = [],
              sum_scoreArr = [];
            let score_rateArr = [];
            for (let i = 0; i < data.data.length; i++) {
              score_rateArr.push(data.data[i].score_rate);
              valueArr.push(data.data[i].score);
              type_name.push({ text: data.data[i].type_name, max: 600 });
              if (type_nameArr.length < 10) {
                type_nameArr.push(data.data[i].type_name);
              }
              scoreArr.push(parseInt(data.data[i].score));
              sum_scoreArr.push(parseInt(data.data[i].sum_score));
              if (this.operateName.length < 5) {
                this.operateName.push(this.dataList[i].type_name);
              }
              // 循环获取实训得分的文字数据
              if (this.dataList[i].score > 80 && this.skilled.length < 5) {
                this.skilled.push(this.dataList[i].type_name);
              } else if (
                this.dataList[i].score < 80 &&
                this.dataList[i].score > 60 &&
                this.secondary.length < 5
              ) {
                this.secondary.push(this.dataList[i].type_name);
              } else if (
                this.dataList[i].score < 60 &&
                this.unfamiliar.length < 5
              ) {
                this.unfamiliar.push(this.dataList[i].type_name);
              }
            }
            this.histogramEchart(type_nameArr, scoreArr);
            this.listdata();
          }
        });
    },

    getjobScore() {
      //获取岗位分数
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + getJobScore, {
          params: { userId, assessModuleId: 2 },
        })
        .then((res) => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            this.jobScoreList = data.data.scoreListResponseList;
            this.rateScore = data.data.rateScore;
            let post_nameArr = [],
              post_scoreArr = [];

            for (let i = 0; i < this.jobScoreList.length; i++) {
              this.participate++;
              if (this.postName.length < 5) {
                this.postName.push(this.jobScoreList[i].postName);
              }
              if (post_nameArr.length < 10) {
                post_nameArr.push(this.jobScoreList[i].postName);
              }
              if (post_scoreArr.length < 10) {
                post_scoreArr.push(this.jobScoreList[i].score);
              }
              // 循环获取岗位得分的文字数据
              if (
                this.jobScoreList[i].score > 80 &&
                this.postSkilled.length < 3
              ) {
                this.postSkilled.push(this.jobScoreList[i].postName);
              } else if (
                this.jobScoreList[i].score < 80 &&
                this.jobScoreList[i].score > 60 &&
                this.postSecondary.length < 3
              ) {
                this.postSecondary.push(this.jobScoreList[i].postName);
              } else {
                if (this.postUnfamiliar.length < 3) {
                  this.postUnfamiliar.push(this.jobScoreList[i].postName);
                }
              }
            }
            this.postHistogramEchart(post_nameArr, post_scoreArr);
          }
        });
    },
    listdata() {
      let quanbu = this.dataList.length;
      let dadao = 0;
      let dataoname = [];
      for (let j = 0; j < this.dataList.length; j++) {
        this.nuber++;
        if (this.dataList[j].score >= 60) {
          dadao++;
          dataoname.push(this.dataList[j]);
        }
      }

      this.rate = Math.round((dadao / quanbu) * 100) + "%";

      var max;
      for (let i = 0; i < dataoname.length; i++) {
        for (let j = i + 1; j < dataoname.length; j++) {
          if (dataoname[i].score < dataoname[j].score) {
            max = dataoname[i];
            dataoname[i] = dataoname[j];
            dataoname[j] = max;
          }
        }
      }
      let go = dataoname.slice(0, 3);
      for (let k = 0; k < go.length; k++) {
        this.good.push(go[k].type_name);
      }
    },
    //获取学期接口
    getsemester() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + semester, {
          params: { userId },
        })
        .then((res) => {
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
              termid: this.sendIntegralData.termid,
            },
          })
          .then((res) => {
            let data = JSON.parse(res.data);
            if (data.code == 200) {
              for (let i = 0; i < data.data.length; i++) {
                this.courseNameList.push(data.data[i]);
              }
            }
          });
      }
    },
    // 点击更新同步数据
    synchronization() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + updateData, {
          params: { userId, assessModuleId: 2 },
        })
        .then((res) => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            location.reload();
            this.$router.go(0);
          }
        })
        .catch((err) => {
          this.$message.error("同步失败请联系管理员");
        });
    },

    // 同步数据时间获取
    Updatetime() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + selectSynchroLog, {
          params: {
            assessModuleId: 2,
            userId,
          },
        })
        .then((res) => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            this.gtime = data.data.createtime;
          }
        });
    },

    //  获取积分明细列表
    getIntegralStatistics() {
      //获取积分统计
      this.sendIntegralData.userId = this.$route.query.userId;
      this.tableData = [];
      this.loading = true;
      this.$ajax
        .get(this.baseUrl + integralStatistics, {
          params: this.sendIntegralData,
        })
        .then((res) => {
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
        })
        .catch((err) => {
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
  },
};
</script>
<style>
@import "../style/portrait.css";
.module .scoreChart {
  height: 400px;
}
.module .ExperimentalChart {
  height: 460px;
}
.module .ExperimentalResult {
  padding-top: 46px;
  padding-bottom: 30px;
  width: 912px;
  color: #444;
  margin: 0 auto;
  line-height: 24px;
}
.module .wu {
  font-size: 18px;
  text-align: center;
  line-height: 200px;
}
.module .histogramChart {
  height: 458px;
}
.module .postHistogramChart {
  height: 458px;
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
.module .touRed .btRed {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='%23F30' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/%3E%3C/svg%3E")
    repeat-x 0 100%;
  background-size: 20px auto;
  display: inline-block;
  padding-bottom: 4px;
  margin-right: 4px;
}
.x {
  position: absolute;
  right: 32px;
  font-size: 20px;
  cursor: pointer;
}
</style>
