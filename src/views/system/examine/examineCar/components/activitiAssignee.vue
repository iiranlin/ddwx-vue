<template>
    <el-dialog title="下一级审批人" :visible.sync="openWorkflow" width="600px" :close-on-click-modal="false" append-to-body>
        <el-form ref="elForm" :model="form" :rules="rules" label-width="150px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="下一级审批人:" prop="id">
                        <el-select 
                            multiple 
                            filterable
                            v-model="form.id" 
                            placeholder="请选择下一级审批人" 
                            style="width:100%;"
                            ref="template"
                            @visible-change="(v) => visibleChange(v, 'template')">
                            <el-option v-for="(item,index) in deptOptions" 
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
            <el-button type="primary" @click="submitDataScope" :loading="loading">确 定</el-button>
            <el-button @click="openWorkflow = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { activitiAssigneeList } from '@/api/system/activiti'
import { activitiStart, activitiComplete } from '@/api/gcywVehicleRequest'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from 'vuex'
export default {
    components: { Treeselect },
    computed: {
        ...mapGetters(['deptCode'])
    },

    data() {
        return {
            loading: false,
            openWorkflow: false,
             //原始数据
            originDeptOptions: [],
            row: {},
            deptOptions: undefined,
            ids: [],
            form: {
                id: undefined
            },
            selectChangeData: {},
            comment: '',

            rules: {
                id: [
                    { required: true, message: '审批人不能为空', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        init (row, ids, form) {
            this.row = row;
            this.ids = ids || [];
            if(form){
                this.comment = form.comment;
            }
            this.activitiAssigneeList();
        },
        /** 转换部门数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.code,
                label: node.name,
                children: node.children
            };
        },
        activitiAssigneeList () {
            let obj = {
                businessId: this.row.id,
                procDefId: this.ids[0],
                procInstId: this.row.procInstId,
                actId: this.row.actId,
            };
            activitiAssigneeList(obj).then( ({data}) => {
                if(data.assignee){
                    let arrTemp = [];
                    arrTemp.push(data.assignee);
                    this.form.id = arrTemp;
                    this.activitiComplete();
                }else{
                    this.form.id = undefined;
                    if(data.assigneeList && data.assigneeList.length > 0){
                        this.originDeptOptions = data.assigneeList;
                        //隐藏数据
                        this.deptOptions = this.originDeptOptions.filter((item) => {
                            return item.hide === '0';
                        })
                        this.form.id = [data.assigneeList[0].code];
                        this.openWorkflow = true;
                    }else{
                        this.activitiComplete();
                    }
                }
            })
        },
        activitiComplete () {
            let { id, procInstId, taskId } = this.row;
            let comment = this.comment;
            activitiComplete({comment: comment, businessId: id, procInstId: procInstId, taskId: taskId, candidateUser: this.form.id}).then(({message}) => {
                this.$modal.msgSuccess(message);
                this.openWorkflow = false;
                this.loading = false;
                this.$emit('carSuccess');
            })
        },
        selectChange (node, instanceId) {
            this.selectChangeData = node;
        },
        submitDataScope () {
            this.$refs.elForm.validate((result) => {
                if (result) {
                    this.$modal.confirm('是否确认该审批人?').then(() => {
                        this.loading = true;
                        if(this.row.workflowId){
                            this.activitiComplete();
                        }else{
                            this.activitiStart();
                        }
                    }).catch(() => {

                    });
                }
            })
        },
        activitiStart() {
            let obj = {
                assignee: this.form.id,
                procDefId: this.ids[0] || this.row.procDefId,
                businessId: this.row.id
            };
            activitiStart(obj).then( ({message}) => {
                this.$modal.msgSuccess(message);
                this.openWorkflow = false;
                this.loading = false;
                this.$emit('carSuccess');
            })
        },
        carSuccess () {
            this.openWorkflow = false;
            this.$emit('carSuccess');
        },
        handleMoreClick(){
            this.deptOptions = this.originDeptOptions;
        },
        visibleChange(visible, refName) {
            if (visible) {
                const ref = this.$refs[refName];
                let popper = ref.$refs.popper;
                if (popper.$el) popper = popper.$el;
                if (!Array.from(popper.children).some(v => v.className === 'el-template-more')){
                    const el = document.createElement("div");
                    el.className = "el-template-more";
                    el.style ="line-height:50px;padding:0; color:#ffffff;";
                    el.innerHTML =`<span id='more' style="color:#409EFF;font-size:14px;font-weight:600;float:right;margin-right:20px;cursor:pointer;">更多审核人</span>`;
                    popper.appendChild(el);
                    let element = el.firstChild;
                    element.onclick = () => {
                        this.handleMoreClick();
                    };
                }
            }
        },
        
    }
};
</script>