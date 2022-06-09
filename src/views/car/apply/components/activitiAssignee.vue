<template>
    <el-dialog title="下一级审批人" :visible.sync="openWorkflow" width="600px" :close-on-click-modal="false" append-to-body>
        <el-form ref="elForm" :model="form" label-width="110px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="下一级审批人:" prop="id">
                        <treeselect
                            v-model="form.id"
                            :options="deptOptions"
                            :normalizer="normalizer"
                            @select="selectChange"
                            placeholder="选择下一级审批人" />
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
                id: null
            },
            selectChangeData: {},
            comment: '',
        }
    },
    methods: {
        init (row) {
            this.openWorkflow = true;
            this.deptOptions = row;
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
        selectChange (node) {
            this.selectChangeData = node;
        },
        submitDataScope () {
            if(this.selectChangeData.type == '5'){
                this.openWorkflow = false;
                this.$emit('carSuccess', this.selectChangeData);
            }else{
                this.$modal.msgWarning('请选择人！');
            }
        }
    }
};
</script>