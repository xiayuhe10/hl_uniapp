<template>
	<view>
		<view v-for="(itemL,indexL) in sessionTerList" :key="'l'+indexL">
			<view v-for="(item,index) in itemL.list" :key="'t'+index">
				
			</view>
		</view>
	</view>
</template>

<script>
	import dateTime from '@/common/dateTime.js';
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	export default {
		name: "homePage",
		data() {
			return {
				memberList: [], //获取聊天列表
				sessionList: [], //获取聊天列表
				topSessionList: ['ALARM', 'SYSTEM', 'CHECK'],
				systemMessage: {},
				alarmMessage: {},
				checkMessage: {},
				listNum: 0,
				pageNum: 1,
				pageSize: 1,
				fileUrl: '',
				sessionTerList: []
			};
		},
		created() {
			this.listWithMyUnReadTer(); //系统未读消息列表
		},
		onLoad() {
			this.fileUrl = webUrl.fileURL;
		},
		mounted() {
			uni.$on("wsRespData", (rel) => { // 监听全局的自定义事件。事件可以由 uni.$emit 触发
				// console.log("socket返回：" + rel)
				this.listWithMyUnReadTer(); //系统未读消息列表
			});
		},
		methods: {
			listWithMyUnReadTer() { //GET查询我的消息通知列表+未读数量（教师端
				Request.get(Request.API.listWithMyUnReadTer).then(res => {
					if (res.data.code == 200) {
						this.sessionTerList = res.data.rows
					}
				})
			},
			// ALARM: 告警消息, SYSTEM: 系统消息, CHECK: 审批消息, SCHOOL: 学校消息, CLASS: 班级消息, WORK: 作业消息, LEAVE: 请假消息, PHOTO_ALBUM: 动态消息, ORDER: 订单消息
			selectAlarmMessageList() { //告警未读消息列表
				Request.get(Request.API.messageInfoMylist, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					scopeType: 'ALARM'
				}).then(res => {
					console.info('告警消息', res)
					if (res.data.code == 200) {
						this.alarmMessage = res.data.rows
						this.selectBadgeNum()
					}
				})
			},
			selectSystemMessageList() { //系统未读消息列表
				Request.get(Request.API.messageInfoMylist, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					scopeType: 'SYSTEM'
				}).then(res => {
					if (res.data.code == 200) {
						this.systemMessage = res.data.rows ? res.data.rows : [],
							this.selectBadgeNum()
					}
				})
			},
			selectCheckMessageList() { //审批未读消息列表
				Request.get(Request.API.messageInfoMylist, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					scopeType: 'CHECK'
				}).then(res => {
					if (res.data.code == 200) {
						this.checkMessage = res.data.rows
						this.selectBadgeNum()
					}
				})
			},
			getSessionList() { //获取聊天列表
				Request.get(Request.API.sessionList).then(res => {
					uni.stopPullDownRefresh() //刷新数据之后停止刷新
					if (res.data.code == 200) {
						this.memberList = res.data.rows
						this.sessionList = res.data.rows
						let cont = 0
						if (this.sessionList && this.sessionList.length > 0) {
							for (let i = 0; i < this.sessionList.length; i++) {
								let unRead = this.sessionList[i].unReadCount
								if (unRead != undefined) {
									cont = unRead + cont
								}
							}
						}
						this.selectBadgeNum()
						this.listNum = cont
					}
				})
			},
			selectBadgeNum() { // 设置未读消息显示
				let that = this
				let num = Number(this.alarmMessage.unRead ? this.alarmMessage.unRead : 0) +
					Number(this.systemMessage.unRead ? this.systemMessage.unRead : 0) +
					Number(this.listNum ? this.listNum : 0) +
					Number(this.checkMessage.unRead ? this.checkMessage.unRead : 0)
				let show = {
					'告警未读': this.alarmMessage.unRead,
					'系统未读': this.systemMessage.unRead,
					'聊天列表未读': this.listNum,
					'审批未读': this.checkMessage.unRead,
				}
				// console.log("设置未读消息显示：", show,num)
				if (num > 0) {
					if (num > 99) {
						num = '99+'
					}
					uni.setTabBarBadge({
						index: 0,
						text: `${num}`
					});
					that.setBadge(num)
				} else {
					uni.removeTabBarBadge({
						index: 0
					});
					that.clearBadge()
				}
			},
			// 设置数字
			setBadge(num) {
				//#ifdef APP-PLUS
				plus.runtime.setBadgeNumber(num);
				//#endif
			},
			// 清除数字
			clearBadge() {
				//#ifdef APP-PLUS
				plus.runtime.setBadgeNumber(0);
				//#endif
			},
			changeTime(date) {
				return dateTime.dateTime(date);
			},
			gotoMessInfo(value) {
				this.$emit("gotoMessInfo", value); //backHome父组件的方法,e要传递的参数
			}
		}
	}
</script>

<style scoped>
	.profileUrl {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
		background-color: #fff;
	}
</style>
