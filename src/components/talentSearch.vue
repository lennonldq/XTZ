<template>
    <el-main>
      <p class="title">人才搜索</p>
      <div v-if="userTypeId == 1" class="formBox">
         <div class="form_top">
           <div>
             <label>搜索学校：</label>
             <input placeholder="请输入学校关键字"/>
           </div>
           <div>
             <label>搜索专业：</label>
             <input placeholder="请输入专业"/>
           </div>
           <div>
             <label>搜索姓名：</label>
             <input placeholder="请输入学校关键字"/>
           </div>
         </div>
          <div class="form_bottom">
            <div class="form-item1">
              <label>人才关键字：</label>
              <select>
                  <option>请选择</option>
                  <option>学习课程</option>
                  <option>实训经验</option>
                  <option>实战运营</option>
                  <option>学徒经历</option>
                  <option>创业知识</option>
                  <option>项目经验</option>
                  <option>实习经历</option>
                  <option>认证历史</option>
                  <option>竞赛奖项</option>
              </select>
              <input style="margin-left: 10px" placeholder="物流管理"/>
            </div>
            <div class="form-item2">
              <label>搜索专业：</label>
              <select>
                  <option>请选择</option>
                  <option>活泼型/社交者</option>
                  <option>支配型/控制者</option>
                  <option>稳定型/支持者</option>
                  <option>完美型/服从者</option>
              </select>
            </div>
            <div class="form-item3">
              <button class="searchBtn">搜索</button>
            </div>
          </div>
      </div><!--v-if="userTypeId == 1"-->
      <div v-if="userTypeId == 8" class="formBox">
        <div class="form_top">
          <div class="class">
            <label>选择班级：</label>
            <select>
              <option>2018</option>
              <option>2019</option>
            </select>
            <select>
              <option>专业</option>
            </select>
            <select style="width: 160px" v-model="searchData.className" @change="getClassName()">
              <option>班级</option>
              <option  v-for="item in className">{{ item.classname }}</option>
            </select>
          </div>
          <div>
            <label>搜索姓名：</label>
            <input placeholder="请输入姓名" v-model=" searchData.userName"/>
          </div>
        </div>
        <div class="form_bottom">
          <div class="form-item1">
            <label>人才关键字：</label>
            <select v-model="searchData.talentSelect" @change="getTalent">
              <option>全部</option>
              <option>课程</option>
              <option>实验实训</option>
              <option>实战实训</option>
              <option>学徒制</option>
              <option>创业</option>
              <option>任务外包</option>
              <option>实习就业</option>
              <option>认证</option>
              <option>竞赛</option>
              <option>人才评测</option>
            </select>
            <input style="margin-left: 10px" placeholder="请输入人才关键字" v-model="searchData.talentName"/>
          </div>
          <div class="form-item2">
            <label>搜索性格：</label>
            <select v-model="searchData.personalCharacter" @change="character">
              <option>全部</option>
              <option>活泼型/社交者</option>
              <option>支配型/控制者</option>
              <option>稳定型/支持者</option>
              <option>完美型/服从者</option>
            </select>
          </div>
          <div class="form-item3">
            <button class="searchBtn" @click="search">搜索</button>
          </div>
        </div>
      </div><!-- v-if="userTypeId == 8"-->
      <div v-if="userTypeId == 9" class="formBox">
        <div class="form_top">
          <div class="class">
            <label>选择班级：</label>
            <select>
              <option></option>
              <option>2018届</option>
              <option>2019届</option>
            </select>
            <select>
              <option>专业</option>
            </select>
            <select>
              <option>班级</option>
            </select>
          </div>
          <div>
            <label>搜索姓名：</label>
            <input placeholder="请输入学生名称关键字" v-model="searchData.userName"/>
          </div>
        </div>
        <div class="form_bottom">
          <div class="form-item1">
            <label>人才关键字：</label>
            <select v-model="searchData.talentSelect" @change="getTalent">
              <option>全部</option>
              <option>课程</option>
              <option>实验实训</option>
              <option>实战实训</option>
              <option>学徒制</option>
              <option>创业</option>
              <option>任务外包</option>
              <option>实习就业</option>
              <option>认证</option>
              <option>竞赛</option>
              <option>人才评测</option>
            </select>
            <input style="margin-left: 10px" placeholder="请输入人才关键字"  v-model="searchData.talentName" />
          </div>
          <div class="form-item2">
            <label>搜索性格：</label>
            <select v-model="searchData.personalCharacter" @change="character">
              <option>全部</option>
              <option>活泼型/社交者</option>
              <option>支配型/控制者</option>
              <option>稳定型/支持者</option>
              <option>完美型/服从者</option>
            </select>
          </div>
          <div class="form-item3">
            <button class="searchBtn" @click="search">搜索</button>
          </div>
        </div>
      </div><!-- v-if="userTypeId == 9"-->
      <div v-if="userTypeId == 3" class="formBox">
        <div class="form_top">
          <div>
            <label>搜索学校：</label>
            <input placeholder="请输入学校关键字" v-model="searchData.schoolName"/>
          </div>
          <div>
            <label>搜索专业：</label>
            <input placeholder="请输入专业"  v-model="searchData.professionalName" />
          </div>
          <div>
            <label>搜索姓名：</label>
            <input placeholder="请输入学生名称关键字" v-model="searchData.userName" />
          </div>
        </div>
        <div class="form_bottom">
          <div class="form-item1">
            <label>人才关键字：</label>
            <select v-model="searchData.talentSelect" @change="getTalent">
              <option>全部</option>
              <option>课程</option>
              <option>实验实训</option>
              <option>实战实训</option>
              <option>学徒制</option>
              <option>创业</option>
              <option>任务外包</option>
              <option>实习就业</option>
              <option>认证</option>
              <option>竞赛</option>
              <option>人才评测</option>
            </select>
            <input style="margin-left: 10px" placeholder="物流管理" v-model="searchData.talentName"/>
          </div>
          <div class="form-item2">
            <label>搜索性格：</label>
            <select v-model="searchData.personalCharacter" @change="character" >
                 <option>全部</option>
              <option>活泼型/社交者</option>
              <option>支配型/控制者</option>
              <option>稳定型/支持者</option>
              <option>完美型/服从者</option>
            </select>
          </div>
          <div class="form-item3">
            <button class="searchBtn" @click="search">搜索</button>
          </div>
        </div>
      </div><!-- v-if="userTypeId == 3"-->
      <div class="table">
         <p class="tableTit">人才数量</p>
         <el-table v-loading="loading"  element-loading-text="拼命加载中" :data="tableData" border style="width: 100%">
            <el-table-column align="center" prop="$index" label="排序" width="50">
              <template slot-scope="scope">{{ scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column align="center" prop="schoolname" label="学校"></el-table-column>
            <el-table-column align="center" prop="classname" label="班级"></el-table-column>
            <el-table-column align="center" prop="username"  width="100" label="学生姓名"></el-table-column>
            <el-table-column align="center" prop="integralValue" label="积分"  width="60"></el-table-column>
            <el-table-column v-if="selectTalent == true" align="center" prop="integralValue1" :label="selectTalentName"  width="120"></el-table-column>
            <el-table-column align="center" prop="personalCharacter" label="个人性格" width="120"></el-table-column>
            <el-table-column align="center" label="操作"  width="100">
              <template slot-scope="scope">
                <p class="lookBtn" @click="toLookDetail(scope.row)">查看详情</p>
              </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="tableData.length" :current="current" :totalPage="totalPage" @changePageHandler="changePage"></Pagination>
      </div>
    </el-main>
</template>

<script>
    import Pagination from "../views/pagination";
    import { talentPortrait,classes,professional } from "../js/url"
    export default {
      name:"TalentSearch",
      components:{
        Pagination
      },
      data() {
        return {
          totalPage:1,
          current:1,
          everyShowNum:10,
          loading: true,
          selectTalent: false,
          selectTalentName: '',
          userTypeId:'',
          emptyText:"暂无数据",
          formInline: {
            school: '',
            major: '',
            name:"",
            talent:"",
            disposition:""
          },
          searchData:{
            schoolName:'',
            userName:'',
            className:"",
            professionalName:'',
            personalCharacter:'',
            talentSelect:'',
            talentName:""
          },
          className:[],
          professional:[],
          talentSelect:'',
          personalCharacter:'',
          tableData: [],
        }
      },
      created(){
        this.userTypeId = localStorage.getItem("userTypeId")
        this.getTableData();
        this.getClasses();
        this.getProfessional()
      },
      methods: {
        getClassName(){
         for( let i = 0;i<this.className.length;i++ ){
             if(this.className[i].classname == this.searchData.className ){
               this.searchData.classId = this.className[i].id
             }
          }

        },
        getProfessional(){
          this.$ajax.get(this.baseUrl + professional,{
            params:{
              schoolid:localStorage.getItem("schoolId")
            }
          }).then(res=>{
            let data = JSON.parse(res.data).data;
            this.professional = [...data]
          })
        },
        getClasses(){
          this.$ajax.get(this.baseUrl + classes,{
            params:{
              schoolid:localStorage.getItem("schoolId")
            }
           }).then(res=>{
             let data = JSON.parse(res.data).data;
             this.className = [...data]
          })
        },
        search(){
          if (this.searchData.talentSelect == '全部') {
            this.selectTalent = false;
            this.selectTalentName = '';
          } else {
            this.selectTalent = true;
            this.selectTalentName = this.searchData.talentSelect +'积分';
          }
          this.getTableData()
        },
        getTalent(){
           switch (this.searchData.talentSelect){
            case '全部':
              this.talentSelect = '';
              break
            case '课程':
              this.talentSelect = 1;
              break
            case '实验实训':
              this.talentSelect = 2;
              break
            case '实战实训':
              this.talentSelect = 3;
              break
            case '学徒制':
              this.talentSelect = 4;
              break
            case '创业':
              this.talentSelect = 5;
              break
            case '任务外包':
              this.talentSelect = 6;
              break
            case '实习就业':
              this.talentSelect = 7;
              break
            case '认证':
              this.talentSelect = 8;
              break
            case '竞赛':
              this.talentSelect = 9;
              break
            default:
              this.talentSelect = 10;
          }
        },
        // 性格
         character(){
           switch (this.searchData.personalCharacter){
            case '全部':
              this.personalCharacter = '';
              break
            case '活泼型/社交者':
              this.personalCharacter = "活泼型/社交者";
              break
            case '支配型/控制者':
              this.personalCharacter = "支配型/控制者";
              break
            case '稳定型/支持者':
              this.personalCharacter = "稳定型/支持者";
              break
            default:
              this.personalCharacter = "完美型/服从者";
          }
        },
        getTableData(dta){ // 获取表格数据
            this.tableData = [];
            this.loading = true;
            this.$ajax.get(this.baseUrl + talentPortrait,{
                headers:{
                 accessToken: localStorage.getItem("accessToken")
               },
               params:{
                 pageNum:this.current,
                 pageSize:this.everyShowNum,
                 ...this.searchData,
                 talentSelect:this.talentSelect
               }
            }).then((res)=>{
               this.loading = false;
               if(res.status == 200){
                 let data = JSON.parse(res.data).data;
                 this.totalPage = JSON.parse(res.data).totalPages;
                 data.forEach(item=>{
                   if(item.integralValue) {
                     item.integralValue = parseInt(item.integralValue)
                   }else{
                     item.integralValue = 0
                   }});
                 console.log(data)
                 this.tableData = data
               }

            })
        },
        onSubmit() {
          console.log('submit!');
        },
        changePage(current,everyShowNum){
          this.current = current;
          this.everyShowNum = everyShowNum;
          this.getTableData();
        },
        toLookDetail(row){
          sessionStorage.setItem("info",JSON.stringify(row));
          this.$router.push({path:'/integralPortrait',query:{classId:row.classid,userId:row.id}})
        }
      }
    }
</script>
<style scoped>
  .title{
    height: 45px;
    line-height: 45px;
    text-indent: 36px;
    position: relative;
    border-bottom: #dcdcdc solid 2px;
  }
  .title:after{
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
  .formBox{
     padding: 38px 0 20px 0;
     border-bottom: 20px solid #f4f5f7;
  }

  .formBox .form_top,.formBox .form_bottom{
     width: 920px;
     margin: 0 auto;
     display: flex;
     justify-content: space-between;
  }
  .formBox .form_top{
    margin-bottom: 20px;
  }
  .formBox .form_top .class select{
    width: 90px;
    height: 32px;
    margin-left: 16px;
    border: 2px solid #adadad;
    border-radius: 4px;
  }
  .formBox .form_bottom .form-item1{
    flex: 1;
  }
  .formBox .form_bottom .form-item2{
     padding-right: 30px;
  }
  .formBox .form_bottom  .form-item3{
    width: 176px;
    text-align: right;
  }
  .formBox input{
    height: 26px;
    border: 2px solid #adadad;
    border-radius: 4px;
    text-indent: 14px;
  }
  .formBox .form_top input{
     width: 186px;

  }
  .formBox .form_bottom input{
    width: 264px;
  }
  .formBox .form_bottom select{
     width: 110px;
     height: 32px;
     border: 2px solid #adadad;
     border-radius: 4px;
  }
  .table{
     width: 920px;
     min-height: 600px;
     margin: 0 auto;
  }
  .table .tableTit{
     height: 40px;
     line-height: 40px;
     font-size: 14px;
  }
  .table .lookBtn{
    color: #00899d;
    cursor: pointer;
  }
  input::-webkit-input-placeholder {color:#b2b2b2;}
  input:-moz-placeholder {color:#b2b2b2}
  input:-ms-input-placeholder {color:#b2b2b2}
</style>
