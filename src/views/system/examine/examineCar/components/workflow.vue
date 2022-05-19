<template>
    <el-dialog :title="title" :visible.sync="openWorkflow" width="600px" :close-on-click-modal="false" append-to-body>
        <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="模型名称" align="center" prop="name" :show-overflow-tooltip="true" />
            <el-table-column label="单据类型" align="center" prop="key" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitDataScope" :loading="loading">确 定</el-button>
            <el-button @click="openWorkflow = false">取 消</el-button>
        </div>
        <el-dialog title="下一级审批人" :visible.sync="openWorkflowA" width="600px" :close-on-click-modal="false" append-to-body>
            <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="审批人:" prop="id">
                            <treeselect v-model="form.id" :options="deptOptions" :normalizer="normalizer" placeholder="选择审批人" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataScopeA" :loading="loading">确 定</el-button>
                <el-button @click="openWorkflowA = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script>
import { modelList, activitiAssigneeList } from '@/api/system/activiti'
import { activitiStart } from '@/api/gcywVehicleRequest'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    components: { Treeselect },
    data() {
        return {
            loading: false,
            title: '工作流列表',
            openWorkflow: false,
            openWorkflowA: false,
            row: {},
            dataList: [],
            deptOptions: undefined,
            ids: [],
            form: {
                id: ''
            },
            rules: {

            }
        }
    },
    created() {
    },
    methods: {
        init (row) {
            this.row = row;
            this.openWorkflow = true;
            this.modelList();
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
        modelList () {
            modelList({flag: 0}).then(({data}) => {
                this.dataList = data.list || [];
            })
        },
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.deploymentId);
        },
        submitDataScope () {
            if(this.ids.length == 1){
                this.openWorkflowA = true;
                activitiAssigneeList({businessId: this.row.id,procDefId: this.ids[0]}).then( ({data}) => {
                    this.deptOptions = data;
                })
            }else{
                this.$modal.msgWarning('请选择一条数据！');
                return false;
            }
        },
        submitDataScopeA () {
            activitiStart({assignee: this.form.id,procDefId: this.ids[0],businessId: this.row.id}).then( ({message}) => {
                this.$modal.msgSuccess(message);
                this.openWorkflow = false;
                this.openWorkflowA = false;
            })
        }
    }
};
</script>