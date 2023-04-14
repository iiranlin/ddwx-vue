<template >
  <div class="app-container">
    <el-row :gutter="20">
        <el-form :model="form" ref="elform" label-width="120px" style="width:90%">
            <!--合同信息-->
            <el-row :gutter="20">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span class="title-right">合同信息</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" :xs="24">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="使用单位：" prop="unitCode"><span>{{form.unitCode | checkUnitName }}</span></el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="车辆用途：" prop="useType"><span>{{form.useType | checkUseType}}</span></el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="合同金额：" prop="contractAmount"><span>{{form.contractAmount}}元</span></el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="合同周期：" prop="contractDate"><span>{{parseTime(form.contractBegindate,'{y}-{m}-{d}')}} 至 {{parseTime(form.contractEnddate,'{y}-{m}-{d}')}}</span></el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="合同编号：" prop="contractCode"><span>{{form.contractCode}}</span></el-form-item>
                        </el-col>
                      
                    </el-row>
                </el-col>
            </el-row>
            <!--线路明细-->
            <el-row :gutter="20">
                <el-col style="width:90%;margin: 15px 10px;">
                    <i class="el-icon-caret-right title-icon"></i><span class="title-right">线路明细</span>
                </el-col>
            </el-row>
            <div v-for="(item,index) in form.details" :key="index">
                <el-row>
                    <el-col style="width:90%;margin: 15px 10px;">
                        <span class="title-right">线路{{index+1}}</span>
                    </el-col>
                </el-row>
                    <el-row>
                        <el-col :span="24" :xs="24">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="车辆类型：" prop="carTypeCode"><span>{{item.carTypeCode | checkCarType}}</span></el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="往返里程：" prop="lineKm"><span>{{item.lineKm}}公里</span></el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="线路起点：" prop="lineStart"><span>{{item.lineStart}}</span></el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="线路终点：" prop="lineEnd"><span>{{item.lineEnd}}</span></el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="每天趟数：" prop="lineTripnum"><span>{{item.lineTripnum}}趟</span></el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="车辆数：" prop="carNum"><span>{{item.carNum}}辆</span></el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="通勤人数：" prop="commute"><span>{{item.commute}}人</span></el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="准载人数：" prop="quasiCarrier"><span>{{item.quasiCarrier}}人</span></el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="备注：" prop="remark"><span>{{item.remark}}</span></el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
            </div>
        </el-form>
    </el-row>
  </div>
</template>

<script>
import { gcywCarContractDetail } from "@/api/fee";
import { getAllAvailableUnit } from "@/api/system/unit"
import { getListByParentId } from "@/api/system/dict";

let that;
export default {
    name:"detailOutsourcingBusiness",

    beforeCreate() {
        that = this
    },

    data() {
        return {
            //loading框
            loading:false,
            //id
            id:'',
            //使用单位数据
            unitOptions:[],
            //车辆用途数据
            useTypeOptions:[],
            //车辆类型数据
            carTypeOptions:[],
            //表单数据
            form:{
                unitCode:"",    //使用单位
                unitName:"",    //使用单位名称    
                contractCode:"",    //合同编号
                contractAmount:"",  //合同金额
                contractBegindate:"",    //合同周期开始
                contractEnddate:"",    //合同周期结束
                useType:"",    //车辆用途
                details:[],     //线路明细
            },  
        };
    },
    activated(){
        let id = this.$route.query.id;

        if(this.id !== id){
            this.id = id;
            this.getUnitDictList();
            this.getDetailOutsourcingBusiness();
            this.getCarTypeOptions();
            this.getUseTypeOptions();
        }
      
    },
    methods:{
        // 获取使用单位列表 当前用户有权限的单位
        async getUnitDictList() {
            this.loading = true;
            await getAllAvailableUnit().then(({ data }) => {
                this.loading = false;
                this.unitOptions = data;
            }).catch((err) => {
                this.loading = false;
            });
        },
        // 获取车辆用途
        async getCarTypeOptions() {
            this.loading = true;
            await getListByParentId('101801').then(({ data }) => {
                this.loading = false;
                this.carTypeOptions = data;
            }).catch((err) => {
                this.loading = false;
            });
        },
        // 获取车辆类型
        async getUseTypeOptions() {
            this.loading = true;
            await getListByParentId('1531517499714547712').then(({ data }) => {
                this.loading = false;
                this.useTypeOptions = data;
            }).catch((err) => {
                this.loading = false;
            });
        },
        //获取详情数据
        async getDetailOutsourcingBusiness(){
            this.loading = true;
            await gcywCarContractDetail(this.id).then(({data}) => {
                this.loading = false;
                this.form = Object.assign(this.form, data);
            }).catch((err) => {
                this.loading = false;
            })
        }
    },
    filters: {
        checkUnitName(value) {
            let obj = that.unitOptions.find((item) => {
                return item.unitCode = value;
            })
            return !!obj ? obj.unitName:"";
        },
        checkUseType(value){
            let obj = that.useTypeOptions.find((item) => {
                return item.code = value;
            })
            return !!obj ? obj.name:"";
        },
        checkCarType(value){
            let obj = that.carTypeOptions.find((item) => {
                return item.code = value;
            })
            return !!obj ? obj.name:"";
        }
    },
    
}
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