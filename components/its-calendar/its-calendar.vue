<template>
	<view>
		<view class="calendar">
			<!-- <view class="calendar_day">
				<view class="day_x" :style="{'color': (day_index == index ? '#FE3B3C' : '')}"
					v-for="(item, index) in dayArr" :key="index" @click.stop="dayList(item,index)">
					<view class="day_x_a">{{item.weeks}}</view>
					<view class="day_x_b">{{item.days}}</view>
				</view>
			</view> -->
			<view scroll-y class="calendar_time">
				<!-- @click="maxTimes < timeFormat(item.hours) ? hosts(item) : ''" -->
				<!-- :style="{'color': (maxTimes >= timeFormat(item.hours) ? '#999999' : '')}" -->
				<view class="time_x" :class="host_index == item.timeStamp ? 'time_x_sty' : ''"
					v-for="(item, index) in hostArr[day_index]" :key="index"
					:style="{'color': (maxTimes.includes(timeFormat(item.hours)) ? '#09A5A1' : '')}"
					@click="hosts(item)"
					>{{item.hours}}</view>
			</view>
		</view>
		<view class="sub" @click="sub()">
			确定选择
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			sta_num: {
				type: Number | String,
				default: 9
			},
			end_num: {
				type: Number | String,
				default: 18
			},
			int_num: {
				type: Number | String,
				default: 15
			},
			timeIndex: { // 选择的时间类型
				type: Number | String,
				default: 0
			},
			timeIndexOpt: { // 选择的options
				type: Number | String,
				default: 0
			},
			optionsList: { // 预约的时间
				type: Array,
				default () {
					return []
				}
			},
		},
		data() {
			return {
				dayArr: [],
				hostArr: [],
				day_index: 1,
				host_index: '',
				host_All: [],
				nowTimes: '',
				maxTimes: [],
			}
		},
		watch: {
			sta_num: {
				handler: function(val) {
					// console.log(val, "监听sta_num")
					this.host_index == ''
					this.sta_num = val
					this.createTimeShow()
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
			timeIndex: {
				handler: function(val) {
					this.optionsMath()
					// console.log(val, "监听timeIndex",this.sta_num,this.end_num)
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
			timeIndexOpt: {
				handler: function(val) {
					// console.log(val, "监听timeIndexOpt")
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
			optionsList: {
				handler: function(val) {
					// console.log(val, "监听optionsList")
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
		},
		mounted() {
			this.createTimeShow()
		},
		methods: {
			showModal(){
				this.optionsMath()
			},
			optionsMath(val){
				// console.info(this.optionsList)
				// console.info(this.timeIndex)
				let that = this
				let optionsShow = this.optionsList[this.timeIndex].optionsList
				let timeList = []
				optionsShow.forEach(function(value, index) {
					let num2 = 0
					if (value.startTime) {
						let num1 = that.timeFormat(value.startTime)
						timeList.push(num1)
					}
					if (value.endTime) {
						let num2 = that.timeFormat(value.endTime)
						timeList.push(num2)
					}
				})
				let max = Math.max.apply(null, timeList);
				this.maxTimes = timeList
				// console.info(max,timeList)
			},
			timeFormat(time){
				let num = parseFloat(time.replace(/[^0-9]/ig,"")); 
				return num
			},
			createTimeShow(){
				let dateArr = []
				let today = new Date();
				let nowTime = today.getTime() // 当前时间戳
				this.nowTimes = parseInt(nowTime / 1000)
				for (let i = 0; i < 5; i++) {
					let newDate = new Date(today.getTime() + i * 1000 * 60 * 60 * 24)
					let month = (parseInt(newDate.getMonth()) + 1) > 9 ? (parseInt(newDate.getMonth()) + 1) : "0" + (parseInt(
						newDate.getMonth()) + 1) // 当前月份
					let day = (newDate.getDate()) > 9 ? newDate.getDate() : "0" + newDate.getDate() //当前日期
					let backTime = newDate.getTime() // 几天后时间戳
					let backDays = newDate.getDay() // 几天后周几
					let remTime = (backTime - nowTime) / 1000 // 距离今天几天
					let week = ''
					if (remTime == 0) {
						week = "今天"
					} else if (remTime == 86400) {
						week = "明天"
					} else if (remTime == 172800) {
						week = "后天"
					} else {
						if (backDays == 0) {
							week = "周日"
						} else if (backDays == 1) {
							week = "周一"
						} else if (backDays == 2) {
							week = "周二"
						} else if (backDays == 3) {
							week = "周三"
						} else if (backDays == 4) {
							week = "周四"
						} else if (backDays == 5) {
							week = "周五"
						} else if (backDays == 6) {
							week = "周六"
						}
					}
					let fullDate = `${month}-${day}`
					let ass = {
						weeks: week,
						days: fullDate
					}
					dateArr.push(ass)
				}
				this.dayArr = dateArr
				let timeArr = []
				for (let i = 0; i < 5; i++) {
					// let as = new Date(new Date().toLocaleDateString()).getTime() / 1000
					let as = new Date(new Date().toLocaleDateString()).getTime() / 1000 + i * 60 * 60 * 24
					let staTime = this.sta_num * 60 * 60 + as
					let endTime = this.end_num * 60 * 60 + as
					let int = this.int_num * 60
					let timeArr_s = []
					timeArr_s.push({
						hours: this.times(staTime),
						timeStamp: staTime
					})
					for (staTime; staTime <= endTime - int; staTime + int) {
						staTime = staTime + int
						let hours = this.times(staTime)
						let asb = {
							hours,
							timeStamp: staTime
						}
						timeArr_s.push(asb)
					}
					timeArr.push(timeArr_s)
				}
				this.hostArr = timeArr
				// console.info(timeArr)
			},
			// 点击日期
			dayList(e, index) {
				this.day_index = index
			},
			// 点击时间
			hosts(e) {
				this.host_All = e
				this.host_index = e.timeStamp
			},
			// 点击立即预约
			sub() {
				console.info(this.timeIndex,this.timeIndexOpt)
				if (this.host_index == '') {
					uni.showToast({title: '请选择时间',icon: 'none',duration: 2000})
				} else {
					let day = this.dayArr[this.day_index]
					let time = this.time(this.host_index)
					let comTime = {
						days: day.days,
						weeks: day.weeks,
						hours: this.host_All.hours,
						timeStamp: this.host_All.timeStamp,
						time: time
					}
					this.host_index = ''
					this.$emit('getTime', comTime);
				}
			},
			// 格式化时间
			times(data) {
				let date = new Date(data * 1000);
				//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h; //小时补0
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m; //分钟补0
				return h + ':' + m
			},
			time(data, type){
				let date = new Date(data * 1000);
				//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM; //月补0
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d; //天补0
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h; //小时补0
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m; //分钟补0
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s; //秒补0
				if (type == 'yymmdd') {
					return y + '-' + MM + '-' + d
				} else if (type == 'hhmmss') {
					return h + ':' + m + ':' + s;
				} else {
					return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F4F4F4;
	}

	.calendar {
		width: 100%;
		min-height: 548rpx;
		background-color: #FFFFFF;
		margin: 20rpx auto 10rpx;
		border-radius: 8rpx;
	}

	.calendar_day {
		display: flex;
		width: 100%;
		height: 120rpx;

		.day_x {
			display: flex;
			flex-flow: column nowrap;
			justify-content: center;
			align-items: center;
			width: 20%;
			height: 100%;
			font-size: 30rpx;
			color: #333333;
		}
	}

	.calendar_time {
		display: flex;
		width: 100%;
		height: 548rpx;
		flex-flow: row wrap;
		align-content: flex-start;
		margin: 20rpx 0;
		overflow-y: auto;

		.time_x {
			display: flex;
			flex-flow: row;
			justify-content: center;
			align-items: center;
			width: 20%;
			height: 54rpx;
			border-radius: 26rpx;
			margin: 10rpx 0;
			font-size: 30rpx;
			color: #333333;
		}

		.time_x_sty {
			background-color: #FFE97B;
			color: #000000 !important;
		}
	}

	.sub {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 80rpx;
		border-radius: 50rpx;
		margin: 20rpx auto;
		color: #FFFFFF;
		font-size: 36rpx;
		background-color: #09A5A1;
	}
</style>
