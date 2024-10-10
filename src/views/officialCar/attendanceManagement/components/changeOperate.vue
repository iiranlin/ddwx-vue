<template>
  <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body
             center @close="handleDialogClose()">
    <el-form :model="form" :rules="rules" ref="elform" label-width="120px" v-loading="loading">
      <el-row :span="24" :gutter="20">
        <el-col :span="24">
           <el-form-item label="安全驾驶天数：" prop="secureDays">
                <el-input v-model="form.secureDays" maxlength="10" @input="handleNumberLimit(form,'secureDays',8,0)" placeholder="请输入安全驾驶天数" size="small">
                    <template slot="suffix">天</template>
                </el-input>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave()">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import{largeScreenDriverSecureDay,largeScreenDriverSecureClean} from "@/api/largeScreen"
import { handleNumberLimit } from '@/utils'

export default {
  data() {
    return {
      handleNumberLimit: handleNumberLimit,
      //遮罩层
      loading: false,
      //标题
      title: "调整安全驾驶天数",
      //显示隐藏
      openDataScope: false,
      //表单数据
      form: {
        secureDays: '',
      },
      //表单校验
      rules: {
        secureDays: [
          {required: true, message: "安全驾驶天数不能为空", trigger: "blur"}
        ]
      }
    }
  },
  created() {

  },
  methods: {
    //初始化
    init(id) {
      this.openDataScope = true;

      this.$nextTick(() => {
        this.getLargeScreenDriverSecureDay();
      })
    },
    getLargeScreenDriverSecureDay(){
      this.loading = true;

      largeScreenDriverSecureDay().then(({message}) => {
        this.loading = false;
        this.form.secureDays = message;
      }).catch((err) => {
        this.loading = false;
      })
    },
    //新建
    handleSave() {
      this.$refs.elform.validate((valid) => {
        if (valid) {
          this.loading = true;

          let params = {
            secureDays:this.form.secureDays,
          }
          largeScreenDriverSecureClean(params).then(({message}) => {
            this.loading = false;
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.$emit('changeOperateSuccess')
          }).catch((err) => {
            this.loading = false;
          })
        }
      })
    },
    //取消
    handleCancel() {
      this.openDataScope = false;
    },
    //关闭dialog回调
    handleDialogClose() {
      this.$refs.elform.resetFields();
    }
  }
}
</script>
<style scoped>

</style>>
