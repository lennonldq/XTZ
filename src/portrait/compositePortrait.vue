<template>
  <div class="main">
    <div class="header">
      <div class="titleBox">
        <div><img src="../assets/images/pho.png" alt=""></div>
        <p>{{ baseInfo.username }}</p>
        <p>{{ baseInfo.schoolname }}</p>
        <p>{{ baseInfo.classname }}</p>
      </div>
      <router-link
        tag="button"
        :to="{path:'/integralPortrait',query:{classId:$route.query.classId,userId:$route.query.userId}}">
        返回上页
      </router-link>
    </div>
    <div class="module">
      <p class="title">综合能力</p>
      <p class="resultDetail">根据益达积分系统9个指标进行换算，计算出该名同学的综合积分为：<span>{{ agvIntegralValue }}</span></p>
      <div class="moduleShow">
        <div class="skillChart" ref="skillChart"></div>
        <div class="dataShow">
            <ul>
              <li v-for="item,index in resultData">
                 {{ item.moduleName }}：
                <span>{{ item.integralValue }}</span>分
              </li>
            </ul>
        </div>
      </div>
    </div>
    <div class="module">
      <p class="title">潜质评测</p>
      <div class="evaluatMain">
          <div class="ability" ref="ability"></div>
          <div class="ma">
            <img src="../assets/images/ma.png" alt="">
          </div>
          <div class="interest">
             <p>{{ emotionalIntelligence }}</p>
             <span>{{ emotionalIntelligenceRemark }}</span>
          </div>
          <div class="interest">
            <p>{{ personalCharacter }}</p>
            <span>{{ personalCharacterRemark }}</span>
          </div>
          <div class="interest">
            <p>{{ professionalCharacter }}</p>
            <span>{{ professionalCharacterRemark }}</span>
          </div>
          <div class="interest">
            <p>心理测评</p>
            <span>心理年龄很成熟</span>
          </div>
          <div class="potentialBox">
            <p>软能力预测</p>
            <div class="potentialChart" ref="potentialChart"></div>
          </div>
          <div class="interest">
            <p>{{ professionalInterest }}</p>
            <span>{{ professionalInterestRemark }}</span>
          </div>
      </div>
    </div>
    <div class="module" style="margin-bottom: 0">
      <p class="title">人才标签</p>
      <div class="labelBox">
          <div class="labelBoxTit"><span>擅长:&nbsp;&nbsp;&nbsp;高</span><p></p><span>低</span></div>
          <div class="labelShow">
            <p v-for="item,index in talentLabelNameArr" class="minlabel" :class="['label'+(index+1),addClass(item.integralValue)]">
              {{ item.talentLabelName }}
            </p>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { talentLabels,comprehensiveAbility,potentialEvaluation } from "../js/url"
  export default {
    props:["baseInfo"],
    name:"CompositePortrait",
    data(){
      return {
        resultData:[],
        talentLabelNameArr:[],
        emotionalIntelligence:'职业兴趣',
        emotionalIntelligenceRemark:'',
        personalCharacter:"职业性格",
        personalCharacterRemark:"",
        professionalCharacter:"个人性格",
        professionalCharacterRemark:"",
        professionalInterest:"",
        professionalInterestRemark:"",
        agvIntegralValue:""
      }
    },
    mounted(){
      this.getTalentLabels();
      this.getComprehensiveAbilityData();
      this.getPotentialEvaluationData();
    },
    methods:{
      addClass(value){
        if(value >= 80){
           return "maxlabel"
        }else if(value >= 60 && value<=79){
           return minlabel
        }else{
          return ""
        }
      },
      renderZZT(moduleName,integralValue){ //潜质柱状图
        let potentialChart = this.$echart.init(this.$refs.potentialChart);
        potentialChart.setOption({
          xAxis: {
            name: 'x',
            color: ['red'],
            type: 'category',
            data: moduleName,
            axisTick:{
              show:false
            },
            axisLine:{
              lineStyle:{
                width:4,
                color: '#5ac1e9'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#000',//坐标值得具体的颜色
              }
            }
          },
          grid:{
            left:30,
            right:20,
            top:50,
            bottom:50,
          },
          yAxis: {
            name: 'y',
            type: 'value',
            axisTick:{
              show:false
            },
            splitLine: {
              show: true,
              lineStyle:{
                color: ['#7d7d7d'],
                width: 1,
                type: 'solid'
              }
            },
            axisLine:{
              lineStyle:{
                width:4,
                color: '#5ac1e9'
              }
            },
            axisLabel: {
              textStyle: {
                fontWeight:'bold'
              }
            }
          },
          series: [{
            data: integralValue,
            barWidth : 30,
            type: 'bar',
            label:{
              normal:{
                show:true,            //显示数字
                position: 'top',
                fontWeight:"bold",
                color:"#10859d"
              }
            },
            itemStyle:{
              normal:{
                color:'#5ac1e9',
                barBorderRadius:[15, 15, 0, 0],
              }
            }
          }]
        })
      },
      mixedAbilityEchart(arr){ // 获取综合能力数据
        let skillChart = this.$echart.init(this.$refs.skillChart);
        skillChart.setOption({
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color:["#95706d","#6799d2","#7edfb4","#b39ae0","#99cefb","#ad6202","#ef9898","#6acee3","#ffb515","#cb9c60"],
          calculable : true,
          series : [
            {
              name:'积分',
              type:'pie',
              radius : [30, 110],
              center : ['50%', '50%'],
              label:{
                normal:{
                  textStyle : {
                    fontWeight : 'normal',
                    fontSize : 15
                  }
                }
              },
              roseType : 'area',
              data:arr
            }
          ]
        })
      },
      getComprehensiveAbilityData(){
        this.$ajax.get(this.baseUrl + comprehensiveAbility+'?userId=' + this.$route.query.userId).then(res=>{
          let data = JSON.parse(res.data);
          if(data.code == 200){
            let arr = [],moduleName = [],integralValue = [];
            this.resultData = data.data;
            this.agvIntegralValue = this.resultData[0].agvIntegralValue;
            for(let i = 0;i<this.resultData.length;i++){
              moduleName.push(this.resultData[i].moduleName);
              integralValue.push(this.resultData[i].integralValue);
              arr.push({value:this.resultData[i].integralValue,name:this.resultData[i].moduleName})
             }
             console.log(data.data)
             this.mixedAbilityEchart(arr);
             this.renderZZT(moduleName,integralValue)
          }
        })
      },
      abilityChart(mentalAge){ //
          let ability = this.$echart.init(this.$refs.ability);
          ability.setOption({
            series: [
              {
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: true,
                    position: 'center'
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                color:["#10859d","#CCC"],
                data:[
                  {value:parseInt(mentalAge), name:`${mentalAge}`},
                  {value:100 - parseInt(mentalAge), name:''},
                ]
              }
            ]
          })


      },
      getPotentialEvaluationData(){ // 获取潜质测评数据
        this.$ajax.get(this.baseUrl + potentialEvaluation+'?userId=' + this.$route.query.userId).then(res=>{
          let data = JSON.parse(res.data);
          if(data.code == 200){
              // this.emotionalIntelligence = data.data.emotionalIntelligence
              this.emotionalIntelligenceRemark = data.data.emotionalIntelligenceRemark
              this.personalCharacter = data.data.personalCharacter;
              this.personalCharacterRemark = data.data.personalCharacterRemark;
              this.professionalCharacter = data.data.professionalCharacter;
              this.professionalCharacterRemark = data.data.professionalCharacterRemark;
              this.professionalInterest = data.data.professionalInterest;
              this.professionalInterestRemark = data.data.professionalInterestRemark;
              this.abilityChart(data.data.mentalAge);
              this.renderZZT(
                ["人际交往","问题处理","观察能力","管理能力","判断力","空间想象能力",'计划性','创新性'],
                [
                  data.data.innovative,
                  data.data.interpersonalCommunication,
                  data.data.judgment,
                  data.data.managementAbility,
                  data.data.observation,
                  data.data.planned,
                  data.data.problemHandling,
                  data.data.spatialImagination
                ]
              )
          }
        })
      },

      getTalentLabels(){ // 获取人才标签
        this.$ajax.get(this.baseUrl + talentLabels+'?userId=' + this.$route.query.userId).then(res=>{
          let data = JSON.parse(res.data);
          if(data.code == 200){
              for(let i = 0;i<data.data.length;i++){
                  if(data.data[i].talentLabelName){
                     this.talentLabelNameArr.push({
                       talentLabelName:data.data[i].talentLabelName,
                       integralValue:data.data[i].integralValue,
                     })
                   }
              }
          }
        })
      },
    },

  }
</script>
<style>
  @import "../style/portrait.css";
  .module .resultDetail{
     font-size: 13px;
     color: #444444;
     text-indent: 24px;
     line-height: 30px;
     font-weight: bold;
  }


  .moduleShow{
    display: flex;

  }
  .moduleShow .skillChart{
    height: 350px;
    flex: 1;

  }
  .moduleShow .dataShow{
    height: 300px;
    flex: 1;
    border-left: 1px solid #ccc;
  }
  .moduleShow .dataShow ul{
      padding-top: 30px;
  }
  .moduleShow .dataShow ul li{
     width: 50%;
     display: inline-block;
     text-indent:60px;
     line-height: 50px;
     color: #444444;
  }
  .moduleShow .dataShow ul li span{
    color: #95706d;
  }

  .module .evaluatMain {
     padding: 20px;
     position: relative;
  }
  .module .evaluatMain  .ability{
    position: absolute;
    width: 100px;
    height: 100px;
    top: 138px;
    left: 392px;
  }
  .module .evaluatMain  .ma{
    position: absolute;
    width: 100px;
    height: 100px;
    top: 10px;
        right: 116px;
  }
  .module .evaluatMain .interest{
     display: flex;
     margin-bottom: 20px;
  }
  .module .evaluatMain .interest p,.module .evaluatMain .potentialBox p{
     padding:0 10px;
     width: 196px;
     height: 30px;
     border-radius: 15px;
     background-color: #10859d;
     color: #fff;
     text-align: center;
     line-height: 30px;
  }
  .module .evaluatMain .interest span{
     display: block;
     flex: 1;
     height: 30px;
     line-height: 30px;
     text-indent: 24px;
     font-size: 14px;
     color:#444444
  }
  .module .evaluatMain .potentialBox .potentialChart{
     height: 350px;
  }
  .module .labelBox{
     width: 840px;
     margin: 0 auto;
  }
  .module .labelBox .labelBoxTit{
     text-align: right;
     padding: 20px 0;
     color: #444444;
  }
  .module .labelBox .labelBoxTit p{
      display: inline-block;
      width: 120px;
      height: 20px;
      background: -webkit-linear-gradient(left, #10859d , #86c2ce); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(left, #10859d , #86c2ce); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(left, #10859d , #86c2ce); /* Firefox 3.6 - 15 */
      background: linear-gradient(left, #10859d , #86c2ce); /* 标准的语法 */
  }
  .module .labelBox .labelBoxTit p{
     position: relative;
     top: 4px;
     margin: 0 10px;
  }
  .module .labelBox .labelShow{
     width: 522px;
     height: 245px;
     margin: 0 auto;
     position: relative;
  }
  .module .labelBox .labelShow .minlabel{
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
  .module .labelBox .labelShow .maxlabel{
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
  .module .labelBox .labelShow .label1{
     left:207px;
     top:0
  }
  .module .labelBox .labelShow .label2{
    left:349px;
    top:40px;
  }
  .module .labelBox .labelShow .label3{
    left:78px;
    top:46px;
    background-color: #b7dae1;
  }
  .module .labelBox .labelShow .label4{
    left:224px;
    top:56px;
  }
  .module .labelBox .labelShow .label5{
    left:0px;
    top:93px;
  }
  .module .labelBox .labelShow .label6{
    left:180px;
    top:112px;
  }
  .module .labelBox .labelShow .label7{
     top: 106px;
     left:400px
  }
  .module .labelBox .labelShow .label8{
     top:148px;
     left:380px;
  }
  .module .labelBox .labelShow .label9{
     background-color: #9fced8;
     top: 155px;
     left: 44px;
  }
  .module .labelBox .labelShow .label10{
    background-color: #9fced8;
    top: 165px;
    left: 246px;
  }
</style>
