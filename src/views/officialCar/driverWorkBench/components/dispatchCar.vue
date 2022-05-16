<template>
   <el-dialog :title="title" :visible.sync="openDataScope" width="600px" append-to-body center>
       <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
           <el-row :span="24" :gutter="20">
               <el-col :span="12">
                    <el-form-item label="出车里程：">
                        <span style="color:red;">{{beginMiles}}</span>
                    </el-form-item>
               </el-col>
                <el-col :span="12">
                    <el-form-item label="" label-width="10px">
                         <span>出车里程和表显里程不符？<a href="javascript:void(0)" @click="handleCatchClick()" style="color:#1890ff;text-decoration:underline;">异常报告</a></span>
                    </el-form-item>
               </el-col>
               <el-col :span="24" v-show="isShowCatch">
                    <div style="width:550px;height:300px;border:1px dashed gray;margin: 0px auto;">
                        <el-col :span="24" style="padding:10px 10px 0px 0px">
                            <el-form-item label="异常原因：" prop="message">
                                <el-input v-model="form.message" type="textarea" :rows="2" maxlength="200" placeholder="请输入异常原因,最多200字" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" style="padding:0px 10px 0px 0px">
                            <el-form-item label="拍照上传：" prop="imageUrl">
                                <el-upload
                                    class="upload-demo"
                                    v-model="form.imageUrl"
                                    drag
                                    :action="uploadFileUrl"
                                    :headers="headers"
                                    :data="uploadData"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :on-change="handleUploadChange"
                                    :before-upload="beforeAvatarUpload">
                                    <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                                    <i v-else class="el-icon-upload">
                                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
                                            <span style="display:block;margin-top:-20px">支持.jpg .png格式</span>
                                        </div>
                                    </i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </div>
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
import { getToken } from '@/utils/auth'
import { gcywVehicleRequesDriving} from "@/api/driver"
export default {
    data() {
        var validateImageUrl=(rule, value, callback)=>{
            if(this.form.imageUrl===''){
                return callback(new Error('异常照片不能为空'))
            }else{
                return callback()
            }
        }
        return {
            //遮罩层
            loading:false,
            //标题
            title:"出车",
            //是否显示异常原因
            isShowCatch:false,
            //派单id
            assignmentId:"",
            //出车里程
            beginMiles:"",
            //显示隐藏
            openDataScope:false,
            //图片上传路径
            uploadFileUrl: process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/minio/upload",
            //图片上传请求头参数
            headers: {
                Authorization: getToken(),
            },
            //图片上传参数
            uploadData:{ 
                type: "3"
            },
            //表单数据
            form:{
                message:"",
                imageUrl:"",
                images:[]
            },
            //表单校验
            rules:{
                message:[
                    {required:true,message:"异常原因不能为空",trigger:"blur"}
                ],
                imageUrl:[
                    {required:true,validator:validateImageUrl,trigger:"change"}
                ],
            }
        }
    },
    methods:{
        //初始化
        init(assignmentId,beginMiles){
            this.assignmentId = assignmentId;
            this.beginMiles = beginMiles;
            this.openDataScope = true;
            this.$nextTick(() => {
                this.isShowCatch = false;
                this.$refs.elform.resetFields();
            })
        },
        //异常报告显示隐藏
        handleCatchClick(){
            this.isShowCatch = !this.isShowCatch;
        },
         //上传图片前
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                this.$modal.msgWarning('上传头像图片只能是 JPG 或 PNG 格式!');
                return false;
            }
            if (!isLt2M) {
                this.$modal.msgWarning('上传头像图片大小不能超过 2MB!');
                return false;
            }
            return true;
        },
        //上传图片成功
        handleAvatarSuccess(res, file){
            let { data } = res;
            this.$modal.msgSuccess("上传成功");
            this.form.imageUrl = data.url;
            this.form.images[0] = data;
        },
        //上传图片失败
        handleUploadError(){
            this.$modal.msgError("上传失败, 请重试");
        },
        //上传图片验证
        handleUploadChange(){
            this.$refs.elform.validateField('imageUrl');
        },
        //确定
        handleConfirm(){
            if(this.isShowCatch){
                this.$refs.elform.validate((result) => {
                    if (result) {
                        this.vehicleRequesDriving();
                    }
                })
            }else{
                this.vehicleRequesDriving();
            }
        },
        //出车
        async vehicleRequesDriving(){
            this.loading = true;
            await gcywVehicleRequesDriving(Object.assign({}, this.form,{id:this.assignmentId})).then((message) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.openDataScope = false;
                this.$emit('dispatchCarSuccess')
            }).catch((err) => {
                this.loading = false;
            })
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
    }
}
</script>
<style scoped>
.avatar {
    width: 100%;
    height: 100%;
    display: block;
}
::v-deep .el-upload{
    display: block;
}
::v-deep .el-upload-dragger{
    width: 100%;
}
</style>>