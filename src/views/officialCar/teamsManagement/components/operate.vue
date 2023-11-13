<template>
  <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body
             center @close="handleDialogClose()">
    <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
      <el-row :span="24" :gutter="20">
        <el-col :span="24">
          <el-form-item label="所属单位：" prop="unitCode">
            <el-select v-model="form.unitCode" placeholder="请选择所属单位" clearable size="small" style="width:100%">
              <el-option
                v-for="item in unitData"
                :key="item.value"
                :label="item.unitName"
                :value="item.unitCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属车队：" prop="fleetId">
            <el-select v-model="form.fleetId" placeholder="请选择所属车队" clearable size="small" style="width:100%">
              <el-option
                v-for="item in fleetData"
                :key="item.value"
                :label="item.fleetName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="班组编号：" prop="teamsCode">
            <el-input v-model="form.teamsCode" size="small" maxlength="10"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="班组名称：" prop="teamsName">
            <el-input v-model="form.teamsName" size="small" maxlength="10"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="type==='create'?handleCreate():handleUpdate()">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {gcjcTeamsCreate, gcjcTeamsDetail, gcjcTeamsModify, gcjcFleetList} from "@/api/driver"
  import {getAllAvailableUnit} from "@/api/system/unit"

  export default {
    data() {
      return {
        //遮罩层
        loading: false,
        //标题
        title: "",
        //类型
        type: "",
        //数据id
        id: "",
        //显示隐藏
        openDataScope: false,
        //表单数据
        form: {
          fleetId: "",
          fleetName: "",
          unitName: "",
          unitCode: "",
          teamsCode: "",
          teamsName: ""
        },
        //单位数据
        unitData: [],
        //车队数据
        fleetData: [],
        //表单校验
        rules: {
          unitCode: [
            {required: true, message: "所属单位不能为空", trigger: "blur"}
          ],
          teamsCode: [
            {required: true, message: "班组编号不能为空", trigger: "blur"}
          ],
          teamsName: [
            {required: true, message: "班组名称不能为空", trigger: "blur"}
          ]
        }
      }
    },
    created() {
      this.getUnitDictList()
      this.getFleetList()
    },
    methods: {
      //初始化
      init(type, id) {
        this.type = type;
        this.id = id;
        this.openDataScope = true;
        this.$nextTick(() => {
          if (type === "create") {
            this.title = "新建班组"
          } else if (type === "update") {
            this.title = "修改班组"
            this.getFleetDetail();
          }
        })
      },
      //获取单位列表
      async getUnitDictList() {
        this.loading = true;
        await getAllAvailableUnit().then(({data}) => {
          this.loading = false;
          this.unitData = data;
        }).catch((err) => {
          this.loading = false;
        })
      },
      //获取车队列表
      async getFleetList() {
        this.loading = true;
        await gcjcFleetList().then(({data}) => {
          this.loading = false;
          this.fleetData = data.list;
        }).catch((err) => {
          this.loading = false;
        })
      },
      //获取班组详细信息
      async getFleetDetail() {
        this.loading = true;
        await gcjcTeamsDetail(this.id).then(({data}) => {
          this.loading = false;
          this.form = Object.assign(this.form, data);
        }).catch((err) => {
          this.loading = false;
        })
      },
      //新建
      handleCreate() {
        this.$refs.elform.validate(async (valid) => {
          if (valid) {
            this.loading = true;
            await gcjcTeamsCreate(Object.assign({}, this.form)).then(({message}) => {
              this.loading = false;
              this.$modal.msgSuccess(message);
              this.openDataScope = false;
              this.$emit('operateSuccess')
            }).catch((err) => {
              this.loading = false;
            })
          }
        })
      },
      //编辑
      handleUpdate() {
        this.$refs.elform.validate(async (valid) => {
          if (valid) {
            this.loading = true;
            await gcjcTeamsModify(Object.assign({}, this.form)).then(({message}) => {
              this.loading = false;
              this.$modal.msgSuccess(message);
              this.openDataScope = false;
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
