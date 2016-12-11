/**
 * 创建验证字段的工厂函数
 * 
 * @param {Object} scope 字段所在作用域
 * @param {Object} rules 验证字段的规则
 * 
 */
class WxValidate {
	constructor(scope, rules = {}) {
		Object.assign(this, {
			scope, 
			rules, 
		})
		this.__init()
	}

	/**
	 * __init
	 */
	__init() {
		this.__initMethods()
		this.__initMessages()
		this.__initErrorList()
	}

	/**
	 * 初始化错误信息
	 */
	__initErrorList() {
		this.errorList = []
	}

	/**
	 * 初始化默认提示消息
	 */
	__initMessages() {
		this.messages = {
			required: '必须输入的字段。',
			email: '必须输入正确格式的电子邮件。',
			tel: '必须输入11位的手机号码。',
			url: '必须输入正确格式的网址。',
			date: '必须输入正确格式的日期。',
			dateISO: '必须输入正确格式的日期（ISO），例如：2009-06-23，1998/01/22。',
			number: '必须输入合法的数字。',
			digits: '必须输入整数。',
			idcard: '必须输入18位的有效身份证。',
			equalTo: this.formatTpl('输入值必须和 {0} 相同。'),
			contains: this.formatTpl('输入值必须包含 {0}。'),
			minlength: this.formatTpl('输入长度最少是 {0} 的字符串。'),
			maxlength: this.formatTpl('输入长度最多是 {0} 的字符串。'),
			rangelength: this.formatTpl('输入长度必须介于 {0} 和 {1} 之间的字符串。'),
			min: this.formatTpl('输入值不能小于 {0}。'),
			max: this.formatTpl('输入值不能大于 {0}。'),
			range: this.formatTpl('输入值必须介于 {0} 和 {1} 之间。'),
		}
	}

	/**
	 * 初始化默认提示方法
	 */
	__initMethods() {
		const that = this
		that.methods = {
			required(value, param) {
				if (!that.depend(param)) {
					return 'dependency-mismatch'
				}
				return value.length > 0
			},
			email(value) {
				return that.optional(value) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
			},
			tel(value) {
				return that.optional(value) || /^1[34578]\d{9}$/.test(value)
			},
			url(value) {
				return that.optional(value) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
			},
			date(value) {
				return that.optional(value) || !/Invalid|NaN/.test(new Date(value).toString())
			},
			dateISO(value) {
				return that.optional(value) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
			},
			number(value) {
				return that.optional(value) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
			},
			digits(value) {
				return that.optional(value) || /^\d+$/.test(value)
			},
			idcard(value) {
				return that.optional(value) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
			},
			equalTo(value, param) {
				return that.optional(value) || value === param
			},
			contains(value, param) {
				return that.optional(value) || value.indexOf(param) >= 0
			},
			minlength(value, param) {
				return that.optional(value) || value.length >= param
			},
			maxlength(value, param) {
				return that.optional(value) || value.length <= param
			},
			min(value, param) {
				return that.optional(value) || value >= param
			},
			max(value, param) {
				return that.optional(value) || value <= param
			},
			rangelength(value, param) {
				return that.optional(value) || (value.length >= param[0] && value.length <= param[1])
			},
			range(value, param) {
				return that.optional(value) || (value >= param[0] && value <= param[1])
			},
		}
	}

	/**
	 * 添加自定义提示方法
	 */
	addMethod(name, method, message) {
		this.methods[name] = method
		this.messages[name] = message !== undefined ? message : this.messages[name]
	}

	/**
	 * 判断提示方法是否存在
	 */
	isValidMethod(value) {
		let methods = []
		for(let method in this.methods) {
			if (method && typeof this.methods[method] === 'function') {
				methods.push(method)
			}
		}
		return methods.indexOf(value) !== -1
	}

	/**
	 * 格式化提示消息模板
	 */
	formatTpl(source, params) {
		const that = this
		if ( arguments.length === 1 ) {
			return function() {
				let args = Array.from( arguments )
				args.unshift( source )
				return that.formatTpl.apply( this, args )
			}
		}
		if ( params === undefined ) {
			return source
		}
		if ( arguments.length > 2 && params.constructor !== Array  ) {
			params = Array.from( arguments ).slice( 1 )
		}
		if ( params.constructor !== Array ) {
			params = [ params ]
		}
		params.forEach(function( n, i ) {
			source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
				return n
			} )
		} )
		return source
	}

	/**
	 * 判断规则依赖是否存在
	 */
	depend(param) {
		const type = typeof param
		if (type === 'boolean') {
			return param
		} else if (type === 'string') {
			return !!param.length
		} else if (type === 'function') {
			return param()
		} else {
			return !0
		}
	}

	/**
	 * 判断输入值是否为空
	 */
	optional(value) {
		return !this.methods.required(value) && 'dependency-mismatch'
	}

	/**
	 * 获取某个指定提示的消息
	 */
	defaultMessage(rule) {
		let message = this.messages[rule.method]
		let type = typeof message

		if (type === 'undefined') {
			message = `Warning: No message defined for ${rule.method}.`
		} else if (type === 'function') {
			message = message.call(this, rule.parameters)
		} else if (type === 'string' && typeof rule.parameters === 'string') {
			message = rule.parameters
		}

		return message
	}

	/**
	 * 缓存错误信息
	 */
	formatTplAndAdd(param, rule, value) {
		let msg = this.defaultMessage(rule)

		this.errorList.push({
			param: param, 
			msg: msg, 
			value: value, 
		})
	}

	/**
	 * 获取验证字段的值
	 */
	getObjectByPath(data, path) {
		let obj = data
		let paths = path.split('.')
		paths.forEach((n, i) => {
			obj = obj[n]
		})
		return obj
	}

	/**
	 * 验证某个指定字段的规则
	 */
	checkParam(param, rules) {
		const data = this.scope.data
		const value = rules.value = this.getObjectByPath(data, param) ? this.getObjectByPath(data, param) : ''

		// 遍历某个指定字段的所有规则，依次验证规则，否则缓存错误信息
		for(let method in rules) {
			if (this.isValidMethod(method)) {

				// 缓存规则的属性及值
				const rule = { 
					method: method, 
					parameters: rules[method] 
				}

				// 调用规则方法
				const result = this.methods[method](value, rule.parameters)
				
				// 若result返回值为dependency-mismatch，则说明该字段的值为空或非必填字段
				if (result === 'dependency-mismatch') {
					continue
				}

				// 判断是否通过验证，否则缓存错误信息，跳出循环
				if (!result) {
					this.formatTplAndAdd(param, rule, value)
					break
				}
			}
		}
	}

	/**
	 * 验证所有字段的规则，返回验证是否通过
	 */
	checkForm() {
		this.errorList = []

		for (let param in this.rules) {
			this.checkParam(param, this.rules[param])
		}

		return this.valid()
	}

	/**
	 * 返回验证是否通过
	 */
	valid() {
		return this.size() === 0
	}

	/**
	 * 返回错误信息的个数
	 */
	size() {
		return this.errorList.length
	}

	/**
	 * 返回所有错误信息
	 */
	validationErrors() {
		return this.errorList
	}
}

export default WxValidate