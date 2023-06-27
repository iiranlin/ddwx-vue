<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
           <el-row :span="24" :gutter="20">
               <el-col :span="24" >
                    <div>
                        <ul class="ul-face">
                            <li class="li-face">
                                <icon-svg icon-class="verybumanyi" />
                                <span>非常不满意</span>  
                            </li>
                            <li class="li-face">
                                <icon-svg icon-class="bumanyi" />
                                <span>不满意</span>
                            </li>
                            <li class="li-face">
                                <icon-svg icon-class="yiban" />
                                <span>一般</span>
                            </li>
                            <li class="li-face">
                                <icon-svg icon-class="manyi" />
                                <span>比较满意</span>
                            </li>
                            <li class="li-face">
                                <icon-svg icon-class="verymanyi" />
                                <span>非常满意</span>
                            </li>
                        </ul>
                    </div>
               </el-col>
               <el-col :span="24">
                    <el-form-item label="评价内容：">
                        <el-input v-model="form.remark" 
                            type="textarea" 
                            :rows="4" 
                            size="small" 
                            maxlength="200"/>
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
import {gcjcClassCreate,gcjcClassDetail,gcjcClassModify} from "@/api/driver"
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
                remark:""
            },
            //表单校验
            rules:{
                remark:[
                    {required:true,message:"班次名称不能为空",trigger:"blur"}
                ],
            }
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(){
            this.openDataScope = true;
            this.$nextTick(() => {
                this.title = "用车确认"
            })
        },
      
        //确认
        handleConfirm(){
           this.$refs.elform.validate(async (valid) => {
               if (valid) {
                //    this.loading = true;
                //    await gcjcClassCreate(Object.assign({}, this.form)).then(({message}) => {
                //        this.loading = false;
                //        this.$modal.msgSuccess(message);
                //        this.openDataScope = false;
                //        this.$emit('operateSuccess')
                //    }).catch((err) => {
                //        this.loading = false;
                //    })
               }
           })
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
        //关闭dialog回调
        handleDialogClose(){

        }
    }
}
</script>
<style lang="scss" scoped>
.ul-face {
    width: 100%;
    margin-bottom: 40px;
    padding: 0px 10px;
    list-style: none;
    display: flex;
    justify-content: space-between;

    .li-face {
        text-align: center;
        flex: 1;
        display: flex;
        flex-direction: column;

        .svg-icon-font {
            margin: 0 auto;
            font-size: 40px;
        }
        span {
            margin-top: 5px;
        }
    }
}
</style>>
