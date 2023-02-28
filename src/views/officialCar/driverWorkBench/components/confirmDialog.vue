<template>
    <div>
        <el-dialog title="信息确认" center :visible.sync="dialogVisible" append-to-body width="40%">
            <p class="calendar-p-span">
                <span>请确认还车里程 </span>
                <span>{{endMiles}}</span>
                <span> KM，行驶 </span>
                <span :class="[endMiles-beginMiles>100?'red-color':'green-color']">{{checkMiles()}}</span>
                <span> KM</span>
            </p>
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
            endMiles:'',
            beginMiles:'',
        }
    },
    methods: {
        init(endMiles,beginMiles){
            this.dialogVisible = true;
            this.endMiles = endMiles;
            this.beginMiles = beginMiles;
        },
        checkMiles(){
            let endMiles = parseFloat(this.endMiles);
            let beginMiles = parseFloat(this.beginMiles);
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
        &:nth-child(2){
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