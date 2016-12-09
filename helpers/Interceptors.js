export default [{
	request: function(request) {
		request.header = request.header || {}
		request.requestTimestamp = new Date().getTime()
		if (request.url.indexOf('/api') !== -1 && wx.getStorageSync('token')) {
            request.header.Authorization = 'Bearer ' + wx.getStorageSync('token')
        }
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000
		})
		return request
	},
	requestError: function(requestError) {
		wx.hideToast()
		return requestError
	},
	response: function(response) {
		response.responseTimestamp = new Date().getTime()
		if(response.statusCode === 401) {
			wx.removeStorageSync('token')
		}
		wx.hideToast()
		return response
	},
	responseError: function(responseError) {
		wx.hideToast()
		return responseError
	},
}]