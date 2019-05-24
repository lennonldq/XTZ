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
      <p class="title">课程积分情况</p>
      <div class="scoreChart" ref="scoreChart"></div>
    </div>
    <div class="module">
      <p class="title">学习轨迹跟踪</p>
      <div class="trajectory">
           <div class="proportionChart" ref="proportionChart"></div>
           <div class="achievementChart" ref="achievementChart"></div>
      </div>
      <p class="trajectoryDetail">
         {{
            `${baseInfo.username}在课程学习过程中，${maxType}是最多的学习类型，占总类的${maxPersent}，${minType}是最少的学习类型，占总类的${minPersent}；作业成绩平均分为${typeScore3}分
        （班级平均分为${sumTypeScore3}分），课堂练习成绩平均分为${typeScore2}分（班级平均分为${sumTypeScore2}分），考试成绩为${typeScore1}分（班级平均分为${sumTypeScore1}分）；平时表现优于平均水平，课堂练习优于平均水平，考试表现需加强；`
         }}
      </p>
    </div>
    <div class="module" style="margin-bottom: 0">
      <p class="title">课程学习情况</p>
      <div class="course">

      </div>
      <p class='schoolYear'>张修同学的课程技能库中，库存管理、物流案例与实践、物流企业会计掌握较好，高于班级平均水平，物流信息计算、物流基础、国际物流导
        论一般，需加强学习；</p>
    </div>
  </div>
</template>

<script>
  import {
      courseIntegral,
      learningTrajectoryTracking,
      learningSituation
  } from "../js/url"
  export default {
    props:['baseInfo'],
    name:"CompositePortrait",
    data(){
      return {
        maxType:'',
        minType:'',
        maxPersent:"", //最大占比
        minPersent:"" , //最小占比

        typeScore3:"",//作业成绩
        sumTypeScore3:"", // 班级成绩

        typeScore2:"",//课堂练习成绩
        sumTypeScore2:"", // 班级课堂练习成绩

        typeScore1:"", //考试成绩
        sumTypeScore1:"",//班级考试成绩

        situationData:[]
      }
    },
    mounted(){
       this.getIntegralData();
       this.getLearningTrajectoryTrackingData();
       this.getLearningSituationData()
    },
    methods:{
      getIntegralData(){ //获取课程画像数据
         let {userId,classId} = this.$route.query;
         this.$ajax.get(this.baseUrl + courseIntegral,{
           params:{userId,classId}
         }).then(res=>{
            let data = JSON.parse(res.data);
            if(data.code == 200){
              let termid = [],integralValue = [],sumIntegralValue = [];
              for(let i = 0;i<data.data.length;i++){
                termid.push(data.data[i].termid);
                integralValue.push(data.data[i].integralValue);
                sumIntegralValue.push(data.data[i].sumIntegralValue)
              }
              this.courseIntegralEchart(termid,integralValue,sumIntegralValue)
            }else{
               this.$message({type: 'error', message: "请求出错，请联系技术人员"})
            }
         }).catch(()=>{
           this.$message({type: 'error', message: "请求出错，请联系技术人员"})
         })
      },
      courseIntegralEchart(termid,integralValue,sumIntegralValue){ // 课程积分情况
        let scoreChart = this.$echart.init(this.$refs.scoreChart);
        scoreChart.setOption({
          grid:{
            left:60,
            right:40,
            top:50,
            bottom:50
          },
          tooltip: {
            trigger: 'axis',
            formatter: (params)=> {
              let str = "";
              let arr = ["课程积分","班级平均积分"];
                str = `${this.baseInfo.username}${arr[0]}:${params[0].value}分<br>${arr[1]}:${params[1].value}分`
                return str;
             
            },
          },
          xAxis: {
            name:"x",
            type: 'category',
            data: termid,
            axisLine:{
              lineStyle:{
                width:4,
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
            name:"y",
            type: 'value',
            splitLine: {
              show: false,
            },
            splitArea: {
              show: true,
              areaStyle:{
                color:["#cbe7f2","#fff"]
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
                color: '#444444',//坐标值得具体的颜色
              }
            }
          },
          series: [{
            data: integralValue,
            type: 'line',
            smooth: true,
            itemStyle : {
              normal : {
                lineStyle:{
                  color:'#fc703a'
                }
              }
            },
          },{
            data:sumIntegralValue,
            type: 'line',
            smooth: true,
            itemStyle : {
              normal : {
                lineStyle:{
                  color:'#6dc2b4'
                }
              }
            },
          }]
        })
      },
      getLearningTrajectoryTrackingData(){ // 获取学习轨迹跟踪数据
        let {userId,classId} = this.$route.query;
        this.$ajax.get(this.baseUrl + learningTrajectoryTracking,{
          params:{userId,classId}
        }).then(res=>{
            let data = JSON.parse(res.data);
            if(data.code == 200){
              let typeCount = [], typeArr = ["考试次数","课堂练习次数","作业次数"];
              let sumTypeScore = [],typeScore = [],numArr = [];
              this.typeScore3 = data.data.typeScore3;
              this.sumTypeScore3 = data.data.sumTypeScore3;
              this.typeScore2 = data.data.typeScore2;
              this.sumTypeScore2 = data.data.sumTypeScore2;
              this.typeScore1 = data.data.typeScore1;
              this.sumTypeScore1 = data.data.sumTypeScore1;
              for(let attr in data.data){
                if(attr.indexOf("typeCount")>-1){
                  typeCount.push({
                     value:parseInt(data.data[attr]),
                  })
                }
                if(attr.indexOf("sumTypeScore")>-1){
                  sumTypeScore.push(parseInt(data.data[attr]))
                }
                if(attr.indexOf("typeScore")>-1){
                  typeScore.push(parseInt(data.data[attr]))
                }
              }
              for(let i = 0;i<typeCount.length;i++){
                  typeCount[i].name = typeArr[i];
                  numArr.push(typeCount[i].value)
              }
              let max = Math.max.apply(Math,numArr); // 先找出最大的那个
              let min = Math.min.apply(Math,numArr); // 先找出最小的那个
              let total = numArr.reduce((i,x)=>{ return i + x }); // 求和
              this.maxPersent = this.commonJs.percentNum(max,total);
              this.minPersent = this.commonJs.percentNum(min,total);
              for (let k = 0;k<typeCount.length;k++){
                     if(max == typeCount[k].value){
                       this.maxType = typeCount[k].name
                     }
                     if(min == typeCount[k].value){
                       this.minType = typeCount[k].name
                     }
              }
              this.proportionEchart(typeCount);
              this.achievementEchart(sumTypeScore,typeScore)
            }
        })
      },
      proportionEchart(typeCount){ // 学习类型占比
        let proportionChart = this.$echart.init(this.$refs.proportionChart);
        proportionChart.setOption({
          title: {
            text: '学习类型占比',
            left: 'center',
            top:40,
            textStyle:{
              color:"#444444",
              fontWeight:"normal"
            }
          },
          color:['#7384f4','#7edfb4','#f09796'],
          tooltip : {
            trigger: 'item'
          },
          series : [
            {
              type: 'pie',
              radius : '65%',
              center: ['50%', '55%'],
              selectedMode: 'single',
              data:typeCount,
              labelLine: {
                normal: {
                  show: true,   // show设置线是否显示，默认为true，可选值：true ¦ false
                  lineStyle:{
                    width:4,
                  }
                }
              },
            }
          ]
        })
      },
      achievementEchart(sumTypeScore,typeScore){//学习类型成绩
        let achievementChart = this.$echart.init(this.$refs.achievementChart);
        achievementChart.setOption({
          legend: {
            data: ['个人平均分', '班级平均分'],
            top:60
          },
          title: {
            text: '学习类型成绩',
            left: 'center',
            top:40,
            textStyle:{
              color:"#444444",
              fontWeight:"normal"
            }
          },
          tooltip:{
            trigger:"item"
          },
          splitLine : {
            show : true,
            lineStyle : {
              width : 10,
              color : '#286fbb' // 图表背景网格线的颜色
            }
          },
          textStyle:{
            color:'#444444'
          },
          color:["#f09796","#9ac5f4"],
          radar: [
            {
              indicator: [
                {text: '平时成绩（作业）', max: 100},
                {text: '课堂学习成绩', max: 100},
                {text: '考试成绩', max: 100},
              ],
              center: ['50%','65%'],
              radius : '80%',
              splitLine:{
                show:true,    //去掉网格线
                lineStyle:{
                  width:4,
                  color:"#7384f4"
                }
              },
              splitArea:{
                areaStyle:{
                   color:["#fff","#fff","#7384f4"]
                }
              }
            },
          ],
          series: [
            {
              name:"",
              type: 'radar',
              itemStyle: {
                normal: {
                  areaStyle: {
                    type: 'default',
                    backgroundColor:"green"
                  }
                 }
                },
              data: [
                {
                  value:typeScore,
                  name : '个人平均分'
                },
                {
                  value:sumTypeScore,
                  name : '班级平均分'
                }
              ]
            }
          ]
        })
      },
      getLearningSituationData(){ // 获取课程情况数据
         let {userId,classId} = this.$route.query;
         this.$ajax.get(this.baseUrl + learningSituation,{
            params:{userId,classId}
         }).then(res=>{
           let data = JSON.parse(res.data);
           if(data.code == 200){
             let str = '';
             this.situationData = data.data;
             let integralName = [],integralValue = [],sumIntegralValue = [];
             for(let i = 0;i<data.data.length;i++){
               integralName.push([]);
               integralValue.push([]);
               sumIntegralValue.push([]);
               for(let k = 0;k<data.data[i].length;k++){
                 integralName[i].push({name:data.data[i][k].integralName,max:300});
                 integralValue[i].push(data.data[i][k].integralValue);
                 sumIntegralValue[i].push(data.data[i][k].sumIntegralValue)
               }
             }
             for(let i = 0;i<data.data.length;i++){
                 str += `<div class="fistYearChart"
                         style="width: 490px;height: 450px;float:left"
                         id="fistYearChart${i}">
                        </div>`;
                }

             document.querySelector(".course").innerHTML = str;
             for(let k = 0;k<this.situationData.length;k++){
               this.learningSituationEchart(
                  document.getElementById("fistYearChart"+k),
                 `第${k+1}学年`,
                 integralName[k],
                 integralValue[k],
                 sumIntegralValue[k]
               )
             }
           }

         })
      },
      learningSituationEchart(el,year,integralName,integralValue,sumIntegralValue){ // 课程学习情况
         let fistYearChart = this.$echart.init(el);
         let stu = this.baseInfo.username;
         fistYearChart.setOption({
           title: {
             text:year ,
             textStyle:{
               color:"#444",
               fontWeight:"normal"
             },
             x:"center",
             y:0,
           },
           splitLine:{
             lineStyle:{
               width:6,
             }
           },
           color:["#7edfb4",'#ef9898'],
           legend: {
             top:40,
             icon: 'rect',
             itemWidth: 20,
             itemHeight: 20,
             data: [stu,'班级平均'],
           },
           tooltip : {
             trigger: 'item'
           },
          radar: {
            name: {
              textStyle: {
                color: '#444',
                lineHeight:20,
              },

            },
            indicator: integralName,
            radius:120,
            splitLine:{
              show:true,    //去掉网格线
              lineStyle:{
                width:4,
                color:"#adb8ff"
              }
            }
          },
           series: [{
            name: '预算 vs 开销',
            type: 'radar',
            data : [
              {
                value : integralValue,
                name : stu
              },
              {
                value : sumIntegralValue,
                name : '班级平均'
              }
            ]
          }]
        })
      },
    }
  }
</script>
<style scoped>
  @import "../style/portrait.css";
   .scoreChart{
    height: 400px;
  }
   .dataShow{
    height: 300px;
    flex: 1;
    border-left: 1px solid #ccc;
  }
   .dataShow ul{
    padding-top: 30px;
  }
   .dataShow ul li{
    width: 50%;
    display: inline-block;
    text-indent:60px;
    line-height: 50px;
    color: #444444;
  }
   .dataShow ul li span{
    color: #95706d;
  }

  .module .evaluatMain {
    padding: 20px;
  }
  .module .evaluatMain .interest{
    display: flex;
    margin-bottom: 20px;
  }
  .module .evaluatMain .interest p,.module .evaluatMain .potentialBox p{
    width: 120px;
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
  .module .trajectory{
     height: 460px;
     display: flex;
  }
  .module .trajectory .proportionChart,.module .trajectory .achievementChart{
    flex: 1;
  }
  .module .trajectoryDetail,.module .schoolYear{
     width: 875px;
     margin: 0 auto;
     color:#444444;
     line-height: 26px;
     padding-bottom: 60px;
  }
  .module .course{
     padding-top: 50px;
     overflow: hidden;
  }
</style>
