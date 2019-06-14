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

    <div class="scoreBoxsm">
      <div class="module">
        <p class="title">创业知识跟踪</p>
        <div class="follow">
          <p>创业通识<br /><span>{{pioneerGeneral}}%</span></p>
          <p>创业计划书<br /><span>{{ pioneerPlan }}%</span></p>
          <div ref="follow1"></div>
          <div ref="follow2"></div>
        </div>
      </div>
      <div class="module">
        <p class="title">项目参与</p>
        <div class="join">
          <p>创业计划书</p>
          <p>创业参与项目</p>
          <span>创业项目发布数为{{pioneerRelease}}个，参与数为{{pioneerParticipate}}个</span>
          <div ref="join1">1</div>
          <div ref="join2">2</div>
        </div>
      </div>
    </div>

    <div class="module">
      <p class="title">创业积分</p>
      <div
        class="scoreChart"
        ref="scoreChart"
      ></div>
    </div>
  </div>
</template>

<script>
import { entrepreneurPortrait, pioneerInfo } from "../js/url";
export default {
  props: ["baseInfo"],
  name: "EntrepreneurialPortrait",
  data () {
    return {
      pioneerGeneral: "",
      pioneerPlan: '',

      pioneerRelease: "",//创业项目发布数
      pioneerParticipate: "" //pioneerParticipate
    }
  },
  mounted () {


    this.getEntrepreneurPortraitData();
    this.getPioneerInfo()
  },
  methods: {
    scoreEchart (termid, integralValue, sumIntegralValue) { // 综合能力
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

    followEchart (el, title, color, colorArr, data) { // 创业知识跟踪
      let followChart = this.$echart.init(el, title, color, colorArr, data);
      console.log(data)
      followChart.setOption({
        title: {
          text: title,
          x: "center",
          fontWeight: "normal",
          textStyle: {
            fontWeight: 'normal',
          }
        },
        color: colorArr,
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
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
      })
    },
    joinEchart (el, color, value, item) {
      let joinChart = this.$echart.init(el);
      joinChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        color: color,
        series: [
          {
            type: 'pie',
            radius: '55%',
            label: {
              normal: {
                show: false
              }
            },
            center: ['50%', '60%'],
            data: [
              { value: value, name: item },
            ],
          }
        ]
      })
    },
    getEntrepreneurPortraitData () { // 获取创业积分数据
      let { userId, classId } = this.$route.query;
      this.$ajax.get(this.baseUrl + entrepreneurPortrait, {
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


    getPioneerInfo () { //获取创业知识跟踪与项目参与
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + pioneerInfo, {
        params: { userId }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          console.log(data.data);
          this.pioneerGeneral = data.data[0].pioneerGeneral; //创业通识学习完成度
          this.pioneerPlan = data.data[0].pioneerPlan;//创业计划书完成度
          this.pioneerRelease = data.data[0].pioneerRelease;//创业项目发布数
          this.pioneerParticipate = data.data[0].pioneerParticipate //pioneerParticipate
          this.followEchart(
            this.$refs.follow1,
            `创业通识学习完成度${this.pioneerGeneral}%`,
            "#7384f4",
            ["#7384f4", '#dadada'],
            [{ value: this.pioneerGeneral, name: '' }, { value: 100 - this.pioneerGeneral, name: '' }]
          );
          this.followEchart(
            this.$refs.follow2,
            `创业计划书学习完成度${this.pioneerPlan}%`,
            "#7edfb4",
            ["#7edfb4", '#dadada'],
            [{ value: this.pioneerPlan, name: '直接访问' }, { value: 100 - this.pioneerPlan, name: '' }]
          );
          this.joinEchart(this.$refs.join1, "#7384f4", this.pioneerParticipate, "创业项目参与数");
          this.joinEchart(this.$refs.join2, "#7edfb4", this.pioneerRelease, "创业项目发布数");
        }
      })
    }
  }
}
</script>
<style>
@import '../style/portrait.css';
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
</style>
