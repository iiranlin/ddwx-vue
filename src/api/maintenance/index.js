import request from "@/utils/request";
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

/**
 * 场所管理
 */
export class FacilityManagement {
  // 场所管理-分页查询
  static getSysRepairPlace(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPlace/listPage`,
      method: "get",
      params,
    });
  }
  // 场所管理-新增
  static addSysRepairPlace(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPlace/create`,
      method: "post",
      data,
    });
  }
  // 场所管理-不分页查询
  static getSysRepairPlaceList() {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPlace/getList`,
      method: "get",
    });
  }
}

/**
 * 资源管理
 */
export class ResourceManagement {
  // 班组管理-分页查询
  static getTeamList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairTeam/listPage`,
      method: "get",
      params,
    });
  }
  // 班组管理-新增
  static addTeam(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairTeam/create`,
      method: "post",
      data,
    });
  }
  // 班组管理-修改
  static updateTeam(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairTeam/modify`,
      method: "post",
      data,
    });
  }
  // 班组管理-根据id获取详情
  static getTeamById(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairTeam/getById`,
      method: "get",
      params: { id },
    });
  }
  // 班组管理-删除
  static deleteTeam(ids) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairTeam/deleteBatch`,
      method: "post",
      data: ids,
    });
  }
  // 班组管理-不分页查询
  static getTeamListAll() {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairTeam/getList`,
      method: "get",
    });
  }

  // 维修人员管理-分页查询
  static getRepairList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPersonnel/listPage`,
      method: "get",
      params,
    });
  }
  // 维修人员管理-不分页查询
  static getRepairListAll(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPersonnel/getList`,
      method: "get",
      params,
    });
  }
  // 维修人员管理-新增
  static addRepair(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPersonnel/create`,
      method: "post",
      data,
    });
  }
  // 维修人员管理-修改
  static updateRepair(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPersonnel/modify`,
      method: "post",
      data,
    });
  }
  // 维修人员管理- 停用状态修改
  static updateRepairState(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPersonnel/updateStatus`,
      method: "post",
      data,
    });
  }
  // 维修人员管理-根据id获取详情
  static getRepairById(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPersonnel/getById`,
      method: "get",
      params: { id },
    });
  }
  // 维修人员管理-删除
  static deleteRepair(ids) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPersonnel/deleteBatch`,
      method: "post",
      data: ids,
    });
  }

  // 维修场所管理-分页查询
  static getPlaceList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPlace/listPage`,
      method: "get",
      params,
    });
  }
  // 维修场所管理-新增
  static addPlace(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPlace/create`,
      method: "post",
      data,
    });
  }
  // 维修场所管理-修改
  static updatePlace(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPlace/modify`,
      method: "post",
      data,
    });
  }
  // 维修场所管理-根据id获取详情
  static getPlaceById(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPlace/getById`,
      method: "get",
      params: { id },
    });
  }
  // 维修场所管理-删除
  static deletePlace(ids) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairPlace/deleteBatch`,
      method: "post",
      data: ids,
    });
  }

  // 维修设备管理-分页查询
  static getDeviceList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipment/listPage`,
      method: "get",
      params,
    });
  }
  // 维修设备管理-新增
  static addDevice(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipment/create`,
      method: "post",
      data,
    });
  }
  // 维修设备管理-不分页
  static getDeviceListAll() {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipment/getList`,
      method: "get",
    });
  }

  // 维修耗材管理-不分页查询
  static getConsumableListAll() {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairSupplies/getList`,
      method: "get",
    });
  }

  // 维修耗材管理-分页查询
  static getConsumableList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairSupplies/listPage`,
      method: "get",
      params,
    });
  }
  // 维修耗材管理-新增
  static addConsumable(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairSupplies/create`,
      method: "post",
      data,
    });
  }
  // 维修耗材管理-根据id获取详情
  static getConsumableById(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairSupplies/getById`,
      method: "get",
      params: { id },
    });
  }
  // 维修耗材管理-删除
  static deleteConsumable(ids) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairSupplies/deleteBatch`,
      method: "post",
      data: ids,
    });
  }
  // 维修耗材管理-修改
  static updateConsumable(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairSupplies/modify`,
      method: "post",
      data,
    });
  }
  // 维修设备管理-分页查询
  static getDeviceList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipment/listPage`,
      method: "get",
      params,
    });
  }

  // 维修设备管理-新增
  static addDevice(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipment/create`,
      method: "post",
      data,
    });
  }
  // 维修设备管理-修改
  static updateDevice(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipment/modify`,
      method: "post",
      data,
    });
  }
  // 维修设备管理-根据id获取详情
  static getDeviceById(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipment/getById`,
      method: "get",
      params: { id },
    });
  }
  // 维修设备管理-删除
  static deleteDevice(ids) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipment/deleteBatch`,
      method: "post",
      data: ids,
    });
  }

  // 设备类型管理-分页查询
  static getDeviceTypeList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipmentType/listPage`,
      method: "get",
      params,
    });
  }
  // 设备类型管理-新增
  static addDeviceType(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipmentType/create`,
      method: "post",
      data,
    });
  }
  // 设备类型管理-修改
  static updateDeviceType(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipmentType/modify`,
      method: "post",
      data,
    });
  }
  // 设备类型管理-根据id获取详情
  static getDeviceTypeById(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipmentType/getById`,
      method: "get",
      params: { id },
    });
  }
  // 设备类型管理-删除
  static deleteDeviceType(ids) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipmentType/deleteBatch`,
      method: "post",
      data: ids,
    });
  }
  // 设备类型管理-不分页查询
  static getDeviceTypeListAll() {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairEquipmentType/getList`,
      method: "get",
    });
  }
}

/**
 * 调度中心
 */
export class IdentityManagement {
  /**
   * 分页查询调度中心人员列表。
   * @param {Object} params 查询参数，包含分页信息及页面筛选条件。
   * @returns {Promise} 返回调度中心人员分页数据的请求 Promise。
   */
  static getDispatchList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/identity/dispatchList`,
      method: "get",
      params,
    });
  }

  /**
   * 新增调度中心人员身份信息。
   * @param {Object} data 待新增的人员身份及备注信息。
   * @returns {Promise} 返回新增操作结果的请求 Promise。
   */
  static create(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/identity/create`,
      method: "post",
      data,
    });
  }

  /**
   * 修改已有的调度中心人员身份信息。
   * @param {Object} data 包含记录主键及最新字段值的人员信息。
   * @returns {Promise} 返回修改操作结果的请求 Promise。
   */
  static update(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/identity/update`,
      method: "post",
      data,
    });
  }

  /**
   * 批量删除指定的调度中心人员身份记录。
   * @param {Array<string|number>} ids 待删除记录的主键集合。
   * @returns {Promise} 返回批量删除结果的请求 Promise。
   */
  static deleteBatch(ids) {
    return request({
      url: `${VUE_APP_BASE_prefix}/identity/deleteBatch`,
      method: "post",
      data: ids,
    });
  }
}
/**
 * 工单管理
 */
export class WorkOrderManagement {
  // 工单管理 - 导出
  static exportWorkOrderList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/export`,
      method: "get",
      params,
      responseType: "blob",
    });
  }
  // 工单管理-分页查询
  static getWorkOrderList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/listPage`,
      method: "get",
      params,
    });
  }
  // 工单管理-新增
  static addWorkOrder(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/create`,
      method: "post",
      data,
    });
  }
  // 工单管理-修改
  static updateWorkOrder(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/modify`,
      method: "post",
      data,
    });
  }
  // 工单管理-根据id获取详情
  static getWorkOrderById(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/getById`,
      method: "get",
      params: { id },
    });
  }
  // 工单管理-删除
  static deleteWorkOrder(ids) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/deleteBatch`,
      method: "post",
      data: ids,
    });
  }
  // 工单操作通用接口
  static executeWorkOrder(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/executeOrder`,
      method: "post",
      data,
    });
  }
}

/**
 * 维修工单人员
 */
export class WorkOrderPerson {
  // 维修工单人员-分页查询
  static getWorkOrderPersonList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrderPersonnel/listPage`,
      method: "get",
      params,
    });
  }

  // 根据日期获取维修人员
  static getWorkOrderPersonByDate(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrderPersonnel/getByDate`,
      method: "get",
      params,
    });
  }

  // 检查当前时间是否有任务
  static checkTask(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrderPersonnel/checkDate`,
      method: "get",
      params,
    });
  }
}

export class MaintenancePlan {
  // 维保计划-分页查询
  static getMaintenancePlanList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairMaintenancePlan/listPage`,
      method: "get",
      params,
    });
  }
  // 维保计划-新增
  static addMaintenancePlan(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairMaintenancePlan/create`,
      method: "post",
      data,
    });
  }
  // 维保计划-修改
  static updateMaintenancePlan(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairMaintenancePlan/modify`,
      method: "post",
      data,
    });
  }
  // 维保计划-根据id获取详情
  static getMaintenancePlanById(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairMaintenancePlan/getById`,
      method: "get",
      params: { id },
    });
  }
  // 维保计划-删除
  static deleteMaintenancePlan(ids) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairMaintenancePlan/deleteBatch`,
      method: "post",
      data: ids,
    });
  }
  // 维保计划-更新状态
  static updateMaintenancePlanState(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairMaintenancePlan/modify`,
      method: "post",
      data,
    });
  }
}

// 资源管理
export class ProgressConfig {
  // 流程管理-分页查询
  static getProgressConfigList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/sysResourceConfig/listPage`,
      method: "get",
      params,
    });
  }
  // 流程管理-新增
  static addProgressConfig(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/sysResourceConfig/create`,
      method: "post",
      data,
    });
  }
  // 流程管理-修改
  static updateProgressConfig(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/sysResourceConfig/modify`,
      method: "post",
      data,
    });
  }
  // 流程管理-根据id获取详情
  static getProgressConfigById(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/sysResourceConfig/getById`,
      method: "get",
      params: { id },
    });
  }
  // 流程管理-删除
  static deleteProgressConfig(ids) {
    return request({
      url: `${VUE_APP_BASE_prefix}/sysResourceConfig/deleteBatch`,
      method: "post",
      data: ids,
    });
  }
}
// 消息管理
export class MessageManagement {
  // 消息管理-分页查询
  static getMessageList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairMessage/listPagePc`,
      method: "get",
      params,
    });
  }

  /**
   * 将指定维修工单消息标记为已读。
   * @param {{id: string|number}} data 包含当前工单消息 ID 的请求数据。
   * @returns {Promise} 已读接口请求结果。
   * @example MessageManagement.markMessageAsRead({ id: 1001 })
   */
  static markMessageAsRead(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairMessage/modify`,
      method: "post",
      data,
    });
  }

  // 消息管理-根据id获取详情
  static getMessageById(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/identity/listUserIdentity`,
      method: "get",
      params: { userIdentity: id },
    });
  }
  // 消息管理-修改身份配置的用户
  static updateUserIdentity(data) {
    return request({
      url: `${VUE_APP_BASE_prefix}/identity/modify`,
      method: "post",
      data,
    });
  }

  // 消息反馈
  static getMessageFeedbackList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairFeedback/listPage`,
      method: "get",
      params,
    });
  }
}

// 数据统计
export class DataStatistics {
  // 班组统计 - 暂不分页
  static getTeamStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/teamRepairStatistics`,
      method: "get",
      params,
    });
  }
  // 班组维修统计导出
  static exportTeamStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/teamRepairStatisticsExport`,
      method: "get",
      params,
      responseType: "blob",
    });
  }
  // 场所统计 - 暂不分页
  static getPlaceStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/statisticsByPlace`,
      method: "get",
      params,
    });
  }
  // 场所统计 - 导出
  static exportPlaceStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/statisticsByPlaceExport`,
      method: "get",
      params,
      responseType: "blob",
    });
  }

  // 维修人员统计 - 暂不分页
  static getPersonStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/repairPersonnelStatistics`,
      method: "get",
      params,
    });
  }
  // 维修人员统计 - 导出
  static exportPersonStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/repairPersonnelStatisticsExport`,
      method: "get",
      params,
      responseType: "blob",
    });
  }
  // 耗材统计 - 暂不分页
  static getMaterialStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/materialStatistics`,
      method: "get",
      params,
    });
  }
  // 耗材统计 - 导出
  static exportMaterialStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/materialStatisticsExport`,
      method: "get",
      params,
      responseType: "blob",
    });
  }
  // 设备维修类型统计 - 暂不分页
  static getDeviceTypeStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/equipmentRepairStatistics`,
      method: "get",
      params,
    });
  }
  // 设备维修类型统计 - 导出
  static exportDeviceTypeStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrder/equipmentRepairStatisticsExport`,
      method: "get",
      params,
      responseType: "blob",
    });
  }
}

// 工单统计
export class WorkOrderStatistics {
  // 工单统计-分页查询
  static getWorkOrderStatisticsList(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrderStatistics/groupByOrderStatus`,
      method: "get",
      params,
    });
  }

  // 各个场所维修统计
  static getPlaceStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrderStatistics/groupBySite`,
      method: "get",
      params,
    });
  }
  // 维修工单优先级
  static getPriorityStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrderStatistics/groupByUrgency`,
      method: "get",
      params,
    });
  }
  // 设备类型维修工单
  static getDeviceTypeStatistics(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/repairOrderStatistics/groupByEquipmentType`,
      method: "get",
      params,
    });
  }
}
