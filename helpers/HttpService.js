import ServiceBase from 'ServiceBase'

class Service extends ServiceBase {
	constructor() {
		super()
		this.$$prefix = ''
		this.$$path = {
			signIn  : '/user/sign/in',
			banner  : '/banner', 
			classify: '/classify', 
			goods   : '/goods', 
			cart    : '/cart', 
			address : '/address', 
			order   : '/order', 
        }
	}

	signIn(params) {
		return this.postRequest(this.$$path.signIn, params) 
	}

	getBanners() {
		return this.getRequest(this.$$path.banner)
	}

	getGoods(params) {
		return this.getRequest(this.$$path.goods, params)
	}

	getClassify(params) {
		return this.getRequest(this.$$path.classify, params)
	}

	getDetail(id) {
		return this.getRequest(`${this.$$path.goods}/${id}`)
	}

	getCartByUser() {
		return this.getRequest(this.$$path.cart)
	}

	addCartByUser(goods) {
		return this.postRequest(this.$$path.cart, {
			goods: goods, 
		})
	}

	delCartByUser(id) {
		return this.deleteRequest(`${this.$$path.goods}/${id}`)
	}

	getAddressList(params) {
		return this.getRequest(this.$$path.address, params)
	}

	getAddressDetail(id) {
		return this.getRequest(`${this.$$path.address}/${id}`)
	}

	postAddress(params) {
		return this.postRequest(this.$$path.address, params)
	}

	putAddress(id, params) {
		return this.putRequest(`${this.$$path.address}/${id}`, params)
	}

	deleteAddress(id, params) {
		return this.deleteRequest(`${this.$$path.address}/${id}`)
	}

	getDefalutAddress() {
		return this.getRequest(`${this.$$path.address}/default`)
	}

	setDefalutAddress(id) {
		return this.postRequest(`${this.$$path.address}/default/${id}`)
	}

	getOrderList(params) {
		return this.getRequest(this.$$path.order, params)
	}

	getOrderDetail(id) {
		return this.getRequest(`${this.$$path.order}/${id}`)
	}

	postOrder(params) {
		return this.postRequest(this.$$path.order, params)
	}

	putOrder(id, params) {
		return this.putRequest(`${this.$$path.order}/${id}`, params)
	}

	deleteOrder(id, params) {
		return this.deleteRequest(`${this.$$path.order}/${id}`)
	}
}

export default new Service