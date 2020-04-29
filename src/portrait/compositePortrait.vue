<template>
  <div class="main">
    <div class="header">
      <div class="titleBox">
        <div>
          <img v-if="baseInfo.photo"
               :src="`https://etech-edu.com/${baseInfo.photo}`"
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
      <p class="title">综合能力</p>
      <p class="resultDetail">
        根据益达积分系统9个指标进行换算，计算出{{
          baseInfo.username
        }}同学的综合积分为：<span>{{ agvIntegralValue }}</span>
      </p>
      <p class="resultDetail">
        <span v-if="highScore.length > 0">{{
          `其中在${highScore}这${highScorenuber}个方面表现突出`
        }}</span>
        <span v-if="secondary.length > 0">{{
          `在${secondary}这${secondarynuber}个方面表现良好`
        }}</span>
        <span v-if="lowGrade.length > 0">{{
          `在${lowGrade}这${lowGradenuber}个方面表现稍有不足`
        }}</span>
      </p>
      <div class="moduleShow">
        <div class="skillChart"
             ref="skillChart"></div>
        <div class="dataShow">
          <ul>
            <li v-for="(item, index) in resultData"
                :key="index">
              {{ item.moduleName }}：
              <span>{{ item.integralValue ? item.integralValue : 0 }}/100</span>分
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="module">
      <p class="title">潜质评测</p>
      <div class="evaluatMain">
        <div class="ma">
          <img src="../assets/images/ma.png"
               alt="" />
          <div style="text-align: center;">无数据可扫码进行测试</div>
        </div>
        <div class="interest">
          <p>职业兴趣</p>
          <span class="Thickening"> {{ professionalInterest }}</span>
          <span class="one">{{ professionalInterestRemark }}</span>
        </div>
        <div class="interest">
          <p>职业性格</p>
          <span class="Thickening"> {{ professionalCharacter }}</span>

          <span class="one">{{ professionalCharacterRemark }}</span>
        </div>
        <div class="interest">
          <p>个人性格</p>
          <span class="Thickening"> {{ personalCharacter }}</span>
          <span class="one">{{ personalCharacterRemark }}</span>
        </div>
        <div class="interest"
             style="position: relative;">
          <p>心理年龄</p>
          <!-- <div  class="ability"
               ref="ability"></div> -->
          <span class="one">{{
            mentalAgeRemark
          }}</span>
        </div>
        <div class="potentialBox">
          <p>软能力预测</p>
          <div class="potentialChart"
               ref="potentialChart"></div>
        </div>
        <div class="interest">
          <p>情商</p>
          <span class="Thickening"> {{ emotionalIntelligence }}</span>
          <span class="one">{{ emotionalIntelligenceRemark }}</span>
        </div>
      </div>
    </div>
    <div class="module"
         style="margin-bottom: 0">
      <p class="title">人才标签</p>
      <div class="labelBox">
        <div class="labelBoxTit">
          <span>擅长:&nbsp;&nbsp;&nbsp;高</span>
          <p></p>
          <span>低</span>
        </div>
        <div class="labelShow">
          <p v-for="(item, index) in talentLabelNameArr"
             :key="index"
             class="minlabel"
             :class="['label' + (index + 1), addClass(item.integralValue)]">
            {{ item.talentLabelName }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  talentLabels,
  comprehensiveAbility,
  potentialEvaluation,
  updateData,
  selectSynchroLog
} from "../js/url";
export default {
  props: ["baseInfo"],
  name: "CompositePortrait",
  data() {
    return {
      resultData: [],
      talentLabelNameArr: [],
      // 综合能力分数比较高于80的
      highScore: [],
      // 高于80的数量
      highScorenuber: 0,

      // 综合能力分数比较60-80的
      secondary: [],
      secondarynuber: 0,

      // 综合能力分数比较低于60的
      lowGrade: [],
      lowGradenuber: 0,

      professionalInterest: "",
      emotionalIntelligenceRemark: "",
      personalCharacterRemark: "",
      professionalCharacterRemark: "",
      professionalInterestRemark: "",
      agvIntegralValue: "",
      professionalCharacter: "",
      personalCharacter: "",
      mentalAgeRemark: "",
      emotionalIntelligence: "",
      //更新数据时间
      gtime: ""
    };
  },
  mounted() {
    this.getTalentLabels();
    this.getComprehensiveAbilityData();
    this.getPotentialEvaluationData();
    this.Updatetime();
  },
  methods: {
    addClass(value) {
      if (value >= 80) {
        return "maxlabel";
      } else if (value >= 60 && value <= 79) {
        return minlabel;
      } else {
        return "";
      }
    },
    renderZZT(moduleName, integralValue) {
      //潜质柱状图
      console.log(moduleName, integralValue);

      let potentialChart = this.$echart.init(this.$refs.potentialChart);
      potentialChart.setOption({
        xAxis: {
          name: "x",
          color: ["red"],
          type: "category",
          data: moduleName,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 4,
              color: "#5ac1e9"
            }
          },
          axisLabel: {
            textStyle: {
              color: "#000" //坐标值得具体的颜色
            }
          }
        },
        grid: {
          left: 30,
          right: 20,
          top: 50,
          bottom: 50
        },
        yAxis: {
          name: "y",
          type: "value",
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#7d7d7d"],
              width: 1,
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              width: 4,
              color: "#5ac1e9"
            }
          },
          axisLabel: {
            textStyle: {
              fontWeight: "bold"
            }
          }
        },
        series: [
          {
            data: integralValue,
            barWidth: 30,
            type: "bar",
            label: {
              normal: {
                show: true, //显示数字
                position: "top",
                fontWeight: "bold",
                color: "#10859d"
              }
            },
            itemStyle: {
              normal: {
                color: "#5ac1e9",
                barBorderRadius: [15, 15, 0, 0]
              }
            }
          }
        ]
      });
    },
    mixedAbilityEchart(arr) {
      // 获取综合能力数据
      // console.log(arr);

      let skillChart = this.$echart.init(this.$refs.skillChart);
      skillChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: [
          "#95706d",
          "#6799d2",
          "#7edfb4",
          "#b39ae0",
          "#99cefb",
          "#ad6202",
          "#ef9898",
          "#6acee3",
          "#ffb515",
          "#cb9c60"
        ],
        calculable: true,
        series: [
          {
            name: "积分",
            type: "pie",
            radius: [30, 110],
            center: ["50%", "50%"],
            label: {
              normal: {
                textStyle: {
                  fontWeight: "normal",
                  fontSize: 15
                }
              }
            },
            roseType: "area",
            data: arr
          }
        ]
      });
    },
    getComprehensiveAbilityData() {
      this.$ajax
        .get(
          this.baseUrl +
            comprehensiveAbility +
            "?userId=" +
            this.$route.query.userId
        )
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            let arr = [],
              moduleName = [],
              integralValue = [];
            this.resultData = data.data;
            this.agvIntegralValue = this.resultData[0].agvIntegralValue;
            for (let i = 0; i < this.resultData.length; i++) {
              moduleName.push(this.resultData[i].moduleName);
              // integralValue.push(this.resultData[i].integralValue);
              arr.push({
                value: this.gitdata(this.resultData[i].integralValue),
                name: this.resultData[i].moduleName
              });
              if (this.resultData[i].integralValue > 80) {
                this.highScore.push(this.resultData[i].moduleName);
                this.highScorenuber++;
              } else if (
                this.resultData[i].integralValue < 80 &&
                this.resultData[i].integralValue > 60
              ) {
                this.secondary.push(this.resultData[i].moduleName);
                this.secondarynuber++;
              } else {
                this.lowGrade.push(this.resultData[i].moduleName);
                this.lowGradenuber++;
              }
            }

            console.log(arr);

            this.mixedAbilityEchart(arr);
            // this.renderZZT(moduleName, integralValue)
          }
        });
    },
    // abilityChart (mentalAge) { //
    //   let ability = this.$echart.init(this.$refs.ability);
    //   ability.setOption({
    //     series: [
    //       {
    //         type: 'pie',
    //         radius: ['50%', '70%'],
    //         avoidLabelOverlap: false,
    //         label: {
    //           normal: {
    //             show: true,
    //             position: 'center'
    //           }
    //         },
    //         labelLine: {
    //           normal: {
    //             show: false
    //           }
    //         },
    //         color: ["#10859d", "#CCC"],
    //         data: [
    //           { value: parseInt(mentalAge), name: `${mentalAge}` },
    //           { value: 100 - parseInt(mentalAge), name: '' },
    //         ]
    //       }
    //     ]
    //   })

    // },
    getPotentialEvaluationData() {
      // 获取潜质测评数据
      this.$ajax
        .get(
          this.baseUrl +
            potentialEvaluation +
            "?userId=" +
            this.$route.query.userId
        )
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            console.log(data.data);
            // this.emotionalIntelligence = data.data.emotionalIntelligence
            this.professionalInterest = data.data.professionalInterest;
            this.professionalCharacter = data.data.professionalCharacter;
            this.emotionalIntelligenceRemark =
              data.data.emotionalIntelligenceRemark;
            this.personalCharacterRemark = data.data.personalCharacterRemark;
            this.professionalCharacterRemark =
              data.data.professionalCharacterRemark;
            this.professionalInterestRemark =
              data.data.professionalInterestRemark;
            this.personalCharacter = data.data.personalCharacter;
            this.mentalAgeRemark = data.data.mentalAgeRemark;
            this.emotionalIntelligence = data.data.emotionalIntelligence;

            // this.abilityChart(this.gitdata(data.data.mentalAge));

            let moduleName = [
              "人际交往",
              "问题处理",
              "观察能力",
              "管理能力",
              "判断力",
              "空间想象能力",
              "计划性",
              "创新性"
            ];
            // this.renderZZT(moduleName, data)

            this.renderZZT(moduleName, [
              this.gitdata(data.data.interpersonalCommunication),
              this.gitdata(data.data.problemHandling),
              this.gitdata(data.data.observation),
              this.gitdata(data.data.managementAbility),
              this.gitdata(data.data.judgment),
              this.gitdata(data.data.spatialImagination),
              this.gitdata(data.data.planned),
              this.gitdata(data.data.innovative)
            ]);
          }
        });
    },

    // 、、判断null
    gitdata(data) {
      if (data == null) {
        data = 0;
      }
      return data;
    },
    getTalentLabels() {
      // 获取人才标签
      this.$ajax
        .get(
          this.baseUrl + talentLabels + "?userId=" + this.$route.query.userId
        )
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].talentLabelName) {
                this.talentLabelNameArr.push({
                  talentLabelName: data.data[i].talentLabelName,
                  integralValue: data.data[i].integralValue
                });
              }
            }
          }
        });
    },
    // 点击更新同步数据
    synchronization() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + updateData, {
          params: { userId, assessModuleId: 0 }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            location.reload();
            this.$router.go(0);
          }
        })
        .catch(err => {
          this.$message.error("同步失败请联系管理员");
        });
    },

    // 同步数据时间获取
    Updatetime() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + selectSynchroLog, {
          params: {
            assessModuleId: 0,
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
<style scoped>
@import "../style/portrait.css";
.module .resultDetail {
  font-size: 13px;
  color: #444444;
  text-indent: 24px;
  line-height: 30px;
  font-weight: bold;
}

.moduleShow {
  display: flex;
}
.moduleShow .skillChart {
  height: 350px;
  flex: 1;
}
.moduleShow .dataShow {
  height: 300px;
  flex: 1;
  border-left: 1px solid #ccc;
}
.moduleShow .dataShow ul {
  padding-top: 30px;
}
.moduleShow .dataShow ul li {
  width: 50%;
  display: inline-block;
  text-indent: 60px;
  line-height: 50px;
  color: #444444;
}
.moduleShow .dataShow ul li span {
  color: #95706d;
}

.module .evaluatMain {
  padding: 20px;
  position: relative;
}
.module .evaluatMain .ability {
  position: absolute;
  width: 100px;
  height: 100px;
  top: -30px;
  left: 224px;
}
.module .evaluatMain .ma {
  position: absolute;
  top: 10px;
  right: 0px;
  width: 200px;
  height: 200px;
}
.module .evaluatMain .ma img {
  width: 100%;
}
.module .evaluatMain .interest {
  display: flex;
  margin-bottom: 20px;
}
.module .evaluatMain .interest p,
.module .evaluatMain .potentialBox p {
  padding: 0 10px;
  width: 196px;
  height: 30px;
  border-radius: 15px;
  background-color: #10859d;
  color: #fff;
  text-align: center;
  line-height: 30px;
}
.module .evaluatMain .interest .one {
  width: 310px;
  display: block;
  line-height: 30px;
  padding-left: 1em;
  font-size: 14px;
  color: #444444;
}
.module .evaluatMain .interest .Thickening {
  color: #444444;
  display: block;
  padding-left: 1em;
  line-height: 30px;
  height: 30px;
  font-size: 16px;
  font-weight: 600;
}
.module .evaluatMain .potentialBox .potentialChart {
  height: 350px;
}
.module .labelBox {
  width: 840px;
  margin: 0 auto;
}
.module .labelBox .labelBoxTit {
  text-align: right;
  padding: 20px 0;
  color: #444444;
}
.module .labelBox .labelBoxTit p {
  display: inline-block;
  width: 120px;
  height: 20px;
  position: relative;
  top: 4px;
  margin: 0 10px;
  /*! autoprefixer: off */
  background: -webkit-linear-gradient(
    left,
    #10859d,
    #86c2ce
  ); /* autoprefixer: on */
  background: -o-linear-gradient(
    left,
    #10859d,
    #86c2ce
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    left,
    #10859d,
    #86c2ce
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(left, #10859d, #86c2ce); /* 标准的语法 */
}
.module .labelBox .labelBoxTit p {
}
.module .labelBox .labelShow {
  width: 522px;
  height: 245px;
  margin: 0 auto;
  position: relative;
}
.module .labelBox .labelShow .minlabel {
  width: 120px;
  height: 30px;
  line-height: 30px;
  background-color: #87c2ce;
  text-align: center;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  position: absolute;
}
.module .labelBox .labelShow .maxlabel {
  width: 160px;
  height: 40px;
  line-height: 40px;
  background-color: #10859d;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  border-radius: 4px;
  font-size: 17px;
  position: absolute;
}
.module .labelBox .labelShow .label1 {
  left: 207px;
  top: 0;
}
.module .labelBox .labelShow .label2 {
  left: 349px;
  top: 40px;
}
.module .labelBox .labelShow .label3 {
  left: 78px;
  top: 46px;
  background-color: #b7dae1;
}
.module .labelBox .labelShow .label4 {
  left: 224px;
  top: 56px;
}
.module .labelBox .labelShow .label5 {
  left: 0px;
  top: 93px;
}
.module .labelBox .labelShow .label6 {
  left: 180px;
  top: 112px;
}
.module .labelBox .labelShow .label7 {
  top: 106px;
  left: 400px;
}
.module .labelBox .labelShow .label8 {
  top: 148px;
  left: 380px;
}
.module .labelBox .labelShow .label9 {
  background-color: #9fced8;
  top: 155px;
  left: 44px;
}
.module .labelBox .labelShow .label10 {
  background-color: #9fced8;
  top: 165px;
  left: 246px;
}
</style>
