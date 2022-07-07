import { menuProperty } from '@/api/system/menu'
import { getListByParentId } from '@/api/system/dict'
import { enumUrl } from '@/api/enumUrl'
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
                        }else if(item.fieldType == "enum" && item.enumUrl){
                            item.fieldFormatArr = await enumUrlPromise(item.enumUrl);
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

function enumUrlPromise (url) {
    return new Promise((resolve, reject) => {
        enumUrl({}, url).then( ({data}) => {
            resolve(data)
        })
    })
}
function getListByParentIds (id) {
    return new Promise( resolve => {
        getListByParentId(id).then(({data}) => {
            resolve(data)
        })
    })
}

export default menu
