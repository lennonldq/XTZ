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
         <p class="title">认证积分情况</p>
         <div class="scoreChart" ref="scoreChart"></div>
      </div>
      <div class="module" style="margin-bottom: 0">
        <p class="title">认证情况</p>
        <p class="certified">
          根据{{  baseInfo.username }}的认证获取情况进行诊断，{{  baseInfo.username }}所获得的认证数量为：<span>{{totalcountNo}}</span>
        </p>
        <div class="situtationChart" ref="situtationChart"></div>
      </div>
    </div>
</template>

<script>
    import { certification,certificationSituation } from "../js/url"
    export default {
      props:['baseInfo'],
      data(){
        return{
          totalcountNo:0
        }
      },
      mounted(){
         this.getCertificationData();
         this.getCertificationSituationData()
      },
      methods:{
        scoreEchart(termid,integralValue,sumIntegralValue){ // 认证积分情况
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
             let arr = ["认证积分","班级平均积分"];
             
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
        situtationEchart(termid,countNo){ //认证情况
           let situtationChart = this.$echart.init(this.$refs.situtationChart);
           situtationChart.setOption( {
             tooltip: {
               trigger: 'axis',
               formatter: (params)=> {
                 let str = "";
                 for(let i = 0;i<params.length;i++){
                   str += `${this.baseInfo.username}认证个数:${params[i].value}个`
                 }
                 return str;
               },
             },
             xAxis: {
               type: 'category',
               boundaryGap: false,
               splitLine: {
                 show: true,
                 lineStyle:{
                   color: ['#fff'],
                   width: 2,
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
                   color: '#444444',//坐标值得具体的颜色
                   align:'center'
                 }
               },
               data: termid
             },
             yAxis: {
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
               },
               type: 'value'
             },
             color:"#82a7da",
             series: [{
               data: countNo,
               type: 'line',
               areaStyle: {
                  normal:{
                    color:"#60d8a3"
                  }
               }
             }]
           })
        },

        formatTerm(termid) {
          switch (termid) {
            case 1:
              return '第一学期'
              break
            case 2:
              return '第二学期'
              break
            case 3:
              return '第三学期'
              break
            case 4:
              return '第四学期'
              break
            case 5:
              return '第五学期'
              break
            case 6:
              return '第六学期'
              break
            case 7:
              return '第七学期'
              break
            case 8:
              return '第八学期'
              break
                
            default:
              return ''
          }
        },
        getCertificationData(){ // 获取积分情况数据
           let { userId,classId } = this.$route.query;
           this.$ajax.get(this.baseUrl + certification,{
             params:{
               userId,classId
             }
           }).then(res=>{
               let data = JSON.parse(res.data)
               if(data.code == 200){
                  let termid = [],integralValue = [],sumIntegralValue = [];
                  for(let i = 0;i<data.data.length;i++){
                    termid.push(data.data[i].termid);
                    integralValue.push(data.data[i].integralValue)
                    sumIntegralValue.push(data.data[i].sumIntegralValue)
                  }
                 this.scoreEchart(termid,integralValue,sumIntegralValue);
               }
           })
        },
        getCertificationSituationData(){ //获取认证情况数据
          let { userId,classId } = this.$route.query;
          this.$ajax.get( this.baseUrl + certificationSituation,{
            params:{
              userId,classId
            }
          }).then(res=>{
            let data = JSON.parse(res.data)
            if(data.code == 200){
              console.log(data.data);
              let countNo = [],termid = [];
              for(let i = 0;i<data.data.length;i++){
                termid.push(data.data[i].termid)
                countNo.push(data.data[i].countNo);
                this.totalcountNo += parseInt(data.data[i].countNo)
              }

              this.situtationEchart(termid,countNo);
            }
          })
        }
      }
    }
</script>
<style scoped>
  @import "../style/portrait.css";
  .module .scoreChart{
    height: 400px;
  }
  .module .certified{
    width: 912px;
    color: #444;
    margin: 0 auto;
    height: 80px;
    line-height: 80px;
  }
  .module .certified span{
    font-weight: bold;
    color:#5aa0b1
  }
  .module .situtationChart{
     height: 400px;
  }
</style>
