import request from '@/utils/request'
import { MessageBox } from 'element-ui'

const createAelement = (result, blobObj) => {
  let idName = 'createA'
  let targetA = document.createElement('a')
  let hrefObj = window.URL.createObjectURL(blobObj)
  targetA.setAttribute('download', result.name)
  targetA.setAttribute('href', hrefObj)
  targetA.setAttribute('id', idName)
  document.body.appendChild(targetA)
  targetA.click()
  document.body.removeChild(targetA)
  window.URL.revokeObjectURL(hrefObj)
}

export function axiosDownloadExcel(downloadPath, params = {}) {
  return request({
    url: downloadPath,
    method: 'GET',
    params,
    responseType: 'blob'
  }).then((result) => {
    let fileName
    if (!result.headers['content-disposition']) {
      fileName = result.headers['FILENAME'];
      if(!fileName){
        fileName = '未知文件名.xlsx'
      }
    } else {
      fileName = decodeURIComponent(result.headers['content-disposition'].split('attachment; filename=')[1])
    }
    let fileRead = new FileReader()
    result.name = fileName
    fileRead.addEventListener('load', () => {
      try {
        let resData = JSON.parse(result.data)
      } catch (err) {
        let blobObj = new Blob([result.data], {
          type: result.data.type
        })
        if (window.navigator.msSaveOrOpenBlob) {    // 兼容ie11
          try {
            window.navigator.msSaveOrOpenBlob(blobObj, result.name)
          } catch (newerr) {
            console.log(newerr)
          }

        } else {
          createAelement({ ...result, href: downloadPath }, blobObj)
        }

      }

    })
    fileRead.readAsText(result.data)
  }).catch(error => {
    console.log(error)
    MessageBox.confirm('下载失败！', '提示', {
      showConfirmButton: true,
      showCancelButton: false,
      type: 'warning'
    })
  })
}
