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
        <p class="title">实习情况</p>
      
        <div  v-if="situtationData.length > 0">
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
         <div class="wei" v-else>
          未有具体数据
        </div>
      </div>

       <div class="module">
         <p class="title">实习积分</p>
         <div class="scoreChart" ref="scoreChart"></div>
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
          y:"30",
          itemWidth: 20,

          itemHeight: 10,

          itemGap: 40,
          textStyle:{fontSize:16}
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
  .module .wei{
    text-align: center;
    line-height: 320px;
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
