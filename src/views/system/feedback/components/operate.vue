<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
        <h3 style="float:left;margin-right:20px;margin-left:20px;">{{feedBackType}}</h3>
        <h5 >{{form.loginUser}} {{parseTime(form.creaetDate,'{y}-{m}-{d} {h}-{m}-{s}')}}</h5>
        <h4 style="margin-left:20px;margin-bottom:20px;height:100px">{{form.suggestionContext}}</h4>
        <el-form :model="form" :rules="rules" ref="elform" label-width="80px" v-loading="loading">
                <el-row :span="24" :gutter="20">
                    <el-col :span="24" >
                        <el-form-item label="回复：" prop="replyContext">
                        <el-input v-model="form.replyContext" type="textarea" :rows="3" maxlength="300" size="small"></el-input>
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
import {gcywSuggestionUpdSuggestion} from "@/api/system/dict/data"
import {getListByParentCode} from '@/api/system/dict'
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //显示隐藏
            openDataScope:false,
            //意见反馈分类
            feedBackType:"",
            //表单数据
            form:{
                replyContext:"",
            },
            //表单校验
            rules:{
                replyContext:[
                    {required:true,message:"回复内容不能为空",trigger:"blur"}
                ]
            }
        }
    },
    created(){
        
    },
    methods:{
        //初始化
        init(data){
            this.openDataScope = true;
            this.form = Object.assign({}, data);
            this.$nextTick(() => {
                this.title = "回复";
                this.getFeedBackType();
            })
        },
        //获取意见反馈分类
        async getFeedBackType(){
            this.loading = true;
            await getListByParentCode("10022").then(({data}) => {
                this.loading = false;
                data.forEach((item) => {
                    if(item.code===this.form.suggestion){
                        this.feedBackType = item.name;
                    }
                })
            }).catch((err) => {
                this.loading = false;
            })
        },
        //回复
        handleReply(){
           this.$refs.elform.validate(async (valid) => {
               if (valid) {
                   this.loading = true;
                   await gcywSuggestionUpdSuggestion(Object.assign({}, this.form)).then(({message}) => {
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
            this.feedBackType = "";
        }
    }
}
</script>
<style scoped>

</style>>