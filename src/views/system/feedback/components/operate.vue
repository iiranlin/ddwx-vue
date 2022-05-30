<template>
   <el-dialog :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
        <h3 style="float:left;margin-right:20px;">意见反馈</h3>
        <h5 >张三丰 2022-05-05 04：11：29</h5>
        <h4>意见反馈内容意见反馈内容意见反馈内容意见反馈内容意见反馈内容意见反馈内容意见反馈内容意见反馈内容意见反馈内容</h4>
        <el-form :model="form" :rules="rules" ref="elform" label-width="80px" v-loading="loading">
                <el-row :span="24" :gutter="20">
                    <el-col :span="24" >
                        <el-form-item label="回复：" prop="reply">
                        <el-input v-model="form.reply" type="textarea" :rows="3" maxlength="300" size="small"></el-input>
                    </el-form-item>
                </el-col>
             </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleReply()">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {gcjcClassCreate,gcjcClassDetail,gcjcClassModify} from "@/api/driver"
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //显示隐藏
            openDataScope:false,
            //表单数据
            form:{
                reply:"",
            },
            //表单校验
            rules:{
                reply:[
                    {required:true,message:"回复内容不能为空",trigger:"blur"}
                ]
            }
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(){
            this.openDataScope = true;
            this.$nextTick(() => {
                this.title = "回复"
            })
        },
        // //获取班次详细信息
        // async getClassDetail(){
        //     this.loading = true;
        //     await gcjcClassDetail(this.id).then(({data}) => {
        //         this.loading = false;
        //         this.form = Object.assign(this.form, data);
        //     }).catch((err) => {
        //         this.loading = false;
        //     })
        // },
        //新建
        handleReply(){
           this.$refs.elform.validate(async (valid) => {
               if (valid) {
                   this.loading = true;
                   await gcjcClassCreate(Object.assign({}, this.form)).then(({message}) => {
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
            this.$refs.elform.resetFields();
        }
    }
}
</script>
<style scoped>

</style>>