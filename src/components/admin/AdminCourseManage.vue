<template>
  <div>
    <a-page-header
            title="课程管理"
    />
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
        name: "AdminCourseManage",
        components: {StusDataTable},
        data: function () {
            return {
                dataTabCols: ["cid", "cname", "ctype", "cpoint", "cweek", "ctime", "caddr"]
            };
        },
        methods: {
            fetchFromServer(contextVue) {
                axios({
                    method: 'get',
                    url: baseUrl + '/api/core/course',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        query: "cid <> 'null'"
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
                if (!target || !target.cid) {
                    return
                }
                axios({
                    method: 'delete',
                    url: baseUrl + '/api/core/course',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        query: `cid = '${target.cid}'`
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
                targetCopy.cpoint = Number(targetCopy.cpoint);

                axios({
                    method: 'put',
                    url: baseUrl + '/api/core/course',
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

</style>