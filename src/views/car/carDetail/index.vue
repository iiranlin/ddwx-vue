<template >
    <div class="app-container">
        <!--用车信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_use_car.png"/>
                <span>用车信息</span>
            </div>
            <div class="ul-parent">
                <ul class="ul-container">
                    <el-row>
                         <li class="li-item">
                            <span>用车单位：</span>
                            <span>{{vehicleData.unitName}}/{{vehicleData.deptName}}</span>
                        </li>
                        <li class="li-item">
                            <span>用车事由：</span>
                            <span>{{vehicleData.reason}}</span>
                        </li>
                        <li class="li-item">
                            <span>用车需求：</span>
                            <span>{{vehicleData.demand}}</span>
                        </li>
                        <li class="li-item">
                            <span>是否长途：</span>
                            <span>{{checkLongDistanceTag()}}</span>
                        </li>
                    </el-row>
                    <el-row>
                        <li class="li-item">
                            <span>乘坐人数：</span>
                            <span>{{vehicleData.usagePersons}}人</span>
                        </li>
                        <li class="li-item">
                            <span>乘 车 人：</span>
                            <span>{{vehicleData.userName}}</span>
                        </li>
                        <li class="li-item">
                            <span>乘车人联系电话：</span>
                            <span>{{vehicleData.phone}}</span>
                        </li>
                        <li class="li-item">
                            <span>经 办 人：</span>
                            <span>{{vehicleData.handledUserManual}}</span>
                        </li>
                    </el-row>
                    <el-row>
                        <li class="li-item">
                            <span>经办人联系电话：</span>
                            <span>{{vehicleData.handledPhoneManual}}</span>
                        </li>
                        <li class="li-item">
                            <span>用车时间：</span>
                            <span>{{parseTime(vehicleData.usageDate,'{m}-{d}')}} {{vehicleData.usageTime}}</span>
                        </li>
                        <li class="li-item">
                            <span>预计时长：</span>
                            <span>{{vehicleData.timeLength}}小时</span>
                        </li>
                        <li class="li-item">
                            <span>期望车型：</span>
                            <span :class="['hope-brand',checkHopeBrandStyle(hopeBrandInfo)]">{{hopeBrandInfo}}</span>
                        </li>
                    </el-row>
                    <el-row>
                        <li class="li-item">
                            <span>优先保障：</span>
                            <span>{{checkGuarantee()}}</span>
                        </li>
                        <li class="li-item">
                            <span>备注：</span>
                            <span>{{vehicleData.remark || '未填写'}}</span>
                        </li>
                    </el-row>
                    <el-row>    
                        <li class="li-item-all">
                            <span>用车行程：</span>
                            <span>{{checkAddress()}}</span>
                        </li>
                    </el-row>
                </ul>
            </div>
        </div>
        <!--派车信息-->
        <div class="item-content-container" v-if="reqAssignments.length > 0">
            <div class="title-container">
                <img src="/static/icon_dispatch_car.png"/>
                <span>派车信息</span>
            </div>
            <div :class="['ul-parent',reqAssignments.length > 1?'border-dashed':'']" v-for="item in reqAssignments" :key="item.id">
                <ul class="ul-container border-bottom">
                    <el-row>
                        <li class="li-item">
                            <span>指派司机：</span>
                            <span>{{checkDriver(item)}}</span>
                        </li>
                        <li class="li-item">
                            <span>指派车辆：</span>
                            <a href="#" v-if="item.status===5 || item.status===7" class="custom-link" @click="handleCarNumberClick(item)">{{item.carNumber}}</a>
                            <span v-else>{{item.carNumber}}</span>
                        </li>
                        <li class="li-item">
                            <span>出车里程：</span>
                            <span>{{item.beginMiles}}公里</span>
                        </li>
                        <li class="li-item">
                            <span>还车里程：</span>
                            <span v-if="!!item.endMiles">{{item.endMiles}}公里</span>
                            <span v-else>暂无数据</span>
                        </li>
                    </el-row>
                    <el-row>
                        <li class="li-item">
                            <span>出车时间：</span>
                            <span>{{parseTime(item.drivingTime,'{m}-{d} {h}:{i}') || '暂无数据'}}</span>
                        </li>
                        <li class="li-item">
                            <span>还车时间：</span>
                            <span>{{parseTime(item.overTime,'{m}-{d} {h}:{i}') || '暂无数据'}}</span>
                        </li>
                        <li class="li-item">
                            <span>用户评价：</span>
                            <span>{{item.evaluateContent || '未填写'}}</span>
                        </li>
                    </el-row>
                    <el-row>
                        <li class="li-item li-item-half">
                            <span>总体评分：</span>
                            <el-rate
                                v-model="item.evaluateLevel"
                                disabled
                                show-text
                                :texts="texts">
                            </el-rate>
                        </li>
                        <li class="li-item li-item-half">
                            <span>服务态度：</span>
                            <el-rate
                                v-model="item.evaluateService"
                                disabled
                                show-text
                                :texts="texts">
                            </el-rate>
                        </li>
                    </el-row>
                    <el-row>
                        <li class="li-item li-item-half">
                            <span>驾驶水平：</span>
                            <el-rate
                                v-model="item.evaluateDriver"
                                disabled
                                show-text
                                :texts="texts">
                            </el-rate>
                        </li>
                        <li class="li-item li-item-half">
                            <span>车内环境：</span>
                            <el-rate
                                v-model="item.evaluateIncar"
                                disabled
                                show-text
                                :texts="texts">
                            </el-rate>
                        </li>
                    </el-row>
                </ul>
            </div>
        </div>
        <!--操作日志-->
        <div class="item-content-container" v-if="source!=='driverWorkBench'">
            <div class="title-container">
                <img src="/static/icon_log_car.png"/>
                <span>操作日志</span>
            </div>
            <div class="table-container">
                <el-table ref="eltableSetting" :data="logData" border>
                    <el-table-column label="操作时间" align="center" width="200px">
                        <template slot-scope="scope">
                            <span>{{parseTime(logData[scope.$index].createTime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" prop="operator" align="center" width="200px"></el-table-column>
                    <el-table-column label="描述" prop="sdesc" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
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
            //派车数据
            reqAssignments:[],
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
                    this.reqAssignments = this.vehicleData.reqAssignments;
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
        //匹配期望车型样式
        checkHopeBrandStyle(hopeBrandInfo){
            if(hopeBrandInfo == '微型客车' || hopeBrandInfo == '轿车'){
                return 'hope-brand-jiaoche'
            }else if(hopeBrandInfo == 'SUV' || hopeBrandInfo == '越野车'){
                return 'hope-brand-yueye'
            }else if(hopeBrandInfo == '6-9座小型客车'){
                return 'hope-brand-shangwu'
            }else {
                return 'hope-brand-kaosite'
            }
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
            return !!obj?obj.name:'否';
        },
        //判断用车行程
        checkAddress(){
            let fromArr = '';
            let toArr = ''

            if(!this.vehicleData.fromAreaId || !this.vehicleData.toAreaIdd){
                return;
            }

            let fromAreaIdArr = this.vehicleData.fromAreaId.split(',');
            let toAreaIddArr = this.vehicleData.toAreaIdd.split(',');

            if(fromAreaIdArr[1] === toAreaIddArr[1]){
                fromArr = this.vehicleData.fromAddr.split('/')[1] + '/';

                if(fromAreaIdArr[2] === toAreaIddArr[2]){
                    fromArr = fromArr + this.vehicleData.fromAddr.split('/')[2];
                    toArr = this.vehicleData.toAddr.split('/')[2].split(' ')[1];
                }else{
                    fromArr = fromArr + this.vehicleData.fromAddr.split('/')[2];
                    toArr = this.vehicleData.toAddr.split('/')[2];
                }
            }else{
                fromArr = this.vehicleData.fromAddr.split('/')[1] + '/' + this.vehicleData.fromAddr.split('/')[2];
                toArr = this.vehicleData.toAddr.split('/')[1] + '/' + this.vehicleData.toAddr.split('/')[2];
            }
            return fromArr + " → " + toArr;
        },
        //判断是否长途
        checkLongDistanceTag(){
            if(this.vehicleData.longDistanceTag===1){
                return '是';
            }
            return "否"
        },
        //判断指派司机
        checkDriver(item){
            if(this.source!=='myCar'){
                return item.driver;
            }
            return item.driver.substr(0,1) + '师傅';
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
<style lang="scss" scoped>
.app-container {
    box-sizing: border-box;
    padding: 7px 9px;
    background-color: #f1f3f8;
    overflow-y: auto;

    .item-content-container {
        background-color: #ffffff;
        border-radius: 5px;
        margin-bottom: 7px;
        padding-bottom: 18px;

        .title-container {
            width: 100%;
            height: 41px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f3f5f7;

            img {
                margin-left: 4px;
                width: 23px;
                height: 23px;
            }
            span {
                font-size: 14px;
                color: #1b1e22;
            }
        }
        .ul-parent {
            overflow: hidden;
            padding: 7px 0px 0px 40px;
        }
        .ul-container {
            padding: 0px;
            margin: 0px;
            list-style: none;
        }
        .li-item {
            float: left;
            min-height: 24px;
            line-height: 24px;
            min-width: 24%;
            max-width: 24%;
            font-size: 12px;
            display: flex;
            color: #000000;
            margin-right: 10px;

            & span:nth-child(1) {
                white-space: nowrap;
            }
            & span:nth-child(2) {

            }
        } 
        .li-item-all {
            width: 100%;
            font-size: 12px;
            color: #000000;
        }
        .li-item-half {
            min-width: 49%;
            font-size: 12px;
            color: #000000;
        }
        .table-container {
            padding: 10px 10px 0px 10px;
        }
        .hope-brand {
            padding-left: 10px;
            padding-right: 10px;
            border-radius: 50px;
        }
    }
}
.hope-brand-jiaoche {
    border: 1px solid #f0f0f0;
    background: #ffffff;
}
.hope-brand-yueye {
    background: #004d40;
    color: #ffffff;
    border: 1px solid #004d40;
}
.hope-brand-shangwu {
    background: #000000;
    color: #ffffff;
    border: 1px solid #000000;
}
.hope-brand-kaosite {
    background: #DAA520;
    color: #ffffff;
    border: 1px solid #DAA520;
}


.border-dashed {
    border-bottom: 1px dashed #f3f5f7;
}
.custom-link {
    color: rgb(64, 158, 255);
    text-decoration: underline;
}
::v-deep .el-rate {
    margin-top: 2px;
}
::v-deep .el-rate__text {
    font-size: 12px;
}
::v-deep .el-table .cell {
    font-size: 12px;
    line-height: 16px;
}
</style>
