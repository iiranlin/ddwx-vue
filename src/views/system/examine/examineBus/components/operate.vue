<template>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="600px" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门:" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门编号:" prop="deptCode">
              <el-input v-model="form.deptCode" placeholder="请输入部门编号" maxlength="200"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称:" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" maxlength="100"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="排序:" prop="seq">
            <el-input-number v-model="form.seq" controls-position="right" :min="1" :max="99"></el-input-number>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="type == 'create'?submitDataScope():deptModify()" :loading="loading">确 定</el-button>
        <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {deptCreate, deptDetail, deptModify} from '@/api/system/dept'
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
          deptName: '',
          deptCode: '',
          parentId: undefined,
          seq:0
      },
      // 表单校验
      rules: {
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        deptCode: [
          { required: true, message: "部门编号不能为空", trigger: "blur" }
        ],
      }
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
              this.deptDetail(id);
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
    deptDetail (id) {
        deptDetail(id).then( ({data}) => {
            this.form.deptName = data.deptName;
            this.form.deptCode = data.deptCode;
            this.form.parentId = data.parentId || undefined;
            this.form.seq = data.seq
        })
    },
    submitDataScope () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          deptCreate(this.form).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('deptSuccess')
          });
        }
      })
    },
    deptModify () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          deptModify(Object.assign({}, this.form, {id: this.id})).then(({message}) => {
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