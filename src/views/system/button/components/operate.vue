<template>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="700px" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="105px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属页面:" prop="menuId">
              <treeselect v-model="form.menuId" :options="buttonOptions" :normalizer="normalizer" :disable-branch-nodes="true" placeholder="请选择所属页面" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按钮图标:" prop="buttonIcon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.buttonIcon" placeholder="点击选择按钮图标" readonly>
                  <svg-icon
                    v-if="form.buttonIcon"
                    slot="prefix"
                    :icon-class="form.buttonIcon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="按钮编号:" prop="buttonCode">
              <el-input v-model="form.buttonCode" placeholder="请输入按钮编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按钮名称:" prop="buttonName">
              <el-input v-model="form.buttonName" placeholder="请输入按钮名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="按钮位置:" prop="buttonLocal">
              <el-checkbox v-model="form.isTop" :true-label="1" :false-label="0">顶部</el-checkbox>
              <el-checkbox v-model="form.isRow" :true-label="1" :false-label="0">列表</el-checkbox>
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="排序:" prop="seq">
              <el-input-number v-model="form.seq" controls-position="right" :min="1" :max="99"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
         
         <el-col :span="12">
            <el-form-item label="是否启用:" prop="status">
              <el-checkbox v-model="form.status" :true-label="0" :false-label="1">是</el-checkbox>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="按钮类型:" prop="buttonType">
              <el-select v-model="form.buttonType" placeholder="请选择按钮类型" clearable >
                <el-option
                  v-for="dict in buttonTypeList"
                  :key="dict.code"
                  :label="dict.label"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
           <el-form-item label="操作模式:" prop="buttonMode">
              <el-select v-model="form.buttonMode" placeholder="请选择操作模式" clearable >
                <el-option
                  v-for="dict in buttonModeList"
                  :key="dict.code"
                  :label="dict.label"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="type == 'create'?submitDataScope():buttonModify()">确 定</el-button>
        <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {menuButtonCreate, menuButtonDetail, menuButtonModify} from '@/api/system/menu-button';
import {menuTree} from '@/api/system/menu';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
export default {
  components: { Treeselect, IconSelect },
  props: {
    menuId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      title: '新增功能按钮',
      type: 'add',
      id: '',
      openDataScope: false,
      buttonOptions: [],
      // pageType: [
      //   {code: 0,label: '列表页'},
      //   {code: 1,label: '编辑页'},
      //   {code: 2,label: '详情页'},
      // ],
      buttonTypeList: [
        {code: 'primary',label: '主要按钮'},
        {code: 'success',label: '成功按钮'},
        {code: 'info',label: '信息按钮'},
        {code: 'warning',label: '警告按钮'},
        {code: 'danger',label: '危险按钮'},
      ],
      buttonModeList: [
        {code: '1',label: '单条操作'},
        {code: '2',label: '多条操作'},
      ],
      form: {
          buttonIcon: '',
          buttonCode: '',
          buttonName: '',
          buttonUrl: '',
          parentId: undefined,
          // pageType: '',
          seq: 0,
          status: 0,
          isTop: 1,
          isRow: 1,
          buttonType: 'primary',
          buttonMode: '',
          menuId: ''
      },
      // 表单校验
      rules: {
        buttonCode: [
          { required: true, message: "按钮编号不能为空", trigger: "blur" }
        ],
        buttonName: [
          { required: true, message: "按钮名称不能为空", trigger: "blur" }
        ],
        buttonUrl: [
          { required: true, message: "按钮密码不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
    
  },
  methods: {
    /** 提交按钮（数据权限） */
    init (type, id) {
      this.getMenuTree();
      this.type = type;
      this.id = id;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.$refs.elForm.resetFields();
        if(type === 'update'){
          this.title = "修改按钮";
          this.buttonDetail(id);
        }
      })
    },
    // 选择图标
    selected(name) {
      this.form.buttonIcon = name;
    },
    /** 转换按钮数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children
      };
    },
    getMenuTree () {
      menuTree().then( ({data}) => {
        this.buttonOptions = data;
        this.form.menuId = this.menuId || undefined;
      })
    },
    buttonDetail (id) {
      menuButtonDetail(id).then( ({data}) => {
          this.form = data;
          this.form.parentId = data.parentId || undefined;
      })
    },
    submitDataScope () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          menuButtonCreate(this.form).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('buttonSuccess')
          });
        }
      })
    },
    buttonModify () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          menuButtonModify(Object.assign({}, this.form, {id: this.id})).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('buttonSuccess')
          });
        }
      })
    }
  }
};
</script>