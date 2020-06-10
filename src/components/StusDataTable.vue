<template>
  <div>
    <a-button-group>
      <a-button @click="handleAdd">
        添加
      </a-button>
      <a-button @click="handleRefresh">
        刷新
      </a-button>
    </a-button-group>

    <a-table :columns="columns" :data-source="data" bordered :scroll="{ x: 800 }">
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

      <template
              v-for="col in this.dataCols"
              :slot="col"
              slot-scope="text, record"
      >
        <div :key="col">
          <a-input
                  v-if="record.editable"
                  style="margin: -5px 0"
                  :value="text"
                  @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">Save</a>
          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
            <a>Cancel</a>
          </a-popconfirm>
        </span>
          <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">Edit</a>
          <a-popconfirm
                  v-if="data.length"
                  title="Sure to delete?"
                  @confirm="() => handleDelete(record.key)"
          >
          <a :disabled="editingKey !== ''" href="javascript:;">Delete</a>
        </a-popconfirm>
        </span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
    let data = [];

    export default {
        name: "StusDataTable",
        props: {
            dataColTitles: Array,
            fetchFromServer: Function,
            deleteFromServer: Function,
            saveToServer: Function
        },
        data() {
            this.cacheData = data.map(item => ({...item}));
            return {
                data,
                searchText: '',
                searchInput: null,
                searchedColumn: '',
                editingKey: '',
                timer: null
            };
        },
        computed: {
            dataCols: function () {
              return this.dataColTitles;
            },
            columns: function () {
                // columns 是由 cols + operation 构建成的列（所有数据列都包含搜索功能）
                let columns = [];
                for (let c in this.dataCols) {
                    columns.push({
                        title: this.dataCols[c],
                        dataIndex: this.dataCols[c],
                        scopedSlots: {
                            customRender: this.dataCols[c],
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                        },
                        onFilter: (value, record) =>
                            record[this.dataCols[c]]
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
                    })
                }
                columns.push({
                    title: 'operation',
                    dataIndex: 'operation',
                    fixed: 'right',
                    width: 128,
                    scopedSlots: {customRender: 'operation'},
                });
                return columns
            }
        },
        methods: {
            handleAdd() {
                const {data} = this;

                const newData = this.dataCols.reduce((a, b) => (a[b] = '', a), {});
                newData.key = this.newRandomKey();
                this.data = [...data, newData];
                this.cacheData = this.data.map(item => ({...item}));
            },
            handleRefresh() {
                this.fetchFromServer(this)
            },
            handleChange(value, key, column) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target[column] = value;
                    this.data = newData;
                }
            },
            handleDelete(key) {
                const data = [...this.data];
                const target = data.filter(item => key === item.key)[0];

                // 从服务器删除
                this.deleteFromServer(this, target);

                this.data = data.filter(item => item.key !== key);
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
            edit(key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                this.editingKey = key;
                if (target) {
                    target.editable = true;
                    this.data = newData;
                }
            },
            save(key) {
                const newData = [...this.data];
                const newCacheData = [...this.cacheData];
                // console.debug(newCacheData, this.cacheData);
                const target = newData.filter(item => key === item.key)[0];

                const targetCache = newCacheData.filter(item => key === item.key)[0];
                if (target && targetCache) {
                    // 保存到服务器
                    this.saveToServer(this, target);

                    delete target.editable;
                    this.data = newData;
                    Object.assign(targetCache, target);
                    this.cacheData = newCacheData;
                }
                this.editingKey = '';
            },
            cancel(key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                this.editingKey = '';
                if (target) {
                    Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                    delete target.editable;
                    this.data = newData;
                }
            },
            newRandomKey() {
                return Math.random().toString(36).slice(-8) + new Date().getTime().toString();
            }
        },
        mounted() {
            this.timer = setTimeout(() => this.fetchFromServer(this), 0);
        },
        beforeDestroy() {
            clearTimeout(this.timer);
        }
    }
</script>

<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>