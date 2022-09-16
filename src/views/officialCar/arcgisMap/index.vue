<template lang="">
    <div style="width:100%;height:100%" v-loading="loading" >
        <iframe  ref="arcgis" :src='url' style="width: 100%;height: 100%;"></iframe>
        <div class="route_info" v-if="!isShow">
            <span>车牌号：{{carInfo.carNumber}}</span>
            <span>出车时间：{{parseTime(carInfo.startTime,'{y}/{m}/{d} {h}:{i}')}}</span>
            <span>还车时间：{{parseTime(carInfo.endTime,'{y}/{m}/{d} {h}:{i}')}}</span>
            <span>行驶里程：{{carInfo.miles}}KM</span>
            <a href="#" class="custom_replay" @click="handleReplayClick" >
                <i class="icon_paly"></i>轨迹回放
            </a>
        </div>
        <div class="app-container custom_container" v-if="dataList.length>0">
            <div class="container_h">
                <el-table class="container_table" ref="eltable" height="70%" stripe border :data="dataList" @row-click="handleRowClick">
                    <el-table-column label="序号" align="center" type="index" width="60px"></el-table-column>
                    <el-table-column label="开始时间" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{parseTime(dataList[scope.$index].departureDate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{parseTime(dataList[scope.$index].returnTime)}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column label="里程(KM)" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{Number(dataList[scope.$index].endMiles)-Number(dataList[scope.$index].beginMiles)}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination
                    v-show="listQuery.total>0"
                    :total="listQuery.total"
                    :page.sync="listQuery.pageNum"
                    :limit.sync="listQuery.pageSize"
                    @pagination="getList"
                    layout="total,prev,pager,next"/>
            </div>
        </div>
        <el-button class="replay" type="primary" size="small" @click="handleReplayClick" v-if="isShow">轨迹回放</el-button>
        <el-button class="car_location" type="primary" size="small" @click="handleLocationClick" v-if="isShow">车辆定位</el-button>
    </div>
</template>
<script>
import { gcywVehicleReqAssignmenntListPageForVinNumber,logisticsTrajectoryAll,logisticsListAll} from '@/api/driver'
export default {
    name:'arcgisMap',
    data() {
        return {
            loading:false,
            isShow:true,
            url:'',
            carInfo:{},
            replayList:[],
            dataList:[],
            listQuery:{
                total:0,
                pageNum:1,
                pageSize:5,
            }
        }
    },
    mounted() {
        this.url='/static/arcgisMap.html'
        this.carInfo=Object.assign(this.carInfo, this.$route.params.carInfo);

        if(!this.carInfo){
            return;
        }

        if(!this.carInfo.vinNumber){   //详情跳转
            this.isShow = false;

            setTimeout(() => {
                this.getLogisticsTrajectoryAll(
                    this.carInfo.simNumber,
                    this.parseTime(this.carInfo.startTime),
                    this.parseTime(this.carInfo.endTime));
            }, 1000);
        }else{  //列表跳转
            this.isShow = true;
            this.getList();
        }
    },
    methods: { 
        //获取车辆行程数据
        async getList(){
            this.loading = true;
            let params = {
                vinNumber:this.carInfo.vinNumber,
            }
            await gcywVehicleReqAssignmenntListPageForVinNumber(Object.assign(params, this.listQuery)).then(({data}) => {
                this.loading = false;
                this.dataList = data.list;
                this.listQuery.total = data.total;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取车辆轨迹数据
        async getLogisticsTrajectoryAll(simNumber,startTime,endTime){
            this.loading = true;
            let params = {
                simNumber: simNumber,
                startTime: startTime,
                endTime: endTime,
                // simNumber: '121901105000',
                // startTime: '2022-08-26 15:59:55',
                // endTime: '2022-09-02 16:00:09',
            }
            await logisticsTrajectoryAll(params).then(({data}) => {
                this.loading = false;
                this.replayList = data;
                this.drawRoute();
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取车辆基础数据
        async getLogisticsListAll(simNumber,type){
            this.loading = true;
            let params = {
                simNumber: simNumber,
                type: type,
                // simNumber: '121901105000',
                // type: '2',
            }
            await logisticsListAll(params).then(({data}) => {
                this.loading = false;
                this.drawCarLocation(data);
            }).catch((err) => {
                this.loading = false;
            })
        },
        //行程数据行点击
        handleRowClick(row){
            let startTime = this.parseTime(row.departureDate);
            let endTime = this.parseTime(row.returnTime);

            this.getLogisticsTrajectoryAll(this.carInfo.simNumber,startTime,endTime);
        },
        //车辆定位
        handleLocationClick(){
            this.getLogisticsListAll(this.carInfo.simNumber,'2');
        },
        //显示行程轨迹
        drawRoute(){
            this.$refs.arcgis.contentWindow.drawRoute(this.replayList);
        },
        //显示车辆位置
        drawCarLocation(data){
            this.$refs.arcgis.contentWindow.drawCarLocation(data);
        },
        //轨迹回放
        handleReplayClick(){
            if(this.replayList.length===0){
                this.$modal.msgWarning('请选择行程!')
                return;
            }
            this.$refs.arcgis.contentWindow.moveReplay();
        }
    },
}
</script>
<style scoped>
.custom_container {
    width: 30%;
    height: 40%;
    opacity: 0.9;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-10px);
}
::v-deep .pagination-container {
    height: 15%;
}
.replay {
    position: absolute;
    top: 20px;
    right: 20px;
    opacity: 0.9;
}
.car_location {
    position: absolute;
    top: 70px;
    right: 20px;
    opacity: 0.9;
}
.route_info {
    width: 100%;
    line-height:30px;
    position: absolute;
    top: 10px;
    left:10px;
    padding-left:5px;
    padding-right:5px;
    background:#ffffff;
    font-size:14px;
}
.route_info span {
    margin-right: 15px;
}
.custom_replay {
    color:#3681ee;
}
.icon_paly {
    background:url(../../../assets/icons/icon-play.png) no-repeat center;
    display: inline-block;
    background-size: 100%;
    width: 20px;
    height: 20px;
    transform: translateY(5px);
}
</style>