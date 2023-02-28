<template>
    <div class="app-container">
        <div>
            <div class="table-title">
                <span>公务用车行车记录单</span>
            </div>
            <div class="table-title-column">
                <div style="width:40%;float:left">
                    <span>单位名称：{{tableData.unitName}}</span>
                </div>
                <div style="width:20%;float:left">
                     <span>{{tableData.usageDate}}</span>
                </div>
                <div style="width:20%;float:right;text-align:right;">
                     <span>{{tableData.reqNo}}</span>
                </div>
            </div>
            <table class="talbe-container" border="1" style="text-align:center">
                <tr>
                    <td class="td1">车型</td>
                    <td class="td2">{{tableData.carBrand}}{{tableData.carSeries}}</td>
                    <td class="td3">车牌号</td>
                    <td class="td4">{{tableData.carNumber}}</td>
                    <td class="td5">司机姓名</td>
                    <td class="td6">{{tableData.driver}}</td>
                </tr>
                <tr>
                    <td>用车部门</td>
                    <td>{{tableData.deptName}}</td>
                    <td>用车事由</td>
                    <td colspan='3'>{{tableData.reason}}</td>
                </tr>
                <tr>
                    <td>用车时间</td>
                    <td>{{tableData.usageTime}}</td>
                    <td>行驶区间</td>
                    <td colspan='3'>{{tableData.itinerayDescription}}</td>
                </tr>
                <tr>
                    <td>行驶里程</td>
                    <td>{{tableData.drivingMiles}}</td>
                <td >
                        <div class="split-div-left">等时</div>
                        <div class="split-div-right">{{tableData.waitingTime}}</div>
                    </td>
                    <td>
                        <div class="split-div-left">合计公里</div>
                        <div class="split-div-right">{{tableData.drivingMiles}}</div>
                    </td>
                    <td>
                        <div class="split-div-left">其他费用</div>
                        <div class="split-div-right">{{tableData.otherFess}}</div>
                    </td>
                    <td>
                        <div class="split-div-left">计价（元）</div>
                        <div class="split-div-right"></div>
                    </td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td colspan="3">{{tableData.remark}}</td>
                    <td>用车人签字</td>
                    <td></td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    name:'drivingRecordDetail',

    data () {
        return {
            tableData:{},
        }
    },
    created() {
        this.tableData = this.$route.params.obj;
    },
    methods: {
        
    },
}
</script>
<style scoped>
.app-container {
    box-sizing: border-box;
    padding: 20px 40px 20px 40px;
}
.table-title {
    margin-top: 30px;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
}
.table-title-column {
    margin: 60px 0px 5px 0px;
    font-size: 14px;
}
.talbe-container {
    margin-top: 10px;
    width: 100%;
    font-size: 14px;
    line-height: 40px;
    border-collapse: collapse;
}

td {
    padding: 0 5px;
}
.td1 {
    width: 10%;
}
.td2 {
    width: 15%;
}
.td3 {
    width: 15%;
}
.td4 {
    width: 20%;
}
.td5 {
    width: 20%;
}
.td6 {
    width: 20%;
}
.split-div-left {
    float: left;
    width: 40%;
    border-right: 1px solid grey;
}
.split-div-right {
    float: left;
    width: 60%;
}
</style>