<template >
  <div class="app-container">
    <el-row :gutter="20">
        <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-form :model="form" :rules="rules" ref="elform" label-width="120px" style="width:90%">
        <!--维保信息-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>维保信息</span>
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
                    <el-form-item label="维保类型：" prop="maintenanceType">
                        <el-select v-model="form.maintenanceType" filterable style="width:100%" :loading="loading" placeholder="请选择维保类型" size="mini">
                            <el-option
                                v-for="item in maintenanceTypeOptions"
                                :key="item.id"
                                :label="item.label"
                                :value="item.value">
                            </el-option>              
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="驾驶员：" prop="driver">
                        <el-input v-model="form.driver" size="mini" placeholder="请输入驾驶员"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="店铺：" prop="shop">
                        <el-select v-model="form.shop"  size="mini" style="width:100%" filterable placeholder="请选择店铺"> 
                            <el-option
                               v-for="item in shopOptions" 
                               :key="item.value" 
                               :label="item.label" 
                               :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="其他店铺：" prop="otherShop">
                        <el-input v-model="form.otherShop" size="mini" placeholder="请填写不在定点的店铺"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="维保日期：" prop="maintenanceDate">
                        <el-date-picker
                           style="width:100%"
                           value-format="yyyy-MM-dd"
                           :picker-options="{firstDayOfWeek:1}"
                           v-model="form.maintenanceDate"
                           type="date"
                           placeholder="请选择维保日期"
                           size="mini">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="维保里程：" prop="maintenanceMileage">
                        <el-input v-model="form.maintenanceMileage" size="mini" placeholder="请输入维保里程" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="维保地点：" prop="maintenancePlace">
                        <el-input v-model="form.maintenancePlace" size="mini" placeholder="请输入维保地点" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="总费用：" prop="allPrice">
                        <el-input v-model="form.allPrice" size="mini" placeholder="请输入总费用" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="材料费：" prop="materialPrice">
                        <el-input v-model="form.materialPrice" size="mini" placeholder="请输入材料费" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="工时费：" prop="workHourPrice">
                        <el-input v-model="form.workHourPrice" size="mini" placeholder="请输入工时费" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="其他费：" prop="otherPrice">
                        <el-input v-model="form.otherPrice" size="mini" placeholder="请输入其他费" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="下次维保里程：" prop="nextMaintenanceMileage">
                        <el-input v-model="form.nextMaintenanceMileage" size="mini" placeholder="请输入下次维保里程" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="下次维保日期：" prop="nextMaintenanceDate">
                        <el-date-picker
                           style="width:100%"
                           value-format="yyyy-MM-dd"
                           :picker-options="{firstDayOfWeek:1}"
                           v-model="form.nextMaintenanceDate"
                           type="date"
                           placeholder="请选择下次维保日期"
                           size="mini">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="维保项目描述：" prop="maintenanceDes">
                        <el-input type="textarea" :rows="3" maxlength="200" v-model="form.maintenanceDes" size="mini"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注：" prop="remark">
                        <el-input type="textarea" :rows="3" maxlength="200" v-model="form.remark" size="mini"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
        </el-row>
        </el-form>
        <!--维保明细-->
        <el-row :gutter="20">
            <el-col style="width:90%;margin: 15px 10px;">
                <i class="el-icon-caret-right title-icon"></i><span>维保明细</span>
                <i class="el-icon-plus title-icon" style="float:right;margin-right:10px;" @click="handleAddClick()"></i>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :xs="24" style="width:90%;padding: 0px 0px 40px 40px">
                <el-table ref="eltable" max-height="300px" :data="maintenanceData" stripe border>
                    <el-table-column label="维保项目" align="center">
                        <template slot-scope="scope">
                            <el-select v-model="value" placeholder="请选择维保项目">
                              <el-option v-for="item in maintenanceTypeOptions" 
                                v-model="maintenanceData[scope.$index].maintenanceProject"
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value">
                              </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="材料数量" align="center">
                        <template slot-scope="scope">
                              <el-input v-model="maintenanceData[scope.$index].materialNumber"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="材料费" align="center">
                        <template slot-scope="scope">
                              <el-input v-model="maintenanceData[scope.$index].materialPrice"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="工时（小时）" align="center">
                        <template slot-scope="scope">
                              <el-input v-model="maintenanceData[scope.$index].workHour"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="工时费" align="center">
                        <template slot-scope="scope">
                              <el-input v-model="maintenanceData[scope.$index].workHourPrice"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="其他费" align="center">
                        <template slot-scope="scope">
                              <el-input v-model="maintenanceData[scope.$index].otherPrice"></el-input>
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
export default {
  name: "maintenanceCreate",
  data() {
    return {
        //loading框
        loading:false,
        //使用单位数据
        userUnitOptions:[],
        //维保类型数据
        maintenanceTypeOptions:[],
        //店铺数据
        shopOptions:[],
        //维保明细数据
        maintenanceData:[],
        //维保明细对象
        maintenance:{
            maintenanceProject:"",
            materialNumber:"",
            materialPrice:"",
            workHour:"",
            workHourPrice:"",
            otherPrice:""
        },
        value:"",
        //表单数据
        form:{
            userUnit:"",    //使用单位     
            licenseNumber:"",    //车牌号
            maintenanceType:"",    //维保类型
            driver:"",  //驾驶员
            shop:"",         //店铺
            otherShop:"",    //其他店铺
            maintenanceDate:"",       //维保日期
            maintenanceMileage:"",     //维保里程
            maintenancePlace:"",  //维保地点
            allPrice:"",    //总费用
            materialPrice:"",  //材料费
            workHourPrice:"",      //工时费
            otherPrice:"",     //其他费
            nextMaintenanceMileage:"",    //下次维保里程
            nextMaintenanceDate:"",     //下次维保日期
            maintenanceDes:"",   //维保项目描述
            remark:"",   //备注
        },
        rules:{
            userUnit:[
                {required:true,message:"使用单位不能为空",trigger:"change"}
            ],
            licenseNumber:[
                {required:true,message:"车牌号不能为空",trigger:"blur"}
            ],
            maintenanceType:[
                {required:true,message:"维保类型不能为空",trigger:"change"}
            ],
            driver:[
                {required:true,message:"驾驶员不能为空",trigger:"change"}
            ],
            shop:[
                {required:true,message:"店铺不能为空",trigger:"change"}
            ],
            otherShop:[
                {required:true,message:"其他店铺不能为空",trigger:"blur"}
            ],
            maintenanceDate:[
                {required:true,message:"维保日期不能为空",trigger:"change"}
            ],
            maintenanceMileage:[
                {required:true,message:"维保里程不能为空",trigger:"blur"}
            ],
            maintenancePlace:[
                {required:true,message:"维保地点不能为空",trigger:"blur"}
            ],
            allPrice:[
                {required:true,message:"总费用不能为空",trigger:"blur"}
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
    //添加维保明细数据
    handleAddClick(){
        this.maintenanceData.push(Object.assign({}, this.maintenance));
    },
    //删除维保明细数据
    handleDeleteClick(index){
        this.maintenanceData.splice(index,1);
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
</style>