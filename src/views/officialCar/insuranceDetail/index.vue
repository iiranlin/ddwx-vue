<template >
  <div class="app-container">
    <el-row :gutter="20">
        <el-form :model="form" ref="elform" label-width="120px" style="width:90%">
        <!--保险信息-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>保险信息</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :xs="24">
                <el-col :span="8">
                    <el-form-item label="使用单位：" prop="unitCode"><span>{{form.unitName}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车牌号：" prop="carNumber"><span>{{form.carNumber}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保险公司：" prop="insrUnitCode"><span>{{form.insrUnit}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保单号：" prop="insrNumber"><span>{{form.insrNumber}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="投保人：" prop="policyHolder"><span>{{form.policyHolder}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="投保金额：" prop="insrFee"><span>{{form.insrFee}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="生效日期：" prop="insrDate"><span>{{parseTime(form.insrDate)}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="到期日期：" prop="dueDate"><span>{{parseTime(form.dueDate)}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="经办人：" prop="clerk"><span>{{form.clerk}}</span></el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注：" prop="remark"><span>{{form.remark}}</span></el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="保单照片：" prop="insrPath">
                        <img v-if="form.insrPath" :src="form.insrPath" class="avatar">
                    </el-form-item>
                </el-col>
            </el-col>
        </el-row>
        </el-form>
        <!--保险明细-->
        <el-row :gutter="20">
            <el-col style="width:90%;margin: 15px 10px;">
                <i class="el-icon-caret-right title-icon"></i><span>保险明细</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :xs="24" style="width:90%;padding: 0px 0px 40px 40px">
                <el-table ref="eltable" max-height="300px" :data="form.items" stripe border>
                     <el-table-column label="险种" align="center">
                        <template slot-scope="scope">
                            <span>{{form.items[scope.$index].insrType | checkType(insuranceTypeOptions)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="保费" align="center" prop="insrFee"></el-table-column>
                    <el-table-column label="保额" align="center" prop="insrPaidAmount"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-row>
  </div>
</template>
<script>
import { getAllAvailableUnit } from "@/api/system/unit";
import { gcywInsuranceRecordDetail} from "@/api/driver"
import { getListByParentCode } from '@/api/system/dict'
export default {
    name: "insuranceDetail",
    data() {
        return {
            //loading框
            loading:false,
            //使用单位数据
            userUnitOptions:[],
            //保险险种数据
            insuranceTypeOptions:[],
            //表单数据
            form:{
                unitCode:"",    //使用单位
                unitName:"",    //使用单位名称     
                carNumber:"",    //车牌号
                vinNumber:"",    //车架号
                insrUnit:"",    //保险公司名称
                insrUnitCode:"",    //保险公司
                insrNumber:"",  //保单号
                policyHolder:"",         //投保人
                insrFee:"",    //投保金额
                insrDate:"",       //生效日期
                dueDate:"",     //到期日期
                clerk:"",  //经办人
                insrPath:"",    //保单照片
                remark:"",   //备注
                items:[]     //保险明细
            },
        };
    },            
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        },
    },
    filters: {
        checkType(value,insuranceTypeOptions) {
            let obj = insuranceTypeOptions.find((item) => {
                return item.code = value;
            })
            return obj.name;
        }
    },
    activated(){
        this.$refs.elform.resetFields();
        this.form.items = [];
        let id = this.$route.params.id;
        this.getInsureanceDetail(id);
        this.getInsuranceTypeOptions();
    },
    methods: {
        //获取保险详情信息
        async getInsureanceDetail(id){
            this.loading = true;
            await gcywInsuranceRecordDetail(id).then(({data}) => {
                this.loading = false;
                this.form = Object.assign(this.form, data);
                this.getUnitOptions();
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取单位信息
        async getUnitOptions(){
            this.loading = true;
            await getAllAvailableUnit().then(({data}) => {
                this.loading = false;
                this.userUnitOptions = data;
                this.userUnitOptions.forEach((item) => {
                    if(item.unitCode===this.form.unitCode){
                        this.form.unitName = item.unitName;
                    }
                })
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取险种信息
        async getInsuranceTypeOptions(){
            this.loading = true;
            await getListByParentCode("1006").then(({data}) => {
                this.loading = false;
                this.insuranceTypeOptions = data;
                this.$nextTick(() => {
                    this.$refs.eltable.doLayout();
                })
            }).catch((err) => {
                this.loading = false;
            })
        },
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