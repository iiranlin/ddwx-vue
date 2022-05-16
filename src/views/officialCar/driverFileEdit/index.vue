<template >
  <div class="app-container">
    <el-row :gutter="20">
        <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-form :model="form" :rules="rules" ref="elform" label-width="120px">
        <!--基本信息-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>基本信息</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="22" :xs="24">
                <el-col :span="7">
                    <el-form-item label="员工编号：" prop="userId">
                        <el-select ref="userSelect" v-model="form.userId" filterable remote :remote-method="remoteMethod" :loading="loading" placeholder="请输入员工编号" size="mini">
                            <template slot="prefix">
                                <span style="padding-left: 5px;"><i class="el-icon-search"></i></span>
                            </template>
                            <el-option
                                v-for="item in userOptions"
                                :key="item.id"
                                :label="item.userCode + ' '+ item.realName + ' ' + item.deptName"
                                :value="item.userCode"
                                @click.native="handleUserChange(item)">
                            </el-option>              
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="姓名：" prop="username">
                        <el-input v-model="form.username" size="mini" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="所属部门：" prop="unitName">
                        <el-input v-model="form.unitName" size="mini" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="性别：" prop="sex">
                        <el-select v-model="form.sex"  size="mini" style="width:100%" :disabled="true" filterable remote placeholder=""> 
                            <el-option
                               v-for="item in sexOptions" 
                               :key="item.value" 
                               :label="item.label" 
                               :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="出生年月：" prop="birthday">
                        <el-input v-model="form.birthday" size="mini" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="联系电话：" prop="phone">
                        <el-input v-model="form.phone" size="mini" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="车队：" prop="fleetId">
                        <el-select v-model="form.fleetId" placeholder="请选择车队" size="mini" style="width:100%" clearable :loading="loading" @focus="handleFleetFocus()">
                            <el-option 
                               v-for="item in fleetOptions" 
                               :key="item.id" 
                               :label="item.fleetName" 
                               :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="司机类型：" prop="driverType">
                        <el-select v-model="form.driverType" placeholder="请选择司机类型" size="mini" style="width:100%" clearable :loading="loading" @focus="handleDriverTypeFocus()">
                            <el-option 
                               v-for="item in driverTypeOptions" 
                               :key="item.value" 
                               :label="item.name" 
                               :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="紧急联系人：" prop="emergencyContact">
                        <el-input v-model="form.emergencyContact" size="mini" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="紧急联系电话：" prop="emergencyPhone">
                        <el-input v-model="form.emergencyPhone" size="mini" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="备注：" prop="remark">
                        <el-input type="textarea" :rows="3" maxlength="200" v-model="form.remark" size="mini"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
        </el-row>
        <!--驾照信息-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>驾照信息</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="22" :xs="24">
                <el-col :span="7">
                    <el-form-item label="驾照编号：" prop="license">
                      <el-input v-model="form.license" size="mini" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="驾照类型：" prop="licenseType" style="width:100%">
                        <el-select v-model="licenseTypeSelection" placeholder="请选择驾照类型(可多选)" multiple collapse-tags size="mini" style="width:100%" clearable :loading="loading" @focus="handleLicenseTypeFocus()" @change="handleLicenseTypeChange()">
                           <el-option 
                              v-for="item in licenseTypeOptions" 
                              :key="item.value" 
                              :label="item.name" 
                              :value="item.code">
                           </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="到期日期：" prop="endDate">
                        <el-date-picker
                           style="width:100%"
                           value-format="yyyy-MM-dd"
                           :picker-options="{firstDayOfWeek:1}"
                           v-model="form.endDate"
                           type="date"
                           placeholder="请选择到期日期"
                           size="mini">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="首次领证：" prop="firstDate">
                        <el-date-picker
                           style="width:100%"
                           value-format="yyyy-MM-dd"
                           :picker-options="{firstDayOfWeek:1}"
                           v-model="form.firstDate"
                           type="date"
                           placeholder="请选择首次领证日期"
                           size="mini">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="是否实习：" prop="internshipTag">
                        <el-checkbox v-model="internshipChecked" @change="handleCheckBoxChange()">是</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="实习到期：" prop="internshipEndDate">
                        <el-date-picker
                           style="width:100%"
                           value-format="yyyy-MM-dd"
                           :picker-options="{firstDayOfWeek:1}"
                           v-model="form.internshipEndDate"
                           type="date"
                           placeholder="请选择实习到期日期"
                           size="mini">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="档案编号：" prop="fileNo">
                        <el-input v-model="form.fileNo" size="mini" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="发证单位：" prop="issuingUnit">
                        <el-input v-model="form.issuingUnit" size="mini" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <div style="display:flex;">
                        <el-form-item label="驾照图片：" prop="licenseFirstImg">
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
                                    <span style="font-size:12px;display:block;height:30px;line-height:30px;">上传主页照片</span>
                                </i>
                            </el-upload>
                            <span style="font-size:10px;color:#8c939d;" >支持.jpg .png格式</span>
                        </el-form-item>
                        <el-form-item label="" prop="licenseSecondImg" label-width="20px">
                            <el-upload
                                v-model="form.licenseSecondImg"
                                class="avatar-uploader"
                                accept=".jpg,.png"
                                :action="uploadFileUrl"
                                :headers="headers"
                                :data="uploadData[1]"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="form.licenseSecondImg" :src="form.licenseSecondImg" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon">
                                     <span style="font-size:12px;display:block;height:30px;line-height:30px;">上传副页照片</span>
                                </i>
                            </el-upload>
                            <span style="font-size:10px;color:#8c939d;" >支持.jpg .png格式</span>
                        </el-form-item>
                    </div>
                </el-col>
            </el-col>
        </el-row>
        <!--健康信息-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>健康信息</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="22" :xs="24">
                <el-col :span="7">
                    <el-form-item label="健康状态：" prop="healthyStatus">
                        <el-select v-model="form.healthyStatus" placeholder="请选择健康状态：" size="mini" style="width:100%" clearable :loading="loading" @focus="handleHealthStateFocus()">
                           <el-option 
                           v-for="item in healthStateOptions" 
                           :key="item.value" 
                           :label="item.name" 
                           :value="item.code">
                           </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="健康码：" prop="healthyCodeStatus">
                        <el-select v-model="form.healthyCodeStatus" placeholder="请选择健康码状态：" size="mini" style="width:100%" clearable :loading="loading" @focus="handleHealthCodeFocus()">
                           <el-option 
                           v-for="item in healthCodeOptions" 
                           :key="item.value" 
                           :label="item.name" 
                           :value="item.code">
                           </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="疫苗接种：" prop="vaccinesStatus">
                        <el-select v-model="form.vaccinesStatus" placeholder="请选择疫苗接种情况：" size="mini" style="width:100%" clearable :loading="loading" @focus="handleVaccinesStatusFocus()">
                           <el-option 
                           v-for="item in VaccinationStateOptions" 
                           :key="item.value" 
                           :label="item.name" 
                           :value="item.code">
                           </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                   <el-form-item label="核酸时间：" prop="lastNucleinDate" >
                      <el-date-picker
                           style="width:100%"
                           value-format="yyyy-MM-dd"
                           :picker-options="{firstDayOfWeek:1}"
                           v-model="form.lastNucleinDate"
                           type="date"
                           placeholder="请选择最近一次核酸时间"
                           size="mini">
                      </el-date-picker>
                   </el-form-item>
                </el-col>
            </el-col>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { userListAllForDept2List,
         gcjcFleetList,
         getListByParentDriverType,
         getListByParentDriverLicenseType,
         getListByParentVaccinationState,
         getListByParentHealthState,
         getListByParentHealthCode,
         gcjcDriverModify,
         gcjcDriverDetail } from "@/api/driver"
import { getToken } from '@/utils/auth'
export default {
  name: "driverFileEdit",
  data() {
    return {
        //loading框
        loading:false,
        //员工id
        id:"",
        //员工数据
        userOptions:[],
        //性别数据
        sexOptions:[
            { value:"0",label:"男" },{value:"1",label:"女" }
        ],
        //车队数据
        fleetOptions:[],
        //司机类型数据
        driverTypeOptions:[],
        //驾照类型数据
        licenseTypeOptions:[],
        //已选中驾照类型数据：
        licenseTypeSelection:[],
        //是否实习
        internshipChecked:false,
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
        //健康状态数据
        healthStateOptions:[],
        //健康码数据
        healthCodeOptions:[],
        //疫苗接种数据
        VaccinationStateOptions:[],
        //表单数据
        form:{
            userId:"",    //员工编号     
            username:"",    //姓名
            unitCode:"",    //部门编号
            unitName:"",  //所属部门
            sex:"",         //性别
            birthday:"",    //出身年月
            phone:"",       //联系电话
            fleetId:"",     //车队id
            driverType:"",  //司机类型 1-全职 2-兼职
            emergencyContact:"",    //紧急联系人
            emergencyPhone:"",  //紧急联系电话
            remark:"",      //备注
            license:"",     //驾照编号
            licenseType:"",    //驾照类型
            endDate:"",     //到期日期
            firstDate:"",   //首次领证
            internshipTag:"0",   //是否实习 1-是
            internshipEndDate:"",   //实习到期日期
            fileNo:"",      //档案编号
            issuingUnit:"",  //发证单位
            licenseFirstImg:"",     //驾照主页照片
            licenseSecondImg:"",     //驾照副页照片
            healthyStatus:"",   //健康状态 1-健康 2-生病中
            healthyCodeStatus:"",   //健康码状态 1-绿码 2-弹窗 3-黄码 4-红码
            vaccinesStatus:"",      //疫苗接种情况 0-未接种 1-接种中 2-已接种 3-已加强
            lastNucleinDate:"",     //最近一次核酸时间
        },
        rules:{
            userId:[
                {required:true,message:"员工编号不能为空",trigger:"blur"}
            ],
            phone:[
                {required:true,message:"联系电话不能为空",trigger:"blur"}
            ],
            fleetId:[
                {required:true,message:"车队不能为空",trigger:['blur','change']}
            ],
            driverType:[
                {required:true,message:"司机类型不能为空",trigger:['blur','change']}
            ],
            license:[
                {required:true,message:"驾照编号不能为空",trigger:"blur"}
            ],
            licenseType:[
                {required:true,message:"驾照类型不能为空",trigger:['blur','change']}
            ],
            endDate:[
                {required:true,message:"到期日期不能为空",trigger:"blur"}
            ],
            firstDate:[
                {required:true,message:"首次领证日期不能为空",trigger:"blur"}
            ],
            fileNo:[
                {required:true,message:"档案编号不能为空",trigger:"blur"}
            ],
            issuingUnit:[
                {required:true,message:"发证单位不能为空",trigger:"blur"}
            ],
            licenseFirstImg:[
                {required:true,message:"驾照主页照片不能为空",trigger:"change"}
            ],
            licenseSecondImg:[
                {required:true,message:"驾照副页照片不能为空",trigger:"change"}
            ],
            vaccinesSttuss:[
                {required:true,message:"疫苗接种情况不能为空",trigger:['blur','change']}
            ]
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
    this.id = this.$route.params.id;
        if(!!this.id){
            this.handleFleetFocus();
            this.handleDriverTypeFocus();
            this.handleLicenseTypeFocus();
            this.handleHealthStateFocus();
            this.handleHealthCodeFocus();
            this.handleVaccinesStatusFocus();
            this.initView();
        }
  },
  methods: {
    //获取页面详情数据
    async initView(){
        await gcjcDriverDetail(this.id).then(({data}) => {
            data.endDate = this.parseTime(data.endDate,"{y}-{m}-{d}");
            data.firstDate = this.parseTime(data.firstDate,"{y}-{m}-{d}");
            data.internshipEndDate = this.parseTime(data.internshipEndDate,"{y}-{m}-{d}");
            data.lastNucleinDate = this.parseTime(data.lastNucleinDate,"{y}-{m}-{d}");
            this.licenseTypeSelection = data.licenseType.split(',')
            this.internshipChecked = data.internshipTag === "1"?true:false;
            this.form = data;
        })
    },
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
    //员工编号选择回调
    handleUserChange(value){
        this.$refs.userSelect.selectedLabel = value.userCode;
        this.form.username = value.realName;
        this.form.unitCode = value.unitCode;
        this.form.unitName = value.unitName;
        this.form.sex = value.sex;
        this.form.birthday = value.birthday;
    },
    //选择车队
    async handleFleetFocus(){
        this.loading = true;
        await gcjcFleetList().then(({data}) => {
            this.loading = false;
            this.fleetOptions = data.list;
        }).catch((err) => {
            this.loading = false;
        })
    },
    //选择司机类型
    async handleDriverTypeFocus(){
        this.loading = true;
        await getListByParentDriverType().then(({data}) => {
             this.loading = false;
             this.driverTypeOptions = data;
        }).catch((err) => {
             this.loading = false;
        })
    },
    //选择驾照类型
    async handleLicenseTypeFocus(){
        this.loading = true;
        await getListByParentDriverLicenseType().then(({data}) => {
            this.loading = false;
            this.licenseTypeOptions = data;
        }).catch((err) => {
            this.loading = false;
        })
    },
    //选择驾照类型回调
    handleLicenseTypeChange(){
        let licenseSelection = "";
        for (let i = 0; i < this.licenseTypeSelection.length; i++) {
            if(i!== this.licenseTypeSelection.length-1){
                licenseSelection += this.licenseTypeSelection[i]+",";
            }else{
                licenseSelection += this.licenseTypeSelection[i];
            }
        }
        this.form.licenseType = licenseSelection;
    },
    //是否实习
    handleCheckBoxChange(){
        if(this.internshipChecked){
            this.form.internshipTag = "1";
        }else{
            this.form.internshipTag = "0";
        }
    },
    //健康状态
    async handleHealthStateFocus(){
        this.loading = true;
        await getListByParentHealthState().then(({data}) => {
            this.loading = false;
            this.healthStateOptions = data;
        }).catch((err) => {
            this.loading = false;
        })
    },
    //健康码
    async handleHealthCodeFocus(){
        this.loading = true;
        await getListByParentHealthCode().then(({data}) => {
            this.loading = false;
            this.healthCodeOptions = data;
        }).catch((err) => {
            this.loading = false;
        })
    },
    //疫苗接种
    async handleVaccinesStatusFocus(){
        this.loading = true;
        await getListByParentVaccinationState().then(({data}) => {
            this.loading = false;
            this.VaccinationStateOptions = data;
        }).catch((err) => {
            this.loading = false;
        })
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
    //保存数据
    handleSave() {
        this.$refs.elform.validate(async (result) => {
            if (result) {
                this.loading = true;
                await gcjcDriverModify(Object.assign({}, this.form,{id:this.id})).then(({message}) => {
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
.el-form-item_content .el-input-group {
    vertical-align: middle;
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