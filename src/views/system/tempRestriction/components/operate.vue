<template>
    <el-dialog :title="title" :visible.sync="openDataScope" width="800px" append-to-body center @close="handleDialogClose()">
        <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-col :span="12" >
                    <el-form-item label="城市：" prop="cityId">
                        <el-cascader
                            style="width:100%"
                            ref="elCascader"
                            v-model="cascaderIds"
                            :options="provinceOptions"
                            :props="optionProps"
                            @change="handleCascaderChange">
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="限行时间：" prop="startDate">
                        <el-date-picker
                            style="width:100%"
                            v-model="restrictionTime"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            unlink-panels
                            :picker-options="{firstDayOfWeek:1}"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="handleDateChange()">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="限行规则：" prop="rule">
                        <el-select v-model="form.rule" ref="userSelect" placeholder="请选择限行规则" style="width:100%">
                            <el-option 
                                v-for="item in ruleOptions" 
                                :key="item.value" 
                                :label="item.name" 
                                :value="item.code"
                                @click.native="handleRuleChange(item.name)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="限行尾号：" prop="ruleResult">
                        <el-select v-model="form.ruleResult" placeholder="请选择限行尾号" style="width:100%">
                            <el-option 
                                v-for="item in ruleResultOptions" 
                                :key="item.value" 
                                :label="item.name" 
                                :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item :label="'尾号字母\u3000\n处理规则：'"  class="fold_label" prop="lastLetter">
                        <el-select v-model="form.lastLetter" placeholder="指定为特定数字" style="width:100%">
                            <el-option 
                                v-for="item in lastLetterOptions" 
                                :key="item.value" 
                                :label="item.name" 
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="指定数字：" prop="letterAs">
                        <el-input v-model="form.letterAs" placeholder="请输入指定数字"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="type==='create'?handleCreate():handleUpdate()">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {tempRestrictionAddTR,tempRestrictionUpdateTR} from "@/api/system/dict/restriction"
import {getListByParentCode} from '@/api/system/dict'
import {gcjcDivisionList} from "@/api/system/dict/administration"
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //类型
            type:"",
            //显示隐藏
            openDataScope:false,
            //el-cascader配置
            optionProps:{
                value: 'divisionId',
                label: 'divisionName',
                lazy: true,
                lazyLoad (node, resolve) {
                    const { level } = node;
                    
                    gcjcDivisionList({pid:node.value}).then(({data}) => {
                        const nodes = [];
                        data.list.map(item=>{
                            let obj = {
                                divisionId: item.divisionId,
                                divisionName: item.divisionName,
                                leaf: level >= 1
                            }
                            nodes.push(obj)
                        })
                        resolve(nodes);
                    })
                }
            },
            //省市级id
            cascaderIds:[],
            //省级数据
            provinceOptions:[],
            //限行时间
            restrictionTime:[],
            //限行规则数据
            ruleOptions:[],
            //限行尾号最终数据
            ruleResultOptions:[],
            //限行尾号数据(单双号)
            ruleResultData:[],
            //限行尾号数据(临时限行)
            restrictionData:[],
            //处理规则数据
            lastLetterOptions:[],
            //表单数据
            form:{
                city:"",
                cityId:"",
                provinceId:"",
                startDate:"",
                endDate:"",
                rule:"",
                ruleResult:"",
                lastLetter:"",
                letterAs:""
            },
            //表单校验
            rules:{
                cityId:[
                    {required:true,message:"城市不能为空",trigger:"change"}
                ],
                startDate:[
                    {required:true,message:"限行时间不能为空",trigger:"change"}
                ],
                rule:[
                    {required:true,message:"限行规则不能为空",trigger:"change"}
                ],
                ruleResult:[
                    {required:true,message:"限行尾号不能为空",trigger:"change"}
                ],
                lastLetter:[
                    {required:true,message:"尾号字母处理规则不能为空",trigger:"change"}
                ],
                letterAs:[
                    {required:true,message:"指定数字不能为空",trigger:"blur"}
                ]
            }
        }
    },
    created(){
        this.getProvinceOptions();
        this.getRuleOptions();
        this.getRuleResultOptions();
        this.getRestrictionOptions();
        this.getLastLetterOptions();
    },
    methods:{
        //初始化
        init(type,row){
            this.type = type;
            this.openDataScope = true;
            this.$nextTick(() => {
                if(type==="create"){
                    this.title = "新建字典"
                }else if(type==="update"){
                    this.title = "修改字典"
                    this.echoView(row);
                }
            })
        },
        //回显界面数据
        echoView(row){
            this.form = Object.assign(this.form, row);

            this.restrictionTime.push(this.parseTime(row.startDate,"{y}-{m}-{d}"));
            this.restrictionTime.push(this.parseTime(row.endDate,"{y}-{m}-{d}"));

            gcjcDivisionList({pid:row.provinceId}).then(({data}) => {
                const nodes = [];
                data.list.map(item=>{
                    let obj = {
                        divisionId: item.divisionId,
                        divisionName: item.divisionName,
                        leaf: 'leaf'
                    }
                    nodes.push(obj)
                })
                const obj = this.provinceOptions.find((item) => {
                    return item.divisionId===row.provinceId;
                })
                this.$set(obj, 'children',nodes)
            })
            this.cascaderIds.push(row.provinceId);
            this.cascaderIds.push(row.cityId);

            let obj = this.ruleOptions.find((item) => {
                return item.code===row.rule;
            })
            if("单双号"===obj.name){
                this.ruleResultOptions = this.ruleResultData;
            }else if("临时限行"===obj.name){
                this.ruleResultOptions = this.restrictionData;
            }
        },
        //获取省级数据
        async getProvinceOptions(){
            this.loading = true;
            await gcjcDivisionList({pid:0}).then(({data}) => {
                this.loading = false;
                this.provinceOptions = data.list;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取限行规则数据
        async getRuleOptions(){
            this.loading = true;
            await getListByParentCode("1011").then(({data}) => {
                this.loading = false;
                this.ruleOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取限行尾号数据(单双号)
        async getRuleResultOptions(){
            this.loading = true;
            await getListByParentCode("1012").then(({data}) => {
                this.loading = false;
                this.ruleResultData = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取限行尾号数据（临时限行）
        async getRestrictionOptions(){
            this.loading = true;
            await getListByParentCode("1009").then(({data}) => {
                this.loading = false;
                this.restrictionData = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取尾号字母处理规则数据
        async getLastLetterOptions(){
            this.loading = true;
            await getListByParentCode("1010").then(({data}) => {
                this.loading = false;
                this.lastLetterOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //城市选择回调
        handleCascaderChange(value){
            this.form.provinceId = value[0];
            this.form.cityId = value[1];
            
            const checkedNode =  this.$refs.elCascader.getCheckedNodes();
            this.form.city = checkedNode[0].label;
        },
        //限时时间选择回调
        handleDateChange(){
            this.form.startDate = this.restrictionTime[0];
            this.form.endDate = this.restrictionTime[1];
        },
        //限行规则选择回调
        handleRuleChange(value){
            if("单双号"===value){
                this.ruleResultOptions  = this.ruleResultData;
            }else if("临时限行"===value){
                this.ruleResultOptions = this.restrictionData;
            }
        },
        //新建
        handleCreate(){
           this.$refs.elform.validate(async (valid) => {
               if (valid) {
                   this.loading = true;
                   await tempRestrictionAddTR(Object.assign({}, this.form)).then(({message}) => {
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
        //编辑
        handleUpdate(){
            this.$refs.elform.validate(async (valid) => {
               if (valid) {
                   this.loading = true;
                   await tempRestrictionUpdateTR(Object.assign({}, this.form)).then(({message}) => {
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
            this.cascaderIds = [];
            this.restrictionTime = [];
            this.ruleResultOptions = [];
            this.$refs.elform.resetFields();
        }
    }
}
</script>
<style scoped>
::v-deep .fold_label .el-form-item__label {
  white-space: pre-line;
  line-height: 20px;
}
</style>>