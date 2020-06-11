<template>
  <div>
    <div v-if="showAllCourses">
      <a-button icon="reload"
                @click="fetchCoursesData">
        刷新
      </a-button>
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
                  title="查看并管理这门课程?"
                  @confirm="() => manageCourse(record)"
          >
            <a href="javascript:;">管理</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <div v-else>

      <a-page-header
              :title="managingCourseCname"
              :sub-title="managingCourseCid"
              @back="finishManageCourse"
      >
        <template slot="extra">
          <a-button icon="reload"
                    @click="fetchDataOfManagingCourse">
            刷新
          </a-button>
        </template>

        <a-row type="flex" :gutter="16">
          <a-col :span="6">
            <a-statistic
                    title="学生人数"
                    :value="statisticDataOfManagingCourse.count"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="6">
            <a-statistic
                    title="平均分数"
                    :value="statisticDataOfManagingCourse.average"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="6">
            <a-statistic
                    title="最高分数"
                    :value="statisticDataOfManagingCourse.best"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="6">
            <a-statistic
                    title="最低分数"
                    :value="statisticDataOfManagingCourse.worst"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="24" style="margin-top: 32px;">
            <a-statistic
                    title="不及格"
                    :value="statisticDataOfManagingCourse.not_pass_count"
                    :value-style="{ color: '#cf1322' }"
                    style="margin-right: 50px"
            >
              <template #suffix>
                <span> / {{ statisticDataOfManagingCourse.count }}</span>
              </template>
            </a-statistic>
          </a-col>
        </a-row>

      </a-page-header>

      <!--      <div style="text-align: start">-->


      <!--      </div>-->


      <a-table bordered :data-source="studentsDataOfManagingCourse" :scroll="{ x: 800 }"
               :columns="columnsOfManagingCourse" style="margin-top: 16px">
        <template slot="result" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.key, 'result', $event)"/>
        </template>
      </a-table>


    </div>
  </div>
</template>

<script>
    import {getCookie} from "../../util/cookieUtil";
    import EditableCell from "./EditableCell";
    import axios from "axios";
    import {baseUrl} from "../../main";

    const data = [];

    export default {
        name: "TeacherMyCrouses",
        components: {
            EditableCell
        },
        data() {
            return {
                data,
                tid: getCookie("uid"),
                studentsDataOfManagingCourse: [],
                statisticDataOfManagingCourse: {
                    count: 0,
                    average: 0,
                    best: 0,
                    worst: 0,
                    not_pass_count: 0
                },
                showAllCourses: true,
                managingCourseCname: null,
                managingCourseCid: null,
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
                        title: '学生人数',
                        dataIndex: 'student_num',
                        key: 'student_num',
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
                        title: 'operation',
                        dataIndex: 'operation',
                        fixed: 'right',
                        width: 100,
                        scopedSlots: {customRender: 'operation'},
                    }
                ],
                columnsOfManagingCourse: [
                    {
                        title: '学号',
                        dataIndex: 'sid',
                        key: 'sid'
                    },
                    {
                        title: '姓名',
                        dataIndex: 'sname',
                        key: 'sname'
                    },
                    {
                        title: '院系',
                        dataIndex: 'sdept',
                        key: 'sdept'
                    },
                    {
                        title: '专业',
                        dataIndex: 'smajor',
                        key: 'smajor'
                    },
                    {
                        title: '年级',
                        dataIndex: 'sgrade',
                        key: 'sgrade'
                    },
                    {
                        title: '班级',
                        dataIndex: 'sclass',
                        key: 'sclass'
                    },
                    {
                        title: '成绩',
                        dataIndex: 'result',
                        fixed: 'right',
                        key: 'result',
                        scopedSlots: {customRender: 'result'},
                    }
                ],
            };
        },
        methods: {
            fetchCoursesData() {
                if (!this.tid) {
                    return
                }
                let contextVue = this;
                axios({
                    method: 'get',
                    url: baseUrl + '/api/teacher/courses',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        tid: this.tid
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
            manageCourse(target) {
                this.managingCourseCid = target.cid;
                this.managingCourseCname = target.cname;
                this.showAllCourses = false;
                this.fetchDataOfManagingCourse();
            },
            finishManageCourse() {
                this.showAllCourses = true;
            },
            fetchDataOfManagingCourse() {
                if (!this.managingCourseCid) {
                    return
                }
                let contextVue = this;
                axios({
                    method: 'get',
                    url: baseUrl + '/api/teacher/data_of_course',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        cid: this.managingCourseCid
                    }
                }).then(function (response) {
                    console.log(response);
                    if (response.data && response.data.error) {
                        contextVue.$message.error('错误: ' + response.data.error);
                        return
                    }
                    if (response.data && Array.isArray(response.data.students)) {
                        contextVue.$message.success("刷新成功");

                        contextVue.statisticDataOfManagingCourse = response.data;

                        contextVue.studentsDataOfManagingCourse.splice(0, contextVue.studentsDataOfManagingCourse.length);
                        for (let i in response.data.students) {
                            response.data.students[i].key = i + contextVue.newRandomKey();
                            response.data.students[i].result = String(response.data.students[i].result)
                            contextVue.studentsDataOfManagingCourse = [...contextVue.studentsDataOfManagingCourse, response.data.students[i]];
                        }
                    } else {
                        contextVue.$message.error('未知错误');
                    }
                });
            },
            saveStudentResult(target) {
                // console.log(target);
                const targetCopy = JSON.parse(JSON.stringify(target));
                targetCopy.result = Number(targetCopy.result);
                targetCopy.cid = this.managingCourseCid;

                console.log(targetCopy);

                let contextVue = this;
                axios({
                    method: 'put',
                    url: baseUrl + '/api/core/sc',
                    headers: {
                        'token': getCookie('token'),
                    },
                    params: {
                        record: JSON.stringify([targetCopy])
                    }
                }).then(function (response) {
                    if (response.data && response.data.success) {
                        contextVue.$message.success("保存成功");
                        contextVue.fetchDataOfManagingCourse();
                    } else if (response.data && response.data.error) {
                        contextVue.$message.error("保存失败: " + response.data.error)
                    } else {
                        contextVue.$message.error("保存失败，发生了未知错误。")
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
            },
            onCellChange(key, dataIndex, value) {
                const dataOfManagingCourse = [...this.studentsDataOfManagingCourse];
                const target = dataOfManagingCourse.find(item => item.key === key);
                if (target) {
                    target[dataIndex] = value;
                    this.studentsDataOfManagingCourse = dataOfManagingCourse;

                    this.saveStudentResult(target);
                }
            },
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
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
</style>