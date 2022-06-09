<template>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="审批意见:" prop="parentId">
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope" :loading="loading">确 定</el-button>
        <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {deptCreate, deptDetail, deptModify} from '@/api/system/dept'
export default {
  props: {
    deptOptions: {
        type: Array,
        default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      title: '审批',
      openDataScope: false,
      form: {
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
    init (row) {
        this.openDataScope = true;
    },
  }
};
</script>