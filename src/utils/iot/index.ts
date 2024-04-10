import { parseTime } from '@/utils/iot/ruoyi'

/**
 * 表格时间格式化
 */
export const formatDate = (cellValue: string) => {
  if (cellValue == null || cellValue == '') return ''
  const date = new Date(cellValue)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export const formatTime = (time: string, option: string) => {
  let t: number
  if (('' + time).length === 10) {
    t = parseInt(time) * 1000
  } else {
    t = +time
  }
  const d: any = new Date(t)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(t, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export const getQueryObject = (url: string) => {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj: { [key: string]: string } = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export const byteLength = (str: string) => {
  // returns the byte length of an utf8 string
  let s = str.length
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xdc00 && code <= 0xdfff) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export const cleanArray = (actual: Array<any>) => {
  const newArray: any[] = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export const param = (json: any) => {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export const param2Obj = (url: string) => {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj: any = {}
  const searchArr = search.split('&')
  searchArr.forEach((v) => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export const html2Text = (val: string) => {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export const objectMerge = (target: any, source: any | any[]) => {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export const toggleClass = (element: HTMLElement, className: string) => {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substring(0, nameIndex) + classString.substring(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export const getTime = (type: string) => {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
/*export const debounce = (func: any, wait: number, immediate: boolean) => {
  let timeout: any, args: any, context: any, timestamp: any, result: any

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return (...args: any) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}*/

/**
 * 这只是深度复制的一个简单版本
 * 有很多边缘情况的bug
 * 如果你想使用一个完美的深度拷贝，使用lodash的_.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export const deepClone = (source: any) => {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone' as any)
  }
  const targetObj: any = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export const uniqueArr = (arr: any) => {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export const createUniqueString = (): string => {
  const timestamp = +new Date() + ''
  const num = (1 + Math.random()) * 65536
  const randomNum = parseInt(num + '')
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * 检查一个元素是否有一个类
 * @param ele
 * @param {string} cls
 * @returns {boolean}
 */
export const hasClass = (ele: HTMLElement, cls: string): boolean => {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param ele
 * @param {string} cls
 */
export const addClass = (ele: HTMLElement, cls: string) => {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 从元素中移除类
 * @param ele
 * @param {string} cls
 */
export const removeClass = (ele: HTMLElement, cls: string) => {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = (path: string) => {
  return /^(https?:|http?:|mailto:|tel:)/.test(path)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

/**
 * 生成随机字符串
 */
export const toAnyString = () => {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

export const generateUUID = () => {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
      const callback = (c: any) => {
        const num = Number(c)
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16)
      }
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback)
    }
  }
  let timestamp = new Date().getTime()
  let performanceNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0
      timestamp = Math.floor(timestamp / 16)
    } else {
      random = (performanceNow + random) % 16 | 0
      performanceNow = Math.floor(performanceNow / 16)
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

/**
 * element plus 的文件大小
 *
 * @param cellValue 字段值
 */
export const fileSizeFormatter = (cellValue: string) => {
  const fileSize = cellValue
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const srcSize = parseFloat(fileSize)
  const index = Math.floor(Math.log(srcSize) / Math.log(1024))
  const size = srcSize / Math.pow(1024, index)
  const sizeStr = size.toFixed(2) //保留的小数位数
  return sizeStr + ' ' + unitArr[index]
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

/**
 * 将值复制到目标对象，且以目标对象属性为准，例：target: {a:1} source:{a:2,b:3} 结果为：{a:2}
 * @param target 目标对象
 * @param source 源对象
 */
export const copyValueToTarget = (target: any, source: any) => {
  const newObj = Object.assign({}, target, source)
  // 删除多余属性
  Object.keys(newObj).forEach((key) => {
    // 如果不是target中的属性则删除
    if (Object.keys(target).indexOf(key) === -1) {
      delete newObj[key]
    }
  })
  // 更新目标对象值
  Object.assign(target, newObj)
}
