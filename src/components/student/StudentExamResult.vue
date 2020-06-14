<template>
  <div>
    <a-page-header
            title="我的成绩"
    >
      <template slot="extra">
        <a-button icon="reload"
                  @click="fetchData">
          刷新
        </a-button>
      </template>
    </a-page-header>

    <a-table :data-source="data" :columns="columns" style="margin-top: 16px">
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
    </a-table>



  </div>
</template>

<script>
    import {getCookie} from "../../util/cookieUtil";
    import axios from "axios";
    import {baseUrl} from "../../main";

    const data = [
        // {
        //     key: '1',
        //     cid: 'w001',
        //     cname: "东风东西装",
        //     result: 23,
        // },
        // {
        //     key: '2',
        //     cid: 'w3445',
        //     cname: "丰登",
        //     result: 99,
        // },
    ];

    export default {
        name: "StudentExamResult",
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
                        title: '成绩',
                        dataIndex: 'result',
                        key: 'result',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'customRender',
                        },
                        onFilter: (value, record) =>
                            record.address
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
                ],
            };
        },
        methods: {
            fetchData() {
                if (!this.sid) {
                    return
                }
                let contextVue = this;
                axios({
                    method: 'get',
                    url: baseUrl + '/api/student/exam_result',
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
                            contextVue.data = [...contextVue.data, response.data[i]];
                        }
                    } else {
                        contextVue.$message.error('未知错误');
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
            this.timer = setTimeout(this.fetchData, 0);
        },
        beforeDestroy() {
            clearTimeout(this.timer);
        }
    }
</script>

<style scoped>
  .highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
  }
</style>