<template>
    <div class="container" id="container_max" v-loading="loading">
        <iframe ref="arcgis" :src='url' style="width: 100%;height: 100%;"></iframe>

        <div class="car-container">
            <div class="car-button">
                <i :class="['icon-search-default',showListSearch?'icon-search-checked':'icon-search-default']" @click="searchClick()"></i>
                <i :class="['icon-list-default',showListAll?'icon-list-checked':'icon-list-default']" @click="listAllClick()"></i>
                <i :class="['icon-full-default',showFullScreen?'icon-full-checked':'icon-full-default']" @click="fullScreenClick()"></i>
            </div>
            <!--搜索列表-->
            <div class="car-list-search" v-show="showListSearch">
                <span class="title">搜索车辆</span>
                <i class="icon-close" @click="searchCloseClick"></i>
                <el-input style="width:90%;margin-left:15px;" 
                    v-model="searchText" 
                    maxlength="25" s
                    placeholder="请输入车牌号/司机姓名" 
                    size="small"
                    clearable
                    @clear="searchVehicleClear">
                    <el-button slot="append" icon="el-icon-search" @click="searchVehicleClick"></el-button>
                </el-input>

                <div class="car-list-info">
                    <div v-for="(item,index) in carSearchList" :key="index" class="car-info" @click="handleCarClick(item,index)">
                        <img :src="checkCarImagePath(item.carBrand, item.carSeries)">
                        <div :class="[item.checked?'car-detail-checked':'','car-detail']">
                            <span :class="[item.checked?'car-number-checked':'car-number-default']">{{item.carNumber}}</span>
                            <span>{{item.carBrand}} {{item.carSeries}}</span>
                            <span>司机：{{item.driver || '暂无数据'}}</span>
                            <span>位置：{{item.location || '暂无数据'}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--全部列表-->
            <div class="car-list-all" v-show="showListAll">
                <span class="title">区域内车辆</span>
                <i class="icon-close" @click="listCloseClick"></i>

                <div class="car-list-info">
                    <div v-for="(item,index) in carLocationInfo" :key="index" class="car-info" @click="handleCarClick(item,index)">
                        <img :src="checkCarImagePath(item.carBrand, item.carSeries)">
                        <div :class="[item.checked?'car-detail-checked':'','car-detail']">
                            <span :class="[item.checked?'car-number-checked':'car-number-default']">{{item.carNumber}}</span>
                            <span>{{item.carBrand}} {{item.carSeries}}</span>
                            <span>司机：{{item.driver || '暂无数据'}}</span>
                            <span>位置：{{item.location || '暂无数据'}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="driver-container" v-show="showDriverInfo">
            <div class="top-container">
                <div id="runningcar">
                    <img src="@/assets/images/car_running.jpg" alt="">
                </div>
                <div class="driver-info">
                    <img src="@/assets/icons/icon_driver_default.png">
                    <div>
                        <span>{{carInfo.carNumber || '暂无车牌信息'}}</span>
                        <span>司机：{{carInfo.driver || '暂无数据'}}</span>
                    </div>
                </div>
            </div>
            <div class="bottom-container">
                <div class="speed">
                    <span>{{carInfo.speed}}</span>
                    <span>km/h</span>
                </div>
                <span class="speed-detail">当前转速：无</span>
                <ul>
                    <li>
                        <span>车辆型号：</span>
                        <span>{{carInfo.carBrand}}{{carInfo.carSeries}}</span>
                    </li>
                    <li>
                        <span>联系电话：</span>
                        <span>无</span>
                    </li>
                    <li>
                        <span>平均油耗：</span>
                        <span>无</span>
                    </li>
                    <li>
                        <span>发动机水温：</span>
                        <span>无</span>
                    </li>
                    <li>
                        <span>里程小计：</span>
                        <span>无</span>
                    </li>
                    <li>
                        <span>累计里程：</span>
                        <span>无</span>
                    </li>
                    <li>
                        <span>订单状态：</span>
                        <span>无</span>
                    </li>
                    <li class="tank">
                        <span>油箱剩余：</span>
                        <span>无</span>
                    </li>
                    <li class="tank-image">
                        <i></i>
                        <div class="tank-progress">
                            <el-progress :percentage="80" :show-text="false" color="#91e224"></el-progress>
                        </div>
                        
                    </li>
                    <li>
                        <span>实时位置：</span>
                        <span>{{carInfo.location}}</span>
                    </li>
                </ul>
            </div>
         
        </div>
    </div>
</template>
<script>

import {logisticsDistribution,
gcywVehicleReqAssignmentDrivingGetAllCardInfos,
logisticsGeocode} from '@/api/driver'
import checkCarImagePath from '@/utils/carPath'
import screenfull from 'screenfull'

let that;
export default {

    beforeCreate() {
        that = this;
    },

    data() {
        return {
            //加载框
            loading:false,
            //地图url
            url:'',
            //搜索
            searchText:'',
            //车辆搜索信息列表
            carSearchList:[],
            //车辆位置信息
            carLocationInfo:[],
            //车辆基础信息
            carBaseInfo:[],
            //车辆信息
            carInfo:{},
            //是否显示区域内车辆列表
            showListAll:false,
            //是否现在搜索列表
            showListSearch:false,
            //是否全屏
            showFullScreen:false,
            //是否显示司机信息
            showDriverInfo:false,
            //车辆图片
            checkCarImagePath,
        }
    },
     mounted() {
        this.url='/static/arcgisMapDistribution.html'
        this.getLocationInfo();

        screenfull.on('change', function() {
            if(screenfull.isFullscreen){
                that.showFullScreen = true;
            }else{
                that.showFullScreen = false;
            }
        })
    },
    methods: {
        //获取车辆位置数据
        async getLocationInfo() {
            this.loading = true

            await logisticsDistribution().then(({ message }) => {
                this.loading = false;
                this.carLocationInfo = JSON.parse(message);
                this.getVehicleInfo();

                for (let i = 0; i < this.carLocationInfo.length; i++) {
                    this.getLogisticsGeocode(this.carLocationInfo[i]);
                }
            }).catch(() => {
                this.loading = false;
            })
        },
        //获取车辆信息数据
        async getVehicleInfo() {
            this.loading = true

            await gcywVehicleReqAssignmentDrivingGetAllCardInfos().then(({ data }) => {
                this.loading = false;
                this.carBaseInfo = data;
             
                this.initVehicleInfoList();
            }).catch(() => {
                this.loading = false;
            })
        },
        //经纬度转地址
        getLogisticsGeocode(carLocationInfo){
            if(carLocationInfo.lng === 0 && carLocationInfo.lat === 0){
                this.$set(carLocationInfo, 'location', "");
                return;
            }
            let params = {
                lng:carLocationInfo.lng,
                lat:carLocationInfo.lat,
            }
            logisticsGeocode(params).then(({message}) => {
                this.$set(carLocationInfo, 'location', message.substr(1,message.length-2));
            }).catch((err) => {
                
            })
        },
        //初始化车辆信息列表数据
        initVehicleInfoList(){
            for (let i = 0; i < this.carLocationInfo.length; i++) {
                let deviceId = this.carLocationInfo[i].deviceId;

                this.$set(this.carLocationInfo[i], 'carBrand', '');
                this.$set(this.carLocationInfo[i], 'carSeries', '');
                this.$set(this.carLocationInfo[i], 'driver', '');
                this.$set(this.carLocationInfo[i], 'carNumber', '');
                this.$set(this.carLocationInfo[i], 'driverPic', '');
                this.$set(this.carLocationInfo[i], 'checked', false);

                for (let j = 0; j < this.carBaseInfo.length; j++) {
                    if(deviceId == this.carBaseInfo[j].deviceId){
                        this.carLocationInfo[i].carBrand = this.carBaseInfo[j].carBrand || "";
                        this.carLocationInfo[i].carSeries = this.carBaseInfo[j].carSeries || "";
                        this.carLocationInfo[i].driver = this.carBaseInfo[j].driver || "";
                        this.carLocationInfo[i].carNumber = this.carBaseInfo[j].carNumber || "";
                        this.carLocationInfo[i].driverPic = this.carBaseInfo[j].driverPic || "";
                        break
                    }
                }
            }
            this.drawCarLocation();
        },
        //显示车辆位置
        drawCarLocation(){
            setTimeout(() => {
                this.$refs.arcgis.contentWindow.initCarLocation(this.carLocationInfo);
            }, 2500)
        },
        //车辆列表点击
        handleCarClick(item,index){
            this.showDriverInfo = true;
            this.carInfo = item;

            this.carLocationInfo.forEach((itemLoc) => {
                if(itemLoc.deviceId === item.deviceId){
                    itemLoc.checked = true;
                }else{
                    itemLoc.checked = false;
                }
            })
            if(item.lng ===0 && item.lat ===0){
                this.$modal.msgWarning('当前车辆没有位置信息！')
                return;
            }
            this.$refs.arcgis.contentWindow.setCenterPoint(item,index);
        },
        //显示搜索列表
        searchClick(){
            this.showListAll = false;
            this.showListSearch = true;
            this.showDriverInfo = false;
            this.carSearchList = this.carLocationInfo;
            this.carCheckClear();
            this.$refs.arcgis.contentWindow.clearCarChecked();

            let carContainer = document.getElementsByClassName("car-container")[0]
            carContainer.style.height = "100%";
        },
        //隐藏搜索列表
        searchCloseClick(){
            this.showListSearch = false;
            this.showDriverInfo = false;
            this.$refs.arcgis.contentWindow.clearCarChecked();

            let carContainer = document.getElementsByClassName("car-container")[0]
            carContainer.style.height = "auto";
        },
        //显示全部列表
        listAllClick(){
            this.showListAll = true;
            this.showListSearch = false;
            this.showDriverInfo = false;
            this.carCheckClear();
            this.$refs.arcgis.contentWindow.clearCarChecked();
            
            let carContainer = document.getElementsByClassName("car-container")[0]
            carContainer.style.height = "100%";
        },
        //隐藏全部列表
        listCloseClick(){
            this.showListAll = false;
            this.showDriverInfo = false;
            this.$refs.arcgis.contentWindow.clearCarChecked();

            let carContainer = document.getElementsByClassName("car-container")[0]
            carContainer.style.height = "auto";
        },
        //全屏点击
        fullScreenClick(){
            const element = document.getElementById('container_max');
            if(screenfull.isEnabled){
                // screenfull.request(element)
                screenfull.toggle(element)
            }else{
                this.$modal.msgWarning('当前设备不支持全屏模式!')
            }
        },
        //搜索按钮点击
        searchVehicleClick(){
            this.carSearchList = this.carLocationInfo.filter((item) => {
                return item.carNumber.includes(this.searchText) || item.driver.includes(this.searchText);
            })
            this.showDriverInfo = false;
            this.carCheckClear();
        },
        //搜索文字清空
        searchVehicleClear(){
            this.carSearchList = this.carLocationInfo;
            this.showDriverInfo = false;
            this.carCheckClear();
        },
        //清空列表选中状态
        carCheckClear(){
            this.carLocationInfo.forEach((item) => {
                item.checked = false;
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;

    .car-container {
        // height: 100%;
        position: absolute;
        right: 0px;
        top: 0px;
        display: flex;
        z-index: 0;

        .car-button {
            width: 60px;
            display: flex;
            flex-direction: column;
            padding-top: 10px;
            box-sizing: border-box;

            i {
                display: inline-block;
                background-size: 100%;
                width: 46px;
                height: 46px;
                border-radius: 50%;
                margin-bottom: 12px;

                &:hover {
                    cursor: pointer;
                }
            }
        }
        .car-list-search {
            background: #ffffff;
            width: 240px;
            height: 100%;
            padding-bottom: 80px;
            box-sizing: border-box;
            position: relative;

            .title {
                color: #000000;
                font-size: 18px;
                font-weight: 600;
                margin-left: 15px;
                display: inline-block;
                margin-top: 20px;
                margin-bottom: 15px;
            }
            i {
                display: inline-block;
                background-size: 100%;
                width: 32px;
                height: 32px;
                position: absolute;
                right: 10px;
                top: 10px;

                &:hover {
                    cursor: pointer;
                }
            }
        }
        .car-list-all{
            background: #ffffff;
            width: 240px;
            height: 100%;
            padding-bottom: 50px;
            box-sizing: border-box;
            position: relative;

            .title {
                color: #000000;
                font-size: 18px;
                font-weight: 600;
                margin-left: 15px;
                display: inline-block;
                margin-top: 20px;
                margin-bottom: 15px;
            }
            i {
                display: inline-block;
                background-size: 100%;
                width: 32px;
                height: 32px;
                position: absolute;
                right: 10px;
                top: 10px;

                &:hover {
                    cursor: pointer;
                }
            }
        }
        .car-list-info {
            width: 240px;
            height: 100%;
            overflow-y: auto;
            box-sizing: border-box;

            &:hover {
                cursor: pointer;
            }

            .car-info {
                width: 100%;
                display: flex;
                border-bottom: 1px solid #f3f5f7;

                img {
                    width: 64px;
                    height: 64px;
                    margin-right: 10px;
                    margin-left: 15px;
                    margin-top: 15px;
                    margin-bottom: 15px;
                }
                .car-detail {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    padding-top: 15px;
                    padding-bottom: 15px;
                    padding-right: 15px;
                    background: #ffffff;
                    
                    span {
                        display: inline-block;
                        margin-bottom: 4px;
                    }
                    & span:nth-child(2){
                        color: #8e8f90;
                        font-size: 12px;
                    }
                    & span:nth-child(3){
                        color: #8e8f90;
                        font-size: 12px;
                    }
                    & span:nth-child(4){
                        color: #1e1f22;
                        font-size: 12px;
                    }
                }
                .car-detail-checked {
                    background-image: linear-gradient(90deg,#ffffff 0%,#e3ecfd 100%);
                }
            }
        }   
    }
    .driver-container {
        height: 100%;
        position: absolute;
        left: 10px;
        top: 10px;
        display: flex;
        width: 220px;
        border-radius: 7px;
        overflow: auto;
        display: flex;
        flex-direction: column;
      
        .top-container {
            background: #e8ecf5;
            height: 230px;
            position: relative;
            border-top-left-radius: 7px;
            border-top-right-radius: 7px;
         
            .driver-info {
                position: absolute;
                top: 16px;
                left: 0px;
                display: flex;

                img {
                    margin-left: 18px;
                    width: 48px;
                    height: 48px;
                    margin-right: 10px;
                    border-radius: 50%;
                }

                & span:nth-child(1){
                    display: block;
                    font-size: 18px;
                    color: #17191d;
                    font-weight: 600;
                }
                & span:nth-child(2){
                    display: block;
                    font-size: 12px;
                    color: #17191d;
                }
            }

            #runningcar {
                margin-top: 45px;
                position: relative;
                width: 220px;
                height: 184px;
                overflow: hidden;
            }
            #runningcar img {
                position: absolute;
                left: 0;
                top: 0;
                width: 220px;
                height: 13248px;
                animation: run 3s steps(71) 0s  infinite;
                -ms-animation: run 3s steps(71) 0s  infinite;   
                background:url(../../../assets/icons/icon_list_default.png) no-repeat center;
            }
            @keyframes run
            {
                from {top: 0;}
                to {top: -13064px;}
            }
            @-ms-keyframes run
            {
                from {top: 0;}
                to {top: -13064px;}
            }
        }
        .bottom-container {
            display: flex;
            flex-direction: column;
            text-align: center;
            margin-top: -30px;
            z-index: 99;
            border-bottom-left-radius: 7px;
            border-bottom-right-radius: 7px;
            background: rgba(255,255,255,0.9);

            .speed {
                background-image: linear-gradient(180deg, #f7f8fc00 0%, rgb(255, 255, 255) 50%);

                & span:nth-child(1){
                    font-size: 32px;
                    color: #151b45;
                }

                & span:nth-child(2){
                    font-size: 12px;
                    color: #151b45;
                }
            }
            .speed-detail {
                font-size: 12px;
                color: #151b45;
            }
            ul {
                margin-top: 34px;
                list-style: none;
                text-align: left;
                padding-left: 24px;
                font-size: 12px;
                color: #151b45;

                li {
                    margin-bottom: 8px;
                    padding-right: 20px;
                }
                .tank {
                    margin-top: 15px;
                }
                .tank-image {
                    display: flex;

                    i {
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        background:url(../../../assets/icons/icon_oil.png) no-repeat center;
                        background-size: cover;
                    }
                    .tank-progress {
                        width: 100%;
                        padding-left: 5px;
                        padding-top: 5px;
                    }
                }
            }
        }
    }
}
.icon-search-default {
    background:#ffffff url(../../../assets/icons/icon_search_default.png) no-repeat center;
}
.icon-search-checked {
    background:#ffffff url(../../../assets/icons/icon_search_checked.png) no-repeat center;
}
.icon-list-default {
    background:#ffffff url(../../../assets/icons/icon_list_default.png) no-repeat center;
}
.icon-list-checked {
    background:#ffffff url(../../../assets/icons/icon_list_checked.png) no-repeat center;
}
.icon-full-default {
    background:#ffffff url(../../../assets/icons/icon_full_default.png) no-repeat center;
}
.icon-full-checked {
    background:#ffffff url(../../../assets/icons/icon_full_checked.png) no-repeat center;
}
.icon-close {
    background:#ffffff url(../../../assets/icons/icon_close.png) no-repeat center;
}
.car-number-default {
    color: #1e1f22;
    font-size: 14px;
    font-weight: 600;
}
.car-number-checked {
    color: #0032a3;
    font-size: 14px;
    font-weight: 600;
}
::-webkit-scrollbar {
    display: none;
}
</style>