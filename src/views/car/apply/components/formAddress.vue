<template>
  <div class="select-address">
    <el-row :gutter="24">
      <el-col :span="5">
        <el-select
          v-model="formData.province"
          placeholder="请选择用"
          value-key="divisionId"
          clearable
          filterable
        >
          <el-option v-for="item in provinceList" 
            :key="item.divisionId" 
            :label="item.divisionName" 
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="formData.city"
          placeholder="请选择用"
          value-key="divisionId"
          clearable
          filterable
        >
          <el-option v-for="item in cityList" 
            :key="item.divisionId" 
            :label="item.divisionName" 
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="formData.area"
          placeholder="请选择用"
          value-key="divisionId"
          clearable
          filterable
        >
          <el-option v-for="item in areaList" 
            :key="item.divisionId" 
            :label="item.divisionName" 
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <div style="position: relative">
          <el-input v-model="formData.address" maxlength="200" placeholder="请输入详情地址" />
          <el-dropdown class="dropdown-address" trigger="click">
            <div class="avatar-wrapper">
              <i class="address-svg el-icon-location-outline" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="true">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="true">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="text" class="text-underline">设为常用地址</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { gcjcDivisionList } from "@/api/system/dict/administration";
import { gcjcCommonAddressListAll, gcjcCommonAddressSaveorupdate } from "@/api/gcjcCommonAddress";
export default {
  data() {
    return {
      formData: {
        province: null,
        city: null,
        area: null,
        address: null
      },
      provinceList: [],
      cityList: [],
      areaList: [],
    }
  },
  watch: {
    'formData.province': {
      deep: true,
      handler(newVal, oldVal) {
        this.formData.city = null;
        this.cityList = [];
        if(newVal){
          this.gcjcDivisionList(newVal.divisionId, 'city');
        }else{
          this.formData.province = null;
        }
      },
    },
    'formData.city': {
      deep: true,
      handler(newVal, oldVal) {
        this.formData.area = null;
        this.areaList = [];
        if(newVal){
          this.gcjcDivisionList(newVal.divisionId, 'area');
        }else{
          this.formData.city = null;
        }
      },
    },
    'formData.area': {
      deep: true,
      handler(newVal, oldVal) {
        if(!newVal){
          this.formData.area = null;
        }
        this.$emit('addressSuccess', this.formData);
      },
    },
    'formData.address': {
      deep: true,
      handler(newVal, oldVal) {
        if(!newVal){
          this.formData.address = null;
        }
        this.$emit('addressSuccess', this.formData);
      },
    },
  },
  created() {
    this.gcjcDivisionList(0, 'province');
    this.gcjcCommonAddressListAll();
  },
  methods: {
    gcjcDivisionList (id, type) {
      gcjcDivisionList({pid: id}).then( ({data}) => {
        this[type + 'List'] = data.list || [];
      })
    },
    gcjcCommonAddressListAll () {
      gcjcCommonAddressListAll().then( ({data}) => {
        console.log(data)
      })
    },
    gcjcCommonAddressSaveorupdate () {
      gcjcCommonAddressSaveorupdate().then( ({data}) => {

      })
    }
  }
};
</script>
<style lang="scss" scoped>
.select-address{
  .text-underline{
    text-decoration: underline;
  }
  .dropdown-address{
    position: absolute;
    right: 5px;
    .address-svg{
      cursor: pointer;
      color: #409EFF;
    }
  }
}
</style>