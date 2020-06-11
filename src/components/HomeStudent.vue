<template>
  <div>
    <a-layout id="home-student">
      <!-- Sider Nav -->
      <a-layout-sider breakpoint="lg" collapsed-width="0" @collapse="onCollapse" @breakpoint="onBreakpoint"
                      style="background: #fff">
        <div class="logo">
          <img src="../assets/stus.png" width="200px" height="200px">
        </div>
        <a-menu theme="light" mode="inline" v-model="navSelected" @select="onNavMenuSelect">
          <a-menu-item key="myInfo">
            <a-icon type="home"/>
            <span class="nav-text">我的信息</span>
          </a-menu-item>
          <a-menu-item key="examResult">
            <a-icon type="reconciliation" />
            <span class="nav-text">成绩查询</span>
          </a-menu-item>
          <a-menu-item key="takeCourse">
            <a-icon type="funnel-plot" />
            <span class="nav-text">学生选课</span>
          </a-menu-item>
        </a-menu>
        <a-button type="danger" style="margin: 16px" icon="logout" @click="exitLogin">
          退出登录
        </a-button>
      </a-layout-sider>
      <a-layout>

        <!--Header-->
        <a-layout-header :style="{ background: '#fff', padding: 0 }">
          <h1>Stus</h1>
        </a-layout-header>

        <!-- Content -->
        <a-layout-content :style="{ margin: '24px 16px 0' }">
          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
            <!--          {{ navSelected }}-->
            <div v-if="navSelected[0]==='myInfo'">
              <student-my-info/>
            </div>
            <div v-else-if="navSelected[0]==='examResult'">
              <student-exam-result/>
            </div>
            <div v-else-if="navSelected[0]==='takeCourse'">
              <student-take-course/>
            </div>
          </div>
        </a-layout-content>

        <!-- Footer -->
        <a-layout-footer style="textAlign: center">
          <p>Stus Teaching Utility System</p>
          <p>Copyright (c) 2020 CDFMLR. All rights reserved.</p>
        </a-layout-footer>
      </a-layout>
    </a-layout>

    <!-- exit -->
    <a-modal v-model="exitVisible" title="退出登录" @ok="handleExit">
      <p>确定要退出登录？</p>
    </a-modal>
  </div>
</template>

<script>
    import StudentMyInfo from "./student/StudentMyInfo";
    import StudentExamResult from "./student/StudentExamResult";
    import StudentTakeCourse from "./student/StudentTakeCourse";
    import {setCookie} from "../util/cookieUtil";
    export default {
        name: "HomeStudent",
        components: {StudentTakeCourse, StudentExamResult, StudentMyInfo},
        data: function () {
            return {
                navSelected: ["myInfo"],
                exitVisible: false
            }
        },
        methods: {
            onCollapse(collapsed, type) {
                console.log(collapsed, type);
            },
            onBreakpoint(broken) {
                console.log(broken);
            },
            onNavMenuSelect(i) {
                console.log(i);
            },
            exitLogin() {
                this.exitVisible = true;
            },
            handleExit() {
                setCookie("token", "")
                this.exitVisible = false;
            }
        }
    }
</script>

<style scoped>

</style>