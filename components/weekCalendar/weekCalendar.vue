<template>
	<view class="xweek_box">
		<view class="cal-top flex justify-between align-center">
			<view class="prev" @click="changeWeek('prev')" v-if="prevActive"><text class="cuIcon-backwardfill"></text>上周</view>
			<!-- <view class="date" ref="t1">{{ nowSelectDateString }}</view> -->
			<view class="next" @click="changeWeek('next')" v-if="prevActive">下周<text class="cuIcon-play_forward_fill"></text></view>
			<!-- <text @click="changeWeek('prev')" v-if="prevActive"><text class="i prev_i"></text></text>
			<text class="ym_text">周</text>
			<text @click="changeWeek('next')" v-if="prevActive"><text class="i next_i"></text></text> -->
		</view>
		<view class="flex">
			<view class="top-text padding-top-sm padding-left-xspadding-right-xs mFontSize flex flex-direction align-center" style="width: 12%;">
				<view class="padding-top-xs " style="font-weight: bold;font-size: 40rpx;">{{monDay}}</view>
				<view class=" padding-top-xs " style="font-size: 30rpx;">月</view>
			</view>
			<view class="cal-content" style="width: 88%;">
				<view class="cal-ul cal-weeks">
					<view class="cal-li" v-for="(item, i) of baseData.weekTitles" :key="i"><text>{{ item }}</text></view>
				</view>
				<swiper :current="current" ref="calSwiper" class="cal-swiper" :duration="200" circular
					@animationfinish="swiperFisnish">
					<swiper-item v-for="(days, i) of weeks" :key="i">
						<view class="cal-ul cal-days">
							<!-- <view class="cal-li" v-for="(item, j) of days" :key="j" @click="changeSelected(item)"> -->
							<view class="cal-li" v-for="(item, j) of days" :key="j">
								<view class="cal-day-li"
									:class="{ 'cal-day-li-selected': item.timeSpan == baseData.selectedDate.timeSpan }"
									:style="{ color: item.ym == baseData.selectedDate.ym ? '#333' : '#999' }">
									<text>{{ item.d }}</text>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * weekCalendar 周日历选择组件
	 * @description 日历选择某一天的组件
	 * @bug 因是使用swiper组件开发快速滑动多屏 无法触发 @animationfinish 导致展示异常
	 * @property {Number} defaultDate 默认时间时间戳
	 * @event {Function} changeDate 当前选中日期发生改变
	 * @example <chenmushan-week-calendar @changeDate="changeDate"></chenmushan-week-calendar>
	 */
	export default {
		props: {
			defaultDate: {
				type: Number,
				default: 0
			},
			prevActive: {
				type: Boolean,
				default: true
			},
			nextActive: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				weeks: [],
				propDate: null,
				current: 0,
				baseData: {
					weekTitles: ['一', '二', '三', '四', '五', '六', '日'],
					current: 0,
					selectedDate: {
						d: null, // 在当前月份中的天
						ym: '', // 年月拼接
						timeSpan: 0 // 时间戳
					}
				},
				monDay: 1,
			};
		},
		mounted() {
			this.propDate = this.defaultDate == 0 ? new Date() : new Date(this.defaultDate);
			this.initData();
		},
		methods: {
			initData() {
				let lastSat = new Date(this.propDate);
				let day = lastSat.getDate() < 10 ? "0" + lastSat.getDate() : lastSat.getDate();
				this.$set(this.baseData, 'selectedDate', {
					d: lastSat.getDate(),
					ym: `${lastSat.getFullYear()}-${lastSat.getMonth() + 1}-${day}`,
					timeSpan: +lastSat,
					m: new Date(lastSat)
				});
				// 寻找到距离当前日期最近的周六
				while (lastSat.getDay() != 0) lastSat.setDate(lastSat.getDate() + 1);
				this.$set(this.weeks, 0, this.getWeekDaysByLastSat(lastSat));
				this.$set(this.weeks, 1, this.getWeekDaysByWeeks(this.weeks[0], true));
				this.$set(this.weeks, 2, this.getWeekDaysByWeeks(this.weeks[0], false));
				this.current = 0;
				this.$emit("weeks", this.weeks[0]);
				let dateing = Date.parse(new Date());
				let date = new Date(dateing);
				let month = date.getMonth() + 1 < 10 ? (date.getMonth() + 1) : date.getMonth() + 1;
				this.monDay = month
			},
			swiperFisnish(e) {
				let current = e.detail.current;
				this.changeWeeks(current > this.baseData.current, current);
				this.$set(this.baseData, 'upCurrIndex', current);
			},
			changeWeeks(direction, current) {
				let nextIndex = current + 1 > 2 ? 0 : current + 1;
				let prevIndex = current - 1 < 0 ? 2 : current - 1;
				this.$set(this.weeks, nextIndex, this.getWeekDaysByWeeks(this.weeks[current], true));
				this.$set(this.weeks, prevIndex, this.getWeekDaysByWeeks(this.weeks[current], false));
				this.monDay = this.weeks[1][1].m.getMonth() + 1

			},
			// 修改周时间
			changeWeek(type) {
				let current = this.current;
				let nextIndex = current + 1 > 2 ? 0 : current + 1;
				let prevIndex = current - 1 < 0 ? 2 : current - 1;
				if (type == 'prev') {
					this.current = prevIndex;
				} else {
					this.current = nextIndex;
				}
			},
			// 通过周六数据获取一周的数据
			getWeekDaysByLastSat(lastSat) {
				lastSat = new Date(lastSat);
				let reuslt = [];
				let day = ''
				for (var i = 0; i < 7; i++) {
					day = lastSat.getDate() < 10 ? "0" + lastSat.getDate() : lastSat.getDate();
					reuslt.push({
						d: lastSat.getDate(),
						ym: `${lastSat.getFullYear()}-${lastSat.getMonth() + 1}-${day}`,
						timeSpan: +lastSat,
						m: new Date(lastSat)
					});

					lastSat.setDate(lastSat.getDate() - 1);
				}
				return reuslt.reverse();
			},
			// 通过一周的数据获取本周的上周或下周
			getWeekDaysByWeeks(weeks, direction) {
				// 下周
				if (direction) {
					this.$emit("changeWeeks", weeks);
					let nextLastSat = new Date(weeks[weeks.length - 1].timeSpan);
					nextLastSat.setDate(nextLastSat.getDate() + 7);
					return this.getWeekDaysByLastSat(nextLastSat);
				}
				// 上周
				else {
					this.$emit("changeWeeks", weeks);
					let prevLstSat = new Date(weeks[0].timeSpan);
					prevLstSat.setDate(prevLstSat.getDate() - 1);
					return this.getWeekDaysByLastSat(prevLstSat);
				}
			},
			// 修改当前选中
			changeSelected(item) {
				console.log('item::', item);
				if (this.baseData.selectedDate.timeSpan != item.timeSpan) {
					this.$set(this.baseData, 'selectedDate', {
						...item,
						m: new Date(item.timeSpan)
					});

					this.$emit('changeDate', this.baseData.selectedDate);
				}
			}
		},
		computed: {
			nowSelectDateString() {
				let m = this.baseData.selectedDate.m;
				return m ? `${m.getFullYear()}年${m.getMonth() + 1}月${m.getDate()}日` : '';
			}
		},
		watch: {
			defaultDate: {
				handler(newVal, oldVal) {
					this.propDate = this.defaultDate == 0 ? new Date() : new Date(this.defaultDate);
					// this.initData();
				},
				immediate: true
			}
		}
	};
</script>

<style lang="scss" scoped>
	.cal {
		width: 690rpx;
		height: 254rpx;
		background: #fff;
		margin: 0 auto;
		border-radius: 30rpx;
		overflow: hidden;
	}

	.mFontSize {
		height: 100%;
		padding-bottom: 33rpx;
		font-size: 16px;
		background-color: #fff;
		color: #2E9C9B;
		font-weight: bold;
	}

	.mMFontTop {
		margin-top: 8px;
	}

	/* 周日期样式*/
	.xweek_box {
		width: 100%;
		height: 254rpx;
		background: #FFFFFF;
		color: #888;
		font-size: 12px;

	}

	.xweek_ym {
		font-size: 14px;
		line-height: 36px;

		text-align: center;
	}

	.xweek_ym .ym_text {
		margin: 0 30upx;
	}

	.xweek_ym .i {
		display: inline-block;
		width: 0;
		height: 0;
		border-color: transparent;
		border-style: dashed;
		border-width: 8px;
		margin-top: -3px;
		vertical-align: middle;
	}

	.xweek_ym .next_i {
		margin-right: 5px;
		border-left-color: #58A1DF
	}

	.xweek_ym .prev_i {
		margin-left: 5px;
		border-right-color: #58A1DF
	}

	.cal-top {
		position: relative;
		width: 100%;
		height: 91rpx;
		// background: #3ea3ff;
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		line-height: 91rpx;
		text-align: center;
		// display: flex;
		// justify-content: space-between;
		box-sizing: border-box;
		margin: 0 30rpx;


		.prev,
		.next {
			// color: #ffffff;
			color: #333333;
			font-size: 26rpx;
		}

		.prev {
			color: #2E9C9B;
			// float: left;
		}

		.next {
			color: #2E9C9B;
			// float: right;
			margin-right: 65rpx;
		}

		.date {
			// position: absolute;
			// width: 100%;
			// height: 100%;
			// display: flex;
			// align-items: center;
			// justify-content: center;
			font-size: 34rpx;
			font-weight: bold;
			// color: #ffffff;
			color: #333333;
			pointer-events: none;
		}
	}

	.cal-content {
		padding: 15rpx 0 40rpx;
	}

	.cal-swiper {
		margin-top: 20rpx;
	}

	.cal-ul {
		position: relative;
		display: flex;
		justify-content: space-between;

		.cal-li {
			width: calc(100% / 7);
			text-align: center;
		}
	}

	.cal-weeks {
		font-size: 28rpx;
		font-weight: 700;
		color: #888;
	}

	.cal-days {
		font-size: 30rpx;
		color: #333;
	}

	.cal-day-li {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 63rpx;
		height: 63rpx;
		margin: 0 auto;
	}

	.cal-day-li-selected {
		background-color: #2E9C9B;
		border-radius: 50%;
		color: #fff !important;
	}
</style>
