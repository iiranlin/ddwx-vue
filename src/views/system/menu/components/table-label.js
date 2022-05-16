export const table_label = () => [{
        prop: "menuName",
        fieldName: "菜单名称",
        width: 180,
        align: "center",
        visible: true,
        isSearchHeader: 1
    }, {
        prop: "parentName",
        fieldName: "上级菜单",
        width: 180,
        align: "center",
        visible: true,
        isSearchHeader: 1
    }, {
        prop: "menuIcon",
        fieldName: "菜单图标",
        width: 180,
        align: "center",
        visible: true,
        icon: true
    }, {
        prop: "menuUrl",
        fieldName: "菜单URL",
        width: 180,
        align: "center",
        visible: true
    }, {
        prop: "component",
        fieldName: "组件地址",
        width: 180,
        align: "center",
        visible: true
    }, {
        prop: "seq",
        fieldName: "排序",
        width: 180,
        align: "center",
        visible: true
    },{
        prop: "isHide",
        fieldName: "是否隐藏",
        width: 180,
        align: "center",
        visible: true,
    },
    {
        prop: "status",
        fieldName: "状态",
        width: 180,
        align: "center",
        visible: true,
        filters: [{ text: '启用', value: 0 }, { text: '停用', value: 1 }],
        state: {
            "0": "启用",
            "1": "停用",
        }
    },
    {
        prop: "createTime",
        fieldName: "创建时间",
        width: 120,
        align: "center",
        visible: true,
        date: true
    },
    {
        prop: "updateTime",
        fieldName: "更新时间",
        width: 120,
        align: "center",
        visible: true,
        date: true
    }
]