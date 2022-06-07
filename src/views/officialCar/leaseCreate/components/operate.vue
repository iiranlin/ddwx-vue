<template>
    <el-dialog title="审批人" :visible.sync="openWorkflow" width="600px" center :close-on-click-modal="false" append-to-body>
        <el-form ref="elForm" :model="form" label-width="110px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="审批人:" prop="code">
                        <treeselect
                            v-model="form.code"
                            :options="assigneeList"
                            :normalizer="normalizer"
                            @select="selectChange"
                            placeholder="请选择审批人" />
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
            assigneeList:[],
            selectChangeData: {},
            form: {
                code: null
            },
        }
    },
    methods: {
        init (assigneeList) {
            this.form.code = null;
            this.assigneeList = assigneeList;
            this.openWorkflow = true;
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
        selectChange (node, instanceId) {
            this.selectChangeData = node;
        },
        submitDataScope () {
            if(!this.selectChangeData){
                 this.$modal.msgWarning('请选择审批人！');
                 return;
            }
            if(this.selectChangeData.type == '5'){
                this.openWorkflow = false;
                this.$emit("operateSuccess",this.form.code);
            }else{
                this.$modal.msgWarning('请选择审批人！');
            }
        },
    }
};
</script>