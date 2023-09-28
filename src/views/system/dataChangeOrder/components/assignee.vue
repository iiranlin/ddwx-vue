<template>
    <el-dialog title="审批人" :visible.sync="openWorkflow" width="600px" :close-on-click-modal="false" append-to-body>
        <el-form ref="elForm" :model="form" :rules="rules"  label-width="110px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="审批人:" prop="id">
                        <el-select 
                            multiple 
                            filterable
                            v-model="form.id" 
                            placeholder="请选择审批人" 
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
            //显示数据
            deptOptions:[],
            form: {
                id: undefined
            },

            rules: {
                id: [
                    { required: true, message: '审批人不能为空', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        init (row) {
            this.openWorkflow = true;
            this.originDeptOptions = row;
            //隐藏数据
            this.deptOptions = this.originDeptOptions.filter((item) => {
                return item.hide === '0';
            })
            this.form.id = [this.deptOptions[0].code];
        },
        submitDataScope () {
            this.$refs.elForm.validate((result) => {
                if (result) {
                    this.$modal.confirm('是否确认该审批人?').then(() => {
                        this.openWorkflow = false;
                        this.$emit('assingeeSuccess', this.form.id);
                    }).catch(() => {

                    });
                }
            })
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
                    // el.style ="line-height:50px;padding:0; color:#ffffff;";
                    el.style.lineHeight = 50 + 'px';   
                    el.style.padding = 0 ;
                    el.style.color = "#ffffff" ;
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
