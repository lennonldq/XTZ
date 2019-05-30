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
      <p class="title">实验实训积分</p>
      <div
        class="scoreChart"
        ref="scoreChart"
      ></div>
    </div>
    <div
      class="module"
      style="margin-bottom: 0"
    >
      <p class="title">实验实训</p>
      <p v-if="nuber > 0" class="ExperimentalResult">{{`${baseInfo.username}实训中涉及：${nuber}个系统的实训实训,达标率为:`}}<span style="color: #0088a0">{{rate}}</span><br>
        {{`${good}实训技能掌握较好；`}}<br />
        {{ `${difference}掌握较差；`}}</p>
        <p v-else class="wu">暂无数据</p>
      <div
        class="ExperimentalChart"
        ref="ExperimentalChart"
      ></div>
      <div
        class="histogramChart"
        ref="histogramChart"
      ></div>
    </div>
  </div>
</template>
<script>
import {
  experimentalTrainingPortrait,
  experimentalTraining
} from "../js/url"

export default {
  props: ['baseInfo'],
  name: "PracticalPortrait",
  data () {
    return {
      // 实验实训数据
      dataList: [],
      // 达标率
      rate: '',
      // 个数
      nuber: 0,
      // 掌握好的
      good: [],
      // 掌握较差
      difference: [],
      // 分数占比
      score_rateArr:[]
    }
  },
  mounted () {

    this.getExperimentalTrainingPortraitData();
    this.getExperimentalTrainingData();

  },
  methods: {
    scoreEchart (termid, integralValue, sumIntegralValue) { // 综合能力
      let scoreChart = this.$echart.init(this.$refs.scoreChart);
      scoreChart.setOption({
        grid: {
          left: 60,
          right: 20,
          top: 50,
          bottom: 50
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let str = "";
            let arr = ["实训积分", "班级平均积分"];
            for (let i = 0; i < params.length; i++) {
              str += `${this.baseInfo.username}${arr[i]}:${params[i].value}分<br>`
            }
            return str;
          },
        },
        xAxis: {
          name: "x",
          type: 'category',
          data: termid,
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
          }
        },
        yAxis: {
          name: "y",
          type: 'value',
          splitLine: {
            show: false,
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ["#cbe7f2", "#fff"]
            }
          },
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
          }
        },
        series: [{
          data: integralValue,
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#fc703a'
              }
            }
          },
        }, {
          data: sumIntegralValue,
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#6dc2b4'
              }
            }
          },
        }]
      })
    },
    ExperimentalEchart (type_name, valueArr) { // 实验实训
      let ExperimentalChart = this.$echart.init(this.$refs.ExperimentalChart);
      ExperimentalChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        textStyle: {
          color: '#444444'
        },
        radar: [
          {
            indicator: type_name,
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
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [
              {
                value: valueArr,
                name: '实验实训'
              }
            ]
          }
        ]
      })
    },
    histogramEchart (type_nameArr, scoreArr, sum_scoreArr,score_rateArr) {
      let histogramChart = this.$echart.init(this.$refs.histogramChart);
      console.log(score_rateArr);
      
      histogramChart.setOption({
        tooltip: {
          trigger: 'axis',
         formatter: (params)=> {
              let str = "";
              str += `分数百分比:${score_rateArr[params[1].dataIndex]}%<br/>`;
              str += `平均分:${params[1].value}`;
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
              width: 4,
              color: '#5ac1e9'
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
              width: 4,
              color: '#5ac1e9'
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
                color: "#5ac1e9",
              }
            },
            data: scoreArr
          },
          {
            name: '平均分',
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
                color: "#7edfb4",
              }
            },
            data: sum_scoreArr
          }
        ]
      })
    },

    getExperimentalTrainingPortraitData () { // 获取实验实训积分数据
      let { userId, classId } = this.$route.query;
      this.$ajax.get(this.baseUrl + experimentalTrainingPortrait, {
        params: { userId, classId, typeId: 2 }
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
    getExperimentalTrainingData () { // 获取实验数据
      let { userId } = this.$route.query;
      this.$ajax.get(this.baseUrl + experimentalTraining, {
        params: { userId, typeId: 2 }
      }).then(res => {

        let data = JSON.parse(res.data);
        if (data.code = 200) {
          this.dataList = JSON.parse(res.data).data;
          let type_name = [], valueArr = [];
          let type_nameArr = [], scoreArr = [], sum_scoreArr = [];
          let score_rateArr=[];
          for (let i = 0; i < data.data.length; i++) {
              score_rateArr.push(data.data[i].score_rate)
            valueArr.push(data.data[i].score)
            type_name.push({ text: data.data[i].type_name, max: 600 });
            type_nameArr.push(data.data[i].type_name);
            scoreArr.push(parseInt(data.data[i].score));
            sum_scoreArr.push(parseInt(data.data[i].sum_score))
          }
          console.log(score_rateArr);
          
          
  
          this.ExperimentalEchart(type_name, valueArr);
          this.histogramEchart(type_nameArr, scoreArr, sum_scoreArr,score_rateArr);
          this.listdata()
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
.module .wu{
  font-size: 18px;
  text-align: center;
  line-height: 200px;
}
.module .histogramChart {
  height: 458px;
}
</style>
