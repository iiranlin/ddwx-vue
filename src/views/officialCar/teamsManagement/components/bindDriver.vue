<template>
  <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body
             center @close="handleDialogClose()">
    <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
      <el-row :span="24" :gutter="20">
        <el-form-item v-if="bindDriverOptions.length>0">
          <label slot="label">&nbsp;&nbsp;已绑司机:</label>
          <el-tag
            v-for="item in bindDriverOptions"
            :key="item.driverId"
            closable
            @close="handleTagClose(item.driverId)">
            {{item.driver}}
          </el-tag>
        </el-form-item>
      </el-row>
      <el-row :span="24" :gutter="20">
        <el-col :span="24">
          <el-form-item label="绑定司机：" prop="driverId">
            <el-select v-model="form.driverId" multiple collapse-tags filterable placeholder="请选择绑定司机"
                       style="width:100%">
              <el-option v-for="(item,index) in driverOptions"
                         :key="index"
                         :label="item.driver"
                         :value="item.driverCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {
    gcjcDriverClassGetAvailableDriver,
    getDriverByTeamsId,
    teamsBindDriver,
    deleteTeamsDriver
  } from "@/api/driver"

  export default {
    data() {
      return {
        //遮罩层
        loading: false,
        //班组unitCode
        unitCode: '',
        //班组teamsId
        teamsId: '',
        //标题
        title: "绑定司机",
        //司机数据
        driverOptions: [],
        //已绑定司机数据
        bindDriverOptions: [],
        //显示隐藏
        openDataScope: false,
        //表单数据
        form: {
          driverId: null,
        },
        //表单校验
        rules: {
          driverId: [
            {required: true, message: "请选择绑定司机", trigger: "blur"}
          ],
        },
        vinFlag: '1',
      }
    },
    created() {

    },
    methods: {
      //初始化
      init(unitCode, id) {
        this.unitCode = unitCode;
        this.teamsId = id;
        this.openDataScope = true;
        this.$nextTick(() => {
          this.getDriverByTeamsId();
          this.gcjcDriverClassGetAvailableDriver();
        })
      },
      //获取已绑定司机信息
      async getDriverByTeamsId() {
        this.loading = true;
        await getDriverByTeamsId(this.teamsId).then(({data}) => {
          this.loading = false;
          this.bindDriverOptions = data;
        }).catch((err) => {
          this.loading = false;
        })
      },
      //获取可绑定司机信息
      async gcjcDriverClassGetAvailableDriver() {
        this.loading = true;
        let params = {
          unitCode: this.unitCode,
          vinFlag: this.vinFlag
        }
        await gcjcDriverClassGetAvailableDriver(params).then(({data}) => {
          this.loading = false;
          this.driverOptions = data;
        }).catch((err) => {
          this.loading = false;
        })
      },
      //删除绑定车辆
      handleTagClose(id) {
        this.$modal.confirm("是否解绑该司机?").then(() => {
          let params = [];
          let obj = {
            teamsId: this.teamsId,
            driverId: id,
          }
          params.push(obj);
          this.loading = true;
          deleteTeamsDriver(params).then(({message}) => {
            this.loading = false;
            this.$modal.msgSuccess(message)
            this.getDriverByTeamsId()
          }).catch((err) => {
            this.loading = false;
          })
        }).catch((err) => {
        })
      },
      //确定
      handleConfirm() {
        this.$refs.elform.validate((valid) => {
          if (valid) {
            //去重判断
            for (let i = 0; i < this.form.driverId.length; i++) {
              let driverId = this.form.driverId[i];
              for (let j = 0; j < this.bindDriverOptions.length; j++) {
                if (driverId === this.bindDriverOptions[j].driverId) {
                  this.$modal.msgWarning(this.bindDriverOptions[j].driver + "已经绑定，无法重复绑定，请重新选择!");
                  return
                }
              }
            }
            //封装参数
            let params = [];
            this.form.driverId.forEach((item) => {
              let obj = {};
              this.$set(obj, 'teamsId', this.teamsId);
              this.$set(obj, 'driverId', item);
              params.push(obj);
            })
            this.loading = true;
            teamsBindDriver(params).then(({message}) => {
              this.loading = false;
              this.openDataScope = false;
              this.$modal.msgSuccess(message)
              this.$emit('operateSuccess')
            }).catch((err) => {
              this.loading = false;
            })
          }
        })
      },
      //取消
      handleCancel() {
        this.openDataScope = false;
        this.$emit('operateSuccess')
      },
      //关闭dialog回调
      handleDialogClose() {
        this.bindDriverOptions = [];
        this.driverOptions = [];
        this.$refs.elform.resetFields();
        this.$emit('operateSuccess')
      }
    }
  }
</script>
<style scoped>
  ::v-deep .el-tag.el-tag--medium.el-tag--light {
    margin-left: 10px;
  }
</style>>
