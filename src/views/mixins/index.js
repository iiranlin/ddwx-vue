export default {
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 30,
        isAsc: '',
        orderByColumn: ''
      },
      // 校验最多输入8位整数和2位小数
      validateNumber8I2F: {
        trigger: 'blur',
        pattern: /^0\.[0-9]{1,2}$|^0$|^[1-9]\d{0,7}\.\d{1,2}$|^[1-9]\d{0,7}$/,
        message: '请最多输入八位整数和两位小数的金额'
      },
      // 校验只能输入数字或字母
      validateNumberOrLetter: { trigger: 'blur', pattern: /^[A-Za-z0-9]+$/, message: '只能输入数字或字母' },
      // 校验只能输入数字或字母或-
      validateNumber_Letter: { trigger: 'blur', pattern: /^[A-Za-z0-9\-]+$/, message: '只能输入数字或字母' },
      // 校验邮箱
      validateEmail: {
        trigger: 'blur',
        pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        message: '请输入正确的邮箱'
      },
      // 校验只能输入数字
      validateOnlyNumber: { trigger: 'blur', pattern: /^[0-9]*$/, message: '只能输入数字' },
      // 校验身份证或驾驶证
      validateIDCard: {
        trigger: 'blur',
        pattern: /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/,
        message: '请输入规范的证件号'
      },
      // 校验12位证件号,如果驾驶证档案
      validateNumber12: {
        trigger: 'blur',
        pattern: /\\d{12}$/,
        message: '请输入规范的12位证件号'
      },
      // 校验车牌号,包含油车和电车
      validateCarNumber: {
        trigger: 'blur',
        pattern: /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/,
        message: '请输入规范的车牌号'
      },
      validateVinNumber: {
        trigger: 'blur',
        pattern: /^[A-Za-z0-9]{17}$/,
        message: '请输入规范的17位车架号'
      }

    }
  },
  filters: {
    format(val) {
      if (val) {
        if (!isNaN(val)) {
          let reg = /\d{1,3}(?=(\d{3})+$)/g
          return (val + '').replace(reg, '$&,')
        } else {
          return val
        }
      } else {
        if (val === null) {
          return 0
        } else {
          return 0
        }
      }

    },
    fieldFormat(val, row) {
      for (let item of row) {
        if (val == item.code) {
          return item.name
        }
      }
    }
    // fieldFormat (val, type) {
    //     // let typeObj = JSON.stringify(type);
    //     if(type){
    //         return JSON.parse(type)[val]
    //     }
    // }
  },
  computed: {},
  methods: {
    sortableColumnChange({ order, prop }) {
      let orderString = (order === 'descending') ? 'desc' : 'asc'
      this.listQuery.isAsc = orderString
      this.listQuery.orderByColumn = prop
      this.emitAblFilter()
    },
    tableIndex(index) {
      let { pageNum, pageSize } = this.listQuery
      return ((pageNum - 1) * pageSize) + (index + 1)
    },

    tableRowClassName({ row, rowIndex }) {   // 把每一行的索引放进row
      let { pageNum, pageSize } = this.listQuery
      row.index = ((pageNum - 1) * pageSize) + (rowIndex + 1)
    }
  }
}
