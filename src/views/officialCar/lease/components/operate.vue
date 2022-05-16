<template>
    <!-- 添加或修改字典对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="600px" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级字典:" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级字典" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="字典编号:" prop="code">
              <el-input v-model="form.code" placeholder="请输入部门编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序:" prop="seq">
              <el-input-number v-model="form.seq" controls-position="right" :min="1" :max="99"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="type == 'create'?submitDataScope():commonModify()">确 定</el-button>
        <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {commonCreate,commonDetail,commonModify} from "@/api/system/dict/common"

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
      title: '新增字典',
      type: 'add',
      id: '',
      openDataScope: false,
      form: {
          name: '',
          code: '',
          seq: 0,
          parentId: undefined
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "字典编号不能为空", trigger: "blur" }
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
        if(this.$refs.elForm) this.$refs.elForm.resetFields();
        this.$nextTick(() => {
            
            if(type === 'update'){
              this.title = "修改字典";
              this.commonDetail(id);
            }
            // else{
            //   this.form.parentId = id || undefined;
            // }
        })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    commonDetail (id) {
        commonDetail(id).then( ({data}) => {
            this.form.name = data.name;
            this.form.code = data.code;
            this.form.seq = data.seq;
            this.form.parentId = data.parentId || undefined;
        })
    },
    submitDataScope () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          commonCreate(this.form).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('operateSuccess')
          });
        }
      })
    },
    commonModify () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          commonModify(Object.assign({}, this.form, {id: this.id})).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('operateSuccess')
          });
        }
      })
    }
  }
};
</script>