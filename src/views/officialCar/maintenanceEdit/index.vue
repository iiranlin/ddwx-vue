<template>
  <div class="app-container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleButton"
          >保存</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-form
        :model="form"
        :rules="rules"
        ref="elform"
        label-width="120px"
        style="width: 90%"
      >
        <!--维保信息-->
        <el-row :gutter="20">
          <el-col style="margin: 15px 10px">
            <i class="el-icon-caret-right title-icon"></i><span>维保信息</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" :xs="24">
            <el-col :span="8">
              <el-form-item label="使用单位：" prop="unitCode">
                <el-select
                  v-model="form.unitCode"
                  filterable
                  style="width: 100%"
                  placeholder="请选择使用单位"
                  size="mini"
                >
                  <el-option
                    v-for="item in userUnitOptions"
                    :key="item.id"
                    :label="item.unitName"
                    :value="item.unitCode"
                    @click.native="handleUnitChange(item)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车牌号：" prop="carNumber">
                <el-select
                  v-model="form.carNumber"
                  size="mini"
                  :placeholder="carNumberPlaceHolder"
                  style="width: 100%"
                  filterable
                >
                  <el-option
                    v-for="item in carList"
                    :key="item.id"
                    :label="item.carNumber"
                    :value="item.carNumber"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维保类型：" prop="maintainType">
                <el-select
                  v-model="form.maintainType"
                  filterable
                  style="width: 100%"
                  :loading="loading"
                  placeholder="请选择维保类型"
                  size="mini"
                >
                  <el-option
                    v-for="item in maintenanceTypeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="驾驶员：" prop="driver">
                <el-input
                  v-model="form.driver"
                  size="mini"
                  placeholder="请输入驾驶员"
                  maxlength="20"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="店铺：" prop="maintainShopId">
                <el-select
                  v-model="form.maintainShopId"
                  size="mini"
                  style="width: 100%"
                  filterable
                  placeholder="请选择店铺"
                >
                  <el-option
                    v-for="item in shopOptions"
                    :key="item.value"
                    :label="item.unitName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="其他店铺："
                prop="maintainShop"
                :rules="{
                  required: form.maintainShopId === '-1',
                  message: '其他店铺不能为空',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="form.maintainShop"
                  size="mini"
                  placeholder="请填写不在定点的店铺"
                  :disabled="form.maintainShopId !== '-1'"
                  maxlength="20"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维保日期：" prop="maintainDate">
                <el-date-picker
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  :picker-options="firstDatePicker"
                  v-model="form.maintainDate"
                  type="date"
                  placeholder="请选择维保日期"
                  size="mini"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维保里程：" prop="maintainMiles">
                <el-input
                  v-model="form.maintainMiles"
                  size="mini"
                  placeholder="请输入维保里程"
                  clearable
                  @input="handleNumberLimit(form, 'maintainMiles')"
                  maxlength="11"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维保地点：" prop="maintainAddress">
                <el-input
                  v-model="form.maintainAddress"
                  size="mini"
                  placeholder="请输入维保地点"
                  clearable
                  maxlength="30"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总费用：" prop="totalCost">
                <el-input
                  v-model="form.totalCost"
                  size="mini"
                  placeholder="自动计算"
                  clearable
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="材料费：" prop="materialCost">
                <el-input
                  v-model="form.materialCost"
                  size="mini"
                  placeholder="自动计算"
                  clearable
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工时费：" prop="hourlyCost">
                <el-input
                  v-model="form.hourlyCost"
                  size="mini"
                  placeholder="自动计算"
                  clearable
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="其他费：" prop="otherCost">
                <el-input
                  v-model="form.otherCost"
                  size="mini"
                  placeholder="自动计算"
                  clearable
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下次维保里程：" prop="nextMaintainMiles">
                <el-input
                  v-model="form.nextMaintainMiles"
                  size="mini"
                  placeholder="请输入下次维保里程"
                  clearable
                  :disabled="form.maintainType !== '1'"
                  @input="handleNumberLimit(form, 'nextMaintainMiles')"
                  maxlength="8"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下次维保日期：" prop="nextMaintainDate">
                <el-date-picker
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  :picker-options="endDatePicker"
                  v-model="form.nextMaintainDate"
                  type="date"
                  placeholder="请选择下次维保日期"
                  size="mini"
                  :disabled="form.maintainType !== '1'"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="维保项目描述：" prop="sdesc">
                <el-input
                  type="textarea"
                  :rows="3"
                  maxlength="200"
                  v-model="form.sdesc"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input
                  type="textarea"
                  :rows="3"
                  maxlength="200"
                  v-model="form.remark"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <!--维保明细-->
      <el-row :gutter="20">
        <el-col style="width: 90%; margin: 15px 10px">
          <i class="el-icon-caret-right title-icon"></i><span>维保明细</span>
          <i
            class="el-icon-plus title-icon"
            style="float: right; margin-right: 10px"
            @click="handleAddClick()"
          ></i>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :xs="24" style="width: 90%; padding: 0 0 40px 40px">
          <el-table
            ref="eltable"
            max-height="300px"
            :data="maintenanceData"
            stripe
            border
          >
            <el-table-column label="维保项目" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="maintenanceData[scope.$index].itemName"
                  placeholder="请选择维保项目"
                  @change="
                    getItemId(
                      scope.$index,
                      maintenanceData[scope.$index].itemName
                    )
                  "
                >
                  <el-option
                    v-for="item in maintenanceItemOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="材料数量" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="maintenanceData[scope.$index].materialNum"
                  @input="
                    handleNumberLimit(
                      maintenanceData[scope.$index],
                      'materialNum'
                    )
                  "
                  maxlength="11"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="材料费" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="maintenanceData[scope.$index].materialCost"
                  @input="
                    handleNumberLimit(
                      maintenanceData[scope.$index],
                      'materialCost'
                    )
                  "
                  maxlength="11"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="工时（小时）" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="maintenanceData[scope.$index].hourlyNum"
                  @input="
                    handleNumberLimit(
                      maintenanceData[scope.$index],
                      'hourlyNum',
                      2
                    )
                  "
                  maxlength="11"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="工时费" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="maintenanceData[scope.$index].hourlyCost"
                  @input="
                    handleNumberLimit(
                      maintenanceData[scope.$index],
                      'hourlyCost'
                    )
                  "
                  maxlength="11"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="其他费" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="maintenanceData[scope.$index].otherCost"
                  @input="
                    handleNumberLimit(
                      maintenanceData[scope.$index],
                      'otherCost'
                    )
                  "
                  maxlength="11"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <a
                  href="javascript:void(0)"
                  @click="handleDeleteClick(scope.$index)"
                  style="color: #1890ff"
                  >删除</a
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import { getAllAvailableUnit } from "@/api/system/unit";
import { MAINTENANCE_DICT } from "@/views/officialCar/maintenanceCreate/constants";
import { getListByParentId } from "@/api/system/dict";
import { getComeUnitList } from "@/api/comeUnit";
import { calFloat, handleNumberLimit, numToFixed2 } from "@/utils";
import {
  maintenanceRecordUpdate,
  getMaintenanceDetailById,
} from "@/api/maintenanceRecord";
import { getVehicleListAll } from "@/api/vehicleInfo";

export default {
  name: "maintenanceEdit",
  data() {
    return {
      handleNumberLimit: handleNumberLimit,
      endDatePicker: this.endDateScope(),
      firstDatePicker: this.firstDateScope(),
      //loading框
      loading: false,
      // 根据使用单位获取的车辆数据
      carList: [],
      //使用单位数据
      userUnitOptions: [],
      //维保类型数据
      maintenanceTypeOptions: [],
      //维保项目
      maintenanceItemOptions: [],
      //店铺数据
      shopOptions: [],
      //维保明细数据
      maintenanceData: [],
      //维保明细对象
      maintenance: {
        itemId: "",
        itemName: "",
        materialNum: "",
        materialCost: "",
        hourlyNum: "",
        hourlyCost: "",
        otherCost: "",
      },
      carNumberPlaceHolder: "请先选择使用单位",
      //id
      id: "",
      //表单数据
      form: {
        unitName: "",
        unitCode: "", //使用单位
        carNumber: "", //车牌号
        vinNumber: "",
        driver: "", //驾驶员
        creator: "",
        createTime: "",
        sdesc: "", //维保项目描述
        remark: "", //备注
        maintainType: "", //维保类型
        maintainDate: "", //保养日期
        maintainMiles: "", //保养里程
        totalCost: "", //总费用
        materialCost: "", //材料费
        hourlyCost: "", //工时费
        otherCost: "", //其他费
        maintainShopId: "", //店铺ID
        maintainShop: "", //其他店铺
        maintainAddress: "", //维保地点
        nextMaintainDate: "", //下次维保日期
        nextMaintainMiles: "", //下次维保里程
        items: [],
      },
      rules: {
        unitCode: [
          { required: true, message: "使用单位不能为空", trigger: "change" },
        ],
        carNumber: [
          { required: true, message: "车牌号不能为空", trigger: "blur" },
        ],
        maintainType: [
          { required: true, message: "维保类型不能为空", trigger: "change" },
        ],
        driver: [
          { required: true, message: "驾驶员不能为空", trigger: "change" },
        ],
        maintainShopId: [
          { required: true, message: "店铺不能为空", trigger: "change" },
        ],
        maintainDate: {
          required: true,
          message: "维保日期不能为空",
          trigger: "change",
        },
        maintainMiles: [
          { required: true, message: "维保里程不能为空", trigger: "blur" },
          {
            trigger: "blur",
            pattern:
              /^0\.[0-9]{1,2}$|^0$|^[1-9]\d{0,7}\.\d{1,2}$|^[1-9]\d{0,7}$/,
            message: "请最多输入八位整数和两位小数",
          },
        ],
        maintainAddress: [
          { required: true, message: "维保地点不能为空", trigger: "blur" },
        ],
        totalCost: [
          { required: true, message: "总费用不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
  },
  filters: {
    // 保留位数
    fixDecimal(num, fixed) {
      return num.toFixed(fixed);
    },
  },
  watch: {
    // 监听店铺选择
    "form.maintainShopId"(newVal) {
      if (newVal !== "-1") {
        this.form.maintainShop = "";
      }
      this.$refs.elform.clearValidate("maintainShop");
    },
    // 如果维保类型为维修,清除下次维保里程和日期
    "form.maintainType"(newVal) {
      if (newVal === "2") {
        this.form.nextMaintainDate = "";
        this.form.nextMaintainMiles = "";
      }
    },
    // 监听维保项目变化进行加总
    maintenanceData: {
      handler(val) {
        let totalMaterialCost = 0,
          totalHourlyCost = 0,
          totalOtherCost = 0;
        val.forEach((item) => {
          totalMaterialCost = calFloat(totalMaterialCost, item.materialCost);
          totalHourlyCost = calFloat(totalHourlyCost, item.hourlyCost);
          totalOtherCost = calFloat(totalOtherCost, item.otherCost);
        });
        this.form.materialCost = totalMaterialCost;
        this.form.hourlyCost = totalHourlyCost;
        this.form.otherCost = totalOtherCost;
        this.form.totalCost = calFloat(
          calFloat(totalMaterialCost, totalHourlyCost),
          totalOtherCost
        );
      },
      deep: true,
    },
    // 监听单位选择,根据单位获取车牌号列表
    "form.unitCode"(newVal) {
      if (newVal === "") {
        this.carNumberPlaceHolder = "请先选择使用单位";
      } else {
        this.carNumberPlaceHolder = "请选择车牌号";
        getVehicleListAll({ unitCode: this.form.unitCode }).then((res) => {
          this.carList = res.data;
        });
      }
    },
  },
  mounted() {
    this.id = this.$route.query.id;

    getMaintenanceDetailById(this.id).then((res) => {
      let data = res.data;
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key];
      });
      this.maintenanceData = data.items;
    });
    this.initMaintenanceCreate();
  },
  methods: {
    endDateScope() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.form.maintainDate) {
            return new Date(self.form.maintainDate).getTime() > time.getTime();
          }
        },
        firstDayOfWeek: 1,
      };
    },
    firstDateScope() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.form.nextMaintainDate) {
            let endDate = new Date(self.form.nextMaintainDate);
            endDate = endDate.setDate(endDate.getDate() - 1);
            return new Date(endDate).getTime() < time.getTime();
          }
        },
        firstDayOfWeek: 1,
      };
    },
    // 获取保养项目id
    getItemId(index, value) {
      this.maintenanceItemOptions.forEach((item) => {
        if (item.name === value) {
          this.maintenanceData[index].itemId = item.id;
        }
      });
    },
    //选择单位回调
    handleUnitChange() {
      this.form.carNumber = "";
    },
    //添加维保明细数据
    handleAddClick() {
      this.maintenanceData.push(Object.assign({}, this.maintenance));
    },
    //删除维保明细数据
    handleDeleteClick(index) {
      this.maintenanceData.splice(index, 1);
    },
    //保存数据
    handleButton() {
      if (this.maintenanceData.length === 0) {
        this.$message.warning("请填写保养项目");
      } else {
        this.$refs.elform.validate((result) => {
          if (result) {
            //检查是否有重复维保项目
            for (let i = 0; i < this.maintenanceData.length; i++) {
              let itemName = this.maintenanceData[i].itemName;

              for (let j = i + 1; j < this.maintenanceData.length; j++) {
                if (itemName === this.maintenanceData[j].itemName) {
                  this.$modal.msgWarning("维保项目不能重复，请重新选择!");
                  return;
                }
              }
            }
            let form = Object.assign({}, this.form);
            // 处理维保商店名称
            let maintainShopId = this.form.maintainShopId;
            if (maintainShopId !== "-1") {
              this.shopOptions.forEach((item) => {
                if (item.id === maintainShopId) {
                  form.maintainShop = item.unitName;
                }
              });
            }
            form.items = this.maintenanceData;
            this.loading = true;
            maintenanceRecordUpdate(Object.assign({}, {id:this.id},form))
              .then(({ message }) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.closeCurrentPage();
              })
              .catch(() => {
                this.loading = false;
              });
          }
        });
      }
    },
    // 处理输入的数字
    maintenanceDataInputNumberChange(index, label) {
      this.maintenanceData[index][label] = numToFixed2(
        this.maintenanceData[index][label]
      );
    },
    inputNumberChange(label) {
      this.form[label] = numToFixed2(this.form[label]);
    },
    //关闭当前页面
    closeCurrentPage() {
      this.visitedViews.forEach((item) => {
        if (item.name === this.$route.name) {
          this.$tab.closePage(item).then(({ visitedViews }) => {
            this.$router.push({ name: "maintenanceManagement" });
          });
        }
      });
    },
    // 页面初始化调用
    initMaintenanceCreate() {
      // 获取可用单位
      getAllAvailableUnit().then((res) => {
        this.userUnitOptions = res.data;
      });
      // 获取维保类型
      getListByParentId(MAINTENANCE_DICT.maintenanceTypeOptions.id).then(
        (res) => {
          this.maintenanceTypeOptions = res.data;
        }
      );
      // 获取维保项目
      getListByParentId(MAINTENANCE_DICT.maintenanceItemOptions.id).then(
        (res) => {
          this.maintenanceItemOptions = res.data;
        }
      );
      // 获取维保店铺
      getListByParentId(MAINTENANCE_DICT.comeUnitCategory.id).then((res) => {
        let comeUnitCategory = res.data;
        comeUnitCategory.forEach((item) => {
          if (item.name.indexOf("维保") !== -1) {
            getComeUnitList({ unitCategory: item.code }).then((res) => {
              let shopOptions = res.data;
              shopOptions.push({ unitName: "其他", id: "-1" });
              this.shopOptions = shopOptions;
            });
          }
        });
      });
    },
  },
};
</script>
<style scoped>
.app-container {
  padding: 10px 15px;
  overflow: auto;
}

.title-icon {
  color: rgb(64, 158, 255);
  margin-right: 5px;
}
</style>
