<template>
  <div class="navbar">
    <div class="test-title">{{ testTitle }}</div>
    <hamburger
      v-if="sideTheme == 'theme-dark' || sideTheme == 'theme-dark-top'"
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="
        !topNav && (sideTheme == 'theme-dark' || sideTheme == 'theme-dark-top')
      "
    />
    <top-nav
      id="topmenu-container"
      class="topmenu-container"
      v-if="
        topNav && (sideTheme == 'theme-dark' || sideTheme == 'theme-dark-top')
      "
    />
    <Sidebara
      class="topmenu-containera"
      v-if="sideTheme != 'theme-dark' && sideTheme != 'theme-dark-top'"
    />
    <!-- <div style="position:absolute;top:10px;color:red;z-index: 10;left: 50%;font-weight: bold;font-size: 22px;">本系统为测试系统，均为测试数据</div> -->
    <div class="right-menu">
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <span style="margin-right: 10px; font-size: 14px">{{
            unitName
          }}</span>
          <span>{{ realName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="updatePwd">
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    
    <div class="notice-button" style="margin-right: 10px; font-size: 14px;">
      <!-- <el-tooltip content="消息通知" placement="bottom">
              <i class="el-icon-chat-dot-round"></i>
      </el-tooltip> -->
      <a href="#" style="margin-right: 10px;" @click.prevent="openManualDownloadDialog">
        <i class="el-icon-download"></i>
        产品使用说明书
      </a>
      <i class="el-icon-chat-dot-round" @click="handleNoticeClick()"></i>
    </div>
    <el-dialog
      title="下载产品使用说明书"
      :visible.sync="manualDownloadVisible"
      width="420px"
      append-to-body
    >
      <div class="manual-download-list">
        <el-button
          v-for="manual in manualList"
          :key="manual.path"
          type="primary"
          icon="el-icon-download"
          @click="downloadManual(manual)"
        >
          {{ manual.name }}
        </el-button>
      </div>
    </el-dialog>
    <update-password ref="updatePassword"></update-password>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import Sidebara from "./Sidebara";
import UpdatePassword from "@/components/UpdatePassword";

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    Sidebara,
    UpdatePassword,
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "avatar",
      "device",
      "name",
      "unitName",
      "realName",
    ]),
    ...mapState({
      sideTheme: (state) => state.settings.sideTheme,
    }),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
  },
  data() {
    return {
      testTitle: "",
      manualDownloadVisible: false,
      manualList: [
        {
          name: "用户版下载",
          path: "/机关维修调度模块使用说明书-用户版.docx",
        },
        {
          name: "综合版下载",
          path: "/机关维修调度模块使用说明书-综合版.docx",
        },
      ],
    };
  },
  mounted() {
    this.testTitle = process.env.VUE_APP_TITLE;
  },
  methods: {
    /**
     * 打开产品使用说明书下载弹框。
     * 参数：无。
     * 功能：展示用户版和综合版两个下载选项。
     * 使用方法：点击导航栏“产品使用说明书”入口时调用。
     */
    openManualDownloadDialog() {
      this.manualDownloadVisible = true;
    },
    /**
     * 下载指定版本的产品使用说明书。
     * @param {Object} manual 说明书配置，包含展示名称 name 和文件地址 path。
     * 功能：创建临时下载链接并触发浏览器下载，随后关闭下载弹框。
     * 使用方法：点击弹框中的版本下载按钮时传入对应说明书配置。
     */
    downloadManual(manual) {
      const downloadLink = document.createElement("a");
      downloadLink.href = manual.path;
      downloadLink.download = manual.path.substring(manual.path.lastIndexOf("/") + 1);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      this.manualDownloadVisible = false;
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        cancelButtonClass:'cancel-button el-button--text',
        confirmButtonClass:' el-button--text',
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.href = "/index";
          });
        })
        .catch(() => {});
    },
    /**修改密码*/
    updatePwd() {
      this.$refs.updatePassword.initUpdatePassword(true, false);
    },
    handleNoticeClick() {
      this.$router.push({
        name: "message",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.test-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  color: red;
  z-index: 999;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }
  .topmenu-containera {
    position: absolute;
    height: 50px;
    left: 22px;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .notice-button {
    float: right;
    height: 100%;
    line-height: 60px;
    color: #409eff;

    & :hover {
      cursor: pointer;
    }
  }
  .manual-download-list {
    display: flex;
    justify-content: center;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 19px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
