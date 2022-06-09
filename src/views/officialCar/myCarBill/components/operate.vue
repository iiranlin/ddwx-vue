<template>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="1100px" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="105px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="用车事由:" prop="menuId">
              <treeselect v-model="form.menuId" :options="menuOptions" :normalizer="normalizer" :disable-branch-nodes="true" placeholder="请选择所属页面" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用车需求:" prop="seq">
              <el-input-number v-model="form.seq" controls-position="right" :min="1" :max="99"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否长途:" prop="sex">
              <el-radio-group v-model="form.sex">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="乘坐人数:" prop="fieldCode">
              <el-input v-model="form.fieldCode" placeholder="请填写乘坐人数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="乘坐人:" prop="fieldName">
              <el-input v-model="form.fieldName" placeholder="请填写乘坐人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话:" prop="fieldWidth">
              <el-input v-model="form.fieldWidth" placeholder="请填写联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="用车日期:" prop="fieldWidth">
              <el-date-picker
                v-model="value1"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出发时间:" prop="fieldWidth">
              <el-time-select
                v-model="value"
                :picker-options="{
                  start: '08:30',
                  step: '00:10',
                  end: '17:30'
                }"
                placeholder="选择时间">
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计时长:" prop="fieldWidth">
              <el-input v-model="form.fieldWidth" placeholder="请填写小时数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="出发地点:" prop="fieldType">
              <el-select
                v-model="form.fieldType"
                placeholder="请选择"
                clearable
                @change="changeFieldType"
              >
                <el-option
                  v-for="dict in fieldTypeList"
                  :key="dict.code"
                  :label="dict.label"
                  :value="dict.code"
                />
              </el-select> 
              <el-select
                class="selectLocation"
                v-model="form.fieldType"
                placeholder="请选择"
                clearable
                @change="changeFieldType"
              >
                <el-option
                  v-for="dict in fieldTypeList"
                  :key="dict.code"
                  :label="dict.label"
                  :value="dict.code"
                />
              </el-select>
              <el-select
                class="selectLocation"
                v-model="form.fieldType"
                placeholder="请选择"
                clearable
                @change="changeFieldType"
              >
                <el-option
                  v-for="dict in fieldTypeList"
                  :key="dict.code"
                  :label="dict.label"
                  :value="dict.code"
                />
              </el-select>   
                     
            </el-form-item>
          </el-col>
          <el-col :span="6">
             <el-input v-model="form.fieldWidth" placeholder="请填写小时数" />
          </el-col> 
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="期望车型:" prop="isSearch">
              <el-select
                v-model="form.fieldType"
                placeholder="请选择"
                clearable
                @change="changeFieldType"
              >
                <el-option
                  v-for="dict in fieldTypeList"
                  :key="dict.code"
                  :label="dict.label"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col >
            <el-form-item label="备注:" prop="isHide" >
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请填写备注"
                v-model="textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="type == 'create'?submitDataScope():fieldModify()">确 定</el-button>
        <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {menuFieldCreate,menuFieldDetail,menuFieldModify} from '@/api/system/menu-field'
import {menuTree} from '@/api/system/menu'
import {commonTree} from '@/api/system/dict/common'
import {alignList} from '@/utils/constant'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  props: {
    menuId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      title: '新增字段',
      type: 'add',
      id: '',
      openDataScope: false,
      menuOptions: [],
      commonTreeList: [],
      fieldTypeList: [
        {code: "String",label: '字符串'},
        {code: "Number",label: '数字'},
        {code: "date",label: '日期'},
        {code: "4",label: '枚举'},
        {code: "dict",label: '字典'},
      ],
      fieldFormatList: [
        {code: "{y}",label: '年'},
        {code: "{y}-{m}",label: '年-月'},
        {code: "{y}-{m}-{d}",label: '年-月-日'},
      ],
      alignList,
      form: {
          fieldCode: '',
          fieldName: '',
          fieldWidth: '',
          menuId: undefined,
          parentId: undefined,
          fieldType: '',
          status: 0,
          seq: 0,
          isHide: 0,
          alignCode: '',
          fieldFormat:'',
          link: '',
          fieldFormatDict: ''
      },
      // 表单校验
      rules: {
        fieldCode: [
          { required: true, message: "字段编号不能为空", trigger: "blur" }
        ],
        fieldName: [
          { required: true, message: "字段名称不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
  },
  methods: {
    getMenuTree () {
      menuTree().then( ({data}) => {
        this.menuOptions = data;
        this.form.menuId = this.menuId || undefined;
      })
    },
    /** 提交按钮（数据权限） */
    init (type, id) {
        this.type = type;
        this.id = id;
        this.openDataScope = true;
        this.$nextTick(() => {
          // this.getMenuTree();
          // this.$refs.elForm.resetFields();
          if(type === 'update'){
            this.title = "修改字段";
            this.fieldDetail(id);
          }
        })
    },
    /** 转换字段数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children,
      };
    },
    /** 转换字段数据结构 */
    normalizera(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    fieldDetail (id) {
      menuFieldDetail(id).then( ({data}) => {
        this.form = data;
        if(data.fieldType === 'dict'){
          this.commonTree();
        }
      })
    },
    submitDataScope () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          menuFieldCreate(this.form).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('operateSuccess')
          });
        }
      })
    },
    fieldModify () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          menuFieldModify(Object.assign({}, this.form, {id: this.id})).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('operateSuccess')
          });
        }
      })
    },
    commonTree () {
      commonTree().then( ({data}) => {
        this.commonTreeList = data
      })
    },
    changeFieldType () {
      let fieldType = this.form.fieldType;
      this.form.fieldFormatDict = undefined;
      this.form.fieldFormat = "";
      if(fieldType === 'dict'){
        this.commonTree();
      }
    },
    inputDict (value, instanceId) {
      if(!value){
        this.form.fieldFormat = "";
      }
    },
    selectDict (node, instanceId) {
      const child = node.children
      let format = {}
      if (child){
        for (const dict of child) {
          format[dict["code"]] = dict["name"]
        }
      }
      this.form.fieldFormat = JSON.stringify(format);
    }
  }
};
</script>
<style lang="scss" scoped>
.cautious{
  color: red;
  margin-left: 10px;
}
.selectLocation{
  margin-left: 12px;
}
</style>