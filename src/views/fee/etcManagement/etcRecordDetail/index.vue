<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="1.5">
                <el-button type="primary" size="mini" @click="handleBack()">返回</el-button>
            </el-col>
        </el-row>
        <div>
            <div class="table-title">
                <span>公务用车ETC记录单</span>
            </div>
            <div class="table-title-column">
                <div style="width:40%;float:left">
                    <span>单位名称：{{tableData.unitName}}</span>
                </div>
                <div style="width:20%;float:left">
                     <span>交易日期：{{parseTime(tableData.transDate,'{y}-{m}-{d}')}}</span>
                </div>
                <div style="width:20%;float:right;text-align:right;">
                     <span>{{tableData.cardNumber}}</span>
                </div>
            </div>
            <table class="talbe-container" border="1" style="text-align:center">
                <tr>
                    <td class="td1">车牌号</td>
                    <td class="td2">{{tableData.carNumber}}</td>
                    <td class="td3">车架号</td>
                    <td class="td4">{{tableData.vinNumber}}</td>
                    <td class="td5">交易类型</td>
                    <td class="td6">{{tableData.incomeOrExp === 'Y'?'充值':'消费'}}</td>
                </tr>
                <tr>
                    <td class="td1">费用类型</td>
                    <td class="td2">{{tableData.expType === '1'?'停车费':'路桥费'}}</td>
                    <td class="td3">交易金额（元）</td>
                    <td class="td4">{{tableData.transFee}}</td>
                    <td class="td5">余额（元）</td>
                    <td class="td6">{{tableData.balance}}</td>
                </tr>
                <tr >
                    <td class="remark-td">摘要</td>
                    <td class="remark-td" colspan="5">{{tableData.remark}}</td>
                </tr>
            </table>
            <div class="table-bottom">
                <span>记账日期：{{parseTime(tableData.bookTime,'{y}-{m}-{d}')}}</span>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name:'etcRecordDetail',

    data () {
        return {
            tableData:{},
        }
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        },
    },
    activated() {
        let obj = JSON.parse(this.$route.query.obj);

        if(this.tableData.id !== obj.id){
            this.tableData = Object.assign({}, obj)
        }
    },
    methods: {
        //返回按钮
        handleBack(){
            this.closeCurrentPage();
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
.table-bottom {
    font-size: 14px;
    width:40%;
    float:right;
    text-align: right;
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
    height: 40px;
}
.remark-td {
    height: 120px;
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
</style>