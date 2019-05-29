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
      <p class="title">任务得分</p>
      <div class="taskShow">
        <div class="grade">
          <div class="bdjt">
            <div class="one"></div>
            <div class="two"></div>
          </div>
        </div>
        <div class="gradeAly">
          <div>
            <p>任务平均分</p>
            <span>{{ pf }}分</span>
          </div>
          <p>超过{{cypf}}%的同学</p>
          <div>
            <p>参与任务数</p>
            <span>{{ counti }}</span>
          </div>
        </div>
        <div
          class="gradeAly"
          style="left:470px"
        >
          <div style="padding-bottom: 0">
            <p>优秀任务占比</p>
            <span>{{ excellent_rate }}%</span>
          </div>
          <div style="padding-bottom: 0">
            <p>良好任务占比</p>
            <span>{{ good_rate}}%</span>
          </div>
          <div style="padding-bottom: 0">
            <p>中等任务占比</p>

            <span>{{ medium_rate }}%</span>
          </div>
        </div>
        <div
          class="taskChart"
          ref="taskChart"
        > </div>
        <div class="persent">
          <div class="presentShow">
            <p :style="{width:excellentPre}">{{excellent_count}}</p>
            <p :style="{width:goodPre}">{{ good_count }}</p>
            <p :style="{width:mediumPre}">{{medium_count}}</p>
          </div>
          <ul>
            <li><span></span>优秀</li>
            <li><span></span>良好</li>
            <li><span></span>中等</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="module">
      <p class="title">软技能得分</p>
      <p class="scoreResult">本平台根据逻辑思维能力、人际交流能力、领导组织能力、适应调整能力、解决问题能力、创新想象能力、学习总结能力、信息收集能力等八项软
        能力对在学徒制过程进行软能力诊断，达标率为：<span>49%</span><br />
      </p>
      <div
        class="scoreChart"
        ref="scoreChart"
      ></div>
      <div
        class="abilityChart"
        ref="abilityChart"
      ></div>
    </div>
    <div
      class="module"
      style="margin-bottom: 0"
    >
      <div class="title">
        课程得分
        <div class="tab">
          <p
            v-for="item,index in tab"
            :class="{'active':inx === index}"
            @click="tabChange(index,item.termnum)"
          >{{ item.title }}</p>
        </div>
      </div>
      <div class="tabWarp">
        <p
          class="noData"
          v-if="courseData.length == 0&& !loading"
        > 暂无数据！ </p>
        <div class="echartBox">
          <div
            class="echartCon"
            v-loading="loading"
            element-loading-text="拼命加载中"
          >
            <div
              class="echatWarp"
              v-for="item,index in courseData"
            >
              <div class="chartTiT">
                <span>{{ item.coursename }}</span>
                <p>平均得分<br>{{item.pf}}</p>
                <p>单元数<br>{{ item.courseUnitCount }}</p>
                <p>任务数<br>{{ item.taskCount }}</p>
                <p style="border: none">任务数<br>{{ item.standardRate }}%</p>
                <button @click="clickHandler(item.courseid)">技能画像</button>
              </div>
              <div
                class="chartRender"
                :class="item.courseid == courseid?'show':''"
              >
                <!--课程雷达图-->
                <div
                  class="kcldtChart"
                  :id="'kcldtChart'+item.courseid"
                ></div>
                <!--课程折现图-->
                <div
                  class="kczxtChart"
                  :id="'kczxtChart'+item.courseid"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  userPortrait,
  courseList,
  skillsPortrait
}
  from "../js/url"
export default {
  props: ["baseInfo"],
  data () {
    return {
      inx: 0,
      excellent_rate: "",//成绩优秀的比例
      good_rate: "",//成绩良好的比例
      medium_rate: "",//成绩中等的比例
      counti: "",//参与任务数量
      excellent_count: "", //成绩优秀的人数
      good_count: "",//成绩良好的人数
      medium_count: '',//成绩中等的人数
      excellentPre: 0,
      goodPre: 0,
      mediumPre: 0,
      tab: [
        { title: "全部", termnum: null },
        { title: "第一学期", termnum: 1 },
        { title: "第二学期", termnum: 2 },
        { title: "第三学期", termnum: 3 },
        { title: "第四学期", termnum: 4 },
        { title: "第五学期", termnum: 5 },
        { title: "第六学期", termnum: 6 },
        { title: "第七学期", termnum: 7 },
        { title: "第八学期", termnum: 6 },
      ],
      cypf: "", // 超越百分之多少的人
      pf: "",  // 任务平均分
      courseData: [],
      courseid: "",
      loading: true,

    }
  },
  mounted () {
    this.getuserPortraitData();
    this.getCourseListData(null);

  },
  methods: {
    tackEchart (excellent_rate, good_rate, medium_rate) { //任务得分
      let taskChart = this.$echart.init(this.$refs.taskChart);
      taskChart.setOption({
        series: [
          {
            name: '任务得分',
            type: 'pie',
            radius: ['30%', '50%'],
            avoidLabelOverlap: false,
            center: ['38%', '50%'],
            itemStyle: {
              normal: {
                label: {        //此处为指示线文字
                  show: true,
                  position: 'inner', //标签的位置
                },
                labelLine: {    //指示线状态
                  show: true,
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              }
            },
            color: ["#7384f4", "#7edfb4", "#f09796"],
            data: [
              { value: good_rate, name: '良好' },
              { value: excellent_rate, name: '优秀' },
              { value: medium_rate, name: '中等' }
            ]
          }
        ]
      })
    },
    scoreEchart (pf) { // 软技能得分雷达图
      let scoreChart = this.$echart.init(this.$refs.scoreChart);
      scoreChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        textStyle: {
          color: '#444444'
        },
        radar: [
          {
            indicator: [
              { text: '逻辑思维', max: 100 },
              { text: '人际交流', max: 100 },
              { text: '领导组织', max: 100 },
              { text: '适应调整', max: 100 },
              { text: '解决问题', max: 100 },
              { text: '创新想象', max: 100 },
              { text: '学习总结', max: 100 },
              { text: '信息收集', max: 100 },
            ],
            splitLine: {
              show: true,    //去掉网格线
              lineStyle: {
                width: 4,
                color: "#adb8ff"
              }
            },
            splitArea: {
              areaStyle: {
                color: ["#fff", "#e2e6ff"]
              }
            }
          }
        ],
        color: "#a7e2ef",
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },

            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [
              {
                value: pf,
                name: '实验实训'
              }
            ]
          }
        ]
      })
    },
    abilityEChart (pfArr, pfbzArr) { //软技能得分柱状图
      let abilityChart = this.$echart.init(this.$refs.abilityChart);
      abilityChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 20,
          left: '100',
          right: '4%',
          bottom: 30
        },
        xAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              width: 4,
              color: '#5ac1e9'
            }
          },
          splitLine: {
            lineStyle: {
              type: "solid",
              width: 2,
              color: "#fff"
            }
          },
          axisLabel: {
            textStyle: {
              color: '#444444',//坐标值得具体的颜色
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              width: 4,
              color: '#5ac1e9'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#444444',//坐标值得具体的颜色
            }
          },
          data: ['逻辑思维', '人际交流', '领导组织', '适应调整', '解决问题', '创新想象', '学习总结', '信息收集'],
        },
        backgroundColor: "#cbe7f2",
        borderRadius: 10,
        series: [
          {
            name: '得分',
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            label: {
              normal: {
                show: true,
                position: 'insideRight',
              }
            },
            itemStyle: {
              normal: {
                color: '#7384f4',
                barBorderRadius: [4, 4, 4, 4],
              }
            },
            data: pfArr
          },
          {
            name: '总分',
            type: 'bar',
            stack: '总量',
            barWidth: 60,
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            itemStyle: {
              normal: {
                color: '#5ac1e9',
                barBorderRadius: [4, 4, 4, 4],
              }
            },
            data: pfbzArr
          }
        ]
      })
    },
    kcldtEchart (taskName, pf, allPf, courseid) { //课程雷达图
      let kcldtChart = this.$echart.init(document.getElementById("kcldtChart" + courseid));
      kcldtChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        textStyle: {
          color: '#444444'
        },
        radar: [
          {
            indicator: taskName,
            splitLine: {
              show: true,    //去掉网格线
              lineStyle: {
                width: 4,
                color: "#f09796"
              }
            },
            splitArea: {
              areaStyle: {
                color: ["#fff", "#f6dcdc"]
              }
            },
            radius: 120,
          },

        ],
        color: "#a7e2ef",
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },

            itemStyle: {              normal: {
                areaStyle: { type: 'default', color: "#79cec1" }
              }            },
            data: [
              {
                value: pf,
                name: '实验实训'
              }
            ]
          }, {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },

            itemStyle: { normal: { areaStyle: { type: 'default', color: "#73bbce" } } },
            data: [
              {
                value: allPf,
                name: '实验实训'
              }
            ]
          }
        ]
      });
    },
    kczxtEchart (pf, courseid) { // 课程得分折现图
      let kczxtChart = this.$echart.init(document.getElementById("kczxtChart" + courseid));
      kczxtChart.setOption({
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              width: 4,
              color: '#5ac1e9'
            }
          },
          data: []
        },
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            return `平均分：${params.value}`
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              width: 4,
              color: '#5ac1e9'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#444444',//坐标值得具体的颜色
            }
          },
          splitLine: {
            show: false
          },
        },
        series: [{
          symbol: 'emptyCircle',
          symbolSize: 8,
          itemStyle: {
            normal: {
              color: '#7384f4',
              lineStyle: {
                color: '#7384f4',
                width: 4,
              }
            }
          },
          data: pf,
          type: 'line'
        }]
      });
    },
    tabChange (index, termnum) {
      this.inx = index;
      this.courseid = "";
      this.getCourseListData(termnum);
    },
    clickHandler (courseid) {
      if (this.courseid == courseid) {
        this.courseid = '关闭';
      } else {
        this.courseid = courseid
        this.getSkillsPortrait(courseid)
      }
    },

    getuserPortraitData () { // 获取用户画像数据
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + userPortrait, {
        params: { userId }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          let excellent_rate = parseInt(data.data.excellent_rate);//成绩优秀的比例
          let good_rate = parseInt(data.data.good_rate); //成绩良好的比例
          let medium_rate = parseInt(data.data.medium_rate);//成绩中等的比例
          this.excellent_rate = excellent_rate;
          this.good_rate = good_rate;
          this.medium_rate = medium_rate;
          this.excellent_count = parseInt(data.data.excellent_count); //成绩优秀的人数
          this.good_count = parseInt(data.data.good_count); //成绩良好的人数
          this.medium_count = parseInt(data.data.medium_count); //成绩中等的人数
          let total = this.excellent_count + this.good_count + this.medium_count;
          this.excellentPre = this.commonJs.percentNum(this.excellent_count, total);
          this.goodPre = this.commonJs.percentNum(this.good_count, total);
          this.mediumPre = this.commonJs.percentNum(this.medium_count, total);
          this.cypf = data.data.cypf;
          this.pf = parseInt(data.data.pf);
          this.counti = data.data.counti;
          this.tackEchart(excellent_rate, good_rate, medium_rate)
          let pfArr = [
            data.data.pf31,
            data.data.pf32,
            data.data.pf33,
            data.data.pf34,
            data.data.pf35,
            data.data.pf36,
            data.data.pf37,
            data.data.pf38
          ];
          let pfbzArr = [
            data.data.pfbz31,
            data.data.pfbz32,
            data.data.pfbz33,
            data.data.pfbz34,
            data.data.pfbz35,
            data.data.pfbz36,
            data.data.pfbz37,
            data.data.pfbz38
          ];
          this.scoreEchart(pfArr);
          this.abilityEChart(pfArr, pfbzArr)
        }
      })
    },
    getCourseListData (termnum) { //获取课程得分数据
      this.loading = true;
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + courseList, {
        params: {
          userId,
          termnum
        }
      }).then(res => {
        this.loading = false;
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          data.data.map((item) => {
            return item.standardRate == parseFloat(item.standardRate)
          });
          this.courseData = data.data;
        }
      })
    },
    getSkillsPortrait (courseid) { // 获取技能画像数据
      let { userId, classId } = this.$route.query;
      this.$ajax.get(this.baseUrl + skillsPortrait, {
        params: {
          userId,
          classid: classId,
          courseid: courseid
        }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          let taskName = [], pf = [], allPf = [];
          for (let i = 0; i < data.data.length; i++) {
            taskName.push({ text: data.data[i].taskName, max: 100 })
            pf.push(data.data[i].pf);
            allPf.push(data.data[i].allPf)
          }
          this.kczxtEchart(pf, courseid);
          console.log(pf, allPf)
          this.kcldtEchart(taskName, pf, allPf, courseid)

        }
      })
    }
  }
}
</script>
<style>
@import '../style/portrait.css';
.module {
  position: relative;
}
.module .title {
  position: relative;
}
.module .taskShow {
  display: flex;
  height: 400px;
  position: relative;
}
.module .taskShow .taskChart {
  width: 420px;
  border-right: 2px solid #dcdcdc;
}
.module .taskShow .grade {
  position: absolute;
  width: 218px;
  height: 216px;
  border: 4px solid #5fc3ea;
  border-radius: 50%;
  top: 88px;
  left: 46px;
}
.module .taskShow .grade .bdjt {
  width: 40px;
  height: 60px;
  position: absolute;
  top: 78px;
      left: 85px;
}
.module .taskShow .grade .bdjt .one {
  width: 100%;
    height: 33px;
  background: url('../assets/images/bd.png')16px 16px no-repeat;
}
.module .taskShow .grade .bdjt .two {
  height: 100%;
  width: 100%;
  background: url('../assets/images/jt.png')0px -1px no-repeat;
}
.module .taskShow .gradeAly {
  width: 144px;
  left: 295px;
  position: absolute;
  top: 73px;
  padding-top: 30px;
}
.module .taskShow .gradeAly > div {
  padding-top: 30px;
  padding-bottom: 20px;
}
.module .taskShow .gradeAly > div > p {
  color: #444;
  padding-bottom: 4px;
}
.module .taskShow .gradeAly > div > span {
  color: #10859d;
  font-weight: bold;
}
.module .taskShow .gradeAly > p {
  color: #e64f15;
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 20px;
}
.module .taskShow .persent {
  width: 370px;
  height: 118px;
  top: 174px;
  right: 22px;
  position: absolute;
}
.module .taskShow .persent .presentShow {
  overflow: hidden;
  border-radius: 4px;
  display: flex;
}
.module .taskShow .persent .presentShow > p {
  text-align: center;
  color: #fff;
  height: 47px;
  line-height: 47px;
  width: 0;
  transition: width 0.6s;
}
.module .taskShow .persent .presentShow > p:nth-child(1) {
  width: 95px;
  background-color: #7edfb4;
}
.module .taskShow .persent .presentShow > p:nth-child(2) {
  width: 155px;
  background-color: #7384f4;
}
.module .taskShow .persent .presentShow > p:nth-child(3) {
  width: 128px;
  background-color: #f09796;
}
.module .taskShow .persent > ul {
  width: 200px;
  margin: 0 200px;
  display: flex;
  margin: 0 auto;
  padding-top: 40px;
}
.module .taskShow .persent > ul li {
  line-height: 28px;
  height: 28px;
  font-size: 13px;
  padding-right: 4px;
}
.module .taskShow .persent > ul li span {
  display: inline-block;
  width: 28px;
  height: 28px;
  float: left;
  margin-right: 4px;
}
.module .taskShow .persent > ul li:nth-child(1) span {
  background-color: #7edfb4;
}
.module .taskShow .persent > ul li:nth-child(2) span {
  background-color: #7384f4;
}
.module .taskShow .persent > ul li:nth-child(3) span {
  background-color: #f09796;
}
.module .scoreResult {
  padding-top: 46px;
  padding-bottom: 30px;
  width: 912px;
  color: #444;
  margin: 0 auto;
  line-height: 24px;
}
.module .scoreResult span {
  color: #10859d;
  font-weight: bold;
}
.module .scoreChart {
  height: 438px;
}
.module .abilityChart {
  height: 326px;
  width: 926px;
  margin: 0 auto;
  padding-bottom: 46px;
  border-radius: 10px;
}
.module .abilityChart canvas {
  border-radius: 10px;
}
.module .title .tab {
  position: absolute;
  top: 0;
  right: 0;
}
.module .title .tab p {
  width: 96px;
  text-align: center;
  height: 42px;
  line-height: 42px;
  float: left;
  color: #444;
  cursor: pointer;
}
.module .title .tab .active {
  color: #10859d;
  border-bottom: 4px solid #10859d;
}
.tabWarp .echartBox {
}
.tabWarp .echartBox .echartCon {
  padding: 30px 0;
}
.tabWarp .echartBox .echartCon .echatWarp .chartTiT {
  display: flex;
  padding: 0 20px;
}
.tabWarp .echartBox .echartCon .echatWarp .chartTiT span {
  display: block;
  font-weight: bold;
  color: #10859d;
  padding-left: 26px;
  line-height: 60px;
  width: 100px;
}
.tabWarp .echartBox .echartCon .echatWarp .chartTiT p {
  width: 156px;
  text-align: center;
  height: 50px;
  padding: 5px 0;
  line-height: 26px;
  border-right: 2px solid #dadada;
  color: #444;
}
.tabWarp .echartBox .echartCon .echatWarp .chartTiT button {
  width: 140px;
  height: 42px;
  text-align: center;
  line-height: 42px;
  background-color: #10859d;
  border-radius: 4px;
  margin-top: 10px;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.tabWarp .echartBox .echartCon .echatWarp .chartRender {
  display: flex;
  height: 0px;
  overflow: hidden;
  background-color: #f9f9f9;
  transition: height 0.4s;
}
.tabWarp .echartBox .echartCon .echatWarp .show {
  height: 450px;
}
.tabWarp .echartBox .echartCon .echatWarp .chartRender .kcldtChart,
.tabWarp .echartBox .echartCon .echatWarp .chartRender .kczxtChart {
  flex: 1;
  width: 490px;
  height: 450px;
}
</style>
