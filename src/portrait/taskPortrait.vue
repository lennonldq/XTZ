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
         <p class="title">任务外包积分</p>
         <div class="scoreChart" ref="scoreChart"></div>
      </div>
      <div class="module" style="margin-bottom: 0">
        <p class="title">任务外包情况</p>
        <p class="scoreDetail">
          参与项目：{{ joinItem }}
        </p>
        <div class="echartBox">
             <div class="type">
                 <p>任务参与类型</p>
                 <div class="present">
                     <p :style="{width: project_count1_present}">{{ project_count1 }}个</p>
                     <p :style="{width: project_count2_present}">{{ project_count2 }}个</p>
                 </div>
                 <div class="presentItem">
                    <p style="width: 20%">个人参与</p>
                    <p style="width: 80%">团队参与</p>
                 </div>
             </div>
             <div class="taskChart" ref="taskChart"></div>
        </div>
      </div>
    </div>
</template>

<script>
    import {
      taskOutsourcing,
      enterpriseOutsourcing,
      taskJoinNumber,
      taskJoinInfo
    } from "../js/url"
    export default {
      props:['baseInfo'],
      name:'TaskPortrait',
      data(){
        return{
          sumProjectCount:0,//参与项目数
          joinItem:"",
          project_count1_present:"",
          project_count2_present:"",
          project_count1:"",
          project_count2:""
        }
      },
      mounted(){
        this.getTaskOutsourcingData();
        this.getEnterpriseOutsourcingData();
        this.getTaskJoinNumberData();

        this.getTaskJoinInfoData();
      },
      methods:{
        scoreEchart(termid,integralValue,sumIntegralValue){ // 任务外包积分
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
                 let arr = ["任务外包积分","班级平均积分"];
              
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
              data: sumIntegralValue,
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
        taskEchart(begin_date,project_count,sum_project_count){ //任务外包积分柱状图
          let taskChart = this.$echart.init(this.$refs.taskChart);
          taskChart.setOption({
            title:{
              text: `参与项目数：${sum_project_count}个`,
              x:"center",
              y:32,
              textStyle:{
                fontWeight: 'normal',
              }
            },
            xAxis: {
              type: 'category',
              data: begin_date,
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
                  fontWeight:'bold',
                  fontSize:16,
                  color: '#444',//坐标值得具体的颜色
                }
              }
            },
            grid:{
              left:40,
              top:120,
              bottom:50,
              right:10
            },
            yAxis: {
              type: 'value',
              axisTick:{
                show:false
              },
              splitLine: {
                show: false,
              },
              axisLine:{
                lineStyle:{
                  width:4,
                  color: '#5ac1e9'
                }
              },
              axisLabel: {
                textStyle: {
                  fontWeight:'bold',
                  fontSize:16,
                  color: '#444',//坐标值得具体的颜色
                }
              }
            },
            series: [{
              data:project_count,
              barWidth : 40,
              type: 'bar',
              label:{
                normal:{
                  show:true,            //显示数字
                  position: 'top',
                  fontWeight:"bold",
                  fontSize:16,
                  color:"#444"
                }
              },
              itemStyle:{
                normal:{
                  color:'#f09796'
                }
              }
            }]
          })
        },

        getTaskOutsourcingData(){ //获取任务外包积分数据
          let { userId,classId } = this.$route.query;
          this.$ajax.get( this.baseUrl + taskOutsourcing,{
            params:{
              userId,classId
            }
          }).then(res=>{
            let data = JSON.parse(res.data);
            if(data.code == 200){
              let termid = [],integralValue = [],sumIntegralValue = [];
              for(let i = 0;i<data.data.length;i++){
                termid.push(data.data[i].termid);
                integralValue.push(parseInt(data.data[i].integralValue));
                sumIntegralValue.push(parseInt(data.data[i].sumIntegralValue));
              }
              this.scoreEchart(termid,integralValue,sumIntegralValue);
            }
          })
        },
        getEnterpriseOutsourcingData(){
          let { userId } = this.$route.query;
          this.$ajax.get(this.baseUrl + enterpriseOutsourcing,{
            params:{userId
}
          }).then(res=>{
            let data = JSON.parse(res.data);
            if(data.code == 200){
              console.log(data.data,'sdsd');
              for(let i = 0;i<data.data.length;i++){
                this.joinItem += data.data[i] + '、'
              }
           }
         })
        },
        getTaskJoinNumberData(){ //获取参与项目数量
          let { userId } = this.$route.query;
          this.$ajax.get(this.baseUrl + taskJoinNumber,{
            params:{userId}
          }).then(res=>{
            let data = JSON.parse(res.data);
            if(data.code == 200){
              let begin_date = [],project_count = [];
              for(let i = 0;i<data.data.length;i++){
                begin_date.push(data.data[i].begin_date);
                project_count.push(parseInt(data.data[i].project_count))
              }
              this.taskEchart(begin_date,project_count,data.data[0].sum_project_count);
            }

          })
        },
        getTaskJoinInfoData(){ // 获取任务参与情况数据
          let { userId } = this.$route.query;
          this.$ajax.get(this.baseUrl + taskJoinInfo,{
            params:{userId}
          }).then(res=>{
            let data = JSON.parse(res.data);
            if(data.code == 200){
               console.log(data.data);
               let [project_count1,project_count2] = [parseInt(data.data.project_count1),parseInt(data.data.project_count2)];
               let total = project_count1 + project_count2 ;
               this.project_count1_present = this.commonJs.percentNum(project_count1,total);
               this.project_count2_present = this.commonJs.percentNum(project_count2,total);
               this.project_count1 = project_count1;
               this.project_count2 = project_count2;
            }
          })
        }
      }
    }
</script>
<style>
  @import "../style/portrait.css";
  .module .scoreChart{
    height: 450px;
  }
  .module .scoreDetail{
    padding-top: 46px;
    width: 912px;
    color: #444;
    margin: 0 auto;
    line-height: 24px;
  }
  .module .echartBox{
     display: flex;
     width: 910px;
     margin: 0 auto;
  }
  .module .echartBox .type{
     padding-top: 114px;
     width: 50%;
  }
  .module .echartBox .type >p{
     text-indent: 188px;
     line-height: 80px;
  }
  .module .echartBox .type .present{
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
  .module .echartBox .type .present p{
     transition: .6s width;
     width: 0;
  }
  .module .echartBox .type .present p:nth-child(1){
     background-color: #7384f4;
  }
  .module .echartBox .type .present p:nth-child(2){
    background-color: #5ac1e9;
  }
  .module .echartBox .type .presentItem{
    width: 345px;
  }
  .module .echartBox .type .presentItem p{
     display: inline-block;
     float: left;
     line-height: 60px;
  }
  .module .echartBox .type .presentItem p:nth-child(1){
    text-align: center;
  }
  .module .echartBox .type .presentItem p:nth-child(2){
    text-align: right;
  }
  .module .echartBox .taskChart{
     width: 50%;
  }
</style>
