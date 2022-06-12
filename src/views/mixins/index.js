export default {
  data() {
    let validate8I2F = (rule, value, callback) => {
      regCallBack(/^0\.[0-9]{1,2}$|^0$|^[1-9]\d{0,7}\.\d{1,2}$|^[1-9]\d{0,7}$/, '请最多输入八位整数和两位小数的金额', value, callback)
    }
    let validateInteger = (rule, value, callback) => {
      regCallBack(/^[0-9]*$/, '只能输入数字', value, callback)
    }
    let validateNumberOrLetter = (rule, value, callback) => {
      regCallBack(/^[A-Za-z0-9]+$/, '只能输入数字或字母', value, callback)
    }
    let validateEmail = (rule, value, callback) => {
      regCallBack(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        '只能输入数字或字母', value, callback)
    }
    let regCallBack = (reg, message, value, callback) => {
      if (!reg.test(value)) {
        callback(new Error(message))
      } else {
        callback()
      }
    }
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 30,
        isAsc: '',
        orderByColumn: ''
      },
      // 校验最多输入8位整数和2位小数
      validateNumber8I2F: { trigger: 'blur', validator: validate8I2F },
      // 校验只能输入整数
      validateInteger: { trigger: 'blur', validator: validateInteger },
      // 校验只能输入数字或字母
      validateNumberOrLetter: { trigger: 'blur', validator: validateNumberOrLetter },
      // 校验邮箱
      validateEmail: { trigger: 'blur', validator: validateEmail }

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
