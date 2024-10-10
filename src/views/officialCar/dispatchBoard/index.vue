<template>
    <div class="board-container" id="container_max">
         <!--顶部-->
        <div class="tip-container">
            <div class="left-container">
                <img src="/static/board/dispatch-board-logo.png" />
            </div>
            <div class="right-container">
                <span>{{currentTime}}</span>
                <img src="/static/board/icon-circle.png"/>
                <img src="/static/board/btn-full-screen.png" @click="fullScreenClick()"/>
            </div>
        </div>
        <!--顶部数量显示-->
        <div class="top-number-container">
            <div class="number-content">
                <ul>
                    <li>
                        <div class="shouli">
                            <img src="/static/board/icon-shouli.png"/>
                            <img src="/static/board/icon-shadow.png"/>
                        </div>
                        <span class="title">今日受理订单：</span>
                        <span class="number">{{numberObj.totalCount || 0}}</span>
                    </li>
                    <li>
                        <div  class="paiche">
                             <img src="/static/board/icon-paiche.png"/>
                             <img src="/static/board/icon-shadow.png"/>
                        </div>
                        <span class="title">今日派车：</span>
                        <span class="number">{{numberObj.dispatchCount || 0}}</span>
                    </li>
                    <li>
                        <div  class="chuche">
                            <img src="/static/board/icon-chuche.png"/>
                            <img src="/static/board/icon-shadow.png"/>
                        </div>
                        <span class="title">今日出车：</span>
                        <span class="number">{{numberObj.drivingCount || 0}}</span>
                    </li>
                    <li>
                        <div  class="huanche">
                            <img src="/static/board/icon-huanche.png"/>
                            <img src="/static/board/icon-shadow.png"/>
                        </div>
                        <span class="title">今日还车：</span>
                        <span class="number">{{numberObj.overCount || 0}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="middle-container">
            <!--待派车-->
            <div class="wait-dispatch-container">
                <div class="title-container">
                    <img src="/static/board/wait-dispatch-title.png"/>
                    <span>{{waitDispatchNumber || 0}}</span>
                    <span>单</span>
                </div>
                <div class="content-container">
                    <el-carousel trigger="click" :autoplay="true" :interval="interval" direction="vertical" >
                        <el-carousel-item v-for="(carouselItem,carouselIndex) in waitDispatchList" :key="carouselIndex">
                            <ul>
                                <li v-for="(item,index) in carouselItem" :key="index">
                                    <img src="/static/board/icon-time-blue.png" />
                                    <span class="time">{{item.usageDate}}&nbsp;{{item.usageTime}}</span>
                                    <div class="from-info">
                                        <span>{{checkAddressLeft(item.fromAddr)}}</span>
                                        <span>{{checkAddressRight(item.fromAddr)}}</span>
                                    </div>
                                    <div class="to-info">
                                        <span>{{checkAddressLeft(item.toAddr)}}</span>
                                        <span>{{checkAddressRight(item.toAddr)}}</span>
                                    </div>
                                    <div class="view-line"></div>
                                </li>
                            </ul>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <!--待接单-->
            <div class="wait-order-container">
                <div class="title-container">
                    <img src="/static/board/wait-order-title.png"/>
                    <span>{{waitOrderNumber || 0}}</span>
                    <span>辆</span>
                </div>
                <div class="content-container">
                    <el-carousel trigger="click" :autoplay="true" :interval="interval" direction="vertical" >
                        <el-carousel-item v-for="(carouselItem,carouselIndex) in waitOrderList" :key="carouselIndex">
                            <ul>
                                <li v-for="(item,index) in carouselItem" :key="index">
                                    <div class="driver-img">
                                        <img :src="checkDriverPic(item.driverPic)" onerror="this.src='/static/board/user-default.webp'">
                                    </div>
                                    <span class="driver-name">{{item.driver}}</span>
                                    <span class="car-number">{{item.carNumber}}</span>
                                </li>
                            </ul>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
        </div>
        <div class="bottom-container">
            <!--待出车-->
            <div class="wait-departure-container">
                <div class="title-container">
                    <img src="/static/board/wait-departure-title.png"/>
                    <span>{{waitDepartureNumber || 0}}</span>
                    <span>辆</span>
                </div>
                <div class="content-container">
                    <el-carousel trigger="click" :autoplay="true" :interval="interval" direction="vertical" >
                        <el-carousel-item v-for="(carouselItem,carouselIndex) in waitDepartureList" :key="carouselIndex">
                            <ul>
                                <li v-for="(item,index) in carouselItem" :key="index">
                                    <img src="/static/board/icon-time.png" />
                                    <span class="time">{{item.usageDate}}&nbsp;{{item.usageTime}}</span>
                                    <span class="driver-name">{{item.driver}}</span>
                                    <span class="car-number">{{item.carNumber}}</span>
                                </li>
                            </ul>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <!--出车中-->
            <div class="over-dispatch-container">
                <div class="title-container">
                    <img src="/static/board/over-dispatch-title.png"/>
                    <span>{{overDispatchNumber || 0}}</span>
                    <span>辆</span>
                </div>
                <div class="content-container">
                    <el-carousel trigger="click" :autoplay="true" :interval="interval" direction="vertical" >
                        <el-carousel-item v-for="(carouselItem,carouselIndex) in overDispatchList" :key="carouselIndex">
                            <ul>
                                <li v-for="(item,index) in carouselItem" :key="index">
                                    <div class="car-img">
                                        <img :src="checkCarImagePath(item.carBrand, item.carSeries)">
                                    </div>
                                    <span class="dirver-name">{{item.driver}}</span>
                                    <span class="car-number">{{item.carNumber}}</span>
                                    <img class="icon" src="/static/board/icon-grids.png" />
                                </li>
                            </ul>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <div class="bottom-number-container">
                <div class="data-container">
                    <ul>
                        <li>
                            <span>今日数据</span>
                        </li>
                        <li>
                            <span>累计行驶：</span>
                            <span class="custom-font">{{numberObj.drivingMiles || 0}}</span>
                            <span>公里</span>
                        </li>
                        <li>
                            <span>平均行驶：</span>
                            <span class="custom-font">{{numberObj.avgMiles || 0}}</span>
                            <span>公里</span>
                        </li>
                        <li>
                            <span>平均用时：</span>
                            <span class="custom-font">{{numberObj.avgHoure || 0}}</span>
                            <span>分钟</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import screenfull from 'screenfull'
import {largeScreenRequestCount,
largeScreenDriverRequest,
largeScreenRequestDispatch} from "@/api/largeScreen"
import checkCarImagePath from '@/utils/carPath'

export default {
    name: 'dispatchBoard',

    data() {
        return {
            //当前时间
            currentTime: '',
            //当前时间计时器
            currentTimer: '',
            //页面刷新计时器
            requestTimer: '',
            //待接单数据
            waitOrderList:[],
            //待接单数量
            waitOrderNumber:'',
            //待出车数据
            waitDepartureList:[],
            //待出车数量
            waitDepartureNumber:'',
            //数量对象
            numberObj:{},
            //待派车数据
            waitDispatchList:[],
            //待派车数量
            waitDispatchNumber:'',
            //出车中数据
            overDispatchList:[],
            //出车中数量
            overDispatchNumber:'',
            //车辆图片
            checkCarImagePath,
            //轮播图间隔
            interval:15000,

        }
    },
     mounted() {
        const that = this;
        screenfull.on('change', function() {
            if(screenfull.isFullscreen){
                that.showFullScreen = true;
            }else{
                that.showFullScreen = false;
            }
        })
        window.onresize = function () {
            that.resizeScreen();
        }
    },
    created() {
        this.resizeScreen();

        this.currentTimer = setInterval(() => {
            this.currentTime = this.parseTime(new Date().getTime(),'{y}-{m}-{d} {h}:{i}')
        }, 1000);
        this.requestTimer = setInterval(() => {
            this.getPageRequest();
        }, 300000);

        this.getPageRequest();

        this.$nextTick(() => {
            let element = document.getElementsByClassName('el-carousel__indicators--vertical');
            console.log(element)
        })
    },
    beforeDestroy() {
        clearInterval(this.currentTimer);
        clearInterval(this.requestTimer);
        this.currentTimer = null;
        this.requestTimer = null;
        window.onresize = null;
    },
    methods: {
        //设置不同分辨率下根元素字体大小
        resizeScreen(){
            let element = document.documentElement;
            const scale = element.clientWidth / 1920;
            element.style.fontSize = 100 * Math.min(scale, 2) + 'px'
        },
        //获取页面数据
        getPageRequest(){
            this.getNumberInfo();
            this.getWaitOrderList();
            this.getWaitDepartureList();
            this.getOverDispatchList();
            this.getWaitDispatchList();
        },
        //获取数量
        getNumberInfo() {
            this.loading = true

            largeScreenRequestCount().then(({data}) => {
                this.loading = false

                this.numberObj = data;
            }).catch((err) => {
                this.loading = false
            })
        },
         //获取待接单数据
        getWaitOrderList() {
            this.loading = true

            let params = {
                taskFlag: '1',
            }
            largeScreenDriverRequest(params).then(({data}) => {
                this.loading = false
            
                this.waitOrderNumber = data.length;
                this.waitOrderList = this.encapsulationList(9,data);
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取待出车数据
        getWaitDepartureList() {
            this.loading = true

            let params = {
                waitFlag: '1',
            }
            largeScreenDriverRequest(params).then(({data}) => {
                this.loading = false
            
                this.waitDepartureNumber = data.length;
                this.waitDepartureList = this.encapsulationList(9,data);
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取出车中数据
        getOverDispatchList() {
            this.loading = true

            let params = {
                drivingFlag: '1',
            }
            largeScreenDriverRequest(params).then(({data}) => {
                this.loading = false
                this.overDispatchNumber = data.length;
                this.overDispatchList = this.encapsulationList(9,data);
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取待派车数据
        getWaitDispatchList() {
            this.loading = true

            largeScreenRequestDispatch().then(({data}) => {
                this.loading = false
                this.waitDispatchNumber = data.length;
                this.waitDispatchList = this.encapsulationList(6,data);
            }).catch((err) => {
                this.loading = false
            })
        },
        //拼接司机头像地址
        checkDriverPic(fileName){
            if(!fileName){
                return '';
            }
            return process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/minio/getPic?fileName="+fileName;
        },
        //封装分页数据
        encapsulationList(chunkSize,dataList){
            if(dataList.length === 0){
                return;
            }
            const chunkedArray = [];
            for (let i = 0; i < dataList.length; i += chunkSize) {
                chunkedArray.push(dataList.slice(i, i + chunkSize));
            }
            return chunkedArray;
        },
        //获取地址左侧数据
        checkAddressLeft(arr){
            return arr.split(' ')[0];
        },
        //获取地址右侧数据
        checkAddressRight(arr){
            return arr.split(' ')[1];
        },
        //全屏点击
        fullScreenClick(){
            const element = document.getElementById('container_max');
            if(screenfull.isEnabled){
                screenfull.toggle(element)
            }else{
                this.$modal.msgWarning('当前设备不支持全屏模式!')
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.board-container {
    width: 100%;
    height: 100%;
    background:linear-gradient(180deg,#331a88 0%,#0b1556 100%);
    overflow: auto;

    .tip-container {
        width: 100%;
        height: 0.74rem;
        display: flex;
        justify-content: space-between;
        background: url('/static/board/dispatch-title-bg.png') no-repeat center top;
        background-size: contain;

        .left-container {
            height: 100%;
            display: flex;
            
            img {
                width: 0.64rem;
                height: 0.64rem;
                margin-top: 0.11rem;
                margin-left: 0.05rem;
            }
        }
        .right-container {
            display: flex;

            span {
                font-size: 0.2rem;
                color: #CEF2FF;
                font-family: 'LcdD';
                margin-top: 0.23rem;
                margin-right: 0.66rem;
            }
            & img:nth-child(2) {
                width: 0.35rem;
                height: 0.35rem;
                margin-right: 0.19rem;
                margin-top: 0.17rem;
            }
            & img:nth-child(3) {
                width: 0.44rem;
                height: 0.36rem;
                margin-right: 0.26rem;
                margin-top: 0.17rem;

                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
    .top-number-container {
        width: 100%;
        height: 1.4rem;
        margin-top: 0.03rem;
        box-sizing: border-box;
        padding-left: 0.2rem;
        padding-right: 0.2rem;
        display: flex;

        .number-content {
            width: 100%;
            height: 1.4rem;
            background: url('/static/board/top-number-bg.png') no-repeat center;
            background-size: contain;

            ul {
                margin: 0;
                padding: 0;
                list-style: none;
                display: flex;

                li {
                    width: 4.7rem;
                    height: 1.4rem;
                    display: flex;
                    align-items: center;

                    .shouli {
                        width: 1.28rem;
                        height: 1.28rem;
                        margin-left: 0.7rem;
                        display: flex;
                        align-items: center;
                        position: relative;

                        & img:nth-child(1){
                            width: 1.2rem;
                            height: 1.0rem;
                        }
                        & img:nth-child(2){
                            width: 1.38rem;
                            height: 0.3rem;
                            position: absolute;
                            left: -0.07rem;
                            bottom: 0.16rem;
                        }
                    }
                    .paiche {
                        width: 1.48rem;
                        height: 1.48rem;
                        margin-left: 0.46rem;
                        display: flex;
                        align-items: center;
                        position: relative;

                        & img:nth-child(1){
                            width: 1.7rem;
                            height: 1.0rem;
                            position: absolute;
                            left: -0.11rem;
                        }
                        & img:nth-child(2){
                            width: 1.38rem;
                            height: 0.3rem;
                            position: absolute;
                            left: 0.05rem;
                            bottom: 0.24rem;
                        }
                    }
                    .chuche {
                        width: 1.45rem;
                        height: 1.45rem;
                        margin-left: 0.62rem;
                        display: flex;
                        align-items: center;
                        position: relative;

                        & img:nth-child(1){
                            width: 1.2rem;
                            height: 1.0rem;
                        }
                        & img:nth-child(2){
                            width: 1.38rem;
                            height: 0.3rem;
                            position: absolute;
                            left: -0.08rem;
                            bottom: 0.24rem;
                        }
                    }
                    .huanche {
                        width: 1.40rem;
                        height: 1.40rem;
                        margin-left: 0.72rem;
                        display: flex;
                        align-items: center;
                        position: relative;

                        & img:nth-child(1){
                            width: 1.2rem;
                            height: 1.0rem;
                        }
                        & img:nth-child(2){
                            width: 1.38rem;
                            height: 0.3rem;
                            position: absolute;
                            left: -0.08rem;
                            bottom: 0.24rem;
                        }
                    }
                    .title {
                        font-size: 0.18rem;
                        color: #B8FFE7;
                        margin-left: 0.08rem;
                    }
                    .number {
                        font-size: 0.6rem;
                        color: #B8FFE7;
                        font-family: 'LcdD';
                    }
                }
            }
        }
    }
    .middle-container {
        width: 100%;
        height: 3.68rem;
        margin-top: 0.18rem;
        box-sizing: border-box;
        padding-left: 0.2rem;
        padding-right: 0.20rem;
        display: flex;
        justify-content: space-between;

        .wait-dispatch-container {
            width: 10.68rem;
            height: 100%;
            background: url('/static/board/wait-dispatch-bg.png') no-repeat center;
            background-size: contain;
            margin-right: 0.2rem;

            .title-container {
                width: 100%;
                height: 0.54rem;
                display: flex;

                img {
                    width: 1.45rem;
                    height: 0.54rem;
                }
                & span:nth-child(2){
                    font-size: 0.16rem;
                    color: #F9FF66;
                    font-family: 'LcdD';
                    margin-left: 0.04rem;
                    margin-top: 0.22rem;
                }
                & span:nth-child(3){
                    font-size: 0.16rem;
                    color: #F9FF66;
                    margin-left: 0.05rem;
                    margin-top: 0.20rem;
                }
            }
            .content-container {
                width: 100%;
                height: calc(100% - 0.54rem);
                box-sizing: border-box;
                padding-left: 0.4rem;
                position: relative;

                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        width: 4.7rem;
                        height: 0.83rem;
                        display: flex;
                        align-items: center;
                        float: left;
                        margin-top: 0.1rem;
                        margin-right: 0.2rem;
                        position: relative;
                        background: url('/static/board/wait-dispatch-item-bg.png') no-repeat center;
                        background-size: contain;

                        img {
                            width: 0.2rem;
                            height: 0.2rem;
                            position: absolute;
                            left: 0.01rem;
                            top: 0.08rem;
                        }
                        .time {
                            color: #7DD6FD;
                            font-size: 0.16rem;
                            font-family: 'LcdD';
                            position: absolute;
                            left: 0.3rem;
                            top: 0.09rem;
                        }
                        .from-info {
                            max-width: 1.2rem;
                            height: 0.41rem;
                            display: flex;
                            flex-direction: column;
                            position: absolute;
                            top: 0.33rem;
                            left: 0.3rem;
                            z-index: 2;

                            & span:nth-child(1){
                                color: #a3a3b5;
                                font-size: 0.12rem;
                                overflow: hidden;
                                white-space:nowrap;
                                text-overflow: ellipsis;
                            }
                            & span:nth-child(2){
                                margin-top: 0.02rem;
                                color: #ffffff;
                                font-size: 0.16rem;
                                font-weight: 600;
                                position: relative;
                                overflow: hidden;
                                white-space:nowrap;
                                text-overflow: ellipsis;
                            }
                        }
                        & .from-info::after{
                            content: "";
                            width: 0.06rem;
                            height: 0.06rem;
                            background-color: #88fd1b;
                            border-radius: 50%;
                            position: absolute;
                            left: -0.15rem;
                            top: 0.25rem
                        }
                        .to-info {
                            max-width: 1.2rem;
                            height: 0.41rem;
                            display: flex;
                            flex-direction: column;
                            z-index: 2;
                            position: absolute;
                            top: 0.33rem;
                            right: 0.2rem;

                            & span:nth-child(1){
                                color: #a3a3b5;
                                font-size: 0.12rem;
                                overflow: hidden;
                                white-space:nowrap;
                                text-overflow: ellipsis;
                            }
                            & span:nth-child(2){
                                margin-top: 0.02rem;
                                color: #ffffff;
                                font-size: 0.16rem;
                                font-weight: 600;
                                position: relative;
                                overflow: hidden;
                                white-space:nowrap;
                                text-overflow: ellipsis;
                            }
                        }
                        & .to-info::after {
                            content: "";
                            width: 0.06rem;
                            height: 0.06rem;
                            background-color: #ad70ff;
                            border-radius: 50%;
                            position: absolute;
                            left: -0.15rem;
                            top: 0.25rem
                        }
                        .view-line {
                            position: absolute;
                            width: 1.5rem;
                            height: 0;
                            border: 0.01rem solid;
                            border-color:#4c6388;
                            top: 0.55rem;
                            left: 50%;
                            transform: translateX(-50%);
                            z-index: 1;
                        }
                    }
                }
            }
        }
        .wait-order-container {
            width: 7.92rem;
            height: 100%;
            background: url('/static/board/wait-order-bg.png') no-repeat center;
            background-size: contain;

            .title-container {
                width: 100%;
                height: 0.54rem;
                display: flex;

                img {
                    width: 1.45rem;
                    height: 0.54rem;
                }
                & span:nth-child(2){
                    font-size: 0.16rem;
                    color: #FFB2F7;
                    font-family: 'LcdD';
                    margin-left: 0.04rem;
                    margin-top: 0.20rem;
                }
                & span:nth-child(3){
                    font-size: 0.16rem;
                    color: #FFB2F7;
                    margin-left: 0.05rem;
                    margin-top: 0.18rem;
                }
            }
            .content-container {
                width: 100%;
                height: calc(100% - 0.54rem);
                box-sizing: border-box;
                padding-left: 0.3rem;
                padding-top: 0.1rem;
                position: relative;

                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        width: 2.21rem;
                        height: 0.82rem;
                        display: flex;
                        align-items: center;
                        float: left;
                        margin-right: 0.20rem;
                        margin-bottom: 0.2rem;
                        position: relative;
                        background: url('/static/board/leave-item-bg.png') no-repeat center top;
                        background-size: contain;

                        .driver-img {
                            width: 0.62rem;
                            height: 0.62rem;
                            display: flex;
                            align-items: center;
                            background: url('/static/board/leave-border.png') no-repeat center top;
                            background-size: contain;

                            img {
                                width: 0.52rem;
                                height: 0.52rem;
                                margin: 0 auto;
                            }
                        }
                        .driver-name {
                            color: #ffffff;
                            font-size: 0.18rem;
                            position: absolute;
                            left: 0.75rem;
                            top: 0.13rem;
                        }
                        .car-number {
                            color: #FFFFFF;
                            font-size: 0.14rem;
                            position: absolute;
                            left: 0.75rem;
                            top: 0.43rem;
                        }
                    }
                }
            }
        }
    }
    .bottom-container {
        width: 100%;
        height: 4.6rem;
        margin-top: 0.16rem;
        box-sizing: border-box;
        padding-left: 0.2rem;
        padding-right: 0.20rem;
        display: flex;
        justify-content: space-between;
        position: relative;

        .wait-departure-container {
            width: 10.68rem;
            height: 3.68rem;
            background: url('/static/board/wait-departure-bg.png') no-repeat center;
            background-size: contain;
            margin-right: 0.2rem;

            .title-container {
                width: 100%;
                height: 0.54rem;
                display: flex;

                img {
                    width: 1.45rem;
                    height: 0.54rem;
                }
                & span:nth-child(2){
                    font-size: 0.16rem;
                    color: #F9FF66;
                    font-family: 'LcdD';
                    margin-left: 0.04rem;
                    margin-top: 0.22rem;
                }
                & span:nth-child(3){
                    font-size: 0.16rem;
                    color: #F9FF66;
                    margin-left: 0.05rem;
                    margin-top: 0.20rem;
                }
            }
            .content-container {
                width: 100%;
                height: calc(100% - 0.54rem);
                box-sizing: border-box;
                padding-left: 0.37rem;
                position: relative;

                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        width: 3.05rem;
                        height: 0.83rem;
                        display: flex;
                        align-items: center;
                        float: left;
                        margin-top: 0.1rem;
                        margin-right: 0.24rem;
                        position: relative;
                        background: url('/static/board/wait-departure-item-bg.png') no-repeat center;
                        background-size: contain;

                        img {
                            width: 0.2rem;
                            height: 0.2rem;
                            position: absolute;
                            left: 0.12rem;
                            top: 0.17rem;
                        }
                        .time {
                            color: #FFF6DA;
                            font-size: 0.16rem;
                            font-family: 'LcdD';
                            position: absolute;
                            left: 0.41rem;
                            top: 0.17rem;
                        }
                        .driver-name {
                            color: #FFFFFF;
                            font-weight: 600;
                            font-size: 0.18rem;
                            position: absolute;
                            left: 0.42rem;
                            top: 0.46rem;
                        }
                        .car-number {
                            color: #FFFFFF;
                            font-size: 0.14rem;
                            position: absolute;
                            left: 1.65rem;
                            top: 0.48rem;
                        }
                    }
                }
            }
        }
        .over-dispatch-container {
            width: 7.92rem;
            height: 3.68rem;
            background: url('/static/board/over-dispatch-bg.png') no-repeat center;
            background-size: contain;

            .title-container {
                width: 100%;
                height: 0.54rem;
                display: flex;

                img {
                    width: 1.45rem;
                    height: 0.54rem;
                }
                & span:nth-child(2){
                    font-size: 0.16rem;
                    color: #F1FFD1;
                    font-family: 'LcdD';
                    margin-left: 0.04rem;
                    margin-top: 0.22rem;
                }
                & span:nth-child(3){
                    font-size: 0.16rem;
                    color: #F1FFD1;
                    margin-left: 0.05rem;
                    margin-top: 0.20rem;
                }
            }
            .content-container {
                width: 100%;
                height: calc(100% - 0.54rem);
                box-sizing: border-box;
                padding-left: 0.33rem;
                position: relative;

                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        width: 2.15rem;
                        height: 0.72rem;
                        display: flex;
                        align-items: center;
                        float: left;
                        margin-right: 0.28rem;
                        margin-top: 0.18rem;
                        position: relative;
                        background: url('/static/board/over-dispatch-item-bg.png') no-repeat center;
                        background-size: contain;

                        .car-img {
                            width: 0.62rem;
                            height: 0.62rem;
                            display: flex;
                            align-items: center;
                            background: url('/static/board/over-border.png') no-repeat center top;
                            background-size: contain;

                            img {
                                width: 0.55rem;
                                height: 0.55rem;
                                margin: 0 auto;
                            }
                        }
                        .dirver-name {
                            color: #ffffff;
                            font-size: 0.18rem;
                            position: absolute;
                            left: 0.75rem;
                            top: 0.15rem;
                        }
                        .car-number {
                            color: #A2FFAF;
                            font-size: 0.12rem;
                            position: absolute;
                            left: 0.75rem;
                            top: 0.42rem;
                        }
                        .icon {
                            width: 0.13rem;
                            height: 0.13rem;
                            position: absolute;
                            right: 0.06rem;
                            bottom: 0.04rem;
                        }
                    }
                }
            }
        }
        .bottom-number-container {
            width: 100%;
            height: 0.72rem;
            position: absolute;
            bottom: 0;
            left: 0;
            background: url('/static/board/dispatch-bottom-bg.png') no-repeat center top;
            background-size: contain;

            .data-container {
                margin-top: 0.1rem;
                font-size: 0.14rem;
                color: #b8ffe7;
                text-align: center;

                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    display: inline-block;

                    li {
                        display: inline-block;
                        margin-right: 0.45rem;

                        .custom-font {
                            font-family: 'LcdD';
                            margin-right: 0.1rem;
                            color: #B8FFE7;
                        }
                    }
                }
            }
        }
    }
}
::v-deep .el-carousel--vertical {
    height: 100%
}
::v-deep .el-carousel__container {
    height: 100%;
}
::v-deep .el-carousel__indicators--vertical {
    right: 0.1rem;
}
//轮播图指示器样式 未进入此页面的样式
::v-deep .el-carousel__button {
    width: 0.04rem;
    height: 0.4rem;
    background: #68FFE3;
    opacity: 1;
}
//滚动到此页面的样式
::v-deep .is-active .el-carousel__button {
    width: 0.04rem;
    height: 0.4rem;
    background: #94fe68;
    opacity: 1;
}
</style>