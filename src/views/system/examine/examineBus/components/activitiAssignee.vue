<template>
    <el-dialog title="下一级审批人" :visible.sync="openWorkflow" width="600px" :close-on-click-modal="false" append-to-body>
        <el-form ref="elForm" :model="form" label-width="110px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="下一级审批人:" prop="id">
                        <el-select multiple v-model="form.id" placeholder="请选择下一级审批人" style="width:100%;">
                            <el-option v-for="item in deptOptions" 
                                :key="item.code" 
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
import { activitiStart, activitiComplete } from '@/api/system/activiti'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    components: { Treeselect },
    data() {
        return {
            loading: false,
            openWorkflow: false,
            row: {},
            deptOptions: undefined,
            ids: [],
            form: {
                id: undefined
            },
            selectChangeData: {},
            comment: '',
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
                    this.form.id = data.assignee;
                    this.activitiComplete();
                }else{
                    this.form.id = undefined;
                    if(data.assigneeList && data.assigneeList.length > 0){
                        this.deptOptions = data.assigneeList;
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
            this.$modal.confirm('是否确认该审批人?').then(() => {
                this.loading = true;
                if(this.row.workflowId){
                    this.activitiComplete();
                }else{
                    let obj = {
                        candidateUser: this.form.id,
                        procDefId: this.ids[0] || this.row.procDefId,
                        businessId: this.row.id
                    };
                    activitiStart(obj).then( ({message}) => {
                        this.$modal.msgSuccess(message);
                        this.openWorkflow = false;
                        this.loading = false;
                        this.$emit('carSuccess');
                    })
                }
            }).catch(() => {});
        },
        carSuccess () {
            this.openWorkflow = false;
            this.$emit('carSuccess');
        }
    }
};
</script>