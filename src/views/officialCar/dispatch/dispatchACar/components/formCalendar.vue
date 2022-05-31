<template>
    <el-calendar v-model="calendarVal" :range="[assignTimey, assignTimer]" class="box-calendar">
        <div slot="dateCell" slot-scope="{data}">
            <div v-for="item in dateList" :key="item.assignTime">
                <template v-if="item.assignTime.indexOf(data.day) != -1">
                    <p :class="usageDate == data.day ? 'is-selected' : ''">
                        {{ data.day.split('-').slice(1).join('-') }} {{usageDate == data.day ? '✔️' : ''}}
                    </p>
                    <p class="calendar-p-span">
                        <span>{{item.tasscount}} 辆</span>
                        <span>{{item.nasscount}} 辆</span>
                        <span>{{item.sasscount}} 辆</span>
                        <span>{{item.tasscount - item.nasscount - item.sasscount}} 辆</span>
                    </p>
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
        }
    },
    created() {
    },
    methods: {
        calendarClick (val) {
            this.$emit('calendarClick', val.day)
        },
    }
};
</script>
<style lang="scss">
.box-calendar{
    .el-calendar__title{
        display: none;
    }
    .calendar-p-span{
        span{
            padding-left: 5px;
            &:nth-child(1){
                color: #26413c;
            }
            &:nth-child(2){
                color: #6292ff;
            }
            &:nth-child(3){
                color: #4da32d;
            }
            &:nth-child(4){
                color: #d57b48;
            }
        }
    }
}
</style>