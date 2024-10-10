<template>
    <div class="board-container" id="container_max">
        <!--顶部-->
        <div class="tip-container">
            <div class="left-container">
                <img src="/static/board/driver-board-logo.png" />
                <span>安全驾驶，从我做起，累计安全行驶</span>
                <span>{{secureDayNumber}}</span>
                <span>天</span>
            </div>
            <div class="right-container">
                <span>{{currentTime}}</span>
                <img src="/static/board/btn-full-screen.png" @click="fullScreenClick()"/>
                <img v-if="showVoice" src="/static/board/btn-sound-close.png" @click="voiceToggleClick()"/>
                <img v-else src="/static/board/btn-sound-open.png" @click="voiceToggleClick()"/>
            </div>
        </div>
        <div class="top-container">
            <!--通知信息-->
            <div class="message-container">
                <div class="title-container">
                    <img src="/static/board/message-title.png"/>
                </div>
                <div class="content-container">
                    <vue-seamless-scroll :data="scrollList" :class-option="classOption" class="seamless-warp">
                        <ul>
                            <li v-for="(item, index) in scrollList" :key="index">
                                <span :class="[item.largeMsg == currentMsg?'currentSepak': 'nomalSpeak']">{{checkDriver(item)}}</span>
                                <span>{{checkMsg(item)}}</span>
                            </li>
                        </ul>
                    </vue-seamless-scroll>
                </div>
            </div>
            <!--已出车-->
            <div class="over-container">
                <div class="title-container">
                    <img src="/static/board/over-title.png"/>
                    <span>{{overDepartureNumber}}</span>
                    <span>辆</span>
                </div>
                <div class="content-container">
                    <el-carousel trigger="click" :autoplay="true" :interval="interval" direction="vertical" >
                        <el-carousel-item v-for="(carouselItem,carouselIndex) in overDepartureList" :key="carouselIndex">
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
                    <!-- <img class="btn-next" src="/static/board/btn-next.png" />
                    <img class="btn-pre" src="/static/board/btn-pre.png" /> -->
                </div>
            </div>
        </div>
        <div class="middle-container">
            <!--待出车-->
            <div class="wait-container">
                <div class="title-container">
                    <img src="/static/board/wait-title.png"/>
                    <span>{{waitDepartureNumber}}</span>
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
                                    <span class="car-brand">{{item.carBrand}}{{item.carSeries}}</span>
                                </li>
                            </ul>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
        </div>
        <div class="bottom-container">
            <!--值班人员-->
            <div class="duty-container">
                <div class="title-container">
                    <img src="/static/board/duty-title.png"/>
                    <span>{{onDutyNumber}}</span>
                    <span>人</span>
                </div>
                <div class="content-container">
                    <el-carousel trigger="click" :autoplay="true" :interval="interval" direction="vertical" >
                        <el-carousel-item v-for="(carouselItem,carouselIndex) in onDutyList" :key="carouselIndex">
                            <ul>
                                <li v-for="(item,index) in carouselItem" :key="index">
                                    <div class="driver-img">
                                        <img :src="checkDriverPic(item.driverPic)" onerror="this.src='/static/board/user-default.webp'">
                                    </div>
                                    <span class="duty-name">{{item.driver}}</span>
                                    <span class="car-number">{{item.carNumber}}</span>
                                </li>
                            </ul>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <!--休假/请假-->
            <div class="leave-container">
                <div class="title-container">
                    <img src="/static/board/leave-title.png"/>
                    <span>{{vacationLeaveNumber}}</span>
                    <span>人</span>
                </div>
                <div class="content-container">
                    <el-carousel trigger="click" :autoplay="true" :interval="interval" direction="vertical" >
                        <el-carousel-item v-for="(carouselItem,carouselIndex) in vacationLeaveList" :key="carouselIndex">
                            <ul>
                                <li v-for="(item,index) in carouselItem" :key="index">
                                    <div class="driver-img">
                                        <img :src="checkDriverPic(item.driverPic)" onerror="this.src='/static/board/user-default.webp'">
                                    </div>
                                    <span class="duty-name">{{item.driverName}}</span>
                                    <span class="car-number">{{item.carNumber}}</span>
                                </li>
                            </ul>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
        </div>
        <div class="bottom-bg"></div>
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

let that;
export default {
    beforeCreate() {
        that = this
    },
    
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
            scrollList:[
                {
                    largeMsg: "张三 测试数据1"
                },
                {
                    largeMsg: "李四 测试数据1"
                },
                {
                    largeMsg: "王五 测试数据1"
                },
                {
                    largeMsg: "赵六 测试数据1"
                },
                {
                    largeMsg: "测试 测试数据1"
                },
            ],
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
            //轮播图间隔
            interval:15000,
            //当前播报的内容
            currentMsg: '',
        }
    },
    mounted() {
        // var that = this;
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
                this.onDutyList = this.encapsulationList(8,dataList);
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
                this.overDepartureList = this.encapsulationList(9,data);
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
                this.vacationLeaveList = this.encapsulationList(6,data);
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
                this.waitDepartureList = this.encapsulationList(10,data);
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

                // this.scrollList = this.initScrollList([...this.scrollList,...data.data])
                // this.speakTtsSpeech(data.data);
                this.speakTtsSpeech(this.scrollList);
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
                        onstart: () => { 
                            that.currentMsg = voiceData[i].largeMsg;
                        },
                        // 判断播放是否完毕
                        onend: () => { 
                            if(i == voiceData.length -1){
                                that.currentMsg = '';
                            }
                        },
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
    background:linear-gradient(180deg,#331a88 0%,#0b1556 100%);
    overflow: auto;

    .tip-container {
        width: 100%;
        height: 0.74rem;
        display: flex;
        justify-content: space-between;
        background: url('/static/board/title-bg.png') no-repeat center top;
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
            & span:nth-child(2){
                font-size: 0.14rem;
                color: #ffffff;
                margin-top: 0.33rem;
            }
            & span:nth-child(3){
                font-size: 0.24rem;
                font-family: 'LcdD';
                color: #ffffff;
                margin-left: 0.04rem;
                margin-right: 0.06rem;
                margin-top: 0.27rem;
            }
            & span:nth-child(4){
                font-size: 0.14rem;
                color: #ffffff;
                margin-top: 0.33rem;
            }
        }
        .right-container {
            display: flex;

            span {
                font-size: 0.2rem;
                color: #CEF2FF;
                font-family: 'LcdD';
                margin-top: 0.23rem;
                margin-right: 0.64rem;
            }
            & img:nth-child(2) {
                width: 0.44rem;
                height: 0.36rem;
                margin-right: 0.12rem;
                margin-top: 0.17rem;

                &:hover {
                    cursor: pointer;
                }
            }
            & img:nth-child(3) {
                width: 0.44rem;
                height: 0.36rem;
                margin-right: 0.24rem;
                margin-top: 0.17rem;

                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
    .top-container {
        width: 100%;
        height: 3.49rem;
        margin-top: 0.1rem;
        box-sizing: border-box;
        padding-left: 0.24rem;
        padding-right: 0.24rem;
        display: flex;
        justify-content: space-between;

        .message-container {
            width: 10.63rem;
            height: 3.49rem;
            background: url('/static/board/message-bg.png') no-repeat center;
            background-size: contain;
            margin-right: 0.16rem;

            .title-container {
                width: 100%;
                height: 0.54rem;
                display: flex;
                align-items: center;

                img {
                    width: 1.7rem;
                    height: 0.54rem;
                }
            }
            .content-container {
                width: 10.63rem;
                height: calc(100% - 0.54rem);
                padding-left: 0.15rem;
                padding-right: 0.44rem;
                margin-top: 0.2rem;
                box-sizing: border-box;
                position: relative;

                .seamless-warp {
                    height: calc(100% - 0.54rem);
                    overflow: hidden;
                }
                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        display: flex;
                        min-height: 0.44rem;
                        margin-bottom: 0.1rem;
                        background: linear-gradient(0deg, #1d94ff5b 0%, #001cb115 100%);

                        & span:nth-child(1){
                            color: #C2FF66;
                            position: relative;
                            display: inline-block;
                            font-size: 0.18rem;
                            width: 0.6rem;
                            margin-left: 0.47rem;
                        }
                        & span:nth-child(2){
                            color: #ffffff;
                            margin-left: 0.1rem;
                            font-size: 0.18rem;
                        }
                        .currentSepak::after{
                            content: "";
                            width: 0.17rem;
                            height: 0.15rem;
                            background: url('/static/board/icon-speak.png') no-repeat center;
                            background-size: contain;
                            position: absolute;
                            left: -0.25rem;
                            top: 0.05rem;
                        }
                        .nomalSpeak::after {
                            content: "";
                            width: 0.05rem;
                            height: 0.05rem;
                            background-color: #FFD942;
                            position: absolute;
                            left: -0.15rem;
                            top: 0.08rem;
                        }
                    }
                }
            }
        }
        .over-container {
            width: 7.93rem;
            height: 3.49rem;
            background: url('/static/board/over-bg.png') no-repeat center;
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
                padding-left: 0.4rem;
                position: relative;

                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        width: 2.17rem;
                        height: 0.72rem;
                        display: flex;
                        align-items: center;
                        float: left;
                        margin-right: 0.2rem;
                        margin-top: 0.15rem;
                        position: relative;
                        background: linear-gradient(270deg, #0c7f3a78 0%, #1a335680 49%, #1e1a5f78 100%);

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
    }
    .middle-container {
        width: 100%;
        height: 2.79rem;
        margin-top: 0.2rem;
        box-sizing: border-box;
        padding-left: 0.24rem;
        padding-right: 0.24rem;
      
        .wait-container {
            width: 100%;
            height: 100%;
            background: url('/static/board/wait-bg.png') no-repeat center;
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
                padding-left: 0.28rem;
                position: relative;

                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        width: 3.45rem;
                        height: 0.86rem;
                        display: flex;
                        align-items: center;
                        float: left;
                        margin-top: 0.15rem;
                        margin-right: 0.2rem;
                        position: relative;
                        background: url('/static/board/wait-item-bg.png') no-repeat center top;
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
                            top: 0.44rem;
                        }
                        .car-number {
                            color: #FFFFFF;
                            font-size: 0.14rem;
                            position: absolute;
                            left: 1.65rem;
                            top: 0.46rem;
                        }
                        .car-brand {
                            color: #FFFFFF;
                            font-size: 0.14rem;
                            position: absolute;
                            left: 2.55rem;
                            top: 0.46rem;
                        }
                    }
                }
            }
        }
    }
    .bottom-container {
        width: 100%;
        height: 2.89rem;
        margin-top: 0.2rem;
        box-sizing: border-box;
        padding-left: 0.24rem;
        padding-right: 0.24rem;
        display: flex;
        justify-content: space-between;

        .duty-container {
            width: 10.63rem;
            height: 2.89rem;
            background: url('/static/board/duty-bg.png') no-repeat center;
            background-size: contain;
            margin-right: 0.16rem;

            .title-container {
                width: 100%;
                height: 0.54rem;
                display: flex;
                align-items: center;

                img {
                    width: 1.7rem;
                    height: 0.54rem;
                }
                & span:nth-child(2){
                    font-size: 0.16rem;
                    color: #F1FFD1;
                    font-family: 'LcdD';
                    margin-left: 0.04rem;
                    margin-top: 0.1rem;
                }
                & span:nth-child(3){
                    font-size: 0.16rem;
                    color: #F1FFD1;
                    margin-left: 0.05rem;
                    margin-top: 0.08rem;
                }
            }
            .content-container {
                width: 100%;
                height: calc(100% - 0.54rem);
                box-sizing: border-box;
                padding-left: 0.36rem;
                position: relative;

                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        width: 2.31rem;
                        height: 0.82rem;
                        display: flex;
                        align-items: center;
                        float: left;
                        margin-right: 0.16rem;
                        margin-top: 0.2rem;
                        position: relative;
                        background: url('/static/board/duty-item-bg.png') no-repeat center top;
                        background-size: contain;

                        .driver-img {
                            width: 0.62rem;
                            height: 0.62rem;
                            display: flex;
                            align-items: center;
                            background: url('/static/board/duty-border.png') no-repeat center top;
                            background-size: contain;

                            img {
                                width: 0.52rem;
                                height: 0.52rem;
                                margin: 0 auto;
                            }
                        }
                        .duty-name {
                            color: #ffffff;
                            font-size: 0.18rem;
                            position: absolute;
                            left: 0.75rem;
                            top: 0.16rem;
                        }
                        .car-number {
                            color: #FFFFFF;
                            font-size: 0.14rem;
                            position: absolute;
                            left: 0.75rem;
                            top: 0.46rem;
                        }
                    }
                }
            }
        }
        .leave-container {
            width: 7.93rem;
            height: 2.89rem;
            background: url('/static/board/leave-bg.png') no-repeat center;
            background-size: contain;

            .title-container {
                width: 100%;
                height: 0.54rem;
                display: flex;
                align-items: center;

                img {
                    width: 1.7rem;
                    height: 0.54rem;
                }
                & span:nth-child(2){
                    font-size: 0.16rem;
                    color: #F1FFD1;
                    font-family: 'LcdD';
                    margin-left: 0.04rem;
                    margin-top: 0.1rem;
                }
                & span:nth-child(3){
                    font-size: 0.16rem;
                    color: #F1FFD1;
                    margin-left: 0.05rem;
                    margin-top: 0.08rem;
                }
            }
            .content-container {
                width: 100%;
                height: calc(100% - 0.54rem);
                box-sizing: border-box;
                padding-left: 0.36rem;
                position: relative;

                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        width: 2.25rem;
                        height: 0.82rem;
                        display: flex;
                        align-items: center;
                        float: left;
                        margin-right: 0.16rem;
                        margin-top: 0.2rem;
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
                        .duty-name {
                            color: #ffffff;
                            font-size: 0.18rem;
                            position: absolute;
                            left: 0.75rem;
                            top: 0.16rem;
                        }
                        .car-number {
                            color: #FFFFFF;
                            font-size: 0.14rem;
                            position: absolute;
                            left: 0.75rem;
                            top: 0.46rem;
                        }
                    }
                }
            }
        }
    }
    .bottom-bg {
        width: 100%;
        height: 0.39rem;
       
        background: url('/static/board/bottom-bg.png') no-repeat center top;
        background-size: contain;
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