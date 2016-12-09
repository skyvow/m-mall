import Tools from 'Tools'
import es6 from '../assets/plugins/es6-promise'

class Service {
    constructor() {
        this.__init()
    }

    __init() {
    	const that = this
    	that.tools = new Tools
        that.noPromiseMethods = [
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
		that.instanceSource = {
            method: Object.keys(wx)
        }
        for(let key in that.instanceSource) { 
			that.instanceSource[key].forEach(function(method) {
				that[method] = function() {
					if (that.noPromiseMethods.indexOf(method) !== -1 || method.substr(0, 2) === 'on' || /\w+Sync$/.test(method)) {
						return wx[method](...Array.from(arguments))
					}
	                return that.__getPromise(es6.Promise, that.__getResolver(that.__defaultRequest, [method, ...Array.from(arguments)], that))
	            }
			})
		}

		that.navigateTo = (url, params) => {
	        const $$url = that.tools.buildUrl(url, params)
	    	return new es6.Promise((resolve, reject) => {
	    		wx.navigateTo({
	    			url: $$url,
					success: res => resolve(res),
		            fail: res => reject(res),
				})
	    	})
	    }

	    that.redirectTo = (url, params) => {
	        const $$url = that.tools.buildUrl(url, params)
	    	return new es6.Promise((resolve, reject) => {
	    		wx.redirectTo({
	    			url: $$url,
					success: res => resolve(res),
		            fail: res => reject(res),
				})
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

    __defaultRequest(method = '', obj = {}) {
    	return function(resolve, reject) {
    		obj.success = (res) => resolve(res)
    		obj.fail = (res) => reject(res)
    		wx[method](obj)
    	}
    }
}

export default Service