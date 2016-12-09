import __config from '../etc/config'
import WxResource from 'WxResource'
import Interceptors from 'Interceptors'

class HttpResource {
    constructor(url, paramDefaults, actions, options) {
        Object.assign(this, {
        	url, 
    		paramDefaults, 
    		actions, 
    		options,
            $$basePath: __config.basePath
        })
        const resource = new WxResource(this.setUrl(this.url), this.paramDefaults, this.actions || {}, this.options || {})
        resource.setDefaults({
            interceptors: Interceptors
        })
        return resource
    }

    setUrl(url) {
    	return `${this.$$basePath}${url}`
    }
}

export default HttpResource