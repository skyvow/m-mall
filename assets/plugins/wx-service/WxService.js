/**
 * Promise 封装 wx 原生方法
 */
class WxService {
    constructor() {
        this.__init()
    }

    /**
     * __init
     */
    __init() {
        this.__initTools()
        this.__initDefaults()
        this.__initMethods()
    }

    /**
     * 初始化工具方法
     */
    __initTools() {
        this.tools = {
            isArray(value) {
                return Array.isArray(value)
            },
            isObject(value) {
                return value !== null && typeof value === 'object'
            },
            isNumber(value) {
                return typeof value === 'number'
            },
            isDate(value) {
                return Object.prototype.toString.call(value) === '[object Date]'
            },
            isUndefined(value) {
                return typeof value === 'undefined'
            },
            toJson(obj, pretty) {
                if (this.isUndefined(obj)) return undefined
                if (!this.isNumber(pretty)) {
                    pretty = pretty ? 2 : null
                }
                return JSON.stringify(obj, null, pretty)
            },
            serializeValue(value) {
                if (this.isObject(value)) return this.isDate(value) ? value.toISOString() : this.toJson(value)
                return value
            },
            encodeUriQuery(value, pctEncodeSpaces) {
                return encodeURIComponent(value)
                    .replace(/%40/gi, '@')
                    .replace(/%3A/gi, ':')
                    .replace(/%24/g, '$')
                    .replace(/%2C/gi, ',')
                    .replace(/%3B/gi, ';')
                    .replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'))
            },
            paramSerializer(obj) {
                if (!obj) return ''
                let parts = []
                for (let key in obj) {
                    const value = obj[key]
                    if (value === null || this.isUndefined(value)) return
                    if (this.isArray(value)) {
                        value.forEach((v) => {
                            parts.push(this.encodeUriQuery(key) + '=' + this.encodeUriQuery(this.serializeValue(v)))
                        })
                    } else {
                        parts.push(this.encodeUriQuery(key) + '=' + this.encodeUriQuery(this.serializeValue(value)))
                    }
                }
                return parts.join('&')
            },
            buildUrl(url, obj) {
                const serializedParams = this.paramSerializer(obj)
                if (serializedParams.length > 0) {
                    url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams
                }
                return url
            },
        }
    }

    /**
     * __initDefaults
     */
    __initDefaults() {
        // 缓存非异步方法
        this.noPromiseMethods = [
            'stopRecord',
            'pauseVoice',
            'stopVoice',
            'pauseBackgroundAudio',
            'stopBackgroundAudio',
            'showNavigationBarLoading',
            'hideNavigationBarLoading',
            'createAnimation',
            'createContext',
            'hideKeyboard',
            'stopPullDownRefresh',
        ]

        // 缓存 wx 接口方法名
        this.instanceSource = {
            method: Object.keys(wx)
        }
    }

    /**
     * 遍历 wx 方法对象，判断是否为异步方法，是则构造 Promise
     */
    __initMethods() {
        for (let key in this.instanceSource) {
            this.instanceSource[key].forEach((method, index) => {
                this[method] = (...args) => {
                    // 判断是否为非异步方法或以 wx.on 开头，或以 Sync 结尾的方法
                    if (this.noPromiseMethods.indexOf(method) !== -1 || method.substr(0, 2) === 'on' || /\w+Sync$/.test(method)) {
                        return wx[method](...args)
                    }
                    return this.__defaultRequest(method, ...args)
                }
            })
        }

        const navigate = [
            'navigateTo',
            'redirectTo',
            'switchTab',
            // 'navigateBack', 
            'reLaunch',
        ]

        /**
         * 重写导航 API
         * @param {String} url  路径
         * @param {Object} params 参数
         */
        navigate.forEach((method, index) => {
            this[method] = (url, params) => {
                const obj = {
                    url,
                }
                if (method !== 'switchTab') {
                    obj.url = this.tools.buildUrl(url, params)
                }
                return this.__defaultRequest(method, obj)
            }
        })

        /**
         * 关闭当前页面，返回上一页面或多级页面
         * @param {Number} delta  返回的页面数，如果 delta 大于现有页面数，则返回到首页
         */
        this.navigateBack = (delta = 1) => {
            return wx.navigateBack({
                delta,
            })
        }
    }

    /**
     * 以 wx 下 API 作为底层方法
     * @param {String} method 方法名
     * @param {Object} obj    接收参数
     */
    __defaultRequest(method = '', obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = (res) => resolve(res)
            obj.fail = (res) => reject(res)
            wx[method](obj)
        })
    }
}

export default WxService