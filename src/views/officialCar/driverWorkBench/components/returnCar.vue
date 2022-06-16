<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="700px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="100px"  v-loading="loading">
           <el-row :span="24" :gutter="5">
               <el-col :span="12">
                    <el-form-item label="还车里程：" prop="endMiles">
                        <el-input v-model="form.endMiles" size="small" clearable>
                            <template slot="append"><span class="span-unit">千米</span></template>
                        </el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="12">
                    <el-form-item label="等待时长：" prop="waitTimes">
                        <el-input v-model="form.waitTimes" size="small" clearable>
                             <template slot="append">小时</template>
                        </el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="12">
                    <el-form-item label="路桥费：" prop="etcCost">
                        <el-input v-model="form.etcCost" size="small" clearable>
                             <template slot="append"><span class="span-unit">元</span></template>
                        </el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="12">
                    <el-form-item label="加油费：" prop="oilCost">
                        <el-input v-model="form.oilCost" size="small" clearable>
                             <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="12">
                    <el-form-item label="其他费：" prop="otherCost">
                        <el-input v-model="form.otherCost" size="small" clearable>
                             <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="12">
                    <el-form-item label="停车费：" prop="parkCost">
                        <el-input v-model="form.parkCost" size="small" clearable>
                             <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="24">
                    <el-form-item label="行程描述：" prop="remark">
                        <el-input v-model="form.remark" size="small" type="textarea" :rows="2" placeholder="请输入形成描述，最多300字" maxlength="300"></el-input>
                    </el-form-item>
               </el-col>
              
               <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item :label="'还车里程\u3000\n拍照上传：'" prop="imageUrl">
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
               </el-col>
           </el-row>
       </el-form>
       <div slot="footer" class="dialog-footer" style="margin-top:-50px">
           <el-button type="primary" @click="handleConfirm()">确定</el-button>
           <el-button @click="handleCancel">取消</el-button>
       </div>
   </el-dialog>
</template>
<script>
import { getToken } from '@/utils/auth'
import { gcywVehicleRequesReturning } from "@/api/driver"
export default {
    data() {
        var validateImageUrl=(rule, value, callback)=>{
            if(this.form.imageUrl===''){
                return callback(new Error('还车里程照片不能为空'))
            }else{
                return callback()
            }
        }
        return {
            //遮罩层
            loading:false,
            //标题
            title:"还车",
            //派单id
            assignmentId:"",
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
                type: "4"
            },
            //表单数据
            form:{
                endMiles:"",
                waitTimes:"",
                etcCost:"",
                oilCost:"",
                otherCost:"",
                parkCost:"",
                remark:"",
                imageUrl:"",
                images:[]
            },
            //表单校验
            rules:{
                endMiles:[
                    {required:true,message:"还车里程不能为空",trigger:"blur"}
                ],
                waitTimes:[
                    {required:true,message:"等待时长不能为空",trigger:"blur"}
                ],
                etcCost:[
                    {required:true,message:"路桥费不能为空",trigger:"blur"}
                ],
                oilCost:[
                    {required:true,message:"加油费不能为空",trigger:"blur"}
                ],
                otherCost:[
                    {required:true,message:"其他费不能为空",trigger:"blur"}
                ],
                parkCost:[
                    {required:true,message:"停车费不能为空",trigger:"blur"}
                ],
                remark:[
                    {required:true,message:"行程描述不能为空",trigger:"blur"}
                ],
                imageUrl:[
                    {required:true,validator:validateImageUrl,trigger:"change"}
                ],
            }
        }
    },
    methods:{
        //初始化
        init(assignmentId){
            this.assignmentId = assignmentId;
            this.openDataScope = true;
        },
         //上传图片前
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                this.$modal.msgWarning('上传图片只能是 JPG 或 PNG 格式!');
                return false;
            }
            if (!isLt2M) {
                this.$modal.msgWarning('上传图片大小不能超过 2MB!');
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
            this.$refs.elform.validate(async (result) => {
                if (result) {
                    this.vehicleRequesReturning();
                }   
            })
        },
        //还车
        async vehicleRequesReturning(){
            this.loading = true;
            await gcywVehicleRequesReturning(Object.assign({}, this.form,{id:this.assignmentId})).then((message) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.openDataScope = false;
                this.$emit('returnCarSuccess')
            }).catch((err) => {
                this.loading = false;
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
.el-form>>> .el-form-item .el-form-item__label {
        white-space: pre-line;
    }
::v-deep .el-input-group__append{
    width: 50px;
    padding: 0 10px;
    text-align: center;
}
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