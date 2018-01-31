import __config from '/etc/config.js'

class HttpResource {
  /**
	 * 设置请求路径
	 */
  setUrl(url) {
    return `${__config.basePath}${url}`
  }
}