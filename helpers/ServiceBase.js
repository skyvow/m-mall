import __config from '../etc/config'
import es6 from '../assets/plugins/es6-promise'

class ServiceBase {
    constructor() {
        Object.assign(this, {
            $$basePath: __config.basePath
        })
        this.__init()
    }

    __init() {
        const that = this
        that.suffix = 'Request'
        that.instanceSource = {
            method: [
                'OPTIONS', 
                'GET', 
                'HEAD', 
                'POST', 
                'PUT', 
                'DELETE', 
                'TRACE', 
                'CONNECT',
            ]
        }
        for(let key in that.instanceSource) {   
            that.instanceSource[key].forEach(function(method) {
                that[method.toLowerCase() + that.suffix] = function() {
                    return that.__getPromise(es6.Promise, that.__getResolver(that.__defaultRequest, [method, ...Array.from(arguments)], that))
                }
            })
        }
    }

    __getPromise(Promise, resolver) {
        if(Promise) return new Promise(resolver)
        throw new Error('Promise library is not supported')
    }

    __getResolver(method, args, context) {
        return function(resolve, reject) {
            method.apply(context, args)(resolve, reject)
        }
    }

    __defaultRequest(method = '', url = '', params = {}) {
        const $$header = this.setHeaders()
        const $$url = `${this.$$basePath}${this.$$prefix}${url}`

        return function(resolve, reject) {
            wx.request({
                url: $$url,
                method: method,
                data: params,
                header: $$header,
                success: res => {
                    if (res.statusCode === 401) {
                        wx.removeStorageSync('token')
                    }
                    resolve(res.data)
                },
                fail: res => reject(res),
            })
        }
    }

    setHeaders() {
        return {
        	// 'Accept': 'application/json', 
        	// 'Content-type': 'application/json', 
            'Authorization': 'Bearer ' + wx.getStorageSync('token'), 
        }
    }
}

export default ServiceBase