<template >
  <div class="app-container">
    <el-row :gutter="20">
        <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-form :model="form" :rules="rules" ref="elform" label-width="120px" style="width:90%">
        <!--保险信息-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>保险信息</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :xs="24">
                <el-col :span="8">
                    <el-form-item label="使用单位：" prop="userUnit">
                        <el-select v-model="form.userUnit" filterable style="width:100%" :loading="loading" placeholder="请选择使用单位" size="mini">
                            <el-option
                                v-for="item in userUnitOptions"
                                :key="item.id"
                                :label="item.label"
                                :value="item.value">
                            </el-option>              
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车牌号：" prop="licenseNumber">
                        <el-input v-model="form.licenseNumber" size="mini" placeholder="请输入车牌号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保险公司：" prop="insuranceCompany">
                        <el-select v-model="form.insuranceCompany" filterable style="width:100%" :loading="loading" placeholder="请选择保险公司" size="mini">
                            <el-option
                                v-for="item in insuranceCompanyOptions"
                                :key="item.id"
                                :label="item.label"
                                :value="item.value">
                            </el-option>              
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保单号：" prop="insuranceOrder">
                        <el-input v-model="form.insuranceOrder" size="mini" placeholder="请输入保单号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="投保人：" prop="insurancePerson">
                        <el-input v-model="form.insurancePerson" size="mini" placeholder="请输入投保人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="投保金额：" prop="insurancePrice">
                        <el-input v-model="form.insurancePrice" size="mini" placeholder="请输入投保金额"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="生效日期：" prop="activationDate">
                        <el-date-picker
                           style="width:100%"
                           value-format="yyyy-MM-dd"
                           :picker-options="{firstDayOfWeek:1}"
                           v-model="form.activationDate"
                           type="date"
                           placeholder="请选择生效日期"
                           size="mini">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="到期日期" prop="expireDate">
                        <el-date-picker
                           style="width:100%"
                           value-format="yyyy-MM-dd"
                           :picker-options="{firstDayOfWeek:1}"
                           v-model="form.expireDate"
                           type="date"
                           placeholder="请选择到期日期"
                           size="mini">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="经办人" prop="operator">
                        <el-input v-model="form.operator" size="mini" placeholder="请输入经办人" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注：" prop="remark">
                        <el-input type="textarea" :rows="3" maxlength="200" v-model="form.remark" size="mini"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="保单照片：" prop="licenseFirstImg">
                        <el-upload
                            v-model="form.licenseFirstImg"
                            class="avatar-uploader"
                            accept=".jpg,.png"
                            :action="uploadFileUrl"
                            :headers="headers"
                            :data="uploadData[0]"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-error="handleUploadError"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="form.licenseFirstImg" :src="form.licenseFirstImg" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon">
                                <span style="font-size:12px;display:block;height:30px;line-height:30px;">上传照片</span>
                            </i>
                        </el-upload>
                        <span style="font-size:10px;color:#8c939d;" >支持.jpg .png格式</span>
                    </el-form-item>
                </el-col>
            </el-col>
        </el-row>
        </el-form>
        <!--维保明细-->
        <el-row :gutter="20">
            <el-col style="width:90%;margin: 15px 10px;">
                <i class="el-icon-caret-right title-icon"></i><span>保险明细</span>
                <i class="el-icon-plus title-icon" style="float:right;margin-right:10px;" @click="handleAddClick()"></i>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :xs="24" style="width:90%;padding: 0px 0px 40px 40px">
                <el-table ref="eltable" max-height="300px" :data="insuranceData" stripe border>
                    <el-table-column label="险种" align="center">
                        <template slot-scope="scope">
                            <el-select v-model="value" placeholder="请选择险种">
                              <el-option v-for="item in insuranceTypeOptions" 
                                v-model="insuranceData[scope.$index].insuranceType"
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value">
                              </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="保费" align="center">
                        <template slot-scope="scope">
                              <el-input v-model="insuranceData[scope.$index].insurancePrice"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="保额" align="center">
                        <template slot-scope="scope">
                              <el-input v-model="insuranceData[scope.$index].insuranceQuota"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" @click="handleDeleteClick(scope.$index)" style="color:#1890ff;">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-row>
  </div>
</template>
<script>
import { userListAllForDept2List,
         gcjcDriverCreate } from "@/api/driver"
import { getToken } from '@/utils/auth'
export default {
  name: "insuranceCreate",
  data() {
    return {
        //loading框
        loading:false,
        //使用单位数据
        userUnitOptions:[],
        //保险险种数据
        insuranceTypeOptions:[],
        //保险公司数据
        insuranceCompanyOptions:[],
        //保险明细数据
        insuranceData:[],
        //保险明细对象
        insurance:{
            insuranceType:"",
            insurancePrice:"",
            insuranceQuota:"",
        },
        //图片上传路径
        uploadFileUrl: process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/minio/upload",
        //图片上传请求头参数
        headers: {
            Authorization: getToken(),
        },
        //图片上传参数
        uploadData:[
            { type: "1" },{ type: "2" }
        ],
        value:"",
        //表单数据
        form:{
            userUnit:"",    //使用单位     
            licenseNumber:"",    //车牌号
            insuranceCompany:"",    //保险公司
            insuranceOrder:"",  //保单号
            insurancePerson:"",         //投保人
            insurancePrice:"",    //投保金额
            activationDate:"",       //生效日期
            expireDate:"",     //到期日期
            operator:"",  //经办人
            remark:"",   //备注
        },
        rules:{
            userUnit:[
                {required:true,message:"使用单位不能为空",trigger:"change"}
            ],
            licenseNumber:[
                {required:true,message:"车牌号不能为空",trigger:"blur"}
            ],
            insuranceCompany:[
                {required:true,message:"保险公司不能为空",trigger:"change"}
            ],
            insuranceOrder:[
                {required:true,message:"保单号不能为空",trigger:"blur"}
            ],
            insurancePerson:[
                {required:true,message:"投保人不能为空",trigger:"blur"}
            ],
            insurancePrice:[
                {required:true,message:"投保金额不能为空",trigger:"blur"}
            ],
            activationDate:[
                {required:true,message:"生效日期不能为空",trigger:"change"}
            ],
            expireDate:[
                {required:true,message:"到期日期不能为空",trigger:"blur"}
            ],
            operator:[
                {required:true,message:"经办人不能为空",trigger:"blur"}
            ],
        }
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  activated(){
      this.$refs.elform.resetFields();
      this.licenseTypeSelection = [];
  },
  methods: {
    //员工编号查询
    async remoteMethod(query){
        if(!!query){
            this.loading = true;
            await userListAllForDept2List(Object.assign({}, {userCode:query})).then(({data}) => {
                this.loading = false;
                this.userOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        }else{
            this.userOptions = [];
        }
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
        if(data.type === "1"){
            this.form.licenseFirstImg = data.url
        }else if(data.type === "2"){
            this.form.licenseSecondImg = data.url
        }
    },
    //上传图片失败
    handleUploadError(){
        this.$modal.msgError("上传失败, 请重试");
    },
    //添加保险明细数据
    handleAddClick(){
        this.insuranceData.push(Object.assign({}, this.insurance));
    },
    //删除保险明细数据
    handleDeleteClick(index){
        this.insuranceData.splice(index,1);
    },
    //保存数据
    handleSave() {
        console.log(this.maintenanceData);
        this.$refs.elform.validate(async (result) => {
            if (result) {
                this.loading = true;
                await gcjcDriverCreate(Object.assign({}, this.form)).then(({message}) => {
                    this.loading = false;
                    this.$modal.msgSuccess(message);
                    this.closeCurrentPage();
                }).catch((err) => {
                    this.loading = false;
                })
            }
        })
    },
    //关闭当前页面
    closeCurrentPage(){
        this.visitedViews.forEach((item) => {
            if(item.name == this.$route.name){
                this.$tab.closePage(item).then(({visitedViews}) => {
                    this.$router.push({name:"driverFile"})
                })
            }
        })
    }
  }
};
</script>
<style scoped>
.app-container {
    padding: 10px 15px;
    overflow: auto;
}
.title-icon {
    color: rgb(64, 158, 255);
    margin-right: 5px;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 70px;
    line-height: 70px;
    text-align: center;
}
.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
</style>