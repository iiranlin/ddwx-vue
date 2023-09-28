<template>
    <div class="container-calendar" :style="{'--theme':theme}" v-loading="loading">
        <el-form ref="elForm" label-width="85px" style="margin-left: 20px;"
            :model="formData"
            :rules="rules">
            <el-collapse v-model="activeNames">
                <el-collapse-item name="2">
                    <template slot="title">
                        <i :class="calcIconClass('2')" />
                        <span class="title-right">可用车辆</span>
                        <p class="title-span">
                            <span >下表数量说明（按字体颜色）：</span>
                            <span>可用车辆数</span> 
                            <span>已预约车辆数</span>
                            <span>已受理车辆数</span>
                            <span>车辆总数</span>
                        </p>
                    </template>
                    <form-calendar v-if="isRouterAlive" :dateList="dateList" :assignTimey="assignTimey" :assignTimer="assignTimer" :usageDate="formData.usageDate" @calendarClick="calendarClick"/>
                </el-collapse-item>
                <el-collapse-item name="3">
                    <template slot="title">
                        <i :class="calcIconClass('3')" />
                        <span class="title-right">用车信息</span>
                    </template>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="用车单位:" prop="unitCode">
                                <el-select
                                    ref="unitCodeRef"
                                    v-model="formData.unitCode"
                                    placeholder="请选择用车单位"
                                    clearable
                                    @change="unitCodeChange">
                                    <el-option
                                        v-for="item in unitData"
                                        :key="item.value"
                                        :label="item.unitName"
                                        :value="item.unitCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用车部门:" prop="deptId">
                                <select-tree 
                                    :value="formData.deptId"
                                    :options="deptData"
                                    @getValue="deptIdChange($event)"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用车事由:" prop="reasonCode">
                                <el-select
                                    v-model="formData.reasonCode"
                                    placeholder="请选择用车事由"
                                    clearable
                                    filterable>
                                    <el-option v-for="item in dictionariesObj['1016']" 
                                        :key="item.code" 
                                        :label="item.name" 
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="用车需求:" prop="demandCode">
                                <el-select
                                    v-model="formData.demandCode"
                                    placeholder="请选择用车需求"
                                    clearable
                                    filterable>
                                    <el-option v-for="item in dictionariesObj['10018']"
                                        :key="item.code" 
                                        :label="item.name" 
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否长途:" prop="longDistanceTag">
                                <el-radio-group v-model="formData.longDistanceTag">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="乘坐人数:" prop="usagePersons">
                                <el-input v-model="formData.usagePersons" @input="numberInput($event,'usagePersons')" maxlength="200" placeholder="请输入乘坐人数"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="乘车人:" prop="userName">
                                 <el-autocomplete
                                    class="inline-input"
                                    v-model="inputUserName"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入乘车人"
                                    style="width:95%"
                                    :maxlength="10"
                                    :trigger-on-focus="false"
                                    @select="handleSelect"
                                    @keyup.enter.native="handleEnterClick">
                                      <i slot="suffix" class="el-input__icon el-icon-user-solid" @click="handleUserNameClick()"></i>
                                 </el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <div class="tag-container">
                                <el-tag
                                    v-for="tag in defaultCheckedUser"
                                    :key="tag.id"
                                    closable
                                    type="info"
                                    @close='handleTagClose(tag)'>
                                    {{tag.realName}}
                                </el-tag>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系电话:" prop="phone">
                                <el-input v-model="formData.phone" @input="numberInput($event,'phone')" maxlength="200" placeholder="请输入联系电话"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="用车日期:" prop="usageDate">
                                <el-input v-model="formData.usageDate" disabled maxlength="200" placeholder="请选择用车日期"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出发时间:" prop="usageTime">
                                <el-time-select
                                    v-model="formData.usageTime"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:05',
                                        end: '24:00',
                                        minTime:checkMinTime(),
                                    }"
                                    placeholder="请选择出发时间">
                                </el-time-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="预计时长:" prop="timeLength">
                                <el-input v-model="formData.timeLength" @input="limitInput($event,'timeLength')" maxlength="10" placeholder="请输入预计时长">
                                    <span slot="append">小时</span>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="24">
                            <el-form-item label="出发地点:" prop="fromAddr">
                                <form-address-cascader v-if="isRouterAlive" ref="formAddress1" :name="'出发地'" @addressSuccess="addressSuccessOut" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="24">
                            <el-form-item label="前往地点:" prop="toAddr">
                                <form-address-cascader v-if="isRouterAlive" ref="formAddress2" :name="'目的地'" @addressSuccess="addressSuccessTo" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="期望车型:" prop="hopeBrand">
                                <el-select
                                    v-model="formData.hopeBrand"
                                    placeholder="请选择期望车型"
                                    clearable
                                    filterable>
                                    <el-option v-for="item in dictionariesObj['101801']" 
                                        :key="item.code" 
                                        :label="item.name" 
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注:" prop="remark">
                                <el-input type="textarea" style="width: 1000px" v-model="formData.remark" maxlength="200" placeholder="请输入备注" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item name="4">
                    <template slot="title">
                        <i :class="calcIconClass('4')" />
                        <span class="title-right">派车信息</span>
                        <span
                            class="title-right-button"
                            @click.stop.prevent="addCarButton"
                        >
                            <el-button type="text"> <i class="el-icon-plus"></i> 新增车辆</el-button>
                        </span>
                    </template>
                    <form-information v-if="isRouterAlive" ref="formInformation"/>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <div class="dialog-footer">
            <el-button type="primary" @click="addRequest">保 存</el-button>
        </div>
        <select-user ref="selectUser" @selectUserSuccess='selectUserSuccess'></select-user>
    </div>
</template>

<script>
import { vehicleInfoGetAssignCount } from "@/api/vehicleInfo";
import { getAllAvailableUnit } from "@/api/system/unit"
import { deptTree } from "@/api/system/dept";
import getDict from "@/views/mixins/getDict"
import formAddress from "./components/formAddress";
import formAddressCascader from "./components/formAddressCascader";
import formCalendar from "./components/formCalendar";
import formInformation from "./components/formInformation";
import selectTree from "@/components/selectTree";
import { saveOrderDispatch } from "@/api/gcywVehicleRequest";
import { limitInput, numberInput } from '@/utils/index'
import { getCookie } from '@/utils/auth'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from 'vuex';
import selectUser from './components/selectUser.vue';
import { userListAllForDept } from '@/api/system/laborDict'
export default {
    name: "dispatchACar",
    mixins: [getDict],
    components: { formAddress, formCalendar, formInformation, Treeselect, selectTree,selectUser,formAddressCascader },
    data() {
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
        return {
            loading: false,
            isRouterAlive: true,
            limitInput: limitInput,
            numberInput: numberInput,
            activeNames: ['1', '2', '3', '4'],
            dateList: [],
            assignTimey: '2022-05-23',
            assignTimer: '2022-05-29',
            dictionariesCode: [1016, 10018, 101801],
            dictionariesObj: {'1016': [], '10018': [], '101801': []},
            unitData: [],
            deptData: [],
            formData: {
                unitCode: '',
                deptId: undefined,
                reasonCode: '4',
                demandCode: '1001802',
                longDistanceTag: '0',
                usagePersons: '',
                userName: '',
                userId:'',
                phone: getCookie('phone') || '',
                usageDate: this.parseTime(new Date().getTime(),'{y}-{m}-{d}'),
                usageTime: '',
                timeLength: '2',
                fromAddr: '',
                fromAreaId: '',
                toAddr: '',
                toAreaIdd: '',
                hopeBrand: '2',
                remark: '',
                source: 1,
                createType: '1'
            },
            defaultCheckedUser:[],
            inputUserName:'',
            unitOptions:[],
            rules: {
                unitCode: [
                    { required: true, message: "请选择用车单位", trigger: "change" }
                ],
                deptId: [
                    { required: true, message: "请选择用车部门", trigger: "change" }
                ],
                reasonCode:[
                    {required: true,message:"请选择用车事由",trigger:"change"}
                ],
                demandCode:[
                    {required: true,message:"请选择用车需求",trigger:"change"}
                ],
                longDistanceTag:[
                    {required: true,message:"是否长途",trigger:"change"}
                ],
                usagePersons:[
                    {required: true,message:"请输入乘坐人数",trigger:"blur"}
                ],
                userName:[
                    {required: true,message:"请输入乘车人",trigger:"blur"}
                ],
                phone:[
                    {required: true,message:"请输入联系电话",trigger:"blur"}
                ],
                usageDate:[
                    {required: true,message:"请选择用车日期",trigger:"blur"}
                ],
                usageTime:[
                    {required: true,message:"请输入出发时间",trigger:"change"}
                ],
                timeLength:[
                    {required: true,message:"请输入预计时长",trigger:"blur"}
                ],
                fromAddr:[
                    {required: true,validator: checkfromAddr,trigger:"change"}
                ],
                toAddr:[
                    {required: true,validator: checktoAddr,trigger:"change"}
                ],
                hopeBrand:[
                    {required: true,message:"请选择期望车型",trigger:"change"}
                ],
            },
        }
    },
    computed: {
        ...mapGetters([
            'realName',
            'unitName',
            'unitCode',
            'deptName',
            'deptId',
            'id',
        ]),
        theme() {
            return this.$store.state.settings.theme;
        }
    },
    created() {
        this.$nextTick( () => {
            this.formData.userName = this.realName;
            this.formData.userId = this.id;
        })
        this.initUsageTime();
        this.initDefaultUserName();
        this.getUserListAllForDept();
        this.vehicleInfoGetAssignCount();
        for(const item of this.dictionariesCode){
            this.getOperateDict(item);
        }
    },
    async mounted() {
        await this.getUnitDictList();
    },
    methods: {
        async getOperateDict (code) {
            const res = await this.getOperateDictList(code);
            this.dictionariesObj[code] = res;
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
            if(hh < 10){
                hh = '0'+ hh;
            }
            if(mf < 10){
                mf = '0'+ mf;
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
        //初始化默认用车人
        initDefaultUserName(){
            let obj = {
                id:this.id,
                realName:this.realName,
                deptId:this.deptId,
            }
            this.defaultCheckedUser.push(obj);
            this.formData.usagePersons = this.defaultCheckedUser.length;
        },
        calcIconClass(name) {
            return this.activeNames.includes(name) ? `el-icon-caret-bottom` : `el-icon-caret-right`;
        },
        //获取树形数据
        async getUserListAllForDept(){
            this.loading = true;

            await userListAllForDept().then(({ data }) => {
                this.unitOptions = data;
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
        vehicleInfoGetAssignCount () {
            let { unitCode, deptId } = this.formData;
            vehicleInfoGetAssignCount({unitCode, deptId}).then(({data}) => {
                let time_num = this.parseTime(data[0].assignTime, '{b}') - 1;
                this.dateList = data.slice(0, data.length - time_num);
                this.assignTimey = this.weekCheckingIn(this.dateList[0].assignTime, '周一');
                this.assignTimer = this.weekCheckingIn(this.dateList[this.dateList.length - 1].assignTime, '周日');
            })
        },
        // 获取用车单位列表 当前用户有权限的单位
        async getUnitDictList() {
            await getAllAvailableUnit().then(({ data }) => {
                this.unitData = data;

                this.formData.unitName = this.unitName;
                this.formData.unitCode = this.unitCode;

                this.vehicleInfoGetAssignCount();
                this.getDeptDictListDefault();
            }).catch((err) => {
            }).finally(() => {
            })
        },
        /** 转换部门数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.id,
                label: node.deptName,
                children: node.children
            };
        },
        //获取默认用车部门数据
        async getDeptDictListDefault(){
            const { data } = await deptTree({unitId:this.formData.unitCode});
            this.deptData = data;

            this.formData.deptId = this.deptId;
            this.formData.deptName = this.deptName;

            if(this.deptId){
                this.vehicleInfoGetAssignCount();
                this.$refs.formInformation.init(this.formData);
            }
        },
        // 获取用车部门列表
        async getDeptDictList(val) {
            try {
                let valId = '';
                this.unitData.forEach( (item) => {
                    if(item.unitCode === val){
                        valId = item.id;
                    }
                })
                const params = {
                    unitId: valId
                }
                const { data } = await deptTree(params);
                this.deptData = data;
            } catch (e) {

            } finally {

            }
        },
        calendarClick (val) {
            this.formData.usageDate = val;
            this.$refs.formInformation.init(this.formData);
        },
        // 用车单位发生变化时
        unitCodeChange(val) {
            this.formData.deptId = undefined;
            this.vehicleInfoGetAssignCount();
            // this.$refs.formInformation.init(this.formData);
            if (!val) {
                this.deptData = [];
                return
            }
            this.getDeptDictList(val);
        },
        deptIdChange (val) {
            this.formData.deptId = val;
            if(val){
                this.vehicleInfoGetAssignCount();
                this.$refs.formInformation.init(this.formData);
            }
        },
        addressSuccessOut (row) {
            let {id, name} = row;
            this.formData.fromAreaId = id;
            this.formData.fromAddr = name;
        },
        addressSuccessTo (row) {
            let {id, name} = row;
            this.formData.toAreaIdd = id;
            this.formData.toAddr = name;
        },
        addCarButton () {
            // TODO 当获取单位接口正常时  解开注释
            if (!this.formData.unitCode) {
                this.$message.warning('请先选择用车单位!');
                this.$refs.unitCodeRef.focus();
                return;
            }
            // TODO 当获取部门接口正常时  解开注释
            if (!this.formData.deptId) {
                this.$message.warning('请先选择用车部门');
                this.$refs.unitCodeRef.focus();
                return;
            }
            // TODO 当获取日期接口正常时  解开注释
            if (!this.formData.usageDate) {
                this.$message.warning('请先选择用车日期');
                this.$refs.unitCodeRef.focus();
                return;
            }
            if(!this.formData.toAddr && !this.formData.fromAddr){
                this.$message.warning('请先选择出发地和前往地');
                return;
            }
            this.$refs.formInformation.addCarButton();
        },
        addRequest () {
            const rule1 = new Promise( (resolve, reject) => {
                this.$refs.elForm.validate( (valid) => {
                    if (valid) {
                        resolve();
                    }
                })
            })
            const rule2 = new Promise( (resolve, reject) => {
                this.$refs.formInformation.$refs.elForm.validate( (valid) => {
                    if (valid) {
                        resolve();
                    }
                })
            })
            Promise.all([rule1, rule2]).then( () => {
                let formList = this.$refs.formInformation.formData.list;
                let obj = {reqAssignments: [], ...this.formData};
                if(formList.length <= 0){
                    this.$modal.msgWarning('请新增车辆');
                    return
                }
                //检查是否有重复司机
                for (let i = 0; i < formList.length; i++) {
                    let driverCode = formList[i].driver.driverCode;

                    for (let j = i+1; j < formList.length; j++) {
                        if(driverCode===formList[j].driver.driverCode){
                            this.$modal.msgWarning('指派司机不能重复，请重新选择!');
                            return
                        }
                    }
                }
                //检查是否有重复车辆
                for (let i = 0; i < formList.length; i++) {
                    let carNumber = formList[i].car.carNumber;

                    for (let j = i+1; j < formList.length; j++) {
                        if(carNumber===formList[j].car.carNumber){
                            this.$modal.msgWarning('指派车辆不能重复，请重新选择!');
                            return
                        }
                    }
                }
                this.unitData.forEach(item => {
                    if(item.unitCode == this.formData.unitCode){
                        obj = Object.assign({}, obj, {unitName: item.unitName});
                    }
                });
                this.dictionariesObj['1016'].forEach(item => {
                    if(item.code == this.formData.reasonCode){
                        obj = Object.assign({}, obj, {reason: item.name});
                    }
                });
                this.dictionariesObj['10018'].forEach(item => {
                    if(item.code == this.formData.demandCode){
                        obj = Object.assign({}, obj, {demand: item.name});
                    }
                });
                formList.forEach( (item) => {
                    obj.reqAssignments.push({
                        restatus: item.restatus || null,
                        driver: item.driver.realName,
                        driverId: item.driver.driverCode,
                        driverPhone: item.driver.phone,
                        beginMiles: item.car.startMiles,
                        carNumber: item.car.carNumber,
                        conditionDesc: item.car.conditionDesc,
                        vinNumber: item.car.vinNumber,
                    })
                })
                this.loading = true;

                saveOrderDispatch(obj).then( ({message}) => {
                    this.$modal.msgSuccess(message);
                    this.$refs.elForm.resetFields();
                    this.vehicleInfoGetAssignCount();
                    this.loading = false;
                    this.isRouterAlive = false
                    this.$nextTick(function(){
                        this.isRouterAlive = true
                    })
                })
            })
        },
        //模糊搜索乘车人
        querySearch(queryString, cb){
            let resultOptions = [];
            resultOptions = this.filterUser(queryString,this.unitOptions,resultOptions);

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
            }
            this.defaultCheckedUser.push(obj);
            this.selectUserSuccess(this.defaultCheckedUser);
            this.inputUserName = '';
        },
        //删除tag
        handleTagClose(tag){
            if(this.defaultCheckedUser.length === 1){
                this.$modal.msgWarning('至少选择一名乘车人!')
                return;
            }
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
        },
        //乘车人点击
        handleUserNameClick(){
            this.$refs.selectUser.init(this.defaultCheckedUser);
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
        }
    }

};
</script>
<style lang="scss" scoped>
.container-calendar{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .is-selected {
        color: #{'var(--theme)'};
    }
    .el-icon-caret-right{
        font-size: 20px;
        color: #{'var(--theme)'};
    }
    .el-icon-caret-bottom {
        font-size: 20px;
        color: #{"var(--theme)"};
    }
    ::v-deep .el-select,
    .el-input,
    .el-date-editor {
        width: 95%;
    }
    .title-right{
        font-weight: 600;
        font-size: 15px;
    }
    .title-span{
      margin-left: 38px;
      font-style: oblique;
      font-size: 12px;
    }
    .title-span{
        span{
            padding-left: 10px;
            &:nth-child(2){
                color: #d57b48;
            }
            &:nth-child(3){
                color: #6292ff;
            }
            &:nth-child(4){
                color: #4da32d;
            }
            &:nth-child(5){
                color: #26413c;
            }
        }
    }
    .dialog-footer{
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
        .el-button--medium{
            padding: 10px 32px;
        }
    }
    .el-calendar-table{
        .el-calendar-day{
            padding: 0px;
            height: 55px;
            p{
                margin: 0px;
                text-align: center;
            }
        }
    }
    .el-input__icon {
        color:#409EFF;
        
        &:hover {
            cursor: pointer;
        }
    }
    .tag-container {
        .el-tag {
            margin-right: 10px;
            margin-bottom: 10px;
        }
    }
}
::v-deep .fold_label .el-form-item__label {
    white-space: pre-line;
    line-height: 20px;
}
</style>