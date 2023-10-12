import confige from "./config.js";
import store from '@/store/index.js'
import axios from 'axios'


const myRequest = (options) =>{
	return new Promise((resolve,reject)=>{
		// console.log(store.state.webUrl)
		var token = store.state.datas.access_token;
		// console.log(token)
		let loginHeader ={'Content-Type':'application/x-www-form-urlencoded'} ;
		let tokenHeader ={ 'Authorization':'Bearer '+token,'Content-Type':'application/json' }
		uni.request({
			// url:confige.webUrl+options.url,
			url:store.state.webUrl+options.url,
			method:options.method || "GET",
			data:options.data || {},
			header:token?tokenHeader:loginHeader,
			timeout:50000,
			success: (res) => {
				// console.log(res)
				if(res.statusCode===200){resolve(res)}
				else{httpCode(res.statusCode,res.data.resp_msg);reject(res);}	
			},
			fail: (err) => {
				console.log(err)
				uni.showToast({
					title:"服务器请求失败",
					icon:"none"
				})
				reject(err);
			}
		})
	}
	)
}
function httpCode(statusCode,msg) {
  switch (statusCode) {
	case 400:
	  	return error(msg);
	      break;
	case 401:
		msg = '登陆失效，请重新登陆';
		error(msg)
		store.commit('showTips');
			uni.reLaunch({
				url:"/pages/login/login",
			})
	    break;
	case 403:
		msg = '无权访问';
		return error(msg);
		break;
    case 404:
      msg = '连接不上远程服务器,请检查网络！';
	 return error(msg); 
      break;
	 case 405:
	 msg = msg;
	 return error(msg); 
	  break;
    case 500:
      msg = '服务异常稍后重试！';
	 return error(msg);
      break;
    case 503:
      msg = '服务不可用,请稍后重试！';
	 return error(msg);
      break;
    case 'timeout':
      msg = '超时稍后重试！';
	 return error(msg);
      break;
    case 'fail':
      msg = '网络已断开,请检查网络！';
	 return error(msg);
      break;
    default:
      break;
  }
}
function error(msg) {
	if (msg) uni.showToast({ title: msg,icon:"none" });
}
export {
	myRequest
}