<template>
  <div id="app">
    <login v-if="!logined"/>
    <home-admin v-if="logined && (utype==='admin')"/>
    <home-student v-if="logined && (utype==='student')"/>
  </div>
</template>

<script>
    import Login from './components/Login.vue'
    import {getToken} from "./main";
    import HomeAdmin from "./components/HomeAdmin";
    import {getCookie} from './util/cookieUtil';
    import HomeStudent from "./components/HomeStudent";

    export default {
        name: 'App',
        components: {
            HomeStudent,
            HomeAdmin,
            Login
        },
        data: function () {
            return {
                firstIn: true,
                logined: false,
                utype: null,
                timer: null
            }
        },
        methods: {
            checkLogin() {
                let token = getToken();
                // console.log("token: " + token);
                this.logined = !!token;
                this.utype = getCookie("utype");
                if (!this.logined && this.firstIn) {
                    this.$message.warn("请登录");
                    this.firstIn = false;
                }
            }
        },
        mounted() {
            this.timer = setInterval(this.checkLogin, 1000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }

    }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
