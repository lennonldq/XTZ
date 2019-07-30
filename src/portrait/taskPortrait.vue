<template>
  <div class="main">
    <div class="header">
      <div class="titleBox">
        <div>
            <img v-if="baseInfo.photo" :src="`https://etech-edu.com/${baseInfo.photo}`" alt="">
           <img v-else src="../assets/images/pho.png" alt="">
        </div>
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
            <div
        class="synchronization"
        @click="synchronization()"
      >
        <div class="one">同步数据</div>
        <div class="two" v-if="gtime">上次同步:{{gtime | gTime}} </div>
      </div>
    </div>

    <div class="module">
      <p class="title">任务外包情况</p>
      <p
        class="scoreDetail"
        v-if="joinItem.length >0"
      >
        {{`参与项目： ${joinItem} `}}
      </p>
      <div
        class="echartBox"
        v-if="joinItem"
      >
        <div class="type">
          <p>报名/任务参与类型</p>
          <div class="present">
            <p :style="{width: project_count1_present}">{{ project_count1 }}个</p>
            <p :style="{width: project_count2_present}">{{ project_count2 }}个</p>
          </div>
          <div class="presentItem">
            <div style="width: 50%">
              <div
                class="LEF"
                style="width: 40px;
                  height: 20px;
                    background-color: #7384f4;
                    margin: 20px 10px 20px 30px;"
              ></div>
              个人参与
            </div>
            <div style="width: 50%">
              <div class="RIT"
              style="width: 40px;
                  height: 20px;
                    background-color: #5ac1e9;
                   margin: 20px 10px 20px 30px;"></div>
              团队参与
            </div>
          </div>
        </div>
        <div
          class="taskChart"
          ref="taskChart"
        ></div>
      </div>
      <div
        style="line-height: 80px;
    text-align: center;"
        v-else
      >
        <p>无具体数据</p>
      </div>
    </div>

    <div class="module">
      <div class="title integral">
        <div class="LEF">任务外包积分情况</div>
        <div class="RIT">
          <span>当前任务外包积分:&nbsp;{{jicurrent}}分</span>
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
 v-model="shu"
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
       
        <button
          class="tanBtn"
          @click="seachData"
        >搜索</button>
        <div class="x" @click="shu = false">X</div>
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
import {
  taskOutsourcing,
  enterpriseOutsourcing,
  taskJoinNumber,
  taskJoinInfo,
  semester,
  curriculum,
  integralStatistics,
  updateData,
  selectSynchroLog,
assessModules
} from "../js/url"
export default {
  props: ['baseInfo'],
  name: 'TaskPortrait',
  components: {
    Pagination
  },
  data () {
    return {
      // 弹框数据
        shu:false,
      sendIntegralData: {
        userId: "",
        termid: '',//学期选择
        pageNum: 1,
        pageSize: 10,
        assessModuleId: 6
      },
      // 获取的学期
      semesterList: [
        {termName:"全部学期",termid:""}
      ],

    
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

      sumProjectCount: 0,//参与项目数
      joinItem: [],
      project_count1_present: "",
      project_count2_present: "",
      project_count1: "",
      project_count2: "",
      //更新数据时间
      gtime: '',
       // 当前积分
      jicurrent: ''

    }
  },
  mounted () {
    // 强制刷新一遍
    // this.shua();
    this.getTaskJoinNumberData();
    this.getsemester();
    this.getIntegralStatistics();
    this.getTaskOutsourcingData();
    this.getEnterpriseOutsourcingData();
    this.getTaskJoinInfoData();
    this.Updatetime();
     this.getPortrait();
  },
  methods: {
    shua(){
location. reload()
this.$router.go(0)
    },
    scoreEchart (termid, integralValue, sumIntegralValue) { // 任务外包积分
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
          trigger: 'axis'
        },

        toolbox: {
          show: true,
        },
        legend: {
          data: ['个人积分', '班级平均积分'],
          icon: "rect",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          y: "30",
          itemWidth: 20,

          itemHeight: 10,

          itemGap: 40,
          textStyle: { fontSize: 16 }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: termid,
             axisLine: {
              lineStyle: {
                color: '#008acd',
                width: 2,//这里是为了突出显示加上的
              }
            },
             axisLabel: {
              color: "#333333" //刻度线标签颜色
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
             axisLine: {
              lineStyle: {
                color: '#008acd',
                width: 2,//这里是为了突出显示加上的
              }
            },
             axisLabel: {
              color: "#333333" //刻度线标签颜色
            }
          }
        ],
        series: [
          {
            name: '个人积分',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: { type: 'default' }, 
                color: '#90dcdd',
                  lineStyle: {
                color: "#3bc7cb"
            }
              }
            },
            data: integralValue
          },
          {
            name: '班级平均积分',
            type: 'line',
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' }, color: '#d7cdeb', lineStyle: {
                color: "#b6a2de"
            } } },
            data: sumIntegralValue
          },

        ]
      })
    },
    taskEchart (begin_date, project_count, sum_project_count) { //任务外包积分柱状图
      let taskChart = this.$echart.init(this.$refs.taskChart);
      taskChart.setOption({
        title: {
          text: `报名/参与项目数：${sum_project_count}个`,
          x: "center",
          y: 32,
          textStyle: {
            fontWeight: 'normal',
          }
        },
        xAxis: {
          type: 'category',
          data: begin_date,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 4,
              color: '#5ac1e9'
            }
          },
          axisLabel: {
            textStyle: {
              fontWeight: 'bold',
              fontSize: 16,
              color: '#444',//坐标值得具体的颜色
            }
          }
        },
        grid: {
          left: 40,
          top: 120,
          bottom: 50,
          right: 10
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: 4,
              color: '#5ac1e9'
            }
          },
          axisLabel: {
            textStyle: {
              fontWeight: 'bold',
              fontSize: 16,
              color: '#444',//坐标值得具体的颜色
            }
          }
        },
        series: [{
          data: project_count,
          barWidth: 40,
          type: 'bar',
          label: {
            normal: {
              show: true,            //显示数字
              position: 'top',
              fontWeight: "bold",
              fontSize: 16,
              color: "#444"
            }
          },
          itemStyle: {
            normal: {
              color: '#f09796'
            }
          }
        }]
      })
    },

    getTaskOutsourcingData () { //获取任务外包积分数据
      let { userId, classId } = this.$route.query;
      this.$ajax.get(this.baseUrl + taskOutsourcing, {
        params: {
          userId, classId
        }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          let termid = [], integralValue = [], sumIntegralValue = [];
          for (let i = 0; i < data.data.length; i++) {
            termid.push(data.data[i].termid);
            integralValue.push(parseInt(data.data[i].integralValue));
            sumIntegralValue.push(parseInt(data.data[i].sumIntegralValue));
          }
          this.scoreEchart(termid, integralValue, sumIntegralValue);
        }
      })
    },
    getEnterpriseOutsourcingData () {   //任务外包情况
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + enterpriseOutsourcing, {
        params: {          userId
        }
      }).then(res => {
        let data = JSON.parse(res.data);


        if (data.code == 200) {
          for (let i = 0; i < data.data.length; i++) {
            this.joinItem.push(data.data[i] + '、')
          }
        }
      })
    },
    getTaskJoinNumberData () { //获取参与项目数量
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + taskJoinNumber, {
        params: { userId }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          let begin_date = [], project_count = [];
          for (let i = 0; i < data.data.length; i++) {
            begin_date.push(data.data[i].begin_date);
            project_count.push(parseInt(data.data[i].project_count))
          }
          this.taskEchart(begin_date, project_count, data.data[0].sum_project_count);
        }

      })
    },
    getTaskJoinInfoData () { // 获取任务参与情况数据
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + taskJoinInfo, {
        params: { userId }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          let [project_count1, project_count2] = [parseInt(data.data.project_count1), parseInt(data.data.project_count2)];
          let total = project_count1 + project_count2;
          this.project_count1_present = this.commonJs.percentNum(project_count1, total);
          this.project_count2_present = this.commonJs.percentNum(project_count2, total);
          this.project_count1 = project_count1;
          this.project_count2 = project_count2;
        }
      })
    },
    //获取学期接口
    getsemester () {
      // this.shua();
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + semester, {
        params: { userId }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
        for (let i = 0; i < data.data.length; i++) {
             this.semesterList.push(data.data[i]);
         }
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
    },
    // 点击更新同步数据
    synchronization () {
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + updateData, {
        params: { userId, assessModuleId: 6 }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          location.reload()
          this.$router.go(0)
        }
      }).catch(err=>{
           this.$message.error('同步失败请联系管理员');
      })

    },
getPortrait () { //获取当前积分
      this.$ajax.get(this.baseUrl + assessModules, { params: this.$route.query }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
            for (let i = 0; i < data.data.length; i++) {
            if(data.data[i].assessModuleId == 6){
               this.jicurrent = data.data[i].integralValue;
            }
            
          }
        }
      })
    },
    // 同步数据时间获取
    Updatetime () {
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + selectSynchroLog, {
        params: {
          assessModuleId: 6,
          userId
        }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          this.gtime = data.data.createtime

        }
      })
    },

  }
}
</script>
<style scoped>
@import '../style/portrait.css';
.module .scoreChart {
  height: 450px;
}
.module .scoreDetail {
  padding-top: 46px;
  width: 912px;
  color: #444;
  margin: 0 auto;
  line-height: 24px;
}
.module .echartBox {
  display: flex;
  width: 910px;
  margin: 0 auto;
}
.module .echartBox .type {
  padding-top: 114px;
  width: 50%;
}
.module .echartBox .type > p {
  text-indent: 130px;
  line-height: 80px;
}
.module .echartBox .type .present {
  display: flex;
  width: 345px;
  height: 47px;
  line-height: 47px;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  color: #fff;
  font-weight: bold;
}
.module .echartBox .type .present p {
  transition: 0.6s width;
  width: 0;
}
.module .echartBox .type .present p:nth-child(1) {
  background-color: #7384f4;
}
.module .echartBox .type .present p:nth-child(2) {
  background-color: #5ac1e9;
}
.module .echartBox .type .presentItem {
  width: 345px;
  display: flex;
}
.module .echartBox .type .presentItem > div {
  /* /* display: inline-block;
  float: left; */
  line-height: 60px;
  display: flex;
}
.module .echartBox .type .presentItem p:nth-child(1) {
  text-align: center;
}
.module .echartBox .type .presentItem p:nth-child(2) {
  text-align: right;
}
.module .echartBox .taskChart {
  width: 50%;
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
.x{
      position: absolute;
    right: 32px;
    font-size: 20px;
    cursor: pointer;
}
</style>
