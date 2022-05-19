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

    <!-- 添加或修改单位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="unitEntity" :rules="rules" label-width="80px">
        <el-form-item label="单位编号" prop="unitCode">
          <el-input v-model="unitEntity.unitCode" placeholder="请输入单位编号"/>
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName">
          <el-input v-model="unitEntity.unitName" placeholder="请输入单位名称"/>
        </el-form-item>
        <el-form-item label="单位简称" prop="shortName">
          <el-input v-model="unitEntity.shortName" placeholder="请输入单位简称"/>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="unitEntity.major" placeholder="请输入专业"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="unitEntity.status">
            <el-radio :label="0">启动</el-radio>
            <el-radio :label="1">停用</el-radio>
            <!-- <el-radio
              v-for="dict in dict.type.status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{ dict.label }}
            </el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input v-model="unitEntity.seq" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="unitEntity.describe" placeholder="请输入描述"/>
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
import {listUnit, getUnit, delUnit, addUnit, updateUnit} from "@/api/system/unit";
import indexMixin from '@/views/mixins';

export default {
  mixins: [indexMixin],
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
    /** 查询单位列表 */
    getList() {
      this.loading = true;
      listUnit(Object.assign({}, this.listQuery, this.formData)).then(response => {
        this.dataList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    //序号
    indexMethod(index) {
      return ((this.listQuery.pageNum - 1) * this.listQuery.pageSize + index + 1)
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.unitEntity = {
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
      this.title = "添加单位";
    },
    /** 修改按钮操作 */
    handleUpdate(id) {
      this.reset();
      getUnit(id).then(response => {
        this.unitEntity = response.data;
        this.open = true;
        this.title = "修改单位";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.unitEntity.id != null) {
            updateUnit(this.unitEntity).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.handleQuery();
            });
          } else {
            addUnit(this.unitEntity).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.handleQuery();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(ids) {
      if (!(ids instanceof Array)) {
        ids = [ids];
      }
      this.$modal.confirm('是否确认删除？').then(function () {
        return delUnit({ids: ids});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
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
  }
};
</script>
