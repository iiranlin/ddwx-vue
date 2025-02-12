import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;
// 工作流列表分页
export function modelListPage(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/activiti/model/listPage`,
        method: 'get',
        params
    })
}
// 工作流列表
export function modelList(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/activiti/model/list`,
        method: 'get',
        params
    })
}
// 返回工作流服务器请求地址
export function modelEditUrl(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/activiti/model/editUrl`,
        method: 'get',
        params
    })
}

// 新建工作流
export function modelNewModel(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/activiti/model/newModel`,
        method: 'get',
        params
    })
}

// 修改工作流模型启用状态
export function modelUpdateFlag(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/activiti/model/updateFlag`,
        method: 'get',
        params
    })
}


// 下一级审批人列表
export function activitiAssigneeList(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/activiti/assigneeList`,
        method: 'post',
        data
    })
}


// 公车租赁审批列表-分页
export function activitiListPage(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/vehicleInfo/activiti/listPage`,
        method: 'get',
        params
    })
  }


//发起审批
export function activitiStart(data) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/vehicleInfo/activiti/start`,
      method: 'post',
      data
    })
}
  
//审批通过
export function activitiComplete(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/vehicleInfo/activiti/complete`,
        method: 'post',
        data
    })
}
//审批拒绝
export function activitiReject(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/vehicleInfo/activiti/reject`,
        method: 'post',
        data
    })
}