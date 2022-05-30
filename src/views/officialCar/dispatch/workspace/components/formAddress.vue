<template>
  <div class="select-address">
    <el-select
      v-model="formData.province"
      placeholder="请选择省"
      value-key="divisionId"
      clearable
      filterable
      class="select-address-select"
    >
      <el-option v-for="item in provinceList"
        :key="item.divisionId"
        :label="item.divisionName"
        :value="item">
      </el-option>
    </el-select>
    <el-select
      v-model="formData.city"
      placeholder="请选择市"
      value-key="divisionId"
      clearable
      filterable
      class="select-address-select"
    >
      <el-option v-for="item in cityList"
        :key="item.divisionId"
        :label="item.divisionName"
        :value="item">
      </el-option>
    </el-select>
    <el-select
      v-model="formData.area"
      placeholder="请选择区"
      value-key="divisionId"
      clearable
      filterable
      class="select-address-select"
    >
      <el-option v-for="item in areaList"
        :key="item.divisionId"
        :label="item.divisionName"
        :value="item">
      </el-option>
    </el-select>
    <el-input style="width: 150px" v-model="formData.address" maxlength="200" placeholder="请输入详情地址" />
  </div>
</template>

<script>
import { gcjcDivisionList } from "@/api/system/dict/administration";
import { gcjcCommonAddressListAll, gcjcCommonAddressSaveorupdate } from "@/api/gcjcCommonAddress";
import getDict from "@/views/mixins/getDict";
export default {
  mixins: [getDict],
  props: {
    name: {
        type: String,
        default: "",
    },
  },
  data() {
    return {
      formData: {
        province: null,
        city: null,
        area: null,
        address: null,
      },
      provinceList: [],
      cityList: [],
      areaList: [],
      dictionariesArr: [],
      addressType: '',
      gcjcCommonAddressList: [],
      addr: '',
    }
  },
  watch: {
    'formData.province': {
      handler(newVal, oldVal) {
        this.formData.city = null;
        this.cityList = [];
        if(newVal){
          this.gcjcDivisionList(newVal.divisionId, 'city');
        }else{
          this.formData.province = null;
        }
        this.formDataFlin();
      },
    },
    'formData.city': {
      handler(newVal, oldVal) {
        this.formData.area = null;
        this.areaList = [];
        if(newVal){
          this.gcjcDivisionList(newVal.divisionId, 'area');
        }else{
          this.formData.city = null;
        }
        this.formDataFlin();
      },
    },
    'formData.area': {
      handler(newVal, oldVal) {
        if(!newVal){
          this.formData.area = null;
        }
        this.formDataFlin();
      },
    },
    'formData.address': {
      handler(newVal, oldVal) {
        if(!newVal){
          this.formData.address = null;
        }
        this.formDataFlin();
      },
    },
    'provinceList': {
      handler(newVal, oldVal) {
        this.newValArr(newVal, 0, 'province');
      },
    },
    'cityList': {
      handler(newVal, oldVal) {
        this.newValArr(newVal, 1, 'city');
      },
    },
    'areaList': {
      handler(newVal, oldVal) {
        this.newValArr(newVal, 2, 'area');
      },
    }
  },
  created() {
    this.gcjcDivisionList(0, 'province');
    this.gcjcCommonAddressListAll();
    this.getOperateDict(10019);
  },
  methods: {
    init (row) {
      this.addr = row;
      this.formData.address = row.split(' ')[1];
    },
    newValArr(newVal, i, name) {
      if(this.addr){
        let newValArr = this.addr.split(' ');
        let id = newValArr[0].split('/');
        newVal.forEach( (item) => {
          if(id[i] == item.divisionName){
            this.formData[name] = item;
          }
        })
      }
    },
    async getOperateDict (code) {
      const res = await this.getOperateDictList(code);
      this.dictionariesArr = res;
      this.dictionariesArr.forEach( (item) => {
        if(this.name == item.name){
          this.addressType = item.code;
        }
      })
    },
    gcjcDivisionList (id, type) {
      gcjcDivisionList({pid: id}).then( ({data}) => {
        this[type + 'List'] = data.list || [];
      })
    },
    gcjcCommonAddressListAll () {
      gcjcCommonAddressListAll().then( ({data}) => {
        this.gcjcCommonAddressList = data;
      })
    },
    dropdownClick (row) {
      this.formData = {
        province: null,
        city: null,
        area: null,
        address: null,
      };
      this.formData.address = row.address;
      this.addr = row.areaLongName + ' ' + row.address
      this.newValArr(this.provinceList, 0, 'province');
    },
    gcjcCommonAddressSaveorupdate () {
      let {province, city, area, address} = this.formData;
      if(province && city && area && address){
        let obj = {
          defualtTag: 1, //默认：1
          deleteTag: 0, //保存：0;删除：1
          addressType: this.addressType,
          provinceId: province.divisionId,
          cityId: city.divisionId,
          areaId: area.divisionId,
          address: address,
          areaLongName: `${province.divisionName}/${city.divisionName}/${area.divisionName}`
        }
        gcjcCommonAddressSaveorupdate(obj).then( ({message}) => {
          this.gcjcCommonAddressListAll();
          this.$modal.msgSuccess(message);
        })
      }else{
        this.$modal.msgWarning('请填写完成地址！');
      }
    },
    formDataFlin() {
      let {province, city, area, address} = this.formData;
      let fromAreaId = `${province && province.divisionId},${city && city.divisionId},${area && area.divisionId}`;
      let fromAddr = `${province && province.divisionName}/${city && city.divisionName}/${area && area.divisionName} ${address}`;
      this.$emit('addressSuccess', {id: fromAreaId, name: fromAddr});
    }
  }
};
</script>
<style lang="scss">
.select-address{
  .select-address-select{
    margin-right: 10px;
    width: 138px;
  }
}
</style>
