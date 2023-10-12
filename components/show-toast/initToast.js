import Vuex from 'vuex'
export default function initToast(v) {
  v.use(Vuex)
  // 挂在store到全局Vue原型上
  v.prototype.$toastStore = new Vuex.Store({
    state: {
		show:false,
		icon:"success",//success:成功；fail:失败
		title:"标题",
		content:'内容',
		success:null,
    },
    mutations: {
		hideToast(state) {
			// 小程序导航条页面控制
			// #ifndef H5
			if(state.hideTabBar){
				wx.showTabBar();
			}
			// #endif
			state.show = false
		},
		showToast(state,data) {
			state = Object.assign(state,data)
			console.log(state);
			state.show = true
			setTimeout(()=>{
				state.show = false
				return state.success(state.icon)
			},2000)
		}
    }
  })
  // 注册$showToast到Vue原型上，以方便全局调用
  v.prototype.$showToast = function (option) { 
	if (typeof option === 'object') {
		// #ifndef H5
		if(option.hideTabBar){
			wx.hideTabBar();
		}
		// #endif
		
		v.prototype.$toastStore.commit('showToast', option)
	}else{
		throw "配置项必须为对象传入的值为："+typeof option;
	}
  }
}