import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER; 
let path = process.env.NODE_ENV === 'development' ?  process.env.VUE_APP_BASE_API: '';
export const laborCardQueryExport = path + VUE_APP_BASE_prefix +'/laborCard/getQueryFile'
export const laborGrantQueryFile = path + VUE_APP_BASE_prefix +'/laborGrant/getQueryFile'

export const laborGrantGetDPFile = path + VUE_APP_BASE_prefix +'/laborGrant/getDPFile'
export const laborGrantGetPEDPFile = path + VUE_APP_BASE_prefix +'/laborGrant/getPEDPFile'
export const laborGrantGetPEFile = path + VUE_APP_BASE_prefix +'/laborGrant/getPEFile'

export const exportSimpleFile = path + VUE_APP_BASE_prefix +'/matlCatalog/exportSimpleFile'
export const matlCatalogImportExcel = path + VUE_APP_BASE_prefix +'/matlCatalog/importExcel'
export const workTypeDictExportSimpleFile = path + VUE_APP_BASE_prefix +'/workTypeDict/exportSimpleFile'
export const workTypeDictImportExcel = path + VUE_APP_BASE_prefix +'/workTypeDict/importExcel'
export const laborDictExportSimpleFile = path + VUE_APP_BASE_prefix +'/laborDict/exportSimpleFile'
export const laborDictImportExcel = path + VUE_APP_BASE_prefix +'/laborDict/importExcel'
export const laborMatlRelationSimpleFile = path + VUE_APP_BASE_prefix +'/laborMatlRelation/exportSimpleFile'
export const laborMatlRelationImportExcel = path + VUE_APP_BASE_prefix +'/laborMatlRelation/importExcel'


//查询统计导出-劳保计划查询
export function laborCardGetQueryFile(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborCard/getQueryFile`,
    method: 'get',
    params
  })
}

// 查询工种列表-分页
export function workTypeDictPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/workTypeDict/page`,
    method: 'get',
    params
  })
}
// 查询工种列表
export function workTypeDictList(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/workTypeDict/list`,
    method: 'get',
    params
  })
}

// 工种保存
export function workTypeDictSave(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/workTypeDict/save`,
    method: 'post',
    data
  })
}

// 工种删除
export function workTypeDictBatchRemove(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/workTypeDict/batchRemove`,
    method: 'post',
    data
  })
}

export function workTypeDictGetById(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/workTypeDict/getById`,
    method: 'get',
    params
  })
}

// 劳保用品和物资关系-分页
export function laborMatlRelationPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborMatlRelation/page`,
    method: 'get',
    params
  })
}


export function laborDictList(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborDict/list`,
    method: 'get',
    params
  })
}
// 劳保用品与物资关系保存
export function laborMatlRelationSave(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborMatlRelation/save`,
    method: 'post',
    data
  })
}
// 劳保用品与物资关系删除
export function laborMatlRelationRemove(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborMatlRelation/batchRemove`,
    method: 'post',
    data
  })
}

// 物资目录-分页
export function matlCatalogPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/matlCatalog/page`,
    method: 'get',
    params
  })
}

// 物资目录-保存
export function matlCatalogSave(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/matlCatalog/save`,
    method: 'post',
    data
  })
}

// 查询劳保用品台账列表
export function laborAccountListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborAccount/page`,
    method: 'get',
    params
  })
}
//查询统计-劳保计划分页数据
export function laborCardPageQuery(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborCard/pageQuery`,
    method: 'get',
    params
  })
}

//查询统计-分页数据
export function pageQuery(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/pageQuery`,
    method: 'get',
    params
  })
}

//劳保用品分类-分页数据
export function getLaborDictPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborDict/page`,
    method: 'get',
    params
  })
}

//劳保用品分类-新建分类-保存
export function postLaborDictSave(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborDict/save`,
    method: 'post',
    data
  })
}

//劳保用品分类-新建分类-获取品类数据
export function getTreeByParent(code) {
  return request({
    url: `${VUE_APP_BASE_prefix}/dict/common/getTreeByParent/${code}`,
    method: 'get',
  })
}

//劳保用品分类-获取单条数据
export function getLaborDictById(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborDict/getById`,
    method: 'get',
    params
  })
}

//劳保用品分类-删除分类
export function postLaborDictBatchRemove(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborDict/batchRemove`,
    method: 'post',
    data
  })
}

export function laborAccountDetailSave(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborAccountDetail/saveDetail`,
    method: 'post',
    data
  })
}

// 查询劳保用品台账明细列表
export function laborAccountDetailPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborAccountDetail/page`,
    method: 'get',
    params
  })
}
// 查询劳保用品发放规则列表
export function laborGrantRulePage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrantRule/page`,
    method: 'get',
    params
  })
}
// 劳保用品发放规则同步
export function laborGrantRuleSynUser(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrantRule/synUser`,
    method: 'get',
    params
  })
}

export function laborGrantRuleSave(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrantRule/save`,
    method: 'post',
    data
  })
}
//劳保用品发放规则-删除
export function laborGrantRuleDelete(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrantRule/delete`,
    method: 'post',
    data
  })
}

export function laborGrantRulePageLabor(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrantRule/pageLabor`,
    method: 'get',
    params
  })
}


// 查询特批单列表
export function specailPermissionPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/specailPermission/page`,
    method: 'get',
    params
  })
}
//删除特批单
export function specailPermissionUpdateDel(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/specailPermission/updateDel`,
    method: 'post',
    data
  })
}

//保存特批单
export function specailPermissionSavesp(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/specailPermission/savesp`,
    method: 'post',
    data
  })
}
//修改特批单
export function specailPermissionUpdatesp(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/specailPermission/updatesp`,
    method: 'post',
    data
  })
}
//删除特批单明细
export function specailPermissionDetailDeltail(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/specailPermissionDetail/deltail`,
    method: 'post',
    data
  })
}
//提报
export function specailPermissionUpdateStatus(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/specailPermission/updateStatus`,
    method: 'post',
    data
  })
}

export function specailPermissionUpdateAudit(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/specailPermission/updateAudit`,
    method: 'post',
    data
  })
}


//查询特批单号 spType：TP(特批)  LY(领用)
export function getSpCode(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/tSpCode/getSpCode`,
    method: 'get',
    params
  })
}

//特批单明细
export function specailPermissionDetail(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/specailPermissionDetail/page`,
    method: 'get',
    params
  })
}

export function laborCards(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborCard/laborCards`,
    method: 'get',
    params
  })
}

// 查询部门集中发放列表
export function laborGrantPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/page`,
    method: 'get',
    params
  })
}

// 部门劳保卡片-分页
export function laborCardPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborCard/page`,
    method: 'get',
    params
  })
}

// 部门劳保卡片-保存
export function laborCardSave(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborCard/save`,
    method: 'post',
    data
  })
}

// 部门劳保卡片-刪除
export function laborCardBatchRemove(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/laborCard/batchRemove`,
    method: 'post',
    data
  })
}

//发放单-分页
export function getLaborGrantPage(params){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/page`,
    method: 'get',
    params
  })
}

//获取单据号
export function tSpCodeGetSpCode(params){
  return request({
    url: `${VUE_APP_BASE_prefix}/tSpCode/getSpCode`,
    method: 'get',
    params
  })
}

//部门列表-分页(单位)
export function deptListPageForUnit(params){
  return request({
    url: `${VUE_APP_BASE_prefix}/dept/listPageForUnit`,
    method: 'get',
    params
  })
}

//劳保用品卡片劳保信息
export function laborCardLaborCards(params){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborCard/laborGrantCards`,
    method: 'get',
    params
  })
}

//发放单明细-删除
export function laborGrantDetailDelDetail(data){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrantDetail/delDetail`,
    method: 'post',
    data
  })
}

//发放单-保存
export function laborGrantSavaLabor(data){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/savaLabor`,
    method: 'post',
    data
  })
}

//发放单-修改
export function laborGrantUpdateLabor(data){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/updateLabor`,
    method: 'post',
    data
  })
}

//发放单-删除
export function laborGrantUpdateDel(data){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/updateDel`,
    method: 'post',
    data
  })
}

//发放单明细
export function laborGrantDetailPage(params){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrantDetail/page`,
    method: 'get',
    params
  })
}

//发放单-发送
export function laborGrantUpdateStatus(data){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/updateStatus`,
    method: 'post',
    data
  })
}

//发放单-生成
export function laborGrantCreateLabor(data){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/createLabor`,
    method: 'post',
    data
  })
}

//发放单-发放获取用户
export function laborGrantSelectPersionPage(params){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/selectPersionPage`,
    method: 'get',
    params
  })
}

//集中发放单-职工信息
export function laborGrantSelectPersion(params){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/selectPersion`,
    method: 'get',
    params
  })
}

// 集中发放单-分页
export function laborGrantPagequeryDp(params){
  return request({
    url: `${VUE_APP_BASE_prefix}/laborGrant/pagequeryDp`,
    method: 'get',
    params
  })
}
