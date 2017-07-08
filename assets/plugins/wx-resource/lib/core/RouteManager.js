import Utils from '../helpers/Utils'

/**
 * 注册路由
 * 
 * @param {String} template url 路径
 * @param {Object} defaults 参数对象
 * 
 */
class RouteManager {
    constructor(template = '', defaults = {}) {
        Object.assign(this, {
            template,
            defaults,
        })
        this.__init()
    }

    __init() {
        this.urlParams = {}
    }

    setUrlParams(config, params, actionUrl) {
        const PROTOCOL_AND_DOMAIN_REGEX = /^https?:\/\/[^\/]*/
        let url = actionUrl || this.template,
            val, encodedVal,
            protocolAndDomain = '',
            urlParams = this.urlParams

        Utils.each(url.split(/\W/), (param, key) => {
            if (param === 'hasOwnProperty') {
                throw `hasOwnProperty is not a valid parameter name.`
            }
            if (!(new RegExp('^\\d+$').test(param)) && param && (new RegExp('(^|[^\\\\]):' + param + '(\\W|$)').test(url))) {
                urlParams[param] = {
                    isQueryParamValue: (new RegExp('\\?.*=:' + param + '(?:\\W|$)')).test(url)
                }
            }
        })

        url = url.replace(/\\:/g, ':')
        url = url.replace(PROTOCOL_AND_DOMAIN_REGEX, function(match) {
            protocolAndDomain = match
            return ''
        })

        params = params || {}

        Utils.each(this.urlParams, (paramInfo, urlParam) => {
            val = params.hasOwnProperty(urlParam) ? params[urlParam] : this.defaults[urlParam]
            if (Utils.isDefined(val) && val !== null) {
                if (paramInfo.isQueryParamValue) {
                    encodedVal = Utils.encodeUriQuery(val, true)
                } else {
                    encodedVal = Utils.encodeUriSegment(val)
                }
                url = url.replace(new RegExp(':' + urlParam + '(\\W|$)', 'g'), function(match, p1) {
                    return encodedVal + p1
                })
            } else {
                url = url.replace(new RegExp('(/?):' + urlParam + '(\\W|$)', 'g'), function(match, leadingSlashes, tail) {
                    if (tail.charAt(0) === '/') {
                        return tail
                    } else {
                        return leadingSlashes + tail
                    }
                })
            }
        })

        // strip trailing slashes and set the url (unless this behavior is specifically disabled)
        if (this.defaults.stripTrailingSlashes) {
            url = url.replace(/\/+$/, '') || '/'
        }

        // then replace collapse `/.` if found in the last URL path segment before the query
        // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
        url = url.replace(/\/\.(?=\w+($|\?))/, '.')

        // replace escaped `/\.` with `/.`
        config.url = protocolAndDomain + url.replace(/\/\\\./, '/.')

        // set params - delegate param encoding to $http
        Utils.each(params, (value, key) => {
            if (!this.urlParams[key]) {
                config.data = config.data || {}
                config.data[key] = value
            }
        })
    }
}

export default RouteManager