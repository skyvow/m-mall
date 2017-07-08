export default {
    isArray(value) {
        return Array.isArray(value)
    },
    isFunction(value) {
        return typeof value === 'function'
    },
    isDefined(value) {
        return typeof value !== 'undefined'
    },
    isObject(value) {
        return value !== null && typeof value === 'object'
    },
    each(obj, iterator) {
        let i, key
        if (obj && typeof obj.length === 'number') {
            for (i = 0; i < obj.length; i++) {
                iterator.call(obj[i], obj[i], i)
            }
        } else if (this.isObject(obj)) {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(obj[key], obj[key], key)
                }
            }
        }
        return obj
    },
    encodeUriSegment(val) {
        return this.encodeUriQuery(val, true).
        replace(/%26/gi, '&').
        replace(/%3D/gi, '=').
        replace(/%2B/gi, '+')
    },
    encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).
        replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'))
    },
}