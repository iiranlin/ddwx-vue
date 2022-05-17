export default {
    data (){
        return {
            listQuery: {
                pageNum: 1,
                pageSize: 30,
                isAsc: '',
                orderByColumn: ''
            },
        }
    },
    filters: {
        format (val) {
            if (val) {
                if (!isNaN(val)) {
                    let reg = /\d{1,3}(?=(\d{3})+$)/g;
                    return (val + '').replace(reg, '$&,');
                } else {
                    return val;
                }
            } else {
                if (val === null) {
                    return 0;
                } else {
                    return 0;
                }
            };
        },
        fieldFormat (val, row) {
            for(let item of row){
                if(val == item.code){
                    return item.name
                }
            }
        },
        // fieldFormat (val, type) {
        //     // let typeObj = JSON.stringify(type);
        //     if(type){
        //         return JSON.parse(type)[val]
        //     }
        // }
    },
    computed: {
    },
    methods: {
        sortableColumnChange ({order, prop}){
            let orderString = (order === 'descending') ? 'desc': 'asc';
            this.listQuery.isAsc = orderString;
            this.listQuery.orderByColumn = prop;
            this.emitAblFilter();
        },
        tableIndex (index) {
            let {pageNum, pageSize} = this.listQuery;
            return ((pageNum - 1) * pageSize) + (index + 1);
        },

        tableRowClassName ({row, rowIndex}) {   // 把每一行的索引放进row
            let {pageNum, pageSize} = this.listQuery;
            row.index = ((pageNum - 1) * pageSize) + (rowIndex + 1);
        },
    }
}