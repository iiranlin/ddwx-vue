<template>
  <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
    <el-form :model="form" :rules="rules" ref="elform" label-width="120px" v-loading="loading">
      <el-row :span="24" :gutter="20">
        <el-col :span="24">
          <el-form-item label="违章车辆：" prop="carNumber">
            <el-select v-model="form.carNumber" placeholder="请选择违章车辆" clearable size="small" style="width:100%" filterable>
              <el-option 
                v-for="item in carNumberList" 
                :key="item.id" 
                :label="item.carNumber" 
                :value="item.carNumber"
                @click.native="handleCarNumberChange(item)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="违章司机：" prop="driverId">
            <el-select v-model="form.driverId" placeholder="请选择违章司机" clearable size="small" style="width:100%" filterable>
              <el-option 
                v-for="item in driverList" 
                :key="item.id" 
                :label="item.driver" 
                :value="item.driverId"
                @click.native="handleDriverChange(item)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="违章内容：" prop="peccancyContent">
            <el-input v-model="form.peccancyContent" size="small" maxlength="100" placeholder="请输入违章内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="违章日期：" prop="peccancyDate">
              <el-date-picker
                  style="width:100%"
                  v-model="form.peccancyDate"
                  size="small"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择违章日期"
                  :picker-options="{
                      disabledDate: (time) => {
                          return time.getTime() > Date.now();
                      },
                  }">
              </el-date-picker>
            </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="违章地点：" prop="peccancyAddress">
            <el-input v-model="form.peccancyAddress" size="small" maxlength="100" placeholder="请输入违章地点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
           <el-form-item label="扣分：" prop="peccancyScort">
                <el-input v-model="form.peccancyScort" maxlength="2" @input="handleNumberLimit(form,'peccancyScort',2,0)" placeholder="请输入扣分" size="small"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
           <el-form-item label="罚款：" prop="peccancyFree">
                <el-input v-model="form.peccancyFree" maxlength="10" @input="handleNumberLimit(form,'peccancyFree',7)" placeholder="请输入罚款" size="small"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave()">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { handleNumberLimit } from '@/utils'
import {gcjcDriverVehicleList,gcjcDriverList} from "@/api/driver"
import { getVehicleListAll } from '@/api/vehicleInfo'
import { mapGetters } from 'vuex'
import {gcjcDriverPeccancySave,gcjcDriverPeccancyUpdate} from "@/api/violationRegistration"

export default {
  computed: {
      ...mapGetters([
          'unitCode',
      ]),
  },
  data() {
    return {
      handleNumberLimit: handleNumberLimit,
      //遮罩层
      loading: false,
      //标题
      title: "违章登记",
      //显示隐藏
      openDataScope: false,
      //id
      id: '',
      //类型
      type: '',

      //车辆信息
      carNumberList:[],
      //司机信息
      driverList:[],

      //表单数据
      form: {
        carNumber: '',  //违章车辆
        vinNumber: '',  //发动机号
        driverId: '',
        driver: '',     //违章司机
        peccancyContent: '',    //违章内容
        peccancyDate: this.parseTime(new Date().getTime(),'{y}-{m}-{d}'), //违章日期，
        peccancyAddress: '北京',  //违章地点
        peccancyScort: '0',  //扣分
        peccancyFree: '0',   //罚款
      },
      //表单校验
      rules: {
        carNumber: [
          {required: true, message: "违章车辆不能为空", trigger: "change"}
        ],
        driverId: [
          {required: true, message: "违章司机不能为空", trigger: "change"}
        ],
        peccancyContent: [
          {required: true, message: "违章内容不能为空", trigger: "blur"}
        ],
        peccancyScort: [
          {required: true, message: "扣分不能为空", trigger: "blur"}
        ],
        peccancyFree: [
          {required: true, message: "罚款不能为空", trigger: "blur"}
        ]
      }
    }
  },
  created() {

  },
  methods: {
    //初始化
    init(type,listObj) {
      this.openDataScope = true;
      this.type = type;

      if(this.type == 'update'){
        listObj.peccancyDate = this.parseTime(listObj.peccancyDate,'{y}-{m}-{d}');
        this.form = Object.assign(this.form, listObj);
      }
      this.$nextTick(() => {
        this.getVehicleListAll();
      })
    },
    //获取车辆信息
    getVehicleListAll(){
      this.loading = true;

      let params = {
        unitCode: this.unitCode,
      }
      getVehicleListAll(params).then((res) => {
        this.loading = false;
        this.carNumberList = res.data;

        if(this.type == 'update'){
          this.getGcjcDriverVehicleList();
        }
      }).catch((err) => {
        this.loading = false;
      })
    },
    //获取已绑定车辆司机
    getGcjcDriverVehicleList(){
        this.loading = true;
        let params = {
            vinNumber:this.form.vinNumber
        }
        gcjcDriverVehicleList(params).then(({data}) => {
            this.loading = false;
            this.driverList = data;

            if(this.driverList.length == 0){
              this.gcjcDriverList();
            }
        }).catch((err) => {
            this.loading = false;
        })
    },
    //获取所有司机
    gcjcDriverList(){
        this.loading = true;
        
        gcjcDriverList().then(({data}) => {
            this.loading = false;
            this.driverList = data.list;

            this.driverList.forEach((item) => {
              this.$set(item, 'driver', item.username);
              this.$set(item, 'driverId', item.id);
            })
        }).catch((err) => {
            this.loading = false;
        })
    },
    //车辆选择回调
    handleCarNumberChange(item){
      this.form.carNumber = item.carNumber;
      this.form.vinNumber = item.vinNumber;

      this.form.driver = '';
      this.form.driverId = '';
      this.driverList = [];

      this.getGcjcDriverVehicleList();
    },
    //司机选择回调
    handleDriverChange(item){
      this.form.driver = item.driver;
      this.form.driverId = item.driverId;
    },
    //保存
    handleSave() {
      this.$refs.elform.validate((valid) => {
        if (valid) {
          if(this.type == 'create'){
            this.loading = true;

            let params = {
              status: '0',
            }
            gcjcDriverPeccancySave(Object.assign({}, this.form, params)).then(({message}) => {
              this.loading = false;
              this.$modal.msgSuccess(message);
              this.openDataScope = false;
              this.$emit('operateSuccess')
            }).catch((err) => {
              this.loading = false;
            })
          }else{
            this.loading = true;

            let params = {
              status: '0',
            }
            gcjcDriverPeccancyUpdate(Object.assign({}, this.form, params)).then(({message}) => {
              this.loading = false;
              this.$modal.msgSuccess(message);
              this.openDataScope = false;
              this.$emit('operateSuccess')
            }).catch((err) => {
              this.loading = false;
            })
          }
        }
      })
    },
    //取消
    handleCancel() {
      this.openDataScope = false;
    },
    //关闭dialog回调
    handleDialogClose() {
      this.$refs.elform.resetFields();
    }
  }
}
</script>
<style scoped>

</style>>
