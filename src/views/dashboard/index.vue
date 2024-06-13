<template>
  <!-- <div class="app-container home">
     <img class="welcome-img" style="width: 350px;position: absolute;top: calc(50% - 175px);left: calc(50% - 175px);" src="@/assets/images/welcome.png" alt="404">
      <div class="welcome">欢迎使用公务用车管理信息系统</div>
  </div> -->
    <div class="app-container">
        <!--常用菜单-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_log_car.png"/>
                <span>常用菜单</span>
                <img src="/static/icon_index_add.png"/>
                <span @click="handleAddMenu()">新增常用菜单</span>
            </div>
            <div>
                <el-tag
                  v-for="(tag,index) in defaultMenuOptions"
                  :key="tag.id"
                  closable
                  effect="dark"
                  @click='handleTagClick(tag,index)'
                  @close='handleTagClose(tag,index)'>
                  {{tag.menuName}}
                </el-tag>
            </div>
            <div class="title-empty" v-if="defaultMenuOptions.length === 0">
                <span>暂无数据</span>
            </div>
        </div>
        <!--待办事项/系统帮助-->
        <div class="top-container">
            <div class="item-content-container top-container-left">
                <div class="title-container">
                    <img src="/static/icon_index_wait.png"/>
                    <span>待办事项</span>
                </div>
                <div class="wait-table-container">
                    <el-table ref="eltableWait" :data="waitOptions" height="260px" :cell-style="cellStyle" @row-click="handleTableClick">
                        <el-table-column label="任务类型" align="left" width="80px" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <i></i>
                                <span class="span-type-name">{{waitOptions[scope.$index].typeName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="任务名称" prop="typeNameDesc" align="left" width="80px" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="单据号" prop="reqNo" align="left" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="提交部门" prop="deptName" align="left" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="提交人" prop="handleUserName" align="left" width="80px" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="乘车人" prop="userName" align="left" width="80px" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="描述" prop="statusName" align="left" :show-overflow-tooltip="true"></el-table-column>
                    </el-table>
                    <pagination
                        v-show="total > 0"
                        :total="total"
                        :page.sync="listQuery.pageNum"
                        :limit.sync="listQuery.pageSize"
                        :layout="'total,prev,pager,next'"
                        :isSamll="true"
                        @pagination="getGcywVehicleRequestPendding"/>
                </div>
            </div>
            <div class="item-content-container top-container-right">
                <div class="title-container">
                    <img src="/static/icon_index_help.png"/>
                    <span>系统帮助</span>
                </div>
                <div class="help-container">
                    <div class="lottieBg">
                        <lottie
                            :options="defaultOptions"
                            :width="314"
                            :height="212"/>
                    </div>
                    <ul>
                        <li v-for="(item,index) in documentOpitons" :key="index">
                            <span>{{item.docName}}</span>
                            <a href="#" @click="handlePreviewClick(item)">预览</a>
                            <a href="#" @click="handleDownloadClick(item)">下载</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--用车统计-->
        <div class="item-content-container echartsItem" v-if="showRequest">
            <div class="title-container">
                <img src="/static/icon_index_wait.png"/>
                <span>我的用车统计</span>

                <ul class="ul-tip">
                    <li>
                        <i class="i-28efa8"></i>
                        <span>完成用车单量</span>
                    </li>
                    <li>
                        <i class="i-25c4ff"></i>
                        <span>申请用车单量</span>
                    </li>
                    <li>
                        <i class="i-fed12e"></i>
                        <span>评价订单量</span>
                    </li>
                </ul>
                <el-select v-model="vehicleDate" size="mini" class="select-date">
                    <el-option v-for="(item,index) in dateOptions"
                        :key="index"
                        :label="item.value"
                        :value="item.code"
                        @click.native="handleVehicleDateChange(item)">
                    </el-option>
                </el-select>
            </div>
            <div id="vehicleChart" class="echartsItem-line"></div>
        </div>
        <!--审核统计-->
        <div class="item-content-container echartsItem" v-if="showActiviti">
            <div class="title-container">
                <img src="/static/icon_index_wait.png"/>
                <span>我的审核统计</span>

                <ul class="ul-tip">
                    <li>
                        <i class="i-2533e5"></i>
                        <span>审核订单量</span>
                    </li>
                    <li>
                        <i class="i-28efa8"></i>
                        <span>通过订单量</span>
                    </li>
                    <li>
                        <i class="i-icon-img"></i>
                        <span>通过率</span>
                    </li>
                </ul>
                <el-select v-model="activitiDate" size="mini" class="select-date">
                    <el-option v-for="(item,index) in dateOptions"
                        :key="index"
                        :label="item.value"
                        :value="item.code"
                        @click.native="handleActivitiDateChange(item)">
                    </el-option>
                </el-select>
            </div>
            <div id="activitiChart" class="echartsItem-line"></div>
        </div>
        <!--调度统计-->
        <div class="item-content-container echartsItem" v-if="showDispatch">
            <div class="title-container">
                <img src="/static/icon_index_wait.png"/>
                <span>我的调度统计</span>

                <ul class="ul-tip">
                    <li>
                        <i class="i-4e27f4"></i>
                        <span>派车单量</span>
                    </li>
                    <li>
                        <i class="i-159cff"></i>
                        <span>人工派单量</span>
                    </li>
                    <li>
                        <i class="i-fbb725"></i>
                        <span>改派单量</span>
                    </li>
                </ul>
                <el-select v-model="dispatchDate" size="mini" class="select-date">
                    <el-option v-for="(item,index) in dateOptions"
                        :key="index"
                        :label="item.value"
                        :value="item.code"
                        @click.native="handleDispatchDateChange(item)">
                    </el-option>
                </el-select>
            </div>
            <div id="dispatchChart" class="echartsItem-line"></div>
        </div>
        <!--出车统计-->
        <div class="item-content-container echartsItem" v-if="showDriver">
            <div class="title-container">
                <img src="/static/icon_index_wait.png"/>
                <span>我的出车统计</span>

                <ul class="ul-tip">
                    <li>
                        <i class="i-299cff"></i>
                        <span>出车次数</span>
                    </li>
                    <li>
                        <i class="i-icon-img"></i>
                        <span>出车公里数</span>
                    </li>
                </ul>
                <el-select v-model="driverDate" size="mini" class="select-date">
                    <el-option v-for="(item,index) in dateOptions"
                        :key="index"
                        :label="item.value"
                        :value="item.code"
                        @click.native="handleDriverDateChange(item)">
                    </el-option>
                </el-select>
            </div>
            <div id="driverChart" class="echartsItem-line"></div>
        </div>
        <!--mp4-->
         <video-preview ref="videoPreview"></video-preview>
         <!--常用菜单-->
        <common-menu ref="commonMenu" @commonMenuSuccess='commonMenuSuccess'></common-menu>
    </div>
</template>
<script>
import animationData from '@/assets/lottie/suvRunning.json'
import {gcywVehicleRequestPendding,
documentList,
gcywVehicleRequestHomeInfo,
usemenuList,
usemenuDelete} from '@/api/home.js'
import { axiosDownloadExcel } from '@/api/download'
import videoPreview from './components/videoPreview'
import commonMenu from './components/commonMenu.vue';
import echarts from "echarts";
import dayjs from 'dayjs'
let quarterOfYear = require('dayjs/plugin/quarterOfYear')//day.js季度插件
dayjs.extend(quarterOfYear)

export default {
    name: "Index",
    components: { videoPreview,commonMenu },
  
    data() {
        return {
            //常用菜单数据
            defaultMenuOptions: [],
            listQuery: {
                pageNum: 1,
                pageSize: 10,
            },
            total:0,
            //待办数据
            waitOptions:[],
            //系统帮助数据
            documentOpitons:[],
            // //lottie动画
            defaultOptions: {
                animationData: animationData,
                renderer: 'svg',
                loop: true,
                autoplay: true
            },  
            //pdf预览地址
            videoUrl:'',
            //开始年月
            startMonth:'',
            //结束年月
            endMonth:'',
            showRequest:true,
            showActiviti:true,
            showDispatch:true,
            showDriver:true,

            //起止时间数据
            dateOptions:[
                {
                    code:'1',
                    value:'最近一年',
                },
                {
                    code:'2',
                    value:'最近半年',
                },
                {
                    code:'3',
                    value:'最近三个月',
                },
            ],

            //用车统计起止月份
            vehicleDate:'1',
            //审核统计起止月份
            activitiDate:'1',
            //调度统计起止月份
            dispatchDate:'1',
            //出车统计起止月份
            driverDate:'1',
        };
    },
    mounted() {
        
    },
    created() {
        //修改Lottie图片路径
        animationData.assets.forEach((item) => {
            item.u = ''
            if (item.w && item.h) {
                item.p = require(`@/assets/lottie/images/${item.p}`)
            }
        })

        this.startMonth = dayjs().startOf('year').format('YYYY-MM');
        this.endMonth = dayjs().endOf('year').format('YYYY-MM');

        this.getGcywVehicleRequestPendding();
        this.getMenuInfo();
        this.getDocumentList();
        this.getChartInfo('');
    },
    methods: {
        //获取待办事项
        getGcywVehicleRequestPendding(){
            this.loading = true;
            
            gcywVehicleRequestPendding(Object.assign({}, this.listQuery)).then(({data}) => {
                this.loading = false;
                this.waitOptions = data.list;
                this.total = data.total;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取常用菜单
        getMenuInfo(){
            this.loading = true;
            
            usemenuList().then(({data}) => {
                this.loading = false;
                this.defaultMenuOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //删除常用菜单
        removeMenuInfo(item){
            this.loading = true;

            let paramsArr = [];

            let obj = {
                id:item.id,
            }
            paramsArr.push(obj);

            usemenuDelete(paramsArr).then(({message}) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.getMenuInfo();
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取系统帮助
        getDocumentList(){
            this.loading = true;
            
            documentList().then(({data}) => {
                this.loading = false;
                this.documentOpitons = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取图标数据
        getChartInfo(homeType){
            this.loading = true;

            let params = {
                startMonth: this.startMonth,
                endMonth: this.endMonth,
                homeType:homeType,
            }
            
            gcywVehicleRequestHomeInfo(params).then(({data}) => {
                this.loading = false;
                
                if(!data.request){
                    this.showRequest = false;
                }else{
                    this.showRequest = true;
                    this.$nextTick(() => {
                        this.initRequestOptions(data.request);
                    })
                }
                if(!data.activiti){
                    this.showActiviti = false;
                }else{
                    this.showActiviti = true;
                    this.$nextTick(() => {
                        this.initActivitiOptions(data.activiti);
                    })
                }
                if(!data.dispatch){
                    this.showDispatch = false;
                }else{
                    this.showDispatch = true;
                    this.$nextTick(() => {
                        this.initDispatchOptions(data.dispatch);
                    })
                }
                if(!data.driver){
                    this.showDriver = false;
                }else{
                    this.showDriver = true;
                    this.$nextTick(() => {
                        this.initDriverOptions(data.driver);
                    })
                }
            }).catch((err) => {
                this.loading = false;
            })
        },
        //初始化用车统计图表
        initRequestOptions(dataList){
            if(!dataList){
                return
            }
            //X轴坐标值
            let lineItemListX = [];

            for (let i = 0; i < dataList.length; i++) {
                lineItemListX.push(dataList[i].yearMonth);
            }
            //Y轴坐标值
            let lineFinishCountListY = [];
            let lineRequestCountListY = [];
            let lineEvaCountListY = [];

            for (let i = 0; i < dataList.length; i++) {
                lineFinishCountListY.push(dataList[i].finishCount);
                lineRequestCountListY.push(dataList[i].requestCount);
                lineEvaCountListY.push(dataList[i].evaCount);
            }
            let option = {
                grid: {
                    x:25, 
                    y:25, 
                    x2:30, 
                    y2:0, 
                    containLabel: true
                },
                xAxis: {
                    data: lineItemListX,
                },
                yAxis: {
                    
                },
                series:[
                    {
                        type:'bar',
                        data:lineFinishCountListY,
                        label: {
                            show: true,
                            position: "top"
                        },
                        barWidth:'10px',
                        barGap: "80%", // 两个柱子之间的距离相对于柱条宽度的百分比;
                        itemStyle: {
                            normal: {
                                color:'#28efa8',
                                barBorderRadius:[2, 2, 2, 2]
                            }
                        }
                    },
                    {
                        type:'bar',
                        data:lineRequestCountListY,
                        label: {
                            show: true,
                            position: "top"
                        },
                        barWidth:'10px',
                        barGap: "80%",
                        itemStyle: {
                            normal: {
                                color:'#25c4ff',
                                barBorderRadius:[2, 2, 2, 2]
                            }
                        }
                    },
                    {
                        type:'bar',
                        data:lineEvaCountListY,
                        label: {
                            show: true,
                            position: "top"
                        },
                        barWidth:'10px',
                        barGap: "80%",
                        itemStyle: {
                            normal: {
                                color:'#fed12e',
                                barBorderRadius:[2, 2, 2, 2]
                            }
                        }
                    }
                ]
            }
            let vehicleChart = echarts.init(document.getElementById("vehicleChart"));
            vehicleChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                vehicleChart.resize();
            });
        },
        //初始化审核统计图表
        initActivitiOptions(dataList){
            if(!dataList){
                return
            }
            //X轴坐标值
            let lineItemListX = [];

            for (let i = 0; i < dataList.length; i++) {
                lineItemListX.push(dataList[i].yearMonth);
            }
            //Y轴坐标值
            let lineActivitiCountListY = [];
            let lineCompleteCountListY = [];
            let linePassingRateListY = [];

            for (let i = 0; i < dataList.length; i++) {
                lineActivitiCountListY.push(dataList[i].activitiCount);
                lineCompleteCountListY.push(dataList[i].completeCount);
                linePassingRateListY.push(this.calculatePassRate(dataList[i]));
            }
            let option = {
                grid: {
                    x:25, 
                    y:25, 
                    x2:30, 
                    y2:0, 
                    containLabel: true
                },
                xAxis: {
                    data: lineItemListX,
                },
                yAxis: {

                },
                series:[
                    {
                        type:'bar',
                        data:lineActivitiCountListY,
                        label: {
                            show: true,
                            position: "top"
                        },
                        barWidth:'10px',
                        barGap: "80%", // 两个柱子之间的距离相对于柱条宽度的百分比;
                        itemStyle: {
                            normal: {
                                color:'#2533e5',
                                barBorderRadius:[2, 2, 2, 2]
                            }
                        }
                    },
                    {
                        type:'bar',
                        data:lineCompleteCountListY,
                        label: {
                            show: true,
                            position: "top"
                        },
                        barWidth:'10px',
                        barGap: "80%",
                        itemStyle: {
                            normal: {
                                color:'#28efa8',
                                barBorderRadius:[2, 2, 2, 2]
                            }
                        }
                    },
                    {
                        type: "line", //折线
                        data: linePassingRateListY,
                        label: {
                            show: true,
                            position: "top",
                            formatter:"{c}%",
                        },
                        smooth: false, //是否是弯曲的折线
                        itemStyle: {
                            normal: {
                                color: "#feb11d"
                            }
                        },
                    }
                ]
            }
            let activitiChart = echarts.init(document.getElementById("activitiChart"));
            activitiChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                activitiChart.resize();
            });
        },
        //初始化调度统计图表
        initDispatchOptions(dataList){
            if(!dataList){
                return
            }
            //X轴坐标值
            let lineItemListX = [];

            for (let i = 0; i < dataList.length; i++) {
                lineItemListX.push(dataList[i].yearMonth);
            }
            //Y轴坐标值
            let lineDispatchCountListY = [];
            let linePedispatchCountListY = [];
            let lineRedispatchCountListY = [];

            for (let i = 0; i < dataList.length; i++) {
                lineDispatchCountListY.push(dataList[i].dispatchCount);
                linePedispatchCountListY.push(dataList[i].pedispatchCount);
                lineRedispatchCountListY.push(dataList[i].redispatchCount);
            }
            let option = {
                grid: {
                    x:25, 
                    y:25, 
                    x2:30, 
                    y2:0, 
                    containLabel: true
                },
                xAxis: {
                    data: lineItemListX,
                },
                yAxis: {
                    
                },
                series:[
                    {
                        type:'bar',
                        data:lineDispatchCountListY,
                        stack: 'dispatch',
                        label: {
                            show: true,
                            position: "inside"
                        },
                        barWidth:'30px',
                        barCategoryGap:'20px',
                        itemStyle: {
                            normal: {
                                color:'#4e27f4',
                                borderColor:'#fff',
                                borderWidth: 2,
                                barBorderRadius:[2, 2, 2, 2]
                            }
                        }
                    },
                    {
                        type:'bar',
                        data:linePedispatchCountListY,
                        stack: 'dispatch',
                        label: {
                            show: true,
                            position: "inside"
                        },
                        barWidth:'30px',
                        barCategoryGap:'20px',
                        itemStyle: {
                            normal: {
                                color:'#159cff',
                                borderColor:'#fff',
                                borderWidth: 2,
                                barBorderRadius:[2, 2, 2, 2]
                            }
                        }
                    },
                    {
                        type:'bar',
                        data:lineRedispatchCountListY,
                        stack: 'dispatch',
                        label: {
                            show: true,
                            position: "inside"
                        },
                        barWidth:'30px',
                        barCategoryGap:'20px',
                        itemStyle: {
                            normal: {
                                color:'#fbb725',
                                borderColor:'#fff',
                                borderWidth: 2,
                                barBorderRadius:[2, 2, 2, 2]
                            }
                        }
                    }
                ]
            }
            let dispatchChart = echarts.init(document.getElementById("dispatchChart"));
            dispatchChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                dispatchChart.resize();
            });
        },
        //初始化出车统计图表
        initDriverOptions(dataList){
            if(!dataList){
                return
            }
            //X轴坐标值
            let lineItemListX = [];

            for (let i = 0; i < dataList.length; i++) {
                lineItemListX.push(dataList[i].yearMonth);
            }
            //Y轴坐标值
            let lineDrivingCountListY = [];
            let lineMilesCountListY = [];

            for (let i = 0; i < dataList.length; i++) {
                lineDrivingCountListY.push(dataList[i].drivingCount);
                lineMilesCountListY.push(dataList[i].drivingMiles);
            }
            let option = {
                grid: {
                    x:25, 
                    y:25, 
                    x2:30, 
                    y2:0, 
                    containLabel: true
                },
                xAxis: {
                    data: lineItemListX,
                },
                yAxis: {

                },
                series:[
                    {
                        type:'bar',
                        data:lineDrivingCountListY,
                        label: {
                            show: true,
                            position: "top"
                        },
                        barWidth:'30px',
                        barGap: "80%", // 两个柱子之间的距离相对于柱条宽度的百分比;
                        itemStyle: {
                            normal: {
                                color:'#299cff',
                                barBorderRadius:[2, 2, 2, 2]
                            }
                        }
                    },
                    {
                        type: "line", //折线
                        data: lineMilesCountListY,
                        label: {
                            show: true,
                            position: "top",
                            formatter:"{c}",
                        },
                        smooth: false, //是否是弯曲的折线
                        itemStyle: {
                            normal: {
                                color: "#feb11d"
                            }
                        },
                    }
                ]
            }
            let driverChart = echarts.init(document.getElementById("driverChart"));
            driverChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                driverChart.resize();
            });
        },
        //计算通过率
        calculatePassRate(item){
            if(item.activitiCount =='0'){
                return 0;
            }
            return parseFloat(item.completeCount / item.activitiCount).toFixed(2) * 100;
        },
        //常用菜单点击
        handleTagClick(tag,index){
           this.$router.push({name: tag.menuUrl})
        },
        //新增常用菜单
        handleAddMenu(){
            this.$refs.commonMenu.init(this.defaultMenuOptions);
        },
        //常用菜单添加回调
        commonMenuSuccess(){
            this.getMenuInfo();
        },
        //常用菜单删除
        handleTagClose(tag,index){
            this.$modal.confirm("是否删除所选菜单?").then(()=>{
                this.removeMenuInfo(tag);
            })
        },
        //待办条目点击
        handleTableClick(row, column, event){
            let name = '';
            let params = {
                reqNo: row.reqNo,
            }
           

            if(row.statusName2 !==null){    //司机工作台
                name = 'driverWorkBench';
            }
            if(row.status == 10){        //我的用车单
                name = 'myCar';
            }
            if(row.status == 11){        //我的用车单
                name = 'myCar';
            }
            if(row.status == 2){         //用车审批
                name = 'examineCar';
            }
            if(row.status == 4){         //工作台
                name = 'workspace'
            }
            this.$router.push({
                name: name,
                params,
            })
        },
        //鼠标移入回调
        cellStyle(){
            return 'cursor:pointer'
        },
        //下载点击
        handleDownloadClick(item){
            let path = process.env.VUE_APP_AUTH_SERVER + '/minio/download/';
            let params = {
                fileName: item.fileName,
            }
            axiosDownloadExcel(path,params);
        },
        //预览点击
        handlePreviewClick(item){
            if(item.fileName.includes('.pdf')){
                let path = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + '/minio/inline?fileName='+ item.fileName;
                window.open(path,'_blank');
            }else if(item.fileName.includes('.mp4')){
                this.videoUrl = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + '/minio/inline2?fileName='+ item.fileName;
                this.$refs.videoPreview.init(this.videoUrl,item.fileName)
            }
        },
        //我的用车统计时间选择
        handleVehicleDateChange(item){
            this.checkDate(item)
            this.getChartInfo('request');
        },
        //我的审核统计时间选择
        handleActivitiDateChange(item){
            this.checkDate(item)
            this.getChartInfo('activiti');
        },
         //我的调度统计时间选择
        handleDispatchDateChange(item){
            this.checkDate(item)
            this.getChartInfo('dispatch');
        },
         //我的出车统计时间选择
        handleDriverDateChange(item){
            this.checkDate(item)
            this.getChartInfo('driver');
        },
        //设置时间
        checkDate(item){
            if('最近一年' === item.value){
                this.startMonth = dayjs().add(-12, 'month').startOf('month').format('YYYY-MM');
                this.endMonth = dayjs().add(0, 'month').endOf('month').format('YYYY-MM');
            }else if('最近半年' === item.value){
                this.startMonth = dayjs().add(-6, 'month').startOf('month').format('YYYY-MM');
                this.endMonth = dayjs().add(0, 'month').endOf('month').format('YYYY-MM');
            }else if('最近三个月' === item.value){
                this.startMonth = dayjs().add(-3, 'month').startOf('month').format('YYYY-MM');
                this.endMonth = dayjs().add(0, 'month').endOf('month').format('YYYY-MM');
            }
        },
    },
};
</script>

<style scoped lang="scss">
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
            & img:nth-child(3){
                width: 20px;
                height: 20x;
                margin-left: 20px;
            }
            & span:nth-child(4){
                cursor: pointer;
            }
        }
        .title-empty {
            font-size: 14px;
            margin-left: 10px;
            margin-top: 10px;
        }
    }
    .top-container {
        height: 360px;
        display: flex;

        .top-container-left {
            width: 65%;
            margin-right: 8px;
            margin-bottom: 0px;

            .wait-table-container {
                padding: 10px 10px 0px 10px;

                i {
                    display: inline-block;
                    margin-right: 3px;
                    width: 16px;
                    height: 16px;
                    position: absolute;
                    top: 9px;
                    background-size: cover;
                    background-position: center;  
                    background-image: url('/static/icon_index_car.png');
                }
                .span-type-name {
                    margin-left: 18px;
                }
            } 
        }
        .top-container-right {
            width: 35%;
            margin-bottom: 0px;

            .help-container {
                position: relative;
                height: 320px;
                display: flex;

                .lottieBg {
                    position: absolute;
                    right: 0px;
                    bottom: 0px;
                }

                ul {
                    width: 100%;
                    z-index:99;

                    li {
                        min-height: 27px;
                        font-size: 12px;
                        color: #5294ff;
                        display: flex;
                        margin-bottom: 5px;

                        span {
                            width: calc(100% - 100px);
                            color: #222222;
                        }
                        a {
                            text-decoration: underline;
                            float:right;
                            font-weight: 600;
                        }
                        & a:nth-child(2){
                            margin-right: 10px;
                            margin-left: 5px;
                        }
                        & a:nth-child(3){
                            margin-right: 20px;
                        }
                    }
                }
            }
        }
    }
    .echartsItem {
        margin-top: 7px;
        height: 342px;
        display: flex;
        flex-direction: column;

        .title-container {
            border-bottom: none;
            position: relative;

            .ul-tip {
                list-style: none;
                display: flex;

                li {
                    margin-right: 15px;

                    i {
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        margin-right: 3px;
                    }

                    span {
                        font-size: 10px;
                        color: #1e1f22;
                    }
                }
            }
            .select-date {
                width: 110px;
                position: absolute;
                right: 30px;
                bottom: 0px;
            }
        }
        .echartsItem-line {
            flex: 1;
        }
    }
}   
.i-28efa8 {
    background-color: #28efa8;
}
.i-25c4ff {
    background-color: #25c4ff;
}
.i-fed12e {
    background-color: #fed12e;
}
.i-2533e5 {
    background-color: #2533e5;
}
.i-icon-img {
    display: inline-block;
    width: 15px !important;
    height: 15px !important;
    transform: translateY(2px);
    background-size: cover;
    background-position: center;  
    background-image: url('/static/icon_index_pass_rate.png');
}
.i-4e27f4 {
    background-color: #4e27f4;
}
.i-159cff {
    background-color: #159cff;
}
.i-fbb725 {
    background-color: #fbb725;
}
.i-299cff {
    background-color: #299cff;
}

::v-deep .el-tag {
    margin-left: 10px;
    margin-top: 10px;

    &:hover {
        cursor: pointer;
    }
}
::v-deep .el-table .cell {
    font-size: 12px;
    line-height: 16px;
}
::v-deep .el-pagination__total {
    font-size: 12px !important;
}
::v-deep .pagination-container .el-pagination {
    position: absolute;
    right: 0px;
    top: 10px;
}
::v-deep .el-input--mini .el-input__inner {
    border-radius: 36px;
}



// .app-container.home{
//     position:relative
// }
// .welcome{
//     position: absolute;
//     bottom: 20%;
//     left: calc(50% - 132px);
//     color: #76797d;
//     font-size: 22px;
// }
</style>

