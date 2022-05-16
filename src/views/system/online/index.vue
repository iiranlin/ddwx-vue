<template>
  <div class="app-container">
    <el-row :gutter="20" class="container_h">
      <el-col :span="20" :xs="24" class="container_flex" >
        <el-form :model="formData" ref="queryForm" :inline="true" v-show="showSearch" v-if="property.search.length>0">
          <el-form-item :label="item.fieldName" :prop="item.fieldCode" v-for="item in property.search" :key="item.id">
            <el-select
              v-if="item.fieldType == 'dict'"
              v-model="formData[item.fieldCode]"
              :placeholder="'请选择'+item.fieldName"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="(value,key)  in item.fieldFormat"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
            <el-date-picker
              v-else-if="item.fieldType == 'date'"
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <el-input
              v-else-if="item.fieldType == 'String'"
              v-model="formData[item.fieldCode]"
              :placeholder="'请输入'+item.fieldName"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id">
            <el-button
              v-if="item.buttonMode"
              :type="item.buttonType"
              plain
              :icon="item.buttonIcon"
              size="mini"
              @click="newButton(item.buttonCode)"
              :disabled="item.buttonMode == '1'?single:multiple"
            >{{item.buttonName}}</el-button>
            <el-button
              v-else
              :type="item.buttonType"
              plain
              :icon="item.buttonIcon"
              size="mini"
              @click="newButton(item.buttonCode)"
            >{{item.buttonName}}</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="handleQuery"></right-toolbar>
        </el-row>

        <el-table ref="elTable" class="container_table" height="100%" v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" @sort-change="sortableColumnChange">
          <el-table-column type="selection" width="50" align="center" fixed="left" />
          <el-table-column v-for="(item,key) in property.fields" :key="key"
          :show-overflow-tooltip="true"
          :label="item.fieldName" 
          :prop="item.fieldCode" 
          :align="item.align || 'center'"
          :width="item.fieldWidth || 'auto'"
          :sortable="item.isOrder == 1? 'custom' : false"
          :filters="item.isOrder == 1?[]: null"
          :render-header="item.isSearchHeader == 1? (h, obj) => renderSpecNameHeader(h, obj, item.fieldType, item.fieldFormat) : renderHeader"
          >
            <template slot-scope="{row}">
              <span v-if="item.fieldType === 'date'">{{ parseTime(row[item.fieldCode], item.fieldFormat) }}</span>
              <span v-else-if="item.fieldType === 'dict'">{{ row[item.fieldCode] | fieldFormat(item.fieldFormat)}}</span>
              <span v-else>{{ row[item.fieldCode] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
            v-if="property.buttonRow"
          >
            <template slot-scope="scope">
              <el-button
                v-for="item in property.buttonRow" :key="item.id"
                size="mini"
                type="text"
                :icon="item.buttonIcon"
                @click="newButton(item.buttonCode, scope.row)"
              >{{item.buttonName}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="listQuery.total>0"
          :total="listQuery.total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <operate ref="operate" @operateSuccess="operateSuccess" :deptOptions="deptOptions" />
  </div>
</template>

<script>
import { menuProperty } from '@/api/system/menu'
import {page, deleteBatch} from '@/api/online/table'
import operate from "./components/operate";
import indexMixin from '@/views/mixins';
import SelectHeader from "@/components/SelectHeader";
export default {
  name: "dept",
  mixins: [indexMixin],
  components: { operate },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 用户表格数据
      dataList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 日期范围
      dateRange: [],
      //列表显示字段
      property: {},
      // 查询参数
      formData: {
        parentId: '',
      },
      listQuery: {
        total: 0,
        pageNum: 1,
        pageSize: 30,
      },
      visible: false
    };
  },
  watch: {
  },
  created() {
    this.menuProperty();
    this.getList();
  },
  methods: {
    renderHeader (h, {column, $index}, index) {
      return (
        <span>
        {column.label}
        </span>
      )
    },
    //渲染**的tableheader
    renderSpecNameHeader(createElement, { column, $index }, fieldType, fieldFormat) {
      let fieldFormatObj = null;
      if(fieldType == "dict"){
        fieldFormatObj = JSON.parse(fieldFormat)
      }
      let self = this;
      //该列的绑定数据
      // console.log(column.label);
      //列号
      // console.log($index);
      return createElement(
        "div",
        {
          style: "display:inline-flex;"
        },
        [
          createElement("div", {
            domProps: {
              innerHTML: column.label
            }
          }),
          createElement(SelectHeader, {
            style: "cursor: pointer;margin-left: 5px;",
            // 组件 prop
            props: {
              type: column.property,
              fieldType: fieldType,
              fieldFormat: fieldFormatObj,
              columnLabel: column.label
            },
            // 事件监听器在 `on` 属性内，
            // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
            // 需要在处理函数中手动检查 keyCode。
            on: {
              selectChange: self.selectChange
              // click: this.clickHandler
            },
            // 仅用于组件，用于监听原生事件，而不是组件内部使用
            // `vm.$emit` 触发的事件。
            nativeOn: {
              // click: this.nativeClickHandler
            }
          })
        ]
      );
    },
    //选择框回调
    selectChange(data) {
      let type = data["type"];
      let value = data["value"];
      if(type === 'createTime'){
        this.dateRange = value;
      }else{
        this.formData[type] = value;
      }
      this.handleQuery();
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.formData.parentId = data.id;
      this.handleQuery();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.formData.parentId = '';
      this.dateRange = [];
      this.formData.createTimeStart = '';
      this.formData.createTimeEnd = '';
      this.handleQuery();
    },
    emitAblFilter () {
      this.handleQuery();
    },
    handleQuery () {
      this.menuProperty();
      this.getList();
    },
    menuProperty () {
      let id = this.$route.meta.id;
      menuProperty(id).then( ({data}) => {
        if(data.search){
          data.search.forEach((item) => {
          if(item.fieldType == "dict"){
            item.fieldFormat = JSON.parse(item.fieldFormat)
          }
        })
        }
        this.property = data;
        this.$nextTick( () => {
          this.$refs.elTable.doLayout();
        })
      })
    },
    getList () {
      let dateRange = this.dateRange;
      if(dateRange && dateRange.length != 0){
        this.formData.createTimeStart = dateRange[0];
        this.formData.createTimeEnd = dateRange[1];
      }else{
        this.formData.createTimeStart = null;
        this.formData.createTimeEnd = null;
      }
      this.loading = true;
      page(Object.assign({}, this.listQuery, this.formData)).then( ({data}) => {
        this.dataList = data.list;
        this.listQuery.total = data.total;
        this.loading = false;
        this.$nextTick( () => {
          this.$refs.elTable.doLayout();
        })
      })
    },
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleCreate () {
      this.$refs.operate.init('create', this.formData.parentId);
    },
    handleUpdate (row) {
      let id = '';
      if(row){
        id = row.id;
      }else{
        id = this.ids[0];
      }
      this.$refs.operate.init('update', id);
    },
    handleDelete (row) {
      let ids = row.id || this.ids;
      if(!(ids instanceof Array)){
        ids = [ids];
      }
      this.$modal.confirm('是否确认删除?').then(function() {
        return deleteBatch({ids});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    newButton (buttonCode, row) {
      if (buttonCode == 'update') {
        this.handleUpdate(row || '');
      }else if (buttonCode === 'delete') {
        this.handleDelete(row || '');
      }else if (buttonCode === 'create') {
        this.handleCreate();
      }
    },
    operateSuccess () {
      this.handleQuery();
    }
  }
};
</script>