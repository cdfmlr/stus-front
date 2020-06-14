<template>
  <div>
    <a-card id="info-card" hoverable>
      <img
              slot="cover"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
      <a-card-meta>
        <template slot="title">
          <span>{{ student.sid }}</span>
          <a style="float: right" @click="fetchStudentInfo">
            <a-icon type="reload"/>
          </a>
        </template>
        <template slot="description">
          <a-descriptions style="width: 150px; margin: 0 auto;" :column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }">
            <a-descriptions-item label="姓名">
              {{ student.sname }}
            </a-descriptions-item>
            <a-descriptions-item label="年龄">
              {{ student.sage }}
            </a-descriptions-item>
            <a-descriptions-item label="院系">
              {{ student.sdept }}
            </a-descriptions-item>
            <a-descriptions-item label="年级">
              {{ student.sgrade }}
            </a-descriptions-item>
            <a-descriptions-item label="班级">
              {{ student.sclass }}
            </a-descriptions-item>
            <a-descriptions-item label="专业">
              {{ student.smajor }}
            </a-descriptions-item>
          </a-descriptions>
        </template>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
    import axios from "axios";
    import {baseUrl} from "../../main";
    import {getCookie} from "../../util/cookieUtil";

    export default {
        name: "StudentMyInfo",
        data: function () {
            return {
                student: {
                    sid: getCookie("uid"),
                    sname: "-",
                    sdept: "-",
                    sage: "0",
                    ssex: "未知",
                    sgrade: "2020",
                    sclass: "-",
                    smajor: "-"
                },
                timer: null
            }
        },
        methods: {
            fetchStudentInfo() {
                if (!this.student || !this.student.sid) {
                    return
                }
                let contextVue = this;
                axios({
                    method: 'get',
                    url: baseUrl + '/api/core/student',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        query: `sid = '${this.student.sid}'`
                    }
                }).then(function (response) {
                    console.log(response);
                    if (response.data && response.data.error) {
                        contextVue.$message.error('错误: ' + response.data.error);
                        return
                    }
                    if (response.data.length && response.data[0].sid) {
                        contextVue.$message.success("刷新成功");
                        contextVue.student = response.data[0]
                    } else {
                        contextVue.$message.error('未知错误');
                    }
                });
            }
        },
        mounted() {
            this.timer = setTimeout(this.fetchStudentInfo, 0);
        },
        beforeDestroy() {
            clearTimeout(this.timer);
        }
    }
</script>

<style scoped>
  #info-card {
    width: 300px;
    margin: 0 auto;
    text-align: start;
  }
</style>