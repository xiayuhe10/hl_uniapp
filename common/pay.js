/*
 * 支付 pay.js
 * orderId：订单id
 * self：this
 * type:交易类型（WEIXIN-微信 ALIPAY-支付宝 YL-银联）
 * bizType: 业务类型(integral:积分商城 zone:云空间存储)
 */
import Request from '@/common/request.js';
import webUrl from '@/common/config.js';
export const pay = (orderId, self, type, success, fail) => {
	// 发起微信支付
	if (type == "WEIXIN") {
		// #ifdef APP-PLUS
		uni.getProvider({
			service: 'payment',
			success: res => {
				if (res.providers.indexOf('wxpay')) {
					Request.post(Request.API.preparePay, {
						"orderId": orderId,
						"payWay": "WECHAT_APP"
					}, "form").then(res => {
						if (res.data.code == 200) {
							//wxAppPay(res.data.data, self, orderId, bizType, success, fail);
							wxAppPay(res.data.data, self, success, fail);
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							})
						}
					})
				}
			},
			fail: (err) => {
				uni.showToast({ title: '调用微信支付失败,请稍后再试', icon: 'none', duration: 2000 })
			}
		})
		// #endif
	}

	// 支付宝支付
	if (type == "ALIPAY") {
		Request.post(Request.API.preparePay, {
			"orderId": orderId,
			"payWay": "ALIPAY"
		}, "form").then(res => {
			if (res.data.code == 200) {
				aliAppPay(res.data.orderInfo, self, success, fail);
			}
		})
	}

}

/*跳到支付成功页*/
function paySuccess(result, self, success) {
	console.info('跳到支付成功页',result, self, success)
	if (success) {
		success(result);
		return;
	}
	gotoSuccess(result);
}
/*跳到支付成功页*/
function gotoSuccess(result) {
	console.log('跳到支付成功页面2',result)
	// uni.reLaunch({
	// 	url: ''
	// });
}

/*支付失败跳订单详情*/
function payError(result, fail) {
	console.log('支付失败')
	if (fail) {
		fail(result);
		return;
	}
	// uni.redirectTo({
	// 	url: ''
	// });
}

function wxAppPay(result, self, orderId, bizType, success, fail) {
	// 获取支付通道  
	plus.payment.getChannels(function(channels) {
		self.channel = channels[0];
		let orderInfo = {
			"appid": result.appId,
			"partnerid": result.partnerId,
			"prepayid": result.prepayId,
			"package": result.packageValue,
			"noncestr": result.nonceStr,
			"timestamp": result.timeStamp,
			"sign": result.sign,
		};
		uni.requestPayment({
			provider: 'wxpay',
			orderInfo: orderInfo,
			success(res) {
				paySuccess(result, self, orderId, bizType, success);
			},
			fail(error) {
				payError(result, fail);
				// self.showError('订单未支付成功', () => {
				// 	payError(result, fail);
				// });
			},
		});
	}, function(e) {
		console.log("获取支付通道失败：" + e.message);
	});
}

function aliAppPay(result, self, success, fail) {
	console.log(result.data.payment);
	uni.requestPayment({
		provider: 'alipay',
		orderInfo: result.data.payment,
		success(res) {
			paySuccess(result, self, success);
		},
		fail(error) {
			console.log(error);
			self.showError('订单未支付成功', () => {
				payError(result, fail);
			});
		},
	});
}
