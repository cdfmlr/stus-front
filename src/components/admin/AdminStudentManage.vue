<template>
  <div>
    <stus-data-table
            :data-col-titles="dataTabCols"
            :fetch-from-server="fetchFromServer"
            :delete-from-server="deleteFromServer"
            :save-to-server="saveToServer"/>
  </div>
</template>

<script>
    import axios from 'axios'
    import {baseUrl} from "../../main";
    import {getCookie} from "../../util/cookieUtil";
    import StusDataTable from "../StusDataTable";

    export default {
        name: "AdminStudentManage",
        components: {StusDataTable},
        data: function () {
            return {
                dataTabCols: ["sid", "sname", "sdept", "sage", "ssex", "sgrade", "sclass", "smajor"]
            };
        },
        methods: {
            fetchFromServer(contextVue) {
                axios({
                    method: 'get',
                    url: baseUrl + '/api/core/student',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        query: "sid <> 'null'"
                    }
                }).then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        contextVue.$message.error('错误: ' + response.data.error);
                        return
                    }
                    if (Array.isArray(response.data)) {
                        contextVue.$message.success("刷新成功");
                        contextVue.data.splice(0, contextVue.data.length);
                        for (let i in response.data) {
                            response.data[i].key = i + contextVue.newRandomKey();
                            response.data[i].ssex = response.data[i].ssex ? '男' : '女';
                            contextVue.data = [...contextVue.data, response.data[i]];
                        }
                        contextVue.cacheData = contextVue.data.map(item => ({...item}));
                    } else {
                        contextVue.$message.error('未知错误');
                    }
                });
            },
            deleteFromServer(contextVue, target) {
                console.log(target);
                if (!target || !target.sid) {
                    return
                }
                axios({
                    method: 'delete',
                    url: baseUrl + '/api/core/student',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        query: `sid = '${target.sid}'`
                    }
                }).then(function (response) {
                    if (response.data && response.data.success) {
                        contextVue.$message.success("删除成功")
                    } else if (response.data && response.data.error) {
                        contextVue.$message.error("删除失败: " + response.data.error)
                    } else {
                        contextVue.$message.error("删除失败，发生了未知错误。")
                    }
                });


            },
            saveToServer(contextVue, target) {
                console.log(target);
                const targetCopy = JSON.parse(JSON.stringify(target));

                // 把数据整理成后端要的 type，主要是处理非 String 的（js 做这个方便，给 go 去搞这些有点点麻烦）
                targetCopy.sage = Number(targetCopy.sage);
                targetCopy.ssex = ["男", "m", "male", "man", "1"]
                    .includes(String(targetCopy.ssex).toLowerCase());

                axios({
                    method: 'put',
                    url: baseUrl + '/api/core/student',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        record: JSON.stringify([targetCopy])
                    }
                }).then(function (response) {
                    if (response.data && response.data.success) {
                        contextVue.$message.success("保存成功")
                    } else if (response.data && response.data.error) {
                        contextVue.$message.error("保存失败: " + response.data.error)
                    } else {
                        contextVue.$message.error("保存失败，发生了未知错误。")
                    }
                });
            },
        },
    }
</script>

<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>