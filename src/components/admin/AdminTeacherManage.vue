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
    import axios from "axios";
    import {baseUrl} from "../../main";
    import {getCookie} from "../../util/cookieUtil";
    import StusDataTable from "../StusDataTable";

    export default {
        name: "AdminTeacherManage",
        components: {StusDataTable},
        data: function () {
            return {
                dataTabCols: ["tid", "tname", "tdept", "tsex", "tpro"]
            }
        },
        methods: {
            fetchFromServer(contextVue) {
                axios({
                    method: 'get',
                    url: baseUrl + '/api/core/teacher',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        query: "tid <> 'null'"
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
                            response.data[i].tsex = response.data[i].tsex ? '男' : '女';

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
                if (!target || !target.tid) {
                    return
                }
                axios({
                    method: 'delete',
                    url: baseUrl + '/api/core/teacher',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        query: `tid = '${target.tid}'`
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

                targetCopy.tsex = ["男", "m", "male", "man", "1"]
                    .includes(String(targetCopy.tsex).toLowerCase());

                axios({
                    method: 'put',
                    url: baseUrl + '/api/core/teacher',
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
            }
        }
    }
</script>

<style scoped>

</style>