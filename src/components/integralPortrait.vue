<template>
  <el-main class="integralWarp">
     <div class="title">
        <div><img src="../assets/images/pho.png" alt=""></div>
        <p>{{ baseInfo.username }}</p>
        <p>{{ baseInfo.schoolname }}</p>
        <p>{{ baseInfo.classname }}</p>
     </div>
     <div class="middleWarp">
       <div class="talentLabel">
           <div class="radius">
               <p>-人才积分-</p>
               <div>{{   sumIntegralValue }}分</div>
               <span>超越{{ integralRate }}%的同学</span>
           </div>
           <div class="btnBox">
               <router-link tag="button" :to="{path:'/portrait/compositePortrait',query:{classId:$route.query.classId,userId:$route.query.userId}}">综合画像</router-link>
           </div>
           <div class="labelBox">
               <span>人才标签:</span>
               <div class="labelList">
                 <p :class="item.className" v-for="item in personalCharacterArr" :key="item.id">{{ item.talentLabelName }}</p>
               </div>
           </div>
       </div>
       <div class="scoreBox" style="height: auto">
           <div class="btnDiv">
                <router-link tag="button" :to="{path:'portrait/coursePortrait',query:$route.query}">查看课程画像</router-link>
           </div>
           <div class="scoreItem"
                v-for="item in dataPortrait" :key="item.id"
                :class="parseInt(item.integralValue)>=parseInt(item.sumIntegralValue)?'up':'down'"

           >
                <button class="btn" @click = "linkTo(item.moduleName)">查看{{ item.moduleName  }}画像</button>
                 <div class="scoreMain">
                     <div class="score">
                        <p>{{ parseInt(item.integralValue) }}</p>
                        <p>{{ parseInt(item.sumIntegralValue) }}</p>
                     </div>
                     <div class="item">
                       <p>{{ item.moduleName }}</p>
                       <p>班级平均积分</p>
                     </div>
                 </div>
           </div>
       </div>
     </div>
    <div class="statisticsWarp">
      <div class="statistics_title">
          <p class="titleName">统计积分</p>
          <div class="time">
            <label>时间：</label>
            <el-date-picker
              v-model="timeArrange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="—"
            >
            </el-date-picker>
          </div>
          <div class="integral">
            <label>积分：</label>
            <select v-model="type" @change="getType">
                <option>全部</option>
                <option>积分增加</option>
                <option>积分减少</option>
            </select>
          </div>
         <button class="searchBtn" @click="seachData">搜索</button>
      </div>
      <div class="tableBox">
        <el-table v-loading="loading" :empty-text="emptyText"  element-loading-text="拼命加载中" :header-row-style="headerStyle" :data="tableData" style="width: 100%">
          <el-table-column prop="integralTime" label="日期" width="300"></el-table-column>
          <el-table-column label="积分">
              <template slot-scope="scope">
                  <p :style="{color:scope.row.integralValue>0?'#e64f15':'#10859d'}">
                    <span v-if="scope.row.integralValue>=0">+</span>
                    {{ scope.row.integralValue }}
                  </p>
              </template>
          </el-table-column>
          <el-table-column prop="moduleName" label="来源"></el-table-column>
          <el-table-column width="160" prop="integralName" label="积分类型"></el-table-column>
        </el-table>
        <Pagination v-show="tableData.length" :current="current" :totalPage="totalPage" @changePageHandler="changePage"></Pagination>
      </div>
    </div>
  </el-main>
</template>

<script>
   import Pagination from "../views/pagination";
   import { talentLabels,assessModules,integralStatistics,integralPortrait } from "../js/url"
    export default {
      name:"IntegralPortrait",
      components:{
        Pagination
      },
      data(){
        return{
          personalCharacterArr:[],
          timeArrange:[],
          totalPage:1,
          current:1,
          everyShowNum:10,
          emptyText:"暂无数据",
          type:"全部",
          headerStyle:{
            height:'60px',
            backgroundColor:'#10859d',
            color: 'dimgrey',
          },
          sendIntegralData:{
            beginDate:"",
            endDate:"",
            userId:"",
            type:'',
            pageNum:1,
            pageSize:10
          },
          baseInfo:{
            classname:"",
            username:"",
            schoolname:""
          },
          loading:true,
          dataPortrait:[],
          tableData: [],
          integralRate:"",
          sumIntegralValue:""
        }
      },
      created(){
        this.getPortrait();
        this.getIntegralStatistics();
        this.getBaseInfo();
        this.getTalentLabels();
        this.getintegralPortraitData()
      },
      methods:{
        getType(){
          if(this.type == '积分增加'){
             this.sendIntegralData.type = 1;
          }else if(this.type == '积分减少'){
            this.sendIntegralData.type = 2;
          }else{
            this.sendIntegralData.type = ''
          }
        },
        getintegralPortraitData(){
          let { userId,classId} = this.$route.query;
          this.$ajax.get(this.baseUrl + integralPortrait,{
            params:{userId,classId}
          }).then(res=>{
            let data = JSON.parse(res.data)
            if(data.code == 200){
              this.integralRate = data.data.integralRate;
              this.sumIntegralValue = data.data.sumIntegralValue
            }

          })
        },
        getTalentLabels(){ // 获取人才标签
          this.$ajax.get(this.baseUrl + talentLabels+'?userId=' + this.$route.query.userId).then(res=>{
            let data = JSON.parse(res.data);
            if(data.code == 200){
              let arrColor = ["green","blue","pink","deepBlue","yellow","blue","pink","green","purple","deepGreen"];
              console.log(data.data)
              for(let i = 0;i<data.data.length;i++){
                if(data.data[i].talentLabelName){
                  this.personalCharacterArr.push({
                    talentLabelName:data.data[i].talentLabelName,
                    className:arrColor[i]
                  })
                }
              }
            }
          })
        },
        getBaseInfo(){ // 基本信息
            let info = JSON.parse(sessionStorage.getItem("info"))
            this.baseInfo.username = info.username;
            this.baseInfo.schoolname = info.schoolname;
            this.baseInfo.classname = info.classname
        },
        getPortrait(){ //获取人才积分
            this.$ajax.get(this.baseUrl + assessModules,{params:this.$route.query}).then(res=>{
               let data = JSON.parse(res.data);
               if(data.code == 200){
                 this.dataPortrait = data.data;
               }
            })
        },
        linkTo(moduleName){
           switch(moduleName){
             case '课程':
               this.$router.push({path:'/portrait/coursePortrait',query:this.$route.query});
               break;
             case '实验实训':
               this.$router.push({path:'/portrait/practicalPortrait',query:this.$route.query});
               break;
             case '实战实训':
               this.$router.push({path:'/portrait/actualPortrait',query:this.$route.query});
               break;
             case '学徒制':
               this.$router.push({path:'/portrait/apprenticeshipPortrait',query:this.$route.query});
               break;
             case '创业':
               this.$router.push({path:'/portrait/entrepreneurialPortrait',query:this.$route.query});
               break;
             case '任务外包':
               this.$router.push({path:'/portrait/taskPortrait',query:this.$route.query});
               break;
             case '实习就业':
               this.$router.push({path:'/portrait/employmentPortrait',query:this.$route.query});
               break;
             case '认证':
               this.$router.push({path:'/portrait/certifiedPortrai',query:this.$route.query});
               break;competitionPortrait
             default:
               this.$router.push({path:'/portrait/competitionPortrait',query:this.$route.query});
           }
        },
        getIntegralStatistics(){ //获取积分统计
             this.sendIntegralData.userId = this.$route.query.userId;
             this.tableData = [];
             this.loading = true;
             this.$ajax.get(this.baseUrl + integralStatistics,{
               params:this.sendIntegralData
             }).then(res=>{
               let data = JSON.parse(res.data);
               this.loading = false;
               this.tableData = [];
               if(data.code == 200){
                    this.tableData = JSON.parse(JSON.stringify(data.data));
                    this.totalPage = data.totalPages;
                    this.tableData.forEach((item)=>{
                      item.integralTime =item.integralTime.substring(0,10);
                      item.integralValue = parseInt(item.integralValue);
                    });
               }
             }).catch(err=>{
               this.loading = false;
               this.tableData = [];
               if(err.message.indexOf('timeout')>-1){
                   this.emptyText = "请求超时,请刷新重试！"
               }else{
                 this.emptyText = "请求出错，请稍后重试！"
               }
             })
        },
        seachData(){ // 点击搜索查询
         // if(this.timeArrange.length){
            this.sendIntegralData.beginDate = this.timeArrange[0];
            this.sendIntegralData.endDate = this.timeArrange[1];
            this.getIntegralStatistics()
        //  }
        },
        changePage(current,everyShowNum){
          this.current = current;
          this.everyShowNum = everyShowNum;
          this.sendIntegralData.pageNum = this.current;
          this.getIntegralStatistics();
        }
      }
    }
</script>
<style scoped>
  .integralWarp{
     box-shadow: none;
     overflow: visible;
     padding: 0;
  }
  .title{
     height: 80px;
     line-height: 80px;
     display: flex;
     margin-bottom: 40px;
     box-shadow: 0 0 18px #d4d2d2;
  }
  .title div{
    flex: 1;
    text-align: center;
    border: 2px solid #f6f6f6;
  }
   .title div img{
        display: block;
    margin: 14px auto;
  }
  .title p:nth-child(2),.title p:nth-child(3){
    flex: 2;
    text-align: center;
    border-right: 2px solid #f6f6f6;
  }
  .title p:nth-child(4){
    flex: 3;
    text-indent: 30px;
  }
  .middleWarp{
    border-radius: 0 0 20px 20px;
    box-shadow: 0 0 18px #d4d2d2;
  }
  .middleWarp .talentLabel{
     height: 180px;
     padding: 35px 22px;
     color: #fff;
     border-bottom: 20px solid #f4f5f7;
     background: url("../assets/images/bg_03.jpg") center;
  }
  .middleWarp .talentLabel .radius{
      width: 180px;
      height: 180px;
      border-radius: 50%;
      float: left;
      text-align: center;
      background-color: #4694ff;
  }
  .middleWarp .talentLabel .radius p{
     line-height: 70px;
  }
  .middleWarp .talentLabel .radius div{
     font-weight: bold;
     font-size: 36px;
  }
  .middleWarp .talentLabel .radius span{
     display: block;
     padding-top: 20px;
  }
  .middleWarp .talentLabel .btnBox{
     float: left;
     width: 184px;
     text-align: center;
     line-height: 184px;
  }
  .middleWarp .talentLabel .btnBox button{
      width: 100px;
      height:60px ;
      color: #fff;
      border-radius: 4px;
      font-size: 18px;
      cursor: pointer;
      background-color: #10859d;
  }
  .middleWarp .talentLabel .labelBox{
     float: left;
     width: 780px;
     padding-top: 28px;
     margin-left: 12px;
  }
  .middleWarp .talentLabel .labelBox span{
     color:#10859d;
     font-weight: bold;
  }
  .middleWarp .talentLabel .labelBox .labelList{
      display: flex;
      flex-wrap: wrap;
      padding-top: 14px;
  }
  .middleWarp .talentLabel .labelBox .labelList p{
      width: 120px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 20px;
      margin-right: 10px;
  }
  .middleWarp .talentLabel .labelBox .labelList .green{
    background-color: #7edfb4;
  }
  .middleWarp .talentLabel .labelBox .labelList .blue{
    background-color: #7384f4;
  }
  .middleWarp .talentLabel .labelBox .labelList .pink{
    background-color: #f09796
  }
  .middleWarp .talentLabel .labelBox .labelList .deepBlue{
    background-color: #4694ff
  }
  .middleWarp .talentLabel .labelBox .labelList .yellow{
     background-color: #ffb81f;
  }
  .middleWarp .talentLabel .labelBox .labelList .purple{
     background-color: #9f7cd3;
  }
  .middleWarp .talentLabel .labelBox .labelList .deepGreen{
    background-color: #a8ca6e;
  }
  .scoreBox{
     padding: 20px 0;
     padding-bottom: 0;
     display: flex;
     flex-wrap: wrap;
     height: auto !important;
  }
  .scoreBox > div{
     margin-right: 20px;
     margin-bottom: 20px;
  }
  .scoreBox > div:nth-child(6n){
    margin-right: 0px;
  }
  .scoreBox > div:nth-child(1){
    width: 224px;
    height: 120px;
    display: none;
    line-height: 120px;
    background-color: #10859d;
  }

  .scoreBox .up{
     background: url("../assets/images/up.png") center no-repeat;
  }
  .scoreBox .down{
    background: url("../assets/images/down.png") center no-repeat;
  }
  .scoreBox .scoreItem{
    width: 224px;
    height: 120px;
    position: relative;
    background-color: #f4f5f7;
  }
  .scoreBox .scoreItem .btn{
    position: absolute;
    width: 146px;
    height: 46px;
    border: 2px solid #fff;
    background-color: #10859d;
    border-radius: 4px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    top: 50%;
    left: 50%;
    margin-top: -23px;
    margin-left: -73px;
    display: none;
  }

  .scoreBox .scoreItem:hover .item{
    display: none;
  }
  .scoreBox .scoreItem .scoreMain{
     padding:26px;
    cursor: pointer;
  }
  .scoreBox .scoreItem:hover{
    background-color: #10859d;
    transition:background-color .2s ;
  }
  .scoreBox .scoreItem:hover .btn{
    display:block;
  }
  .scoreBox .scoreItem .scoreMain > div{
    display: flex;
  }
  .scoreBox .scoreItem .scoreMain > div p{
     flex: 1;
     text-align: center;
  }
  .scoreBox .scoreItem .scoreMain > .score p{
    color: #10859d;
    font-weight: bold;
    font-size: 30px;
  }
  .scoreBox .scoreItem .scoreMain > .item p{
    font-size: 12px;
    padding-top: 28px;
    color: #444444
  }
  .scoreBox .btnDiv{
    text-align: center;

  }
  .scoreBox .btnDiv button{
     width: 146px;
     height: 46px;
     border: 2px solid #fff;
     background-color:#10859d;
     border-radius: 4px;
     color: #fff;
     font-size: 16px;
     cursor: pointer;
  }
  .statisticsWarp{
    margin-top: 40px;
    box-shadow: 0 0 18px #d4d2d2;
    border-radius: 0 0 20px 20px;
  }
  .statisticsWarp .statistics_title{
    height: 45px;
    line-height: 45px;
    border-bottom: #dcdcdc solid 2px;
  }
  .statisticsWarp .statistics_title .titleName{
    text-indent: 36px;
    position: relative;
    width: 392px;
    float: left;

  }
  .statisticsWarp .statistics_title .titleName:after{
    display: block;
    position: absolute;
    width: 6px;
    height: 30px;
    background-color: #0088a0;
    content:"";
    top:8px;
    color:#444444;
    left: 20px;

  }
  .statisticsWarp .statistics_title .time{
     float: left;
     width: 400px;
  }
  .statisticsWarp .statistics_title .time label{
     float: left;
  }
  .statisticsWarp .statistics_title .time .el-input__inner{
    float: left;
    border:none;
    padding-top: 12px;
  }
  .statisticsWarp .statistics_title .time .el-input__inner .el-input__icon{
     display: none;
  }
  .statisticsWarp .statistics_title .time span{
    color: #adadad;
    position: relative;
    top: -2px;
  }
  .statisticsWarp .statistics_title .time input{
    width: 110px;
    height: 28px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 2px solid #adadad;
    position: relative;
    top: -2px;
  }
  .statisticsWarp .statistics_title .integral{
    float: left;
    width: 266px;
  }
  .statisticsWarp .statistics_title .integral select{
    width: 110px;
    height: 32px;
    border: 2px solid #adadad;
    border-radius: 4px;
  }
  .statisticsWarp .tableBox{
     padding: 0px 34px;
  }

</style>
