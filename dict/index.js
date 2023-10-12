import Vue from 'vue'
import UEasyDict from '@/uni_modules/u-easy-dict/index.js'
import Request from '@/common/request.js';

Vue.use(UEasyDict, {
	types: [{
		dictKey: 'sys_normal_disable', //状态
		immediateLoad: false
	}, {
		dictKey: 'car_type', //车辆类型
		immediateLoad: false
	}, {
		dictKey: 'car_status', //车辆状态
		immediateLoad: false
	}, {
		dictKey: 'car_category', //车辆归属
		immediateLoad: false
	}, {
		dictKey: 'car_fuel_type', //车辆燃油类型
		immediateLoad: false
	}],
	defaultData(dictKey) {
		return new Promise((resolve) => {
			Request.get(Request.API.getDict + '/' + dictKey.dictKey).then(res => {
				let arr = []
				let resData = res.data.data
				resData.forEach(item => {
					let obj = {}
					obj.label = item.dictLabel
					obj.value = item.dictValue
					arr.push(obj)
				})
				resolve(arr)
			})
		})
	}
})