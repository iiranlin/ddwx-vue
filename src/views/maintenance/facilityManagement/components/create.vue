<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="openDataScope"
    width="600px"
    append-to-body
    center
    @close="handleDialogClose()"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="elform"
      label-width="100px"
      v-loading="loading"
      label-suffix="："
    >
      <el-row :span="24" :gutter="20">
        <el-col :span="24">
          <el-form-item label="房屋名称" prop="houseName">
            <el-input
              v-model="form.houseName"
              placeholder="请输入房屋名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="房屋类型" prop="houseType">
            <el-input
              v-model="form.houseType"
              placeholder="请输入房屋类型"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="结构类型" prop="houseStructure">
            <el-input
              v-model="form.houseStructure"
              placeholder="请输入结构类型"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="建成年代" prop="houseEra">
            <el-date-picker
            style="width: 100%;"
              v-model="form.houseEra"
              type="year"
              placeholder="请选择年份"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="楼层数" prop="houseFloor">
            <el-row type="flex" justify="space-between">
              <el-col :span="10">
                <el-input
                  v-model.number="form.aboveGround"
                  placeholder="地上"
                ></el-input>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model.number="form.underground"
                  placeholder="地下"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="建筑面积" prop="houseArea">
            <el-input v-model="form.houseArea" placeholder="请输入建筑面积">
              <template slot="append">㎡</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="综合评定" prop="remark">
            <el-input
              v-model="form.remark"
              placeholder="请输入房屋综合评定"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleCreate()">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { ResourceManagement } from "@/api/maintenance";
export default {
  data() {
    return {
      isEdit: false,
      //遮罩层
      loading: false,
      //标题
      title: "",
      //显示隐藏
      openDataScope: false,
      //表单数据
      form: {
        teamType: "",
        teamName: "",
        deptName: "",
        houseName: "",
        houseType: "",
        houseStructure: "",
        houseEra: "",
        aboveGround: "",
        underground: "",
        houseArea: "",
        remark: "",
      },
      //表单校验
      rules: {
        houseName: [
          { required: true, message: "房屋名称不能为空", trigger: "blur" },
        ],
        houseArea: [
          {
            pattern: /^\d+(\.\d+)?$/,
            message: "请输入正确的面积数",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    //初始化
    init() {
      this.form = {
        teamType: "",
        teamName: "",
        deptName: "",
        houseName: "",
        houseType: "",
        houseStructure: "",
        houseEra: "",
        aboveGround: "",
        underground: "",
        houseArea: "",
        remark: "",
      };
      this.isEdit = false;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.title = "新建房屋信息";
      });
    },
    // 编辑初始化
    async updateInit(id) {
      this.isEdit = true;
      this.openDataScope = true;
      this.loading = true;
      await ResourceManagement.getPlaceById(id)
        .then(({ data }) => {
          this.form = Object.assign({}, data, {
            aboveGround: data.houseFloor ? data.houseFloor.split("/")[0] : "",
            underground: data.houseFloor ? data.houseFloor.split("/")[1] : "",
          });
          this.$nextTick(() => {
            this.title = "编辑房屋信息";
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    //新建
    handleCreate() {
      this.$refs.elform.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          await ResourceManagement[this.isEdit ? `updatePlace` : `addPlace`](
            Object.assign({}, this.form, {
              houseFloor: `${this.form.aboveGround}/${this.form.underground}`,
            })
          )
            .then(({ message }) => {
              this.loading = false;
              this.$modal.msgSuccess(message);
              this.openDataScope = false;
              this.$emit("createSuccess");
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      });
    },
    //取消
    handleCancel() {
      this.openDataScope = false;
    },
    //关闭dialog回调
    handleDialogClose() {
      this.$refs.elform.resetFields();
    },
  },
};
</script>
<style scoped></style>
