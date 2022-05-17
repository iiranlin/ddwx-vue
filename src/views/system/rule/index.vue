<template>
  <div class="app-container container_flex">
    <el-row :gutter="10" class="mb8 container_flex_button">
      <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id">
        <button-top :item="item" :multiple="multiple" :single="single" @newButton="newButton"></button-top>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" :columns="property.fields" @queryTable="handleQuery" 
                     @handleCheckAllChange="handleCheckAllChange" @clickReset="clickReset"></right-toolbar>
    </el-row>
    <form-data :showSearch="showSearch" :searchArr="property.search || []" @handleQuery="handleQuery"/>
    <table-index ref="tableIndex" :loading="loading" :tableData="list" :property="property"
                 @handleSelectionChange="handleSelectionChange"
                 @handleButton="handleButton"
                 @selectChange="selectChange"
                 @emitAblFilter="emitAblFilter"/>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改数据规则对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="860px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="所属页面:" prop="menuId">
              <treeselect
                v-model="form.menuId"
                :options="menuOptions"
                :normalizer="normalizer"
                :disable-branch-nodes="true"
                @select="handleselectChange"
                placeholder="请选择所属页面"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则名称:" prop="ruleName">
              <el-input v-model="form.ruleName" placeholder="请输入规则名称" />
            </el-form-item>
          </el-col>
        </el-row>
      <el-row :gutter="24" style="margin:0;">
        <el-col :span="6" style="height: 300px; border: 1px solid #ccc">
          <p style="text-align: center">字段</p>
          <div style="height: 240px; overflow-y: auto">
            <el-tag
              type="primary"
              v-for="(item, index) in menuList"
              :key="index"
              @click="addList(item, index)"
              style="margin-right: 10px; margin-bottom: 10px"
              >{{ item.fieldName }}</el-tag
            >
          </div>
        </el-col>
        <el-col :span="18" style="height: 300px; border: 1px solid #ccc">
          <p style="text-align: center">
            条件
            <el-button
              type="primary"
              @click="createSql()"
              size="mini"
              style="float: right; margin-bottom: 4px; margin-top: -4px"
              >生成sql</el-button
            >
          </p>

          <el-table ref="elTable" class="dialogTable" :row-key="getRowKey" :data="sysDataRuleDetailList" :row-class-name="rowSysDataRuleDetailIndex" height="234px">
            <el-table-column
              label="序号"
              align="center"
              prop="seq"
            />
            <el-table-column prop="andOr" label="且/或">
              <template slot-scope="scope" v-if="scope.$index != 0">
                <el-select
                  v-model="sysDataRuleDetailList[scope.$index].andOr"
                  placeholder="请选择"
                >
                  <el-option label="且(and)" value="and"> </el-option>
                  <el-option label="或(or)" value="or"> </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="colName" label="字段名称">
              <template slot-scope="scope">
                <el-tag type="primary">{{ scope.row.colName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="relationChar" label="关系">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.relationChar"
                  placeholder="请选择"
                >
                  <el-option label="=" value="="> </el-option>
                  <el-option label=">=" value=">="> </el-option>
                  <el-option label="<=" value="<="> </el-option>
                  <el-option label=">" value=">"> </el-option>
                  <el-option label="<" value="<"> </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="colValue" label="字段值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.colValue"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="colValue" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="remove(scope)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
        <el-form-item label="自定义规则:" prop="ruleContent" style="margin-top:20px">
          <el-input
            v-model="form.ruleContent"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRule,
  getRule,
  delRule,
  addRule,
  updateRule,
} from "@/api/system/rule";
import { menuFieldPage } from "@/api/system/menu-field";
import { menuTree } from "@/api/system/menu";
import indexMixin from "@/views/mixins";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { hump2Underline } from "@/utils/index";
import Sortable from 'sortablejs';
export default {
  components: { Treeselect },
  mixins: [indexMixin],
  name: "Rule",
  dicts: ["status"],
  data() {
    return {
      property:{},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedSysDataRuleDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 数据规则表格数据
      list: [],
      // 数据规则明细表格数据
      sysDataRuleDetailList: [
        {
          andOr: "",
          colName: "",
          colCode: "",
          relationChar: "",
          colValue: "",
          seq:"",
        },
      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      menuOptions: [],
      menuList: [],
      rowClick: {},
      // 查询参数
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        menuId: null,
        ruleName: null,
        ruleContent: null,
        status: null,
      },
      fieldName:'',
      tableData: [],
      // 表单参数
      form: { ruleContent: "", menuId: "",ruleName:""},
      // 表单校验
      rules: {
        menuId: [{ required: true, message: "请选择菜单Id", trigger: "select" }],
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "change" },
        ],
        ruleContent: [
          { required: true, message: '请输入自定义规则', trigger: 'change' }
        ],
      },
    };
  },
  created() {
    this.menuProperty();
    this.getList();
  },
  methods: {
    menuProperty() {
      const id = this.$route.meta.id;
      this.$store.dispatch('menuProperty', id).then( (data) => {
        this.property = data;
      });
    },
    newButton(buttonCode) {
        this.$refs.tableIndex.newButton(buttonCode);
    },
    handleButton(id, buttonCode) {
      if (buttonCode === 'update') {
        this.handleUpdate(id)
      } else if (buttonCode === 'delete') {
        this.handleDelete(id)
      } else if (buttonCode === 'create') {
        this.handleCreate()
      }
    },
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns);
    },
    selectChange(type, value) {
      if (type === "createTime") {
        this.dateRange = value;
      } else {
        this.formData[type] = value;
      }
      this.handleQuery();
    },
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
    handleQuery (row) {
      console.log(row)
      this.formData = Object.assign({},this.formData,row)
      this.getList();
    },
    emitAblFilter () {
      this.dateRange = [];
      this.getList();
    },
    getRowKey(row){
      if(row.id){
        return row.id;
      }else{
        return row.ids;
      }
    },
    /** 转换字段数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children,
      };
    },
    handleselectChange(data) {
      this.form.menuId = data.id;
      if (data.id) {
        this.menuFieldPage();
      }
      console.log(this.form.menuId)
    },
    addList(row, index) {
      // this.rowClick = row;
      // let type = true;
      // this.sysDataRuleDetailList.forEach((item, index) => {
      //   if(item.colName === row.fieldName){
      //     type = false;
      //   }
      // })
      // if(type){
        console.log(row)
      this.sysDataRuleDetailList.push({
        andOr: "",
        colName: row.fieldName,
        colCode: row.fieldCode,
        relationChar: "",
        colValue: "",
        seq:"",
        ids:new Date().getTime()
      });
      // }
    },
    //生成sql
    createSql() {
      let str = " ";
      this.sysDataRuleDetailList[0].andOr = "";
      for (let i = 0; i < this.sysDataRuleDetailList.length; i++) {
        let colCode = this.sysDataRuleDetailList[i].colCode;
        if(colCode){
          colCode = hump2Underline(colCode)
        }
        str +=
          this.sysDataRuleDetailList[i].andOr +
          " " +
          colCode +
          " " +
          this.sysDataRuleDetailList[i].relationChar +
          " '" +
          this.sysDataRuleDetailList[i].colValue +
          "' ";
      }
      this.form.ruleContent = str;
    },
    remove(scope) {
      this.sysDataRuleDetailList.splice(scope.$index , 1 );
    },
    /** 查询数据规则列表 */
    getList() {
      this.loading = true;
      listRule(Object.assign({}, this.listQuery, this.formData)).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        menuId: null,
        ruleName: null,
        ruleContent: null,
        createTime: null,
        updateTime: null,
        status: 0,
      };
      this.sysDataRuleDetailList = [];
      this.resetForm("form");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleCreate() {
      console.log(123456)
      this.reset();
      this.getMenuTree();
      this.menuList=[]
      this.open = true;
      this.title = "添加数据规则";
      this.$nextTick(()=>{
        this.rowDrop()
      })
      
    },
    //字段接口
    menuFieldPage() {
      menuFieldPage(Object.assign({menuId:this.form.menuId})).then(
        ({ data }) => {
          this.menuList = data.list;
          // this.total = data.total;
          // this.loading = false;
        }
      );
    },

    /** 修改按钮操作 */
    handleUpdate(id) {
      this.reset();
      this.getMenuTree();
      this.menuList=[]
      // const id = row.id || this.ids;
      getRule(id).then((response) => {
        this.form.menuId = response.data.menuId;
        this.menuFieldPage()
        this.form = response.data;
        this.sysDataRuleDetailList = response.data.sysDataRuleDetailList;
        this.open = true;
        this.title = "修改数据规则";
        this.$nextTick(()=>{
          this.rowDrop()
        })
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.sysDataRuleDetailList = this.sysDataRuleDetailList;
          if (this.form.id != null) {
            updateRule(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRule(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              this.menuList=[]
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(id) {
      // let ids = row.id || this.ids;
      // if (!(ids instanceof Array)) {
      //   ids = [ids];
      // }
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          return delRule({ ids: id });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 数据规则明细序号 */
    rowSysDataRuleDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
       row.seq = row.index;
    },
    /** 数据规则明细添加按钮操作 */
    handleAddSysDataRuleDetail() {
      let obj = {};
      this.sysDataRuleDetailList.push(obj);
    },
    /** 数据规则明细删除按钮操作 */
    handleDeleteSysDataRuleDetail() {
      if (this.checkedSysDataRuleDetail.length == 0) {
        this.$modal.msgError("请先选择要删除的数据");
      } else {
        const sysDataRuleDetailList = this.sysDataRuleDetailList;
        const checkedSysDataRuleDetail = this.checkedSysDataRuleDetail;
        this.sysDataRuleDetailList = sysDataRuleDetailList.filter(function (
          item
        ) {
          return checkedSysDataRuleDetail.indexOf(item.index) == -1;
        });
      }
    },
    /** 复选框选中数据 */
    handleSysDataRuleDetailSelectionChange(selection) {
      this.checkedSysDataRuleDetail = selection.map((item) => item.index);
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/rule/export",
        {
          ...this.listQuery,
        },
        `rule_${new Date().getTime()}.xlsx`
      );
    },
    getMenuTree() {
      menuTree().then(({ data }) => {
        this.menuOptions = data;
        // this.form.menuId = this.menuId || undefined;
      });
    },
    rowDrop() { // 对话框table行拖拽
      const tbodys = document.querySelector('.el-dialog .el-table__body-wrapper tbody')
      const _this = this;
      Sortable.create(tbodys, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.sysDataRuleDetailList.splice(oldIndex, 1)[0];
          _this.sysDataRuleDetailList.splice(newIndex, 0, currRow);
          _this.sysDataRuleDetailList[0].andOr = "";
          _this.sysDataRuleDetailList.forEach((item,index) => {
            console.log(item,index ,604)
            item.seq = index+1;
            _this.$set(_this.sysDataRuleDetailList , index ,item)
          });
        }
      });
    },
  },
};
</script>
<style scope>
.el-table{
  overflow:auto;
  height: calc(100% - 155px);
}
</style>