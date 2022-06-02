<template>
    <div class="app-container_list">
        <el-row :gutter="20" class="container_h" >
            <el-col :span="24" :xs="24" class="container_flex">
                <!--搜索区域-->
                <el-row style="margin:0 0 10px 20px;">
                    <el-col :span="5">
                        <el-date-picker
                            size="mini"
                            v-model="form.year"
                            type="year"
                            format="yyyy年"
                            value-format="yyyy"
                            placeholder="请选择年份"
                            :clearable="false"
                            @change="handleYearChange()">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="5">
                        <el-date-picker
                            size="mini"
                            popper-class="hide_header"
                            v-model="form.month"
                            type="month"
                            format="MM月"
                            value-format="MM"
                            placeholder="请选择月份"
                            :clearable="false"
                            @change="handleMonthChange()">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <!--日历-->
                <el-row>
                    <el-col :span="24">
                         <el-calendar v-model="currentMonth"  >
                                <template slot="dateCell" slot-scope="{data}"  >
                                    <div @contextmenu.prevent="openMenu($event,data.day)" style="width:100%;height:100%">
                                        <p :class="[checkStyle(data.day) ? 'calender-p-holiday':'', 'calendar-p-work']">
                                            {{ data.day.split('-').slice(2).join('-')}}
                                        </p>
                                        <p>
                                            <span class="calendar-span-holiday" v-if="checkDisplayHoliday(data.day)">休</span>
                                            <span class="calendar-span-work" v-else-if="checkDisplayWork(data.day)">班</span>
                                        </p>
                                    </div>
                                </template>
                        </el-calendar>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!--设置菜单-->
         <ul  class="contextmenu" v-show="visible" :style="{left:left+'px',top:top+'px'}">
            <li @click="handleMenuClick(0)" v-if="setWorkVisible"><i class="el-icon-edit" ></i>设为工作日</li>
            <li @click="handleMenuClick(1)" v-else><i class="el-icon-bicycle"></i>设为节假日</li>
        </ul>
    </div>
</template>
<script>
import buttonTop from "@/components/buttonTop"
import {sysWorkDayListWorkDay,sysWorkDaySetWorkDay} from '@/api/system/dict/setting';

export default {
    name:"weekdayMaintenance",
    components:{buttonTop},

    data() {
        return {
            //遮罩层
            loading:false,
            //非单个禁用
            single:true,
            //非多个禁用
            multiple:true,
            //列表显示字段
            property:{},
            //当前月份
            currentMonth:new Date(),
            //城市数据
            cityOptions:[],
            //查询数据
            form:{
                year:"",
                month:"",
            },
            //当前点击得日期
            currentDate:"",
            //变更类型（1-休假 2-调班）
            changeType:"",  
            //已设置得工作日和休息日数据
            settingData:[],
            //是否显示设置菜单
            visible: false,
            //是否显示设置工作日
            setWorkVisible:true,
            //位置上
            top: 0,
            //位置左
            left: 0,
        }
    },
    created(){
        let currentYearMonth =this.parseTime(new Date().getTime(),"{y}-{m}");
        this.form.year = currentYearMonth.split('-')[0];
        this.form.month = currentYearMonth.split('-')[1];
        this.menuProperty();
        this.getWorkDayInfo();
    },
    methods:{
        //获取菜单数据
        menuProperty(){
            let id = this.$route.meta.id;
            this.$store.dispatch('menuProperty', id).then( (data) => {
                data.search.forEach((item) => {
                    item.fieldFormat = JSON.parse(JSON.stringify(item.fieldFormat));
                })
                this.property = data;
            });
        },
        //获取日期数据
        async getWorkDayInfo(){
            let date = this.form.year+"-"+this.form.month;
            this.loading = true;
            await sysWorkDayListWorkDay({yearMonth:date}).then(({data}) => {
                this.loading = false;
                this.settingData = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //顶部按钮点击
        newButton(buttonCode,row){
            if(buttonCode==='save'){
                alert("save");
            }
        },
        //选择样式
        checkStyle(date){
            //判断是否是当前月份的日期
            let month = date.split('-')[1];
            if(month!=this.form.month){
                return false;
            }

            let isHolidayStyle;
            //判断当前是否是周六日
            let isSaturdayOrSunday = this.checkSaturdayOrSunday(date);
            //是否有设置过工作日或休息日
            if(this.settingData.length===0){
                if(isSaturdayOrSunday){
                    isHolidayStyle = true;
                }else{
                    isHolidayStyle = false;
                }
            }else{
                //当前是周六日
                if(isSaturdayOrSunday){
                    isHolidayStyle = true;
                    for (let i = 0; i < this.settingData.length; i++) {
                        if(this.settingData[i].day===date && this.settingData[i].changeType==="2"){
                            isHolidayStyle = false;
                            break
                        }
                    }
                }else{
                    isHolidayStyle = false;
                    for (let i = 0; i < this.settingData.length; i++) {
                        if(this.settingData[i].day===date && this.settingData[i].changeType==="1"){
                            isHolidayStyle = true;
                            break
                        }
                    }
                }
            }
            return isHolidayStyle;
        },
        //判断是否显示休
        checkDisplayHoliday(date){
            let isDisplay = false;
            if(this.settingData.length===0){
                return isDisplay;
            }
            for (let i = 0; i < this.settingData.length; i++) {
                if(this.settingData[i].day===date){
                    if(this.settingData[i].changeType==="1"){
                        if(!this.checkSaturdayOrSunday(date)){
                            isDisplay = true;
                        }
                    }
                    break
                }
            }
            return isDisplay;
        },
        //判断是否显示班
        checkDisplayWork(date){
            let isDisplay = false;
            if(this.settingData.length===0){
                return isDisplay;
            }
            for (let i = 0; i < this.settingData.length; i++) {
                if(this.settingData[i].day===date){
                    if(this.settingData[i].changeType==="2"){
                        if(this.checkSaturdayOrSunday(date)){
                            isDisplay = true;
                        }
                    }
                    break
                }
            }
            return isDisplay;
        },
        //判断是否是周六周日
        checkSaturdayOrSunday(date){
            let week = (new Date(date)).getDay();
            if(week==6){
                return true;
            }else if(week==0){
                return true
            }
            return false;
        },
        //选择年份回调
        handleYearChange(){
            this.currentMonth = new Date(this.form.year,this.form.month-1);
            this.getWorkDayInfo();
        },
        //选择月份回调
        handleMonthChange(){
            this.currentMonth = new Date(this.form.year,this.form.month-1);
            this.getWorkDayInfo();
        },
        //打开设置菜单
        openMenu(e,date){
            //判断显示设置工作日或者节假日
            if(this.checkStyle(date)){
                this.setWorkVisible = true;
            }else{
                this.setWorkVisible = false;
            }
            this.currentDate = date;
            const menuMinWidth = 105
            const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
            const offsetWidth = this.$el.offsetWidth // container width
            const maxLeft = offsetWidth-menuMinWidth // left boundary
            const left = e.clientX-offsetLeft // 15: margin right

            if (left > maxLeft) {
                 this.left = maxLeft
            } else {
                this.left = left
            }

            this.top = e.clientY-60 // fix 位置bug
            this.visible = true
        },
        //菜单点击回调
        handleMenuClick(position){
            switch (position) {
                case 0:
                    this.changeType = "2";
                    break;
                case 1:
                    this.changeType = "1";
                    break;
                default:
                    break;
            }
            this.setWorkDayOrHoliday();
        },
        //设置工作日或休息日
        async setWorkDayOrHoliday(){
            this.loading = true;
            await sysWorkDaySetWorkDay(Object.assign({}, {day:this.currentDate},{changeType:this.changeType})).then(({message}) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.getWorkDayInfo();
            }).catch((err) => {
                this.loading = false;
            })
        },
        //关闭设置菜单
        closeMenu() {
            this.visible = false
        }    
    },
    watch: {
        visible(value) {
            if (value) {
                document.body.addEventListener('click', this.closeMenu)
            } else {
                document.body.removeEventListener('click', this.closeMenu)
            }
        }
    },
    computed:{
      
    }
}
</script>
<style lang="scss" scoped>
.app-container_list {
    overflow: auto;
}
::v-deep .el-calendar-day{
    height: 60px;
}
::v-deep .el-calendar-table thead th{
    height: 60px;
    background: #EBEEF5;
}
::v-deep .el-calendar__header {
    display: none;
}
::v-deep .el-calendar-table{
    &:not(.is-range){
        td.next{
            pointer-events: none;
        }
        td.prev{
            pointer-events: none;
        }
    }
}
::v-deep .el-calendar-table thead td .next{
            color: #cccccc !important;
}
::v-deep .el-calendar-table thead td .prev{
            color: #cccccc !important;
}
.calendar-p-work{
    text-align: center;
    margin: 0;
    padding: 0;
    font-size: 12px;
}
.calender-p-holiday{
    text-align: center;
    margin: 0;
    padding: 0;
    font-size: 12px;
    color: #db1010;
}
.calendar-span-holiday{
    color: #db1010;
    font-size: 12px;
}
.calendar-span-work{
    color: #26413c;
    font-size: 12px;
}
.el-icon-edit{
    margin-right: 5px;
    color: #5cb6ff;
}
.el-icon-bicycle{
    margin-right: 5px;
    color: #5cb6ff;
}
.contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
            &:hover {
            background: #eee;
        }
    }
}
</style>
<style >
.hide_header .el-date-picker__header{
    display: none !important;
}
</style>