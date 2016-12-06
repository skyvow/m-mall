import __config from '../etc/config'
import WxResource from 'WxResource'

class HttpResource {
    constructor(url, paramDefaults, actions, options) {
        Object.assign(this, {
        	url, 
    		paramDefaults, 
    		actions, 
    		options,
            $$basePath: __config.basePath
        })

        return new WxResource(this.setUrl(this.url), this.paramDefaults, this.setActions())
    }

    setHeaders() {
        return {
        	// 'Accept': 'application/json', 
        	// 'Content-type': 'application/json', 
            'Authorization': 'Bearer ' + wx.getStorageSync('token'), 
        }
    }

    setActions(actions = {}) {
    	actions = {
    		get: { 
	        	method:'GET', 
	        	header: this.setHeaders()
	        },
	        save: { 
	        	method:'POST', 
	        	header: this.setHeaders()
	        },
	        query: { 
	        	method:'GET', 
	        	header: this.setHeaders()
	        },
	        remove: { 
	        	method:'DELETE', 
	        	header: this.setHeaders()
	        },
    		delete: { 
	        	method:'DELETE', 
	        	header: this.setHeaders()
	        },
	        update: { 
	        	method:'PUT', 
	        	header: this.setHeaders()
	        }
    	}
    	return actions
    }

    setUrl(url) {
    	return `${this.$$basePath}${url}`
    }
}

export default HttpResource