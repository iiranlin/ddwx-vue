<template>
  <el-table
    v-if="showIf"
    ref="elTable"
    class="container_table"
    height="100%"
    v-loading="loading"
    :data="tableData"
    border
    highlight-current-row
    stripe
    row-key="id"
    @selection-change="handleSelectionChange"
    @sort-change="sortableColumnChange"
  >
    <el-table-column
      :selectable="selectable"
      v-if="selectShow"
      type="selection"
      width="50"
      align="center"
      fixed="left"
    />
    <el-table-column
      type="index"
      width="50"
      align="center"
      :index="tableIndexs"
      label="序号"
      v-if="numberShow"
    />
    <template v-for="(item, index) in propertyFields">
      <el-table-column
        :key="`fields_${index}`"
        v-if="
          propertyFieldsArr[index].isHide === 0 &&
          !propertyFieldsArr[index].isHides
        "
        :show-overflow-tooltip="true"
        :prop="propertyFieldsArr[index].fieldCode"
        :label="item.fieldName"
        :fixed="propertyFieldsArr[index].fixed"
        :align="propertyFieldsArr[index].align || 'center'"
        :width="propertyFieldsArr[index].fieldWidth || 'auto'"
        :sortable="propertyFieldsArr[index].isOrder == 1 ? 'custom' : false"
        :filters="propertyFieldsArr[index].isOrder == 1 ? [] : null"
        :render-header="
          propertyFieldsArr[index].isSearchHeader == 1
            ? (h, obj) => renderSpecNameHeader(h, obj, propertyFieldsArr[index])
            : renderHeader
        "
      >
        <template slot-scope="scope">
          <span
            v-if="
              propertyFieldsArr[index].fieldType != null &&
              propertyFieldsArr[index].fieldType.indexOf('date') != -1
            "
          >{{
              parseTime(
                scope.row[propertyFieldsArr[index].fieldCode],
                propertyFieldsArr[index].fieldFormatDate
              )
            }}</span
          >
          <span v-else-if="propertyFieldsArr[index].menuName == menuName && propertyFieldsArr[index].fieldType === 'dict'">
            <el-switch
              v-model="scope.row[propertyFieldsArr[index].fieldCode]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="0"
              inactive-value="1" @change="changeSwitch(scope.row)"
            >
            </el-switch>
          </span>
          <span v-else-if="propertyFieldsArr[index].fieldType === 'dict'">
            {{
              scope.row[propertyFieldsArr[index].fieldCode]
                | fieldFormat(propertyFieldsArr[index].fieldFormatArr)
            }}
          </span>
          <span v-else-if="item.link">
            <el-link
              class="underline ellipsis"
              type="primary"
              @click="clickLink(scope.row, item.fieldCode, item.link)"
            >{{ scope.row[propertyFieldsArr[index].fieldCode] }}</el-link
            >
          </span>
          <span v-else>{{ scope.row[propertyFieldsArr[index].fieldCode] }}</span>
        </template>
      </el-table-column>
    </template>
    <el-table-column
      fixed="right"
      label="操作"
      align="center"
      min-width="180"
      class-name="small-padding fixed-width"
      v-if="property.buttonRow && property.buttonRow.length > 0"
    >
      <template slot-scope="scope">
        <template v-for="item in buttonRow">
          <el-button
            :disabled="isButtonObjFilters(item, scope)"
            :key="item.id"
            size="mini"
            type="text"
            @click="newButton(item.buttonCode, scope.row)"
          >
            <svg-icon :icon-class="item.buttonIcon ? item.buttonIcon : ''"/>
            {{ item.buttonName }}
          </el-button
          >
        </template>
        <el-dropdown
          size="mini"
          @command="(command) => handleCommand(command, scope.row)"
          v-if="buttonRows.length > 0"
        >
          <span class="el-dropdown-link">
            <i class="el-icon-d-arrow-right el-icon--right"></i>更多
          </span>
          <el-dropdown-menu slot="dropdown">
            <template v-for="item in buttonRows">
              <el-dropdown-item
                :command="item.buttonCode"
                :key="item.id"
                :disabled="isButtonObjFilters(item, scope)"
              >{{ item.buttonName }}
              </el-dropdown-item
              >
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import SelectHeader from '@/components/SelectHeader'
import Sortable from 'sortablejs'
import indexMixin from '@/views/mixins'

export default {
  name: 'tableIndex',
  mixins: [indexMixin],
  props: {
    //加载
    loading: {
      type: Boolean,
      default: false
    },
    //表格数据
    tableData: {
      type: Array,
      default: []
    },
    //表格序号是否展示
    numberShow: {
      type: Boolean,
      default: false
    },
    //表格序号
    tableIndexs: {
      type: Function,
      default: null
    },
    //表格显示字段、按钮数据
    property: {
      type: Object,
      default: null
    },
    // 列表字段判断是否可操作
    isButtonObj: {
      type: Object,
      default: null
    },
    //表格选择是否展示（默认展示）
    selectShow: {
      type: Boolean,
      default: true
    },
    // CheckBox 是否可以勾选
    selectable: {
      type: Function,
      default: () => true
    },
    //菜单名称
    menuName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showIf: true,
      propertyFields: [],
      propertyFieldsArr: [],
      ids: [],
      buttonRow: [],
      buttonRows: [],
      formData: {},
      selectionArr: []
    }
  },
  watch: {
    'property.buttonRow': {
      handler: function(newButtonRow) {
        let newButtonRows = newButtonRow
        if (newButtonRows.length <= 3) {
          this.buttonRow = newButtonRows
        } else {
          this.buttonRow = newButtonRows.slice(0, 2)
          this.buttonRows = newButtonRows.slice(2, newButtonRows.length)
        }
      }
    },
    'property.fields': {
      handler: function(newFields) {
        this.propertyFields = JSON.parse(JSON.stringify(newFields))
        this.propertyFieldsArr = JSON.parse(JSON.stringify(newFields))
      }
    }
    // showIf: {
    //   handler: function (newShowIf) {
    //     if (newShowIf) {
    //       this.$nextTick(() => {
    //         // this.rowDrop();
    //         // this.columnDrop();
    //       });
    //     }
    //   },
    // },
  },
  mounted() {
    // this.rowDrop();
    // this.columnDrop();
  },
  methods: {
    init(data) {
      this.showIf = false
      this.propertyFields = JSON.parse(JSON.stringify(data))
      this.propertyFieldsArr = JSON.parse(JSON.stringify(data))
      this.$nextTick(() => {
        this.showIf = true
      })
    },
    isButtonObjFilters(item, scope) {
      let isButtonObj = this.isButtonObj
      if (isButtonObj) {
        if (
          scope.row[isButtonObj.name] == isButtonObj.val &&
          isButtonObj.type.indexOf(item.buttonCode) != -1
        ) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    handleCommand(command, row) {
      this.newButton(command, row)
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
        }
      })
    },
    //列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: (evt) => {
          const oldItem = this.propertyFieldsArr[evt.oldIndex - 1]
          this.propertyFieldsArr.splice(evt.oldIndex - 1, 1)
          this.propertyFieldsArr.splice(evt.newIndex - 1, 0, oldItem)
          this.propertyFields = JSON.parse(
            JSON.stringify(this.propertyFieldsArr)
          )
          this.showIf = false
          this.$emit('columnDrop', this.propertyFieldsArr)
          this.$nextTick(() => {
            this.showIf = true
          })
        }
      })
    },
    renderHeader(h, { column, $index }, index) {
      return <span>{column.label}</span>
    },
    //渲染**的tableheader
    renderSpecNameHeader(createElement, { column, $index }, row) {
      let fieldFormatObj = null
      if (row.fieldType == 'dict') {
        for (const item of row.fieldFormatArr) {
          fieldFormatObj = Object.assign({}, fieldFormatObj, { [item.code]: item.name })
        }
      }
      let self = this
      //该列的绑定数据
      // console.log(column.label);
      //列号
      // console.log($index);
      return createElement(
        'div',
        {
          style: 'display:inline-flex;'
        },
        [
          createElement('div', {
            domProps: {
              innerHTML: column.label
            }
          }),
          createElement(SelectHeader, {
            style: 'cursor: pointer;margin-left: 5px;',
            // 组件 prop
            props: {
              type: column.property,
              fieldType: row.fieldType,
              fieldFormat: fieldFormatObj,
              columnLabel: column.label
            },
            // 事件监听器在 `on` 属性内，
            // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
            // 需要在处理函数中手动检查 keyCode。
            on: {
              selectChange: self.selectChange
              // click: this.clickHandler
            },
            // 仅用于组件，用于监听原生事件，而不是组件内部使用
            // `vm.$emit` 触发的事件。
            nativeOn: {
              // click: this.nativeClickHandler
            }
          })
        ]
      )
    },
    //选择框回调
    selectChange(data) {
      let { fieldType, type, value, watch } = data
      this.createTime(fieldType, type, value)
      this.$emit('selectChange', { formData: this.formData, isWatch: watch })
    },
    createTime(fieldType, type, value) {
      if (fieldType && fieldType.indexOf('date') != -1) {
        if (value) {
          this.formData[type + 'Start'] = value[0]
          this.formData[type + 'End'] = value[1]
        } else {
          this.formData[type + 'Start'] = null
          this.formData[type + 'End'] = null
        }
      } else {
        this.formData[type] = value
      }
    },
    handleSelectionChange(selection) {
      this.selectionArr = selection
      this.ids = selection.map((item) => item.id)
      let single = selection.length != 1
      let multiple = !selection.length
      this.$emit('handleSelectionChange', this.ids, single, multiple, selection)
    },
    emitAblFilter() {
      this.$emit('emitAblFilter', this.listQuery)
    },
    newButton(buttonCode, row = {}) {
      let id = ''
      if (['update', 'detail'].includes(buttonCode)) {
        if (row.id) {
          id = row.id
        } else {
          id = this.ids[0]
        }
      } else if (['delete', 'stop', 'distribute', 'enable', 'cancel', 'confirm'].includes(buttonCode)) {
        id = row.id || this.ids
        if (!(id instanceof Array)) {
          id = [id]
        }
      }
      this.$emit('handleButton', id || row, buttonCode, row, this.selectionArr)
    },
    // 列表超链接 row行数据 fieldCode 表的字段 linkText 为链接页面的内容
    clickLink(row = {}, fieldCode, linkText) {
      this.$emit('clickLink', row, fieldCode, linkText)
    },
    changeSwitch(row) {
      this.$emit('changeSwitch', row)
    }
  },
  beforeUpdate() {
    this.$nextTick(() => {
      if (this.$refs.elTable) {
        this.$refs.elTable.doLayout()
      }
    })
  }
}
</script>
<style lang="scss">
.el-tooltip__popper {
  max-width: 50%;
}
</style>
