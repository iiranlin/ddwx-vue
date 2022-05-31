<template>
    <div class="app-container_list">
        <el-row :gutter="20" class="container_h">
            <el-col :span="24" :xs="24" class="container_flex">
                <!--顶部按钮-->
                <el-row :gutter="24" class="container_flex-right_list">
                  <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
                      <button-top
                        :item="item"
                        :multiple="multiple"
                        :single="single"
                        @newButton="newButton"
                        class="cume-button">
                      </button-top>
                  </el-col>
                </el-row>
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
                <el-row >
                    <el-col :span="24">
                         <el-calendar v-model="currentMonth">
                                <template slot="dateCell" slot-scope="{data }">
                                    <p class="calendar-p">
                                        {{ data.day.split('-').slice(2).join('-')}}
                                    </p>
                                    <p class="calendar-p-span">
                                        <span class="calendar-span">班</span>
                                        <span class="calendar-span">休</span>
                                    </p>
                                </template>
                        </el-calendar>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import buttonTop from "@/components/buttonTop"
import{gcjcClassListPage,gcjcClassDeleteBatch} from "@/api/driver"

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
            }
        }
    },
    created(){
        this.menuProperty();
        this.form.year = new Date().getFullYear()+"";
        this.form.month = new Date().getMonth()+1+"";
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
        //顶部按钮点击
        newButton(buttonCode,row){
            if(buttonCode==='save'){
                alert("save");
            }
        },
        //选择年份回调
        handleYearChange(){
            this.currentMonth = new Date(this.form.year,this.form.month-1);
        },
        //选择月份回调
        handleMonthChange(){
            this.currentMonth = new Date(this.form.year,this.form.month-1);
        },
    }
}
</script>
<style lang="scss" scoped>
.app-container_list {
    overflow: auto;
}
::v-deep .el-calendar-day{
    height: 55px;
}
::v-deep .el-calendar-table thead th{
    height: 60px;
    background: #EBEEF5;
}
::v-deep .el-calendar__header {
    display: none;
}
.calendar-p{
    text-align: center;
    margin: 0;
    padding: 0;
    font-size: 12px;
}
.calendar-span{
    padding-left: 5px;
}
.calendar-p-span{
    font-size: 12px;
    flex-direction: row;
    span{
        &:nth-child(1){
            color: #26413c;
        }
        &:nth-child(2){
            color: #db1010;
        }
    }
}
</style>