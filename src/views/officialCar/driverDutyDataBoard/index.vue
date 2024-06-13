<template>
    <div class="board-container" id="container_max">
        <!--顶部-->
        <div class="top-container">
            <div class="top-left-container">
                <span>安全驾驶，从我做起，累计安全行驶</span>
                <span>{{secureDayNumber}}</span>
                <span>天</span>
            </div>
            <div class="top-right-container">
                <span>{{currentTime}}</span>
                <img src="/static/driver-board-pie.webp"/>
                <img src="/static/driver-board-pie.webp"/>
            </div>
        </div>
        <!--中部-->
        <div class="middle-container">
            <!--值班人员-->
            <div class="on-duty">
                <div class="title-container">
                    <span>{{onDutyNumber}}</span>
                    <span>人</span>
                </div>
                <div class="on-duty-container">
                    <el-carousel trigger="click" :autoplay="true" arrow="never" interval="15000">
                        <el-carousel-item v-for="(carouselItem,carouselIndex) in onDutyList" :key="carouselIndex">
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
                <!--已出车-->
                <div class="over-departure">
                    <div class="title-container">
                        <img src="/static/driver-board-over-departure-title-bg.webp"/>
                        <span>{{overDepartureNumber}}</span>
                        <span>辆</span>
                    </div>
                    <div class="over-departure-container">
                        <el-carousel trigger="click" :autoplay="true" arrow="never" interval="15000">
                            <el-carousel-item v-for="(carouselItem,carouselIndex) in overDepartureList" :key="carouselIndex">
                                <ul>
                                    <li v-for="(item,index) in carouselItem" :key="index">
                                        <div class="li-item">
                                            <div class="car-image">   
                                                <img :src="checkCarImagePath(item.carBrand, item.carSeries)">
                                            </div>
                                            <div class="li-info">
                                                <span class="dirver-name">{{item.driver}}</span>
                                                <div class="car-info">
                                                    <span>{{item.carNumber}}</span>
                                                    <span>起点：{{item.fromAddr}}</span>
                                                    <span>{{item.carBrand}}{{item.carSeries}}</span>
                                                    <span>终点：{{item.toAddr}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </el-carousel-item>
                        </el-carousel>    
                    </div>
                </div>
                <!--休假/请假-->
                <div class="vacation-leave">
                    <div class="title-container">
                        <img src="/static/dirver-board-vacation-leave-title-bg.webp"/>
                        <span>{{vacationLeaveNumber}}</span>
                        <span>人</span>
                    </div>
                    <div class="vacation-leave-container">
                        <el-carousel trigger="click" :autoplay="true" arrow="never" interval="15000">
                            <el-carousel-item v-for="(carouselItem,carouselIndex) in vacationLeaveList" :key="carouselIndex">
                                <ul>
                                    <li v-for="(item,index) in carouselItem" :key="index">
                                        <div class="li-item">
                                            <img :src="checkDriverPic(item.driverPic)" onerror="this.src='/static/driver-board-on-duty-user-default.webp'">
                                            <div class="li-info">
                                                <span class="dirver-name">{{item.driverName}}</span>
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
                <!--滚动屏-->
                <div class="rolling-board">
                    <vue-seamless-scroll :data="scrollList" :class-option="classOption" class="seamless-warp">
                        <ul>
                            <li v-for="(item, index) in scrollList" :key="index">
                                <span>{{checkDriver(item)}}</span>
                                <span>{{checkMsg(item)}}</span>
                            </li>
                        </ul>
                    </vue-seamless-scroll>
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
            <img src="/static/driver-board-full-screen.webp" @click="fullScreenClick()"/>
            <img v-if="showVoice" src="/static/driver-board-voice-close.png" @click="voiceToggleClick()"/>
            <img v-else src="/static/driver-board-voice-open.webp" @click="voiceToggleClick()"/>
        </div>
    </div>
</template>
<script>
import screenfull from 'screenfull'
import {largeScreenDriverClass,
largeScreenDriverRequest,
largeScreenDriverLeave,
largeScreenDriverMsg,
largeScreenDriverSecureDay} from "@/api/largeScreen"
import checkCarImagePath from '@/utils/carPath'
import Speech from 'speak-tts'
import dayjs from 'dayjs'

export default {
    
    data() {
        return {
            //当前时间
            currentTime: '',
            //当前时间计时器
            currentTimer: '',
            //页面刷新计时器
            requestTimer: '',
            //滚动刷新计时器
            scrollTimer: '',
            //安全行驶天数
            secureDayNumber:'',
            //值班人员数据
            onDutyList:[],
            //值班人员数量
            onDutyNumber:'0',
            //已出车数据
            overDepartureList:[],
            //已出车数数量
            overDepartureNumber:'0',
            //休假请假人员
            vacationLeaveList:[],
            //休假请假人员数量
            vacationLeaveNumber:'0',
            //待出车数据
            waitDepartureList:[],
            //待出车数量
            waitDepartureNumber:'0',
            //滚动屏数据
            scrollList:[],
            //滚动屏参数
            classOption: {
                step: 0.2
            },
            //当前播放的语音角标
            currentMsgIndex:0,
            //是否全屏
            showFullScreen:false,
            //是否开启声音
            showVoice:true,
            //车辆图片
            checkCarImagePath,
            //滚动屏接口参数
            scrollFlag:'init',
            //语音播报对象
            speech: null,
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
        //初始化语音播报对象
        this.speechInit() 
    },
    created() {
        // this.scrollFlag = 'init'
        this.resizeScreen();

        this.currentTimer = setInterval(() => {
            this.currentTime = this.parseTime(new Date().getTime(),'{y}-{m}-{d} {h}:{i}')
        }, 1000);
        this.requestTimer = setInterval(() => {
            this.getPageRequest();
        }, 300000);
        this.scrollTimer = setInterval(() => {
            this.getScrollList();
        }, 60000);
        
        this.getPageRequest();
        this.getScrollList();
    },
    beforeDestroy() {
        clearInterval(this.currentTimer);
        clearInterval(this.requestTimer);
        clearInterval(this.scrollTimer);
        this.currentTimer = null;
        this.requestTimer = null;
        this.scrollTimer = null;
        window.onresize = null;
        this.speech.cancel();
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
            this.getSecureDay();
            this.getOnDutyList();
            this.getOverDepartureList();
            this.getVacationLeaveList();
            this.getWaitDepartureList();
        },
        //获取安全行驶天数
        getSecureDay() {
            this.loading = true

            largeScreenDriverSecureDay().then(({message}) => {
                this.loading = false
                this.secureDayNumber = message;
              
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取值班人员列表
        getOnDutyList() {
            this.loading = true

            largeScreenDriverClass().then(({data}) => {
                this.loading = false;

                let dataList = this.clearNull(data)
                this.onDutyNumber = dataList.length;

                dataList.forEach((item) => {
                    if(item.carNumber){
                        item.carNumber = item.carNumber.split(',')[0];
                    }
                    if(item.carBrand){
                        item.carBrand = item.carBrand.split(',')[0];
                    }
                    if(item.carSeries){
                        item.carSeries = item.carSeries.split(',')[0];
                    }
                })
                this.onDutyList = this.encapsulationList(9,dataList);
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取已出车数据
        getOverDepartureList() {
            this.loading = true

            let params = {
                drivingFlag: '1',
            }
            largeScreenDriverRequest(params).then(({data}) => {
                this.loading = false
                this.overDepartureNumber = data.length;

                data.forEach((item) => {
                    item.fromAddr = item.fromAddr.split(' ')[1];
                    item.toAddr = item.toAddr.split(' ')[1];
                })
                this.overDepartureList = this.encapsulationList(10,data);
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取请假休假人员
        getVacationLeaveList() {
            this.loading = true

            largeScreenDriverLeave().then(({data}) => {
                this.loading = false
            
                this.vacationLeaveNumber = data.length;
                data.forEach((item) => {
                    if(item.carNumber){
                        item.carNumber = item.carNumber.split(',')[0];
                    }
                    if(item.carBrand){
                        item.carBrand = item.carBrand.split(',')[0];
                    }
                    if(item.carSeries){
                        item.carSeries = item.carSeries.split(',')[0];
                    }
                })
                this.vacationLeaveList = this.encapsulationList(4,data);
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
        //获取滚动屏数据
        getScrollList(){
            this.loading = true

            let params = {
                flag:this.scrollFlag,
            }
            largeScreenDriverMsg(params).then(({data}) => {
                this.loading = false;
                this.scrollFlag = data.flag;

                this.scrollList = this.initScrollList([...this.scrollList,...data.data])
                this.speakTtsSpeech(data.data);
            }).catch((err) => {
                this.loading = false
            })
        },
        //去掉5分钟以外的数据
        initScrollList(dataList){
            let tempArr = [];
            let nowTime = dayjs();

            dataList.forEach((item) => {
                let targetTime = dayjs(item.dateStr);
                // 计算时间差（单位：毫秒）
                let diff = nowTime.diff(targetTime);
                console.log(diff)
                // 判断时间差是否小于5分钟
                if(diff < 300000){
                    tempArr.push(item)
                }
            })
            return tempArr;
        },
        //去掉null数据
        clearNull(dataList){
            let tempArr = [];

            dataList.forEach((item) => {
                if(item !== null){
                    tempArr.push(item);
                }
            })
            return tempArr;
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
        //全屏点击
        fullScreenClick(){
            const element = document.getElementById('container_max');
            if(screenfull.isEnabled){
                screenfull.toggle(element)
            }else{
                this.$modal.msgWarning('当前设备不支持全屏模式!')
            }
        },
        //判断滚动人员名称
        checkDriver(item){
            return item.largeMsg.split(" ")[0];
        },
        //判断滚动信息
        checkMsg(item){
             return item.largeMsg.split(" ")[1];
        },
        //声音开关点击
        voiceToggleClick(){
            this.showVoice = !this.showVoice;

            if(!this.showVoice){
                this.paused();
            }else{
                this.goahead();
            }
        },
        //初始化语音播放
        speechInit(){
            this.speech = new Speech()  
            this.speech.setLanguage('zh-CN')
            this.speech.init().then(()=>{

            })
        },
        //播放函数
        speakTtsSpeech(voiceData){
            for (let i = 0; i < voiceData.length; i++) {
                this.speech.speak({
                    text: voiceData[i].largeMsg,// 播放的文本内容
                    listeners: {
                        // 开始播放
                        onstart: () => { console.log("Start utterance")},
                        // 判断播放是否完毕
                        onend: () => { console.log("End utterance")},
                        // 恢复播放
                        onresume: () => { console.log("Resume utterance") },
                    },
                }).then(()=>{
                    console.log("读取成功")
                })
            }
        },
        //暂停
        paused() {
            this.speech.pause();
        },
        //从暂停处继续播放
        goahead() {
            this.speech.resume();
        },
    },
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
        background: url('/static/driver-board-top-bg.png') no-repeat center top;
        background-size: contain;

        .top-left-container {
            height: 100%;
            margin-left: 0.8rem;
            color: #ffffff;
            float: left;
            display: flex;
            align-items: center;

            & span:nth-child(1){
                font-size: 0.14rem;
            }
            & span:nth-child(2){
                font-size: 0.22rem;
                font-family: 'LcdD';
                margin-left: 0.05rem;
                margin-right: 0.05rem;
            }
            & span:nth-child(3){
                font-size: 0.14rem;
            }
        }
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

        .on-duty {
            width: 3.34rem;
            height: calc(100% - 0.7rem);
            background-image: url("/static/driver-board-middle-left-bg.webp");
            background-size: 3.34rem 100%;
            background-repeat: no-repeat;

            .title-container {
                height: 0.56rem;
                background-image: url("/static/driver-board-on-duty-title-bg.webp");
                background-size: contain;
                background-repeat: no-repeat;
                display: flex;

                & span:nth-child(1){
                    font-size: 0.14rem;
                    color: #c2fe66;
                    font-family: 'LcdD';
                    margin-left: 1.75rem;
                    margin-top: 0.27rem;
                }
                & span:nth-child(2){
                    font-size: 0.14rem;
                    color: #c2fe66;
                    margin-top: 0.25rem;
                    margin-left: 0.05rem;
                }
            }
            .on-duty-container {
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

            .over-departure {
                width: 11.26rem;
                height: 5.72rem;
                background-image: url("/static/driver-board-over-departure-bg.webp");
                background-size: 11.26rem 100%;
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
                ::v-deep .el-carousel__button {
                    position: relative;
                    top: 5px;
                }
                .title-container {
                    margin-top: 0.16rem;
                    margin-left: 0.23rem;
                    height: 0.33rem;
                    display: flex;

                    img {
                        width: 1.23rem;
                        height: 0.33rem;
                    }
                    & span:nth-child(2){
                        font-size: 0.14rem;
                        color: #c2fe66;
                        font-family: 'LcdD';
                        margin-top: 0.09rem;
                        margin-left: 0.1rem;
                    }
                    & span:nth-child(3){
                        font-size: 0.14rem;
                        color: #c2fe66;
                        margin-top: 0.09rem;
                        margin-left: 0.05rem;
                    }
                }
                .over-departure-container {
                    height: calc(100% - 0.56rem);

                    ul {
                        list-style: none;
                        margin: 0;
                        padding: 0;
                        margin-top: 0.24rem;

                        li {
                            width: 5.2rem;
                            height: 0.74rem;
                            margin-bottom: 0.19rem;
                            margin-left: 0.32rem;
                            float: left;
                            background-image: url("/static/driver-board-over-departure-li-bg.webp");
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
                                    margin-left: 0.12rem;
                                    display: flex;
                                    flex-direction: column;

                                    .dirver-name {
                                        font-size: 0.16rem;
                                        color: #ffffff;
                                        font-weight: 600;
                                    }
                                    .car-info {
                                        margin-top: 0.03rem;

                                        span {
                                            font-size: 0.12rem;
                                            color: #b8ffe7;
                                            float: left;
                                            margin-bottom: 0.03rem;
                                            position: relative;
                                        }
                                        & span:nth-child(1n){
                                            width: 40%;
                                        }
                                        & span:nth-child(2n){
                                            width: 60%;
                                        }
                                        & span:nth-child(2n)::after{
                                            content: "";
                                            width: 0.06rem;
                                            height: 0.06rem;
                                            background-color: #88fd1b;
                                            border-radius: 50%;
                                            position: absolute;
                                            left: -0.1rem;
                                            top: 0.05rem
                                        }
                                        & span:nth-child(4n)::after{
                                            content: "";
                                            width: 0.06rem;
                                            height: 0.06rem;
                                            background-color: #ad70ff;
                                            border-radius: 50%;
                                            position: absolute;
                                            left: -0.1rem;
                                            top: 0.05rem
                                        }
                                    }
                                }
                            }
                        }
                        & li:nth-child(2n){
                            margin-left: 0.42rem;
                        }
                    }
                }
            }   
            .vacation-leave {
                width: 11.26rem;
                height: 1.87rem;
                margin-top: 0.16rem;
                background-image: url("/static/driver-board-vacation-leave-bg.webp");
                background-size: 11.26rem 100%;
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
                ::v-deep .el-carousel__button {
                    position: relative;
                    top: 5px;
                }
                .title-container {
                    margin-top: 0.16rem;
                    margin-left: 0.22rem;
                    height: 0.33rem;
                    display: flex;

                    img {
                        width: 1.61rem;
                        height: 0.33rem;
                    }
                    & span:nth-child(2){
                        font-size: 0.14rem;
                        color: #c2fe66;
                        font-family: 'LcdD';
                        margin-top: 0.09rem;
                        margin-left: 0.1rem;
                    }
                    & span:nth-child(3){
                        font-size: 0.14rem;
                        color: #c2fe66;
                        margin-top: 0.09rem;
                        margin-left: 0.05rem;
                    }
                }
                .vacation-leave-container {
                    height: calc(100% - 0.56rem);

                    ul {
                        list-style: none;
                        margin: 0;
                        padding: 0;
                        margin-top: 0.18rem;

                        li {
                            width: 2.54rem;
                            height: 0.74rem;
                            margin-left: 0.2rem;
                            float: left;
                            background-image: url("/static/driver-board-vacation-leave-li-bg.webp");
                            background-size: contain;
                            background-repeat: no-repeat;

                            .li-item {
                                display: flex;
                                width: 100%;
                                height: 100%;

                                img {
                                    width: 0.49rem;
                                    height: 0.49rem;
                                    margin-top: 0.12rem;
                                }
                                .li-info {
                                    margin-left: 0.12rem;
                                    display: flex;
                                    flex-direction: column;

                                    .dirver-name {
                                        margin-top: 0.14rem;
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
                        & li:nth-child(1){
                            margin-left: 0.32rem;
                        }
                    }
                }

            }
            .rolling-board {
                width: 11.26rem;
                height: 1.86rem;
                margin-top: 0.16rem;
                background-image: url("/static/driver-board-rolling-board-bg.webp");
                background-size: 11.26rem 100%;
                background-repeat: no-repeat;

                .seamless-warp {
                    height: calc(100% - 0.5rem);
                    overflow: hidden;
                    margin-top: 0.26rem;
                }
                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        display: flex;
                        font-size: 0.14rem;
                        margin-left: 0.37rem;
                        margin-bottom: 0.09rem;

                        & span:nth-child(1){
                            color: #c2fe66;
                            position: relative;
                            display: inline-block;
                            width: 0.6rem;

                            &::after {
                                content: "";
                                width: 0.05rem;
                                height: 0.05rem;
                                background-color: #88fd1b;
                                position: absolute;
                                left: -0.15rem;
                                top: 0.08rem;
                            }
                        }
                        & span:nth-child(2){
                            color: #ffffff;
                            margin-left: 0.1rem;
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
        height: 0.67rem;
        background: url('/static/driver-board-bottom-bg.webp') no-repeat;
        background-size: contain;

        & img:nth-child(1){
            width: 1.29rem;
            height: 0.35rem;
            margin-right: 0.14rem;
            margin-top: 0.09rem;
            float: right;

            &:hover {
                cursor: pointer;
            }
        }
        & img:nth-child(2){
            width: 0.45rem;
            height: 0.36rem;
            margin-right: 1.84rem;
            margin-top: 0.09rem;
            float: right;

            &:hover {
                cursor: pointer;
            }
        }
    }
}
</style>