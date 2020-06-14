<template>
  <div>
    <a-layout id="home-admin">
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
          <a-menu-item key="studentManage">
            <a-icon type="solution" />
            <span class="nav-text">学生管理</span>
          </a-menu-item>
          <a-menu-item key="teacherManage">
            <a-icon type="contacts" />
            <span class="nav-text">教师管理</span>
          </a-menu-item>
          <a-menu-item key="courseManage">
            <a-icon type="book" />
            <span class="nav-text">课程管理</span>
          </a-menu-item>
          <a-menu-item key="courseTeacherManage">
            <a-icon type="deployment-unit" />
            <span class="nav-text">任课教师管理</span>
          </a-menu-item>
          <a-menu-item key="studentCourseManage">
            <a-icon type="reconciliation" />
            <span class="nav-text">学生选课管理</span>
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
              <admin-my-info/>
            </div>
            <div v-else-if="navSelected[0]==='studentManage'">
              <admin-student-manage/>
            </div>
            <div v-else-if="navSelected[0]==='teacherManage'">
              <admin-teacher-manage/>
            </div>
            <div v-else-if="navSelected[0]==='courseManage'">
              <admin-course-manage/>
            </div>
            <div v-else-if="navSelected[0]==='courseTeacherManage'">
              <admin-course-teacher-manage/>
            </div>
            <div v-else-if="navSelected[0]==='studentCourseManage'">
              <admin-student-course-manage/>
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
    import AdminMyInfo from "./admin/AdminMyInfo";
    import AdminStudentManage from "./admin/AdminStudentManage";
    import AdminTeacherManage from "./admin/AdminTeacherManage";
    import AdminCourseManage from "./admin/AdminCourseManage";
    import AdminCourseTeacherManage from "./admin/AdminCourseTeacherManage";
    import AdminStudentCourseManage from "./admin/AdminStudentCourseManage";
    import {setCookie} from "../util/cookieUtil";

    export default {
        name: "HomeAdmin",
        components: {
            AdminStudentCourseManage,
            AdminCourseTeacherManage, AdminCourseManage, AdminTeacherManage, AdminStudentManage, AdminMyInfo
        },
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