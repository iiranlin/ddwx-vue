import Vue from 'vue'
import DataDict from '@/utils/dict'
// import {getListByParentCode} from "@/api/system/dict";
import {getListByParent} from '@/api/system/laborDict';
function install() {
  Vue.use(DataDict, {
    metas: {
      '*': {
        labelField: 'dictLabel',
        valueField: 'dictValue',
        request(dictMeta) {
          return getListByParent(70).then(res => res.data)
        },
      },
    },
  })
}

export default {
  install,
}