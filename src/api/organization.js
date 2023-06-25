import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;
// 预算统计导出地址
export const gcywBudgetExportFile = `${VUE_APP_BASE_prefix}/gcywBudget/exportFile`


//车辆编制-获取部门数据
export function unitTree(params) {
  return request({
      url: `${VUE_APP_BASE_prefix}/unit/tree`,
      method: 'get',
      params
  })
}

//车辆编制-新增
export function authorizedStrengthAdd(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/authorizedStrength/add`,
        method: 'post',
        data
    })
}

//车辆编制-获取列表数据
export function authorizedStrengthList(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/authorizedStrength/list`,
        method: 'get',
        params
    })
}

//车辆编制-删除
export function authorizedStrengthDelete(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/authorizedStrength/delete`,
        method: 'post',
        data
    })
}

//车辆编制-下发
export function authorizedStrengthDistribute(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/authorizedStrength/distribute`,
        method: 'post',
        data
    })
}

//车辆编制-保存
export function authorizedStrengthUpdate(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/authorizedStrength/update`,
        method: 'post',
        data
    })
}

//车辆编制-重置
export function authorizedStrengthClean (data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/authorizedStrength/clean `,
        method: 'post',
        data
    })
}

// 车辆编制审批列表-分页
export function activitiList(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/authorizedStrength/activiti/list`,
        method: 'get',
        params
    })
  }

  //车辆编制-审批通过
export function activitiComplete(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/authorizedStrength/activiti/complete`,
        method: 'post',
        data
    })
}
//车辆编制-审批拒绝
export function activitiReject(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/authorizedStrength/activiti/reject`,
        method: 'post',
        data
    })
}

//预算管理-获取列表数据
export function gcywBudgetList(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywBudget/list`,
        method: 'get',
        params
    })
}

//预算管理-新增
export function gcywBudgetAdd(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywBudget/add`,
        method: 'post',
        data
    })
}

//预算管理-保存
export function gcywBudgetUpdate(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywBudget/update`,
        method: 'post',
        data
    })
}

//预算管理-删除
export function gcywBudgetDelete(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywBudget/delete`,
        method: 'post',
        data
    })
}

//预算管理-下发
export function gcywBudgetDistribute(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywBudget/distribute`,
        method: 'post',
        data
    })
}

//预算管理-重置
export function gcywBudgetClean (data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywBudget/clean `,
        method: 'post',
        data
    })
}

// 预算管理审批列表-分页
export function gcywBudgetActivitiList(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywBudget/activiti/list`,
        method: 'get',
        params
    })
  }

  //预算管理-审批通过
export function gcywBudgetActivitiComplete(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywBudget/activiti/complete`,
        method: 'post',
        data
    })
}
//预算管理-审批拒绝
export function gcywBudgetActivitiReject(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywBudget/activiti/reject`,
        method: 'post',
        data
    })
}

//预算统计-导出查询接口
export function gcywBudgetExportDate(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywBudget/exportDate`,
        method: 'get',
        params
    })
}
