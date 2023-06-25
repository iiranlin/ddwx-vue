<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" ref="elform" label-width="100px" v-loading="loading">
           <el-row :span="24" :gutter="20">
               <el-col :span="24">
                    <el-form-item label="选择模板：">
                        <el-select v-model="form.templateType" size="small" style="width:100%">
                            <el-option v-for="(item,index) in templateOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
               </el-col>
           </el-row>
       </el-form>
       <div slot="footer" class="dialog-footer">
           <el-button type="primary" @click="handleConfirm()">确定</el-button>
           <el-button @click="handleCancel()">取消</el-button>
       </div>
   </el-dialog>
</template>
<script>
import { axiosDownloadExcel } from '@/api/download'
import { fuelRecordTemplateUrl } from '@/api/fuelCardManagement/fuelCardRecord'
import { appendixInfoExporttUrl } from "@/api/system/dataChange"


export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //显示隐藏
            openDataScope:false,
            //表单数据
            form:{
               templateType:'0',
            },
            //模板数据
            templateOptions:[
                {
                    name:'加油卡交易记录标准模板',
                    code:'0',
                },
                {
                    name:'中石油加油卡明细单模板',
                    code:'1',
                },
                {
                    name:'中石化加油卡明细单模板',
                    code:'2',
                },

            ],
        }
    },
    created(){
        
    },
    methods:{
        //初始化
        init(){
            this.openDataScope = true;
            this.$nextTick(() => {
                this.title = "模板下载"
            })
        },
        //确定
        handleConfirm(){
            if(this.form.templateType === '0'){
                axiosDownloadExcel(fuelRecordTemplateUrl)
            }else if(this.form.templateType === '1'){
                let params = {
                    fileName: 'template/中石油加油卡明细单模板.xlsx',
                }
                axiosDownloadExcel(appendixInfoExporttUrl,params);
            }else if(this.form.templateType === '2'){
                let params = {
                    fileName: 'template/中石化加油卡明细单模板.xlsx',
                }
                axiosDownloadExcel(appendixInfoExporttUrl,params);
            }
            this.openDataScope = false;
        },  
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
        //关闭dialog回调
        handleDialogClose(){
            this.$refs.elform.resetFields();
        }
    }
}
</script>
<style scoped>

</style>>
