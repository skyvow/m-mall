import InterceptorManager from './InterceptorManager'
import Utils from './../helpers/Utils'

/**
 * Promise 封装 wx.request 请求方法
 * 
 * @param {Object} defaults 配置项
 * @param {String} defaults.suffix 方法名后缀字符串，默认值 Request
 * @param {String} defaults.baseURL 基础请求路径
 * @param {Object} defaults.header 请求头
 * @param {Array} defaults.transformRequest 转换请求数据
 * @param {Array} defaults.transformResponse 转换响应数据
 * @param {Function} defaults.validateStatus 基于响应状态返回成功或失败
 * 
 */
class WxRequest {
    constructor(defaults) {
        Object.assign(this, {
            defaults,
        })
        this.__init()
    }

    /**
     * 初始化
     */
    __init() {
        this.__initInterceptor()
        this.__initDefaults()
        this.__initMethods()
    }

    /**
     * 初始化默认拦截器
     */
    __initInterceptor() {
        this.interceptors = new InterceptorManager
        this.interceptors.use({
            request(request) {
                request.requestTimestamp = new Date().getTime()
                return request
            },
            requestError(requestError) {
                return Promise.reject(requestError)
            },
            response(response) {
                response.responseTimestamp = new Date().getTime()
                return response
            },
            responseError(responseError) {
                return Promise.reject(responseError)
            },
        })
    }

    /**
     * 初始化默认参数
     */
    __initDefaults() {
        const defaults = {
            // 方法名后缀字符串，默认值 Request
            suffix: 'Request',
            // 基础请求路径
            baseURL: '',
            // 请求头
            header: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // 转换请求数据
            transformRequest: [
                (data, header) => {
                    return data
                },
            ],
            // 转换响应数据
            transformResponse: [
                (data, header) => {
                    if (typeof data === 'string') {
                        try {
                            data = JSON.parse(data)
                        } catch (e) { /* Ignore */ }
                    }
                    return data
                },
            ],
            // 基于响应状态返回成功或失败
            validateStatus: status => status >= 200 && status < 300,
        }

        // 合并参数
        this.defaults = Object.assign({}, defaults, this.defaults)
    }

    /**
     * 遍历对象构造方法，方法名以小写字母+后缀名
     */
    __initMethods() {
        // 方法名后缀字符串
        const suffix = this.defaults.suffix

        // 发起请求所支持的方法
        const instanceSource = {
            method: [
                'OPTIONS',
                'GET',
                'HEAD',
                'POST',
                'PUT',
                'DELETE',
                'TRACE',
                'CONNECT',
            ],
        }

        // 遍历对象构造方法
        for (let key in instanceSource) {
            instanceSource[key].forEach((method, index) => {
                this[method.toLowerCase() + suffix] = (url, config) => {
                    return this.__defaultRequest(Object.assign({}, config, {
                        method,
                        url,
                    }))
                }
            })
        }

        // request - 基础请求方法
        this.request = (...args) => this.__defaultRequest(...args)

        // Promise.all - 合并处理请求
        this.all = promises => Promise.all(promises)
    }

    /**
     * 以 wx.request 作为底层方法
     * @param {Object|String} config 配置项|接口地址
     * @param {String} config.method 请求方法
     * @param {String} config.url    接口地址
     * @param {Object} config.data 请求参数
     * @param {Object} config.header 设置请求的 header
     * @param {String} config.dataType 请求的数据类型
     */
    __defaultRequest(config) {

        // 判断参数类型，如果第一个参数为字符串则赋值于 url，第二个参数为 config 配置
        if (typeof config === 'string') {
            config = Object.assign({}, {
                url: arguments[1]
            }, arguments[2])
        }

        // 合并参数
        const defaults = Object.assign({
            method: 'GET',
            dataType: 'json',
        }, this.defaults, config)

        const { baseURL, header, validateStatus } = defaults

        // 配置请求参数
        const $$config = {
            url: defaults.url,
            data: defaults.data,
            header: defaults.header,
            method: defaults.method,
            dataType: defaults.dataType,
        }

        // 配置请求路径 prefix
        if (this.$$prefix && !Utils.isAbsoluteURL($$config.url)) {
            $$config.url = Utils.combineURLs(this.$$prefix, $$config.url)
        }

        // 配置请求路径 baseURL
        if (baseURL && !Utils.isAbsoluteURL($$config.url)) {
            $$config.url = Utils.combineURLs(baseURL, $$config.url)
        }

        // 注入拦截器
        const chainInterceptors = (promise, interceptors) => {
            for (let i = 0, ii = interceptors.length; i < ii;) {
                let thenFn = interceptors[i++]
                let rejectFn = interceptors[i++]
                promise = promise.then(thenFn, rejectFn)
            }
            return promise
        }

        // 转换数据
        const transformData = (data, header, status, fns) => {
            fns.forEach(fn => {
                data = fn(data, header, status)
            })
            return data
        }

        // 转换响应数据
        const transformResponse = res => {
            const __res = Object.assign({}, res, {
                data: transformData(res.data, res.header, res.statusCode, defaults.transformResponse),
            })
            return validateStatus(res.statusCode) ? __res : Promise.reject(__res)
        }

        // 发起HTTPS请求
        const serverRequest = config => {
            const __config = Object.assign({}, config, {
                data: transformData($$config.data, $$config.header, undefined, defaults.transformRequest),
            })
            return this.__http(__config).then(transformResponse, transformResponse)
        }

        let requestInterceptors = []
        let responseInterceptors = []
        let promise = Promise.resolve($$config)

        // 缓存拦截器
        this.interceptors.forEach(n => {
            if (n.request || n.requestError) {
                requestInterceptors.push(n.request, n.requestError)
            }
            if (n.response || n.responseError) {
                responseInterceptors.unshift(n.response, n.responseError)
            }
        })

        // 注入请求拦截器
        promise = chainInterceptors(promise, requestInterceptors)

        // 发起HTTPS请求
        promise = promise.then(serverRequest)

        // 注入响应拦截器
        promise = chainInterceptors(promise, responseInterceptors)

        return promise
    }

    /**
     * __http - wx.request
     */
    __http(obj) {
        return new Promise((resolve, reject) => {
            obj.success = (res) => resolve(res)
            obj.fail = (res) => reject(res)
            wx.request(obj)
        })
    }
}

export default WxRequest