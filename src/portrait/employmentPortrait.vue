<template>
    <div class="main">
      <div class="header">
        <div class="titleBox">
        <div><img src="../assets/images/pho.png" alt=""></div>
          <p>{{ baseInfo.username }}</p>
          <p>{{ baseInfo.schoolname }}</p>
          <p>{{ baseInfo.classname }}</p>
        </div>
        <router-link tag="button"
          :to="{path:'/integralPortrait',query:{classId:$route.query.classId,userId:$route.query.userId}}">
          返回上页
        </router-link>
      </div>
      <div class="module">
         <p class="title">实习积分</p>
         <div class="scoreChart" ref="scoreChart"></div>
      </div>
      <div class="module" style="margin-bottom: 0">
        <p class="title">实习情况</p>
        <!-- <div class="detail" v-if="evaluate = false">
          未有具体数据
        </div> -->
        <div class="detail">
          <p>实习评分：<span>{{evaluate.practiceScore}}</span>分</p>
          <p>实习评价：{{evaluate.practiceEvaluation}}</p>
        </div>
        <div class="situtation">
          <div class="situtationItem" :class="{'typeName':item.typeName=='实习'}" v-for="item in situtationData">
             <p class="job">{{ item.postName }}</p>
             <p class="company">{{ item.companyName }}</p>
             <span class="date icon">{{ item.beginDate }}</span>
             <span class="date" v-if="item.endDate">{{'-'+item.endDate }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import { practicePortrait,practiceInfoD,getPracticeInfo } from "../js/url"
    export default {
      props:['baseInfo'],
      name:"EmploymentPortrait",
      data(){
        return{
          situtationData:[],
          // 评语
          evaluate:''
        }
      },
      mounted(){
        this.getPracticePortraitData();
        this.getPracticeInfoData();
        this.PracticeInfoData();
      },
      methods:{
        scoreEchart(termid,integralValue,sumIntegralValue){ // 实习积分
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
              //    let arr = ["实习积分","班级平均积分"];
              // for(let i = 0;i<params.length;i++){
              //   str += `${this.baseInfo.username}${arr[i]}:${params[i].value}分<br>`
              // }
               let arr = ["实习积分","班级平均积分"];
              
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
        getPracticePortraitData(){ // 获取实习积分数据
          let {userId,classId} = this.$route.query;
          this.$ajax.get(this.baseUrl + practicePortrait,{
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
                 this.scoreEchart(termid,integralValue,sumIntegralValue)
             }
          })
        },
        getPracticeInfoData(){ // 获取实习情况数据
          let {userId} = this.$route.query;
          this.$ajax.get(this.baseUrl + practiceInfoD,{
            params:{userId}
          }).then(res=>{
            let data = JSON.parse(res.data);
            if(data.code == 200){
               data.data.forEach(item=>{
                 item.beginDate = item.beginDate.substring(0,10);
                 if(item.endDate ) {
                     item.endDate = item.endDate.substring(0,10)
                 }else{
                     item.endDate  = "就职中"
                 }
               })
               this.situtationData = data.data;
              //  console.log(data.data)
            }
          })
        },
        PracticeInfoData(){//获取实习情况评分
          let {userId} = this.$route.query;
          this.$ajax.get(this.baseUrl + getPracticeInfo,{
            params:{userId}
          }).then(res=>{
            this.evaluate = JSON.parse(res.data).data
           console.log(this.evaluate);
           
            
          })
        }
      }
    }
</script>
<style>
  @import "../style/portrait.css";
  .module .scoreChart{
     height: 400px;
  }
  .module  .detail{
     width: 940px;
     margin: 0 auto;
     font-size: 13px;
     line-height: 24px;
     padding-top: 4px;
  }
  .module .detail p span{
     color: #2e8ea4;
     font-weight: bold;
  }
  .module .situtation{
    width: 940px;
    margin: 0 auto;
    padding: 30px 0;
    overflow: hidden;
  }
  .module .situtation  .typeName{
    background: url("../assets/images/sx.png") 174px 10px no-repeat;
  }
  .module .situtation .situtationItem{
     width: 203px;
     height: 68px;
     background-color:#10859d ;
     border-radius: 10px;
     color: #fff;
     padding: 10px;
     float: left;
     margin-right: 16px;
     margin-bottom: 16px;
  }

  .module .situtation div:nth-child(4n){
     margin-right: 0;
  }
  .module .situtation .situtationItem .job{
     padding-bottom: 10px;
     font-size: 13px;
  }
  .module .situtation .situtationItem .company{
    padding-bottom: 12px;
    font-size: 14px;
  }
  .module .situtation .situtationItem .date{
    font-size: 15px;
    display: inline-block;
    padding-top: 2px;

  }
  .module .situtation .situtationItem .icon{
    padding-left: 20px;
    background: url("../assets/images/time.png") 0 center no-repeat;
  }
</style>
