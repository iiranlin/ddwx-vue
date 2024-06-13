<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="120px" v-loading="loading">
           <el-row :span="24" style="text-align:center">
               <el-col :span="24" >
                    <el-transfer 
                        style="text-align: left; display: inline-block"
                        v-model="form.selectDriver" 
                        :data="driverList"
                        :filterable="true"
                        :titles="['司机列表', '已选择']"
                        :props="{
                            key: 'driverId',
                            label: 'realName'
                        }">
                    </el-transfer>
               </el-col>
               <el-col :span="24" style="margin-top:20px;margin-left:20px;">
                    <el-form-item label="请假开始日期：" prop="leaveStartDate">
                        <el-date-picker
                            v-model="form.leaveStartDate"
                            size="small"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择请假开始日期"
                            :picker-options="{
                                disabledDate: (time) => {
                                    return time.getTime() < Date.now() - 3600 * 1000 * 24;
                                },
                            }">
                        </el-date-picker>
                        <el-select v-model="form.leaveStartLen" placeholder="请选择请假开始时长" size="small" style="margin-left:10px">
                            <el-option label="全天" value="全天" />
                            <el-option label="上午" value="上午" />
                            <el-option label="下午" value="下午" />
                        </el-select>
                    </el-form-item>
               </el-col>
               <el-col :span="24" style="margin-left:20px;">
                    <el-form-item label="请假结束日期：" prop="leaveEndDate">
                         <el-date-picker
                            v-model="form.leaveEndDate"
                            size="small"
                            value-format="yyyy-MM-dd"
                            placeholder="请选请假择束日期"
                            :picker-options="{
                                disabledDate: (time) => {
                                    return time.getTime() < Date.now() - 3600 * 1000 * 24;
                                },
                            }">
                        </el-date-picker>
                        <el-select v-model="form.leaveEndLen" placeholder="请选择请假结束时长" size="small" style="margin-left:10px">
                            <el-option label="全天" value="全天" />
                            <el-option label="上午" value="上午" />
                            <el-option label="下午" value="下午" />
                        </el-select>
                    </el-form-item>
               </el-col>
           </el-row>
       </el-form>
       <div slot="footer" class="dialog-footer">
           <el-button type="primary" @click="handleCreate()">确定</el-button>
           <el-button @click="handleCancel">取消</el-button>
       </div>
   </el-dialog>
</template>
<script>
import {gcjcDriverLeaveList,gcjcDriverLeaveSave} from "@/api/attendanceManagement"
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //显示隐藏
            openDataScope:false,
            //司机数据
            driverList:[],
            //表单数据
            form:{
                leaveStartDate:'',
                leaveEndDate:'',
                leaveStartLen:'全天',
                leaveEndLen:'全天',
                selectDriver:[],
            },
            //表单校验
            rules:{
                leaveStartDate:[
                    {required:true,message:"请假开始日期不能为空",trigger:"change"}
                ],
                leaveEndDate:[
                    {required:true,message:"请假结束日期不能为空",trigger:"change"}
                ],
            }
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(){
            this.title = "新建考勤"
            this.openDataScope = true;
            this.getClassDetail();
        },
        //获取司机列表
        async getClassDetail(){
            this.loading = true;
            await gcjcDriverLeaveList().then(({data}) => {
                this.loading = false;
                this.driverList = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //新建
        handleCreate(){
           this.$refs.elform.validate(async (valid) => {
               if (valid) {
                   if(this.form.selectDriver.length == 0){
                       this.$modal.msgWarning("请选择司机！")
                       return
                   }
                   let paramsArr = [];

                   this.form.selectDriver.forEach((selectItem) => {
                       this.driverList.forEach((driverItem) => {
                           if(selectItem == driverItem.driverId){
                               let obj = {
                                   teamsName: driverItem.teamsName,
                                   teamsCode: driverItem.teamsCode,
                                   fleetName: driverItem.fleetName,
                                   fleetId: driverItem.fleetId,
                                   driverName: driverItem.realName,
                                   driverId: driverItem.driverId,

                                   leaveStartDate: this.form.leaveStartDate,
                                   leaveEndDate: this.form.leaveEndDate,
                                   leaveStartLen: this.form.leaveStartLen,
                                   leaveEndLen: this.form.leaveEndLen,
                               }
                               paramsArr.push(obj)
                           }
                       })
                   })
                   this.loading = true;
                   await gcjcDriverLeaveSave(paramsArr).then(({message}) => {
                       this.loading = false;
                       this.$modal.msgSuccess(message);
                       this.openDataScope = false;
                       this.$emit('operateSuccess')
                   }).catch((err) => {
                       this.loading = false;
                   })
               }
           })
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
        //关闭dialog回调
        handleDialogClose(){
            this.$refs.elform.resetFields();
            this.form.selectDriver = [];
            this.form.leaveStartLen = '';
            this.form.leaveEndLen = '';
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-transfer-panel {
    width: 250px;
}
::v-deep .el-form-item__content {
    text-align: left;
}
</style>>
