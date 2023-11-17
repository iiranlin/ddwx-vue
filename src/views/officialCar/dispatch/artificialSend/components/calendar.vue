<template>
    <el-calendar v-model="calendarVal" :range="[assignTimey, assignTimer]" class="box-calendar" center>
        <div slot="dateCell" slot-scope="{data}" @click="calendarClick(data)">
            <div v-for="item in dateList" :key="item.assignTime" @click="handleItemClcik(item)" :class="[usageDate == data.day ? 'container-date-default' : '']">
                <template v-if="item.assignTime.indexOf(data.day) != -1">
                    <div class="day-containar"> 
                        <p>
                            {{ data.day.split('-').slice(1).join('-') }}
                        </p>
                        <ul>
                            <li>
                                <img src="/static/icon_car.png"/>
                                <span>:{{item.tasscount - item.nasscount - item.sasscount}} 辆</span>
                            </li>
                            <li>
                                <img src="/static/icon_clock.png"/>
                                <span>:{{item.nasscount}} 辆</span>
                            </li>
                            <li>
                                <img src="/static/icon_accepted.png"/>
                                <span>:{{item.sasscount}} 辆</span>
                            </li>
                        </ul>
                        <img src="/static/icon_selected.png" class="img-selected" v-if="data.isSelected || usageDate == data.day"/>
                    </div>
                </template>
            </div>
        </div>
    </el-calendar>
</template>

<script>
export default {
    props: {
        dateList: {
            type: Array,
            default: [],
        },
        assignTimey: {
            type: String,
            default: '2022-05-23',
        },
        assignTimer: {
            type: String,
            default: '2022-05-29',
        },
        usageDate: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            calendarVal: null,
            //可用车辆数
            available:0,
            //车辆总数
            tasscount:0,
        }
    },
    created() {
    },
    methods: {
        handleItemClcik(item){
            this.available = item.tasscount - item.nasscount - item.sasscount;
            this.tasscount = item.tasscount;
        },
        calendarClick (val) {
            this.$emit('calendarClick', val.day,this.available,this.tasscount)
        },
    }
};
</script>
<style lang="scss">
.box-calendar{
    position: relative;
   
    .el-calendar__header{
        display: none;
    }
    .el-calendar__body {
        padding: 12px 10px 0px 10px;
    }
    .el-calendar-table thead th {
        padding: 0px;
        height: 30px;
        background: #f3f5f7;
    } 
    .el-calendar-day{
        height: 65px;
        padding: 0px;
    }
    .day-containar {
        position: relative;
        padding: 8px;
        box-sizing: border-box;

        p {
            margin: 0px;
            font-size: 14px;
            font-weight: 600;
        }
        ul {
            list-style: none;
            display: flex;
            padding: 0px;
            justify-content: space-around;
            margin-bottom: 0px;

            li {
                display: flex;
                align-items: center;

                img {
                    margin-right: 2px;
                    width: 14px;
                    height: 14px;
                }
                span {
                    font-size: 12px;
                }
            }
        }
        .img-selected {
            width: 14px;
            height: 14px;
            position: absolute;
            right: 8px;
            top: 8px;
        }
    }
    .container-date-default {
        background-color:#d7eeff !important;
    }
}
</style>