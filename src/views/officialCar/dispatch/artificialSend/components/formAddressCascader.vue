<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="6">
                <el-cascader
                    style="width:100%"
                    ref="elCascader"
                    v-model="cascaderIds"
                    :options="treeOptions"
                    :props="optionProps"
                    placeholder="请选择出发地点"
                    @change="handleCascaderChange">
                </el-cascader>
            </el-col>
            <el-col :span="5">
                <el-input v-model="formData.address" maxlength="50" placeholder="请输入详情地址"/>
            </el-col>
            <el-col :span="2.5">
                <div style="position: relative">
                <el-dropdown class="dropdown-address" trigger="click">
                    <el-button type="text" class="text-underline">选择常用地址</el-button>
                
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="echoView(item)" v-for="item in defaultAddressList" :key="item.id" divided>
                            <div class="dropdown-div">
                                <el-row :gutter="24">
                                    <el-col :span="16">
                                        <p class="dropdown-div-span">{{item.address}}</p>
                                    </el-col>
                                    <!-- <el-col :span="10">
                                        <p  class="dropdown-div-p">{{item.areaLongName}}</p>
                                    </el-col> -->
                                    <el-col :span="8">
                                        <p class="dropdown-div-span" v-if="item.defualtTag == '1'">默认<i class="address-svg el-icon-success"></i></p>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                </div>
            </el-col>
            <el-col :span="2.5">
                <el-button type="text" class="text-underline" @click="gcjcCommonAddressSaveorupdate">设为常用地址</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {gcjcCommonAddressListAll,gcjcCommonAddressSaveorupdate,gcjcDivisionTree } from "@/api/gcjcCommonAddress";

export default {
    
    props: {
        name: {
            type: String,
            default: "",
        },
    },
    data () {
        return {
            //表单数据
            formData: {
                province: null,
                city: null,
                area: null,
                address: null,
                areaLongName:'',
            },
            //常用地址数据
            defaultAddressList: [],
            //省市区级id
            cascaderIds:[],
            //省市区级数据
            treeOptions: [],
            //el-cascader配置
            optionProps:{
                value: 'divisionId',
                label: 'divisionName',
            },
            //是否是复制订单
            isCopy:false,
        }
    },
    watch: {
        'formData.address': {
            handler(newVal, oldVal) {
                if(!newVal){
                    this.formData.address = null;
                }
                this.checkformData();
            },
        },
    },
    created() {
        this.getAddressTreeOptions();
        this.gcjcCommonAddressListAll();
    },
    methods: {
        init (addr,areaId) {
            this.isCopy = true;
            this.formData.province = areaId.split(',')[0];
            this.formData.city = areaId.split(',')[1];
            this.formData.area = areaId.split(',')[2];
            this.formData.address = addr.split(' ')[1];
            this.formData.areaLongName = addr.split(' ')[0];

            this.cascaderIds = [areaId.split(',')[0],areaId.split(',')[1],areaId.split(',')[2]];
           
        },
        //获取常用地址
        gcjcCommonAddressListAll () {
            gcjcCommonAddressListAll({addressType: this.name == '出发地'? 1 : 2}).then( ({data}) => {
                this.defaultAddressList = data;

                if(!this.isCopy){
                    let obj = this.defaultAddressList.find((item) => {
                        return item.defualtTag == '1';
                    })
                    if(!!obj){
                        this.echoView(obj);
                    }else{
                        this.formData.province = '110000';
                        this.formData.city = '110100';
                        this.formData.area = '110108';
                        this.formData.address = '';
                        this.formData.areaLongName = '北京市/北京/海淀区';

                        this.cascaderIds = ['110000', '110100', '110108'];
                    }
                }
            }).catch((err) => {
                
            })
        },
        //获取地区数据
        getAddressTreeOptions(){
            
            gcjcDivisionTree().then(({data}) => {
                this.treeOptions = this.dealTreeListEmptyChildren(data.data);
            }).catch((err) => {

            })
        },
        // 去除空数组
        dealTreeListEmptyChildren(arr = []) {
            arr.forEach(item => {
                if (!item?.children?.length) {
                    delete item.children;
                } else {
                    this.dealTreeListEmptyChildren(item.children)
                }
            });
            return arr;
        },
         //城市选择回调
        handleCascaderChange(value){
            this.formData.province = value[0];
            this.formData.city = value[1];
            this.formData.area = value[2];
            this.formData.areaLongName = '';

            let checkedNode =  this.$refs.elCascader.getCheckedNodes();
            let pathLabels = checkedNode[0].pathLabels;

            pathLabels.forEach((item,index) => {
                if(index === pathLabels.length - 1){
                    this.formData.areaLongName = this.formData.areaLongName + item;
                }else{
                    this.formData.areaLongName = this.formData.areaLongName + item + '/';
                }
            })
            this.checkformData();
        },
        //回显界面数据
        echoView(row){
            this.formData.province = row.provinceId;
            this.formData.city = row.cityId;
            this.formData.area = row.areaId;
            this.formData.address = row.address;
            this.formData.areaLongName = row.areaLongName;

            this.cascaderIds = [row.provinceId,row.cityId,row.areaId];
            this.checkformData();
        },
        //设置常用地址
        gcjcCommonAddressSaveorupdate () {
            let {province, city, area, address,areaLongName} = this.formData;

            if(province && city && area && address){
                let obj = {
                    defualtTag: 1, //默认：1
                    deleteTag: 0, //保存：0;删除：1
                    addressType: this.name == '出发地'? 1 : 2,
                    provinceId: province,
                    cityId: city,
                    areaId: area,
                    address: address,
                    areaLongName: areaLongName,
                }
                gcjcCommonAddressSaveorupdate(obj).then( ({message}) => {
                    this.$modal.msgSuccess(message);
                }).catch((err) => {
                    
                })
            }else{
                this.$modal.msgWarning('请填写完成地址！');
            }
        },
        //表单验证
        checkformData() {
            let {province, city, area, address,areaLongName} = this.formData;
            let fromAreaId = `${province},${city},${area}`;
            let fromAddr = `${areaLongName} ${address}`;
            this.$emit('addressSuccess', {id: fromAreaId, name: fromAddr});
        }
    },
}
</script>
<style lang="scss" scoped>
.text-underline {
    text-decoration: underline;
}
.dropdown-address{
    
    .address-svg{
        cursor: pointer;
        color: #409EFF;
    }
}
::v-deep.el-dropdown-menu  {
    max-height: 600px !important;
    overflow-y: auto !important;
}
.dropdown-div{
    width: 240px;

    .dropdown-div-span{
        line-height: 5px;
        position: relative;

        .address-svg{
            position: absolute;
            top: -5px;
            right: 10px;
            color: #409EFF;
        }
    }
}
</style>