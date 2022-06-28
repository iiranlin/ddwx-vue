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
      // const loading = this.$loading({
      //   lock: false,
      //   text: "加载中...",
      // });
      try {
        const { data = [] } = await getListByParentId(id);
        dictArray = data;
      } catch (e) {
        throw new Error(e.message || "获取字典失败");
      } finally {
        // loading.close();
        return dictArray;
      }
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
  },
};
