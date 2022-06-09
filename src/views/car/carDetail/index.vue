<template >
  <div class="app-container">
    <el-row :gutter="20">
        <el-form :model="form" ref="elform" label-width="120px">
            <!--单位信息-->
            <el-row :gutter="20">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>单位信息</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="24" :xs="24"  style="width:90%;">
                    <el-col :span="8">
                        <el-form-item label="用车单位："><span>{{vehicleData.unitName}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用车部门："><span>{{vehicleData.deptName}}</span></el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <!--用车信息-->
            <el-row :gutter="20">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>用车信息</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" :xs="24"  style="width:90%;">
                    <el-col :span="8">
                        <el-form-item label="用车事由："><span>{{vehicleData.reason}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用车需求："><span>{{vehicleData.demand}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否长途：">
                            <span v-if="vehicleData.longDistanceTag===1">是</span>
                            <span v-if="vehicleData.longDistanceTag===0">否</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="乘坐人数："><span>{{vehicleData.usagePersons}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="乘坐人："><span>{{vehicleData.userName}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话："><span>{{vehicleData.phone}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用车日期："><span>{{vehicleData.usageDate}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出发时间："><span>{{vehicleData.usageTime}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预计时长："><span>{{vehicleData.timeLength}}</span></el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="出发地点："><span>{{vehicleData.fromAddr}}</span></el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="前往地点："><span>{{vehicleData.toAddr}}</span></el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="期望车型："><span>{{hopeBrandInfo}}</span></el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注："><span>{{vehicleData.remark}}</span></el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <!--派车信息-->
            <el-row :gutter="20" v-if="vehicleData.reqAssignments">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>派车信息</span>
                </el-col>
            </el-row>
            <el-row v-for="item in vehicleData.reqAssignments" :key="item.id">
                <el-col :span="24" :xs="24"  style="width:90%;"> 
                    <el-col :span="8">
                        <el-form-item label="指派司机："><span>{{item.driver}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="指派车辆："><span>{{item.carNumber}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出场里程："><span>{{item.beginMiles}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="还车里程："><span>{{item.endMiles}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="下次保养里程："><span>{{item.nextMaintainDate}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保养时间："><span>{{parseTime(item.maintainDate)}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保养里程："><span>{{item.maintainMiles}}</span></el-form-item>
                    </el-col>       
                </el-col>
                <el-col :span="24">
                        <hr style="color: #dddddd ;border:1px dashed;width:90%;margin-left:40px;">
                </el-col>
            </el-row>
            <!--操作日志-->
            <el-row :gutter="20">
                <el-col style="margin: 15px 10px">
                    <i class="el-icon-caret-right title-icon"></i><span>操作信息</span>
                </el-col>
                <!-- operationType -->
                <el-col :span="24" style="margin-bottom:40px;">
                <el-table ref="eltableSetting" max-height="300px" :data="logData" style="width:90%;margin-left:40px;" stripe border>
                    <el-table-column label="操作时间" align="center" width="200px">
                        <template slot-scope="scope">
                            <span>{{parseTime(logData[scope.$index].createTime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" prop="operator" align="center" width="200px"></el-table-column>
                    <el-table-column label="描述" prop="sdesc" align="center"></el-table-column>
                </el-table>
            </el-col>
            </el-row>
        </el-form>
    </el-row> 
  </div>
</template>
<script>
import {gcywVehicleRequestDispatchList,gcywVehicleRequestLogList} from "@/api/car"
import {getListByParentId} from "@/api/system/dict"
export default {
  name: "carDetail",
  data() {
    return {
        //loading框
        loading:false,
        //id
        id:"",
        //表单数据
        form:{},
        //操作日志数据
        logData:[],
        //用车单数据
        vehicleData:{},
        //期望车型数据
        hopeBrandInfo:"",
    };
  },
  created(){
        this.id = this.$route.params.id;
        if(!!this.id){
            this.getDispatchInfo();
            this.getLogList();
        }
  },
  methods: {
    //获取用车单信息
    async getDispatchInfo(){
            this.loading = true;
            await gcywVehicleRequestDispatchList(Object.assign({}, {id:this.id})).then(({data}) => {
                this.vehicleData = data.list[0] || {};
                this.loading = false;
                this.getHopeBrandInfo();
            }).catch((err) => {
                this.loading = false;
            })
    },
    //获取操作日志信息
    async getLogList(query){
            this.loading = true;
            await gcywVehicleRequestLogList(Object.assign({}, {reqId:this.id})).then(({data}) => {
                this.loading = false;
                this.logData = data;
            }).catch((err) => {
                this.loading = false;
            })
    },
    //获取期望车型字典
    async getHopeBrandInfo(){
            this.loading = true;
            await getListByParentId("101801").then(({data}) => {
                this.loading = false;
                data.forEach((item) => {
                    if(item.code===this.vehicleData.hopeBrand){
                        this.hopeBrandInfo = item.name;
                    }
                })
            }).catch((err) => {
                this.loading = false;
            })
    }
  }
};
</script>
<style scoped>
.app-container {
    padding: 10px 15px;
    overflow: auto;
}
.el-form-item_content .el-input-group {
    vertical-align: middle;
}
.title-icon {
    color: rgb(64, 158, 255);
    margin-right: 5px;
}
</style>