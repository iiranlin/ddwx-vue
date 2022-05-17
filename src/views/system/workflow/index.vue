<template>
  <div class="app-container container_flex">
    <el-row :gutter="10" class="mb8 container_flex_button">
      <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
        <button-top class="cume-button" :item="item" :multiple="multiple" :single="single" @newButton="newButton"></button-top>
      </el-col>
      <right-toolbar ref="rightToolbar" :showSearch.sync="showSearch" :columns="property.fields"
                     @queryTable="handleQuery" @handleCheckAllChange="handleCheckAllChange" @clickReset="clickReset"
                     @numberChange="numberChange"
      ></right-toolbar>
    </el-row>
    <form-data :showSearch="showSearch" :searchArr="property.search || []" @handleQuery="handleQuery"/>
    <table-index ref="tableIndex" :loading="loading" :tableData="dataList" :property="property" :numberShow="numberShow"
                 @handleSelectionChange="handleSelectionChange"
                 @handleButton="handleButton"
                 @selectChange="selectChange"
                 @emitAblFilter="emitAblFilter"
    />
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {modelListPage, modelEditUrl} from "@/api/system/activiti";
import indexMixin from '@/views/mixins';
import tableIndex from "@/components/tableIndex";
import formData from "@/components/formData";
import buttonTop from "@/components/buttonTop";

export default {
  mixins: [indexMixin],
  components: {tableIndex, formData, buttonTop},
  name: "Unit",
  dicts: ['status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 单位表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      formData: {},
      // 单位实体
      unitEntity: {
        id: null,
        unitCode: null,
        unitName: null,
        shortName: null,
        major: null,
        status: 0,
        isDelete: null,
        seq: null,
        describe: null,
        unitLevel: null
      },
      // 表单校验
      rules: {
        unitCode: [
          {required: true, message: '请输入单位编号', trigger: 'blur'},
        ],
        unitName: [
          {required: true, message: '请输入单位名称', trigger: 'change'}
        ],
      },
      //列表显示字段
      property: {},
      numberShow: false,
    };
  },
  created() {
    let id = this.$route.meta.id;
    this.$store.dispatch('menuProperty', id).then( (data) => {
      this.property = data;
      this.getList();
    });
  },
  methods: {
    numberChange(val) {
      this.numberShow = val;
    },
    emitAblFilter(listQuery) {
      this.listQuery = Object.assign({}, this.listQuery, listQuery)
      this.handleQuery();
    },
    //选择框回调
    selectChange(row) {
      let {formData, isWatch} = row;
      if(!isWatch){
        this.handleQuery(formData);
      }else{
        this.formData = Object.assign({}, this.formData, formData);
      }
    },
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
    newButton(buttonCode) {
      this.$refs.tableIndex.newButton(buttonCode)
    },
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns);
    },
    /** 查询单位列表 */
    getList() {
      this.loading = true;
      modelListPage(Object.assign({}, this.listQuery, this.formData)).then(response => {
        this.dataList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery(row = {}) {
      this.listQuery.pageNum = 1
      this.formData = Object.assign({}, this.formData, row)
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(ids, single, multiple) {
      this.single = single
      this.multiple = multiple
    },
    /** 新增按钮操作 */
    handleCreate() {
      modelEditUrl().then( ({message}) => {
        console.log(message)
      })
    },
    /** 修改按钮操作 */
    handleUpdate(id) {
    },
    handleButton(id, buttonCode) {
      console.log(buttonCode)
      if (buttonCode === 'update') {
        this.handleUpdate(id)
      } else if (buttonCode === 'create') {
        this.handleCreate()
      }
    },
  }
};
</script>
