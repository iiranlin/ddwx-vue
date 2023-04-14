<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
           <el-row :span="24" :gutter="20">
               <el-col :span="24" >
                    <el-form-item label="回库里程：" prop="endMiles">
                        <el-input v-model="form.endMiles"
                            @input="handleNumberLimit(form,'endMiles')" size="small" maxlength="10" placeholder="请输入回库里程">
                        </el-input>
                    </el-form-item>
               </el-col>
           </el-row>
       </el-form>
       <div slot="footer" class="dialog-footer">
           <el-button type="primary" @click="handleConfirm()">确定</el-button>
           <el-button @click="handleCancel">取消</el-button>
       </div>
   </el-dialog>
</template>
<script>
import {gcywDrivingRecordUpdateReturnMiles} from "@/api/driver"
import {  handleNumberLimit } from '@/utils'

export default {
    data() {
        return {
            handleNumberLimit: handleNumberLimit,
            //遮罩层
            loading:false,
            //标题
            title:"调整回库里程",
            //显示隐藏
            openDataScope:false,
            //表单数据
            form:{
                id:'',
                endMiles:'',
                startMiles:'',
                vinNumber:"",
                reqfoId:'',
            },
            //表单校验
            rules:{
                endMiles:[
                    {required:true,message:"回库里程不能为空",trigger:"blur"}
                ],
            }
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(obj){
            this.form.id = obj.id;
            this.form.vinNumber = obj.vinNumber;
            this.form.startMiles = obj.startMiles;
            this.form.endMiles = obj.endMiles;
            this.form.reqfoId = obj.reqfoId;
            this.openDataScope = true;
        },
        //确定
        handleConfirm(){
            this.$refs.elform.validate(async (valid) => {
                if (valid) {
                    if (parseFloat(this.form.endMiles) <= parseFloat(this.form.startMiles)) {
                        this.$modal.msgWarning('回库里程不能小于出车里程!');
                        return 
                    }
                    this.loading = true;

                    await gcywDrivingRecordUpdateReturnMiles(Object.assign({}, this.form)).then(({message}) => {
                        this.loading = false;
                        this.$modal.msgSuccess(message);
                        this.openDataScope = false;
                        this.$emit('operateSuccess')
                    }).catch((err) => {
                        this.loading = false;
                    })
                }
           })
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
        //关闭dialog回调
        handleDialogClose(){
           
        }
    }
}
</script>
<style scoped>

</style>>
