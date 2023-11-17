<template >
    <div class="app-container">
        <!--车辆信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_use_car.png"/>
                <span>车辆信息</span>
            </div>
            <div class="vehicle-container">
                <div class="vehicle-img">
                    <span>{{formData.carBrand}} - {{formData.carSeries}} {{formData.carModel}}</span>
                    <img :src="checkCarImagePath(formData.carBrand, formData.carSeries)" alt=""/>
                </div>
                <ul class="vehicle-content">
                    <li class="li-item">
                        <span>车牌号：</span>
                        <span>{{formData.carNumber}}</span>
                    </li>
                    <li class="li-item">
                        <span>车架号：</span>
                        <span>{{formData.vinNumber}}</span>
                    </li>
                    <li class="li-item">
                        <span>发动机号：</span>
                        <span>{{formData.engineNumber}}</span>
                    </li>
                    <li class="li-item">
                        <span>车辆品牌：</span>
                        <span>{{formData.carBrand}}</span>
                    </li>
                    <li class="li-item">
                        <span>车辆系列：</span>
                        <span>{{formData.carSeries}}</span>
                    </li>
                    <li class="li-item">
                        <span>车辆型号：</span>
                        <span>{{formData.carModel}}</span>
                    </li>
                    <li class="li-item">
                        <span>车辆类型Ⅰ：</span>
                        <span>{{formData.carType}}</span>
                    </li>
                    <li class="li-item">
                        <span>车辆类型Ⅱ：</span>
                        <span>{{formData.carType2}}</span>
                    </li>
                    <li class="li-item">
                        <span>能源类型：</span>
                        <span>{{formData.powerType}}</span>
                    </li>
                    <li class="li-item">
                        <span>车身颜色：</span>
                        <span>{{formData.color}}</span>
                    </li>
                    <li class="li-item">
                        <span>初登日期：</span>
                        <span>{{parseTime(formData.registerDate,"{y}-{m}-{d}")}}</span>
                    </li>
                    <li class="li-item">
                        <span>排放标准：</span>
                        <span>{{formData.emission}}</span>
                    </li>
                    <li class="li-item">
                        <span>排量：</span>
                        <span>{{formData.capacity}}</span>
                    </li>
                    <li class="li-item">
                        <span>驱动方式：</span>
                        <span>{{checkVehicleProperties(formData.vehicleProperties)}}</span>
                    </li>
                    <li class="li-item">
                        <span>工况油耗：</span>
                        <span>{{formData.fuelConsumotion}}</span>
                    </li>
                    <li class="li-item">
                        <span>初始里程：</span>
                        <span>{{formData.initMiles}}</span>
                    </li>
                    <li class="li-item">
                        <span>燃油标号：</span>
                        <span>{{formData.fuelType}}</span>
                    </li>
                    <li class="li-item">
                        <span>座位数：</span>
                        <span>{{formData.maxMens}}</span>
                    </li>
                    <li class="li-item">
                        <span>核准载重（吨）：</span>
                        <span>{{formData.maxWeight}}</span>
                    </li>
                    <li class="li-item">
                        <span>车辆来源：</span>
                        <span>{{checkSource(formData.vehicleProperties)}}</span>
                    </li>
                    <li class="li-item">
                        <span>车辆用途：</span>
                        <span>{{formData.carUsing}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!--单位信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_detail_unit.png"/>
                <span>单位信息</span>
            </div>
            <div class="ul-parent">
                <ul class="ul-container">
                    <li class="li-item">
                        <span>产权单位：</span>
                        <span>{{formData.unitName}}</span>
                    </li>
                    <li class="li-item">
                        <span>使用单位：</span>
                        <span>{{formData.usageUnitName}}</span>
                    </li>
                    <li class="li-item">
                        <span>使用部门：</span>
                        <span>{{formData.usageDeptName}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!--财务信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_detail_finance.png"/>
                <span>财务信息</span>
            </div>
            <div class="ul-parent">
                <ul class="ul-container">
                    <li class="li-item">
                        <span>固资编码：</span>
                        <span>{{formData.assetsNumber}}</span>
                    </li>
                    <li class="li-item">
                        <span>发票号码：</span>
                        <span>{{formData.invoiceNumber}}</span>
                    </li>
                    <li class="li-item">
                        <span>发票金额：</span>
                        <span>{{formData.invoiceAmount}}</span>
                    </li>
                    <li class="li-item">
                        <span>资金来源：</span>
                        <span>{{formData.carMoneySource}}</span>
                    </li>
                    <li class="li-item">
                        <span>购置依据：</span>
                        <span>{{formData.purchaseBasis}}</span>
                    </li>
                    <li class="li-item">
                        <span>原始价值：</span>
                        <span>{{formData.originalValue}}</span>
                    </li>
                    <li class="li-item">
                        <span>不含税价：</span>
                        <span>{{formData.price}}</span>
                    </li>
                    <li class="li-item">
                        <span>增值税：</span>
                        <span>{{formData.valueAddedTax}}</span>
                    </li>
                    <li class="li-item">
                        <span>购置税：</span>
                        <span>{{formData.purchaseTax}}</span>
                    </li>
                    <li class="li-item">
                        <span>车船使用税：</span>
                        <span>{{formData.usageTax}}</span>
                    </li>
                    <li class="li-item">
                        <span>其他税：</span>
                        <span>{{formData.otherTax}}</span>
                    </li>
                    <li class="li-item">
                        <span>其他费用：</span>
                        <span>{{formData.otherFee}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!--状态信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_dispatch_car.png"/>
                <span>状态信息</span>
            </div>
            <div class="ul-parent">
                <ul class="ul-container">
                    <li class="li-item">
                        <span>车辆状态：</span>
                        <span>{{checkCarStatus(formData.carStatus)}}</span>
                    </li>
                    <li class="li-item">
                        <span>审核状态：</span>
                        <span>{{checkStatus(formData.status)}}</span>
                    </li>
                    <li class="li-item">
                        <span>出车状态：</span>
                        <span>{{checkBusyTag(formData.busyTag)}}</span>
                    </li>
                    <li class="li-item">
                        <span>有效状态：</span>
                        <span>{{checkEnableTag(formData.enableTag)}}</span>
                    </li>
                    <li class="li-item">
                        <span>超标状态：</span>
                        <span>{{checkOverStandardTag(formData.overStandardTag)}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!--租赁信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_log_car.png"/>
                <span>租赁信息</span>
            </div>
            <div class="ul-parent">
                <ul class="ul-container">
                    <li class="li-item">
                        <span>租赁公司：</span>
                        <span>{{formData.rentUnit}}</span>
                    </li>
                    <li class="li-item">
                        <span>合同号：</span>
                        <span>{{formData.rentAgreement}}</span>
                    </li>
                    <li class="li-item">
                        <span>合同期限：</span>
                        <span>{{formData.rentBeginDate}}-{{formData.rentEndDate}}</span>
                    </li>
                    <li class="li-item">
                        <span>租金费用：</span>
                        <span>{{formData.rentPrice}}</span>
                    </li>
                    <li class="li-item">
                        <span>租金描述：</span>
                        <span>{{formData.rentMoneyDesc}}</span>
                    </li>
                    <li class="li-item">
                        <span>申请理由及用途：</span>
                        <span>{{formData.rentApplydesc}}</span>
                    </li>
                </ul>
            </div>
        </div>
         <!--其他信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_log_car.png"/>
                <span>其他信息</span>
            </div>
            <div class="ul-parent">
                <ul class="ul-container">
                    <li class="li-item">
                        <span>保养日期：</span>
                        <span>{{parseTime(formData.maintainDate,"{y}-{m}-{d}")}}</span>
                    </li>
                    <li class="li-item">
                        <span>保养里程：</span>
                        <span>{{formData.maintainMiles}}</span>
                    </li>
                    <li class="li-item">
                        <span>下次保养日期：</span>
                        <span>{{parseTime(formData.nextMaintainDate,"{y}-{m}-{d}")}}</span>
                    </li>
                    <li class="li-item">
                        <span>下次保养里程：</span>
                        <span>{{formData.nextMaintainMiles}}</span>
                    </li>
                    <li class="li-item">
                        <span>出库公里数：</span>
                        <span>{{formData.startMiles}}</span>
                    </li>
                    <li class="li-item">
                        <span>备注：</span>
                        <span>{{formData.remark}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import checkCarImagePath from '@/utils/carPath'

export default {
    name:"vehicleFileDetail",
    data () {
        return {
            formData:{},
            //车辆图片
            checkCarImagePath,
        }
    },
    activated() {
        let obj = JSON.parse(this.$route.query.row);

        if(this.formData.carId !== obj.carId){
            this.formData = Object.assign({}, obj);
        }
    },
    methods: {
        //判断驱动方式
        checkVehicleProperties(vehicleProperties){
            if(vehicleProperties === '2'){
                return '两驱'
            }else if(vehicleProperties === '4'){
                return '四驱'
            }else if(vehicleProperties === '6'){
                return '六驱'
            }
        },
        //判断车辆来源
        checkSource(source){
            if(source === '1'){
                return '自有车辆'
            }else if(source === '2'){
                return '长期租赁车辆'
            }else if(source === '3'){
                return '短期租赁车辆'
            }
        },
        //判断状态信息
        checkCarStatus(carStatus){
            if(carStatus === '0'){
                return '专用车'
            }else if(carStatus === '1'){
                return '维修中'
            }else if(carStatus === '2'){
                return '保养中'
            }
        },
        //判断审核状态
        checkStatus(status){
            if(status === '1'){
                return '待审核'
            }else if(status === '2'){
                return '审核中'
            }else if(status === '3'){
                return '已审核'
            }else if(status === '4'){
                return '已驳回'
            }
        },
        //判断出车状态
        checkBusyTag(busyTag){
            if(busyTag === 'Y'){
                return '是'
            }else if(busyTag === 'N'){
                return '否'
            }
        },
        //判断有效状态
        checkEnableTag(enableTag){
            if(enableTag === 'Y'){
                return '有效'
            }else if(enableTag === 'N'){
                return '无效'
            }
        },
        //判断超标状态
        checkOverStandardTag(overStandardTag){
            if(overStandardTag === 'Y'){
                return '是'
            }else if(overStandardTag === 'N'){
                return '否'
            }
        }
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
                height: 23x;
            }
            span {
                font-size: 14px;
                color: #1b1e22;
            }
        }

        .vehicle-container {
            display: flex;
            padding: 10px 0px 0px 40px;

            .vehicle-img {
                width: 25%;
                display: flex;
                flex-direction: column;

                span {
                    display: inline-block;
                    min-height: 30px;
                    line-height: 30px;
                    font-size: 16px;
                    font-weight: 600;
                }

                img {
                    width: 196px;
                    height: 196px;
                }
            }
            .vehicle-content {
                padding-left: 0px;
                padding-top: 25px;
                width: 75%;

                .li-item {
                    float: left;
                    min-height: 24px;
                    line-height: 24px;
                    min-width: 33%;
                    max-width: 33%;
                    font-size: 12px;
                    display: flex;
                    color: #000000;
                } 
            }
        }

        .ul-parent {
            overflow: hidden;
            padding: 7px 0px 0px 40px;
        }
        .ul-container {
            padding: 0px;
            margin: 0px;
            list-style: none;
        }
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
    }
}
</style>