<template>
    <el-dialog title="下一级审批人" :visible.sync="openWorkflow" width="600px" :close-on-click-modal="false" append-to-body>
        <el-form ref="elForm" :model="form" label-width="110px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="下一级审批人:" prop="id">
                        <el-select v-model="form.id" placeholder="请选择下一级审批人" style="width:100%;">
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
        init (row) {
            this.openWorkflow = true;
            this.deptOptions = row;
            this.form.id = this.deptOptions[0].code;
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
            this.$modal.confirm('是否确认该审批人?').then(() => {
                this.openWorkflow = false;
                this.$emit('carSuccess', this.form.id);
            }).catch(() => {});
        }
    }
};
</script>