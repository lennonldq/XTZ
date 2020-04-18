<template>
  <div class="main">
    <div class="header">
      <div class="titleBox">
        <div>
          <img v-if="baseInfo.photo"
               :src="`https://etech-edu.com/${baseInfo.photo}`"
               alt="" />
          <img v-else
               src="../assets/images/pho.png"
               alt="" />
        </div>
        <p>{{ baseInfo.username }}</p>
        <p>{{ baseInfo.schoolname }}</p>
        <p>{{ baseInfo.classname }}</p>
      </div>
      <router-link tag="button"
                   :to="{
          path: '/integralPortrait',
          query: { classId: $route.query.classId, userId: $route.query.userId }
        }">
        返回上页
      </router-link>
      <!-- <div
        class="synchronization"
        @click="synchronization()"
        style="line-height: 80px;"
      >
        学校人才培养方案
      </div> -->
      <div class="synchronization"
           @click="synchronization()">
        <div class="one">同步数据</div>
        <div class="two"
             v-if="gtime">上次同步:{{ gtime | gTime }}</div>
      </div>
    </div>
    <div class="module">
      <p class="title">课程学习情况</p>
      <div class="ExperimentalResult"
           v-if="large.length  || small.length ">
        <span>{{
          `${baseInfo.username}在本${schools}的课程学习过程中：`
        }}</span>
        <div class="touRed"
             v-if="large.length > 0">
          <span v-for="item of large"
                :key="item"
                class="btRed">{{ item }}、
          </span>
          <span>{{
            `等${largenuber}门课程掌握较好，高于或等于平均水平,`
          }}</span>
        </div>
        <div v-if="small.length > 0"
             class="touRed">
          在
          <span v-for="item of small"
                :key="item"
                class="btRed">{{ item }}、
          </span>
          <span>{{
            `等${smallnuber}门课程掌握较为一般，低于平均水平，有待加强提高；`
          }}</span>
        </div>
      </div>
      <div class="course"></div>
    </div>
    <div class="module">
      <p class="title">学习轨迹跟踪</p>
      <p class="trajectoryDetail">
        {{
          `${baseInfo.username}在本学期的课程学习过程中,作业成绩平均分为${typeScore3}分，${compareScore3}班级平均分${sumTypeScore3}分，课程练习成绩平均分为${typeScore2}分,${compareScore2}班级平均分${sumTypeScore2}分，考试成绩为${typeScore1}分,${compareScore1}班级平均分${sumTypeScore1}分；
        ${higherThan}`
        }}
      </p>
      <div class="trajectory">
        <div class="achievementChart"
             ref="achievementChart"></div>
      </div>
    </div>

    <div class="module">
      <p class="title">益学习</p>
      <p></p>
      <div class="benefitLearningName">
        <div>
          <span style="color: #ffb6da;padding: 0 16px;">{{
            `${baseInfo.username}`
          }}</span><span>积分</span><span>{{ pointTotal }}</span>
        </div>
        <span @click="centerDialogVisible = true"
              class="wen">?</span>
      </div>
      <div class="benefitLearning">
        <div class="LFTLearning"
             ref="LFTLearning"></div>
        <div class="selela">
          <el-select size="medium"
                     v-model="value"
                     placeholder="请选择"
                     @change="Choice">
            <el-option v-for="item in optionsName"
                       :key="item.majorId"
                       :label="item.majorName"
                       :value="item.majorId">
            </el-option>
          </el-select>
        </div>
        <div class="RITLearning">
          <div class="transverse"
               ref="transverse"></div>
          <div class="vertical"
               ref="vertical"></div>
        </div>
      </div>
      <div class="analysia">
        <div style="color:#993399;">综上分析 ：</div>
        <div class="xuexianalys">
          <p>
            学习了{{ Selectivecourses }}的{{
              Selectionquantity
            }}门课程，其中有{{ Targetquantity }}门课程达标
            <el-tooltip class="item"
                        effect="dark"
                        content="课程达标条件：积分大于等于300且答题正确率大于等于60%"
                        placement="right-start">
              <el-button class="bDnone">?</el-button>
            </el-tooltip>
          </p>
          <div>
            <el-tag v-for="item in items"
                    :key="item.label"
                    :type="item.type"
                    effect="plain">
              {{ item.label }}
            </el-tag>
          </div>
          <p>
            在学习的专业课程中，{{ mintypeName }}积分最低，{{
              Answerrate
            }}课程答题正确率最低。
          </p>
        </div>
      </div>
    </div>

    <div class="module">
      <div class="title integral">
        <div class="LEF">课程积分情况</div>
        <div class="RIT">
          <span>当前课程积分:&nbsp;{{ jicurrent }}分</span>
          <el-button v-popover:popover4>积分明细</el-button>
        </div>
      </div>
      <div class="scoreChart"
           ref="scoreChart"></div>
    </div>

    <el-popover ref="popover4"
                placement="right"
                width="800"
                trigger="click"
                class="tan"
                v-model="shu">
      <div class="statistics_title">
        <div class="integral">
          <label>选择学期</label>
          <select v-model="sendIntegralData.termid"
                  @change="getcurriculum()">
            <option :value="item.termid"
                    v-for="(item, index) in semesterList"
                    :key="index">{{ item.termName }}</option>
          </select>
        </div>
        <div class="integral">
          <label>课程名称</label>
          <select v-model="sendIntegralData.courseid">
            <option :value="item.courseid"
                    v-for="(item, index) in courseNameList"
                    :key="index">{{ item.coursename }}</option>
          </select>
        </div>
        <button class="tanBtn"
                @click="seachData">搜索</button>
        <div class="x"
             @click="shu = false">X</div>
      </div>
      <!-- 列表 -->
      <div class="tableBox">
        <el-table v-loading="loading"
                  :empty-text="emptyText"
                  element-loading-text="拼命加载中"
                  :header-row-style="headerStyle"
                  :data="tableData"
                  style="width: 100%">
          <el-table-column prop="integralTime"
                           label="日期"
                           width="300"></el-table-column>
          <el-table-column label="积分">
            <template slot-scope="scope">
              <p :style="{
                  color: scope.row.integralValue > 0 ? '#e64f15' : '#10859d'
                }">
                <span v-if="scope.row.integralValue >= 0">+</span>
                {{ scope.row.integralValue }}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="integralName"
                           label="来源"></el-table-column>
        </el-table>
        <Pagination v-show="tableData.length"
                    :current="current"
                    :totalPage="totalPage"
                    @changePageHandler="changePage"></Pagination>
      </div>
    </el-popover>
    <!-- 弹框列表 -->

    <!-- 益学习弹框 -->
    <el-dialog title="达标统计与达标要求"
               :visible.sync="centerDialogVisible"
               width="30%"
               center>
      <div id="u3104"
           class="text">
        <p>
          <span style="font-family:'Arial Negreta', 'Arial Normal', 'Arial';font-weight:700;">数据统计与达标要求：</span>
        </p>
        <p>
          <span style="font-family:'Arial Negreta', 'Arial Normal', 'Arial';font-weight:700;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Negreta', 'Arial Normal', 'Arial';font-weight:700;">一、达标课程折线条形图：</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">1、折线表示该专业课程答题正确率，数据来源于小程序的专业答题正确率统计。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">2、条形表示该专业课程答题积分和专题学习积分，数据来源于小程序的积分。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">3、课程达标条件：积分大于等于300且正确率大于等于60%。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Negreta', 'Arial Normal', 'Arial';font-weight:700;">二、达标专业课程饼图：</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">1、达标课程数：在饼图标出课程数，数据来源于达标课程折线条形图。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">2、达标课程百分比：达标课程数/参与答题总课程数*100%（同一专业内的课程）。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">3、鼠标滑过饼图专业，左侧的折线统计图显示对应专业的数据。弹出对应专业的积分结构环形图。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Negreta', 'Arial Normal', 'Arial';font-weight:700;">数据分析结果展示：</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">1、显示分析内容为当前查看专业的结果，当查看专业改变时，展示结果也随之改变。
          </span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">2、分析结果示例：学习了{{ Selectivecourses }}专业的{{
              Selectionquantity
            }}门课程，其中有{{ Targetquantity }}门课程达标</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <div>
          <el-tag v-for="item in items"
                  :key="item.label"
                  :type="item.type"
                  effect="plain">
            {{ item.label }}
          </el-tag>
        </div>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            在学习的专业课程中，{{ mintypeName }}积分最低，{{
              Answerrate
            }}课程答题正确率最低。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Negreta', 'Arial Normal', 'Arial';font-weight:700;">三、专业积分统计图：</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">展示查看专业的答题积分、阅读积分和专题学习积分。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Negreta', 'Arial Normal', 'Arial';font-weight:700;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Negreta', 'Arial Normal', 'Arial';font-weight:700;">益学习积分规则：</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">积分等级规则</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">相应操作获得积分，积分达到一定值可以提升等级称谓</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">怎样获得积分？</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">每日签到：登录即签到，每日仅首次登录+1积分</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">刷题积分：</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">分类&nbsp; &nbsp;&nbsp; 获取途径和规则&nbsp; &nbsp;&nbsp;
            获得积分</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">专项练习&nbsp; &nbsp;&nbsp; 每连续答对5题&nbsp; &nbsp;&nbsp;
            +1</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">专项练习&nbsp; &nbsp;&nbsp; 每连续答错3题&nbsp; &nbsp;&nbsp;
            -1</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">专项练习&nbsp; &nbsp;&nbsp;
            每答对一道题得该题分数等值积分，答错不给分不扣分</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">模拟考试&nbsp; &nbsp;&nbsp;
            考试每答对一道题得该题分数等值积分，答错不给分不扣分</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">模拟考试&nbsp; &nbsp;&nbsp; 每完成一次模拟考试&nbsp; &nbsp; &nbsp;
            +2&nbsp;&nbsp; （考试答一半就是没有完成不给完成奖励分）</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">模拟考试&nbsp; &nbsp;&nbsp; 考试正确率等于100%&nbsp; &nbsp;
            +5</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">模拟考试&nbsp; &nbsp;&nbsp; 考试正确率大于等于90%且小于100%&nbsp;
            &nbsp;&nbsp; +2</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">模拟考试&nbsp; &nbsp;&nbsp; 考试正确率大于80%且小于90%&nbsp;
            &nbsp;&nbsp; +1&nbsp; &nbsp;&nbsp;
            （考试正确率小于80%不给奖励分）</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">错题专训（错题本）&nbsp; &nbsp;&nbsp;
            每答对一道题得该题分数等值积分，答错不给分不扣分</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">收藏夹&nbsp; &nbsp; &nbsp;&nbsp;
            每答对一道题得该题分数等值积分，答错不给分不扣分</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">奖励积分</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">奖励项目&nbsp; &nbsp;&nbsp; 获取途径和规则&nbsp; &nbsp;&nbsp;
            获得积分</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">答题冲量奖励&nbsp; &nbsp;&nbsp; 用户总答题数达到500题次&nbsp;
            &nbsp;&nbsp; +2</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">答题冲量奖励&nbsp; &nbsp;&nbsp; 用户总答题数达到800题次&nbsp;
            &nbsp;&nbsp; +3</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">答题冲量奖励&nbsp; &nbsp;&nbsp; 用户总答题数达到1500题次&nbsp;
            &nbsp;&nbsp; +6</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">答题冲量奖励&nbsp; &nbsp;&nbsp; 用户总答题数达到2000题次&nbsp;
            &nbsp;&nbsp; +9</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">答题冲量奖励&nbsp; &nbsp;&nbsp; 用户总答题数达到3000题次&nbsp;
            &nbsp;&nbsp; +12</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">分项答题正确率排位奖励&nbsp; &nbsp;&nbsp;
            用户首次进入答题排位前1&nbsp; &nbsp;&nbsp; +15</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">分项答题正确率排位奖励&nbsp; &nbsp;&nbsp;
            用户首次进入答题排位前2&nbsp; &nbsp;&nbsp; +12</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">分项答题正确率排位奖励&nbsp; &nbsp;&nbsp;
            用户首次进入答题排位前3&nbsp; &nbsp;&nbsp; +9</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">分项答题正确率排位奖励&nbsp; &nbsp;&nbsp;
            用户首次进入答题排位前10&nbsp; &nbsp;&nbsp; +6</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">分项答题正确率排位奖励&nbsp; &nbsp;&nbsp;
            用户首次进入答题排位前30&nbsp; &nbsp;&nbsp; +3</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">阅读积分</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">怎样获得阅读积分？</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">每天浏览行业热点、资讯、获得阅读积分，浏览专题获得专题阅读积分。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">怎样获得专题阅读积分？</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">每天浏览知识快充站专题：每天每阅读一个专题得5积分，同一个专题每天只记当天第一次阅读积分，之后不再重复累加，直到零点后重新记录新一天的积分。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">怎样获得资讯阅读积分？</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">阅读项目&nbsp; &nbsp;&nbsp; 获取途径和规则&nbsp; &nbsp;&nbsp;
            获得积分</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">行业热点&nbsp; &nbsp;&nbsp; 阅读一篇文章达2分钟/每日&nbsp; &nbsp;
            &nbsp; +1</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">行业热点&nbsp; &nbsp;&nbsp; 阅读一篇文章大于5分钟/每日&nbsp;
            &nbsp;&nbsp; +2</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">行业快讯&nbsp; &nbsp;&nbsp; 阅读一篇文章达2分钟/每日&nbsp; &nbsp;
            &nbsp; +1</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">行业快讯&nbsp; &nbsp;&nbsp; 阅读一篇文章大于5分钟/每日&nbsp;
            &nbsp;&nbsp; +2</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;"><br /></span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">积分升级规则</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">用户等级按拥有积分划分，升级等级后积分低于等级要求积分时，等级不变。</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">用户等级对应积分表</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">等级&nbsp; &nbsp;&nbsp; 积分&nbsp; &nbsp;&nbsp; 等级称谓</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V1&nbsp; &nbsp;&nbsp; 0-50&nbsp; &nbsp;&nbsp; 童生</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V2&nbsp; &nbsp;&nbsp; 51-500&nbsp; &nbsp;&nbsp; 秀才</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V3&nbsp; &nbsp;&nbsp; 501-1000&nbsp; &nbsp;&nbsp; 举人</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V4&nbsp; &nbsp;&nbsp; 1001-2500&nbsp; &nbsp;&nbsp; 进士</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V5&nbsp; &nbsp;&nbsp; 2501-5000&nbsp; &nbsp;&nbsp; 庶吉士</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V6&nbsp; &nbsp;&nbsp; 5001-8000&nbsp; &nbsp;&nbsp; 侍读学士</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V7&nbsp; &nbsp;&nbsp; 8001-12000&nbsp; &nbsp;&nbsp; 掌院学士</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V8&nbsp; &nbsp;&nbsp; 12001-16000&nbsp; &nbsp;&nbsp; 侍郎</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V9&nbsp; &nbsp;&nbsp; 16001-20000&nbsp; &nbsp;&nbsp; 尚书</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V10&nbsp; &nbsp;&nbsp; 20001-26000&nbsp; &nbsp;&nbsp; 大学士</span>
        </p>
        <p>
          <span style="font-family:'Arial Normal', 'Arial';font-weight:400;">V11&nbsp; &nbsp;&nbsp; 26000以上&nbsp; &nbsp;&nbsp; 文曲星</span>
        </p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="centerDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "../views/pagination";
import {
  courseIntegral,
  learningTrajectoryTracking,
  learningSituation,
  semester,
  curriculum,
  integralStatistics,
  updateData,
  selectSynchroLog,
  assessModules,
  gitbenefitLearning,
  integralCourse
} from "../js/url";
export default {
  props: ["baseInfo"],
  name: "CompositePortrait",
  components: {
    Pagination
  },
  data() {
    return {
      shu: false,
      // 弹框数据
      sendIntegralData: {
        userId: "",
        termid: "", //学期选择
        courseid: "", //课程选择
        pageNum: 1,
        pageSize: 10,
        assessModuleId: 1
      },
      // 获取的学期
      semesterList: [{ termName: "全部学期", termid: "" }],

      // 获取课程名称
      courseNameList: [{ coursename: "全部课程", courseid: "" }],
      loading: true,
      emptyText: "暂无数据",
      current: 1,
      headerStyle: {
        height: "60px",
        backgroundColor: "#10859d",
        color: "dimgrey"
      },
      // 益达总积分
      pointTotal: "",
      // 列表数据
      tableData: [],
      totalPage: 1,
      excellentList: [], //学习轨迹跟踪优于
      failListL: [], //学习轨迹跟踪低于
      minType: "",
      minPersent: "", //最小占比

      typeScore3: "", //作业成绩
      sumTypeScore3: "", // 班级作业成绩
      compareScore3: "", //个人与班级比较
      ContrastScore3: "",

      typeScore2: "", //课堂练习成绩
      sumTypeScore2: "", // 班级课堂练习成绩
      compareScore2: "", //个人与班级比较
      ContrastScore2: "",

      typeScore1: "", //考试成绩
      sumTypeScore1: "", //班级考试成绩
      compareScore1: "", //个人与班级比较
      ContrastScore1: "",

      // 优于低于
      higherThan: [],

      trajectoryData: [],

      situationData: [],
      // 课程学习情况文字描述
      large: [],
      small: [],
      // 高于文字
      largenuber: 0,
      // 低于文字
      smallnuber: 0,
      //学期？学年
      schools: "",
      //更新数据时间
      gtime: "",
      // 当前积分
      jicurrent: "",
      optionsName: [],
      // 益学习课程选择到的id
      value: "1",
      // 益学习课程选择到的名字
      Selectivecourses: "",
      // 当前课程的数量
      Selectionquantity: 0,
      // 达标数量
      Targetquantity: 0,
      // 积分最低
      //正确率最低
      mintypeName: "",
      // 答题率
      Answerrate: "",
      centerDialogVisible: false,
      // 柱状加折现
      aiCoursePrecisionResponseList: [],
      // 柱状
      aiMajorTypeIntegralResponseList: [],
      items: []
    };
  },
  mounted() {
    this.getsemester();
    this.getcurriculum();
    this.getIntegralData();
    this.getLearningTrajectoryTrackingData();
    this.getLearningSituationData();
    this.getIntegralStatistics();
    this.Updatetime();
    this.getPortrait();
    this.getgitbenefitLearning();
    this.getOther();

    this.gettransverse();
    this.getvertical();
    // this.getLFTLearning();
  },
  methods: {
    getIntegralData() {
      //获取课程画像数据
      let { userId, classId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + courseIntegral, {
          params: { userId, classId }
        })
        .then(res => {
          let data = JSON.parse(res.data);

          if (data.code == 200) {
            let termid = [],
              integralValue = [],
              sumIntegralValue = [];
            for (let i = 0; i < data.data.length; i++) {
              termid.push(data.data[i].termid);

              integralValue.push(data.data[i].integralValue);
              sumIntegralValue.push(data.data[i].sumIntegralValue);
            }
            this.courseIntegralEchart(termid, integralValue, sumIntegralValue);
          } else {
            this.$message({
              type: "error",
              message: "请求出错，请联系技术人员"
            });
          }
        })
        .catch(() => {
          this.$message({ type: "error", message: "请求出错，请联系技术人员" });
        });
    },
    getintegralCourse() {},

    courseIntegralEchart(termid, integralValue, sumIntegralValue) {
      // 课程积分情况

      let scoreChart = this.$echart.init(this.$refs.scoreChart);
      scoreChart.setOption({
        grid: {
          left: 80,
          right: 80,
          top: 100,
          bottom: 50,
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },

        toolbox: {
          show: true
        },
        legend: {
          data: ["个人积分", "班级平均积分"],
          icon: "rect", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          y: "30",
          itemWidth: 20,

          itemHeight: 10,

          itemGap: 40,
          textStyle: { fontSize: 16 }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: termid,
            axisLine: {
              lineStyle: {
                color: "#008acd",
                width: 2 //这里是为了突出显示加上的
              }
            },
            axisLabel: {
              color: "#333333" //刻度线标签颜色
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#008acd",
                width: 2 //这里是为了突出显示加上的
              }
            },
            axisLabel: {
              color: "#333333" //刻度线标签颜色
            }
          }
        ],
        series: [
          {
            name: "个人积分",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: { type: "default" },
                color: "#90dcdd",
                lineStyle: {
                  color: "#3bc7cb"
                }
              }
            },
            data: integralValue
          },
          {
            name: "班级平均积分",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: { type: "default" },
                color: "#d7cdeb",
                lineStyle: {
                  color: "#b6a2de"
                }
              }
            },
            data: sumIntegralValue
          }
        ]
      });
    },
    getLearningTrajectoryTrackingData() {
      // 获取学习轨迹跟踪数据
      let { userId, classId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + learningTrajectoryTracking, {
          params: { userId, classId }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            let typeCount = [],
              typeArr = ["考试次数", "课堂练习次数", "作业次数"];
            let sumTypeScore = [],
              typeScore = [],
              numArr = [];
            this.typeScore3 = data.data.typeScore3; //个人作业成成绩
            this.sumTypeScore3 = data.data.sumTypeScore3; //班级作业成绩
            this.compareScore3 = this.compare(
              this.typeScore3,
              this.sumTypeScore3
            ); //个人与班级比较

            this.typeScore2 = data.data.typeScore2; //个人课堂练习成绩
            this.sumTypeScore2 = data.data.sumTypeScore2; //班级课堂练习成绩
            this.compareScore2 = this.compare(
              this.typeScore2,
              this.sumTypeScore2
            ); //个人与班级比较

            this.typeScore1 = data.data.typeScore1; //个人考试成绩
            this.sumTypeScore1 = data.data.sumTypeScore1; //班级考试成绩
            this.compareScore1 = this.compare(this.typeScore1, this.typeScore1); //个人与班级比较

            this.contrast(
              this.typeScore3,
              this.sumTypeScore3,
              "平时表现(作业)"
            );
            this.contrast(this.typeScore2, this.sumTypeScore2, "课堂练习");
            this.contrast(this.typeScore1, this.typeScore1, "考试表现");
            for (let attr in data.data) {
              if (attr.indexOf("typeCount") > -1) {
                typeCount.push({
                  value: parseInt(data.data[attr])
                });
              }
              if (attr.indexOf("sumTypeScore") > -1) {
                // console.log(data.data[attr]);

                sumTypeScore.push(data.data[attr]);
              }
              if (attr.indexOf("typeScore") > -1) {
                typeScore.push(data.data[attr]);
              }
            }

            for (let i = 0; i < typeCount.length; i++) {
              typeCount[i].name = typeArr[i];
              numArr.push(typeCount[i].value);
            }
            let max = Math.max.apply(Math, numArr); // 先找出最大的那个
            let min = Math.min.apply(Math, numArr); // 先找出最小的那个
            let total = numArr.reduce((i, x) => {
              return i + x;
            }); // 求和
            this.maxPersent = this.commonJs.percentNum(max, total);
            this.minPersent = this.commonJs.percentNum(min, total);
            for (let k = 0; k < typeCount.length; k++) {
              if (max == typeCount[k].value) {
                this.maxType = typeCount[k].name;
              }
              if (min == typeCount[k].value) {
                this.minType = typeCount[k].name;
              }
            }
            this.achievementEchart(sumTypeScore, typeScore);
          }
        });
    },
    // 判断是否为null
    gitdata(data) {
      if (data == null) {
        data = 0;
      } else {
        data = parseInt(data);
      }
      return data;
    },

    // 比较个人分与班级平均分
    compare(arr1, arr2) {
      if (arr1 >= arr2) {
        return "高于或等于";
      } else if (arr1 < arr2) {
        return "低于";
      }
    },
    contrast(arr1, arr2, name) {
      if (arr1 >= arr2) {
        this.higherThan.push(name + "优于平均水平");
      } else if (arr1 < arr2) {
        this.higherThan.push(name + "低于平均水平，有待加强");
      }
    },

    // 获取益学习饼图shuju
    getgitbenefitLearning() {
      let userId = this.$route.query.userId;
      this.$ajax
        .get(this.baseUrl + gitbenefitLearning, { params: { userId } })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            let list = data.data.aiStatisticsResponseList;
            this.optionsName = data.data.aiStatisticsResponseList;
            this.pointTotal = data.data.pointTotal;
            let complianceRateList = [],
              majorNameList = [],
              targetNumberList = [];
            for (let i = 0; i < list.length; i++) {
              complianceRateList.push(list[i].complianceRate);
              majorNameList.push(list[i].majorName);
              targetNumberList.push(list[i].targetNumber);
              list[i].name = list[i].majorName;
              list[i].value = list[i].targetNumber;
              if (this.value == list[i].majorId) {
                this.Selectivecourses = list[i].majorName;
              }
            }
            this.getLFTLearning(list, majorNameList, complianceRateList);
          }
        });
    },
    // 益学习饼图
    getLFTLearning(list, majorNameList, complianceRateList) {
      let LFTLearning = this.$echart.init(this.$refs.LFTLearning);
      LFTLearning.setOption({
        title: {
          text: "达标专业课程",
          subtext: "达标课程数",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["#2ec8ca", "#b6a2df", "#59b1f0", "#feb97e", "#d67a7f"],
        legend: {
          orient: "vertical",
          left: "left",
          data: majorNameList
        },
        series: [
          {
            name: "达标专业课程",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: list,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },

    // 益学习其它数据
    getOther() {
      let userId = this.$route.query.userId;
      let majorId = this.value;
      this.$ajax
        .get(this.baseUrl + integralCourse, {
          params: {
            userId,
            majorId
          }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            this.aiCoursePrecisionResponseList =
              data.data.aiCoursePrecisionResponseList;
            this.aiMajorTypeIntegralResponseList =
              data.data.aiMajorTypeIntegralResponseList;
            let transversenameList = [];
            let transversenuberList = [];
            for (
              let i = 0;
              i < data.data.aiMajorTypeIntegralResponseList.length;
              i++
            ) {
              transversenameList.push(
                data.data.aiMajorTypeIntegralResponseList[i].typeName
              );
              transversenuberList.push(
                data.data.aiMajorTypeIntegralResponseList[i].typeIntegral
              );
            }
            let accuracyList = [];
            let answerIntegralList = [];
            let courseNameData = [];
            let num = 0;
            let danum = 0;
            let typecolor = [
              "",
              "success",
              "info",
              "danger",
              "warning",
              "",
              "success",
              "info",
              "danger",
              "warning"
            ];

            if (data.data.aiCoursePrecisionResponseList.length > 0) {
              let maxda =
                data.data.aiCoursePrecisionResponseList[0].answerIntegral;
              let minrate = data.data.aiCoursePrecisionResponseList[0].accuracy;
              this.mintypeName =
                data.data.aiCoursePrecisionResponseList[0].courseName;
              this.Answerrate =
                data.data.aiCoursePrecisionResponseList[0].courseName;

              for (
                let y = 0;
                y < data.data.aiCoursePrecisionResponseList.length;
                y++
              ) {
                if (
                  data.data.aiCoursePrecisionResponseList[y].answerIntegral >
                    300 &&
                  data.data.aiCoursePrecisionResponseList[y].accuracy >= 60
                ) {
                  danum++;
                  this.items.push({
                    type: typecolor[y],
                    label: data.data.aiCoursePrecisionResponseList[y].courseName
                  });
                }
                if (
                  data.data.aiCoursePrecisionResponseList[y].answerIntegral <
                  maxda
                ) {
                  maxda =
                    data.data.aiCoursePrecisionResponseList[y].answerIntegral;
                  this.mintypeName =
                    data.data.aiCoursePrecisionResponseList[y].courseName;
                }
                if (
                  data.data.aiCoursePrecisionResponseList[y].accuracy < minrate
                ) {
                  minrate = data.data.aiCoursePrecisionResponseList[y].accuracy;
                  this.Answerrate =
                    data.data.aiCoursePrecisionResponseList[y].courseName;
                }
                num++;
                accuracyList.push(
                  data.data.aiCoursePrecisionResponseList[y].accuracy
                );
                courseNameData.push(
                  data.data.aiCoursePrecisionResponseList[y].courseName
                );
                answerIntegralList.push(
                  data.data.aiCoursePrecisionResponseList[y].answerIntegral
                );
              }
            }

            this.Selectionquantity = num;
            this.Targetquantity = danum;
            this.gettransverse(transversenameList, transversenuberList);
            this.getvertical(accuracyList, answerIntegralList, courseNameData);
          }
        });
    },
    // 益学习横柱状图
    gettransverse(transversenameList, transversenuberList) {
      let transverse = this.$echart.init(this.$refs.transverse);
      transverse.setOption({
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "value",
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "category",
            data: transversenameList,
            splitLine: {
              show: false
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        series: [
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "right"
              }
            },
            itemStyle: {
              normal: {
                // 定制显示（按顺序）
                color: function(params) {
                  var colorList = [
                    "#5a9bd5",
                    "#528334",
                    "#f5b185",
                    "#EE9201",
                    "#29AAE3",
                    "#B74AE5",
                    "#0AAF9F",
                    "#E89589",
                    "#16A085",
                    "#4A235A",
                    "#C39BD3 ",
                    "#F9E79F",
                    "#BA4A00",
                    "#ECF0F1",
                    "#616A6B",
                    "#EAF2F8",
                    "#4A235A",
                    "#3498DB"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            },
            data: transversenuberList
          }
        ]
      });
    },

    // 益学习的下拉框事件
    Choice(val) {
      let obj = {};
      obj = this.optionsName.find(item => {
        return item.majorId === val;
      });
      this.Selectivecourses = obj.majorName;
      this.getOther();
    },

    // 益学习 柱状图加折现图
    getvertical(accuracyList, answerIntegralList, courseNameData) {
      let vertical = this.$echart.init(this.$refs.vertical);
      vertical.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["答题数", "正确率"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: courseNameData
          }
        ],
        yAxis: [
          {
            type: "value"
          },
          {
            type: "value",
            name: "正确率",
            min: 0,
            max: 100,
            interval: 5,
            axisLabel: {
              formatter: "{value} %"
            }
          }
        ],
        series: [
          {
            name: "答题数",
            type: "bar",
            stack: "搜索引擎",
            data: answerIntegralList,
            itemStyle: {
              normal: {
                color: "#3edfcf"
              }
            }
          },
          // {
          //   name: '其他',
          //   type: 'bar',
          //   stack: '搜索引擎',
          //   data: [62, 82]
          // },
          {
            name: "正确率",
            type: "line",
            yAxisIndex: 1,
            data: accuracyList
          }
        ]
      });
    },

    //        班级分   , 个人分
    achievementEchart(sumTypeScore, typeScore) {
      //学习类型成绩

      let achievementChart = this.$echart.init(this.$refs.achievementChart);
      achievementChart.setOption({
        legend: {
          data: ["个人平均分", "班级平均分"],
          top: 60
        },
        title: {
          text: "学习类型成绩",
          left: "center",
          top: 40,
          textStyle: {
            color: "#444444",
            fontWeight: "normal"
          }
        },
        tooltip: {
          trigger: "item"
        },
        splitLine: {
          show: true,
          lineStyle: {
            width: 10,
            color: "#286fbb" // 图表背景网格线的颜色
          }
        },
        textStyle: {
          color: "#444444"
        },
        color: ["#f09796", "#9ac5f4"],
        radar: [
          {
            indicator: [
              { text: "考试成绩", max: 100 },
              { text: "课堂学习成绩", max: 100 },
              { text: "平时成绩（作业）", max: 100 }
            ],
            center: ["50%", "65%"],
            radius: "80%",
            splitLine: {
              show: true, //去掉网格线
              lineStyle: {
                width: 4,
                color: "#7384f4"
              }
            },
            splitArea: {
              areaStyle: {
                color: ["#fff", "#fff", "#7384f4"]
              }
            }
          }
        ],
        series: [
          {
            name: "",
            type: "radar",
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default",
                  backgroundColor: "green"
                }
              }
            },
            data: [
              {
                value: typeScore,
                name: "个人平均分"
              },
              {
                value: sumTypeScore,
                name: "班级平均分"
              }
            ]
          }
        ]
      });
    },
    getLearningSituationData() {
      // 获取课程情况数据
      let { userId, classId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + learningSituation, {
          params: { userId, classId }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            let str = "";
            for (let i in data.data) {
              this.situationData.push(data.data[i]);
            }
            console.log(this.situationData);

            //  计算出课程学习情况的最多和最少
            for (let j = 0; j < this.situationData.length; j++) {
              for (let i = 0; i < this.situationData[j].length; i++) {
                if (
                  this.situationData[j][i].integralValue >=
                    this.situationData[j][i].sumIntegralValue &&
                  this.large.length <= 4
                ) {
                  this.large.push(this.situationData[j][i].integralName + "  ");
                } else if (
                  this.situationData[j][i].integralValue <
                    this.situationData[j][i].sumIntegralValue &&
                  this.small.length <= 4
                ) {
                  this.small.push(this.situationData[j][i].integralName + "  ");
                }
              }
            }
            this.largenuber = this.large.length;
            this.smallnuber = this.small.length;

            // 判断学期还是学年
            if (this.situationData.length == 1) {
              this.schools = "学期";
            } else if (this.situationData.length > 1) {
              this.schools = "学年";
            }

            let integralName = [],
              integralValue = [],
              sumIntegralValue = [];
            let schollyear = [];

            for (let i = 0; i < this.situationData.length; i++) {
              integralName.push([]);
              integralValue.push([]);
              sumIntegralValue.push([]);
              schollyear.push([]);
              for (let k = 0; k < this.situationData[i].length; k++) {
                integralName[i].push({
                  name: this.situationData[i][k].integralName,
                  max: 100
                });
                // console.log(integralName[i]);

                integralValue[i].push(this.situationData[i][k].integralValue);
                sumIntegralValue[i].push(
                  this.situationData[i][k].sumIntegralValue
                );
                schollyear[i].push(
                  "第" + this.situationData[i][k].termid + "学期"
                );
              }
            }
            for (let i = 0; i < this.situationData.length; i++) {
              str += `<div class="fistYearChart"
                         style="width: 490px;height: 450px;float:left"
                         id="fistYearChart${i}">
                        </div>`;
            }
            document.querySelector(".course").innerHTML = str;
            let schollyearis = [];
            for (let j = 0; j < schollyear.length; j++) {
              schollyearis[j] = schollyear[j][0];
            }
            // console.log(integralName);
            for (let k = 0; k < this.situationData.length; k++) {
              this.learningSituationEchart(
                document.getElementById("fistYearChart" + k),
                schollyearis[k],
                integralName[k],
                integralValue[k],
                sumIntegralValue[k]
              );
            }
          }
        });
    },
    words() {},
    learningSituationEchart(
      el,
      year,
      integralName,
      integralValue,
      sumIntegralValue
    ) {
      // 课程学习情况
      console.log(
        el,
        "<br>",
        year,
        "<br>",
        integralName,
        "<br>",
        integralValue,
        "<br>",
        sumIntegralValue
      );

      let fistYearChart = this.$echart.init(el);

      let stu = this.baseInfo.username;
      fistYearChart.setOption({
        title: {
          text: year,
          textStyle: {
            color: "#444",
            fontWeight: "normal"
          },
          x: "center",
          y: 0
        },
        splitLine: {
          lineStyle: {
            width: 6
          }
        },
        color: ["#7edfb4", "#b6a2de"],
        legend: {
          top: 40,
          icon: "rect",
          itemWidth: 20,
          itemHeight: 20,
          data: [stu, "班级平均"]
        },
        tooltip: {
          trigger: "item",
          confine: true
        },
        radar: {
          name: {
            textStyle: {
              color: "#444",
              lineHeight: 20
            }
          },
          indicator: integralName,
          radius: 120,
          splitLine: {
            show: true, //去掉网格线
            lineStyle: {
              width: 2
            }
          }
        },
        series: [
          {
            name: "预算 vs 开销",
            type: "radar",
            data: [
              {
                value: integralValue,
                name: stu
              },
              {
                value: sumIntegralValue,
                name: "班级平均"
              }
            ]
          }
        ]
      });
    },

    // 点击更新同步数据
    synchronization() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + updateData, {
          params: { userId, assessModuleId: 1 }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            location.reload();
            this.$router.go(0);
          }
        })
        .catch(err => {
          this.$message.error("同步失败请联系管理员");
        });
    },

    // 同步数据时间获取
    Updatetime() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + selectSynchroLog, {
          params: {
            assessModuleId: 1,
            userId
          }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            this.gtime = data.data.createtime;
          }
        });
    },

    //获取学期接口
    getsemester() {
      let { userId } = this.$route.query;
      this.$ajax
        .get(this.baseUrl + semester, {
          params: { userId }
        })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            for (let i = 0; i < data.data.length; i++) {
              this.semesterList.push(data.data[i]);
            }
          }
        });
    },

    //获取课程名称接口
    getcurriculum() {
      if (this.sendIntegralData.termid == "") {
        this.courseNameList = [{ coursename: "全部课程", courseid: "" }];
      } else {
        let { userId } = this.$route.query;
        this.$ajax
          .get(this.baseUrl + curriculum, {
            params: {
              userId,
              termid: this.sendIntegralData.termid
            }
          })
          .then(res => {
            let data = JSON.parse(res.data);
            if (data.code == 200) {
              for (let i = 0; i < data.data.length; i++) {
                this.courseNameList.push(data.data[i]);
              }
            }
          });
      }
    },
    getPortrait() {
      //获取当前积分
      this.$ajax
        .get(this.baseUrl + assessModules, { params: this.$route.query })
        .then(res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].assessModuleId == 1) {
                this.jicurrent = data.data[i].integralValue;
              }
            }
          }
        });
    },

    //  获取积分明细列表
    getIntegralStatistics() {
      //获取积分统计
      this.sendIntegralData.userId = this.$route.query.userId;
      this.tableData = [];
      this.loading = true;
      this.$ajax
        .get(this.baseUrl + integralStatistics, {
          params: this.sendIntegralData
        })
        .then(res => {
          let data = JSON.parse(res.data);
          this.loading = false;
          this.tableData = [];
          if (data.code == 200) {
            this.tableData = JSON.parse(JSON.stringify(data.data));
            this.totalPage = data.totalPages;
            this.tableData.forEach(item => {
              item.integralTime = item.integralTime.substring(0, 10);
              item.integralValue = parseInt(item.integralValue);
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.tableData = [];
          if (err.message.indexOf("timeout") > -1) {
            this.emptyText = "请求超时,请刷新重试！";
          } else {
            this.emptyText = "请求出错，请稍后重试！";
          }
        });
    },

    seachData() {
      // 点击搜索查询
      this.getIntegralStatistics();
    },
    changePage(current, everyShowNum) {
      this.current = current;
      this.everyShowNum = everyShowNum;
      this.sendIntegralData.pageNum = this.current;
      this.getIntegralStatistics();
    }
  }
};
</script>
<style scoped>
@import "../style/portrait.css";
.scoreChart {
  height: 400px;
}
.dataShow {
  height: 300px;
  flex: 1;
  border-left: 1px solid #ccc;
}
.dataShow ul {
  padding-top: 30px;
}
.dataShow ul li {
  width: 50%;
  display: inline-block;
  text-indent: 60px;
  line-height: 50px;
  color: #444444;
}
.dataShow ul li span {
  color: #95706d;
}

.module .evaluatMain {
  padding: 20px;
}
.module .evaluatMain .interest {
  display: flex;
  margin-bottom: 20px;
}
.module .evaluatMain .interest p,
.module .evaluatMain .potentialBox p {
  width: 120px;
  height: 30px;
  border-radius: 15px;
  background-color: #10859d;
  color: #fff;
  text-align: center;
  line-height: 30px;
}
.module .ExperimentalResult {
  padding-top: 46px;
  padding-bottom: 30px;
  width: 912px;
  color: #444;
  margin: 0 auto;
  line-height: 24px;
}
.module .evaluatMain .interest span {
  display: block;
  flex: 1;
  height: 30px;
  line-height: 30px;
  text-indent: 24px;
  font-size: 14px;
  color: #444444;
}
.module .evaluatMain .potentialBox .potentialChart {
  height: 350px;
}
.module .labelBox {
  width: 840px;
  margin: 0 auto;
}
.module .trajectory {
  height: 460px;
  display: flex;
}
.module .trajectory .proportionChart,
.module .trajectory .achievementChart {
  flex: 1;
}
.module .trajectoryDetail,
.module .schoolYear {
  width: 875px;
  margin: 0 auto;
  color: #444444;
  line-height: 26px;
  padding-top: 60px;
}
.module .course {
  padding-top: 50px;
  overflow: hidden;
}
.module .integral {
  display: flex;
  justify-content: space-between;
  padding-right: 30px;
}
.module .integral .RIT {
  display: flex;
}
.module .integral .RIT > span {
  display: block;
  padding-right: 14px;
}

.el-popper .statistics_title {
  height: 45px;
  line-height: 45px;
  border-bottom: #dcdcdc solid 2px;
  display: flex;
  position: relative;
}
.el-popper .statistics_title .titleName {
  text-indent: 36px;
  position: relative;
  width: 392px;
  float: left;
}

.el-popper .statistics_title .titleName:after {
  display: block;
  position: absolute;
  width: 6px;
  height: 30px;
  background-color: #0088a0;
  content: "";
  top: 8px;
  color: #444444;
  left: 20px;
}
.el-popper .statistics_title .time {
  float: left;
  width: 400px;
}
.el-popper .statistics_title .time label {
  float: left;
}
.el-popper .statistics_title .time .el-input__inner {
  float: left;
  border: none;
  padding-top: 12px;
}
.el-popper .statistics_title .time .el-input__inner .el-input__icon {
  display: none;
}
.el-popper .statistics_title .time span {
  color: #adadad;
  position: relative;
  top: -2px;
}
.el-popper .statistics_title .time input {
  width: 110px;
  height: 28px;
  border-radius: 4px;
  box-sizing: border-box;
  border: 2px solid #adadad;
  position: relative;
  top: -2px;
}
.el-popper .statistics_title .integral {
  width: 180px;
  padding: 0 20px;
}
.el-popper .statistics_title .integral:nth-child(2) {
  width: 180px;
  padding-left: 0;
}
.el-popper .statistics_title .integral select {
  width: 110px;
  height: 32px;
  border: 2px solid #adadad;
  border-radius: 4px;
}
.tanBtn {
  width: 110px;
  height: 30px;
  line-height: 30px;
  text-align: left;
  text-indent: 30px;
  margin-top: 8px;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: url("../assets/images/search.png") 72px center no-repeat;
  background-color: #12849c;
  font-size: 15px;
  box-shadow: 2px 2px 5px #b1b0b0;
}
.el-popper .tableBox {
  padding: 0px 34px;
}
.module .touRed .btRed {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='%23F30' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/%3E%3C/svg%3E")
    repeat-x 0 100%;
  background-size: 20px auto;
  display: inline-block;
  padding-bottom: 4px;
  margin-right: 4px;
}
.x {
  position: absolute;
  right: 32px;
  font-size: 20px;
  cursor: pointer;
}
.module .benefitLearning {
  height: 900px;
}
.benefitLearning .LFTLearning {
  margin-top: 18px;
  padding: 0 22px;
}
.module .benefitLearningName {
  padding: 0 40px;
  border-bottom: #dcdcdc solid 2px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
}
.module .benefitLearningName span {
  display: inline-block;
  padding-right: 46px;
}
.module .benefitLearningName > div:nth-child(2) {
  cursor: pointer;
}
.module .benefitLearningName .wen {
  width: 30px;
  height: 30px;
  text-align: center;
  background: #cbcbcb;
  padding-right: 0;
  border-radius: 18px;
  color: #ffffff;
  font-weight: 600;
  font-size: 22px;
  cursor: pointer;
}
.benefitLearning > div {
  display: flex;
  height: 50%;
}
.RITLearning > div {
  height: 100%;
  flex: 1;
}
.selela {
  height: 30px !important;
  margin-left: 30px;
}
.analysia {
  height: 100px;
  padding: 12px 20px 5px 20px;
  margin-top: 24px;
  border-top: #dcdcdc solid 1px;
  display: flex;
}
.xuexianalys > div {
  margin: 10px 0px;
}
.xuexianalys > div .el-tag--plain {
  margin-right: 16px;
}
.bDnone {
  border: none;
  padding: 0;
  margin-left: 30px;
}
</style>
