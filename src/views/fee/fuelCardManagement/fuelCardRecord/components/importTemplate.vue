<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" ref="elform" label-width="120px" v-loading="loading">
           <el-row :span="24" :gutter="20">
               <el-col :span="24">
                    <el-form-item label="导入模板类型：">
                        <el-select v-model="form.templateType" size="small" style="width:100%">
                            <el-option v-for="(item,index) in templateOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                                @click.native="handleTemplateTypeChange(item)">
                            </el-option>
                        </el-select>
                    </el-form-item>
               </el-col>
               <el-col :span="24">
                    <el-form-item label="导入模板：">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            style="width:100%"
                            drag
                            :limit='1'
                            :action="uploadFileUrl"
                            :headers="uploadHaders" 
                            :before-upload="beforeUpload"
                            :on-success="uploadOnSuccess" 
                            :on-error="uploadOnError" 
                            :auto-upload="false"
                            :on-exceed="onExceed"
                            accept=".xlsx, .xls" >
                            <i class="el-icon-upload">
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
                                    <span style="display:block;margin-top:-20px">支持.xls .xlsx格式</span>
                                </div>
                            </i>
                        </el-upload>
                    </el-form-item>
                </el-col>
           </el-row>
       </el-form>
       <div slot="footer" class="dialog-footer">
           <el-button type="primary" @click="submitUpload()">确定</el-button>
           <el-button @click="handleCancel()">取消</el-button>
       </div>
   </el-dialog>
</template>
<script>
import { uploadHaders } from '@/utils/auth'

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
               templateType:'0',
            },
            //头文件
            uploadHaders: uploadHaders(),
            //上传路径
            uploadFileUrl: process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/gcywFuelRecord/import",
            //模板数据
            templateOptions:[
                {
                    name:'加油卡交易记录标准模板',
                    code:'0',
                },
                {
                    name:'中石油交易记录标准模板',
                    code:'1',
                },
                {
                    name:'中石化交易记录标准模板',
                    code:'2',
                },
            ],
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(){
            this.openDataScope = true;
            this.$nextTick(() => {
                this.title = "导入"
            })
        },
        //模板类型选择回调
        handleTemplateTypeChange(item){
            if(item.code === '0'){
                this.uploadFileUrl = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/gcywFuelRecord/import";
            }else if(item.code === '1'){
                this.uploadFileUrl = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/gcywFuelRecord/importZSY";
            }else if(item.code === '2'){
                this.uploadFileUrl = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/gcywFuelRecord/importZSH";
            }
        },
        //图片上传前
        beforeUpload(file){
            const isLt2M = file.size / 1024 / 1024 < 10;

            if (!isLt2M) {
                this.$modal.msgWarning('上传文件大小不能超过 10MB!');
                return false;
            }
            return true;
        },
        uploadOnSuccess({ code, data, message }) {
            if(code === 0){
                this.$modal.msgSuccess(message);
                this.$emit('importTemplateSuccess',data);
            }else{
                this.$modal.msgError(message);
            }
            this.openDataScope = false;
        },
        uploadOnError({message}) {
            this.$modal.msgError(message);
            this.openDataScope = false;
        },
        onExceed(){
            this.$modal.msgWarning("最多上传一个文件!")
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
        //关闭dialog回调
        handleDialogClose(){
            this.form.templateType = '0';
            this.$refs.upload.clearFiles();
        }
    }
}
</script>
<style scoped>
::v-deep .el-upload-dragger {
    width: 430px;
}
</style>>
