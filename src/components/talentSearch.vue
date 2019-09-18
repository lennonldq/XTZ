<template>
  <el-main>
    <p class="title">人才搜索</p>
    <div v-if="userTypeId == 1" class="formBox">
      <div class="form_top">
        <div>
          <label>搜索学校：</label>
          <input
            placeholder="请输入学校关键字"
            v-model="searchData.schoolName"
          />
        </div>
        <div>
          <label>搜索专业：</label>
          <input
            placeholder="请输入专业"
            v-model="searchData.professionalName"
          />
        </div>
        <div>
          <label>搜索姓名：</label>
          <input placeholder="请输入学生姓名" v-model="searchData.userName" />
        </div>
      </div>
      <div class="form_bottom">
        <div class="form-item1">
          <label>人才关键字：</label>
          <select v-model="searchData.talentSelect" @change="getTalent">
            <option value="">请选择关键字</option>
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
          <input
            style="margin-left: 10px"
            placeholder="物流管理"
            v-model="searchData.talentName"
          />
        </div>
        <div class="form-item2">
          <label>搜索性格：</label>
          <select v-model="searchData.personalCharacter">
            <option>全部</option>
            <option
              v-for="(item, index) in personalCharacterDate"
              :key="index"
              :value="item"
              >{{ item }}</option
            >
          </select>
        </div>

        <div class="form-item3">
          <button class="searchBtn" @click="search">搜索</button>
        </div>
        <div class="form-item">
          <button class="searchBtnTwo" @click="reset">重置搜索数据</button>
        </div>
      </div>
    </div>
    <!--v-if="userTypeId == 1"-->
    <div v-if="userTypeId == 8 || userTypeId == 9" class="formBox">
      <div class="form_top">
        <div class="class">
          <label>选择班级：</label>
          <select v-model="searchData.editorial" @change="changexuejie($event)">
            <option value="">全部学届</option>
            <option value="2019">2019届</option>
            <option value="2018">2018届</option>
            <option value="2017">2017届</option>
            <option value="2016">2016届</option>
            <option value="2015">2015届</option>
            <option value="2014">2014届</option>
          </select>
          <select v-model="searchData.pid" @change="changezhuanye($event)">
            <option value="">全部专业</option>
            <option
              v-for="item in professional"
              :key="item.id"
              :value="item.id"
              >{{ item.proname }}</option
            >
          </select>
          <select
            style="width: 160px"
            v-model="ProductActive"
            @change="changeProduct($event)"
          >
            <option value="">全部班级</option>
            <option v-for="item in className" :key="item.id" :value="item.id">{{
              item.classname
            }}</option>
          </select>
        </div>
        <div>
          <label>搜索姓名：</label>
          <input placeholder="请输入学生姓名" v-model="searchData.userName" />
        </div>
      </div>
      <div class="form_bottom">
        <div class="form-item1">
          <label>人才关键字：</label>
          <select v-model="searchData.talentSelect" @change="getTalent">
            <option>请选择关键字</option>
            <option>学习课程</option>
            <option>实验实训</option>
            <option>实战运营</option>
            <option>学徒制</option>
            <option>创业</option>
            <option>任务外包</option>
            <option>实习就业</option>
            <option>认证</option>
            <option>竞赛</option>
            <option>人才评测</option>
          </select>
          <input
            style="margin-left: 10px"
            placeholder="请输入人才关键字"
            v-model="searchData.talentName"
          />
        </div>
        <div class="form-item2">
          <label>搜索性格：</label>
          <select v-model="searchData.personalCharacter">
            <option>全部</option>
            <option
              v-for="(item, index) in personalCharacterDate"
              :key="index"
              :value="item"
              >{{ item }}</option
            >
          </select>
        </div>

        <div class="form-item3">
          <button class="searchBtn" @click="search">搜索</button>
        </div>
        <div class="form-item">
          <button class="searchBtnTwo" @click="reset">重置搜索数据</button>
        </div>
        <div class="form-item4">
          <button class="searchBtnTwo" @click="synchronization">
            同步数据
          </button>
        </div>
      </div>
    </div>
    <div v-if="userTypeId == 3" class="formBox">
      <div class="form_top">
        <div>
          <label>搜索学校：</label>
          <input
            placeholder="请输入学校关键字"
            v-model="searchData.schoolName"
          />
        </div>
        <div>
          <label>搜索专业：</label>
          <input
            placeholder="请输入专业"
            v-model="searchData.professionalName"
          />
        </div>
        <div>
          <label>搜索姓名：</label>
          <input placeholder="请输入学生姓名" v-model="searchData.userName" />
        </div>
      </div>
      <div class="form_bottom">
        <div class="form-item1">
          <label>人才关键字：</label>
          <select v-model="searchData.talentSelect" @change="getTalent">
            <option>请选择关键字</option>
            <option>学习课程</option>
            <option>实验实训</option>
            <option>实战运营</option>
            <option>学徒制</option>
            <option>创业</option>
            <option>任务外包</option>
            <option>实习就业</option>
            <option>认证</option>
            <option>竞赛</option>
            <option>人才评测</option>
          </select>
          <input
            style="margin-left: 10px"
            placeholder="物流管理"
            v-model="searchData.talentName"
          />
        </div>
        <div class="form-item2">
          <label>搜索性格：</label>
          <select v-model="searchData.personalCharacter">
            <option>全部</option>
            <option
              v-for="(item, index) in personalCharacterDate"
              :key="index"
              :value="item"
              >{{ item }}</option
            >
          </select>
        </div>

        <div class="form-item3">
          <button class="searchBtn" @click="search">搜索</button>
        </div>
        <div class="form-item">
          <button class="searchBtnTwo" @click="reset">重置搜索数据</button>
        </div>
        <div class="form-item4">
          <button class="searchBtnTwo" @click="synchronization">
            同步数据
          </button>
        </div>
      </div>
    </div>
    <!-- v-if="userTypeId == 3"-->
    <div class="table">
      <p class="tableTit" v-if="INP == ''">
        人才数量:<span class="blue">{{ talents }}</span
        >位
      </p>
      <p class="tableTit" v-else>
        具备‘{{ INP }}’标签人才数为:<span class="blue">{{ talents }}</span
        >位
      </p>

      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column align="center" prop="$index" label="排序" width="50">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="schoolname"
          label="学校"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="classname"
          label="班级"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="username"
          width="100"
          label="学生姓名"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="integralValue"
          label="积分"
          width="60"
        ></el-table-column>
        <el-table-column
          v-if="selectTalent == true"
          align="center"
          prop="integralValue1"
          :label="selectTalentName"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="personalCharacter"
          label="个人性格"
          width="120"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <p class="lookBtn" @click="toLookDetail(scope.row)">查看详情</p>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-show="tableData.length"
        :current="current"
        :totalPage="totalPage"
        @changePageHandler="changePage"
      ></Pagination>
    </div>
  </el-main>
</template>

<script>
import Pagination from "../views/pagination";
import { talentPortrait, classes, professional, getPersonalCharacter, getsynchronization } from "../js/url"
export default {
  name: "TalentSearch",
  components: {
    Pagination
  },
  data () {
    return {
      // 人才数
      INP: '人才数量',
      // 人才数量
      talents: 0,
      // 是否需要显示具有
      have: '',
      // 8,9
      // 全部班级当前选中的id
      ProductActive: "",
      // 全部专业当前选中的id
      couponSelected: "",
      // 学届当前选中的id
      xuejie: "",
      totalPage: 1,
      current: 1,
      everyShowNum: 10,
      loading: true,
      selectTalent: false,
      selectTalentName: '',
      userTypeId: '',
      emptyText: "暂无数据",
      formInline: {
        school: '',
        major: '',
        name: "",
        talent: "",
        disposition: ""
      },
      searchData: {
        schoolName: '',
        // 搜索姓名
        userName: '',
        className: "",
        professionalName: '',
        personalCharacter: '全部',
        talentSelect: '请选择关键字',
        talentName: "",
        // // 学届
        editorial: "",
        // // 专业
        pid: "",
        // // 班级
        // classid:"全部"
      },
      className: [],
      professional: [],
      // 人才关键字id
      talentSelect: '',
      personalCharacter: '',
      tableData: [],
      personalCharacterDate: []
    }
  },
  created () {
    this.userTypeId = localStorage.getItem("userTypeId")
    // this.search();
    this.getTalent();
    this.getTableData();
    this.getClasses();
    this.getPersonalCharacter();
    this.getProfessional();
  },
  methods: {
    getClassName () {
      for (let i = 0; i < this.className.length; i++) {
        if (this.className[i].classname == this.searchData.className) {
          this.searchData.classId = this.className[i].id
        }
      }

    },

    getProfessional () {
      if (this.professional.proname == '全部专业') {
        this.professional.proname.id = '';
      }
      this.$ajax.get(this.baseUrl + professional, {
        params: {
          schoolid: localStorage.getItem("schoolId")
        }
      }).then(res => {
        let data = JSON.parse(res.data).data;
        this.professional = [...data]
      })
    },
    getClasses () {
      this.$ajax.get(this.baseUrl + classes, {
        params: {
          schoolid: localStorage.getItem("schoolId"),
          pid: this.searchData.pid
        }
      }).then(res => {
        let data = JSON.parse(res.data).data;
        this.className = [...data]
      })
    },
    search () {
      if (this.searchData.talentSelect == '请选择关键字') {
        this.selectTalent = false;
        this.selectTalentName = '';
      } else {
        this.selectTalent = true;
        this.selectTalentName = this.searchData.talentSelect + '积分';
      };
      // 全部学届
      // if (this.searchData.editorial == '全部学届') {
      //   this.searchData.editorial = '';
      // }
      // 全部专业

      // 全部班级
      if (this.className.classname == '全部班级') {
        this.className.classname.id = '';
      }
      this.getTableData();
      console.log(1);


    },
    getTalent () {
      switch (this.searchData.talentSelect) {
        case '请选择关键字':
          this.talentSelect = '';
          break
        case '学习课程':
          this.talentSelect = 1;
          break
        case '实验实训':
          this.talentSelect = 2;
          break
        case '实战运营':
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
    getTableData () { // 获取表格数据


      this.tableData = [];
      this.loading = true;
      this.$ajax.get(this.baseUrl + talentPortrait, {
        headers: {
          accessToken: localStorage.getItem("accessToken")
        },
        params: {
          pageNum: this.current,
          pageSize: this.everyShowNum,
          ...this.searchData,
          talentSelect: this.talentSelect,
          editorial: this.xuejie,
          classid: this.ProductActive
        }
      }).then((res) => {
        this.loading = false;

        if (res.status == 200) {
          let data = JSON.parse(res.data).data;
          this.totalPage = JSON.parse(res.data).totalPages;
          this.talents = JSON.parse(res.data).totals;
          this.INP = this.searchData.talentName
          data.forEach(item => {
            if (item.integralValue) {
              item.integralValue = parseInt(item.integralValue)
            } else {
              item.integralValue = 0
            }          });
          this.tableData = data
        }

      })
    },
    onSubmit () {
    },
    changePage (current, everyShowNum) {
      this.current = current;
      this.everyShowNum = everyShowNum;
      this.getTableData();
      console.log(2);

    },
    toLookDetail (row) {

      sessionStorage.setItem("info", JSON.stringify(row));
      let routeData = this.$router.resolve({ path: '/integralPortrait', query: { classId: row.classid, userId: row.id } });
      window.open(routeData.href, '_blank');
    },
    // 当前选中的班级
    changeProduct (event) {
      this.ProductActive = event.target.value; //获取商品ID，即option对应的ID值
    },
    // 当前选中的专业
    changezhuanye (event) {
      this.searchData.pid = event.target.value;
      this.getClasses();
    },
    // 当前选中的学届
    changexuejie (event) {
      this.xuejie = event.target.value;
    },
    //获取性格列表
    getPersonalCharacter () {
      this.$ajax.get(this.baseUrl + getPersonalCharacter).then((res) => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          this.personalCharacterDate = data.data;
        }

      })
    },
    reset () {
      this.searchData.talentSelect = "请选择关键字";
      this.talentSelect = "";
      this.searchData.personalCharacter = "全部";
      this.searchData.className = "";
      this.searchData.professionalName = "";
      this.searchData.schoolName = "";
      this.searchData.talentName = "";
      this.searchData.userName = "";
      this.searchData.editorial = "";
      this.ProductActive = '';
      this.couponSelected = '';
      this.xuejie = '';
      this.searchData.pid = "";
    },
    // 老师 企业 学校管理员 同步数据
    synchronization () {
      this.$ajax.get(this.baseUrl + getsynchronization, {
        params: {
          schoolId: localStorage.getItem("schoolId"),
          userId: localStorage.getItem("userId")
        }
      }).then((res) => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          this.$message({
          message: '同步成功',
          type: 'success'
        });
          location.reload()
          this.$router.go(0)
        }

      }).catch(err => {
        this.$message.error('同步失败请联系管理员');
      })
    }

  }
}
</script>
<style scoped>
.title {
  height: 45px;
  line-height: 45px;
  text-indent: 36px;
  position: relative;
  border-bottom: #dcdcdc solid 2px;
}
.title:after {
  display: block;
  position: absolute;
  width: 6px;
  height: 30px;
  background-color: #0088a0;
  content: '';
  top: 8px;
  color: #444444;
  left: 20px;
}
.formBox {
  padding: 38px 0 20px 0;
  border-bottom: 20px solid #f4f5f7;
}

.formBox .form_top {
  width: 920px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.formBox .form_bottom {
  display: flex;
  margin-left: 140px;
}
.formBox .form_top {
  margin-bottom: 20px;
}
.formBox .form_top .class select {
  width: 90px;
  height: 32px;
  margin-left: 16px;
  border: 2px solid #adadad;
  border-radius: 4px;
}
.formBox .form_bottom .form-item1 {
  /* flex: 1; */
  padding-right: 30px;
}
.formBox .form_bottom .form-item {
  width: 150px;
  text-align: center;
}
.formBox .form_bottom .form-item3 {
  width: 150px;
  text-align: right;
}
.formBox input {
  height: 26px;
  border: 2px solid #adadad;
  border-radius: 4px;
  text-indent: 14px;
}
.formBox .form_top input {
  width: 186px;
}

.formBox .form_bottom select {
  width: 110px;
  height: 32px;
  border: 2px solid #adadad;
  border-radius: 4px;
}
.table {
  width: 920px;
  min-height: 600px;
  margin: 0 auto;
}
.table .tableTit {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
.table .tableTit .blue {
  color: #10859d;
  padding: 0px 5px;
  font-size: 16px;
}
.table .lookBtn {
  color: #00899d;
  cursor: pointer;
}
input::-webkit-input-placeholder {
  color: #b2b2b2;
}
input:-moz-placeholder {
  color: #b2b2b2;
}
input:-ms-input-placeholder {
  color: #b2b2b2;
}
.form-item4 .searchBtnTwo {
  width: 80px;
}
</style>
