<template>
  <div class="select-address">
    <el-row :gutter="24">
      <el-col :span="5">
        <el-select
          v-model="formData.province"
          placeholder="请选择省"
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
          placeholder="请选择市"
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
          placeholder="请选择区"
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
              <el-dropdown-item @click.native="dropdownClick(item)" v-for="item in gcjcCommonAddressList" :key="item.id" divided>
                <div class="dropdown-div">
                  <el-row :gutter="24">
                    <el-col :span="9">
                      <p class="dropdown-div-span">{{item.address}}</p>
                    </el-col>
                    <el-col :span="10">
                      <p  class="dropdown-div-p">{{item.areaLongName}}</p>
                    </el-col>
                    <el-col :span="5">
                      <p class="dropdown-div-span" v-if="item.defualtTag == '1'">默认<i class="address-svg el-icon-success"></i></p>
                    </el-col>
                  </el-row>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="text" class="text-underline" @click="gcjcCommonAddressSaveorupdate">设为常用地址</el-button>
      </el-col>
    </el-row>
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
.dropdown-div{
  .dropdown-div-span{
    line-height: 28px;
    position: relative;
    .address-svg{
      position: absolute;
      top: 25px;
      right: 10px;
      color: #409EFF;
    }
  }
  .dropdown-div-p{
    line-height: 20px;
  }
}
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