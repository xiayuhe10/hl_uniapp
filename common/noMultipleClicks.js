// // 防止处理多次点击
// function noMultipleClicks(methods, info) {
//     // methods是点击后需要执行的函数， info是函数需要传的参数
//     let that = this;
//     if (that.noClick) {
//         // 第一次点击
//         that.noClick= false;
//         if((info && info !== '') || info ==0) {
//             // info是执行函数需要传的参数
//             methods(info);
//         } else {
//             methods();
//         }
//         setTimeout(()=> {
//             that.noClick= true;
//         }, 4000)
//     } else {
//         //  这里是重复点击的判断
// 		uni.showToast({
// 			title: '点击过快，请稍等',
// 			icon: 'none', //如果要纯文本，不要icon，将值设为'none'
// 			duration: 2000 //持续时间为 2秒
// 		})
//     }
// }
/**
 * 节流函数
 * @methods 需节流的函数
 * @info 需节流的函数参数1
 * @info1 需节流的函数参数2
 */
function noMultipleClicks(methods, info, info1) {
	// console.log(info, info1);
	let that = this;
	if (that.noClick) {
		// 第一次点击
		that.noClick = false;
		if (info != undefined && info1 == undefined) {
			// info是执行函数需要传的参数
			methods(info);
		} else if (info != undefined && info1 != undefined) {
			methods(info, info1);

		} else {
			methods();
		}
		setTimeout(() => {
			that.noClick = true;
		}, 4000)
	} else {
		// 这里是重复点击的判断
		// uni.showToast({
		// 	title: '点击过快，请稍等',
		// 	icon: 'none', //如果要纯文本，不要icon，将值设为'none'
		// 	duration: 2000 //持续时间为 2秒
		// })
	}
}
function noMulShowToastClicks(methods, info, info1) {
	// console.log(info, info1);
	let that = this;
	if (that.noClick) {
		// 第一次点击
		that.noClick = false;
		if (info != undefined && info1 == undefined) {
			// info是执行函数需要传的参数
			methods(info);
		} else if (info != undefined && info1 != undefined) {
			methods(info, info1);

		} else {
			methods();
		}
		setTimeout(() => {
			that.noClick = true;
		}, 1000)
	} else {
		// 这里是重复点击的判断
		console.info('点击过快')
		uni.showToast({
			title: '点击过快，请稍等',
			icon: 'none', //如果要纯文本，不要icon，将值设为'none'
			duration: 2000 //持续时间为 2秒
		})
	}
}
//导出
export default {
	noMultipleClicks, // 禁止多次点击
	noMulShowToastClicks
}
// 使用方法 @click="$noMultipleClicks(submit,'参数')" 
// noClick:true,
