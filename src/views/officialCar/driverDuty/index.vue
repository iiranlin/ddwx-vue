<template>
    <div class="app-container" v-loading="loading" style="overflow:scroll">
        <!--最后三周值班记录-->
        <el-row :gutter="20">
            <el-col :span="24">
                <el-table ref="eltableRecord" :data="dutyRecordData" style="width:90%;margin-left:40px;" stripe border v-if="isShowRecord" :cell-style="tableCellStyle">
                    <el-table-column 
                        v-for="(item,index) in labelArr"
                        :key="item"
                        :label="item"
                        align="center">
                        <template slot-scope="scope">
                            <div @click="handleCellClick(scope.$index,index)">
                                <div>{{parseTime(dutyRecordData[scope.$index][index].classDate,'{m}月{d}日') }}</div>
                                <div style="color:#1890ff">{{dutyRecordData[scope.$index][index].driverCount }}人</div>
                                <i class="el-icon-success" v-if="dutyRecordData[scope.$index][index].isActive"></i>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--班次信息-->
        <el-row :gutter="20">
            <el-col :span="24" style="margin: 15px 0px">
                <i class="el-icon-caret-right title-icon"></i><span class="cont-title">班次信息</span>
            </el-col>
            <el-col :span="24">
                <div class="title-box">
                    <div v-for="(item,index) in dutyData" :key="index" :class="[item.isActive ? 'duty-active':'', 'duty-normal']" @click="hanldeDutyClick(index)">
                        <div style="margin-top:5px;">{{item.className}}</div>
                        <div style="margin-top:5px;">{{item.beginTime}}-{{item.endTime}}</div>
                        <i class="el-icon-success" v-if="item.isActive"></i>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!--值班司机-->
        <el-row :gutter="20" v-show="dutyDriverData.length!==0">
            <el-col :span="24" style="margin: 15px 0px">
                <i class="el-icon-caret-right title-icon"></i><span class="cont-title">值班司机<span v-show="classDate" style="margin-left:10px;">({{parseTime(classDate,'{m}月{d}日')}})</span></span>
            </el-col>
            <el-col :span="24">
                <div class="title-box">
                    <div v-for="(item,index) in dutyDriverData" :key="index" class="driver-normal">
                        <span>{{item.driver}}</span>
                        <span>{{'\u0020'}}</span>
                        <span>{{item.phone}}</span>
                        <i class="el-icon-remove-outline" @click="handleDriverRemoveClick(index)"></i>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!--设置排班-->
        <el-row :gutter="20">
            <el-col :span="24" style="margin: 15px 0px">
                <i class="el-icon-caret-right title-icon"></i><span class="cont-title">设置排班<span v-show="classDate" style="margin-left:10px;">({{parseTime(classDate,'{m}月{d}日')}})</span></span>
            </el-col>
            <el-col :span="24" style="margin-bottom:40px;">
                <el-table ref="eltableSetting" max-height="300px" :data="driverData" style="width:90%;margin-left:40px;" stripe border>
                    <el-table-column label="序号" type="index" align="center"></el-table-column>
                    <el-table-column label="司机姓名" prop="driver" align="center"></el-table-column>
                    <el-table-column label="联系电话" prop="phone" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" @click="handleArrangeClick(scope.row)" style="color:#1890ff;text-decoration:underline;">{{scope.row.status==="0"?"排班":"取消排班"}}</a>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { gcjcDriverClassListLast3Weeks,
         gcjcClassList,
         gcjcDriverClassCreate,
         gcjcDriverClassDeleteBatch,
         gcjcDriverClassList} from "@/api/driver";
export default {
    name: "driverDuty",
    components: { gcjcDriverClassListLast3Weeks },

    data() {
        return {
            //遮罩层
            loading:false,
            //是否显示排版记录
            isShowRecord:false,
            //表头数据
            labelArr:["周一","周二","周三","周四","周五","周六","周日"],
            //最近3周排班记录数据
            dutyRecordData:new Array(3),
            //当前选中日期
            classDate:"",
            //当前点击的行坐标
            rowIndex:'',
            //当前点击的列坐标
            columnIndex:'',
            //班次信息
            dutyData: [],
            //值班司机信息
            dutyDriverData:[],
            //司机数据
            driverData:[],
            //当前选中班次id
            classId:"",
        }
    },
    created(){
        Object.assign(this.$data, this.$options.data());
        this.getClassList();
        this.refreshList();
    },
    methods:{
        //获取司机值班排班记录列表-最近3周
        async getLast3Weeks(){
            this.loading = true;
            await gcjcDriverClassListLast3Weeks().then(({data}) => {
                this.loading = false;
                this.initLast3WeeksData(data);
            }).catch((err) => {
                this.loading = false;
            })
        },
        //封装最近3周排版记录数据
        initLast3WeeksData(originalData){
            for (let i = 0; i < 3; i++) {
                this.$set(this.dutyRecordData, i, []);
                for (let j = 0; j < 7; j++) {
                    this.$set(originalData[i*7+j], 'isActive', false)
                    this.dutyRecordData[i].push(originalData[i*7+j]) 
                }
            }
            this.isShowRecord = true;
        },
        //获取班次列表
        async getClassList(){
            this.loading = true;
            await gcjcClassList().then(({data}) => {
                this.loading = false;
                data.list.forEach((item)=>{
                    this.$set(item, 'isActive', false)
                })
                this.dutyData = data.list;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取值班司机数据
        async getDutyDriverList(){
            this.loading = true;
            await gcjcDriverClassList(Object.assign({},{classDateStart:this.classDate},{classDateEnd:this.classDate},{classId:this.classId},{flag:1})).then(({data}) => {
                this.loading = false;
                this.dutyDriverData = data.list;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取所有司机数据
        async getDriverList(){
            this.loading = true;
            await gcjcDriverClassList(Object.assign({},this.listQuery,{classDateStart:this.classDate},{classDateEnd:this.classDate},{classId:this.classId})).then(({data}) => {
                this.loading = false;
                this.driverData = data.list;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //单元格点击
        handleCellClick(rowIndex,columnIndex){
            this.rowIndex = rowIndex;
            this.columnIndex = columnIndex;
            this.classDate = this.dutyRecordData[rowIndex][columnIndex].classDate;
            
            for (let i = 0; i < this.dutyRecordData.length; i++) {
                let arrys = this.dutyRecordData[i];
                for (let j = 0; j < arrys.length; j++) {
                    arrys[j].isActive = false;
                }
            }
            this.dutyRecordData[rowIndex][columnIndex].isActive = true;

            this.getDriverList();
            this.getDutyDriverList();
        },
        //单元格选中样式
        tableCellStyle (row, column, rowIndex, columnIndex) {
            if (this.rowIndex === row.rowIndex && this.columnIndex === row.columnIndex) {
                return 'background-color:#FEEDA6;'
            } else {
                return 'background-color:#fff;'
            }
        },
        //班次信息点击
        hanldeDutyClick(index){
            this.classId = this.dutyData[index].id;
            this.dutyData.forEach((item,i)=>{
                if(index===i){
                    item.isActive = true;
                }else{
                    item.isActive = false;
                }
            })
            this.refreshList();
        },
        //值班司机点击删除
        handleDriverRemoveClick(index){
            this.driverClassDelete(this.dutyDriverData[index]);
        },
        //设置排班列表点击排班回调
        handleArrangeClick(row){
            if(row.status==="0"){
                this.driverClassCreate(row);
            }else{
                this.driverClassDelete(row);
            }
        },
        //设置排班
        async driverClassCreate(row){
            this.loading = true;
            gcjcDriverClassCreate(Object.assign({}, row,{classId:this.classId},{classDate:this.classDate})).then(({message}) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.refreshList();
            }).catch((err) => {
                this.loading = false;
            })
        },
        //取消排班
        async driverClassDelete(row){
            this.loading = true;
            let ids = [];
            ids[0] = row.id;
            gcjcDriverClassDeleteBatch({ids}).then(({message}) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.refreshList();
            }).catch((err) => {
                this.loading = false;
            })
        },
        //刷新值班司机和全部司机数据
        refreshList(){
            this.getLast3Weeks();
            this.getDriverList();
            this.getDutyDriverList();
        }
    }
};
</script>
<style lang="css" scoped>
.title-icon {
    color: rgb(64, 158, 255);
    margin-right: 5px;
}
.title-box{
    display: flex;
    margin-left: 40px;
}
.cont-title{
    font-weight: bold;
    color: #333;
}
.el-icon-success{
    color: #1890ff;
    font-size:20px;
    position: absolute;
    right: 2px;
    top: 0;
}
.el-icon-remove-outline{
    color: #F5222D;
    font-size:20px;
    position: absolute;
    right: -10px;
    top: -10px;
}
.duty-active{
    background: #FEEDA6;
}
.duty-normal{
    width: 100px;
    height: 50px;
    border: 1px solid #bbbbbb;
    border-radius: 4px;
    margin-right: 16px;
    font-size: 14px;
    text-align: center;
    position: relative;
}
.driver-normal{
    position: relative;
    font-size: 14px;
    padding: 0 10px;
    border: 1px solid #bbbbbb;
    border-radius: 4px;
    line-height: 36px;
    margin-right: 16px;
}
::v-deep .el-table--medium .el-table__cell{
    padding: 5px 0px;
}
</style>