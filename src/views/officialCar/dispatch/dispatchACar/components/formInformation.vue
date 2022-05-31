<template>
    <el-form ref="elForm" label-suffix=":" :inline="true" :model="formData" :rules="rules" label-width="112px">
        <div class="form-row" v-for="(item, index) in formData.list" :key="'id' + index">
            <template v-if="item.status != 6 && item.restatus != 1">
                <el-row :gutter="24">
                    <el-col>
                        <div>
                            <span class="title-right">车辆</span>
                            <el-button :disabled="!(item.status == 1 || item.status == 2 || !item.status) && buttonCode == 'reassignment'" class="delete-color" type="text" @click="deleteCar(index)">
                                <i class="el-icon-delete" />删除
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="指派司机" :prop="`list.${index}.driver`" :rules="rules.driver">
                            <el-select
                                v-model="item.driver"
                                placeholder="请选择司机"
                                clearable
                                filterable
                                value-key="driverCode"
                            >
                                <el-option v-for="item in driverList" 
                                :key="item.driverCode" 
                                :label="item.driver" 
                                :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="指派车辆" :prop="`list.${index}.car`" :rules="rules.car">
                            <el-select
                                v-model="item.car"
                                placeholder="请选择车辆"
                                clearable
                                filterable
                                value-key="carNumber"
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
                        <el-form-item label="车辆限行信息">
                            <template slot="label">
                                <span style="position: relative">车辆限行信息:<i style="position: absolute;top: 1px;left: -15px;color: #ec8b23;" class="el-icon-warning-outline" /></span>
                            </template>
                            <span style="color: red">{{item.carName == '操作成功' ? '不限行' : item.carName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="出场里程">
                            <el-input disabled v-model="item.car.beginMiles" style="width: 217px" maxlength="200" placeholder="请输入出场里程" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="下次保养里程">
                            <el-input disabled v-model="item.car.nextMaintainMiles" style="width: 217px" maxlength="200" placeholder="请输入下次保养里程" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="保养时间">
                            <el-input disabled v-model="item.car.maintainDate" style="width: 217px" maxlength="200" placeholder="请输入保养时间" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保养里程">
                            <el-input disabled v-model="item.car.maintainMiles" style="width: 217px" maxlength="200" placeholder="请输入保养里程" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
        </div>
    </el-form>
</template>

<script>
import { gcjcDriverClassList } from "@/api/driver";
import { vehicleInfoGetAvailableCar, vehicleInfoIsRestriction } from "@/api/vehicleInfo";
import { saveOrderDispatch, reassignment } from "@/api/gcywVehicleRequest";
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
            if(this.buttonCode == 'sendVehicle'){
                this.addCarButton();
            }
            this.gcjcDriverClassList(row.reassignUnitCode || row.unitCode || row.deptId, row.usageDate);
            this.vehicleInfoGetAvailableCar(row.unitCode, row.deptId);
        }
    },
    methods: {
        addCarButton () {
            this.formData.list.push({driver: {}, car: {},carName: ''});
        },
        deleteCar(index) {
            let list = this.formData.list, num = 0;
            for(let i = 0;i<list.length;i++){
                if(list[i].restatus != 1){
                    ++num
                }
            }
            if(this.formData.list.length > 1 && num > 1){
                if(this.formData.list[index].id){
                    this.formData.list[index].restatus = 1;
                }else{
                    this.formData.list.splice(index, 1)
                }
            }else{
                this.$modal.msgWarning('至少有一条数据！');
            }
        },
        gcjcDriverClassList (unitCode, usageDate) {
            let obj = {
                classDateEnd: usageDate,
                classDateStart: usageDate,
                classId: 'none',
                flag:  0,
                unitCode: unitCode,
            }
            gcjcDriverClassList(obj).then(({data}) => {
                this.driverList = data.list
                this.num = ++this.num;
            })
        },
        vehicleInfoGetAvailableCar (unitCode, deptId) {
            let obj = {
                unitCode: unitCode,
                deptId: deptId,
            }
            vehicleInfoGetAvailableCar(obj).then(({data}) => {
                this.vehicleList = data
                this.num = ++this.num;
            })
        },
        vehicleInfoIsRestriction (carNumber, index) {
            let cityId = this.row.fromAreaId.split(',');
            let obj = {
                carNumber: carNumber,
                cityId: cityId[1],
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
        },
        addRequest () {
            this.$refs.elForm.validate( (valid) => {
                if (valid) {
                    let formList = this.formData.list;
                    let obj = {
                        status: this.row.status,
                        id: this.row.id,
                        createType: this.row.createType,
                        usageDate: this.row.usageDate,
                        usageTime: this.row.usageTime,
                        handleUserId: this.row.handleUserId,
                        handleUserName: this.row.handleUserName,
                        handleUnit: this.row.handleUnit,
                        handleUnitCode: this.row.handleUnitCode,
                        reqAssignments: []
                    }
                    formList.forEach( (item) => {
                      obj.reqAssignments.push({
                        id: item.id || null,
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
                    if(this.buttonCode == 'sendVehicle'){
                        saveOrderDispatch(obj).then( ({message}) => {
                            this.$modal.msgSuccess(message);
                            this.$router.push({name:'workspace'});
                        })
                    }else{
                        reassignment(obj).then( ({message}) => {
                            this.$modal.msgSuccess(message);
                            this.$router.push({name:'workspace'});
                        })
                    }
                }
            })
        },
    }
};
</script>
<style lang="scss" scoped>

    .el-icon-caret-right{
      font-size: 20px;
      color: #{'var(--theme)'};
    }
</style>