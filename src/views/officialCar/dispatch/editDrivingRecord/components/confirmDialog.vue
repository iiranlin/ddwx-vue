<template>
    <div>
        <el-dialog title="信息确认" center :visible.sync="dialogVisible" width="40%">
            <div v-for="(item,index) in carList" :key="index">
                <p class="calendar-p-span">
                    <span>{{item.carNumber}}</span>
                    <span> 还车里程 </span>
                    <span>{{item.endMiles}}</span>
                    <span> KM，</span>
                    <span>行驶 </span>
                    <span :class="[item.endMiles-item.beginMiles>100?'red-color':'green-color']">{{checkMiles(item)}}</span>
                    <span> KM</span>
                </p>
            </div>
            <p class="tip-p">以上信息确认无误再提交！</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm()">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        return {
            dialogVisible:false,
            carList:[],
        }
    },
    methods: {
        init(formList){
            this.dialogVisible = true;
            this.carList = formList;
        },
        checkMiles(item){
            let endMiles = parseFloat(item.endMiles);
            let beginMiles = parseFloat(item.beginMiles);
            return (endMiles-beginMiles).toFixed(2);
        },
        handleConfirm(){
            this.dialogVisible = false;
            this.$emit('confirmDialogSuccess')
        }
    },
}
</script>
<style lang="scss" scoped>
.calendar-p-span {
    text-align: center;

    span {
        padding-left: 5px;
        &:nth-child(1){
            font-weight: 700;
        }
        &:nth-child(3){
            color: #6292ff;
            font-weight: 700;
        }
    }
}
.tip-p {
    text-align: center;
    margin-top: 30px;
}
.green-color {
    color: #4da32d;
    font-weight: 700;
}
.red-color {
    color: red;
    font-weight: 700;
}
</style>