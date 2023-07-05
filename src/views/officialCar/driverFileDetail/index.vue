<template >
  <div class="app-container">
    <el-row :gutter="20">
        <el-form :model="form" ref="elform" label-width="120px">
        <!--基本信息-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>基本信息</span>
            </el-col>
        </el-row>
        <el-row :span="24"> 
            <el-col :span="8">
                <el-form-item label="员工编号：">
                    <span>{{form.userCode}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="姓名：">
                    <span>{{form.username}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="所属部门：">
                    <span>{{form.deptName}}</span>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="8">
                <el-form-item label="性别：">
                    <span>{{checkSex()}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="出生年月：">
                    <span>{{form.birthday}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系电话：">
                    <span>{{form.phone}}</span>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="8">
                <el-form-item label="车队：">
                    <span>{{checkFleet()}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="司机类型：">
                    <span>{{checkDriverType()}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="紧急联系人：">
                    <span>{{form.emergencyContact}}</span>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="8">
                <el-form-item label="紧急联系电话：">
                    <span>{{form.emergencyPhone}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="备注：">
                    <span>{{form.remark}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="司机图像：">
                    <img :src="form.driverPicPath" class="avatar">
                </el-form-item>
            </el-col>
        </el-row>
        <!--驾照信息-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>驾照信息</span>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="8">
                <el-form-item label="驾照编号：">
                    <span>{{form.license}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="驾照类型：">
                    <span>{{form.licenseType}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="到期日期：">
                    <span>{{form.endDate}}</span>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="8">
                <el-form-item label="首次领证：">
                    <span>{{form.firstDate}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="是否实习：">
                    <span>{{checkInternshipTag()}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="实习到期：">
                    <span>{{form.internshipEndDate}}</span>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="8">
                <el-form-item label="档案编号：">
                    <span>{{form.fileNo}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="发证单位：">
                    <span>{{form.issuingUnit}}</span>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="16">
                <el-form-item label="驾照图片："> 
                    <div style="display:flex;">
                        <img :src="form.licenseFirstImgPath" class="avatar">
                        <img :src="form.licenseSecondImgPath" class="avatar" style="margin-left:10px;">
                    </div>
                </el-form-item>
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
  name: "driverFileDetail",
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
        //表单数据
        form:{
            userId:"",    //员工编号     
            username:"",    //姓名
            unitCode:"",    //部门编号
            deptName:"",  //所属部门
            sex:"",         //性别
            birthday:"",    //出身年月
            phone:"",       //联系电话
            fleetId:"",     //车队id
            driverType:"",  //司机类型 1-全职 2-兼职
            emergencyContact:"",    //紧急联系人
            emergencyPhone:"",  //紧急联系电话
            remark:"",      //备注
            driverPic:'',   //司机图像上传参数
            driverPicPath:'',
            license:"",     //驾照编号
            licenseType:"",    //驾照类型
            endDate:"",     //到期日期
            firstDate:"",   //首次领证
            internshipTag:"0",   //是否实习 1-是
            internshipEndDate:"",   //实习到期日期
            fileNo:"",      //档案编号
            issuingUnit:"",  //发证单位
            licenseFirstImg: '',     //驾照主页照片上传参数
            licenseFirstImgPath:'',
            licenseSecondImg: '',     //驾照副页照片上传参数
            licenseSecondImgPath:'',
        },
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  activated(){
    this.$refs.elform.resetFields();
    this.id = this.$route.params.id;
    
        if(!!this.id){
            this.handleFleetFocus();
            this.handleDriverTypeFocus();
            this.handleLicenseTypeFocus();
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
            data.driverPicPath = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/minio/getPic?fileName="+data.driverPic;
            data.licenseFirstImgPath = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/minio/getPic?fileName="+data.licenseFirstImg;
            data.licenseSecondImgPath = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/minio/getPic?fileName="+data.licenseSecondImg;
            this.form = data;
        })
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
    //判断性别
    checkSex(){
        let obj = this.sexOptions.find((item) => {
            return item.value === this.form.sex
        })
        return !!obj?obj.label:'';
    },
    //判断车队
    checkFleet(){
        let obj = this.fleetOptions.find((item) => {
            return item.id === this.form.fleetId
        })
        return !!obj?obj.fleetName:'';
    },
    //判断司机类型
    checkDriverType(){
        let obj = this.driverTypeOptions.find((item) => {
            return item.code === this.form.driverType
        })
        return !!obj?obj.name:'';
    },
    //判断是否实习
    checkInternshipTag(){
        return this.form.internshipTag === '1'?'是':'否';
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
.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
</style>