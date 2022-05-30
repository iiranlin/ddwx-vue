<template>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="600px" :close-on-click-modal="false" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="地址类型:" prop="addressType">
              <el-select
                v-model="form.addressType"
                placeholder="请选择地址类型"
                clearable
                filterable
              >
                <el-option v-for="item in dictionariesArr" 
                  :key="item.code" 
                  :label="item.name" 
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="别名:" prop="name">
              <el-input v-model="form.name" maxlength="200" placeholder="请输入别名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="省:" prop="provinceId">
              <el-select
                v-model="form.provinceId"
                placeholder="请选择省"
                clearable
                filterable
                @change="provinceChange"
              >
                <el-option v-for="item in provinceList" 
                  :key="item.divisionId" 
                  :label="item.divisionName" 
                  :value="item.divisionId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="市:" prop="cityId">
              <el-select
                v-model="form.cityId"
                placeholder="请选择市"
                clearable
                filterable
                @change="cityChange"
              >
                <el-option v-for="item in cityList" 
                  :key="item.divisionId" 
                  :label="item.divisionName" 
                  :value="item.divisionId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="区:" prop="areaId">
              <el-select
                v-model="form.areaId"
                placeholder="请选择区"
                clearable
                filterable
                @change="areaChange"
              >
                <el-option v-for="item in areaList" 
                  :key="item.divisionId" 
                  :label="item.divisionName" 
                  :value="item.divisionId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否默认:" prop="defualtTag">
              <el-radio-group v-model="form.defualtTag">
                <el-radio :label="'1'">是</el-radio>
                <el-radio :label="'0'">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详情地址:" prop="address">
                <el-input type="textarea" v-model="form.address" maxlength="200" placeholder="请输入详情地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope" :loading="loading">确 定</el-button>
        <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { gcjcCommonAddressSaveorupdate } from "@/api/gcjcCommonAddress";
import { gcjcDivisionList } from "@/api/system/dict/administration";
import getDict from "@/views/mixins/getDict";
export default {
  mixins: [getDict],
  props: {
    deptOptions: {
        type: Array,
        default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      title: '新建地址',
      openDataScope: false,
      dictionariesArr: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      form: {
        deleteTag: '0', //保存：0;删除：1
        addressType: '',
        name: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        defualtTag: '1', //默认：1
        address: '',
        areaLongName: ''
      },
      // 表单校验
      rules: {
        addressType: [
          { required: true, message: "请选择地址类型", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入别名", trigger: "blur" }
        ],
        provinceId: [
          { required: true, message: "请选择省", trigger: "change" }
        ],
        cityId: [
          { required: true, message: "请选择市", trigger: "change" }
        ],
        areaId: [
          { required: true, message: "请选择区", trigger: "change" }
        ],
        defualtTag: [
          { required: true, message: "请选择是否默认", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入详情地址", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getOperateDict(10019);
    this.gcjcDivisionList(0, 'province');
  },
  methods: {
    init (type, row) {
      this.openDataScope = true;
      this.$nextTick(() => {
          this.$refs.elForm.resetFields();
          if(type === 'update'){
            this.title = "修改地址";
            this.form = {
              id: row.id,
              deleteTag: '0', //保存：0;删除：1
              addressType: row.addressType,
              name: row.name,
              provinceId: row.provinceId,
              cityId: row.cityId,
              areaId: row.areaId,
              defualtTag: row.defualtTag,
              address: row.address,
              areaLongName: row.areaLongName,
            };
            this.gcjcDivisionList(row.provinceId, 'city');
            this.gcjcDivisionList(row.cityId, 'area');
          }else{
            this.title = "新建地址";
            this.form.id = null;
          }
      })
    },
    formDataFlin() {
      let {provinceId, cityId, areaId} = this.form;
      let provinceName = '', cityName = '', areaName = '';
      this.provinceList.forEach((item) => {
        if(item.divisionId == provinceId){
          provinceName = item.divisionName;
        }
      })
      this.cityList.forEach((item) => {
        if(item.divisionId == cityId){
          cityName = item.divisionName;
        }
      })
      this.areaList.forEach((item) => {
        if(item.divisionId == areaId){
          areaName = item.divisionName;
        }
      })
      this.form.areaLongName = `${provinceName}/${cityName}/${areaName}`;
    },
    gcjcDivisionList (id, type) {
      gcjcDivisionList({pid: id}).then( ({data}) => {
        this[type + 'List'] = data.list || [];
      })
    },
    async getOperateDict (code) {
      const res = await this.getOperateDictList(code);
      this.dictionariesArr = res;
    },
    submitDataScope () {
      this.$refs.elForm.validate( (valid) => {
          if (valid) {
            this.loading = true;
            this.formDataFlin();
            gcjcCommonAddressSaveorupdate(this.form).then( ({message}) => {
              this.openDataScope = false;
              this.loading = false;
              this.$modal.msgSuccess(message);
              this.$emit('addressSuccess');
            })
          }
      })
    },
    provinceChange (val) {
      if(val){
        this.form.cityId = '';
        this.form.areaId = '';
        this.cityList = [];
        this.areaList = [];
        this.gcjcDivisionList(val, 'city');
      }
    },
    cityChange (val) {
      if(val){
        this.form.areaId = '';
        this.areaList = [];
        this.gcjcDivisionList(val, 'area');
      }
    },
    areaChange (val) {

    },
  }
};
</script>