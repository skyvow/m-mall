import InterceptorManager from './InterceptorManager'
import RouteManager from './RouteManager'

/**
 * Promise 封装 wx.request 请求方法
 * 
 * @param {String} url 设置一个含有参数的 URL 模板
 * @param {Object} paramDefaults 设置 URL 参数的默认值
 * @param {Object} actions 设置资源方法
 * @param {Object} options 设置默认参数
 * 
 */
class WxResource {
    constructor(url = '', paramDefaults = {}, actions = {}, options = {}) {
        Object.assign(this, {
            url,
            paramDefaults,
            actions,
            options,
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
        this.defaults = {
            // URL 是否以‘/‘结尾
            stripTrailingSlashes: true,

            // 方法名后缀字符串
            suffix: 'Async',

            // 默认方法
            actions: {
                'get': { method: 'GET' },
                'save': { method: 'POST' },
                'update': { method: 'PUT' },
                'query': { method: 'GET' },
                'remove': { method: 'DELETE' },
                'delete': { method: 'DELETE' },
            }
        }
    }

    /**
     * __initRoute         
     */
    __initRoute(template, defaults) {
        return new RouteManager(template, Object.assign({}, this.defaults, defaults))
    }

    /**
     * 遍历对象构造方法，方法名以小写字母+后缀名
     */
    __initMethods() {
        const route = this.__initRoute(this.url, this.options)
        const actions = Object.assign({}, this.defaults.actions, this.actions)

        for (let name in actions) {
            this[name + route.defaults.suffix] = (...args) => {
                const httpConfig = this.__setHttpConfig(route, actions[name], ...args)
                return this.__defaultRequest(httpConfig)
            }
        }
    }

    /**
     * 设置 httpConfig
     * 
     * @param {object} route 路由对象
     * @param {string} action 请求方法
     * @param {arrary} args 参数数组 [params, data]
     */
    __setHttpConfig(route, action, ...args) {
        const MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/

        // 判断是否为有效的路径
        const isValidDottedPath = (path) => {
            return (path != null && path !== '' && path !== 'hasOwnProperty' && MEMBER_NAME_REGEX.test('.' + path))
        }

        // 查找路径
        const lookupDottedPath = (obj, path) => {
            if (!isValidDottedPath(path)) {
                throw `badmember, Dotted member path ${path} is invalid.`
            }
            let keys = path.split('.')
            for (let i = 0, ii = keys.length; i < ii && typeof obj !== 'undefined'; i++) {
                let key = keys[i]
                obj = (obj !== null) ? obj[key] : undefined
            }
            return obj
        }

        // 提取参数
        const extractParams = (data, actionParams) => {
            let ids = {}
            actionParams = Object.assign({}, this.paramDefaults, actionParams)
            for (let key in actionParams) {
                let value = actionParams[key]
                if (typeof value === 'function') {
                    value = value(data)
                }
                ids[key] = value && value.charAt && value.charAt(0) === '@' ? lookupDottedPath(data, value.substr(1)) : value
            }
            return ids
        }

        let params = {},
            data = {},
            httpConfig = {},
            hasBody = /^(POST|PUT|PATCH)$/i.test(action.method)

        // 判断参数个数
        switch (args.length) {
            case 2:
                params = args[0]
                data = args[1]
                break
            case 1:
                if (hasBody) data = args[0]
                else params = args[0]
                break
            case 0:
                break
            default:
                throw `Expected up to 2 arguments [params, data], got ${args.length} arguments`
        }

        // 设置 httpConfig
        for (let key in action) {
            switch (key) {
                case 'params':
                case 'isArray':
                case 'interceptor':
                case 'cancellable':
                    break
                default:
                    httpConfig[key] = action[key]
                    break
            }
        }

        // 判断是否为 (POST|PUT|PATCH) 请求，设置请求 data
        if (hasBody) {
            httpConfig.data = data
        }

        // 解析 URL
        route.setUrlParams(httpConfig, Object.assign({}, extractParams(data, action.params || {}), params), action.url)

        return httpConfig
    }

    /**
     * 以 wx.request 作为底层方法
     * @param {Object} httpConfig 请求参数配置
     */
    __defaultRequest(httpConfig) {
        // 注入拦截器
        const chainInterceptors = (promise, interceptors) => {
            for (let i = 0, ii = interceptors.length; i < ii;) {
                let thenFn = interceptors[i++]
                let rejectFn = interceptors[i++]
                promise = promise.then(thenFn, rejectFn)
            }
            return promise
        }

        let requestInterceptors = []
        let responseInterceptors = []
        let promise = Promise.resolve(httpConfig)

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
        promise = promise.then(this.__http)

        // 注入响应拦截器
        promise = chainInterceptors(promise, responseInterceptors)

        // 接口调用成功，res = {data: '开发者服务器返回的内容'}
        promise = promise.then(res => res, err => err)

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

export default WxResource