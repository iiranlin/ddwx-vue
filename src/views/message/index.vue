<template>
  <div class="message-container">
    <div class="message-list" v-loading="loading">
      <template v-if="messages.length > 0">
        <div
          v-for="(message, index) in messages"
          :key="message.id"
          class="message-item"
          @click="handleMessageClick(message)"
        >
          <div>
            <div class="message-title">
              {{ message.messageName }}
            </div>
            <div class="message-content">
              {{ message.messageDesc }}
            </div>
          </div>
          <div class="message-time">
            {{ message.createTime }}
          </div>
        </div>
      </template>
      <template v-else>
        <el-empty description="暂无消息" />
      </template>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getMessageList"
      style="margin-bottom: 40px"
    />
  </div>
</template>

<script>
import { MessageManagement } from "@/api/maintenance";
import indexMixin from "@/views/mixins";
export default {
  name: "MessageList",
  mixins: [indexMixin],
  data() {
    return {
      total: 0,
      loading: false,
      messages: [],
    };
  },
  created() {
    this.getMessageList();
  },
  methods: {
    handleMessageClick(message) {
      this.$router.push({
        name: "ticketDetail",
        query: {
          id: message.orderId,
        },
      });
    },
    async getMessageList() {
      this.loading = true;
      await MessageManagement.getMessageList(
        Object.assign({ messageType: "DISPATCH" }, this.listQuery)
      )
        .then(({ data }) => {
          this.messages = data.list;
          this.total = data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.message-container {
  padding: 20px;
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  .message-list {
    flex: 1;
    overflow-y: auto;
    .message-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      padding: 10px;
      &:hover {
        background: #f0f0f0;
      }

      .message-title {
        font-size: 16px;
        font-weight: 700;
        color: #000000;
      }

      &:last-child {
        border-bottom: none;
      }

      .message-icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        margin-right: 12px;
        color: #1890ff;
      }

      .message-content {
        flex: 1;
        color: #969799;
        font-size: 14px;
        line-height: 24px;
        font-weight: 400;
        margin-right: 20px;
      }

      .message-time {
        flex-shrink: 0;
        color: #999;
        font-size: 12px;
      }
    }
  }
}
</style>
