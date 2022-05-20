import { getListByParentId } from "@/api/system/dict";
export default {
  data() {
    return {};
  },
  filters: {},
  computed: {},
  methods: {
    // 获取字典  页面修改的弹窗使用
    async getOperateDictList(id = "") {
      if (!id) {
        return;
      }
      let dictArray = [];
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
      });
      try {
        const { data = [] } = await getListByParentId(id);
        dictArray = data;
      } catch (e) {
        throw new Error(e.message || "获取字典失败");
      } finally {
        loading.close();
        return dictArray;
      }
    },
  },
};
