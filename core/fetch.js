import { DM, API_VERSION } from '../libs/config.js'
import Apis from './apis/index.js'

// default
const defaultHeader = {
  'content-type': 'application/json'
}

const defaultBody = {
  protocol: API_VERSION
}

// apis
export const apis = Apis

// fetch
export default function fetch({
  url = '',
  method = 'GET',
  data = {},
  header = {},
  succ = noop,
  fail = noop,
  done = noop
} = {}) {
  const reqTask = wx.request({
    url: `${DM.domain}${url}`,
    data: {
      ...defaultBody,
      ...data
    },
    header: {
      ...defaultHeader,
      ...header
    },
    method,
    success(response) {
      const res = response.data
      // rules
      if (res.resultStatus.code === 1000) {
        succ(res)
      } else {
        succ(null)
      }
    },
    fail(err) {
      isNetworkError((retry) => {
        fail(err) // 网络问题, 重试(暂无重试机制)
      }, () => {
        fail(err)
      })
    },
    complete: done
  })

  return reqTask
}

/**
 * 检查网络
 * */
function isNetworkError(resolve = noop, reject = noop) {
  wx.getNetworkType({
    success(res) {
      if (res.networkType === 'none') {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '网络中断，建议检查网络连接',
          confirmText: '稍后重试',
          showCancel: false,
          success(res) {
            resolve(res.confirm)
          }
        })
      } else {
        reject()
      }
    }
  })
}

function noop () {}
