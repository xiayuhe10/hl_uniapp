// 拼凑图片 
// by:ch
async function createAvatar(option) {
	if (!option) {
		return false
	}

	let canvasId = option.canvasId || 'canvas' // id
	let data = option.data || [] // 图片集合
	let width = option.width || 50 // 生成图片的宽度,默认高度等于宽度
	let bgColor = option.bgColor || '#cecece' // 生成图片的背景色
	let gutter = option.gutter || 3 // 图片中间间距
	let margin = option.margin || 3 // 图片边距

	let context = uni.createCanvasContext(canvasId);
	context.rect(0, 0, width, width);
	context.setFillStyle(bgColor);
	context.fill();

	let lineCount = data.length < 5 ? 2 : 3; //如果小于5张图片，则一行两张
	let orignCount = lineCount * lineCount; //一共可以放置的图片数量：4或9
	let ttlGutter = gutter * (lineCount - 1) + margin * 2
	let lineWidth = (width - ttlGutter) / lineCount; //每行图片的总宽度为96，除以可放置数量，即为每张图片的宽度
	let length = data.length > 9 ? 9 : data.length; //如果图片数量超过九，则只显示九张
	let mod = (lineCount - length % lineCount) % lineCount; //余数
	let orignDistance = (lineWidth + gutter) / 2; //第一行初始间距

	for (let index = 0; index < length; index++) {
		let lineNum = parseInt((index + mod) / lineCount)
		let x = (lineNum > 0 ? 0 : orignDistance * mod) + margin + lineWidth * (index % lineCount) + gutter * (
			index % lineCount)
		let y = margin + orignDistance * (parseInt((orignCount - length) / lineCount) % lineCount) + lineWidth * (
				lineNum % lineCount) +
			gutter * (lineNum)

		let res = await getLocalImage(data[index])
		if (res) {
			context.drawImage(res, x, y, lineWidth, lineWidth);
		}
	}

	return new Promise((resolve, reject) => {
		context.draw(false, async () => {
			let res = await canvasToTempFilePath(canvasId)
			resolve(res)
		})
	})
}

function getLocalImage(url, toFail = true) {
	let defaultImg = require('../static/imgs/default.jpg')
	return new Promise((resolve, reject) => {
		uni.getImageInfo({
			src: url,
			success: async res => {
				// 20210918 app好像是不进fail了。。。就很难受
				// #ifdef APP-PLUS
				if (res.width === -1 || res.height === -1) {
					resolve(defaultImg)
					return
				}
				// #endif
				resolve(res.path)
			},
			fail: async e => {
				console.log('获取图片失败', e);
				if (toFail) {
					resolve(defaultImg)
				} else {
					resolve(false)
				}
			}
		});
	});
}

function canvasToTempFilePath(id) {
	return new Promise((resolve, reject) => {
		uni.canvasToTempFilePath({
			canvasId: id,
			success: async (res) => {
				resolve(res)
			},
		})
	})
}

module.exports = createAvatar;
