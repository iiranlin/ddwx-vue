<template>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="openDataScope" width="600px" append-to-body center v-loading='loading'>
        <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="处理过程:" prop="resProcess">
                        <el-input
                          type="textarea"
                          :rows="5"
                          maxlength="300"
                          placeholder="请输入内容"
                          v-model="form.resProcess">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注:" prop="remark">
                        <el-input
                          type="textarea"
                          :rows="4"
                          maxlength="200"
                          placeholder="请输入内容"
                          v-model="form.remark">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleConfirm">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import{ gcywChangeRequestUpdateRes } from "@/api/system/dataChange"
export default {
    data() {
        return {
          loading: false,
          title: '处理',
          id:'',
          openDataScope: false,
          form: {
              resProcess: '',
              remark:'',
          },
          // 表单校验
          rules: {
              resProcess: [
                { required: true, message: "处理过程不能为空", trigger: "blur" }
              ],
          },
        }
    },
    methods: {
        init (id) {
            this.id = id;
            this.openDataScope = true;
            if(this.$refs.elForm){
                this.$refs.elForm.resetFields();
            } 
        },
        handleConfirm(){
            this.$refs.elForm.validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    let params = {
                        resStatus:'1',
                        id:this.id,
                    }
                    gcywChangeRequestUpdateRes(Object.assign(params, this.form)).then(({message}) => {
                        this.loading = false;
                        this.$modal.msgSuccess(message);
                        this.openDataScope = false;
                        this.$emit('handleSuccess');
                    }).catch((err) => {
                        this.loading = false;
                    })
                }
            })
        },
        handleCancel(){
            this.openDataScope = false;
        },
    }
};
</script>