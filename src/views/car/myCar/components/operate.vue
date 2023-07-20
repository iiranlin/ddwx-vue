<template>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="500px" append-to-body center @close="handleDialogClose()">
        <el-form :model="form" ref="elform" label-width="100px" v-loading="loading">
            <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="(item,index) in waitArr" :key="index" :label="item.id">
                    <span>车辆：{{item.carNumber}}{{item.carBrand}}{{item.carSeries}}</span>
                    <span>司机：{{item.driver.substr(0,1)}}师傅</span>
                </el-checkbox>
            </el-checkbox-group>
            <el-row :span="24" :gutter="20">
                <el-col :span="24" >
                    <div>
                        <ul class="ul-evaluate">
                            <li class="li-evaluate">
                                <span>评分</span>
                                <el-rate
                                    size="small"
                                    v-model="form.evaluateLevel"
                                    show-text
                                    :texts="texts">
                                </el-rate>
                            </li>
                            <li class="li-evaluate">
                                <span>驾驶水平</span>
                                <el-rate
                                    v-model="form.evaluateDriver"
                                    show-text
                                    :texts="texts">
                                </el-rate>
                            </li>
                            <li class="li-evaluate">
                                <span>服务态度</span>
                                <el-rate
                                    v-model="form.evaluateService"
                                    show-text
                                    :texts="texts">
                                </el-rate>
                            </li>
                            <li class="li-evaluate">
                                <span>车内环境</span>
                                <el-rate
                                    v-model="form.evaluateIncar"
                                    show-text
                                    :texts="texts">
                                </el-rate>
                            </li>
                        </ul>
                    </div>
                </el-col>
                <el-col :span="24">
                        <el-form-item label="评价内容：">
                            <el-input v-model="form.evaluateContent" 
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
import { gcywRequestEvaluateSave} from "@/api/car"

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
                 evaluateLevel:4,      //所选评价
                 evaluateDriver:4,      //司机平分
                 evaluateService:4,   //服务平分
                 evaluateIncar:4,       //车内平分
                 evaluateContent:'',    //评价内容
            },
            //车辆信息
            waitArr:[],
            //所选车辆
            checkList:[],
            //评价标准
            texts:['非常不满意','不满意','一般','比较满意','非常满意'],
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(waitArr){
            this.openDataScope = true;
            this.waitArr = waitArr;
            this.waitArr.forEach((item) => {
                this.checkList.push(item.id);
            })
            this.$nextTick(() => {
                this.title = "用车评价"
            })
        },
        //确认
        handleConfirm(){
            if(this.checkList.length === 0){
                this.$modal.msgWarning('请至少选择一个车辆信息进行评价!');
                return
            }
            if(!this.form.evaluateLevel){
                this.$modal.msgWarning('请选择评分满意度!');
                return
            }
            if(!this.form.evaluateDriver){
                this.$modal.msgWarning('请选择驾驶水平评价满意度!');
                return
            }
            if(!this.form.evaluateService){
                this.$modal.msgWarning('请选择服务态度评价满意度!');
                return
            }
            if(!this.form.evaluateIncar){
                this.$modal.msgWarning('请选择车内环境评价满意度!');
                return
            }
            let evaluateArr = [];

            this.checkList.forEach((item) => {
                let obj = {};
                this.$set(obj, 'reqassId', item);
                this.$set(obj, 'evaluateLevel', this.form.evaluateLevel);
                this.$set(obj, 'evaluateDriver', this.form.evaluateDriver);
                this.$set(obj, 'evaluateService', this.form.evaluateService);
                this.$set(obj, 'evaluateIncar', this.form.evaluateIncar);
                this.$set(obj, 'evaluateContent', this.form.evaluateContent);
                evaluateArr.push(obj)
            })
            this.loading = true;

            gcywRequestEvaluateSave(evaluateArr).then(({message}) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.openDataScope = false;
                this.$emit('operateSuccess')
            }).catch((err) => {
                this.loading = false;
            })
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
        //关闭dialog回调
        handleDialogClose(){
            this.waitArr = [];
            this.checkList = [];
            this.form.evaluateLevel = 4;
            this.form.evaluateDriver = 4;
            this.form.evaluateService = 4;
            this.form.evaluateIncar = 4;
            this.form.evaluateContent = '';
        }
    }
}
</script>
<style lang="scss" scoped>
.el-checkbox {
    display: block;
    margin: 0 20px 10px 20px;

    span {
        font-weight: 600;

        &:nth-child(2){
            margin-left: 30px;
        }
    }
}
.ul-evaluate {
    width: 100%;
    margin-bottom: 40px;
    padding: 0px 10px 0px 18px;
    list-style: none;

    .li-evaluate {
        display: flex;
        height: 50px;

        span {
            width: 80px;
            font-weight: 700;
            font-size: 15px;
            line-height: 35px;
        }
        ::v-deep.el-rate__icon {
            font-size: 35px;
        }
        ::v-deep.el-rate__text {
            font-size: 15px;
            margin-left: 10px;
        }
        ::v-deep.el-rate__item {
            margin-left: 10px;
        }
    }
}
</style>>
