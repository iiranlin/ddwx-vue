<template >
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="1.5">
                <el-button type="primary" size="mini" @click="handleBack()">返回</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-form :model="form" ref="elform" label-width="120px">
                <!--单位信息-->
                <el-row :gutter="20" v-if="source!=='driverWorkBench'">
                    <el-col style="margin: 15px 10px">
                        <i class="el-icon-caret-right title-icon"></i><span>单位信息</span>
                    </el-col>
                </el-row>
                <el-row v-if="source!=='driverWorkBench'">
                    <el-col :span="24" :xs="24"  style="width:90%;">
                        <el-col :span="8">
                            <el-form-item label="用车单位："><span>{{vehicleData.unitName}}</span></el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用车部门："><span>{{vehicleData.deptName}}</span></el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <!--用车信息-->
                <el-row :gutter="20">
                    <el-col style="margin: 15px 10px">
                        <i class="el-icon-caret-right title-icon"></i><span>用车信息</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" :xs="24"  style="width:90%;">
                        <el-row :gutter="20">    
                            <el-col :span="8">
                                <el-form-item label="用车事由："><span>{{vehicleData.reason}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="用车需求："><span>{{vehicleData.demand}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="是否长途：">
                                    <span v-if="vehicleData.longDistanceTag===1">是</span>
                                    <span v-if="vehicleData.longDistanceTag===0">否</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">     
                            <el-col :span="8">
                                <el-form-item label="申请人："><span>{{vehicleData.handleUserName}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="乘坐人数："><span>{{vehicleData.usagePersons}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="乘坐人："><span>{{vehicleData.userName}}</span></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">    
                            <el-col :span="8">
                                <el-form-item label="联系电话："><span>{{vehicleData.phone}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="用车日期："><span>{{vehicleData.usageDate}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出发时间："><span>{{vehicleData.usageTime}}</span></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="预计时长："><span>{{vehicleData.timeLength}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="期望车型："><span>{{hopeBrandInfo}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="优先保障："><span>{{checkGuarantee()}}</span></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">    
                            <el-col :span="24">
                                <el-form-item label="出发地点："><span>{{vehicleData.fromAddr}}</span></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">    
                            <el-col :span="24">
                                <el-form-item label="前往地点："><span>{{vehicleData.toAddr}}</span></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">    
                            <el-col :span="24">
                                <el-form-item label="备注："><span>{{vehicleData.remark}}</span></el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <!--派车信息-->
                <el-row :gutter="20" v-if="vehicleData.reqAssignments">
                    <el-col style="margin: 15px 10px">
                        <i class="el-icon-caret-right title-icon"></i><span>派车信息</span>
                    </el-col>
                </el-row>
                <el-row v-for="item in vehicleData.reqAssignments" :key="item.id">
                    <el-col :span="24" :xs="24"  style="width:90%;"> 
                        <el-row :gutter="20">    
                            <el-col :span="8">
                                <el-form-item v-if="source!=='myCar'" label="指派司机："><span>{{item.driver}}</span></el-form-item>
                                <el-form-item v-else label="指派司机："><span>{{item.driver.substr(0,1)}}师傅</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="指派车辆：">
                                    <a href="#" v-if="item.status===5 || item.status===7" class="custom-link" @click="handleCarNumberClick(item)">{{item.carNumber}}</a>
                                    <span v-else>{{item.carNumber}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出场里程："><span>{{item.beginMiles}}</span></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">    
                            <el-col :span="8">
                                <el-form-item label="还车里程："><span>{{item.endMiles}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="下次保养里程："><span>{{item.nextMaintainDate}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="保养时间："><span>{{parseTime(item.maintainDate)}}</span></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">    
                            <el-col :span="8">
                                <el-form-item label="保养里程："><span>{{item.maintainMiles}}</span></el-form-item>
                            </el-col>  
                            <el-col :span="16">
                                <el-form-item label="评价内容："><span>{{item.evaluateContent || '未填写'}}</span></el-form-item>
                            </el-col>       
                        </el-row>
                        <el-row>
                            <el-form-item label="评分：">
                                <el-rate
                                    v-model="item.evaluateLevel"
                                    disabled
                                    show-text
                                    :texts="texts">
                                </el-rate>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="驾驶水平：">
                                <el-rate
                                    v-model="item.evaluateDriver"
                                    disabled
                                    show-text
                                    :texts="texts">
                                </el-rate>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="服务态度：">
                                <el-rate
                                    v-model="item.evaluateService"
                                    disabled
                                    show-text
                                    :texts="texts">
                                </el-rate>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="车内环境：">
                                <el-rate
                                    v-model="item.evaluateIncar"
                                    disabled
                                    show-text
                                    :texts="texts">
                                </el-rate>
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col :span="24">
                            <hr style="color: #dddddd ;border:1px dashed;width:90%;margin-left:40px;">
                    </el-col>
                </el-row>
                <!--操作日志-->
                <el-row :gutter="20" v-if="source!=='driverWorkBench'">
                    <el-col style="margin: 15px 10px">
                        <i class="el-icon-caret-right title-icon"></i><span>操作信息</span>
                    </el-col>
                    <!-- operationType -->
                    <el-col :span="24" style="margin-bottom:40px;">
                    <el-table ref="eltableSetting" max-height="300px" :data="logData" style="width:90%;margin-left:40px;" stripe border>
                        <el-table-column label="操作时间" align="center" width="200px">
                            <template slot-scope="scope">
                                <span>{{parseTime(logData[scope.$index].createTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作人" prop="operator" align="center" width="200px"></el-table-column>
                        <el-table-column label="描述" prop="sdesc" align="center"></el-table-column>
                    </el-table>
                </el-col>
                </el-row>
            </el-form>
        </el-row> 
    </div>
</template>
<script>
import {gcywVehicleRequestDispatchList,gcywVehicleRequestLogList} from "@/api/car"
import {logisticsGetDrivingRecord} from '@/api/driver'
import {getListByParentId} from "@/api/system/dict"
export default {
    name: "carDetail",

    beforeRouteEnter (to, from, next) {
        next((vm) => {
            vm.source = from.name;
            console.log(vm.source)
        });
    },

    data() {
        return {
            //loading框
            loading:false,
            //id
            id:"",
            userName1:'',
            userName2:'',
            //表单数据
            form:{},
            //操作日志数据
            logData:[],
            //用车单数据
            vehicleData:{},
             //优先保障数据
            guaranteeOptions:[],
            //期望车型数据
            hopeBrandInfo:"",
             //评价标准
            texts:['非常不满意','不满意','一般','比较满意','非常满意'],
            //页面来源
            source:'',
        };
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        }
    },
    created(){
      
    },
    activated() {
        let id = this.$route.query.id;
        this.userName1 = this.$route.query.handleUserName;
        this.userName2 = this.$route.query.userName;

        if(this.id !== id){
            this.id = id;
            this.getDispatchInfo();
            this.getLogList();
        }
        this.getGuarantee();
    },
    methods: {
        //获取用车单信息
        async getDispatchInfo(){
                this.loading = true;

                let params = {
                    id:this.id,
                    userName1:this.userName1,
                    userName2:this.userName2,
                }
                await gcywVehicleRequestDispatchList(params).then(({data}) => {
                    this.vehicleData = data.list[0] || {};
                    this.loading = false;
                    this.getHopeBrandInfo();
                    this.initEvaluateInfo();
                }).catch((err) => {
                    this.loading = false;
                })
        },
        //获取优先保障
        getGuarantee(){
            this.loading = true;
            
            getListByParentId("1679651627836055552").then(({data}) => {
                this.loading = false;
                this.guaranteeOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //处理评价数据
        initEvaluateInfo(){
            this.vehicleData.reqAssignments.forEach((item) => {
                item.evaluateLevel = Number(item.evaluateLevel);
                item.evaluateDriver = Number(item.evaluateDriver);
                item.evaluateService = Number(item.evaluateService);
                item.evaluateIncar = Number(item.evaluateIncar);
            })
        },
        //获取操作日志信息
        async getLogList(query){
                this.loading = true;
                await gcywVehicleRequestLogList(Object.assign({}, {reqId:this.id})).then(({data}) => {
                    this.loading = false;
                    this.logData = data;
                }).catch((err) => {
                    this.loading = false;
                })
        },
        //获取期望车型字典
        async getHopeBrandInfo(){
            this.loading = true;
            await getListByParentId("101801").then(({data}) => {
                this.loading = false;
                data.forEach((item) => {
                    if(item.code===this.vehicleData.hopeBrand){
                        this.hopeBrandInfo = item.name;
                    }
                })
            }).catch((err) => {
                this.loading = false;
            })
        },
        //车牌号点击跳转北斗设备
        handleCarNumberClick(item){
            this.loading = true;
            let params = {
                vinNumber:item.vinNumber,
                reqfoId:item.reqId,
            }
            logisticsGetDrivingRecord(params).then(({data}) => {
                this.loading = false;
                if(data.length===0){
                    this.$modal.msgWarning('该车辆没有绑定北斗设备!')
                    return
                }
                if(!data[0].simNumber){
                    this.$modal.msgWarning('该车辆没有绑定北斗设备!')
                    return
                }
                let carDetail = {
                    carNumber:item.carNumber,
                    miles:Number(item.endMiles)-Number(item.beginMiles),
                    simNumber: data[0].simNumber,
                    startTime: data[0].departureDate,
                    endTime: data[0].returnTime,
                }
                this.$router.push({
                        name:'arcgisMap',
                        params: {
                        carInfo:carDetail,
                    },
                })
            }).catch((err) => {
                this.loading = false;
            })
        },
        //返回按钮
        handleBack(){
            this.closeCurrentPage();
        },
        //判断优先保障
        checkGuarantee(){
            let obj = this.guaranteeOptions.find((item) => {
                return item.code === this.vehicleData.guarantee;
            })
            return !!obj?obj.name:'';
        },
        //关闭当前页面
        closeCurrentPage() {
            this.visitedViews.forEach((item) => {
                if (item.name === this.$route.name) {
                    this.$tab.closePage(item).then(({ visitedViews }) => {
                        this.$router.back();
                    })
                }
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
.el-form-item_content .el-input-group {
    vertical-align: middle;
}
.title-icon {
    color: rgb(64, 158, 255);
    margin-right: 5px;
}
.custom-link {
    color: rgb(64, 158, 255);
    text-decoration: underline;
}
.svg-icon-font {
    font-size: 20px;
    color: orange;
    margin-right: 10px;
}
::v-deep.el-rate {
    margin-top: 8px;
}
</style>