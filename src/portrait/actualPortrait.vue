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
      <p class="title">实战运营</p>
      <p
        v-if="nuber > 0"
        class="ExperimentalResult"
      >{{`${baseInfo.username}实训中涉及：${nuber}个系统的实训实训,达标率为:`}}<span style="color:#0088a0">{{rate}}</span><br>
        {{`${good}实训技能掌握较好；`}}<br />
        {{ `${difference}掌握较差；`}}</p>
      <p
        v-else
        class="wu"
      >暂无数据</p>

      <div
        class="histogramChart"
        ref="histogramChart"
      ></div>
    </div>
    
    <div class="module">
      <p class="title">岗位得分</p>
      <p
        v-if="nuber > 0"
        class="ExperimentalResult"
      >{{`
        ${baseInfo.username}同学实训中涉及10个岗位的技能训练，达标率为：78.6%
        其中推广员、零售店长、物流运输员岗位掌握较好，而零售店员岗位掌握较差；
        `}}<span style="color: #0088a0">{{rate}}</span><br>
        {{`${good}实训技能掌握较好；`}}</p>
      <p v-else-if="difference.length>0">{{ `${difference}掌握较差；`}}</p>
      <p
        v-else
        class="wu"
      >暂无数据</p>
      <div
        class="postHistogramChart"
        ref="postHistogramChart"
      ></div>
    </div>
    <div class="module">
      <p class="title">实战运营积分</p>
      <div
        class="scoreChart"
        ref="scoreChart"
      ></div>
    </div>
  </div>
</template>
<script>
import {
  experimentalTrainingPortrait,
  experimentalTraining,
  getJobScore
} from "../js/url"

export default {
  props: ['baseInfo'],
  name: "PracticalPortrait",
  data () {
    return {
      // 实战运营数据
      dataList: [],
       //  岗位得分数据
      jobScoreList: [],
      // 达标率
      rate: '',
      // 个数
      nuber: 0,
      // 掌握好的
      good: [],
      // 掌握较差
      difference: [],
      // 分数占比
      score_rateArr: []
    }
  },
  mounted () {

    this.getExperimentalTrainingPortraitData();
    this.getExperimentalTrainingData();
    this.getjobScore();
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

    histogramEchart (type_nameArr, scoreArr) {
      // console.log(type_nameArr, scoreArr);

      let histogramChart = this.$echart.init(this.$refs.histogramChart);
      histogramChart.setOption({
        tooltip: {
          trigger: 'axis',
            formatter: (params) => {
            let str = "";
            str += `${params[0].name}<br/>运营得分:${params[0].data}`;
            return str;
          },
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 0,
          left: '100',
          right: '4%',

        },
        xAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              width: 2,
              color: '#408829'
            }
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              width: 2,
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
              width: 2,
              color: '#408829'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#444444',//坐标值得具体的颜色
            }
          },
          data: type_nameArr
        },

        series: [
          {
            name: '分数占比',
            type: 'bar',
            stack: '总量',
            barWidth: 60,
            label: {
              normal: {
                show: true,
                position: 'insideRight',
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ['#a9cba2', '#a9cba2', '#a9cba2', '#a9cba2', '#c2dabd'];
                  return colorList[params.dataIndex];
                }
              }
            },
            data: scoreArr
          },

        ]
      })
    },
     postHistogramEchart (type_nameArr, scoreArr) {   //岗位得分
      console.log(type_nameArr, scoreArr);
      let postHistogramChart = this.$echart.init(this.$refs.postHistogramChart);
      postHistogramChart.setOption({
        tooltip: {
          trigger: 'axis',
            formatter: (params) => {
            let str = "";
            str += `${params[0].name}<br/>岗位得分:${params[0].data}`;
            return str;
          },
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // legend: {
        //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        // },
        grid: {
          top:0,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              width: 2,
              color: '#008acd'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#444444'
            }
          },
        },
        yAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              width: 2,
              color: '#008acd'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#444444'
            }
          },
          data: type_nameArr
        },
        series: [
          {
            // name: '直接访问',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  let colorList = ['#5ab1ef', '#5ab1ef', '#5ab1ef', '#5ab1ef', '#5ab1ef', '#5ab1ef', '#5ab1ef', '#5ab1ef', '#5ab1ef', '#8bc8f3'];
                  return colorList[params.dataIndex];
                }
              }
            },
            data: scoreArr
          }
        ]
      })
    },

    getExperimentalTrainingPortraitData () { // 获取实验实训积分数据
      let { userId, classId } = this.$route.query;
      this.$ajax.get(this.baseUrl + experimentalTrainingPortrait, {
        params: { userId, classId, typeId: 3 }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          let termid = [], integralValue = [], sumIntegralValue = [];
          for (let i = 0; i < data.data.length; i++) {
            termid.push(data.data[i].termid);
            integralValue.push(parseInt(data.data[i].integralValue));
            sumIntegralValue.push(parseInt(data.data[i].sumIntegralValue))
          }
          this.scoreEchart(termid, integralValue, sumIntegralValue);
        }

      })
    },
    getExperimentalTrainingData () { // 获取实战数据
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + experimentalTraining, {
        params: { userId, typeId: 3 }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code = 200) {
          this.dataList = JSON.parse(res.data).data;
          let type_name = [], valueArr = [];
          let type_nameArr = [], scoreArr = [], sum_scoreArr = [];
          let score_rateArr = [];
          for (let i = 0; i < data.data.length; i++) {
            valueArr.push(data.data[i].score)
            score_rateArr.push(data.data[i].score_rate)
            type_name.push({ text: data.data[i].type_name, max: 600 });
            type_nameArr.push(data.data[i].type_name);
            scoreArr.push(parseInt(data.data[i].score));
            sum_scoreArr.push(parseInt(data.data[i].sum_score))
          }
          this.histogramEchart(type_nameArr, score_rateArr)
          this.listdata()
        }


      })
    },
      getjobScore () {             //获取岗位分数
      //  let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + getJobScore, {
        params: { userId: 904 }
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          this.jobScoreList = data.data.scoreListResponseList;
          let post_nameArr = [], post_scoreArr = [];
          // console.log(this.jobScoreList[0].postName);

          for (let i = 0; i < this.jobScoreList.length; i++) {
            post_nameArr.push(this.jobScoreList[i].postName);
            post_scoreArr.push(this.jobScoreList[i].score);
          }
          console.log(post_nameArr,post_scoreArr);

          this.postHistogramEchart(post_nameArr, post_scoreArr);
        }
      })
    },
    listdata () {
      let quanbu = 0;
      let dadao = 0;
      let dataoname = [];
      for (let j = 0; j < this.dataList.length; j++) {
        quanbu += this.dataList[j].score;
        this.nuber++;
        if (this.dataList[j].score >= 60) {

          dadao += this.dataList[j].score;
          dataoname.push(this.dataList[j])
        }
      }
      this.rate = dadao / quanbu * 100 + "%";

      var max;
      for (let i = 0; i < dataoname.length; i++) {
        for (let j = i + 1; j < dataoname.length; j++) {
          if (dataoname[i].score < dataoname[j].score) {
            max = dataoname[i]
            dataoname[i] = dataoname[j]
            dataoname[j] = max
          }
        }
      };
      let go = dataoname.slice(0, 3)
      for (let k = 0; k < go.length; k++) {
        this.good.push(go[k].type_name)
      }
    }
  }
}
</script>
<style>
@import '../style/portrait.css';
.module .scoreChart {
  height: 400px;
}
.module .ExperimentalChart {
  height: 460px;
}
.module .ExperimentalResult {
  padding-top: 46px;
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
</style>
