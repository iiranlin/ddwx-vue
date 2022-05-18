import { menuProperty } from '@/api/system/menu'
import { getListByParentCode } from '@/api/system/dict'
const menu = {
    state: {
        menuPropertys: {},
    },

    mutations: {
        MENU_PROPERTY: (state, view) => {
            state.menuPropertys = view
        },
    },

    actions: {
        menuProperty({ commit }, id) {
            return new Promise((resolve, reject) => {
                menuProperty(id).then( async ({data}) => {
                    for(let item of data.search){
                        if(item.fieldType == "dict"){
                            item.fieldFormatArr = await getListByParentIds(item.fieldFormatDict);
                        }
                    }
                    for(let val of data.fields){
                        if(val.fieldType == "dict"){
                            val.fieldFormatArr = await getListByParentIds(val.fieldFormatDict);
                        }
                    }
                    commit('MENU_PROPERTY', data);
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        },
    }
}

function getListByParentIds (id) {
    return new Promise( resolve => {
      getListByParentCode(id).then(({data}) => {
            resolve(data)
        })
    })
}

export default menu
