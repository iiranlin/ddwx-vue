<template >
  <div class="app-container">
    <el-row :gutter="20">
        <el-form :model="form" ref="elform" label-width="140px">
            <!--单位信息-->
            <el-row :gutter="20">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>单位信息</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="24" :xs="24"  style="width:90%;">
                    <el-col :span="8">
                        <el-form-item label="产权单位："><span>{{form.unitName}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="使用单位："><span>{{form.usageUnitName}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="使用部门："><span>{{form.usageDeptName}}</span></el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <!--车辆信息-->
            <el-row :gutter="20">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>车辆信息</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" :xs="24"  style="width:90%;">
                    <el-col :span="8">
                        <el-form-item label="车牌号："><span>{{form.carNumber}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车架号："><span></span>{{form.vinNumber}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发动机号："><span>{{form.engineNumber}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆品牌："><span>{{form.carBrand}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆系列："><span>{{form.carSeries}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆型号："><span>{{form.carModel}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆类型Ⅰ："><span>{{form.carType}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆类型Ⅱ："><span>{{form.carType2}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="能源类型："><span></span>{{form.powerType}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车身颜色："><span>{{form.color}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="初登日期："><span>{{parseTime(form.registerDate,"{y}-{m}-{d}")}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排放标准："><span>{{form.emission}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排量："><span>{{form.capacity}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="驱动方式：">
                            <span v-if="form.vehicleProperties==='2'">两驱</span>
                            <span v-if="form.vehicleProperties==='4'">四驱</span>
                            <span v-if="form.vehicleProperties==='6'">六驱</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工况油耗："><span>{{form.fuelConsumotion}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="初始里程："><span>{{form.initMiles}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="燃油标号："><span>{{form.fuelType}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="座位数："><span>{{form.maxMens}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="核准载重（吨）："><span>{{form.maxWeight}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆来源：">
                            <span v-if="form.vehicleProperties==='1'">自有车辆</span>
                            <span v-if="form.vehicleProperties==='2'">长期租赁车辆</span>
                            <span v-if="form.vehicleProperties==='3'">短期租赁车辆</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆用途："><span>{{form.carUsing}}</span></el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <!--财务信息-->
            <el-row :gutter="20">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>财务信息</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="24" :xs="24"  style="width:90%;">
                    <el-col :span="8">
                        <el-form-item label="固资编码："><span>{{form.assetsNumber}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发票号码："><span>{{form.invoiceNumber}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发票金额："><span>{{form.invoiceAmount}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="资金来源："><span>{{form.carMoneySource}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="购置依据："><span></span>{{form.purchaseBasis}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="原始价值："><span>{{form.originalValue}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="不含税价："><span>{{form.price}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="增值税："><span>{{form.valueAddedTax}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="购置税："><span>{{form.purchaseTax}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车船使用税："><span>{{form.usageTax}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="其他税："><span>{{form.otherTax}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="其他费用："><span>{{form.otherFee}}</span></el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <!--状态信息-->
            <el-row :gutter="20">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>状态信息</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="24" :xs="24"  style="width:90%;">
                    <el-col :span="8">
                        <el-form-item label="车辆状态：">
                            <span v-if="form.carStatus==='0'">专用车</span>
                            <span v-if="form.carStatus==='1'">维修中</span>
                            <span v-if="form.carStatus==='2'">保养中</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审核状态：">
                            <span v-if="form.status==='1'">待审核</span>
                            <span v-if="form.status==='2'">审核中</span>
                            <span v-if="form.status==='3'">已审核</span>
                            <span v-if="form.status==='4'">已驳回</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出车状态：">
                            <span v-if="form.busyTag==='Y'">是</span>
                            <span v-if="form.busyTag==='N'">否</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="有效状态：">
                            <span v-if="form.enableTag==='Y'">有效</span>
                            <span v-if="form.enableTag==='N'">无效</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="超标状态：">
                            <span v-if="form.overStandardTag==='Y'">是</span>
                            <span v-if="form.overStandardTag==='N'">否</span>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <!--租赁信息-->
            <el-row :gutter="20">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>租赁信息</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="24" :xs="24"  style="width:90%;">
                    <el-col :span="8">
                        <el-form-item label="租赁公司："><span>{{form.rentUnit}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同号："><span>{{form.rentAgreement}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同期限："><span>{{form.rentBeginDate}}-{{form.rentEndDate}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="租金费用："><span>{{form.rentPrice}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="租金描述："><span>{{form.rentMoneyDesc}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请理由及用途："><span>{{form.rentApplydesc}}</span></el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <!--其他信息-->
            <el-row :gutter="20">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>其他信息</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="24" :xs="24"  style="width:90%;">
                    <el-col :span="8">
                        <el-form-item label="保养日期："><span>{{parseTime(form.maintainDate,"{y}-{m}-{d}")}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保养里程："><span>{{form.maintainMiles}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="下次保养日期："><span>{{parseTime(form.nextMaintainDate,"{y}-{m}-{d}")}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="下次保养里程："><span>{{form.nextMaintainMiles}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出库公里数："><span>{{form.startMiles}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="备注："><span>{{form.remark}}</span></el-form-item>
                    </el-col>
                </el-col>
            </el-row>
        </el-form>
    </el-row> 
  </div>
</template>
<script>
export default {
    name:"vehicleFileDetail",
    data () {
        return {
            form:{

            }
        }
    },
    created(){
        this.form = Object.assign({}, JSON.parse(this.$route.query.row))
        console.log(this.form)
    },
}
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
</style>