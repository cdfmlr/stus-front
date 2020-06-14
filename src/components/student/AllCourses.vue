<template>
  <div>
    <a-table :data-source="data" :columns="columns" :scroll="{ x: 800 }" style="margin-top: 16px">
      <div
              slot="filterDropdown"
              slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
              style="padding: 8px"
      >
        <a-input
                v-ant-ref="c => (searchInput = c)"
                :placeholder="`Search ${column.dataIndex}`"
                :value="selectedKeys[0]"
                style="width: 188px; margin-bottom: 8px; display: block;"
                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
                type="primary"
                icon="search"
                size="small"
                style="width: 90px; margin-right: 8px"
                @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          Search
        </a-button>
        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
          Reset
        </a-button>
      </div>
      <a-icon
              slot="filterIcon"
              slot-scope="filtered"
              type="search"
              :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="customRender" slot-scope="text, record, index, column">
      <span v-if="searchText && searchedColumn === column.dataIndex">
        <template
                v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
                  v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                  :key="i"
                  class="highlight"
          >{{ fragment }}</mark
          >
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
        <template v-else>
          {{ text }}
        </template>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
                v-if="data.length"
                title="确认要选这门课吗?"
                @confirm="() => takeCourses(record)"
        >
          <a href="javascript:;">选课</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
    import {getCookie} from "../../util/cookieUtil";
    import axios from "axios";
    import {baseUrl} from "../../main";

    const data = [];

    export default {
        name: "AllCourses",
        data() {
            return {
                data,
                sid: getCookie("uid"),
                searchText: '',
                searchInput: null,
                searchedColumn: '',
                timer: null,
                columns: [
                    {
                        title: '课程号',
                        dataIndex: 'cid',
                        key: 'cid',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.cid
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                }, 0);
                            }
                        },
                    },
                    {
                        title: '课程名',
                        dataIndex: 'cname',
                        key: 'cname',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.cname
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        },
                    },
                    {
                        title: '类型',
                        dataIndex: 'ctype',
                        key: 'ctype',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.ctype
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        },
                    },
                    {
                        title: '学分',
                        dataIndex: 'cpoint',
                        key: 'cpoint',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.cpoint
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        },
                    },
                    {
                        title: '上课周数',
                        dataIndex: 'cweek',
                        key: 'cweek',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.cweek
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        },
                    },
                    {
                        title: '上课时间',
                        dataIndex: 'ctime',
                        key: 'ctime',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.ctime
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        },
                    },
                    {
                        title: '上课地点',
                        dataIndex: 'caddr',
                        key: 'caddr',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.caddr
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        },
                    },
                    {
                        title: '授课老师',
                        dataIndex: 'tname',
                        key: 'tname',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.tname
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        },
                    },
                    {
                        title: '教师院系',
                        dataIndex: 'tdept',
                        key: 'tdept',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.tdept
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        },
                    },
                    {
                        title: '教师性别',
                        dataIndex: 'tsex',
                        key: 'tsex',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.tsex
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        },
                    },
                    {
                        title: '教师职称',
                        dataIndex: 'tpro',
                        key: 'tpro',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.tpro
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                        onFilterDropdownVisibleChange: visible => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        },
                    },
                    {
                        title: 'operation',
                        dataIndex: 'operation',
                        fixed: 'right',
                        width: 100,
                        scopedSlots: {customRender: 'operation'},
                    }
                ],
            };
        },
        methods: {
            fetchCoursesData() {
                if (!this.sid) {
                    return
                }
                let contextVue = this;
                axios({
                    method: 'get',
                    url: baseUrl + '/api/student/courses',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        sid: this.sid
                    }
                }).then(function (response) {
                    console.log(response);
                    if (response.data && response.data.error) {
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
                    } else {
                        contextVue.$message.error('未知错误');
                    }
                });
            },
            takeCourses(target) {
                let record = {
                    sid: getCookie("uid"),
                    cid: target.cid,
                };
                let contextVue = this;
                axios({
                    method: 'put',
                    url: baseUrl + '/api/core/sc',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        record: JSON.stringify([record])
                    }
                }).then(function (response) {
                    if (response.data && response.data.success) {
                        contextVue.$message.success("选课成功")
                    } else if (response.data && response.data.error) {
                        contextVue.$message.error("选课失败: " + response.data.error)
                    } else {
                        contextVue.$message.error("选课失败，发生了未知错误。")
                    }
                });
            },
            handleSearch(selectedKeys, confirm, dataIndex) {
                confirm();
                this.searchText = selectedKeys[0];
                this.searchedColumn = dataIndex;
            },
            handleReset(clearFilters) {
                clearFilters();
                this.searchText = '';
            },
            newRandomKey() {
                return Math.random().toString(36).slice(-8) + new Date().getTime().toString();
            }
        },
        mounted() {
            this.timer = setTimeout(this.fetchCoursesData, 0);
        },
        beforeDestroy() {
            clearTimeout(this.timer);
        }
    }
</script>

<style scoped>

</style>