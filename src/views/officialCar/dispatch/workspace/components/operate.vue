<template>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="转派单位:" prop="reassignUnitCode">
                <el-select
                    v-model="form.reassignUnitCode"
                    placeholder="请选择司机"
                    clearable
                    filterable
                >
                    <el-option v-for="item in unitList" 
                    :key="item.id" 
                    :label="item.turnUnitCode" 
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="redispatch" :loading="loading">确 定</el-button>
        <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { gcjcTurnUnitListAll } from '@/api/gcjcTurnUnit'
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
      title: '转单',
      openDataScope: false,
      unitList: [],
      form: {
          reassignUnitCode: '',
      },
      // 表单校验
      rules: {
        reassignUnitCode: [
          { required: true, message: "请选择单位", trigger: "change" }
        ],
      },
      row: null,
    }
  },
  created() {
  },
  methods: {
    /** 提交按钮（数据权限） */
    init (row) {
      this.row = row;
      this.openDataScope = true;
      this.$nextTick(() => {
        if(this.$refs.elForm) this.$refs.elForm.resetFields();
      })
      this.gcjcTurnUnitListAll();
    },
    gcjcTurnUnitListAll () {
      gcjcTurnUnitListAll().then(({data}) => {
        this.unitList = data;
      })
    },
    redispatch () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          gcjcTurnUnitListAll(Object.assign({}, this.form, {id: this.row.id})).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('unitSuccess')
          });
        }
      })
    }
  }
};
</script>