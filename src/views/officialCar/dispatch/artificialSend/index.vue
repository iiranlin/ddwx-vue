<template>
    <div class="app-container" v-loading="loading">
        <el-form ref="elForm" :model="formData" :rules="rules" label-width="85px">
        <!--可用车辆-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_use_car.png"/>
                <span>可用车辆</span>
                <ul>
                    <li>
                        <span>车辆总数：</span>
                        <span class="car-total-number">{{tasscount}}</span>
                        <span>辆</span>
                    </li>
                    <li>
                        <img src="/static/icon_car.png"/>
                        <span>可用车辆数</span>
                    </li>
                    <li>
                        <img src="/static/icon_clock.png"/>
                        <span>已预约车辆数</span>
                    </li>
                    <li>
                        <img src="/static/icon_accepted.png"/>
                        <span>已受理车辆数</span>
                    </li>
                </ul>
            </div>
            <div>
                <calendar :dateList="dateList" :assignTimey="assignTimey" :assignTimer="assignTimer" :usageDate="formData.usageDate" @calendarClick="calendarClick"/>
            </div>
        </div>
        <!--申请信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_detail_unit.png"/>
                <span>申请信息</span>
            </div>
            <div class="ul-parent">
                <ul class="ul-container">
                    <li class="li-item">
                        <el-form-item label="用车单位：" prop="unitCode">
                            <el-select
                                v-model="formData.unitCode"
                                placeholder="请选择用车单位"
                                clearable
                                filterable
                                size="small">
                                <el-option v-for="item in unitOptions"
                                    :key="item.code"
                                    :label="item.unitName"
                                    :value="item.unitCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li class="li-item">
                        <el-form-item label="用车部门：" prop="deptId">
                            <select-tree
                                :value="formData.deptId"
                                :options="deptOptions"
                                @getValue="deptChange($event)"/>
                        </el-form-item>
                    </li>
                    <li class="li-item">
                        <el-form-item label="用车事由：" prop="reasonCode">
                            <el-select
                                v-model="formData.reasonCode"
                                placeholder="请选择用车事由"
                                clearable
                                filterable
                                size="small">
                                <el-option v-for="item in reasonOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li class="li-item">
                        <el-form-item label="用车需求：" prop="demandCode">
                            <el-select
                                v-model="formData.demandCode"
                                placeholder="请选择用车需求"
                                clearable
                                filterable
                                size="small">
                                <el-option v-for="item in demandOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li class="li-item">
                         <el-form-item label="是否长途：" prop="longDistanceTag">
                            <el-select
                                v-model="formData.longDistanceTag"
                                placeholder="请选择是否长途"
                                clearable
                                filterable
                                size="small">
                                <el-option v-for="item in longDistanceTagOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li class="li-item">
                        <el-form-item label="乘坐人数：" prop="usagePersons">
                            <el-input v-model="formData.usagePersons" @input="numberInput($event,'usagePersons')" maxlength="3" placeholder="请输入乘坐人数" size="small"/>
                        </el-form-item>
                    </li>
                    <li class="li-item">
                         <el-form-item label="期望车型：" prop="hopeBrand">
                            <el-select
                                v-model="formData.hopeBrand"
                                placeholder="请选择期望车型"
                                clearable
                                filterable
                                size="small">
                                <el-option v-for="item in hopeBrandOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li class="li-item">
                         <el-form-item label="优先保障：" prop="guarantee">
                            <el-select
                                v-model="formData.guarantee"
                                placeholder="请选择优先保障"
                                clearable
                                filterable
                                size="small">
                                <el-option v-for="item in guaranteeOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li class="li-item li-item-all">
                        <el-form-item label="备注：" prop="remark">
                            <el-input type="textarea" v-model="formData.remark" maxlength="150" placeholder="请输入备注" size="small"/>
                        </el-form-item>
                    </li>
                </ul>
            </div>
        </div>
         <!--用车信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_dispatch_car.png"/>
                <span>用车信息</span>
            </div>
            <div class="ul-parent">
                <ul class="ul-container">
                    <li class="li-user-name">
                        <el-form-item label="乘车人：" prop="userName" class="user-name-input">
                            <el-autocomplete
                                class="inline-input"
                                v-model="inputUserName"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入乘车人"
                                size="small"
                                :maxlength="10"
                                :trigger-on-focus="false"
                                @select="handleSelect"
                                @keyup.enter.native="handleEnterClick">
                                <i slot="suffix" class="el-input__icon el-icon-user-solid" @click="handleUserNameClick()"></i>
                            </el-autocomplete>
                        </el-form-item>
                        <div class="user-name-tag">
                            <el-tag
                                v-for="tag in defaultCheckedUser"
                                :key="tag.id"
                                closable
                                type="info"
                                @close='handleTagClose(tag)'>
                                {{tag.realName}}
                            </el-tag>
                        </div>
                    </li>
                    <li>
                        <el-form-item label="出发地点：" prop="fromAddr">
                            <form-address-cascader ref="formAddress" :name="'出发地'" @addressSuccess="addressSuccessOut" />
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="前往地点：" prop="toAddr">
                            <form-address-cascader ref="toAddress" :name="'目的地'" @addressSuccess="addressSuccessTo" />
                        </el-form-item>
                    </li>
                    <li class="li-item-time">
                        <el-form-item label="联系电话：" prop="phone">
                            <el-input v-model="formData.phone" @input="numberInput($event,'phone')" maxlength="13" placeholder="请输入手机/固话号码" size="small"/>
                        </el-form-item>
                        <el-form-item label="出发日期：" prop="usageDate">
                            <span>{{formData.usageDate}}</span>
                        </el-form-item>
                        <el-form-item label="出发时间：" prop="usageTime">
                            <el-time-select
                                v-model="formData.usageTime"
                                :picker-options="{
                                    start: '00:00',
                                    step: '00:05',
                                    end: '23:55',
                                }"
                                placeholder="请选择出发时间"
                                size="small">
                            </el-time-select>
                        </el-form-item>
                        <el-form-item label="预计时长:" prop="timeLength">
                            <el-input v-model="formData.timeLength" @input="limitInput($event,'timeLength')" maxlength="5" placeholder="请输入预计时长" size="small"></el-input>
                        </el-form-item>
                    </li>
                </ul>
            </div>
        </div>
        <!--派车信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_use_car.png"/>
                <span>派车信息</span>
            </div>
            <div class="add-car-contaner">
                <div class="add-car-title">
                    <span>添加车辆：</span>
                    <div class="add-car" @click="handleAddCarClick()">
                        <img src="/static/icon_car.png" />
                        <span>选择车辆</span>
                    </div>
                </div>
                <dispatch-item ref="dispatchItem"/>
                <div class="button-container">
                    <el-button type="primary" round  @click="addRequest" size="small">保 存</el-button>
                    <el-button round @click="closeCurrentPage" size="small">关 闭</el-button>
                </div>
            </div>
        </div>
        </el-form>
        <!--选择乘车人弹框-->
        <select-user ref="selectUser" @selectUserSuccess='selectUserSuccess'></select-user>
    </div>
</template>
<script>
import { vehicleInfoGetAssignCount } from "@/api/vehicleInfo";
import { getAllAvailableUnit } from "@/api/system/unit"
import { getListByParentId } from "@/api/system/dict"
import { userListAllForDept } from '@/api/system/laborDict'
import { limitInput, numberInput } from '@/utils/index';
import { addVehicleRequest } from "@/api/gcywVehicleRequest";
import { deptTree } from "@/api/system/dept";
import calendar from "./components/calendar";
import selectUser from './components/selectUser.vue';
import formAddressCascader from "./components/formAddressCascader";
import dispatchItem from "./components/dispatchItem";
import selectTree from "@/components/selectTree";
import { mapGetters } from 'vuex';

export default {
    name:'artificialSend',
    components: { calendar,selectUser,formAddressCascader,dispatchItem,selectTree },

    data () {
        var checkfromAddr = (rule, value, callback) => {
            if(value.indexOf('null') == -1 && value){
                return callback();
            }else{
                return callback(new Error('请选择出发地点'));
            }
        }
        var checktoAddr = (rule, value, callback) => {
            if(value.indexOf('null') == -1 && value){
                return callback();
            }else{
                return callback(new Error('请选择前往地点'));
            }
        }
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请填写手机/固话号码'));
            }
            if(this.pattern.test(value) || this.mobPattern.test(value)){
                return callback()
            }
            return callback(new Error('手机/固话号码格式有误,请输入正确的手机/固话号码!'));
        };
        return {
            //手机号验证规则
            pattern: /^1[3456789]\d{9}$/,
            // 固定电话校验
            mobPattern: /^((0\d{2,3})-)?(\d{5,8})$/,
            //遮罩层
            loading:false,
            //规则api
            limitInput: limitInput,
            numberInput: numberInput,

            //表单数据
            formData:{
                usageDate:this.parseTime(new Date().getTime(),'{y}-{m}-{d}'),   //用车日期
                unitCode:'',         //用车单位
                deptId:undefined,    //用车部门
                reasonCode:'4',      //用车事由
                demandCode:'',      //用车需求
                longDistanceTag:'0', //是否长途
                usagePersons:'',    //乘坐人数
                hopeBrand:'2',       //期望车型
                guarantee:'0',       //优先保障
                remark:'',          //备注
                userName:'',        //乘车人
                userId:'',          //乘车人id
                phone:'',           //乘车人电话
                fromAddr: '',       //出发地点
                fromAreaId: '',
                toAddr: '',         //前往地点
                toAreaIdd: '',
                usageTime:'',       //用车时间
                timeLength:'2',     //预计时长
                source: 1,          //来源
                createType: '1'
            },
            //可用车辆数
            available: 0,
            //车辆总数
            tasscount: 0,
            //周起始日期
            assignTimey: undefined,
            //周结束日期
            assignTimer: undefined,
            //日期数据
            dateList: [],
            //用车事由数据
            reasonOptions:[],
            //用车需求数据
            demandOptions:[],
            //是否长途数据
            longDistanceTagOptions:[
                {
                    code:'1',
                    name:'是',
                },
                {
                    code:'0',
                    name:'否',
                }
            ],
            //用车单位数据
            unitOptions: [],
            //用车部门数据
            deptOptions: [],
            //期望车型数据
            hopeBrandOptions:[],
            //优先保障数据
            guaranteeOptions:[],
            //输入框输入乘车人信息
            inputUserName:'',
            //乘车人树形数据
            unitTreeOptions:[],
            //已选中乘车人数据
            defaultCheckedUser:[],

            rules: {
                reasonCode:[
                    {required:true,message:"请选择用车事由",trigger:"change"}
                ],
                demandCode:[
                    {required:true,message:"请选择用车需求",trigger:"change"}
                ],
                longDistanceTag:[
                    {required:true,message:"请选择是否长途",trigger:"change"}
                ],
                usagePersons:[
                    {required:true,message:"请输入乘坐人数",trigger:"blur"}
                ],
                hopeBrand:[
                    {required:true,message:"请选择期望车型",trigger:"change"}
                ],
                userName:[
                    {required:true,message:"请输入乘车人",trigger:['change', 'blur']}
                ],
                phone:[
                    {required:true,validator: checkPhone,trigger:"blur"}
                ],
                fromAddr:[
                    {required:true,validator: checkfromAddr,trigger:"change"}
                ],
                toAddr:[
                    {required:true,validator: checktoAddr,trigger:"change"}
                ],
                usageTime:[
                    {required:true,message:"请选择出发时间",trigger:"change"}
                ],
                timeLength:[
                    {required:true,message:"请输入预计时长",trigger:"blur"}
                ],
            },
        }
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        },
        ...mapGetters([
            'unitName',
            'unitCode',
            'deptName',
            'deptId',
            'realName',
            'id',
            'phone',
        ]),
    },
    created() {
        this.getUnitOptions();
        this.getReasonOptions();
        this.getDemandOptions();
        this.getHopeBrandOptions();
        this.getGuaranteeOptions();
        this.getUserListAllForDept();
        this.initUsageTime();
        // this.initDefaultUser();
    },
    methods: {
        // 获取用车单位列表 当前用户有权限的单位
        getUnitOptions() {

            getAllAvailableUnit().then(({ data }) => {
                this.unitOptions = data;
                this.formData.unitCode = this.unitCode;

                this.getDeptDictListDefault();
            }).catch((err) => {

            })
        },
        //获取默认用车部门数据
        async getDeptDictListDefault(){
            const { data } = await deptTree({unitId:this.formData.unitCode});
            this.deptOptions = data;
            // this.formData.deptId = this.deptId;
            // this.formData.deptId = '1101000';// 生产需要替换成这个
            this.formData.deptId = 'dda2c17b1a0d4f238a4a40e17f5bc1f5';

            this.vehicleInfoGetAssignCount();
            this.$refs.dispatchItem.init(this.formData);
        },
        //用车部门选择回调
        deptChange (val) {
            this.formData.deptId = val;

            if(val){
                this.vehicleInfoGetAssignCount();
                this.$refs.dispatchItem.init(this.formData);
            }
        },
        //获取用车事由数据
        getReasonOptions(){
            this.loading = true;

            getListByParentId('1016').then(({data}) => {
                this.loading = false;
                this.reasonOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取用车需求数据
        getDemandOptions(){
            this.loading = true;

            getListByParentId('10018').then(({data}) => {
                this.loading = false;
                this.demandOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取期望车型数据
        getHopeBrandOptions(){
            this.loading = true;

            getListByParentId('101801').then(({data}) => {
                this.loading = false;
                this.hopeBrandOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取优先保障数据
        getGuaranteeOptions(){
            this.loading = true;

            getListByParentId('1679651627836055552').then(({data}) => {
                this.loading = false;
                this.guaranteeOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取用车情况
        vehicleInfoGetAssignCount () {
            this.loading = true;

            let params = {
                unitCode:this.formData.unitCode,
                deptId:this.formData.deptId,
            }
            vehicleInfoGetAssignCount(params).then(({data}) => {
                this.loading = false;

                let time_num = this.parseTime(data[0].assignTime, '{b}') - 1;
                this.dateList = data.slice(0, data.length - time_num);

                this.assignTimey = this.weekCheckingIn(this.dateList[0].assignTime, '周一');
                this.assignTimer = this.weekCheckingIn(this.dateList[this.dateList.length - 1].assignTime, '周日');

                //初始化可用车辆
                let obj = this.dateList.find((item) => {
                    return item.assignTime === this.formData.usageDate;
                })
                this.available = obj.tasscount - obj.nasscount - obj.sasscount;
                this.tasscount = obj.tasscount;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取乘车人树形数据
        async getUserListAllForDept(){
            this.loading = true;

            await userListAllForDept().then(({ data }) => {
                this.unitTreeOptions = data;
                this.loading = false;

            }).catch((err) => {
                this.loading = false;
            })
        },
        weekCheckingIn(assignTime, type){
            this.weekChecking_inloading = true
            var now = new Date(assignTime);
            var nowTime = now.getTime() ;
            var day = now.getDay()|| 7;// 不加 || 7.周末会变成下周一
            var oneDayTime = 24*60*60*1000 ;
            var MondayTime = nowTime - (day-1)*oneDayTime ;//显示周一
            var SundayTime =  nowTime + (7-day)*oneDayTime ;//显示周日
            //调用方法
            if(type == '周一'){
                return this.formatDate(new Date(MondayTime));
            }else if(type == '周日'){
                return this.formatDate(new Date(SundayTime));
            }
        },
        //格式化日期：yyyy-MM-dd
        formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday);
        },
        //日历点击回调
        calendarClick(val,available,tasscount){
            this.formData.usageDate = val;
            this.available = available;
            this.tasscount = tasscount;

            if(this.$refs.dispatchItem.getCarItemList() !== 0){
                this.$refs.dispatchItem.init(this.formData);
            }
        },
        //初始化默认用车人
        initDefaultUser(){
            let obj = {
                id:this.id,
                realName:this.realName,
                deptId:this.deptId,
                phone:this.phone,
            }
            this.defaultCheckedUser.push(obj);
            this.selectUserSuccess(this.defaultCheckedUser);
        },
        //模糊搜索乘车人
        querySearch(queryString, cb){
            let resultOptions = [];
            resultOptions = this.filterUser(queryString,this.unitTreeOptions,resultOptions);

            resultOptions.forEach((item) => {
                this.$set(item, 'value', item.realName+" "+item.longName)
            })
            // 调用 callback 返回建议列表的数据
            cb(resultOptions);
        },
        filterUser(queryString,data,resultOptions) {
            data.forEach((item) => {
                if(!!item.userCode && item.realName.includes(queryString)){
                    resultOptions.push(item);
                }else{
                    this.filterUser(queryString,item.children,resultOptions)
                }
            })
            return resultOptions;
        },
        //模糊搜索乘车人选中
        handleSelect(item){
            this.inputUserName = item.realName;

            //判断是否重复
            let result = this.defaultCheckedUser.some((defaultItem) => {
                return item.id === defaultItem.id;
            })
            if(result){
                this.$modal.msgWarning("乘车人已存在，请重新选择!")
                return;
            }
            let obj = {
                id:item.id,
                deptId:item.deptId,
                realName:item.realName,
                phone:item.phone,
            }
            this.defaultCheckedUser.push(obj);
            this.selectUserSuccess(this.defaultCheckedUser);
            this.inputUserName = '';
        },
        //模糊搜索回车点击
        handleEnterClick(){
            //判断是否重复
            let result = this.defaultCheckedUser.some((item) => {
                return !item.id && item.realName === this.inputUserName;
            })
            if(result){
                this.$modal.msgWarning("乘车人已存在，请重新选择!")
                return;
            }
            let obj = {
                id:'',
                deptId:'',
                realName:this.inputUserName,
                phone:item.phone,
            }
            this.defaultCheckedUser.push(obj);
            this.selectUserSuccess(this.defaultCheckedUser);
            this.inputUserName = '';
        },
        //选择乘车人点击
        handleUserNameClick(){
            this.$refs.selectUser.init(this.defaultCheckedUser,this.deptId);
        },
        //选择乘车人回调
        selectUserSuccess(defaultChecked){
            this.defaultCheckedUser = defaultChecked;

            let tempUserName = '';
            let tempUserId = '';
            this.defaultCheckedUser.forEach((item,index) => {
                if(index === this.defaultCheckedUser.length-1){
                    tempUserName = tempUserName + item.realName;
                    tempUserId = tempUserId + item.id;
                }else{
                    tempUserName = tempUserName + item.realName + ',';
                    tempUserId = tempUserId + item.id + ',';
                }
            })
            this.formData.userName = tempUserName;
            this.formData.userId = tempUserId;
            this.formData.usagePersons = this.defaultCheckedUser.length;
            this.formData.phone = this.defaultCheckedUser[0].phone;
        },
        //删除乘车人
        handleTagClose(tag){
            if(!tag.id){
                let index = this.defaultCheckedUser.findIndex((item) => {
                    return tag.realName === item.realName;
                })
                this.defaultCheckedUser.splice(index, 1);
            }else{
                let index = this.defaultCheckedUser.findIndex((item) => {
                    return tag.id === item.id;
                })
                this.defaultCheckedUser.splice(index, 1);
            }
            if(this.defaultCheckedUser.length == 0){
                this.formData.userName = '';
                this.formData.userId = '';
                this.formData.usagePersons = '';
                this.formData.phone = '';
            }else{
                this.selectUserSuccess(this.defaultCheckedUser);
            }
        },
        //选择出发地回调
        addressSuccessOut (row) {
            let {id, name} = row;
            this.formData.fromAreaId = id;
            this.formData.fromAddr = name;
        },
        //选择目的地回调
        addressSuccessTo (row) {
            let {id, name} = row;
            this.formData.toAreaIdd = id;
            this.formData.toAddr = name;
        },
        //初始化出发时间
        initUsageTime(){
            let hh = new Date().getHours();
            let mf = new Date().getMinutes();

            let diff = mf % 5;

            if(diff !== 0 ){
                diff = 5 - diff;
            }
            if(mf < 55){
                mf = mf + diff + 5;
            }else if(mf === 55){
                mf = 0;
                hh = hh +1;
            }else{
                mf = 5;
                hh = hh +1;
            }
            if(mf < 10){
                mf = '0'+ mf;
            }
            if(mf == 60){
                mf = '00'
                hh = hh + 1;
            }
            if(hh < 10){
                hh = '0'+ hh;
            }
            if(hh == 24){
                hh = '00'
            }
            this.formData.usageTime = hh +':'+ mf;
        },
        checkMinTime(){
            if(this.formData.usageDate === this.parseTime(new Date().getTime(),'{y}-{m}-{d}')){
                return new Date().getHours()+':'+new Date().getMinutes();
            }
            return ''
        },
        //添加车辆
        handleAddCarClick(){
            if (!this.formData.unitCode) {
                this.$message.warning('请先选择用车单位!');
                return;
            }
            if (!this.formData.deptId) {
                this.$message.warning('请先选择用车部门');
                return;
            }
            if(!this.formData.toAddr && !this.formData.fromAddr){
                this.$message.warning('请先选择出发地和前往地');
                return;
            }
            this.$refs.dispatchItem.addCarItem();
        },
        //保存
        addRequest(){
            this.$refs.elForm.validate( (valid) => {
                if (valid) {
                    if(this.$refs.dispatchItem.getCarItemList() === 0){
                        this.addVehicleRequest();
                    }else{
                        this.reasonOptions.forEach(item => {
                            if(item.code == this.formData.reasonCode){
                                this.formData.reason = item.name;
                            }
                        });
                        this.demandOptions.forEach(item => {
                            if(item.code == this.formData.demandCode){
                                this.formData.demand = item.name;
                            }
                        });
                        this.unitOptions.forEach(item => {
                            if(item.unitCode == this.formData.unitCode){
                                this.formData.unitName = item.unitName;
                            }
                        });
                        this.$refs.dispatchItem.addRequest(this.formData);
                    }
                }
            })
        },
        //不选择车辆信息提交
        addVehicleRequest(){

            this.reasonOptions.forEach(item => {
                if(item.code == this.formData.reasonCode){
                    this.formData.reason = item.name;
                }
            });
            this.demandOptions.forEach(item => {
                if(item.code == this.formData.demandCode){
                    this.formData.demand = item.name;
                }
            });
            this.unitOptions.forEach(item => {
                if(item.unitCode == this.formData.unitCode){
                    this.formData.unitName = item.unitName;
                }
            });
            addVehicleRequest(this.formData).then( ({message}) => {
                this.$modal.msgSuccess('操作成功');
                this.$router.push({name:'workspace'});
            }).catch((err) => {

            })
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
    },
}
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
            ul {
                list-style: none;
                display: flex;

                .car-total-number {
                    color: #4587ff;
                    font-weight: 600;
                    margin-right: 5px;
                }
                li {
                    display: flex;
                    align-items: center;

                    img {
                        margin-right: 5px;
                        width: 16px;
                        height: 16px;
                    }
                }
                & li:nth-child(1) {
                    margin-left: 0px;
                }
                & li:nth-child(2) {
                    margin-left: 100px;
                }
                & li:nth-child(3) {
                    margin-left: 60px;
                }
                & li:nth-child(4) {
                    margin-left: 60px;
                }
            }
        }
        .ul-parent {
            overflow: hidden;
            padding: 7px 20px 0px 20px;

            .ul-container {
                padding: 0px;
                margin: 0px;
                list-style: none;

                .li-item {
                    float: left;
                    min-height: 24px;
                    line-height: 24px;
                    min-width: 25%;
                    max-width: 25%;
                    font-size: 12px;
                    display: flex;
                    color: #000000;
                }
                .li-item-all {
                    min-width: 100%;
                }
                .li-user-name {
                    display: flex;

                    .user-name-input {
                        width: 25%;
                    }
                    .user-name-tag {
                        width: 70%;
                        margin-left: 10px;
                    }
                }
                .li-item-time {
                    display: flex;
                    line-height: 36px;
                    justify-content: space-between;
                }
            }
        }
        .add-car-contaner {
            padding-top: 10px;
            overflow: hidden;
            position: relative;

            .add-car-title {
                display: flex;
                line-height: 24px;
                line-height: 31px;
                font-size: 12px;
                border-bottom: 1px solid #f3f5f7;
                padding-left: 40px;

                .add-car {
                    margin-left: 5px;
                    width: 120px;
                    border: 1px solid #f0f0f0;
                    border-radius: 50px;
                    text-align: center;
                    margin-bottom: 10px;

                    & :hover {
                        cursor: pointer;
                    }
                    img {
                        width: 16px;
                        height: 16px;
                        margin-right: 5px;
                        transform: translateY(3px);
                    }
                    span {
                        font-size: 12px;
                    }
                }
                .add-car-info {
                    width: 100%;
                    display: flex;
                }
            }
            .button-container {
                margin: 0 auto;
                margin-top: 20px;
                width:  200px;
                display: flex;
                justify-content: space-around;

                .el-button {
                    width: 100px;
                }
            }
        }
    }
    ::v-deep .el-form-item__label {
        font-size: 12px;
        color: #1b1e22;
        font-weight: 400;
        padding-right: 5px;
    }
    ::v-deep .el-input__inner {
        border-radius: 50px;
    }
    ::v-deep .el-input__icon {
        color:#409EFF;

        &:hover {
            cursor: pointer;
        }
    }
    ::v-deep .el-form-item {
        width: 100%;
    }
    ::v-deep .el-tag {
        margin:5px 10px 10px 0px;
        border-radius: 50px;
        background: #ffffff;
    }
}

</style>
