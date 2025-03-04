import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

/**
 * 场所管理
 */
export class FacilityManagement{
  // 场所管理-分页查询
  static getSysRepairPlace(params){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPlace/listPage`,
      method: 'get',
      params
    })
  }
  // 场所管理-新增
  static addSysRepairPlace(data){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPlace/create`,
      method: 'post',
      data
    })
  }
}

/**
 * 资源管理
 */
export class ResourceManagement{
  // 班组管理-分页查询
  static getTeamList(params){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairTeam/listPage`,
      method: 'get',
      params
    })
  }
  // 班组管理-新增
  static addTeam(data){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairTeam/create`,
      method: 'post',
      data
    })
  }
  // 班组管理-修改
  static updateTeam(data){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairTeam/modify`,
      method: 'post',
      data
    })
  }
  // 班组管理-根据id获取详情
  static getTeamById(id){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairTeam/getById`,
      method: 'get',
      params: {id}
    })
  }
  // 班组管理-删除
  static deleteTeam(ids){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairTeam/deleteBatch`,
      method: 'post',
      data: ids
    })
  }
  // 班组管理-不分页查询
  static getTeamListAll(){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairTeam/getList`,
      method: 'get'
    })
  }

  // 维修人员管理-分页查询
  static getRepairList(params){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPersonnel/listPage`,
      method: 'get',
      params
    })
  }
  // 维修人员管理-新增
  static addRepair(data){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPersonnel/create`,
      method: 'post',
      data
    })
  }
  // 维修人员管理-修改
  static updateRepair(data){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPersonnel/modify`,
      method: 'post',
      data
    })
  }
  // 维修人员管理-根据id获取详情
  static getRepairById(id){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPersonnel/getById`,
      method: 'get',
      params: {id}
    })
  }
  // 维修人员管理-删除
  static deleteRepair(ids){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPersonnel/deleteBatch`,
      method: 'post',
      data: ids
    })
  }

  // 维修场所管理-分页查询
  static getPlaceList(params){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPlace/listPage`,
      method: 'get',
      params
    })
  }
  // 维修场所管理-新增
  static addPlace(data){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPlace/create`,
      method: 'post',
      data
    })
  }
  // 维修场所管理-修改
  static updatePlace(data){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPlace/modify`,
      method: 'post',
      data
    })
  }
  // 维修场所管理-根据id获取详情
  static getPlaceById(id){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPlace/getById`,
      method: 'get',
      params: {id}
    })
  }
  // 维修场所管理-删除
  static deletePlace(ids){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairPlace/deleteBatch`,
      method: 'post',
      data: ids
    })
  }


  // 维修设备管理-分页查询
  static getDeviceList(params){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairEquipment/listPage`,
      method: 'get',
      params
    })
  }
  // 维修设备管理-新增
  static addDevice(data){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairEquipment/create`,
      method: 'post',
      data
    })
  }
  



  // 维修耗材管理-分页查询
  static getConsumableList(params){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairSupplies/listPage`,
      method: 'get',
      params
    })
  }
  // 维修耗材管理-新增
  static addConsumable(data){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairSupplies/create`,
      method: 'post',
      data
    })
  }
  // 维修耗材管理-根据id获取详情
  static getConsumableById(id){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairSupplies/getById`,
      method: 'get',
      params: {id}
    })
  }
  // 维修耗材管理-删除
  static deleteConsumable(ids){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairSupplies/deleteBatch`,
      method: 'post',
      data: ids
    })
  }
  // 维修耗材管理-修改
  static updateConsumable(data){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairSupplies/modify`,
      method: 'post',
      data
    })
  }
  // 维修设备管理-分页查询
  static getDeviceList(params){
    return request({
      url: `${VUE_APP_BASE_prefix}/sysRepairEquipment/listPage`,
      method: 'get',
      params
    })
  }

    // 维修设备管理-新增
    static addDevice(data){
      return request({
        url: `${VUE_APP_BASE_prefix}/sysRepairEquipment/create`,
        method: 'post',
        data
      })
    }
    // 维修设备管理-修改
    static updateDevice(data){
      return request({
        url: `${VUE_APP_BASE_prefix}/sysRepairEquipment/modify`,
        method: 'post',
        data
      })
    }
    // 维修设备管理-根据id获取详情
    static getDeviceById(id){
      return request({
        url: `${VUE_APP_BASE_prefix}/sysRepairEquipment/getById`,
        method: 'get',
        params: {id}
      })
    }
    // 维修设备管理-删除
    static deleteDevice(ids){
      return request({
        url: `${VUE_APP_BASE_prefix}/sysRepairEquipment/deleteBatch`,
        method: 'post',
        data: ids
      })
    }

      // 设备类型管理-分页查询 
      static getDeviceTypeList(params){
        return request({
          url: `${VUE_APP_BASE_prefix}/sysRepairEquipmentType/listPage`,
          method: 'get',
          params
        })
      }
      // 设备类型管理-新增
      static addDeviceType(data){
        return request({
          url: `${VUE_APP_BASE_prefix}/sysRepairEquipmentType/create`,
          method: 'post',
          data
        })
      }
      // 设备类型管理-修改
      static updateDeviceType(data){
        return request({
          url: `${VUE_APP_BASE_prefix}/sysRepairEquipmentType/modify`,
          method: 'post',
          data
        })
      }
      // 设备类型管理-根据id获取详情
      static getDeviceTypeById(id){
        return request({
          url: `${VUE_APP_BASE_prefix}/sysRepairEquipmentType/getById`,
          method: 'get',
          params: {id}
        })
      }
      // 设备类型管理-删除
      static deleteDeviceType(ids){
        return request({
          url: `${VUE_APP_BASE_prefix}/sysRepairEquipmentType/deleteBatch`,
          method: 'post',
          data: ids
        })
      }
      // 设备类型管理-不分页查询
      static getDeviceTypeListAll(){
        return request({
          url: `${VUE_APP_BASE_prefix}/sysRepairEquipmentType/getList`,
          method: 'get'
        })
      }


}