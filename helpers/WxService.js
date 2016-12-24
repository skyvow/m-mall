import Tools from 'Tools'
import es6 from '../assets/plugins/es6-promise'

class Service {
    constructor() {
        this.__init()
    }

    /**
     * __init
     */
    __init() {
    	this.tools = new Tools
    	this.__initDefaults()
    	this.__initMethods()
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

		// 缓存wx接口方法名
		this.instanceSource = {
            method: Object.keys(wx)
        }
    }

    /**
     * 遍历wx方法对象，判断是否为异步方法，是则构造promise
     */
    __initMethods() {
        for(let key in this.instanceSource) { 
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

		/**
		 * 保留当前页面，跳转到应用内的某个页面
		 * @param {String} url  路径
		 * @param {Object} params 参数
		 */
		this.navigateTo = (url, params) => {
	        const $$url = this.tools.buildUrl(url, params)
	    	return new es6.Promise((resolve, reject) => {
	    		wx.navigateTo({
	    			url: $$url,
					success: res => resolve(res),
		            fail: res => reject(res),
				})
	    	})
	    }

	    /**
		 * 关闭当前页面，跳转到应用内的某个页面
		 * @param {String} url  路径
		 * @param {Object} params 参数
		 */
	    this.redirectTo = (url, params) => {
	        const $$url = this.tools.buildUrl(url, params)
	    	return new es6.Promise((resolve, reject) => {
	    		wx.redirectTo({
	    			url: $$url,
					success: res => resolve(res),
		            fail: res => reject(res),
				})
	    	})
	    }
    }

    /**
     * 以wx下API作为底层方法
     * @param {String} method 方法名
     * @param {Object} obj    接收参数
     */
    __defaultRequest(method = '', obj = {}) {
    	return new es6.Promise((resolve, reject) => {
    		obj.success = (res) => resolve(res)
    		obj.fail = (res) => reject(res)
    		wx[method](obj)
    	})
    }
}

export default Service