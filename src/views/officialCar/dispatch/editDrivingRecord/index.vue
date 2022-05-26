<template>
  <div
    class="container-calendar"
    :style="{'--theme':theme}"
  >
    <el-form
      ref="elForm"
      style="margin-left: 20px;"
      label-suffix=":"
      :model="formData"
      :rules="rules"
      label-width="85px"
    >
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <i :class="calcIconClass('1')" />
            <span class="title-right">单位信息</span>
          </template>
          <el-row :gutter="24">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="用车单位"
                prop="unitCode"
              >
                <el-select
                  v-model="formData.unitCode"
                  placeholder="请选择用车单位"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in unitData"
                    :key="item.value"
                    :label="item.unitName"
                    :value="item.unitCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="用车部门"
                prop="unitCode"
              >
                <el-select
                  v-model="formData.unitCode"
                  placeholder="请选择用车部门"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in unitData"
                    :key="item.value"
                    :label="item.unitName"
                    :value="item.unitCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <i :class="calcIconClass('2')" />
            <span class="title-right">用车信息</span>
          </template>
          <el-row :gutter="24">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="用车事由"
                prop="reasonCode"
              >
                <el-select
                  v-model="formData.reasonCode"
                  placeholder="请选择用车事由"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in dictionariesObj['1016']"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="用车需求"
                prop="demandCode"
              >
                <el-select
                  v-model="formData.demandCode"
                  placeholder="请选择用车需求"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in dictionariesObj['10018']"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="是否长途"
                prop="longDistanceTag"
              >
                <el-radio-group v-model="formData.longDistanceTag">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="乘坐人数"
                prop="usagePersons"
              >
                <el-input
                  v-model="formData.usagePersons"
                  maxlength="200"
                  placeholder="请输入乘坐人数"
                />
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="乘车人"
                prop="userName"
              >
                <el-input
                  v-model="formData.userName"
                  maxlength="200"
                  placeholder="请输入乘车人"
                />
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="联系电话"
                prop="phone"
              >
                <el-input
                  v-model="formData.phone"
                  maxlength="200"
                  placeholder="请输入联系电话"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="用车日期"
                prop="usageDate"
              >
                <el-date-picker
                  v-model="formData.usageDate"
                  type="date"
                  placeholder="选择用车日期"
                  clearable
                  size="small"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <!-- <el-input
                  v-model="formData.usageDate"
                  maxlength="200"
                  placeholder="请选择用车日期"
                /> -->
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="出发时间"
                prop="usageTime"
              >
                <el-date-picker
                  v-model="formData.usageTime"
                  type="datetime"
                  placeholder="选择出发时间"
                  clearable
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="08:00:00"
                >
                </el-date-picker>
                <!-- <el-input
                  v-model="formData.usageTime"
                  maxlength="200"
                  placeholder="请输入出发时间"
                /> -->
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="预计时长"
                prop="timeLength"
              >
                <el-input
                  v-model="formData.timeLength"
                  maxlength="200"
                  placeholder="请输入预计时长"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="出发地点"
                prop="fromAddr"
              >
                <form-address
                  ref="formAddress1"
                  :name="'出发地'"
                  @addressSuccess="addressSuccessOut"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="前往地点"
                prop="toAddr"
              >
                <form-address
                  ref="formAddress2"
                  :name="'目的地'"
                  @addressSuccess="addressSuccessTo"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="期望车型"
                prop="hopeBrand"
              >
                <el-select
                  v-model="formData.hopeBrand"
                  placeholder="请选择期望车型"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in dictionariesObj['1018']"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="remark"
              >
                <el-input
                  type="textarea"
                  v-model="formData.remark"
                  maxlength="200"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <i :class="calcIconClass('3')" />
            <span class="title-right">派车信息</span>
            <span
              class="title-right-button"
              @click.stop.prevent="addCarButton"
            >
              <el-button type="text"> <i class="el-icon-plus"></i> 新增车辆</el-button>
            </span>
          </template>
          <div>
            <el-row :gutter="24">
              <el-col>
                <div>
                  <span class="title-right">车辆1</span>
                  <el-button
                    class="delete-color"
                    type="text"
                    @click="deleteCar()"
                  >
                    <i class="el-icon-delete" />
                    删除
                  </el-button>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="指派司机"
                  prop="driver"
                >
                  <el-select
                    v-model="formData.driver"
                    placeholder="请选择指派司机"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in unitData"
                      :key="item.value"
                      :label="item.unitName"
                      :value="item.unitCode"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="指派车辆"
                  prop="carNumber"
                >
                  <el-select
                    v-model="formData.carNumber"
                    placeholder="请选择指派车辆"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in unitData"
                      :key="item.value"
                      :label="item.unitName"
                      :value="item.unitCode"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="出场里程"
                  prop="beginMiles"
                >
                  <el-input
                    v-model="formData.beginMiles"
                    readonly
                    maxlength="200"
                    placeholder="请输入出场里程"
                  />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="还车里程"
                  prop="endMiles"
                >
                  <el-input
                    v-model="formData.endMiles"
                    maxlength="200"
                    placeholder="请输入还车里程"
                  />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="保养时间"
                  prop="maintainDate"
                >
                  <el-input
                    v-model="formData.maintainDate"
                    readonly
                    maxlength="200"
                    placeholder="请输入保养时间"
                  />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="保养里程"
                  prop="maintainMiles"
                >
                  <el-input
                    v-model="formData.maintainMiles"
                    maxlength="200"
                    placeholder="请输入保养里程"
                  />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-for="(item, index) in addCarInfoList">
            <div class="divider-line"></div>
            <el-row :gutter="24">
              <el-col>
                <span class="title-right">车辆{{index+2}}</span>
                <el-button
                  class="delete-color"
                  type="text"
                  @click="deleteCar(index)"
                >
                  <i class="el-icon-delete" />
                  删除
                </el-button>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="指派司机"
                  :prop="`driver${item}`"
                >
                  <el-select
                    v-model="formData[`driver${item}`]"
                    placeholder="请选择指派司机"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in unitData"
                      :key="item.value"
                      :label="item.unitName"
                      :value="item.unitCode"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="指派车辆"
                  :prop="`carNumber${item}`"
                >
                  <el-select
                    v-model="formData[`carNumber${item}`]"
                    placeholder="请选择指派车辆"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in unitData"
                      :key="item.value"
                      :label="item.unitName"
                      :value="item.unitCode"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="出场里程"
                  :prop="`beginMiles${item}`"
                >
                  <el-input
                    v-model="formData[`beginMiles${item}`]"
                    readonly
                    maxlength="200"
                    placeholder="请输入出场里程"
                  />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="还车里程"
                  :prop="`endMiles${item}`"
                >
                  <el-input
                    v-model="formData[`endMiles${item}`]"
                    maxlength="200"
                    placeholder="请输入还车里程"
                  />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="保养时间"
                  :prop="`maintainDate${item}`"
                >
                  <el-input
                    v-model="formData[`maintainDate${item}`]"
                    readonly
                    maxlength="200"
                    placeholder="请输入保养时间"
                  />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="保养里程"
                  :prop="`maintainMiles${item}`"
                >
                  <el-input
                    v-model="formData[`maintainMiles${item}`]"
                    maxlength="200"
                    placeholder="请输入保养里程"
                  />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <div class="footer-area-btn">
      <el-button
        type="primary"
        :loading="loading"
        @click="addRequest"
      >确 定</el-button>
      <el-button @click="closePush">关 闭</el-button>
    </div>
  </div>
</template>

<script>
import { vehicleInfoGetAssignCount } from "@/api/vehicleInfo";
import { addVehicleRequest } from "@/api/gcywVehicleRequest";
import formAddress from "@/views/car/apply/components/formAddress";
import getDict from "@/views/mixins/getDict"
export default {
  name: "editDrivingRecord",
  mixins: [getDict],
  components: { formAddress },
  data() {
    var checkfromAddr = (rule, value, callback) => {
      if (value.indexOf('null') == -1 && value) {
        return callback();
      } else {
        return callback(new Error('请选择出发地点'));
      }
    }
    var checktoAddr = (rule, value, callback) => {
      if (value.indexOf('null') == -1 && value) {
        return callback();
      } else {
        return callback(new Error('请选择前往地点'));
      }
    }
    return {
      loading: false,
      dateList: [],
      calendarVal: null,
      activeNames: ['1', '2', '3'],
      unitData: [],
      dictionariesCode: [1016, 10018, 1018],
      dictionariesObj: {},
      formData: {
        // 用车单位
        unitCode: '',
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
        // 车辆信息
        driver: '',
        carNumber: '',
        beginMiles: '',
        endMiles: '',
        maintainDate: '',
        maintainMiles: '',
      },
      rules: {
        reasonCode: [
          { required: true, message: "请选择用车事由", trigger: "change" }
        ],
        demandCode: [
          { required: true, message: "请选择用车需求", trigger: "change" }
        ],
        longDistanceTag: [
          { required: true, message: "是否长途", trigger: "change" }
        ],
        usagePersons: [
          { required: true, message: "请输入乘坐人数", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入乘车人", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        usageDate: [
          { required: true, message: "请选择用车日期", trigger: "blur" }
        ],
        usageTime: [
          { required: true, message: "请输入出发时间", trigger: "blur" }
        ],
        timeLength: [
          { required: true, message: "请输入预计时长", trigger: "blur" }
        ],
        fromAddr: [
          { required: true, validator: checkfromAddr, trigger: "change" }
        ],
        toAddr: [
          { required: true, validator: checktoAddr, trigger: "change" }
        ],
        hopeBrand: [
          { required: true, message: "请选择期望车型", trigger: "change" }
        ],
        driver: [
          { required: true, message: "请选择指派司机", trigger: "change" }
        ],
        carNumber: [
          { required: true, message: "请选择指派车辆", trigger: "change" }
        ],
        beginMiles: [
          { required: false, message: "请输入出场里程", trigger: "blur" }
        ],
        endMiles: [
          { required: true, message: "请输入还车里程", trigger: "blur" }
        ],
      },
      // 唯一key
      uniqueId: 2,
      addCarInfoExample: [
        {
          label: 'driver',
          rule: [
            { required: true, message: "请选择指派司机", trigger: "change" }
          ]
        },
        {
          label: 'carNumber',
          rule: [
            { required: true, message: "请选择指派车辆", trigger: "change" }
          ]
        },
        // {
        //   label: 'beginMiles',
        //   rule: [
        //     { required: false, message: "请输入出场里程", trigger: "blur" }
        //   ]
        // },
        {
          label: 'endMiles',
          rule: [
            { required: true, message: "请输入还车里程", trigger: "blur" }
          ]
        },
        // {
        //   label: 'maintainDate',
        //   rule: [
        //     { required: true, message: "请选择保养时间", trigger: "blur" }
        //   ]
        // },
        // {
        //   label: 'maintainMiles',
        //   rule: [
        //     { required: true, message: "请选择保养里程", trigger: "blur" }
        //   ]
        // },
      ],
      addCarInfoFormExample: {
        driver: '',
        carNumber: '',
        beginMiles: '',
        endMiles: '',
        maintainDate: '',
        maintainMiles: '',
      },
      addCarInfoFormRuleExample: {
        driver: [
          { required: true, message: "请选择指派司机", trigger: "change" }
        ],
        carNumber: [
          { required: true, message: "请选择指派车辆", trigger: "change" }
        ],
        // beginMiles: [
        //   { required: false, message: "请输入出场里程", trigger: "blur" }
        // ],
        endMiles: [
          { required: false, message: "请输入还车里程", trigger: "blur" }
        ],
        // maintainDate: [
        //   { required: false, message: "请输入保养时间", trigger: "blur" }
        // ],
        // maintainMiles: [
        //   { required: true, message: "请输入保养里程", trigger: "blur" }
        // ],
      },
      addCarInfoList: [],
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  created() {
    this.vehicleInfoGetAssignCount();
    for (const item of this.dictionariesCode) {
      this.getOperateDict(item);
    }
    this.$nextTick(() => {
      if (this.$route.query.row) {
        let row = JSON.parse(this.$route.query.row);
        this.formData = {
          reasonCode: row.reasonCode,
          demandCode: row.demandCode,
          longDistanceTag: 0,
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
    async getOperateDict(code) {
      const res = await this.getOperateDictList(code);
      this.dictionariesObj[code] = res;
    },
    calendarClick(val) {
      this.formData.usageDate = val.day;
    },
    vehicleInfoGetAssignCount() {
      vehicleInfoGetAssignCount().then(({ data }) => {
        this.dateList = data;
      })
    },
    addressSuccessOut(row) {
      let { id, name } = row;
      this.formData.fromAreaId = id;
      this.formData.fromAddr = name;
    },
    addressSuccessTo(row) {
      let { id, name } = row;
      this.formData.toAreaIdd = id;
      this.formData.toAddr = name;
    },
    addRequest() {
      this.$refs.elForm.validate((valid) => {
        if (valid) {
          addVehicleRequest(this.formData).then(({ message }) => {
            this.$modal.msgSuccess(message);
            this.$router.push({ name: 'myCar' });
          })
        }
      })
    },
    closePush() {
      this.$router.push({ name: 'myCar' });
    },
    calcIconClass(name) {
      return this.activeNames.includes(name) ? `el-icon-caret-bottom` : `el-icon-caret-right`;
    },
    // 添加车辆按钮
    addCarButton() {
      const newCarInfo = this.addCarInfoExample.map((item) => {
        return {
          originLabel: item.label,
          label: `${item.label}${this.uniqueId}`,
          rule: item.rule,
        }
      })
      newCarInfo.forEach(item => {
        console.log('item');
        this.formData[item['label']] = ''
        this.rules[item['label']] = item.rule
      });
      this.addCarInfoList.push(this.uniqueId);
      this.uniqueId++
      console.log("🚀 ~ file: index.vue ~ line 753 ~ addCarButton ~ this.addCarInfoList", this.addCarInfoList)
      console.log("🚀 ~ file: index.vue ~ line 756 ~ addCarButton ~ this.formData", this.formData)
      console.log("🚀 ~ file: index.vue ~ line 756 ~ addCarButton ~ this.rules", this.rules)
    },
    deleteCar(index) {
      console.log(index);
      // if (condition) {
      //   this.addCarInfoList.length === 1;
      //   return;
      // }
      this.addCarInfoList.splice(index, 1)
    },
  },
};
</script>
<style lang="scss" scoped>
.container-calendar {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .is-selected {
    color: #{"var(--theme)"};
  }
  .el-icon-caret-right {
    font-size: 20px;
    color: #{"var(--theme)"};
  }
  .el-icon-caret-bottom {
    font-size: 20px;
    color: #{"var(--theme)"};
  }
  ::v-deep .el-select,
  .el-input,
  .el-date-editor {
    width: 95%;
  }
  // 分割线
  .divider-line {
    width: 98%;
    height: 0;
    border-bottom: 1px dashed #ccc;
    margin-bottom: 20px;
  }
  .delete-color {
    color: #ff4949;
  }
}
</style>
