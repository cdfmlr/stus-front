<template>
  <div id="login-page">
    <a-page-header
            title="Welcome to Stus"
            sub-title="Login:"
    />
    <div id="login-pad">
      <a-form-model layout="horizontal" @submit="handleSubmit" @submit.native.prevent>
        <a-form-model-item class="login-form-item">
          <a-input-group compact>
            <a-input style="width: 50%" v-model="uid" placeholder="学号/教工号/管理员账号">
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
            </a-input>
            <a-select default-value="学生" @change="handleUtypeChange">
              <a-select-option value="student">
                学生
              </a-select-option>
              <a-select-option value="teacher">
                教师
              </a-select-option>
              <a-select-option value="admin">
                教务
              </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item class="login-form-item">
          <a-input-password style="width: 66%" v-model="password" type="password" placeholder="密码">
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
          </a-input-password>
        </a-form-model-item>
        <a-form-model-item class="login-form-item">
          <a-button
                  type="primary"
                  html-type="submit"
                  :disabled="uid === '' || password === ''"
                  :hidden="onLogin">
            Log in
          </a-button>
          <a-spin :hidden="!onLogin"/>
        </a-form-model-item>
      </a-form-model>
    </div>
    <footer>
      <p>Stus Teaching Utility System</p>
      <p>Copyright (c) 2020 CDFMLR. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
    import axios from 'axios'
    import {baseUrl} from "../main"
    import {setCookie} from "../util/cookieUtil"

    export default {
        name: "Login",
        data: function () {
            return {
                utype: "student",
                uid: "",
                password: "",
                onLogin: false,
                timer: null
            }
        },
        methods: {
            handleUtypeChange(value) {
                this.utype = value
            },
            handleSubmit(e) {
                console.log(e);
                this.onLogin = true;
                // alert(this.utype + "\n" + this.uid + "\n" + this.password);
                let thisVue = this;
                axios({
                    method: 'get',
                    url: baseUrl + '/api/login',
                    params: {
                        utype: thisVue.utype,
                        uid: thisVue.uid,
                        password: thisVue.password
                    }
                }).then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        thisVue.$message.error('用户名或密码错误');
                        return
                    }
                    if (response.data.token) {
                        thisVue.$message.success('登录成功，欢迎，' + thisVue.uid);
                        setCookie("token", response.data.token);
                        setCookie("utype", thisVue.utype);
                        setCookie("uid", thisVue.uid);
                    } else {
                        thisVue.$message.error('登录失败，未知错误');
                        return;
                    }
                    thisVue.onLogin = false;
                });
                this.onLogin = false;
            },
            setBg() {
            }
        },
        mounted() {
            this.timer = setTimeout(this.setBg, 0);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    }
</script>

<style scoped>
  * {
    margin:0;
    padding:0;
  }
  #login-page {
    margin:0;
    padding:0;
    width:100%;
    height:100vh;
    text-align: center;
    background-image: url("../assets/login_bg.png");
  }
  #login-pad {
    height: 300px;
    width: 400px;
    background-color: rgba(31, 200, 219, 0.3);
    background-image: linear-gradient(141deg, rgba(254, 255, 254, 0.9) 0%, rgba(101, 219, 255, 0.9) 51%, rgba(232, 232, 232, 0.9) 75%);
    box-shadow: 6px 5px 12px rgba(31, 200, 219, 0.6);
    color: white;
    opacity: 0.95;
    text-align: center;
    alignment: center;
    margin: auto;
    color: #f3f3f3;
    font-size: 30px;
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .login-form-item {
    width: 400px;
    margin: 0 auto;
  }
  footer {
    margin-top: 60px;
    color: darkgray;
  }
</style>