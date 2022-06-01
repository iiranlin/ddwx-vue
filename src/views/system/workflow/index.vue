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
    <table-index ref="tableIndex" :loading="loading" :menuName="menuName"
      :tableData="dataList"
      :property="property"
      :numberShow="numberShow"
      @handleSelectionChange="handleSelectionChange"
      @handleButton="handleButton"
      @selectChange="selectChange"
      @emitAblFilter="emitAblFilter"
      @changeSwitch="changeSwitch"
    />
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    
    <el-dialog title="选择类型" :visible.sync="openDataScope" width="600px" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型:" prop="key">
              <el-input v-model="form.key" placeholder="请输入类型" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {modelListPage, modelNewModel, modelEditUrl, modelUpdateFlag} from "@/api/system/activiti";
import indexMixin from '@/views/mixins';
import { getCookie, getToken } from '@/utils/auth'

export default {
  name: "workflow",
  mixins: [indexMixin],
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
      //菜单名称
      menuName: '',
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
      // 表单校验
      rules: {
        key: [
          {required: true, message: '请输入类型', trigger: 'blur'},
        ],
      },
      //列表显示字段
      property: {},
      numberShow: false,
      openDataScope: false,
      form:{
        key: ''
      },
      sUnitCode: getCookie('unitCode'),
      TokenKey: getToken('TokenKey'),
    };
  },
  created() {
    this.menuName = this.$route.meta.title;
    this.menuProperty();
    this.getList();
    window.addEventListener("message", (e) => {
        if (e.data.type === 'end') {
            this.listQuery.pageNum = 1;
            this.openDataScope = false;
            this.handleQuery();
        }
    })
  },
  methods: {
    menuProperty () {
      let id = this.$route.meta.id;
      this.$store.dispatch('menuProperty', id).then( (data) => {
        this.property = data;
      });
    },
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      modelEditUrl().then(({data}) => {
        this.openWidow(`${data}/editor?tenantId=gwyc&IP=${data}&modelId=${row.modelId}&sUnitCode=${this.sUnitCode}&ips=${window.location.href}&token=${this.TokenKey}`);
      })
    },
    handleButton(id, buttonCode, row, selectionArr) {
      if (buttonCode === 'update') {
        if(Object.keys(row).length == 0){
          this.handleUpdate(selectionArr[0]);
        }else{
          this.handleUpdate(row);
        }
      } else if (buttonCode === 'create') {
        this.openDataScope = true;
        this.$refs.elForm.resetFields();
      }
    },
    submitDataScope () {
      this.$refs.elForm.validate( (valid) => {
        if (valid) {
          modelNewModel(this.form).then( ({message}) => {
            this.openWidow(`${message}&sUnitCode=${this.sUnitCode}&ips=${window.location.href}&token=${this.TokenKey}`);
          })
        }
      })
    },
    changeSwitch (row) {
      modelUpdateFlag({flag: row.flag, id: row.modelId}).then( ({message}) => {
        this.$modal.msgSuccess(message);
      })
    },
    openWidow(Url) {
        let width = window.screen.width;
        let height = window.screen.height - 100;
        let top = parseInt((screen.availHeight - height - 100) / 2);
        let left = parseInt((screen.availWidth - width - 15) / 2)
        window.open(Url, '', 'toolbar=0,location=0,maximize=1,directories=0,status=1,menubar=0,scrollbars=0,resizable=1,top=' + top
            + ',left=' + left + ',width=' + width + ',height=' + height);
    },
  }
};
</script>
