<template>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="openDataScope" width="600px" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <el-row>
          <el-col :span="24">
              <el-form-item label="优先保障:">
                <el-select
                  v-model="form.guarantee"
                  placeholder="请选优先保障类型"
                  filterable
                  style="width:100%"
                >
                  <el-option v-for="item in guaranteeOptions" 
                    :key="item.code" 
                    :label="item.name" 
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审批意见:" prop="comment">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                maxlength="40"
                v-model="form.comment">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="operateAdopt" :loading="loadingA">通 过</el-button>
        <el-button @click="operateReject" :loading="loadingA">驳 回</el-button>
      </div>
      <activiti-assignee ref="activitiAssignee" @carSuccess="carSuccess"></activiti-assignee>
    </el-dialog>
</template>

<script>
import { activitiReject } from '@/api/gcywVehicleRequest'
import activitiAssignee from "./activitiAssignee";
import { getListByParentId } from "@/api/system/dict";
export default {
  components: { activitiAssignee },
  props: {
    deptOptions: {
        type: Array,
        default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      loadingA: false,
      title: '审批',
      openDataScope: false,
      form: {
        comment: '通过',
        guarantee:'',
      },
      // 表单校验
      rules: {
        comment: [
          { required: true, message: "审批意见不能为空", trigger: "blur" }
        ],
      },
      row: null,
      guaranteeOptions:[],
    }
  },
  created() {
      this.getGuaranteeOptions();
  },
  methods: {
    getGuaranteeOptions(){
      getListByParentId('1679651627836055552').then(({data}) => {
        this.guaranteeOptions = data;
      }).catch((err) => {
        
      })
    },
    init (row) {
      this.row = row;
      this.openDataScope = true;
      if(this.$refs.elForm) this.$refs.elForm.resetFields();
      this.form.guarantee = row.guarantee;
    },
    operateAdopt () {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
            this.$refs.activitiAssignee.init(this.row, [], this.form);
        }
      })
    },
    operateReject () {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          let { id, procInstId, taskId } = this.row;
          let { comment } = this.form;
          this.loadingA = true;

          activitiReject({comment: comment, businessId: id, procInstId: procInstId, taskId: taskId,guarantee:this.form.guarantee}).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.loadingA = false;
            this.openDataScope = false;
            this.$emit('carSuccess');
          })
        }
      })
    },
    carSuccess () {
      this.loading = false;
      this.openDataScope = false;
      this.$emit('carSuccess');
    }
  }
};
</script>