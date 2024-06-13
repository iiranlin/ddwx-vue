<template>
    <div class="board-container" id="container_max">
        <!--顶部-->
        <div class="top-container">
            <div class="top-right-container">
                <span>{{currentTime}}</span>
                <img src="/static/driver-board-pie.webp"/>
                <img src="/static/driver-board-pie.webp"/>
            </div>
        </div>
        <!--中部-->
        <div class="middle-container">
            <!--待接单-->
            <div class="wait-order">
                <div class="title-container">
                    <span>{{waitOrderNumber}}</span>
                    <span>辆</span>
                </div>
                <div class="wait-order-container">
                    <el-carousel trigger="click" :autoplay="false" arrow="never" interval="15000">
                        <el-carousel-item v-for="(carouselItem,carouselIndex) in waitOrderList" :key="carouselIndex">
                            <ul>
                                <li v-for="(item,index) in carouselItem" :key="index">
                                    <div class="li-item">
                                        <img :src="checkDriverPic(item.driverPic)" onerror="this.src='/static/driver-board-on-duty-user-default.webp'">
                                        <div class="li-info">
                                            <span class="dirver-name">{{item.driver}}</span>
                                            <div class="car-info">
                                                <span>{{item.carNumber}}</span>
                                                <span>{{item.carBrand}}{{item.carSeries}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </el-carousel-item>
                    </el-carousel>    
                </div>
            </div>
            <div class="middle-content">
                <!--数量展示-->
                <div class="number-container">
                   <ul>
                        <li>
                            <img src="/static/dispatch-board-sl-img.webp"/>
                            <div>
                                <span>今日受理订单：</span>
                                <span>{{numberObj.totalCount || 0}}</span>
                            </div>
                        </li>
                        <li>
                            <img src="/static/dispatch-board-pc-img.webp"/>
                            <div>
                                <span>今日派车：</span>
                                <span>{{numberObj.dispatchCount || 0}}</span>
                            </div>
                        </li>
                        <li>
                            <img src="/static/dispatch-board-hc-img.webp"/>
                            <div>
                                <span>今日出车：</span>
                                <span>{{numberObj.drivingCount || 0}}</span>
                            </div>
                        </li>
                        <li>
                            <img src="/static/dispatch-board-hc-img.webp"/>
                            <div>
                                <span>今日还车：</span>
                                <span>{{numberObj.overCount || 0}}</span>
                            </div>
                        </li>
                   </ul>
                </div>
                <div class="car-container">
                    <!--待派车-->
                    <div class="wait-dispatch">
                        <div class="title-container">
                            <span>{{waitDispatchNumber || 0}}</span>
                            <span>单</span>
                            <img src="/static/dispatch-board-wait-dispatch-title-icon.webp"/>
                        </div>
                        <div class="wait-dispatch-container">
                            <el-carousel trigger="click" :autoplay="true" arrow="never" interval="15000">
                                <el-carousel-item v-for="(carouselItem,carouselIndex) in waitDispatchList" :key="carouselIndex">
                                    <ul>
                                        <li v-for="(item,index) in carouselItem" :key="index">
                                            <div class="li-item">
                                                <div class="time-info">
                                                    <img src="/static/driver-board-clock.webp"/>
                                                    <span>{{item.usageDate}}&nbsp;{{item.usageTime}}</span>
                                                </div>
                                                <div class="address-info">
                                                    <div class="view-line"></div>
                                                    <div class="from-info">
                                                        <span>{{checkAddressLeft(item.fromAddr)}}</span>
                                                        <span>{{checkAddressRight(item.fromAddr)}}</span>
                                                    </div>
                                                    <div class="to-info">
                                                        <span>{{checkAddressLeft(item.toAddr)}}</span>
                                                        <span>{{checkAddressRight(item.toAddr)}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </el-carousel-item>
                            </el-carousel>    
                        </div>
                    </div>
                    <!--出车中-->
                    <div class="over-dispatch">
                        <div class="title-container">
                            <span>{{overDispatchNumber || 0}}</span>
                            <span>辆</span>
                            <img src="/static/dispatch-board-over-dispatch-title-icon.webp"/>
                        </div>
                        <div class="over-dispatch-container">
                            <el-carousel trigger="click" :autoplay="true" arrow="never" interval="15000">
                                <el-carousel-item v-for="(carouselItem,carouselIndex) in overDispatchList" :key="carouselIndex">
                                    <ul>
                                        <li v-for="(item,index) in carouselItem" :key="index">
                                            <div class="li-item">
                                                <div class="car-image">   
                                                    <img :src="checkCarImagePath(item.carBrand, item.carSeries)">
                                                </div>
                                                <div class="li-info">
                                                    <span class="dirver-name">{{item.driver}}</span>
                                                    <span>{{item.carNumber}}</span>
                                                    <span>{{item.carBrand}}{{item.carSeries}}</span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </el-carousel-item>
                            </el-carousel>    
                        </div>
                    </div>
                </div>
            </div>
            <!--待出车-->
            <div class="wait-departure">
                <div class="title-container">
                    <span>{{waitDepartureNumber}}</span>
                    <span>辆</span>
                </div>
                 <div class="wait-departure-container">
                    <el-carousel trigger="click" :autoplay="true" arrow="never" interval="15000">
                        <el-carousel-item v-for="(carouselItem,carouselIndex) in waitDepartureList" :key="carouselIndex">
                            <ul>
                                <li v-for="(item,index) in carouselItem" :key="index">
                                    <div class="li-item">
                                        <div class="time-info">
                                            <img src="/static/driver-board-clock.webp"/>
                                            <span>{{item.usageDate}}&nbsp;{{item.usageTime}}</span>
                                        </div>
                                        <div class="car-info">
                                            <span class="dirver-name">{{item.driver}}</span>
                                            <span>{{item.carNumber}}</span>
                                            <span>{{item.carBrand}}{{item.carSeries}}</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </el-carousel-item>
                    </el-carousel>    
                </div>
            </div>
        </div>
        <!--底部-->
        <div class="bottom-container">
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
            <img src="/static/driver-board-full-screen.webp" @click="fullScreenClick()"/>
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
                this.overDispatchList = this.encapsulationList(12,data);
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
    display: flex;
    flex-direction: column;
    background:linear-gradient(180deg,#331a88 0%,#0b1556 100%);

    .top-container {
        width: 100%;
        height: 0.74rem;
        background: url('/static/dispatch-board-top-bg.webp') no-repeat center top;
        background-size: contain;

        .top-right-container {
            height: 100%;
            float: right;
            margin-right: 0.15rem;
            display: flex;
            align-items: center;

            img {
                width: 0.34rem;
                height: 0.34rem;
            }
            & span:nth-child(1){
                font-size: 0.2rem;
                color: #88f2fd;
                font-family: 'LcdD';
                margin-right: 0.24rem;
            }
            & img:nth-child(2){
                margin-right: 0.1rem;
            }
        }
    }
    .middle-container {
        margin-top: 0.11rem;
        display: flex;
        justify-content: space-between;
        margin-left: 0.46rem;
        margin-right: 0.46rem;
        height: calc(100% - 0.74rem);

        .wait-order {
            width: 3.34rem;
            height: calc(100% - 0.7rem);
            background-image: url("/static/driver-board-middle-left-bg.webp");
            background-size: 3.34rem 100%;
            background-repeat: no-repeat;

            .title-container {
                height: 0.56rem;
                background-image: url("/static/dispatch-board-wait-order-title-bg.webp");
                background-size: contain;
                background-repeat: no-repeat;
                display: flex;

                & span:nth-child(1){
                    font-size: 0.14rem;
                    color: #c2fe66;
                    font-family: 'LcdD';
                    margin-left: 1.53rem;
                    margin-top: 0.27rem;
                }
                & span:nth-child(2){
                    font-size: 0.14rem;
                    color: #c2fe66;
                    margin-top: 0.25rem;
                    margin-left: 0.05rem;
                }
            }
            .wait-order-container {
                height: calc(100% - 0.56rem);

                ::v-deep .el-carousel {
                    height: 100%;
                }
                ::v-deep .el-carousel__container {
                    height: 100%;
                }
                //轮播图指示器样式 未进入此页面的样式
                ::v-deep .el-carousel__button {
                    width: 0.1rem;
                    height: 0.1rem;
                    background: #3d8b9b;
                    border-radius: 50%;
                    opacity: 1;
                }
                //滚动到此页面的样式
                ::v-deep .is-active .el-carousel__button {
                    width: 0.1rem;
                    height: 0.1rem;
                    background: #94fe68;
                    border-radius: 50%;
                    opacity: 1;
                }
                ::v-deep .el-carousel__button {
                    position: relative;
                    top: 0.05rem;
                }
                ::v-deep .el-carousel__indicators {
                    width: 100%;
                    text-align: left;
                    padding: 0 0.3rem;
                }
                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    margin-top: 0.21rem;

                    li {
                        width: 2.7rem;
                        height: 0.72rem;
                        margin-left: 0.36rem;
                        margin-bottom: 0.2rem;
                        background-image: url("/static/driver-board-on-duty-li-bg.webp");
                        background-size: contain;
                        background-repeat: no-repeat;

                        .li-item {
                            display: flex;
                            width: 100%;
                            height: 100%;

                            img {
                                width: 0.63rem;
                                height: 0.63rem;
                            }
                            .li-info {
                                margin-left: 0.12rem;
                                display: flex;
                                flex-direction: column;

                                .dirver-name {
                                    margin-top: 0.08rem;
                                    font-size: 0.16rem;
                                    color: #ffffff;
                                    font-weight: 600;
                                }
                                .car-info {
                                    display: flex;
                                    margin-top: 0.07rem;

                                    & span:nth-child(1){
                                        font-size: 0.12rem;
                                        color: #b8ffe7;
                                    }
                                    & span:nth-child(2){
                                        margin-left: 0.14rem;
                                        font-size: 0.12rem;
                                        color: #b8ffe7;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .middle-content {
            display: flex;
            flex-direction: column;

            .number-container {
                width: 11.4rem;
                height: 1.75rem;
                display: flex;
                background: url('/static/dispatch-board-number-container-bg.webp');
                background-size: 11.4rem 100%;
                background-repeat: no-repeat;

                ul {
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    display: flex;
                    font-size: 0.16rem;
                    color: #b8ffe7;

                    li {
                        flex: 1;
                        text-align: center;

                        img {
                            width: 1.4rem;
                            height: 0.94rem;
                            margin: 0.27rem auto 0;
                            display: block;
                        }
                        div {
                            position: relative;
                            top: -0.1rem;

                            & span:nth-child(2){
                                font-family: 'LcdD';
                                font-size: 0.32rem;
                            }
                        }
                    }
                }
            }
            .car-container {
                width: 11.4rem;
                height: 6.89rem;
                display: flex;
                justify-content: space-between;
                margin-top: 0.12rem;

                .wait-dispatch {
                    width: 5.64rem;
                    height: 100%;
                    background: url('/static/dispatch-board-wait-dispatch-bg.webp');
                    background-size: 5.64rem 100%;
                    background-repeat: no-repeat;

                    .title-container {
                        height: 0.58rem;
                        background-image: url("/static/dispatch-board-wait-dispatch-title-bg.webp");
                        background-size: contain;
                        background-repeat: no-repeat;
                        display: flex;
                        position: relative;

                        & span:nth-child(1){
                            font-size: 0.14rem;
                            color: #c2fe66;
                            font-family: 'LcdD';
                            margin-left: 1.66rem;
                            margin-top: 0.27rem;
                        }
                        & span:nth-child(2){
                            font-size: 0.14rem;
                            color: #c2fe66;
                            margin-top: 0.25rem;
                            margin-left: 0.05rem;
                        }
                        img {
                            width: 0.26rem;
                            height: 0.17rem;
                            position: absolute;
                            right: 0.21rem;
                            bottom: 0.08rem;
                        }
                    }
                    .wait-dispatch-container {
                        height: calc(100% - 0.58rem);

                        ::v-deep .el-carousel {
                            height: 100%;
                        }
                        ::v-deep .el-carousel__container {
                            height: 100%;
                        }
                        //轮播图指示器样式 未进入此页面的样式
                        ::v-deep .el-carousel__button {
                            // width: 1.2rem;
                            height: 0.04rem;
                            background: #3d8b9b;
                            opacity: 1;
                        }
                        //滚动到此页面的样式
                        ::v-deep .is-active .el-carousel__button {
                            // width: 1.2rem;
                            height: 0.04rem;
                            background: #94fe68;
                            opacity: 1;
                        }
                        ul {
                            list-style: none;
                            margin: 0;
                            padding: 0;
                            margin-top: 0.18rem;

                            li {
                                width: 5.14rem;
                                height: 0.85rem;
                                margin-left: 0.25rem;
                                margin-bottom: 0.08rem;
                                background-image: url("/static/dispatch-board-wait-dispatch-li-bg.webp");
                                background-size: contain;
                                background-repeat: no-repeat;

                                .li-item {
                                    display: flex;
                                    flex-direction: column;
                                    width: 100%;
                                    height: 100%;

                                    .time-info {
                                        display: flex;
                                        align-items: center;
                                        margin-top: 0.09rem;

                                        img {
                                            width: 0.22rem;
                                            height: 0.22rem;
                                        }
                                        span {
                                            margin-left: 0.08rem;
                                            font-size: 0.14rem;
                                            color: #7dd6fd;
                                            font-family: 'LcdD';
                                        }
                                    }
                                    .address-info {
                                        display: flex;
                                        margin-top: 0.02rem;
                                        justify-content: space-between;
                                        position: relative;

                                        .from-info {
                                            margin-left: 0.29rem;
                                            display: flex;
                                            flex-direction: column;
                                            z-index: 2;
                                            background-color: #16185b;
                                            padding-right: 0.13rem;

                                            & span:nth-child(1){
                                                color: #a3a3b5;
                                                font-size: 0.12rem;
                                            }
                                            & span:nth-child(2){
                                                margin-top: 0.02rem;
                                                color: #ffffff;
                                                font-size: 0.16rem;
                                                font-weight: 600;
                                                position: relative;

                                                &::after{
                                                    content: "";
                                                    width: 0.06rem;
                                                    height: 0.06rem;
                                                    background-color: #88fd1b;
                                                    border-radius: 50%;
                                                    position: absolute;
                                                    left: -0.1rem;
                                                    top: 0.08rem
                                                }
                                            }
                                        }
                                        .to-info {
                                            display: flex;
                                            flex-direction: column;
                                            margin-right: 0.41rem;
                                            z-index: 2;
                                            background-color: #16185b;
                                            padding-left: 0.13rem;

                                            & span:nth-child(1){
                                                color: #a3a3b5;
                                                font-size: 0.12rem;
                                            }
                                            & span:nth-child(2){
                                                margin-top: 0.02rem;
                                                color: #ffffff;
                                                font-size: 0.16rem;
                                                font-weight: 600;
                                                position: relative;

                                                &::after{
                                                    content: "";
                                                    width: 0.06rem;
                                                    height: 0.06rem;
                                                    background-color: #ad70ff;
                                                    border-radius: 50%;
                                                    position: absolute;
                                                    left: -0.1rem;
                                                    top: 0.08rem
                                                }
                                            }
                                        }
                                         .view-line {
                                            position: absolute;
                                            width: 2.5rem;
                                            height: 0;
                                            border: 0.01rem solid;
                                            border-color:#4c6388;
                                            top: 0.21rem;
                                            left: 50%;
                                            transform: translateX(-50%);
                                            z-index: 1;
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
                .over-dispatch {
                    width: 5.64rem;
                    height: 100%;
                    background: url('/static/dispatch-board-over-dispatch-bg.webp');
                    background-size: 5.64rem 100%;
                    background-repeat: no-repeat;

                    ::v-deep .el-carousel {
                        height: 100%;
                    }
                    ::v-deep .el-carousel__container {
                        height: 100%;
                    }
                    //轮播图指示器样式 未进入此页面的样式
                    ::v-deep .el-carousel__button {
                        // width: 1.2rem;
                        height: 0.04rem;
                        background: #3d8b9b;
                        opacity: 1;
                    }
                    //滚动到此页面的样式
                    ::v-deep .is-active .el-carousel__button {
                        // width: 1.2rem;
                        height: 0.04rem;
                        background: #94fe68;
                        opacity: 1;
                    }
                    .title-container {
                        height: 0.58rem;
                        background-image: url("/static/dispatch-board-over-dispatch-title-bg.webp");
                        background-size: contain;
                        background-repeat: no-repeat;
                        display: flex;
                        position: relative;

                        & span:nth-child(1){
                            font-size: 0.14rem;
                            color: #c2fe66;
                            font-family: 'LcdD';
                            margin-left: 1.66rem;
                            margin-top: 0.27rem;
                        }
                        & span:nth-child(2){
                            font-size: 0.14rem;
                            color: #c2fe66;
                            margin-top: 0.25rem;
                            margin-left: 0.05rem;
                        }
                        img {
                            width: 0.34rem;
                            height: 0.12rem;
                            position: absolute;
                            right: 0.34rem;
                            bottom: 0.09rem;
                        }
                    }
                    .over-dispatch-container {
                        height: calc(100% - 0.58rem);

                        ul {
                            list-style: none;
                            margin: 0;
                            padding: 0;
                            margin-top: 0.21rem;

                            li {
                                width: 2.51rem;
                                height: 0.76rem;
                                margin-bottom: 0.18rem;
                                margin-left: 0.24rem;
                                float: left;
                                background-image: url("/static/driver-board-over-dispatch-li-bg.webp");
                                background-size: contain;
                                background-repeat: no-repeat;

                                .li-item {
                                    display: flex;

                                    .car-image {
                                        display: flex;
                                        width: 0.64rem;
                                        height: 0.64rem;
                                        padding: 0.01rem;
                                        background-image: url("/static/driver-board-over-departure-car-bg.webp");
                                        background-size: contain;
                                        background-repeat: no-repeat;

                                        img {
                                            vertical-align: middle;
                                            width: 0.63rem;
                                            height: 0.63rem;
                                        }
                                    }
                                    .li-info {
                                        width: 100%;
                                        margin-left: 0.13rem;
                                        display: flex;
                                        flex-direction: column;

                                        .dirver-name {
                                            font-size: 0.16rem;
                                            color: #ffffff;
                                            font-weight: 600;
                                        }
                                        span {
                                            font-size: 0.12rem;
                                            color: #b8ffe7;
                                            float: left;
                                            margin-bottom: 0.03rem;
                                            position: relative;
                                        }
                                    }
                                }
                            }
                            & li:nth-child(2n){
                                margin-left: 0.02rem;
                            }
                        }
                    }
                }
            }
        }
        .wait-departure {
            width: 3.34rem;
            height: calc(100% - 0.7rem);;
            background-image: url("/static/driver-board-middle-right-bg.webp");
            background-size: 3.34rem 100%;
            background-repeat: no-repeat;

            .title-container {
                height: 0.56rem;
                background-image: url("/static/driver-board-wait-departure-title-bg.webp");
                background-size: contain;
                background-repeat: no-repeat;
                display: flex;

                & span:nth-child(1){
                    font-size: 0.14rem;
                    color: #c2fe66;
                    font-family: 'LcdD';
                    margin-left: 1.53rem;
                    margin-top: 0.27rem;
                }
                & span:nth-child(2){
                    font-size: 0.14rem;
                    color: #c2fe66;
                    margin-top: 0.25rem;
                    margin-left: 0.05rem;
                }
            }
            .wait-departure-container {
                height: calc(100% - 0.56rem);

                ::v-deep .el-carousel {
                    height: 100%;
                }
                ::v-deep .el-carousel__container {
                    height: 100%;
                }
                //轮播图指示器样式 未进入此页面的样式
                ::v-deep .el-carousel__button {
                    width: 0.1rem;
                    height: 0.1rem;
                    background: #3d8b9b;
                    border-radius: 50%;
                    opacity: 1;
                }
                //滚动到此页面的样式
                ::v-deep .is-active .el-carousel__button {
                    width: 0.1rem;
                    height: 0.1rem;
                    background: #94fe68;
                    border-radius: 50;
                    opacity: 1;
                }
                ::v-deep .el-carousel__button {
                    position: relative;
                    top: 0.05rem;
                }
                ::v-deep .el-carousel__indicators {
                    width: 100%;
                    text-align: right;
                    padding: 0 0.26rem;
                }
                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    margin-top: 0.27rem;

                    li {
                        width: 3.4rem;
                        height: 0.68rem;
                        margin-left: 0.24rem;
                        margin-bottom: 0.24rem;
                        background-image: url("/static/driver-board-wait-departure-li-bg.webp");
                        background-size: contain;
                        background-repeat: no-repeat;

                        .li-item {
                            display: flex;
                            flex-direction: column;
                            width: 100%;
                            height: 100%;

                            .time-info {
                                display: flex;
                                align-items: center;

                                img {
                                    width: 0.22rem;
                                    height: 0.22rem;
                                }
                                span {
                                    margin-left: 0.09rem;
                                    font-size: 0.16rem;
                                    color: #7dd6fd;
                                    font-family: 'LcdD';
                                }
                            }
                            .car-info {
                                display: flex;
                                margin-top: 0.11rem;
                                align-items: center;

                                & span:nth-child(1) {
                                    font-size: 0.16rem;
                                    color: #ffffff;
                                    font-weight: 600;
                                    margin-left: 0.31rem;
                                    width: 0.65rem;
                                }
                                & span:nth-child(2){
                                    margin-left: 0.64rem;
                                    font-size: 0.12rem;
                                    color: #b8ffe7;
                                }
                                & span:nth-child(3){
                                    margin-left: 0.14rem;
                                    font-size: 0.12rem;
                                    color: #b8ffe7;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .bottom-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.8rem;
        background: url('/static/dispatch-board-bottom-bg.webp') no-repeat center top;
        background-size: contain;

        .data-container {
            margin-top: 0.17rem;
            font-size: 0.14rem;
            color: #b8ffe7;
            text-align: center;

            ul {
                margin: 0;
                padding: 0;
                display: inline-block;
                list-style: none;

                li {
                    display: inline-block;
                    margin-right: 0.45rem;

                    .custom-font {
                        font-family: 'LcdD';
                        margin-right: 0.1rem;
                    }
                }
            }
        }
        img {
            position: absolute;
            width: 1.29rem;
            height: 0.35rem;
            right: 0.14rem;
            top: 0.27rem;

            &:hover {
                cursor: pointer;
            }
        }
    }

}
</style>