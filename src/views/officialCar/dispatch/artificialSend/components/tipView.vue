<template>
    <div>
        <div class="tip-title">
            <span>{{title}}</span>
            <i></i>
            <span>出车中</span>
            <i></i>
            <span>待出车</span>
            <i></i>
            <span>已还车</span>
        </div>
        <el-table :data="dateList" border stripe height="100px">
            <el-table-column v-for="(item,index) in tableOptions" :key="index" 
                width="36px" :label="item" align="left">
                <i class="tips-value" :style="checkCellStyle(item)"></i>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props: {
        dateList: {
            type: Array,
            default: [],
        },
        title: {
            type: String,
            default: '',
        },
    },
    watch: {
        dateList: {
            handler: function(val) {
               if(val.length !== 0){
                   this.tipOptions = val[0].tipArr;
               }
            },
            immediate: true,
        },
    },
    created() {
        
    },
    data () {
        return {
            //表头
            tableOptions:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
            tipOptions:[],
        }
    },
    methods: {
        //初始化表格样式
        checkCellStyle(index){
            if(this.tipOptions.length === 0){
                return;
            }
            if(Number(index) < 10 ){
                index = '0'+ index;
            }

            let obj = this.tipOptions.find((item) => {
                return index >= item.startTime.split(':')[0] && index <= item.endTime.split(':')[0];
            })

            if(!!obj){
                //判断颜色
                let background = '';

                if(obj.type === '1'){
                    background = 'blue';
                }else if(obj.type === '2'){
                    background = 'green'
                }else if(obj.type === '3'){
                    background = 'gray'
                }
                //判断宽度和边距
                let width = 0;
                let marginLeft = 0;

                if(index === obj.startTime.split(':')[0] && index === obj.endTime.split(':')[0]){
                    let startMin = obj.startTime.split(':')[1];
                    let endMin = obj.endTime.split(':')[1];
                    let startPercentage = Number(Number(startMin) / 60).toFixed(1);
                    
                    marginLeft = 36 * startPercentage;

                    let diff = Number(endMin) - Number(startMin);
                    let diffPercentage = Number(Number(diff) / 60).toFixed(1);
                    width = 36 * diffPercentage;
                }else if(index === obj.startTime.split(':')[0]){
                    let startMin = obj.startTime.split(':')[1];
                    let startPercentage = Number(Number(startMin) / 60).toFixed(1);
                    
                    marginLeft = 36 * startPercentage;
                    width = 36 - marginLeft;
                }else if(index === obj.endTime.split(':')[0]){
                    let endMin = obj.endTime.split(':')[1];
                    let endPercentage = Number(Number(endMin) / 60).toFixed(1);
                    
                    width = 36 * endPercentage;
                }else {
                    width = 36;
                }

                let style = 'width:'+ width + 'px;background:' + background + ';margin-left:' + marginLeft + 'px;'
                return style
            }
            return "";
        }
    },  
}
</script>
<style lang="scss" scoped>
.tip-title {
    display: flex;
    font-size: 14px;
    line-height: 30px;
    align-items: center;

    i {
        display: inline-block;
        width: 30px;
        height: 15px;
        border-radius: 5px;
    }
  
    & i:nth-child(2){
        background: green;
        margin-left: 20px;
    }
    & span:nth-child(3){
        margin-left: 5px;
    }
    & i:nth-child(4){
        margin-left: 20px;
        background: blue;
    }
    & span:nth-child(5){
        margin-left: 5px;
    }
    & i:nth-child(6){
        margin-left: 20px;
        background: gray;
    }
    & span:nth-child(7){
        margin-left: 5px;
    }
}
.tips-value {
    display: inline-block;
    height: 15px;
} 
::v-deep .el-table__row td .cell {
    padding: 0px;
}
</style>