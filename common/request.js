import configURL from "./config.js";
import API from "./api.js";
import APIPAR from "./apiParent.js";
let api = configURL.BaseURL;

function fun(url, method, data, header, params) {
	let token = uni.getStorageSync('token')
	data = data || {};
	if (header && header === 'form') {
		header = {
			'Authorization': token,
			'content-type': 'application/x-www-form-urlencoded'
		}
	} else {

		header = {
			'Authorization': token,
			'content-type': 'application/json'
		}

	}
	let promise = new Promise(function(resolve, reject) {
		uni.request({
			url: api + url,
			header: header,
			data: data,
			params: params,
			method: method,
			success: function(res) {
				uni.hideToast()
				uni.hideLoading();
				if (res.data.code === 401 || res.data.code === 415) {
					console.log("全局变量：", getApp().globalData.logoutNum)
					if (getApp().globalData.logoutNum == 0) {
						getApp().globalData.logoutNum = 1
						uni.showModal({
							title: '提示',
							content: '您尚未登录，请先登录',
							showCancel: false,
							success(res) {
								if (res.confirm) {
									uni.reLaunch({
										url: '/pages/login/login'
									})
								}
							}
						})
					}
				} else if (res.data.resultCode === 500 || res.data.resultCode === -1) {
					uni.showModal({
						title: '提示',
						content: '系统繁忙！请稍后重试',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.reLaunch({
									url: '/pages/login/login'
								})
							}
						}
					})
				}
				resolve(res);
			},
			fail: reject,
			complete: function() {
				uni.hideNavigationBarLoading();
			}
		});
	});
	return promise;
}

function upload(url, filePath) {
	let token = uni.getStorageSync('token')
	let header = {
		'Authorization': token,
		'content-type': 'multipart/form-data'
	};
	uni.showNavigationBarLoading();
	let promise = new Promise(function(resolve, reject) {
		uni.uploadFile({
			url: api + url,
			filePath: filePath,
			name: "file",
			header: header,
			success: function(res) {
				if (res.data.code === 401 || res.data.code === 415) {
					uni.showModal({
						title: '提示',
						content: '您登录已过期，请重新登录',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.reLaunch({
									url: '../login/login'
								})
							}
						}
					})

				} else if (res.data.resultCode === 500 || res.data.resultCode === -1) {
					uni.showModal({
						title: '提示',
						content: '系统繁忙！请稍后重试',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.reLaunch({
									url: '../login/login'
								})
							}
						}
					})
				}
				resolve(res);
			},
			fail: reject,
			complete: function() {
				uni.hideNavigationBarLoading();
			}
		});
	});
	return promise;
}
var ssoHeader = {
	'content-type': 'application/x-www-form-urlencoded'
}
module.exports = {
	api: api,
	ssoHeader: ssoHeader,
	API: API,
	APIPAR: APIPAR,
	"get": function(url, data, header, params) {
		return fun(url, "GET", data, header, params);
	},
	"post": function(url, data, header, params) {
		return fun(url, "POST", data, header, params);
	},
	"put": function(url, data, header, params) {
		return fun(url, "PUT", data, header, params);
	},
	"delete": function(url, data, header) {
		return fun(url, "DELETE", data, header);
	},
	upload: function(url, filePath) {
		return upload(url, filePath);
	},
	getFileUrl: function() {
		return downloadUrl();
	}
};