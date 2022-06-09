<template>
    <el-form ref="elForm" label-suffix=":" :model="formData" :rules="rules" label-width="112px">
        <div class="form-row" v-for="(item, index) in formData.list" :key="'id' + index">
            <template>
                <el-row :gutter="24">
                    <el-col>
                        <div>
                            <span class="title-right">车辆</span>
                            <el-button class="delete-color" type="text" @click="deleteCar(index)">
                                <i class="el-icon-delete" />删除
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
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
import { gcjcDriverClassList } from "@/api/driver";
import { vehicleInfoGetAvailableCar, vehicleInfoIsRestriction } from "@/api/vehicleInfo";
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
            buttonCode: '',
            row: null,
        }
    },
    created() {
    },
    methods: {
        init (row) {
            this.row = row;
            this.gcjcDriverClassList(row.unitCode, row.usageDate);
            this.vehicleInfoGetAvailableCar(row.unitCode, row.deptId);
        },
        addCarButton () {
            this.formData.list.push({driver: {}, car: {},carName: ''});
        },
        deleteCar(index) {
            if(this.formData.list.length > 1){
                this.formData.list.splice(index, 1)
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
            })
        },
        vehicleInfoGetAvailableCar (unitCode, deptId) {
            let obj = {
                unitCode: unitCode,
                deptId: deptId,
            }
            vehicleInfoGetAvailableCar(obj).then(({data}) => {
                this.vehicleList = data
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