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
        <activiti-assignee ref="activitiAssignee" @carSuccess="carSuccess"></activiti-assignee>
    </el-dialog>
</template>

<script>
import { modelList } from '@/api/system/activiti'
import activitiAssignee from "./activitiAssignee";
export default {
    components: { activitiAssignee },
    data() {
        return {
            loading: false,
            title: '工作流列表',
            openWorkflow: false,
            row: {},
            dataList: [],
            ids: [],
            selectChangeData: {}
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
        modelList () {
            this.loading = true;
            modelList({flag: 0}).then(({data}) => {
                this.dataList = data.list || [];
                this.loading = false;
            })
        },
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
        },
        submitDataScope () {
            if(this.ids.length == 1){
                this.$refs.activitiAssignee.init(this.row, this.ids)
            }else{
                this.$modal.msgWarning('请选择一条数据！');
                return false;
            }
        },
        carSuccess () {
            this.openWorkflow = false;
            this.$emit('carSuccess');
        }
    }
};
</script>