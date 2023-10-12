<template>
	<view class="content">
		<view class="container">
			<!-- 日期列表 -->
			<scroll-view class="scroll-view_H b-t b-b" scroll-x>
				<block v-for="(item,index) in dateArr" :key="index">
					<div class="flex-box" @click="selectDateEvent(index,item)" :class="{ borderb: index==dateActive}">
						<view class="date-box" :style="{color:index==dateActive?selectedTabColor:'#333'}">
							<text class="fontw">{{item.week}}</text>
							<text>{{item.date}}</text>
						</view>
					</div>
				</block>
			</scroll-view>

			<!-- 时间选项 -->
			<view class="time-box" v-if="!isSection || isQuantum">
				<template v-for="(item,_index) in timeArr">
					<view class="item" :key="_index">
						<view class="item-box" :class="{'disable':item.disable,
						'active':isMultiple?item.isActive:_index==timeActive}" :style="{color:isMultiple?item.isActive? selectedItemColor:'#333'
						 :_index==timeActive?selectedItemColor:'#333'}" @click="selectTimeEvent(_index,item)">
							<text v-if="isQuantum">{{item.begin}}~{{item.end}}</text>
							<text v-else>{{item.time}}</text>
							<text class="all">{{item.disable?disableText:undisableText}}</text>
						</view>
					</view>
				</template>
			</view>
			<!-- 预约时间段 -->
			<view class="time-box" v-else>
				<template v-for="(item,_index) in timeArr">
					<view class="item" :key="_index">
						<!-- 'disable':item.disable || item.isInclude, -->
						<view class="item-box" :class="{'disable':item.disable , 'active':item.time == timeQuanBegin || item.time == timeQuanEnd }  "
							:style="{color:item.time == timeQuanBegin || item.time == timeQuanEnd||item.isInclude? selectedItemColor:'#333',}"
							@click="handleSection(_index,item)">
							<text>{{item.begin}}~{{item.end}}</text>
							<text class="all">{{item.disable?disableText:undisableText}}</text>
						</view>
					</view>
				</template>
			</view>
		</view>
		<view class="padding-lg"></view>
		<view class="bottom">
			<view class="show-time" v-if="!isMultiple && !isSection && !isQuantum">
				预约时间：{{orderDateTime}}
			</view>
			<button form-type="submit" type="default" size="mini" style="width: 100%;" class="submit-btn" @click="handleSubmit">
				确认预约
			</button>

		</view>
	</view>
</template>

<script>
	import {
		initData,
		initTime,
		timeStamp,
		currentTime
	} from '../utils/date.js'
	import dateTime from '@/common/dateTime.js';
	export default {
		name: 'times',
		model: {
			prop: "showPop",
			event: "change"
		},
		props: {
			isQuantum: {
				type: Boolean,
				default: false
			},
			isMultiple: { //是否多选
				type: Boolean,
				default: false
			},
			isSection: { //预约时间段
				type: Boolean,
				default: false
			},
			disableText: { //禁用显示的文本
				type: String,
				default: "不可预约"
			},
			undisableText: { //未禁用显示的文本
				type: String,
				default: "可预约"
			},
			timeInterval: { // 时间间隔，小时为单位
				type: Number,
				default: 1
			},
			selectedTabColor: { // 日期栏选中的颜色
				type: String,
				default: "#FB4B5C"
			},
			selectedItemColor: { // 时间选中的颜色
				type: String,
				default: "#FB4B5C"
			},
			beginTime: {
				type: String,
				default: "00:00:00"
			},
			endTime: {
				type: String,
				default: "23:59:59"
			},
			appointTime: { // 预约的时间
				type: Array,
				default () {
					return []
				}
			},
			disableTimeSlot: { // 预约开始和结束时间，来禁用时间段
				type: Array,
				default () {
					return []
				}
			}
		},
		watch: {
			appointTime: {
				handler(val) {
					if (val && val.length) {
						this.initOnload()
					}
				}
			},
			disableTimeSlot: {
				handler: function(val) {
					// console.log(val, "监听disableTimeSlot")
					this.disableTimeSlot = val?val:''
					this.initOnload()
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
		},
		data() {
			return {
				orderDateTime: '暂无选择', // 选中时间
				orderTimeArr: {}, //多选的时间
				dateArr: [], //日期数据
				timeArr: [], //时间数据
				nowDate: "", // 当前日期
				dateActive: 0, //选中的日期索引
				timeActive: 0, //选中的时间索引
				timeQuanBeginIndex: 0, //时间段开始的下标
				selectDate: "", //选择的日期
				timeQuanBegin: "", //时间段开始时间
				timeQuanEnd: "", //时间段结束时间
				timeQuanList: '',
				timeQuanListEnd: '',
				timeQuanListStr: ''
			}
		},
		created(props) {
			this.selectDate = this.nowDate = currentTime().date
			this.initOnload()
		},
		methods: {
			initOnload() {
				this.dateArr = initData() // 日期栏初始化
				this.timeArr = initTime(this.beginTime, this.endTime, this.timeInterval, this.isQuantum) //时间选项初始化
				// console.info(this.timeArr)
				// this.timeArr.push({
				// 	begin:"23:30",
				// 	disable: false,
				// 	end: "23:59",
				// 	isInclude:false,
				// 	time:"23:59"
				// })
				this.timeQuanBegin = this.timeQuanEnd = ""
				let isFullTime = true
				let cur_end_time = ''
				this.timeArr.forEach((item, index) => {
					// 时间段
					if (this.isQuantum) {
						const cur_be_time = `${this.selectDate} ${item.begin}:00`
						if (item.begin=='23:30' && item.end=='00:00') {
							cur_end_time = `${this.selectDate} 23:59:00`
						}else{
							cur_end_time = `${this.selectDate} ${item.end}:00`
						}
						// console.info(cur_be_time,'--------',cur_end_time)
						for (let time of this.disableTimeSlot) {
							const [begin_time = "", end_time = ""] = time
							if (begin_time && end_time && (begin_time <= cur_be_time && cur_end_time <= end_time)) {
								// console.info(begin_time,end_time,cur_be_time,cur_end_time)
								item.disable = true
							}
						}
						if (this.selectDate == this.nowDate && currentTime().time > `${item.begin}:00`) {
							// console.info(this.selectDate,this.nowDate,currentTime().time,item.begin)
							item.disable = true
						}

					} else {
						//判断是当前这一天，选中时间小于当前时间则禁用
						if (this.selectDate == this.nowDate && currentTime().time > item.time) {
							item.disable = true
						}
						// 将预约的时间禁用
						this.appointTime.forEach(t => {
							let [date, time] = t.split(' ')
							if (date == this.selectDate && item.time == time) {
								item.disable = true
							}
						})
						// 禁用时间段 
						const cur_time = `${this.selectDate} ${item.end}`
						for (let time of this.disableTimeSlot) {
							const [begin_time = "", end_time = ""] = time
							if (begin_time && end_time && (begin_time <= cur_time && cur_time <= end_time)) {
								item.disable = true
							}
						}
						// 判断是否当前日期时间都被预约
						if (!item.disable) {
							isFullTime = false
						}
						this.isSection && (item.isInclude = false)
						// 对多选操作的已选时间的回显
						if (this.isMultiple && (this.orderTimeArr[this.selectDate] || []).includes(item.time)) {
							item.isActive = true
						}
					}
				})
				this.orderDateTime = isFullTime ? "暂无选择" : this.selectDate
				this.timeActive = -1
				for (let i = 0, len = this.timeArr.length; i < len; i++) {
					if (!this.timeArr[i].disable) {
						this.orderDateTime = `${this.selectDate} ${this.timeArr[i].time}`
						this.timeActive = i
						return
					}
				}
			},

			// 日期选择事件
			selectDateEvent(index, item) {
				this.dateActive = index
				this.selectDate = item.date
				this.initOnload()
			},

			// 时间选择事件
			selectTimeEvent(index, item) {
				if (this.isQuantum) {
					return this.handleSelectQuantum(index, item)

				}
				if (item.disable) return
				if (this.isMultiple) {
					item.isActive = !item.isActive
					this.timeArr = this.timeArr.slice()
					this.orderTimeArr[this.selectDate] = this.timeArr.reduce((prev, cur) => {
						cur.isActive && prev.push(cur.time)
						return prev
					}, [])
				} else {
					this.timeActive = index
					this.orderDateTime = `${this.selectDate} ${item.time}`
				}
			},

			// 选择时间段
			handleSection(index, item) {
				// console.info(item)
				if (item.disable) return
				function clearTime() {
					this.timeQuanBeginIndex = index
					this.timeQuanBegin = item.time
					this.timeQuanEnd = ""
					this.timeQuanListEnd = item.end
					this.timeQuanListStr = item.begin
					this.timeQuanList = item
				}
				if (!this.timeQuanBegin) {
					this.timeQuanListStr = item.begin
					this.timeQuanListEnd = item.end
					clearTime.call(this)
					return
				}
				if (!this.timeQuanEnd && this.timeQuanBegin) {
					let isDisble = false
					let start = this.timeQuanBeginIndex
					let end = index
					start > end && ([start, end] = [end, start])
					for (let i = start + 1; i < end; i++) {
						if (this.timeArr[i].disable) {
							isDisble = true
							clearTime.call(this)
							return
						}
					}
					if (!isDisble) {
						for (let i = start + 1; i < end; i++) {
							this.timeArr[i].isInclude = true
						}
					}
					this.timeQuanEnd = item.time
					this.timeQuanListEnd = item.end
					return
				}

				if (this.timeQuanBegin && this.timeQuanEnd) {
					this.timeArr.forEach(t => {
						t.isInclude = false
					})
					clearTime.call(this)
				}

			},
			handleSelectQuantum(index, item) {
				if (item.disable) return
				if (this.isMultiple) {
					item.isActive = !item.isActive
					this.timeArr = this.timeArr.slice()
					this.orderTimeArr[this.selectDate] = this.timeArr.reduce((prev, cur) => {
						const cur_be_time = `${this.selectDate} ${cur.begin}:00`
						const cur_end_time = `${this.selectDate} ${cur.end}:00`
						cur.isActive && prev.push([cur_be_time, cur_end_time])
						return prev
					}, [])
				} else {
					this.timeActive = index
					this.orderDateTime = {
						begin: `${this.selectDate} ${item.begin}:00`,
						end: `${this.selectDate} ${item.end}:00`,
					}
				}

			},
			handleChange() {
				this.timeQuanBegin > this.timeQuanEnd && ([this.timeQuanBegin, this.timeQuanEnd] = [this.timeQuanEnd, this.timeQuanBegin ])
				this.timeQuanList.end > this.timeQuanListEnd && ([this.timeQuanList.end, this.timeQuanListEnd] = [this.timeQuanListEnd,this.timeQuanList.end])
			},
			handleSubmit() {
				if (this.isSection) {
					this.handleChange()
					// if (this.timeQuanBegin=='') {
					// 	uni.showToast({ title: '请选择时间段', icon: 'none', duration: 2000 })
					// 	return
					// }
					// console.info(this.timeQuanList,this.timeQuanListEnd,this.timeQuanEnd)
					let start = ''
					if (this.timeQuanBegin!='') { start = this.timeQuanBegin }else{ start = this.timeQuanList.begin }
					this.$emit('change', {
						beginTime: `${this.selectDate} ${start}`,
						endTime: `${this.selectDate} ${this.timeQuanListEnd}`,
						startTime: this.selectDate,
						startTimeStr:start,
						endTimeStr:this.timeQuanEnd
					})
					return
				}
				if (this.isMultiple) {
					let time = []
					let pushTime = {}
					for (let date in this.orderTimeArr) {
						this.orderTimeArr[date].forEach(item => {
							pushTime= {
								startTime: date,
								beginTime: item[0],
								endTime: item[1]
							}
							this.isQuantum ? time.push(item) : time.push(`${date} ${item}`)
						})
					}
					this.$emit('change', pushTime)
				} else {
					this.$emit('change', this.orderDateTime)
				}

			}
		}
	}
</script>
<style lang="scss" scoped>
	@import './pretty-times.scss';

	page {
		height: 100%;
	}

	.content {
		text-align: center;
		height: 100%;
	}

	/* 两个按钮 */
	.bottom {
		display: flex;
		flex-direction: row;
		position: fixed;
		bottom: 0px;
		top: auto;
		left: 0px;
		width: 100%;
		padding: 5rpx;
		background-color: #fff;
	}

	.show-time {
		width: 70%;
		height: 47px;
		color: #505050;
		background-color: rgba(255, 255, 255, 1);
		font-size: 15px;
		line-height: 47px;
		text-align: center;
	}

	.submit-btn {
		width: 25%;
		height: 40px;
		color: white;
		background-color: #CA89FF;
		font-size: 15px;
		line-height: 40px;
		text-align: center;
		margin: auto;
		padding: 0;
	}

	.fontw {
		font-weight: bold;
	}

	.borderb {
		border-bottom: 2px solid #FB4B5C;
	}
</style>
