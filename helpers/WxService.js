import tools from 'tools'
import es6 from '../assets/plugins/es6-promise'

const Promise = es6.Promise

class Service {
    constructor() {
        this.__init()
    }

    __init() {
        this.wx = wx
        this.tools = new tools
    }

    request(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.request({
    			url: params.url,
    			data: params.data,
    			header: params.header,
    			method: params.method,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    uploadFile(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.uploadFile({
    			url: params.url,
    			filePath: params.filePath,
    			name: params.name,
    			header: params.header,
    			formData: params.formData,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    downloadFile(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.downloadFile({
    			url: params.url,
    			header: params.header,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    connectSocket(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.connectSocket({
    			url: params.url,
    			data: params.data,
    			header: params.header,
    			method: params.method,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    onSocketOpen() {
    	return new Promise((resolve, reject) => {
    		this.wx.onSocketOpen(res => resolve(res))
    	})
    }

    onSocketError() {
    	return new Promise((resolve, reject) => {
    		this.wx.onSocketError(res => resolve(res))
    	})
    }

    sendSocketMessage(data) {
    	return new Promise((resolve, reject) => {
    		this.wx.sendSocketMessage({
    			data: data,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    onSocketMessage() {
    	return new Promise((resolve, reject) => {
    		this.wx.onSocketMessage(res => resolve(res))
    	})
    }

    closeSocket() {
    	return new Promise((resolve, reject) => {
    		this.wx.closeSocket(res => resolve(res))
    	})
    }

    onSocketClose() {
    	return new Promise((resolve, reject) => {
    		this.wx.onSocketClose(res => resolve(res))
    	})
    }

    chooseImage(count, sizeType, sourceType) {
    	return new Promise((resolve, reject) => {
			this.wx.chooseImage({
				count: count || 9, 
				sizeType: sizeType || ['original', 'compressed'], 
				sourceType: sourceType || ['album', 'camera'], 
				success: res => resolve(res),
                fail: res => reject(res),
			})
    	})
    }

    previewImage(current, urls) {
    	return new Promise((resolve, reject) => {
			this.wx.previewImage({
				current: current, 
				urls: urls, 
				success: res => resolve(res),
	            fail: res => reject(res),
			})
		})
    }

    getImageInfo(src) {
    	return new Promise((resolve, reject) => {
    		this.wx.getImageInfo({
    			src: src,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    startRecord() {
    	return new Promise((resolve, reject) => {
    		this.wx.startRecord({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }


    stopRecord() {
    	return new Promise((resolve, reject) => {
    		this.wx.stopRecord({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    playVoice(filePath) {
    	return new Promise((resolve, reject) => {
    		this.wx.playVoice({
    			filePath: filePath,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    pauseVoice() {
    	return new Promise((resolve, reject) => {
    		this.wx.pauseVoice({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    stopVoice() {
    	return new Promise((resolve, reject) => {
    		this.wx.stopVoice({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    getBackgroundAudioPlayerState() {
    	return new Promise((resolve, reject) => {
    		this.wx.getBackgroundAudioPlayerState({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    playBackgroundAudio(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.playBackgroundAudio({
    			dataUrl: params.dataUrl,
    			title: params.title,
    			coverImgUrl: params.coverImgUrl,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    pauseBackgroundAudio() {
    	return new Promise((resolve, reject) => {
    		this.wx.pauseBackgroundAudio({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    seekBackgroundAudio(position) {
    	return new Promise((resolve, reject) => {
    		this.wx.seekBackgroundAudio({
    			position: position,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    stopBackgroundAudio() {
    	return new Promise((resolve, reject) => {
    		this.wx.stopBackgroundAudio({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    onBackgroundAudioPlay() {
    	return new Promise((resolve, reject) => {
    		this.wx.onBackgroundAudioPlay({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    onBackgroundAudioPause() {
    	return new Promise((resolve, reject) => {
    		this.wx.onBackgroundAudioPause({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    onBackgroundAudioStop() {
    	return new Promise((resolve, reject) => {
    		this.wx.onBackgroundAudioStop({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    saveFile(tempFilePath) {
    	return new Promise((resolve, reject) => {
    		this.wx.saveFile({
    			tempFilePath: tempFilePath,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    getSavedFileList() {
    	return new Promise((resolve, reject) => {
    		this.wx.getSavedFileList({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    getSavedFileInfo(filePath) {
    	return new Promise((resolve, reject) => {
    		this.wx.getSavedFileInfo({
    			filePath: filePath,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    removeSavedFile(filePath) {
    	return new Promise((resolve, reject) => {
    		this.wx.removeSavedFile({
    			filePath: filePath,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    chooseVideo(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.chooseVideo({
    			sourceType: params.sourceType || ['album', 'camera'],
    			maxDuration: params.maxDuration || 60,
    			camera: params.camera || ['front', 'back'],
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    createAudioContext(audioId) {
    	return this.wx.createAudioContext(audioId)
    }

    createVideoContext(videoId) {
    	return this.wx.createVideoContext(videoId)
    }

    setStorage(key, data) {
    	return new Promise((resolve, reject) => {
    		this.wx.setStorage({
    			key: key,
    			data: data,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    setStorageSync(key, data) {
        return this.wx.setStorageSync(key, data)
    }

    getStorage(key) {
    	return new Promise((resolve, reject) => {
    		this.wx.getStorage({
    			key: key,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    getStorageSync(key) {
        return this.wx.getStorageSync(key)
    }

    getStorageInfo() {
    	return new Promise((resolve, reject) => {
    		this.wx.getStorageInfo({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    getStorageInfoSync() {
        return this.wx.getStorageInfoSync()
    }

    removeStorage(key) {
    	return new Promise((resolve, reject) => {
    		this.wx.removeStorage({
    			key: key,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    removeStorageSync(key) {
        return this.wx.removeStorageSync(key)
    }

    clearStorage() {
    	return new Promise((resolve, reject) => {
    		this.wx.clearStorage({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    clearStorageSync() {
        return this.wx.clearStorageSync()
    }

    clearStorage() {
    	return new Promise((resolve, reject) => {
    		this.wx.clearStorage({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    getLocation(type) {
    	return new Promise((resolve, reject) => {
    		this.wx.getLocation({
    			type: type || 'wgs84',
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    chooseLocation(cancel) {
    	return new Promise((resolve, reject) => {
    		this.wx.chooseLocation({
    			cancel: cancel,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    openLocation(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.openLocation({
    			latitude: params.latitude,
    			longitude: params.longitude,
    			scale: params.scale,
    			name: params.name,
    			address: params.address,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    getNetworkType() {
    	return new Promise((resolve, reject) => {
    		this.wx.getNetworkType({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    getSystemInfo() {
    	return new Promise((resolve, reject) => {
    		this.wx.getSystemInfo({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    onAccelerometerChange() {
    	return new Promise((resolve, reject) => {
    		this.wx.onAccelerometerChange(res => resolve(res))
    	})
    }

    onCompassChange() {
    	return new Promise((resolve, reject) => {
    		this.wx.onCompassChange(res => resolve(res))
    	})
    }

    makePhoneCall(phoneNumber) {
    	return new Promise((resolve, reject) => {
    		this.wx.makePhoneCall({
    			phoneNumber: phoneNumber,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    showToast(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.showToast({
    			title: params.title,
    			icon: params.icon,
    			duration: params.duration,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    showModal(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.showModal({
    			title: params.title,
    			content: params.content,
    			showCancel: params.showCancel || !0,
    			cancelText: params.cancelText || '取消',
    			cancelColor: params.cancelColor || '#000000',
    			confirmText: params.confirmText || '确定',
    			confirmColor: params.confirmColor || '#3CC51F',
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    showActionSheet(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.showActionSheet({
    			itemList: params.itemList,
    			itemColor: params.itemColor || '#000000',
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    setNavigationBarTitle(title) {
    	return new Promise((resolve, reject) => {
    		this.wx.setNavigationBarTitle({
    			title: title,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    showNavigationBarLoading() {
    	return this.wx.showNavigationBarLoading()
    }

    hideNavigationBarLoading() {
    	return this.wx.hideNavigationBarLoading()
    }

    navigateTo(url, params) {
        const $$url = this.tools.buildUrl(url, params)
    	return new Promise((resolve, reject) => {
    		this.wx.navigateTo({
    			url: $$url,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    redirectTo(url, params) {
        const $$url = this.tools.buildUrl(url, params)
    	return new Promise((resolve, reject) => {
    		this.wx.redirectTo({
    			url: $$url,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    navigateBack(params) {
    	return this.wx.navigateBack(params)
    }

    createAnimation(params) {
    	return this.wx.createAnimation(params)
    }

    createContext() {
    	return this.wx.createContext()
    }

    drawCanvas(params) {
    	return this.wx.drawCanvas(params)
    }

    canvasToTempFilePath(params) {
    	return this.wx.canvasToTempFilePath(params)
    }

    hideKeyboard() {
    	return this.wx.hideKeyboard()
    }

    stopPullDownRefresh() {
    	return this.wx.stopPullDownRefresh()
    }

    getUserInfo() {
    	return new Promise((resolve, reject) => {
    		this.wx.getUserInfo({
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    requestPayment(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.requestPayment({
    			timeStamp: params.timeStamp,
    			nonceStr: params.nonceStr,
    			package: params.package,
    			signType: params.signType,
    			paySign: params.paySign,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }

    login() {
        return new Promise((resolve, reject) => {
            this.wx.login({
                success: res => resolve(res),
                fail: res => reject(res),
            })
        })
    }
}

export default Service