<template>
  <div>
    <a-layout id="home-teacher">
      <!-- Sider Nav -->
      <a-layout-sider breakpoint="lg" collapsed-width="0" @collapse="onCollapse" @breakpoint="onBreakpoint"
                      style="background: #fff">
        <div class="logo">
          <span>logo</span>
          <hr/>
        </div>
        <a-menu theme="light" mode="inline" v-model="navSelected" @select="onNavMenuSelect">
          <a-menu-item key="myInfo">
            <a-icon type="home"/>
            <span class="nav-text">我的信息</span>
          </a-menu-item>
          <a-menu-item key="myCourses">
            <a-icon type="home"/>
            <span class="nav-text">课程管理</span>
          </a-menu-item>
        </a-menu>
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
              <teacher-my-info/>
            </div>
            <div v-else-if="navSelected[0]==='myCourses'">
              <teacher-my-crouses/>
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
  </div>
</template>

<script>
    import TeacherMyInfo from "./teacher/TeacherMyInfo";
    import TeacherMyCrouses from "./teacher/TeacherMyCrouses";
    export default {
        name: "HomeTeacher",
        components: {TeacherMyCrouses, TeacherMyInfo},
        data: function () {
            return {
                navSelected: ["myInfo"],
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
            }
        }
    }
</script>

<style scoped>

</style>