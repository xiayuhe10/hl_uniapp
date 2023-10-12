let configURL = {}
const NODE_ENV = 'dev'; // dev:开发环境 | test:测试环境  

if (NODE_ENV === "dev") {
	//本地环境
	console.log('本地环境')
	configURL = {
		BaseURL: 'http://192.168.110.23:8088',
		webscoket: 'ws://localhost:20000',
		fileURL: "http://192.168.110.4:8888",
		h5URL: "http://192.168.2.19:8081",
	}
} else {
	if (NODE_ENV === 'test') {
		//测试环境
		console.log('测试环境')
		configURL = {
			BaseURL: 'http://192.168.2.124:8080',
			webscoket: 'ws://192.168.2.124:20000',
			fileURL: "http://192.168.2.124:8888"
		}
	} else if (NODE_ENV === 'prod') {
		//生产环境
		console.log('正式环境')
		configURL = {
			BaseURL: '',
			webscoket: '',
			fileURL: "",
			h5URL: "",
		}
	} else if (NODE_ENV === 'hl') {
		//生产环境
		console.log('生产环境')
		configURL = {
			BaseURL: 'http://192.168.2.46:8080', // 19 46
			webscoket: 'ws://192.168.2.46:20000',
			fileURL: "http://192.168.2.124:8888",

			
		}
	} else if (NODE_ENV === 'product') {
		//新正式环境
		console.log('新正式环境')
		configURL = {
			BaseURL: '', // 19 46
			webscoket: '',
			fileURL: "",
			h5URL: ""
		}
	}

}

export default configURL
