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
    </div>

    <div class="module">
      <p class="title">实习情况</p>

      <div v-if="situtationData.length > 0">
        <div class="detail">
          <p>实习评分：<span>{{evaluate.practiceScore}}</span>分</p>
          <p>实习评价：{{evaluate.practiceEvaluation}}</p>
        </div>
        <div class="situtation">
          <div
            class="situtationItem"
            :class="{'typeName':item.typeName=='实习'}"
            v-for="item in situtationData"
          >
            <p class="job">{{ item.postName }}</p>
            <p class="company">{{ item.companyName }}</p>
            <span class="date icon">{{ item.beginDate }}</span>
            <span
              class="date"
              v-if="item.endDate"
            >{{'-'+item.endDate }}</span>
          </div>
        </div>
      </div>
      <div
        class="wei"
        v-else
      >
        未有具体数据
      </div>
    </div>

    <div class="module">
      <div class="title integral">
        <div class="LEF">创业积分情况</div>
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
</template>

<script>
import Pagination from "../views/pagination";
import { practicePortrait, practiceInfoD, getPracticeInfo,semester,
  curriculum,
  integralStatistics } from "../js/url"
export default {
  props: ['baseInfo'],
  name: "EmploymentPortrait",
  components: {
    Pagination
  },
  data () {
    return {
      situtationData: [],
      // 评语
      evaluate: '',
       // 弹框数据
      sendIntegralData: {
        userId: "",
        termid: '',//学期选择
        courseid: '',//课程选择
        pageNum: 1,
        pageSize: 10,
        assessModuleId:7
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
    }
  },
  mounted () {
        this.getsemester();
    this.getcurriculum();
    this.getIntegralStatistics();
    this.getPracticePortraitData();
    this.getPracticeInfoData();
    this.PracticeInfoData();
  },
  methods: {
    scoreEchart (termid, integralValue, sumIntegralValue) { // 实习积分
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
    getPracticePortraitData () { // 获取实习积分数据
      let { userId, classId } = this.$route.query;
      this.$ajax.get(this.baseUrl + practicePortrait, {
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
          this.scoreEchart(termid, integralValue, sumIntegralValue)
        }
      })
    },
    getPracticeInfoData () { // 获取实习情况数据
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + practiceInfoD, {
        params: { userId }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          data.data.forEach(item => {
            item.beginDate = item.beginDate.substring(0, 10);
            if (item.endDate) {
              item.endDate = item.endDate.substring(0, 10)
            } else {
              item.endDate = "就职中"
            }
          })
          this.situtationData = data.data;
          //  console.log(data.data)
        }
      })
    },
    PracticeInfoData () {//获取实习情况评分
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + getPracticeInfo, {
        params: { userId }
      }).then(res => {
        this.evaluate = JSON.parse(res.data).data
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
        console.log(data);

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
<style>
@import '../style/portrait.css';
.module .scoreChart {
  height: 400px;
}
.module .detail {
  width: 940px;
  margin: 0 auto;
  font-size: 13px;
  line-height: 24px;
  padding-top: 4px;
}
.module .wei {
  text-align: center;
  line-height: 320px;
}
.module .detail p span {
  color: #2e8ea4;
  font-weight: bold;
}
.module .situtation {
  width: 940px;
  margin: 0 auto;
  padding: 30px 0;
  overflow: hidden;
}
.module .situtation .typeName {
  background: url('../assets/images/sx.png') 174px 10px no-repeat;
}
.module .situtation .situtationItem {
  width: 203px;
  height: 68px;
  background-color: #10859d;
  border-radius: 10px;
  color: #fff;
  padding: 10px;
  float: left;
  margin-right: 16px;
  margin-bottom: 16px;
}

.module .situtation div:nth-child(4n) {
  margin-right: 0;
}
.module .situtation .situtationItem .job {
  padding-bottom: 10px;
  font-size: 13px;
}
.module .situtation .situtationItem .company {
  padding-bottom: 12px;
  font-size: 14px;
}
.module .situtation .situtationItem .date {
  font-size: 15px;
  display: inline-block;
  padding-top: 2px;
}
.module .situtation .situtationItem .icon {
  padding-left: 20px;
  background: url('../assets/images/time.png') 0 center no-repeat;
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
</style>
