<template>
    <el-form ref="elForm" :inline="true" :model="formData" label-width="112px">
        <div class="form-row" v-for="(item, index) in formData.list" :key="index">
            <el-row :gutter="24">
                <el-col>
                    <div>
                        <span class="title-right">车辆{{index+1}}</span>
                        <el-button class="delete-color" type="text" @click="deleteCar(index)">
                            <i class="el-icon-delete" />删除
                        </el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="指派司机:" :prop="`list.${index}.driver`" :rules="rules.driver">
                        <el-select
                            v-model="item.driver"
                            placeholder="请选择司机"
                            clearable
                            filterable
                            value-key="driverCode"
                            @change="driverChange(index)"
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
                    <el-form-item label="指派车辆:" :prop="`list.${index}.car`" :rules="rules.car">
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
                    <el-form-item label="车辆限行信息:" :prop="`list.${index}.carName`">
                        <template slot="label">
                            <span style="position: relative">车辆限行信息:<i style="position: absolute;top: 1px;left: -15px;color: #ec8b23;" class="el-icon-warning-outline" /></span>
                        </template>
                        <span style="color: red">{{item.carName == '操作成功' ? '' : item.carName}}</span>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row>
                <el-col :span="8">
                    <el-form-item label="出场里程:">
                        <el-input disabled v-model="item.car.beginMiles" style="width: 217px" maxlength="200" placeholder="请输入出场里程" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="下次保养里程:">
                        <el-input disabled v-model="item.car.nextMaintainMiles" style="width: 217px" maxlength="200" placeholder="请输入下次保养里程" />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row>
                <el-col :span="8">
                    <el-form-item label="保养时间:">
                        <el-input disabled v-model="item.car.maintainDate" style="width: 217px" maxlength="200" placeholder="请输入保养时间" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保养里程:">
                        <el-input disabled v-model="item.car.maintainMiles" style="width: 217px" maxlength="200" placeholder="请输入保养里程" />
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
    </el-form>
</template>

<script>
import { gcjcDriverClassList } from "@/api/driver";
import { vehicleInfoGetAvailableCar, vehicleInfoIsRestriction } from "@/api/vehicleInfo";
export default {
    data() {
        return {
            driverList: [],
            vehicleList: [],
            formData: {
                list: [
                    {driver: {}, car: {}, carName: ''}
                ]
            },
            rules: {
                driver:[
                    {required:true,message:"请选择司机",trigger:"change"}
                ],
                car:[
                    {required:true,message:"请选择车辆",trigger:"change"}
                ],
            },
            row: null,
        }
    },
    created() {
        if(this.$route.query.row){
            let row = JSON.parse(this.$route.query.row);
            this.row = row;
            this.gcjcDriverClassList(row.reassignUnitCode || row.unitCode || row.deptId, row.usageDate);
            this.vehicleInfoGetAvailableCar(row.unitCode, row.deptId)
        }
    },
    methods: {
        addCarButton () {
            this.formData.list.push({driver: {}, car: {},carName: ''});
        },
        deleteCar(index) {
            this.formData.list.splice(index, 1)
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
        driverChange (index) {
            
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