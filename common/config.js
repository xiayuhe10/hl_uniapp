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
			BaseURL: 'https://service.zgy007.com',
			webscoket: 'wss://socket.zgy007.com',
			fileURL: "https://demo.file.zgy007.com",
			h5URL: "http://h5.zgy007.com:99",
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
			BaseURL: 'http://111.12.70.151:8080', // 19 46
			webscoket: 'ws://111.12.70.151:20000',
			fileURL: "http://111.12.70.151:8888",
			h5URL: "http://192.168.2.168:99"
		}
	}

}

export default configURL
