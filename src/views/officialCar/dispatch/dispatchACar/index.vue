<template>
  <div class="container-calendar" :style="{'--theme':theme}">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <i class="el-icon-caret-right" :style="activeNames.indexOf('1') != -1?'transform:rotate(90deg)':''"/>
          <span class="title-right">可用车辆</span>
          <span class="title-span">下表数量说明：黑色字体为车辆数量；蓝色字体为已预约车辆数量；绿色字体为已受理车辆数量；橙色字体为可用车辆数量。</span>
        </template>
        <form-calendar :dateList="dateList" :assignTimey="assignTimey" :assignTimer="assignTimer" :usageDate="formData.usageDate"/>
      </el-collapse-item>
      <el-form :inline="true" :model="formData" label-width="112px">
        <el-collapse-item name="2">
          <template slot="title">
            <i class="el-icon-caret-right" :style="activeNames.indexOf('2') != -1?'transform:rotate(90deg)':''"/>
            <span class="title-right">用车信息</span>
          </template>
          <div class="form-row">
            <el-row>
              <el-col :span="8">
                <el-form-item label="用车事由:" prop="reasonCode">
                  <el-select
                    v-model="formData.reasonCode"
                    placeholder="请选择用车事由"
                    clearable
                    filterable
                    disabled
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
                    disabled
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
                  <el-radio-group v-model="formData.longDistanceTag" disabled>
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="乘坐人数:" prop="usagePersons">
                  <el-input disabled v-model="formData.usagePersons" style="width: 217px" maxlength="200" placeholder="请输入乘坐人数" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="乘车人:" prop="userName">
                  <el-input disabled v-model="formData.userName" style="width: 217px" maxlength="200" placeholder="请输入乘车人" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系电话:" prop="phone">
                  <el-input disabled v-model="formData.phone" style="width: 217px" maxlength="200" placeholder="请输入联系电话" />
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
                  <el-time-picker
                    v-model="formData.usageTime"
                    value-format="HH:mm"
                    format="HH:mm"
                    disabled
                    placeholder="请输入出发时间">
                  </el-time-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预计时长:" prop="timeLength">
                  <el-input disabled v-model="formData.timeLength" style="width: 217px" maxlength="200" placeholder="请输入预计时长" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="出发地点:" prop="fromAddr">
                  <form-address ref="formAddress1" :name="'出发地'" @addressSuccess="addressSuccessOut" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="前往地点:" prop="toAddr">
                  <form-address ref="formAddress2" :name="'目的地'" @addressSuccess="addressSuccessTo" />
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
                    disabled
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
                  <el-input type="textarea" disabled style="width: 1000px" v-model="formData.remark" maxlength="200" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-form>
      <el-collapse-item name="3">
        <template slot="title">
          <i class="el-icon-caret-right" :style="activeNames.indexOf('3') != -1?'transform:rotate(90deg)':''"/>
          <span class="title-right">派车信息</span>
          <span
            class="title-right-button"
            @click.stop.prevent="addCarButton"
          >
            <el-button type="text"> <i class="el-icon-plus"></i> 新增车辆</el-button>
          </span>
        </template>
        <form-information ref="formInformation"/>
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
import formAddress from "./components/formAddress";
import formCalendar from "./components/formCalendar";
import formInformation from "./components/formInformation";
import getDict from "@/views/mixins/getDict"
export default {
  name: "dispatchACar",
  mixins: [getDict],
  components: { formAddress, formCalendar, formInformation },
  data() {
    return {
      loading: false,
      dateList: [],
      assignTimey: '2022-05-23',
      assignTimer: '2022-05-29',
      activeNames: ['1', '2', '3'],
      dictionariesCode: [1016, 10018, 1018],
      dictionariesObj: {},
      addCarInfoList: [],
      formData: {
        id: '',
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
    this.$nextTick( () => {
      if(this.$route.query.row){
        let row = JSON.parse(this.$route.query.row);
        this.formData = {
          id: row.id,
          reasonCode: row.reasonCode,
          demandCode: row.demandCode,
          longDistanceTag: row.longDistanceTag,
          usagePersons: row.usagePersons,
          userName: row.userName,
          phone: row.phone,
          usageDate: row.usageDate,
          usageTime: row.usageTime,
          timeLength: row.timeLength,
          fromAddr: row.fromAddr,
          fromAreaId: row.fromAreaId,
          toAddr: row.toAddr,
          toAreaIdd: row.toAreaIdd,
          hopeBrand: row.hopeBrand,
          remark: row.remark,
          source: 1,
        }
        this.$refs.formAddress1.init(row.fromAddr);
        this.$refs.formAddress2.init(row.toAddr);
      }
    })
  },
  methods: {
    async getOperateDict (code) {
      const res = await this.getOperateDictList(code);
      this.dictionariesObj[code] = res;
    },
    weekCheckingIn(assignTime, type){
      this.weekChecking_inloading = true
      var now = new Date(assignTime);
      var nowTime = now.getTime() ;
      var day = now.getDay()|| 7;// 不加 || 7.周末会变成下周一
      var oneDayTime = 24*60*60*1000 ;
      var MondayTime = nowTime - (day-1)*oneDayTime ;//显示周一
      var SundayTime =  nowTime + (7-day)*oneDayTime ;//显示周日
      //调用方法
      if(type == '周一'){
        return this.formatDate(new Date(MondayTime));
      }else if(type == '周日'){
        return this.formatDate(new Date(SundayTime));
      }
    },
    //格式化日期：yyyy-MM-dd
    formatDate(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();
      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      return (myyear + "-" + mymonth + "-" + myweekday);
    },
    vehicleInfoGetAssignCount () {
      vehicleInfoGetAssignCount().then(({data}) => {
        this.dateList = data;
        this.assignTimey = this.weekCheckingIn(data[0].assignTime, '周一');
        this.assignTimer = this.weekCheckingIn(data[data.length - 1].assignTime, '周日');
      })
    },
    addressSuccessOut (row) {
      let {id, name} = row;
      this.formData.fromAreaId = id;
      this.formData.fromAddr = name;
    },
    addressSuccessTo (row) {
      let {id, name} = row;
      this.formData.toAreaIdd = id;
      this.formData.toAddr = name;
    },
    addRequest () {
      this.$refs.formInformation.addRequest();
    },
    closePush () {
      this.$router.push({name:'workspace'});
    },
    addCarButton () {
      this.$refs.formInformation.addCarButton();
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
    .dialog-footer{
      margin-top: 20px;
      margin-bottom: 20px;
      text-align: center;
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
          text-align: center;
        }
      }
    }
    .form-row{
      margin-left: 20px;
    }
  }
</style>