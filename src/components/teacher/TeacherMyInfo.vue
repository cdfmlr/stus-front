<template>
  <div>
    <a-card id="info-card" hoverable>
      <img
              slot="cover"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
      <a-card-meta>
        <a-avatar
                style="color: #f56a00; backgroundColor: #fde3cf"
                slot="avatar">
          {{ (teacher.tid && teacher.tid.length >= 1) ? teacher.tid[teacher.tid.length-1] : 'T' }}
        </a-avatar>
        <template slot="title">
          <span>{{ teacher.tid }}</span>
          <a style="float: right" @click="fetchStudentInfo">
            <a-icon type="reload"/>
          </a>
        </template>
        <template slot="description">
          <a-descriptions style="width: 150px; margin: 0 auto;" :column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }">
            <a-descriptions-item label="姓名">
              {{ teacher.tname }}
            </a-descriptions-item>
            <a-descriptions-item label="院系">
              {{ teacher.tdept }}
            </a-descriptions-item>
            <a-descriptions-item label="职称">
              {{ teacher.tpro }}
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
        name: "TeacherMyInfo",
        data: function () {
            return {
                teacher: {
                    tid: getCookie("uid"),
                    tname: "-",
                    tdept: "-",
                    tsex: "未知",
                    tpro: "-"
                },
                timer: null
            }
        },
        methods: {
            fetchStudentInfo() {

                if (!this.teacher || !this.teacher.tid) {
                    return
                }
                let contextVue = this;
                axios({
                    method: 'get',
                    url: baseUrl + '/api/core/teacher',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        query: `tid = '${this.teacher.tid}'`
                    }
                }).then(function (response) {
                    console.log(response);
                    if (response.data && response.data.error) {
                        contextVue.$message.error('错误: ' + response.data.error);
                        return
                    }
                    if (response.data.length && response.data[0].tid) {
                        contextVue.$message.success("刷新成功");
                        contextVue.teacher = response.data[0]
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