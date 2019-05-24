<template>
  <div  class="pagination">
    <ul class="pageList">
      <button class="firstPage" :disabled="currentPage == 1" @click="changePage(1,everyShowNum)">首页</button>
      <button class="prevBtn" :disabled="currentPage == 1" @click="changePage(currentPage - 1,everyShowNum)"><</button>
      <li v-for="p in grouplist" :class="{'active':currentPage == p.val}" @click="changePage(p.val,everyShowNum)">
        {{ p.text }}
      </li>
      <button  class="nextBtn" :disabled="currentPage == totalPage" @click="changePage(currentPage + 1,everyShowNum)">></button>
      <button class="lastPage" :disabled="currentPage == totalPage" @click="changePage(totalPage,everyShowNum)">尾页</button>
    </ul>
    <span style="padding: 0 5px">共{{ totalPage }}页</span>
    <div class="confirmBox" v-if="dynamic">
      每页显示<p>
      <input v-model="everyShowNum" type="text"/>
      <span class="up" @click="up"></span>
      <span class="down" @click="down"></span>
    </p>页
    </div>

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="300px"
      center>
      <span>{{ alarmText }}</span>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" class="confirmBtn" @click="centerDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  export default{
    data(){
      return{
        currentPage: 1,
        nextPage:1,  //输入框输入的数字
        pagegroup:5, // 当总页数总页数超过5页时  默认设置显示前五页
        everyShowNum:10,
        alarmText:"输入框只能输入合法数字！",
        centerDialogVisible: false
      }
    },
    props:["totalPage","dynamic","current"],//currentPage 当前所在的页数 everyShowNum每页显示的个数
    computed: {
      grouplist: function () { // 获取分页页码
        this.currentPage = this.current;
        var len = this.totalPage, temp = [], list = [], count = Math.floor(this.pagegroup / 2), center = this.currentPage;
        if (len <= this.pagegroup) {
          while (len--) {
            temp.push({text: this.totalPage - len, val: this.totalPage - len});
          }
          return temp;
        }
        while (len--) {
          temp.push(this.totalPage - len);
        }
        var idx = temp.indexOf(center);
        (idx < count) && ( center = center + count - idx);
        (this.currentPage > this.totalPage - count) && ( center = this.totalPage - count);
        temp = temp.splice(center - count - 1, this.pagegroup);
        do {
          var t = temp.shift();
          list.push({
            text: t,
            val: t
          });
        } while (temp.length);
        if (this.totalPage > this.pagegroup) {
          (this.currentPage > count + 1) && list.unshift({text: '...', val: list[0].val - 1});
          (this.currentPage < this.totalPage - count) && list.push({text: '...', val: list[list.length - 1].val + 1});
        }
        return list;
      }
    },
    methods: {
      changePage(idx,everyShowNum){ //点击设置分页
        if(isNaN(this.everyShowNum)){
          this.centerDialogVisible = true;
          return
        }
        if(this.everyShowNum < 1 ){
          this.alarmText =`每页最少显示1条数据！`;
          this.centerDialogVisible = true;
          return
        }
        if(this.everyShowNum > 12){
          this.alarmText =`每页最多显示12条数据！`;
          this.centerDialogVisible = true;
          return
        }
        if(isNaN(this.nextPage)){
          this.centerDialogVisible = true;
          return
        }
        if(this.nextPage < 1){
          this.alarmText =`跳转页数不能小于1！`;
          this.nextPage = 1;
          this.centerDialogVisible = true;
          return
        }
        if(this.nextPage > this.totalPage && this.totalPage != 1){
          this.alarmText =`跳转页数不能大于${this.totalPage}！`;
          this.nextPage = this.totalPage;
          this.centerDialogVisible = true;
          return
        }
        if(this.nextPage == 2 && this.totalPage == 1 ){
          this.alarmText =`跳转页数不能大于${this.totalPage}！`;
          this.nextPage = this.totalPage;
          this.centerDialogVisible = true;
          return
        }

        this.currentPage = idx;
        this.everyShowNum = everyShowNum;
        if(this.nextPage > this.totalPage){
          this.nextPage = this.totalPage
        }
        this.centerDialogVisible = false;
        this.$emit("changePageHandler",this.currentPage,this.everyShowNum);

      },
      up(){ //增加每页显示
        this.everyShowNum++;
        if(this.everyShowNum > 12){
          this.everyShowNum = 1
        }
      },
      down(){ //减少每页显示
        this.everyShowNum--;
        if(this.everyShowNum<1){
          this.everyShowNum = 10
        }
      },
      add(){ //增加跳页
        this.nextPage++;
        if(this.nextPage > this.totalPage){
          this.nextPage = 2
        }
      },
      de(){ //减少跳页
        this.nextPage--;
        if(this.nextPage < 1){
          this.nextPage = this.totalPage
        }
      },
    }


  }
</script>

<style>
  .pagination{
    text-align: center;
    padding: 40px 0;
    color: #545c61;
  }
  .pageList{
    display: inline-block;
  }
  .active{
    border-color:#fff ;
    color: #12869f;
  }
  .pageList > li{
    display: inline-block;
    width:32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 50%;
    margin: 0 5px;
    font-size: 16px;
  }
  .pageList .prevBtn,.pageList .nextBtn{
    background:#0387a0;
    width: 28px;
    height: 28px;
    cursor: pointer;
    border-radius: 15px;
    font-size: 16px;
    margin: 0 5px;
    border: none;
    color: #fff;
  }
  .pageList .firstPage,.pageList .lastPage{
     width: 60px;
     height: 30px;
     background-color: #fff;
     border-radius: 10px;
     color:#0187a2;
     border: 2px solid #0187a2;
  }
  .pageList .firstPage{
     margin-right: 24px;
  }
  .pageList .lastPage{
     margin-left: 24px;
   }
  .pageList .disable{
    border: none !important;
    color: #ccc;
  }
  .pageList .disable:hover{
    color: #ccc;
    border-color:#0187a2
  }

  .pageList > li:hover{
    color: #12869f;
    cursor: pointer;
  }

</style>

