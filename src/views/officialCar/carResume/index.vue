<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-form :model="formData" ref="elform" label-width="120px">
                <!--车辆信息-->
                <div style="margin:5px 10px 10px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>车辆信息</span>
                </div>
                <el-row :span="24"> 
                    <el-col :span="8">
                        <el-form-item label="车牌号：">
                            <span>{{carInfo.carNumber}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车架号：">
                            <span>{{carInfo.vinNumber}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发动机号：">
                            <span>{{carInfo.engineNumber}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24"> 
                    <el-col :span="8">
                        <el-form-item label="车辆品牌：">
                            <span>{{carInfo.carBrand}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆系列：">
                            <span>{{carInfo.carSeries}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆型号：">
                            <span>{{carInfo.carModel}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24"> 
                    <el-col :span="8">
                        <el-form-item label="车身颜色：">
                            <span>{{carInfo.color}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="购车日期：">
                            <span>{{carInfo.buyTimeStr}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排放标准：">
                            <span>{{carInfo.emission}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!--保险记录-->
            <div style="margin:5px 10px 10px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>保险记录</span>
                <el-date-picker
                    class="date-picker"
                    size="small"
                    v-model="insuranceDateRange"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleInsuranceChange">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleInsuranceClick"></el-button>
            </div>
            <el-table class="table-container" ref="eltable" max-height="300px" :data="insuranceData" stripe border>
                <el-table-column label="序号" type="index" align="center"></el-table-column>
                <el-table-column label="保单号" align="center" prop="insrNumber" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="保险公司" align="center" prop="insrUnit" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="投保期" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{parseTime(scope.row.insrDate,'{y}/{m}/{d}')}} - {{parseTime(scope.row.dueDate,'{y}/{m}/{d}')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
            <pagination
                v-show="insuranceListQuery.total > 0"
                :total="insuranceListQuery.total"
                :page.sync="insuranceListQuery.pageNum"
                :limit.sync="insuranceListQuery.pageSize"
                @pagination="getInsuranceList"/>
            <!--维保记录-->
            <div style="margin:5px 10px 10px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>维保记录</span>
                <el-date-picker
                    class="date-picker"
                    size="small"
                    v-model="maintenanceDateRange"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleMaintenanceChange">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleMaintenanceClick"></el-button>
            </div>
            <el-table class="table-container" ref="eltable" max-height="300px" :data="maintenanceData" stripe border>
                <el-table-column label="序号" type="index" align="center"></el-table-column>
                <el-table-column label="投保日期" align="center" prop="createTime" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="驾驶员" align="center" prop="driver" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="类型" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{checkMaintainType(scope.row.maintainType)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="店铺" align="center" prop="maintainShop" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="维保里程" align="center" prop="maintainMiles" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="维保项目描述" align="center" prop="remark" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
            <pagination
                v-show="maintenanceListQuery.total > 0"
                :total="maintenanceListQuery.total"
                :page.sync="maintenanceListQuery.pageNum"
                :limit.sync="maintenanceListQuery.pageSize"
                @pagination="getMaintenanceList"/>
            <!--出车记录-->
            <div style="margin:5px 10px 10px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>出车记录</span>
                <el-date-picker
                    class="date-picker"
                    size="small"
                    v-model="drivingRecordDateRange"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleDrivingRecordChange">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleDrivingRecordClick"></el-button>
            </div>
            <el-table class="table-container" ref="eltable" max-height="300px" :data="drivingRecordData" stripe border>
                <el-table-column label="序号" type="index" align="center"></el-table-column>
                <el-table-column label="出车日期" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{parseTime(scope.row.departureDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="驾驶员" align="center" prop="driver" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="出发地" align="center" prop="fromAddr" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="目的地" align="center" prop="toAddr" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="行驶里程" align="center" prop="drivingMiles" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="事由" align="center" prop="reason" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="用车部门" align="center" prop="deptName" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="用车人" align="center" prop="rider" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="乘坐人数" align="center" prop="usagePersons" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="用户评价" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{checkEvaluateLevel(scope.row.evaluateLevel)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="评价描述" align="center" prop="evaluateContent" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" @click="handleTrackClick(scope.row)" style="color:#1890ff;">轨迹回放</a>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="drivingRecordListQuery.total > 0"
                :total="drivingRecordListQuery.total"
                :page.sync="drivingRecordListQuery.pageNum"
                :limit.sync="drivingRecordListQuery.pageSize"
                @pagination="getDrivingRecordList"/>
        </el-row>
    </div>
</template>
<script>
import { gcywInsuranceRecordListPage,gcywDrivingRecordListPage } from '@/api/driver'
import { getMaintenanceRecordByPage } from '@/api/maintenanceRecord'
import { getListByParentId } from '@/api/system/dict'

export default {

    data() {
        return {
            //loading框
            loading:false,
            //车辆信息
            carInfo:{},
            //表单数据
            formData:{

            },
            //保险记录分页参数
            insuranceListQuery:{
                pageNum: 1,
                pageSize: 10,
                total:0,
                insrDateStart:'',
                insrDateEnd:'',
            },
            //保险记录日期
            insuranceDateRange:[],
            //保险记录数据
            insuranceData:[],

            //维保记录分页参数
            maintenanceListQuery:{
                pageNum: 1,
                pageSize: 10,
                total:0,
                maintainDateStart:'',
                maintainDateEnd:'',
            },
            //维保记录日期
            maintenanceDateRange:[],
            //维保记录数据
            maintenanceData:[],
            //维保类型数据
            maintenanceTypeOptions: [],

            //出车记录分页参数
            drivingRecordListQuery:{
                pageNum: 1,
                pageSize: 10,
                total:0,
                departureDateStart:'',
                departureDateEnd:'',
            },
            //维保记录日期
            drivingRecordDateRange:[],
            //维保记录数据
            drivingRecordData:[],
        }
    },
    created() {
        this.carInfo = JSON.parse(this.$route.params.carInfo);
     
        this.getInsuranceList();
        this.getMaintenanceTypeOptions();
        this.getMaintenanceList();
        this.getDrivingRecordList();
    },
    methods: {
        //获取保险记录分页数据
        getInsuranceList() {
            this.loading = true

            gcywInsuranceRecordListPage(Object.assign({},this.insuranceListQuery,{carNumber:this.carInfo.carNumber} ) ).then(({ data }) => {
                this.insuranceData = data.list;
                this.insuranceListQuery.total = data.total
                this.loading = false
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取维保记录分页数据
        getMaintenanceList(){
            this.loading = true

            getMaintenanceRecordByPage(Object.assign({},this.maintenanceListQuery,{carNumber:this.carInfo.carNumber})).then(({ data }) => {
                this.maintenanceData = data.list;
                this.maintenanceListQuery.total = data.total
                this.loading = false
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取维保类型数据
        getMaintenanceTypeOptions(){
            this.loading = true;

            getListByParentId('1529623183877562368').then(({data}) => {
                this.loading = false
                this.maintenanceTypeOptions = data;
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取出车记录分页数据
        getDrivingRecordList(){
            this.loading = true

            gcywDrivingRecordListPage(Object.assign({},this.drivingRecordListQuery,{carNumber:this.carInfo.carNumber})).then(({ data }) => {
                this.drivingRecordData = data.list;
                this.drivingRecordListQuery.total = data.total
                this.loading = false
            }).catch((err) => {
                this.loading = false
            })
        },
        //保险记录选择日期
        handleInsuranceChange(){
            if(this.insuranceDateRange === null){
                this.insuranceListQuery.insrDateStart = '';
                this.insuranceListQuery.insrDateEnd = '';
            }else {
                this.insuranceListQuery.insrDateStart = this.insuranceDateRange[0];
                this.insuranceListQuery.insrDateEnd = this.insuranceDateRange[1];
            }
        },
        //维保记录选择日期
        handleMaintenanceChange(){
            if(this.maintenanceDateRange === null){
                this.maintenanceListQuery.maintainDateStart = '';
                this.maintenanceListQuery.maintainDateEnd = '';
            }else {
                this.maintenanceListQuery.maintainDateStart = this.maintenanceDateRange[0];
                this.maintenanceListQuery.maintainDateEnd = this.maintenanceDateRange[1];
            }
        },
        //出车记录选择日期
        handleDrivingRecordChange(){
            if(this.drivingRecordDateRange === null){
                this.drivingRecordListQuery.departureDateStart = '';
                this.drivingRecordListQuery.departureDateEnd = '';
            }else {
                this.drivingRecordListQuery.departureDateStart = this.drivingRecordDateRange[0];
                this.drivingRecordListQuery.departureDateEnd = this.drivingRecordDateRange[1];
            }
        },
        //保险记录搜索
        handleInsuranceClick(){
            this.insuranceListQuery.pageNum = 1;
            this.getInsuranceList();
        },
        //维保记录搜索
        handleMaintenanceClick(){
            this.maintenanceListQuery.pageNum = 1;
            this.getMaintenanceList();
        },
        //出车记录搜索
        handleDrivingRecordClick(){
            this.drivingRecordListQuery.pageNum = 1;
            this.getDrivingRecordList();
        },
        //处理维保类型
        checkMaintainType(maintainTye){
            let obj = this.maintenanceTypeOptions.find((item) => {
                return item.code === maintainTye;
            })
            return !!obj?obj.name:'';
        },
        //处理评价
        checkEvaluateLevel(evaluateLevel){  // 1：非常不满意 2：不满意 3：一般 4：比较满意 5：非常满意
            if(evaluateLevel==1){
                return '非常不满意'
            }else if(evaluateLevel==2){
                return '不满意'
            }else if(evaluateLevel==3){
                return '一般'
            }else if(evaluateLevel==4){
                return '比较满意'
            }else if(evaluateLevel==5){
                return '非常满意'
            }
        },
        //轨迹回放
        handleTrackClick(item){
            let carDetail = {
                carNumber:item.carNumber,
                miles:Number(item.endMiles)-Number(item.startMiles),
                simNumber: item.simNumber,
                startTime: item.departureDate,
                endTime: item.returnTime,
            }
            this.$router.push({
                    name:'arcgisMap',
                    params: {
                    carInfo:carDetail,
                },
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.app-container {
    padding: 10px 15px;
    overflow: auto;

    .title-icon {
        color: rgb(64, 158, 255);
        margin-right: 5px;
    }
    .date-picker {
        margin-left: 30px;
    }
    .table-container {
        width: 95%;
        margin-left: 10px;
        margin-right: 10px;
    }
    .pagination-container {
        text-align: center;
        margin-bottom: 50px;

        .el-pagination {
            position: relative !important;
            right: none;
        }
    }
}
</style>