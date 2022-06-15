<template>
  <div class="app-container container_flex">
    <el-row :gutter="10" class="mb8 container_flex_button">
      <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id">
        <button-top :item="item" :multiple="multiple" :single="single" @newButton="newButton"></button-top>
      </el-col>
      <right-toolbar ref="rightToolbar" :showSearch.sync="showSearch" :columns="property.fields"
                     @queryTable="handleQuery" @handleCheckAllChange="handleCheckAllChange" @clickReset="clickReset"
                     @numberChange="numberChange"
      ></right-toolbar>
    </el-row>
    <form-data :showSearch="showSearch" :searchArr="property.search || []" @handleQuery="handleQuery"/>
    <table-index ref="tableIndex" :loading="loading" :tableData="dataList" :property="property" :numberShow="numberShow"
                :tableIndexs="tableIndex"
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


    <!-- 添加或修改岗位对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位编号" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入岗位编号"/>
        </el-form-item>
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单位名称:" prop="unitId">
          <el-select v-model="form.unitId" clearable placeholder="请选择单位" style="width: 100%">
            <el-option
              v-for="item in company"
              :key="item.id"
              :label="item.unitName"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
import {listPost, getPost, delPost, addPost, updatePost} from "@/api/system/post";
import {allUnit} from "@/api/system/unit";
import indexMixin from '@/views/mixins';
import tableIndex from "@/components/tableIndex";
import formData from "@/components/formData";
import buttonTop from "@/components/buttonTop";
import {menuProperty} from "@/api/system/menu";

export default {
  mixins: [indexMixin],
  components: {tableIndex, formData, buttonTop},
  name: "Post",
  dicts: ['status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态时间范围
      daterangeUpdateTime: [],
      company: [],
      formData: {},
      // 表单参数
      form: {
        unitId: ""
      },
      // 表单校验
      rules: {
        postCode: [
          {required: true, message: "岗位编号不能为空", trigger: "blur"}
        ],
        postName: [
          {required: true, message: "岗位名称不能为空", trigger: "blur"}
        ],
        status: [
          {required: true, message: "状态不能为空", trigger: "blur"}
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
    });
    this.getList();
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
    selectChange(type, value) {
      this.formData[type] = value;
      this.handleQuery();
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
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listPost(Object.assign({}, this.listQuery, this.formData)).then(response => {
        this.dataList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      })
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
        postCode: null,
        postName: null,
        seq: null,
        status: 0,
        createTime: null,
        updateTime: null
      };
      this.resetForm("form");
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
      this.reset();
      this.open = true;
      this.title = "添加岗位";
      this.allUnit()
    },
    /** 修改按钮操作 */
    handleUpdate(id) {
      this.reset();
      this.allUnit()
      getPost(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改岗位";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePost(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    //单位名称
    allUnit() {
      allUnit().then(res => {
        this.company = res.data
      })
    },
    /** 删除按钮操作 */
    handleDelete(ids) {
      this.$modal.confirm('是否确认删除？').then(function () {
        return delPost({ids: ids});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    handleButton (id, buttonCode) {
      if (buttonCode === 'update') {
        this.handleUpdate(id)
      } else if (buttonCode === 'delete') {
        this.handleDelete(id)
      } else if (buttonCode === 'create') {
        this.handleCreate()
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/post/export', {
        ...this.listQuery
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
