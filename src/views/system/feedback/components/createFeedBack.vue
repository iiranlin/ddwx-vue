<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
        <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
                <el-row :span="24" :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="意见分类：" prop="suggestion">
                            <el-select v-model="form.suggestion" placeholder="请选择意见反类" size="small" >
                                <el-option v-for="item in feedBackTypeOptions" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item :label="'请补充详细\u3000\n问题跟意见：'" prop="suggestionContext">
                        <el-input v-model="form.suggestionContext" type="textarea" :rows="3" maxlength="240" size="small"></el-input>
                    </el-form-item>
                </el-col>
             </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleCreate()">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {gcywSuggestionAddSuggestion} from "@/api/system/dict/data"
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
            //意见分类数据
            feedBackTypeOptions:[],
            //表单数据
            form:{
                suggestion:"",
                suggestionContext:"",

                operatorType: '101301'  //操作端
            },
            //表单校验
            rules:{
                suggestion:[
                    {required:true,message:"意见反类不能为空",trigger:"change"}
                ],  
                suggestionContext:[
                    {required:true,message:"详细问题跟意见不能为空",trigger:"blur"}
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
                this.title = "新建";
                this.getFeedBackType();
            })
        },
        //获取意见反馈分类
        async getFeedBackType(){
            this.loading = true;
            await getListByParentCode("10022").then(({data}) => {
                this.loading = false;
                this.feedBackTypeOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //新建
        handleCreate(){
           this.$refs.elform.validate(async (valid) => {
               if (valid) {
                   this.loading = true;
                   await gcywSuggestionAddSuggestion(Object.assign({}, this.form)).then(({message}) => {
                       this.loading = false;
                       this.$modal.msgSuccess(message);
                       this.openDataScope = false;
                       this.$emit('createSuccess')
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
            thit.feedBackTypeOptions = [];
        }
    }
}
</script>
<style scoped>

</style>>