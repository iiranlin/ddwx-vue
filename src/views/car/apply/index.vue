<template>
  <div class="container-calendar" :style="{'--theme':theme}">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <i class="el-icon-caret-right" :style="activeNames.indexOf('1') != -1?'transform:rotate(90deg)':''"/>
          <span class="title-right">可用车辆</span>
          <span class="title-span">下表数量说明：黑色字体为车辆数量；蓝色字体为已预约车辆数量；绿色字体为已受理车辆数量；橙色字体为可用车辆数量。</span>
        </template>
        <el-calendar v-model="calendarVal">
          <div slot="dateCell" slot-scope="{data}" @click="calendarClick(data)">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
            </p>
            <div v-for="item in dateList" :key="item.assignTime">
              <p class="calendar-p-span" v-if="item.assignTime.indexOf(data.day) != -1">
                <span>{{item.tasscount}} 辆</span>
                <span>{{item.nasscount}} 辆</span>
                <span>{{item.sasscount}} 辆</span>
                <span>{{item.tasscount - item.nasscount - item.sasscount}} 辆</span>
              </p>
            </div>
          </div>
        </el-calendar>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <i class="el-icon-caret-right" :style="activeNames.indexOf('2') != -1?'transform:rotate(90deg)':''"/>
          <span class="title-right">用车信息</span>
        </template>
        <el-form ref="elForm" style="margin-left: 20px;" :inline="true" :model="formData" :rules="rules" label-width="85px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="用车事由:" prop="reasonCode">
                <el-select
                  v-model="formData.reasonCode"
                  placeholder="请选择用车事由"
                  clearable
                  filterable
                >
                  <el-option v-for="item in dictionariesObj['1016']" 
                    :key="item.code" 
                    :label="item.name" 
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用车需求:" prop="demandCode">
                <el-select
                  v-model="formData.demandCode"
                  placeholder="请选择用车需求"
                  clearable
                  filterable
                >
                  <el-option v-for="item in dictionariesObj['10018']"
                    :key="item.code" 
                    :label="item.name" 
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否长途:" prop="longDistanceTag">
                <el-radio-group v-model="formData.longDistanceTag">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="乘坐人数:" prop="usagePersons">
                <el-input v-model="formData.usagePersons" style="width: 217px" maxlength="200" placeholder="请输入乘坐人数" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="乘车人:" prop="userName">
                <el-input v-model="formData.userName" style="width: 217px" maxlength="200" placeholder="请输入乘车人" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="formData.phone" style="width: 217px" maxlength="200" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用车日期:" prop="usageDate">
                <el-input v-model="formData.usageDate" style="width: 217px" disabled maxlength="200" placeholder="请选择用车日期" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出发时间:" prop="usageTime">
                <el-input v-model="formData.usageTime" style="width: 217px" maxlength="200" placeholder="请输入出发时间" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预计时长:" prop="timeLength">
                <el-input v-model="formData.timeLength" style="width: 217px" maxlength="200" placeholder="请输入预计时长" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="出发地点:" prop="fromAddr">
                <form-address @addressSuccess="addressSuccessOut" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="前往地点:" prop="toAddr">
                <form-address @addressSuccess="addressSuccessTo" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="期望车型:" prop="hopeBrand">
                <el-select
                  v-model="formData.hopeBrand"
                  placeholder="请选择期望车型"
                  clearable
                  filterable
                >
                  <el-option v-for="item in dictionariesObj['1018']" 
                    :key="item.code" 
                    :label="item.name" 
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:" prop="remark">
                <el-input type="textarea" style="width: 1000px" v-model="formData.remark" maxlength="200" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div class="dialog-footer">
      <el-button type="primary" :loading="loading" @click="addRequest">确 定</el-button>
      <el-button @click="closePush">关 闭</el-button>
    </div>
  </div>
</template>

<script>
import { vehicleInfoGetAssignCount } from "@/api/vehicleInfo";
import { addVehicleRequest } from "@/api/gcywVehicleRequest";
import formAddress from "./components/formAddress";
import getDict from "@/views/mixins/getDict"
export default {
  name: "apply",
  mixins: [getDict],
  components: { formAddress },
  data() {
    var checkfromAddr = (rule, value, callback) => {
      if(value.indexOf('null') == -1 && value){
        return callback();
      }else{
        return callback(new Error('请选择出发地点'));
      }
    }
    var checktoAddr = (rule, value, callback) => {
      if(value.indexOf('null') == -1 && value){
        return callback();
      }else{
        return callback(new Error('请选择出发地点'));
      }
    }
    return {
      loading: false,
      dateList: [],
      calendarVal: null,
      activeNames: ['1'],
      dictionariesCode: [1016, 10018, 1018],
      dictionariesObj: {},
      formData: {
        reasonCode: '',
        demandCode: '',
        longDistanceTag: 0,
        usagePersons: '',
        userName: '',
        phone: '',
        usageDate: '',
        usageTime: '',
        timeLength: '',
        fromAddr: '',
        fromAreaId: '',
        toAddr: '',
        toAreaIdd: '',
        hopeBrand: '',
        remark: '',
        source: 1,
      },
      rules: {
        reasonCode:[
            {required:true,message:"请选择用车事由",trigger:"change"}
        ],
        demandCode:[
            {required:true,message:"请选择用车需求",trigger:"change"}
        ],
        longDistanceTag:[
            {required:true,message:"是否长途",trigger:"change"}
        ],
        usagePersons:[
            {required:true,message:"请输入乘坐人数",trigger:"blur"}
        ],
        userName:[
            {required:true,message:"请输入乘车人",trigger:"blur"}
        ],
        phone:[
            {required:true,message:"请输入联系电话",trigger:"blur"}
        ],
        usageDate:[
            {required:true,message:"请选择用车日期",trigger:"blur"}
        ],
        usageTime:[
            {required:true,message:"请输入出发时间",trigger:"blur"}
        ],
        timeLength:[
            {required:true,message:"请输入预计时长",trigger:"blur"}
        ],
        fromAddr:[
            {required:true,validator: checkfromAddr,trigger:"change"}
        ],
        toAddr:[
            {required:true,validator: checktoAddr,trigger:"change"}
        ],
        hopeBrand:[
            {required:true,message:"请选择期望车型",trigger:"change"}
        ],
      },
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },  
  created() {
    this.vehicleInfoGetAssignCount();
    for(const item of this.dictionariesCode){
      this.getOperateDict(item);
    }
  },
  methods: {
    async getOperateDict (code) {
      const res = await this.getOperateDictList(code);
      this.dictionariesObj[code] = res;
    },
    calendarClick (val) {
      this.formData.usageDate = val.day;
    },
    vehicleInfoGetAssignCount () {
      vehicleInfoGetAssignCount().then(({data}) => {
        this.dateList = data;
      })
    },
    addressSuccessOut (row) {
      let {province, city, area, address} = row;
      this.formData.fromAreaId = `${province && province.divisionId},${city && city.divisionId},${area && area.divisionId}`;
      this.formData.fromAddr = `${province && province.divisionName}/${city && city.divisionName}/${area && area.divisionName} ${address}`;
    },
    addressSuccessTo (row) {
      let {province, city, area, address} = row;
      this.formData.toAreaIdd = `${province && province.divisionId},${city && city.divisionId},${area && area.divisionId}`;
      this.formData.toAddr = `${province && province.divisionName}/${city && city.divisionName}/${area && area.divisionName} ${address}`;
    },
    addRequest () {
      this.$refs.elForm.validate( (valid) => {
        if (valid) {
          addVehicleRequest(this.formData).then( ({message}) => {
            this.$modal.msgSuccess(message);
            this.$router.push({name:'myCar'});
          })
        }
      })
    },
    closePush () {
      this.$router.push({name:'myCar'});
    }
  },
};
</script>
<style lang="scss">
  .container-calendar{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .is-selected {
      color: #{'var(--theme)'};
    }
    .el-icon-caret-right{
      font-size: 20px;
      color: #{'var(--theme)'};
    }
    .title-right{
      font-weight: 600;
      font-size: 15px;
    }
    .title-span{
      margin-left: 38px;
      color: #e77676;
      font-style: oblique;
      font-size: 12px;
    }
    .calendar-p-span{
      span{
        padding-left: 5px;
        &:nth-child(1){
          color: #26413c;
        }
        &:nth-child(2){
          color: #6292ff;
        }
        &:nth-child(3){
          color: #4da32d;
        }
        &:nth-child(4){
          color: #d57b48;
        }
      }
    }
    .dialog-footer{
      margin-top: 20px;
      margin-bottom: 20px;
      margin-left: 85px;
      .el-button--medium{
        padding: 10px 32px;
      }
    }
    .el-calendar-table{
      .el-calendar-day{
        padding: 0px;
        height: 55px;
        p{
          margin: 0px;
          margin-top: 5px;
          text-align: center;
        }
      }
    }
  }
</style>