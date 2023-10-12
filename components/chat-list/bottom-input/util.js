// 将rpx转px
function sizeDeal (size) {
	const info = uni.getSystemInfoSync()
	let scale = 750 / info.windowWidth;
	// 分离字体大小和单位,rpx 转 px
	let s = Number.isNaN(parseFloat(size)) ? 0 : parseFloat(size)
	let u = size.toString().replace(/[0-9]/g, '').replace('-', '')
	if (u == 'rpx') {
		s /= scale
		u = 'px'
	} else if (u == '') {
		u = 'px'
	} else if (u == 'vw') {
		u = 'px'
		s = s / 100 * 750 / scale
	}
	return [s, u, s + u]
}
module.exports = {
	sizeDeal:sizeDeal
}
