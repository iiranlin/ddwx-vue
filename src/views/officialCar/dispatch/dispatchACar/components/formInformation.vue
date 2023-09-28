<template>
    <el-form ref="elForm" label-suffix=":" :model="formData" :rules="rules" label-width="112px">
        <div class="form-row" v-for="(item, index) in formData.list" :key="'id' + index">
            <template v-if="item.status != 6 && item.restatus != 1 && !item.id">
                <el-row :gutter="24">
                    <el-col>
                        <div>
                            <span class="title-right">车辆</span>
                            <el-button class="delete-color" type="text" @click="deleteCar(index)" v-if="item.status !=4 && item.status !=5">
                                <i class="el-icon-delete" />删除
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="指派车辆" :prop="`list.${index}.car`" :rules="rules.car">
                            <el-select
                                v-model="item.car"
                                placeholder="请选择车辆"
                                clearable
                                filterable
                                value-key="carNumber"
                                :disabled="item.id?true : false"
                                @change="carNumberChange(index)"
                            >
                                <el-option v-for="item in vehicleList"
                                :key="item.carNumber" 
                                :label="item.carNumber" 
                                :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="指派司机" :prop="`list.${index}.driver`" :rules="rules.driver">
                            <el-select
                                v-model="item.driver"
                                placeholder="请选择司机"
                                clearable
                                filterable
                                value-key="driverCode"
                                :disabled="item.id?true : false"
                                ref="template"
                                @visible-change="(v) => visibleChange(v, 'template',index)">
                                <el-option v-for="item in driverList" 
                                :key="item.driverCode" 
                                :label="item.driver" 
                                :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆限行信息">
                            <template slot="label">
                                <span style="position: relative">车辆限行信息:<i style="position: absolute;top: 1px;left: -15px;color: #ec8b23;" class="el-icon-warning-outline" /></span>
                            </template>
                            <span style="color: red">{{item.carName == '操作成功' ? '不限行' : item.carName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="出场里程">
                            <el-input disabled v-model="item.car.startMiles" maxlength="200" placeholder="请输入出场里程" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="下次保养里程">
                            <el-input disabled v-model="item.car.nextMaintainMiles" maxlength="200" placeholder="请输入下次保养里程" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="保养时间">
                            <el-input disabled :value="parseTime(item.car.maintainDate, '{y}-{m}-{d}')" maxlength="200" placeholder="请输入保养时间" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保养里程">
                            <el-input disabled v-model="item.car.maintainMiles" maxlength="200" placeholder="请输入保养里程" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
        </div>
    </el-form>
</template>

<script>
import { getRGAvailableDriver } from "@/api/gcjcDriverClass";
import { vehicleInfoGetAvailableCar, vehicleInfoIsRestriction } from "@/api/vehicleInfo";
import { saveOrderDispatch, reassignment,gcywVehicleRequestCheckRequestInfo } from "@/api/gcywVehicleRequest";
export default {
    data() {
        var checkfromDriver = (rule, value, callback) => {
            if(JSON.stringify(value) != '{}' && value){
                return callback();
            }else{
                return callback(new Error('请选择司机'));
            }
        }
        var checkfromCar = (rule, value, callback) => {
            if(JSON.stringify(value) != '{}' && value){
                return callback();
            }else{
                return callback(new Error('请选择车辆'));
            }
        }
        return {
            driverList: [],
            originDriverList:[],
            vehicleList: [],
            formData: {
                list: [],
            },
            rules: {
                driver:[
                    { required: true, validator: checkfromDriver, trigger: "change" }
                ],
                car:[
                    { required: true, validator: checkfromCar, trigger: "change" }
                ],
            },
            row: null,
            num: 0,
            buttonCode: '',
            moreStaus:true,
        }
    },
    watch: {
        'num': {
            handler: function (newNum) {
                if(newNum == 2 && this.buttonCode == 'reassignment'){
                    this.$nextTick( () => {
                        let driver = [], car = [];
                        this.row.reqAssignments.forEach( (item, i) => {
                            this.driverList.forEach( (items) => {
                                if(items.driverCode == item.driverId){
                                    driver.push({item: items, status: item.status, id: item.id,restatus: item.restatus});
                                }
                            })
                            this.vehicleList.forEach( (items) => {
                                if(items.carNumber == item.carNumber){
                                    car.push(items);
                                }
                            })
                        })
                        driver.forEach( (item, i) => {
                            this.formData.list.push({driver: item.item, car: car[i], status: item.status, id: item.id, restatus: item.restatus, carName: ''});
                            this.vehicleInfoIsRestriction(car[i].carNumber, i);
                        })
                    })
                }
            },
        }
    },
    created() {
        this.num = 0;
        if(this.$route.query.row){
            let row = JSON.parse(this.$route.query.row);
            let buttonCode = this.$route.query.buttonCode;
            this.row = row;
            this.buttonCode = buttonCode;
            this.vehicleInfoGetAvailableCar(row);
        }
    },
    methods: {
        addCarButton () {
            this.formData.list.push({driver: {}, car: {},carName: ''});

            this.formData.list[this.formData.list.length-1].car = this.vehicleList[0];
            this.formData.list[this.formData.list.length-1].carNumber = this.vehicleList[0].carNumber;
            this.carNumberChange(this.formData.list.length-1);
        },
        deleteCar(index) {
            if(this.formData.list[index].id){
                this.formData.list[index].restatus = 1;
            }else{
                this.formData.list.splice(index, 1);
            }
        },
        getRGAvailableDriver (unitCode, usageDate,vinNumber,index) {
            let obj = {
                classDateEnd: usageDate,
                classDateStart: usageDate,
                classId: 'none',
                flag:  0,
                unitCode: unitCode,
                vinNumber:vinNumber,
            }
            getRGAvailableDriver(obj).then(({data}) => {
                this.originDriverList = data;

                //隐藏数据
                this.driverList = this.originDriverList.filter((item) => {
                    return item.type === '1';
                })
                if(this.driverList.length === 0){
                    this.driverList = this.originDriverList;
                    this.moreStaus = false;
                }else {
                    this.moreStaus = true;
                }
                this.formData.list[index].driver = this.driverList[0];
                this.num = ++this.num;
            })
        },
        vehicleInfoGetAvailableCar ({unitCode, deptId, reassignUnitCode}) {
            let cityId = this.row.fromAreaId.split(',');
            let obj = {
                unitCode: unitCode,
                deptId: deptId,
                tunUnitCode: reassignUnitCode || '',
                cityId: cityId[1],
                date: this.row.usageDate
            }
            vehicleInfoGetAvailableCar(obj, reassignUnitCode).then(({data}) => {
                this.vehicleList = data
                this.num = ++this.num;

                if(this.$route.query.buttonCode == 'sendVehicle' && this.formData.list.length ===  0){
                    this.addCarButton();
                }
            })
        },
        vehicleInfoIsRestriction (carNumber, index) {
            let cityId = this.row.fromAreaId.split(',');
            let obj = {
                carNumber: carNumber,
                cityId: cityId[1],
                date: this.row.usageDate
            }
            vehicleInfoIsRestriction(obj).then(({message}) => {
                this.formData.list[index].carName = message;
            })
        },
        carNumberChange (index) {
            let carNumber = this.formData.list[index].car.carNumber;
            if(carNumber){
                this.vehicleInfoIsRestriction(carNumber, index);
            }else{
                this.formData.list[index].carName = '';
            }
            //获取可选司机
            this.formData.list[index].driver = {};

            let vinNumber = this.formData.list[index].car.vinNumber;
            if(!!vinNumber){
                this.getRGAvailableDriver(this.row.reassignUnitCode || this.row.assignUnitCode || this.row.deptId, this.row.usageDate,vinNumber,index);
            }
        },
        addRequest () {
            this.$refs.elForm.validate( (valid) => {
                if (valid) {
                    let params = {
                        fromAddr:this.row.fromAddr,
                        toAddr:this.row.toAddr,
                        usageDate:this.row.usageDate,
                        usageTime:this.row.usageTime,
                        id:this.row.id,
                    }
                    gcywVehicleRequestCheckRequestInfo(params).then(({message}) => {
                        if(message.includes('建议合理派车')){
                            this.$modal.confirm(message+'是否继续派车？').then(() => {
                                this.requestDispatch();
                            }).catch(() => {
                
                            });
                        }else{
                            this.requestDispatch();
                        }
                    }).catch((err) => {
                        this.requestDispatch();
                    })    
                }
            })
        },
        requestDispatch(){
            let formList = this.formData.list, num = 0;

            let obj = {
                status: this.row.status,
                id: this.row.id,
                phone: this.row.phone,
                createType: this.row.createType,
                usageDate: this.row.usageDate,
                usageTime: this.row.usageTime,
                handleUserId: this.row.handleUserId,
                handleUserName: this.row.handleUserName,
                handleUnit: this.row.handleUnit,
                handleUnitCode: this.row.handleUnitCode,
                fromAddr: this.row.fromAddr,
                toAddr: this.row.toAddr,
                reqAssignments: []
            }
            for(let i = 0;i<formList.length;i++){
                if(formList[i].restatus != 1){
                    ++num
                }
            }
            if(formList.length <= 0 || num <= 0){
                this.$modal.msgWarning('至少有一条数据！');
                return
            }
            //检查是否有重复司机
            for (let i = 0; i < formList.length; i++) {
                if(!formList[i].id){
                    let driverCode = formList[i].driver.driverCode;

                    for (let j = i+1; j < formList.length; j++) {
                        if(!formList[j].id){
                            if(driverCode===formList[j].driver.driverCode){
                                this.$modal.msgWarning('指派司机不能重复，请重新选择!');
                                 return
                            }
                        }
                    }
                }
            }
            //检查是否有重复车辆
            for (let i = 0; i < formList.length; i++) {
                if(!formList[i].id){
                    let carNumber = formList[i].car.carNumber;

                    for (let j = i+1; j < formList.length; j++) {
                        if(!formList[j].id){
                            if(carNumber===formList[j].car.carNumber){
                                this.$modal.msgWarning('指派车辆不能重复，请重新选择!');
                                return
                            }
                        }
                    }
                }
            }
            if(this.buttonCode !== 'sendVehicle'){
                 //检查是否与改派前的车辆重复
                for (let i = 0; i < formList.length; i++) {
                    if(!formList[i].id){
                        let carNumber = formList[i].car.carNumber;
                        let driverCode = formList[i].driver.driverCode;

                        for (let j = 0; j < this.row.reqAssignments.length; j++) {
                            if(carNumber==this.row.reqAssignments[j].carNumber && driverCode==this.row.reqAssignments[j].driverId){
                                this.$modal.msgWarning('派车信息重复，请重新选择!');
                                return
                            }
                        }
                    }
                }
            }
            formList.forEach( (item) => {
                obj.reqAssignments.push({
                id: item.id || null,
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
            if(this.buttonCode == 'sendVehicle'){
                saveOrderDispatch(obj).then( ({message}) => {
                    this.$modal.msgSuccess(message);
                    this.$router.push({name:'workspace'});
                })
            }else{
                this.row.reqAssignments.forEach((item) => {
                    item.restatus = "1";
                    obj.reqAssignments.push(item);
                })
                reassignment(obj).then( ({message}) => {
                    this.$modal.msgSuccess(message);
                    this.$router.push({name:'workspace'});
                })
            }
        },
        visibleChange(visible, refName,index) {
            if (visible) {
                const ref = this.$refs[refName];
                let popper = ref[index].$refs.popper;
                if (popper.$el) popper = popper.$el;

                //判断当前是否要显示更多
                if(this.moreStaus){
                    if (!Array.from(popper.children).some(v => v.className === 'el-template-more')){
                        const el = document.createElement("div");
                        el.className = "el-template-more";
                        // el.style ="line-height:50px;padding:0; color:#ffffff;";
                        el.style.lineHeight = 50 + 'px';   
                        el.style.padding = 0 ;
                        el.style.color = "#ffffff" ;
                        el.innerHTML =`<span id='more' style="color:#409EFF;font-size:14px;font-weight:600;float:right;margin-right:20px;cursor:pointer;">更多司机</span>`;
                        popper.appendChild(el);
                        let element = el.firstChild;
                        element.onclick = () => {
                            this.handleMoreClick();
                        };
                    }
                }else{
                    if (Array.from(popper.children).some(v => v.className === 'el-template-more')){
                        let element = document.getElementsByClassName('el-template-more')[0];
                        popper.removeChild(element)
                    }
                }
            }
        },
        handleMoreClick(){
            this.driverList = this.originDriverList;
        },
    }
};
</script>
<style lang="scss" scoped>

    .el-icon-caret-right{
      font-size: 20px;
      color: #{'var(--theme)'};
    }
    .form-row{
        ::v-deep .el-select,
        .el-input,
        .el-date-editor {
            width: 95%;
        }
    }
</style>