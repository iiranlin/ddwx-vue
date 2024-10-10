<template>
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="95px">
        <div class="dispatch-car-container" v-for="(carItem, index) in formData.carItemlist" :key="'id' + index">
            <template v-if="carItem.status != 6 && carItem.restatus != 1">
                <el-row :gutter="24">
                    <el-col :span="7">
                        <el-form-item label="指派车辆：" :prop="`carItemlist.${index}.car`" :rules="rules.car">
                            <el-select
                                v-model="carItem.car"
                                placeholder="请选择车辆"
                                value-key="carNumber"
                                size="small"
                                style="width:95%"
                                filterable
                                @change="carNumberChange(index)">
                                <el-option v-for="item in vehicleList"
                                    :key="item.carNumber"
                                    :label="item.carNumber"
                                    :value="item">
                                    <span :class="{'red-weight':item.isRestriction}">{{item.carNumber}}</span>
                                </el-option>
                            </el-select>
                            <el-popover
                                ref="popoverCar"
                                placement="top"
                                trigger="click">
                                <tip-view :dateList="carItem.carTipValueOptions" title='车辆排班情况'></tip-view>
                                <i slot="reference" class="i-tips"></i>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="指派司机：" :prop="`carItemlist.${index}.driver`" :rules="rules.driver">
                            <el-select
                                v-model="carItem.driver"
                                placeholder="请选择司机"
                                value-key="driver"
                                size="small"
                                style="width:95%"
                                filterable
                                ref="template"
                                @change="driverChange(index)"
                                @visible-change="(v) => visibleChange(v, 'template',index)">
                                <el-option v-for="item in carItem.driverList"
                                    :key="item.driverCode"
                                    :label="item.driver"
                                    :value="item">
                                </el-option>
                            </el-select>
                            <el-popover
                                ref="popoverDriver"
                                placement="bottom"
                                trigger="click">
                                <tip-view :dateList="carItem.driverTipValueOptions" title='司机排班情况'></tip-view>
                                <i slot="reference" class="i-tips"></i>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="限行状态：">
                            <i :class="[checkRestriction(carItem.restriction,carItem.car.carNumber)==='不限行'?'i-success':'i-error']" v-if="!!carItem.restriction"></i>
                            <span>{{checkRestriction(carItem.restriction,carItem.car.carNumber)}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <div class="button-delete" @click="deleteCar(index)">
                            <i class="i-delete"></i>
                            <span>删除</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="7">
                        <el-form-item label="出场里程：">
                            <span>{{carItem.car.startMiles}}km</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="下次保养里程：">
                            <span>{{carItem.car.nextMaintainMiles}}km</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="保养时间：">
                            <span>{{parseTime(carItem.car.maintainDate,'{y}-{m}-{d}')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="保养里程：">
                            <span>{{carItem.car.maintainMiles}}km</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
        </div>
    </el-form>
</template>

<script>
  import {getRGAvailableDriver} from "@/api/gcjcDriverClass";
  import {
    gcywVehicleRequestRequestTimeInfo,
    vehicleInfoGetAvailableCar,
    vehicleInfoIsRestriction
  } from "@/api/vehicleInfo";
  import {gcywVehicleRequestCheckRequestInfo, reassignment, saveOrderDispatch} from "@/api/gcywVehicleRequest";
  import tipView from './tipView.vue';

  export default {
     components: { tipView },

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
            //订单数据
            row:{},
            //派车类型
            buttonCode:'',
            //车辆数据
            vehicleList: [],
            //表单数据
            formData: {
                carItemlist: [],
            },

            rules: {
                driver:[
                    { required: true, validator: checkfromDriver, trigger: "change" }
                ],
                car:[
                    { required: true, validator: checkfromCar, trigger: "change" }
                ],
            },
        }
    },
    created() {
        if(this.$route.query.row){
            this.row  = JSON.parse(this.$route.query.row);
            this.buttonCode = this.$route.query.buttonCode;
            this.vehicleInfoGetAvailableCar();
        }
    },
    methods: {
        //获取车辆信息
        vehicleInfoGetAvailableCar () {
            let obj = {
                unitCode: this.row.unitCode,
                deptId: this.row.deptId,
                tunUnitCode: this.row.reassignUnitCode || '',
                cityId: this.row.fromAreaId.split(',')[1],
                date: this.row.usageDate,
            }
            vehicleInfoGetAvailableCar(obj, this.row.reassignUnitCode).then(({data}) => {
                this.vehicleList = data

                if(this.buttonCode === 'sendVehicle'){      //派车
                    this.addCarItem();
                } else {
                    this.echoCarItem()
                }
            })
        },
        //改派回显车辆
        echoCarItem(){
          this.row.reqAssignments.map((item, index) => {
            let obj = {
              driver:{},
              car:{},
              restriction:'',
              driverList: [], //隐藏后的司机数据
              originDriverList:[],    //所有的司机数据
              moreStaus:true,     ////是否显示司机更多按钮
              driverTipValueOptions:[],   //司机排班数据
              carTipValueOptions:[],   //车辆排班数据
            }
            let carItem = this.vehicleList.filter((car) => {
              return car.vinNumber === item.vinNumber;
            });
            obj.id = item.id
            obj.car = carItem[0]
            this.formData.carItemlist.push(obj);
            this.carNumberChange(index, item.driverId);
          })
        },
        //添加车辆
        addCarItem(){
            let obj = {
                driver:{},
                car:{},
                restriction:'',
                driverList: [], //隐藏后的司机数据
                originDriverList:[],    //所有的司机数据
                moreStaus:true,     ////是否显示司机更多按钮
                driverTipValueOptions:[],   //司机排班数据
                carTipValueOptions:[],   //车辆排班数据
            }
            this.formData.carItemlist.push(obj);

            //默认取第一条车辆信息
            this.formData.carItemlist[this.formData.carItemlist.length-1].car = this.vehicleList[0];
            this.carNumberChange(this.formData.carItemlist.length-1);
        },
        //车辆信息改变回调
        carNumberChange (index,driver) {
            let carNumber = this.formData.carItemlist[index].car.carNumber;

            //清除数据
            this.formData.carItemlist[index].restriction = '';
            this.formData.carItemlist[index].driver = '';
            this.formData.carItemlist[index].driverList = [];
            this.formData.carItemlist[index].originDriverList = [];
            this.formData.carItemlist[index].moreStaus = false;
            this.formData.carItemlist[index].carTipValueOptions = [];

            if(!!carNumber){
                //查询限行信息
                this.vehicleInfoIsRestriction(carNumber, index);

                //获取可选司机
                let vinNumber = this.formData.carItemlist[index].car.vinNumber;
                if(!!vinNumber){
                    this.getRGAvailableDriver(this.row.reassignUnitCode || this.row.assignUnitCode || this.row.deptId, this.row.usageDate,vinNumber,index,driver);
                }
                //获取车辆排班情况
                let params = {
                    usageDate:this.row.usageDate,
                    vinNumber:this.formData.carItemlist[index].car.vinNumber,
                }
                gcywVehicleRequestRequestTimeInfo(params).then(({data}) => {
                    if(data.length !== 0){
                        this.initCarTips(data,index);
                    }
                    this.$refs.popoverCar[index].doShow();
                }).catch((err) => {

                })
            }
        },
        //初始化车辆排班数据
        initCarTips(data,index){
            let tipObj = {
                tipArr:data,
            }
            this.formData.carItemlist[index].carTipValueOptions.push(tipObj)
        },
        //司机信息改变回调
        driverChange(index){
            //清除数据
            this.formData.carItemlist[index].driverTipValueOptions = [];

            let params = {
                usageDate:this.row.usageDate,
                driverId:this.formData.carItemlist[index].driver.driverCode,
            }
            gcywVehicleRequestRequestTimeInfo(params).then(({data}) => {
                if(data.length !== 0){
                    this.initDriverTips(data,index);
                }
                this.$refs.popoverDriver[index].doShow();
            }).catch((err) => {

            })
        },
        //初始化司机排班数据
        initDriverTips(data,index){
            let tipObj = {
                tipArr:data,
            }
            this.formData.carItemlist[index].driverTipValueOptions.push(tipObj)
        },
        //查询限行信息
        vehicleInfoIsRestriction (carNumber, index) {
            let obj = {
                carNumber: carNumber,
                cityId: this.row.fromAreaId.split(',')[1],
                date: this.row.usageDate
            }
            vehicleInfoIsRestriction(obj).then(({message}) => {
                this.formData.carItemlist[index].restriction = message;
            }).catch((err) => {

            })
        },
        //获取司机信息
        getRGAvailableDriver (unitCode, usageDate,vinNumber,index,driver) {
            let obj = {
                classDateEnd: usageDate,
                classDateStart: usageDate,
                classId: 'none',
                flag:  0,
                unitCode: unitCode,
                vinNumber:vinNumber,
                usageTime: this.row.usageTime,
            }
            getRGAvailableDriver(obj).then(({data}) => {
                //原始数据
                let originDriverList = data;

                //获取显示的数据
                let driverList = originDriverList.filter((item) => {
                    return item.type === '1';
                })
                if(driverList.length === 0){
                    driverList = originDriverList;
                    this.formData.carItemlist[index].moreStaus = false;
                }else {
                    this.formData.carItemlist[index].moreStaus = true;
                }
                this.formData.carItemlist[index].driverList = driverList;
                this.formData.carItemlist[index].originDriverList = originDriverList;
                if(this.buttonCode === 'sendVehicle'){      //派车
                  this.formData.carItemlist[index].driver = driverList[0];
                } else {
                  let driverItem = originDriverList.filter((item) => {
                    return item.driverCode === driver;
                  });
                  if (driverItem[0] && !driverList.includes(driverItem[0])) {
                    this.formData.carItemlist[index].moreStaus = false;
                    this.handleMoreClick(index)
                  }
                  this.formData.carItemlist[index].driver = driverItem[0] ? driverItem[0] : driverList[0]
                }
                this.driverChange(index);
            }).catch((err) => {

            })
        },
        //判断是否限行
        checkRestriction(restriction,carNumber){
            if(!restriction || !carNumber){
                return
            }
            if(restriction == '操作成功'){
                return '不限行';
            }
            let arr = restriction.split('和');
            let number = carNumber.substr(carNumber.length-1) ;

            if(arr.includes(number)){
                return '今日限行';
            }
            return '不限行';
        },
        //删除车辆
        deleteCar(index) {
          if (this.buttonCode !== 'sendVehicle' && this.formData.carItemlist[index].id) {
            this.row.reqAssignments.forEach(item => {
              if (this.formData.carItemlist[index].id === item.id) {
                item.restatus = "1";
              }
            })
          }
          this.formData.carItemlist.splice(index, 1);
        },
        //保存
        addRequest () {
            this.$refs.elForm.validate((valid) => {
                if (valid) {
                    let params = {
                        fromAddr:this.row.fromAddr,
                        toAddr:this.row.toAddr,
                        usageDate:this.row.usageDate,
                        usageTime:this.row.usageTime,
                        id:this.row.id,
                    }
                    //时间地点重合校验
                    gcywVehicleRequestCheckRequestInfo(params).then(({message}) => {
                        if(message.includes('建议合理派车')){
                            this.$modal.confirm(message +'是否继续派车？').then(() => {
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
        //派车
        requestDispatch(){
            if(this.formData.carItemlist.length === 0){
                this.$modal.msgWarning('请至少添加一条派车信息');
                return
            }
            //检查是否有重复司机
            for (let i = 0; i < this.formData.carItemlist.length; i++) {
              let driverCode = this.formData.carItemlist[i].driver.driverCode;

              for (let j = i+1; j < this.formData.carItemlist.length; j++) {
                if(driverCode === this.formData.carItemlist[j].driver.driverCode){
                  this.$modal.msgWarning('指派司机不能重复，请重新选择!');
                  return
                }
              }
            }
            //检查是否有重复车辆
            for (let i = 0; i < this.formData.carItemlist.length; i++) {
              let carNumber = this.formData.carItemlist[i].car.carNumber;

              for (let j = i+1; j < this.formData.carItemlist.length; j++) {
                if(carNumber === this.formData.carItemlist[j].car.carNumber){
                  this.$modal.msgWarning('指派车辆不能重复，请重新选择!');
                  return
                }
              }
            }
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
            if(this.buttonCode !== 'sendVehicle'){
              let num = 0
              let carArr = []
              this.formData.carItemlist.forEach(item => {
                carArr.push(item.id)
              })
              for (let j = 0; j < this.row.reqAssignments.length; j++) {
                if (!carArr.includes(this.row.reqAssignments[j].id) && this.row.reqAssignments[j].restatus === '1') {
                  obj.reqAssignments.push(this.row.reqAssignments[j]);
                }
              }
              outerLoop:
              for (let i = 0; i < this.formData.carItemlist.length; i++) {
                  let carNumber = this.formData.carItemlist[i].car.carNumber;
                  let driverCode = this.formData.carItemlist[i].driver.driverCode;
                  for (let j = 0; j < this.row.reqAssignments.length; j++) {
                    if (this.formData.carItemlist[i].id === this.row.reqAssignments[j].id) {
                      if (carNumber===this.row.reqAssignments[j].carNumber && driverCode===this.row.reqAssignments[j].driverId) {
                        num++
                        continue outerLoop
                      }
                      if (carNumber!==this.row.reqAssignments[j].carNumber || driverCode!==this.row.reqAssignments[j].driverId) {
                        this.row.reqAssignments[j].restatus = "1";
                        obj.reqAssignments.push(this.row.reqAssignments[j]);
                        obj.reqAssignments.push(
                          {
                            id: null,
                            restatus: this.formData.carItemlist[i].restatus || null,
                            driver: this.formData.carItemlist[i].driver.realName,
                            driverId: this.formData.carItemlist[i].driver.driverCode,
                            driverPhone: this.formData.carItemlist[i].driver.phone,
                            beginMiles: this.formData.carItemlist[i].car.startMiles,
                            carNumber: this.formData.carItemlist[i].car.carNumber,
                            conditionDesc: this.formData.carItemlist[i].car.conditionDesc,
                            vinNumber: this.formData.carItemlist[i].car.vinNumber,
                          })
                        continue outerLoop
                      }
                    }
                  }
                  obj.reqAssignments.push(
                    {
                      id: null,
                      restatus: this.formData.carItemlist[i].restatus || null,
                      driver: this.formData.carItemlist[i].driver.realName,
                      driverId: this.formData.carItemlist[i].driver.driverCode,
                      driverPhone: this.formData.carItemlist[i].driver.phone,
                      beginMiles: this.formData.carItemlist[i].car.startMiles,
                      carNumber: this.formData.carItemlist[i].car.carNumber,
                      conditionDesc: this.formData.carItemlist[i].car.conditionDesc,
                      vinNumber: this.formData.carItemlist[i].car.vinNumber,
                    })
              }
              if (num === this.formData.carItemlist.length && this.formData.carItemlist.length === this.row.reqAssignments.length) {
                this.$modal.msgWarning('派车信息无变化，请重新选择!');
                return
              }
            } else {
              this.formData.carItemlist.forEach( (item) => {
                obj.reqAssignments.push(
                  {
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
            }
            if(this.buttonCode == 'sendVehicle'){
                saveOrderDispatch(obj).then( ({message}) => {
                    this.$modal.msgSuccess(message);
                    this.$router.push({name:'workspace'});
                }).catch((err) => {

                })
            }else{
                reassignment(obj).then( ({message}) => {
                    this.$modal.msgSuccess(message);
                    this.$router.push({name:'workspace'});
                }).catch((err) => {

                })
            }
        },
        visibleChange(visible,refName,index) {
            if (visible) {
                const ref = this.$refs[refName];
                let popper = ref[index].$refs.popper;
                if (popper.$el) popper = popper.$el;

                //判断当前是否要显示更多
                if(this.formData.carItemlist[index].moreStaus){
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
                            this.handleMoreClick(index);
                            element.style.display = 'none';
                        };
                    }
                }else{
                    if (Array.from(popper.children).some(v => v.className === 'el-template-more')){
                        let element = document.getElementsByClassName('el-template-more')[index];
                        popper.removeChild(element)
                    }
                }
            }
        },
        handleMoreClick(index){
            this.formData.carItemlist[index].driverList = this.formData.carItemlist[index].originDriverList;
        },
    }
};
</script>
<style lang="scss" scoped>
.dispatch-car-container {
    padding-right: 20px;
    padding-left: 24px;
    margin-top: 10px;
    border-bottom: 1px solid #f3f5f7;

    span {
        font-size: 12px;
    }
    i {
        display: inline-block;
        margin-right: 5px;
        width: 16px;
        height: 16px;
        background-size: cover;
        background-position: center;
        transform: translateY(2px);
    }
    .button-delete {
        width: 100px;
        position: absolute;
        right: 0px;
        top: 10px;

        &:hover {
            cursor: pointer;
        }
    }
    .i-tips {
        position: absolute;
        right: -15px;
        top: 7px;
        background-image:url('/static/icon_tips.png');

        &:hover {
            cursor: pointer;
        }
    }
    .i-success {
        background-image:url('/static/icon_success.png');
    }
    .i-error {
        background-image:url('/static/icon_stop.png');
    }
    .i-delete {
        background-image:url('/static/icon_delete.png');
    }
}
.red-weight {
    color: #ff0033;
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
::v-deep .el-col {
    padding-left: 0px !important;
    padding-right: 0px !important;
}
</style>
