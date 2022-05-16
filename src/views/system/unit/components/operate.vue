<template>
    <!-- 添加或修改单位对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单位编号" prop="unitCode">
          <el-input v-model="form.unitCode" placeholder="请输入单位编号"/>
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入单位名称"/>
        </el-form-item>
        <el-form-item label="单位简称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入单位简称"/>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入专业"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">启动</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input v-model="form.seq" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="form.describe" placeholder="请输入描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="type == 'create'?submitDataScope():updateUnit()">确 定</el-button>
      <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {addUnit, getUnit, updateUnit} from '@/api/system/unit'
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  props: {
    deptOptions: {
        type: Array,
        default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      title: '新增部门',
      type: 'add',
      id: '',
      openDataScope: false,
      form: {
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
          {required: true, message: '请输入单位名称', trigger: 'blur'}
        ],
      },
    }
  },
  created() {
  },
  methods: {
    /** 提交按钮（数据权限） */
    init (type, id) {
        this.type = type;
        this.id = id;
        this.openDataScope = true;
        this.$nextTick(() => {
            this.$refs.elForm.resetFields();
            if(type === 'update'){
              this.title = "修改部门";
              this.getUnit(id);
            }else{
              this.form.parentId = id || undefined;
            }
        })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.deptName,
        children: node.children
      };
    },
    getUnit (id) {
        getUnit(id).then( ({data}) => {
          this.form = data;
            // this.form.deptName = data.deptName;
            // this.form.deptCode = data.deptCode;
            // this.form.parentId = data.parentId || undefined;
        })
    },
    submitDataScope () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          addUnit(this.form).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('deptSuccess')
          });
        }
      })
    },
    updateUnit () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          updateUnit(Object.assign({}, this.form, {id: this.id})).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('deptSuccess')
          });
        }
      })
    }
  }
};
</script>