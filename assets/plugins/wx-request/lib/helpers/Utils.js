/**
 * 合并路径
 * @param {string} baseURL 基础路径
 * @param {string} relativeURL 相对路径
 * @returns {string} 合并后的路径
 */
const combineURLs = (baseURL, relativeURL) => {
	return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

/**
 * 判断是否绝对路径
 * @param {string} url 路径
 * @returns {boolean} 返回真值表示绝对路径，假值表示非绝对路径
 */
const isAbsoluteURL = url => {
	return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export default {
	combineURLs,
	isAbsoluteURL,
}