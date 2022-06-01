<template>
    <div class="container-calendar" :style="{'--theme':theme}" v-loading="loading">
        <el-form ref="elForm" :inline="true" label-width="85px"
            :model="formData"
            :rules="rules">
            <el-collapse v-model="activeNames">
                <el-collapse-item name="1">
                    <template slot="title">
                        <i :class="calcIconClass('1')" />
                        <span class="title-right">单位信息</span>
                    </template>
                    <div class="form-row">
                        <el-row :gutter="24">
                            <el-col :xs="24" :sm="12" :md="8" :lg="8">
                                <el-form-item label="用车单位" prop="unitCode">
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
                            <el-col :xs="24" :sm="12" :md="8" :lg="8">
                                <el-form-item label="用车部门" prop="deptId">
                                    <el-select
                                        ref="deptIdRef"
                                        v-model="formData.deptId"
                                        placeholder="请选择用车部门"
                                        clearable
                                        @change="deptIdChange">
                                        <el-option
                                            v-for="item in deptData"
                                            :key="item.id"
                                            :label="item.deptName"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template slot="title">
                        <i :class="calcIconClass('2')" />
                        <span class="title-right">可用车辆</span>
                        <span class="title-span">下表数量说明：黑色字体为车辆数量；蓝色字体为已预约车辆数量；绿色字体为已受理车辆数量；橙色字体为可用车辆数量。</span>
                    </template>
                    <form-calendar v-if="isRouterAlive" :dateList="dateList" :assignTimey="assignTimey" :assignTimer="assignTimer" :usageDate="formData.usageDate" @calendarClick="calendarClick"/>
                </el-collapse-item>
                <el-collapse-item name="3">
                    <template slot="title">
                        <i :class="calcIconClass('3')" />
                        <span class="title-right">单位信息</span>
                    </template>
                    <div class="form-row">
                        <el-row>
                            <el-col :span="8">
                            <el-form-item label="用车事由:" prop="reasonCode">
                                <el-select
                                v-model="formData.reasonCode"
                                placeholder="请选择用车事由"
                                clearable
                                filterable
                                >
                                <el-option v-for="item in dictionariesObj['1016']" 
                                    :key="item.code" 
                                    :label="item.name" 
                                    :value="item.code">
                                </el-option>
                                </el-select>
                            </el-form-item>
                            </el-col>
                            <el-col :span="8">
                            <el-form-item label="用车需求:" prop="demandCode">
                                <el-select
                                v-model="formData.demandCode"
                                placeholder="请选择用车需求"
                                clearable
                                filterable
                                >
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
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                            <el-form-item label="乘坐人数:" prop="usagePersons">
                                <el-input v-model="formData.usagePersons" @input="numberInput($event,'usagePersons')" style="width: 217px" maxlength="200" placeholder="请输入乘坐人数" />
                            </el-form-item>
                            </el-col>
                            <el-col :span="8">
                            <el-form-item label="乘车人:" prop="userName">
                                <el-input v-model="formData.userName" style="width: 217px" maxlength="200" placeholder="请输入乘车人" />
                            </el-form-item>
                            </el-col>
                            <el-col :span="8">
                            <el-form-item label="联系电话:" prop="phone">
                                <el-input v-model="formData.phone" @input="numberInput($event,'phone')" style="width: 217px" maxlength="200" placeholder="请输入联系电话" />
                            </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                            <el-form-item label="用车日期:" prop="usageDate">
                                <el-input v-model="formData.usageDate" style="width: 217px" disabled maxlength="200" placeholder="请选择用车日期" />
                            </el-form-item>
                            </el-col>
                            <el-col :span="8">
                            <el-form-item label="出发时间:" prop="usageTime">
                                <el-time-picker
                                v-model="formData.usageTime"
                                value-format="HH:mm"
                                format="HH:mm"
                                placeholder="请输入出发时间">
                                </el-time-picker>
                            </el-form-item>
                            </el-col>
                            <el-col :span="8">
                            <el-form-item label="预计时长:" prop="timeLength">
                                <el-input v-model="formData.timeLength" @input="limitInput($event,'timeLength')" style="width: 217px" maxlength="200" placeholder="请输入预计时长">
                                    <span slot="append">小时</span>
                                </el-input>
                            </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="24">
                                <el-form-item label="出发地点:" prop="fromAddr">
                                    <form-address v-if="isRouterAlive" ref="formAddress1" :name="'出发地'" @addressSuccess="addressSuccessOut" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="24">
                                <el-form-item label="前往地点:" prop="toAddr">
                                    <form-address v-if="isRouterAlive" ref="formAddress2" :name="'目的地'" @addressSuccess="addressSuccessTo" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                            <el-form-item label="期望车型:" prop="hopeBrand">
                                <el-select
                                v-model="formData.hopeBrand"
                                placeholder="请选择期望车型"
                                clearable
                                filterable
                                >
                                <el-option v-for="item in dictionariesObj['1018']" 
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

                    </div>
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
    </div>
</template>

<script>
import { vehicleInfoGetAssignCount } from "@/api/vehicleInfo";
import { getAllAvailableUnit } from "@/api/system/unit"
import { getAllAvailableDept } from "@/api/dept"
import getDict from "@/views/mixins/getDict"
import formAddress from "./components/formAddress";
import formCalendar from "./components/formCalendar";
import formInformation from "./components/formInformation";
import { saveOrderDispatch } from "@/api/gcywVehicleRequest";
import { limitInput, numberInput } from '@/utils/index'
export default {
    name: "dispatchACar",
    mixins: [getDict],
    components: { formAddress, formCalendar, formInformation },
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
            dictionariesCode: [1016, 10018, 1018],
            dictionariesObj: {},
            unitData: [],
            deptData: [],
            formData: {
                unitCode: '',
                deptId: '',
                reasonCode: '1',
                demandCode: '1001801',
                longDistanceTag: '0',
                usagePersons: '1',
                userName: '',
                phone: '',
                usageDate: '',
                usageTime: '',
                timeLength: '',
                fromAddr: '',
                fromAreaId: '',
                toAddr: '',
                toAreaIdd: '',
                hopeBrand: '',
                remark: '',
                source: 1,
                createType: '1'
            },
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
        theme() {
            return this.$store.state.settings.theme;
        }
    },
    created() {
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
        calcIconClass(name) {
            return this.activeNames.includes(name) ? `el-icon-caret-bottom` : `el-icon-caret-right`;
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
                this.dateList = data;
                this.assignTimey = this.weekCheckingIn(data[0].assignTime, '周一');
                this.assignTimer = this.weekCheckingIn(data[data.length - 1].assignTime, '周日');
            })
        },
        // 获取用车单位列表 当前用户有权限的单位
        async getUnitDictList() {
            await getAllAvailableUnit().then(({ data }) => {
                this.unitData = data;
            }).catch((err) => {
            }).finally(() => {
            })
        },
        // 获取用车部门列表
        async getDeptDictList(val) {
            try {
                const params = {
                unitCode: val
                }
                const { data } = await getAllAvailableDept(params);
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
            this.formData.deptId = '';
            this.vehicleInfoGetAssignCount();
            this.$refs.formInformation.init(this.formData);
            if (!val) {
                this.deptData = [];
                return
            }
            this.getDeptDictList(val);
        },
        deptIdChange (val) {
            this.vehicleInfoGetAssignCount();
            this.$refs.formInformation.init(this.formData);
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
                this.$refs.deptIdRef.focus();
                return;
            }
            // TODO 当获取日期接口正常时  解开注释
            if (!this.formData.usageDate) {
                this.$message.warning('请先选择用车日期');
                this.$refs.deptIdRef.focus();
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
                formList.forEach( (item) => {
                    obj.reqAssignments.push({
                        restatus: item.restatus || null,
                        driver: item.driver.driver,
                        driverId: item.driver.driverCode,
                        driverPhone: item.driver.phone,
                        beginMiles: item.car.beginMiles,
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
    }

};
</script>
<style lang="scss">
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
    .title-right{
        font-weight: 600;
        font-size: 15px;
    }
    .title-span{
        margin-left: 38px;
        color: #e77676;
        font-style: oblique;
        font-size: 12px;
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
    .form-row{
      margin-left: 20px;
    }
}
</style>