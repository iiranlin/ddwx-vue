<template>
  <div class="container-calendar" :style="{'--theme':theme}">
    <el-collapse v-model="activeNames" @change="handleChange">
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
        <el-form ref="elForm" :inline="true" :model="formData" :rules="rules" label-width="85px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="用车事由:" prop="menuUrl">
                <el-select
                  v-model="formData.dataType"
                  placeholder="请选择用车事由"
                  clearable
                >
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用车需求:" prop="menuUrl">
                <el-select
                  v-model="formData.dataType"
                  placeholder="请选择用车需求"
                  clearable
                >
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否长途:" prop="radio">
                <el-radio-group v-model="formData.radio">
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="乘坐人数:" prop="menuUrl">
                <el-input v-model="formData.menuUrl" style="width: 217px" maxlength="200" placeholder="请输入乘坐人数" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="乘车人:" prop="menuUrl">
                <el-input v-model="formData.menuUrl" style="width: 217px" maxlength="200" placeholder="请输入乘车人" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话:" prop="menuUrl">
                <el-input v-model="formData.menuUrl" style="width: 217px" maxlength="200" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用车日期:" prop="assignTime">
                <el-input v-model="formData.assignTime" style="width: 217px" disabled maxlength="200" placeholder="请选择用车日期" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出发时间:" prop="menuUrl">
                <el-input v-model="formData.menuUrl" style="width: 217px" maxlength="200" placeholder="请输入出发时间" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预计时长:" prop="menuUrl">
                <el-input v-model="formData.menuUrl" style="width: 217px" maxlength="200" placeholder="请输入预计时长" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="出发地点:" prop="menuUrl">
                <el-select
                  v-model="formData.menuUrl"
                  placeholder="请选择用"
                  clearable
                >
                </el-select>
              </el-form-item>
              <el-form-item prop="menuUrl">
                <el-select
                  v-model="formData.menuUrl"
                  placeholder="请选择用"
                  clearable
                >
                </el-select>
              </el-form-item>
              <el-form-item prop="menuUrl">
                <el-select
                  v-model="formData.menuUrl"
                  placeholder="请选择用"
                  clearable
                >
                </el-select>
              </el-form-item>
              <el-form-item prop="menuUrl">
                <el-input v-model="formData.menuUrl" style="width: 217px" maxlength="200" placeholder="请选择" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="前往地点:" prop="menuUrl">
                <el-select
                  v-model="formData.menuUrl"
                  placeholder="请选择用"
                  clearable
                >
                </el-select>
              </el-form-item>
              <el-form-item prop="menuUrl">
                <el-select
                  v-model="formData.menuUrl"
                  placeholder="请选择用"
                  clearable
                >
                </el-select>
              </el-form-item>
              <el-form-item prop="menuUrl">
                <el-select
                  v-model="formData.menuUrl"
                  placeholder="请选择用"
                  clearable
                >
                </el-select>
              </el-form-item>
              <el-form-item prop="menuUrl">
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="期望车型:" prop="menuUrl">
                <el-input v-model="formData.menuUrl" style="width: 217px" maxlength="200" placeholder="请选择" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:" prop="menuUrl">
                <el-input type="textarea" style="width: 1000px" v-model="formData.menuUrl" maxlength="200" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div class="dialog-footer">
      <el-button type="primary" :loading="loading">确 定</el-button>
      <el-button>关 闭</el-button>
    </div>
  </div>
</template>

<script>
import { vehicleInfoGetAssignCount } from "@/api/vehicleInfo";
export default {
  name: "apply",
  data() {
    return {
      loading: false,
      dateList: [],
      calendarVal: null,
      activeNames: ['1'],
      formData: {
        assignTime: '',
      },
      rules: {

      }
    };
  },
  watch: {
    calendarVal: {
      handler: function (newCalendarVal){
      }
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },  
  created() {
    this.vehicleInfoGetAssignCount();
  },
  mounted() {
  },
  methods: {
    calendarClick (val) {
      console.log(val)
      this.formData.assignTime = val.assignTime;
    },
    handleChange(val) {
      console.log(val);
    },
    filterData (date, data, item) {
    },
    vehicleInfoGetAssignCount () {
      vehicleInfoGetAssignCount().then(({data}) => {
        this.dateList = data;
      })
    },
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