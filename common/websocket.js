class websocket {
	constructor(url, time) {
		this.is_open_socket = false //避免重复连接
		this.url = url //地址
		this.data = null
		//心跳检测
		this.timeout = time //多少秒执行检测
		this.heartbeatInterval = null //检测服务器端是否还活着
		this.reconnectTimeOut = null //重连之后多久再次重连
		this.count = 0
		// try {
		// 	return this.connectSocketInit()
		// } catch (e) {
		// 	console.log('catch');
		// 	this.is_open_socket = false
		// 	this.reconnect();
		// }
	}

	//创建websocket连接
	connectSocketInit() {
		let token = uni.getStorageSync('token')
		if (token) {
			this.socketTask = uni.connectSocket({
				url: this.url + '?token=' + token,
				success: () => {
					console.log("正准备建立websocket中...");
					// 返回实例
					return this.socketTask
				},
			});
			this.socketTask.onOpen((res) => {
				console.log("WebSocket连接正常！");
				clearTimeout(this.reconnectTimeOut)
				clearTimeout(this.heartbeatInterval)
				this.is_open_socket = true;
				this.start();
				this.socketTask.onMessage((res) => { // onMessage 监听 WebSocket 接受到服务器的消息事件
					// console.log("服务器接收到的消息：" + res.data)
					let resData = this.checkJSON(res.data);
					//uni.$emit("wsRespData", resData);
					if (resData.code != 'PING' && resData != '') {
						console.log("接受到服务器的消息事件：" + res.data)
						uni.$emit("wsRespData", resData);
					}
				});
			})
			// 这里仅是事件监听【如果socket关闭了会执行】
			this.socketTask.onClose(() => {
				console.log("已经被关闭了")
				this.connectSocketInit();
				this.is_open_socket = false;
				// this.reconnect();
			})
		}
	}

	checkJSON(data) {
		try {
			return JSON.parse(data);
		} catch (e) {
			return data;
		}
	}

	//发送消息
	send(value) {
		// 注：只有连接正常打开中 ，才能正常成功发送消息
		this.socketTask.send({
			data: value,
			async success() {
				//console.log("消息发送成功");
			},
		});
	}
	//开启心跳检测
	start() {
		let userInfo = uni.getStorageSync("userInfo")
		this.heartbeatInterval = setInterval(() => {
			this.data = {
				code: "PING",
				imMessage: {
					id: 0,
					toId: 0,
					toIds: "",
					groupId: null,
					sessionId: 1,
					chatType: "SINGLE",
					imMsgType: "MSG",
					content: "",
					contentType: "TEXT",
					fromId: userInfo.userId
				}
			}
			this.send(JSON.stringify(this.data));
		}, this.timeout)
	}
	//重新连接
	reconnect() {
		clearInterval(this.heartbeatInterval)
		this.connectSocketInit();
		// //停止发送心跳
		// clearInterval(this.heartbeatInterval)
		// //如果不是人为关闭的话，进行重连
		// if (!this.is_open_socket) {
		// 	this.connectSocketInit();
		// 	this.reconnectTimeOut = setTimeout(() => {
		// 		this.connectSocketInit();
		// 	}, 100)
		// }
	}
	//关闭连接
	completeClose() {
		clearTimeout(this.reconnectTimeOut)
		clearTimeout(this.heartbeatInterval)
		this.is_open_socket = false;
		this.socketTask.close()
	}

}

module.exports = websocket
