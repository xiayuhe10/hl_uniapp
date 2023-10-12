<template>
	<view class="drag-and-drop-sort-A" :containerSize="[containerSize]">
		<template v-if="controlsPositionArray.length !== 0">
			<view v-for="(item, index) in controlsArray" :key="index" class="_item"
				:style="{'transition': (curretnControlsIndex === index ? 'initial' : '.3s'), 'z-index': (curretnControlsIndex === index ? 1 : 0), 'width': controlsSize.width + 'px', 'height': controlsSize.height + 'px', 'top': controlsPositionArray[index].top + 'px',  'left': controlsPositionArray[index].left + 'px'}">
				<view @touchstart="handleTouchstart($event, index)" @touchmove="handleTouchmove" @touchend="handleTouchend" :style="{'background': item}" style="width: 100%; height: 100%;">
					<slot name="content" :item="item"></slot>
				</view>
			</view>
		</template>
	</view>
</template>
 
<script>
	export default {
		name: "drag-and-drop-sort-A",
		props: {
			// 容器大小
			containerSize: {
				type: Object,
				default: () => ({ wdith: '100vw', height: '100vh' }),
			},
			// 控件的大小
			controlsSize: {
				type: Object,
				default: () => ({ width: 0, height: 0 }),
			},
			// 数据列表
			controlsList: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
				// 控件列表
				controlsArray: [],
				// 每行最大存放的个数
				maxWidthCount: 0,
				// 控件的间距
				margin: {
					margin_x: 10,
					margin_y: 10,
				},
				// 记录所有控件的初始位置
				recordInitControlsPoisitonList: [],
				// 控件的数据
				controlsPositionArray: [],
				// 记录当前手指的位置
				recordPosition: {
					x: 0,
					y: 0,
				},
				// 记录当前操作的控件数据
				recordControlsPositionItem: {},
				// 当前操作的控件的下标
				curretnControlsIndex: -1,
				// 是否在移动中
				isMobile: false,
			};
		},
		mounted() {
			// 获取系统信息
			this.systemInfo = uni.getSystemInfoSync();
			// 获取控件列表
			this.controlsArray = this.controlsList;
			
			// 初始化控件的位置
			this.controlsPositionArray = this.initControlsPosition();
		},
		methods: {
			/** 初始化各个控件的位置 */
			initControlsPosition() {
				// 用于返回出去的新数组
				let tempArray = [];
				// 每行最大存放的个数
				this.maxWidthCount = parseInt(this.systemInfo.windowWidth / (this.controlsSize.width + this.margin.margin_x));
 
				// 设置控件位置 - 这边多记录一个位置 之后会用到
				for(let i = 0, j = 0, k = 0; i < this.controlsList.length + 1; i++) {
					tempArray[i] = {
						left: j * (this.controlsSize.width + this.margin.margin_x) + this.margin.margin_x,
						top: k * (this.controlsSize.height + this.margin.margin_y) + this.margin.margin_y,
					}
					k = j + 1 === this.maxWidthCount ? ++k : k;
					j = j + 1 === this.maxWidthCount ? 0 : ++j;
				}
				
				// 记录数据 - 进行深拷贝
				this.recordInitControlsPoisitonList = [...tempArray];
				// 返回数据
				return tempArray;
			},
			
			/** 处理手指触摸后移动 */
			handleTouchmove(event) {
				const { pageX, pageY } = event.touches[0];
				
				// 获取移动的差
				this.$set(this.controlsPositionArray, this.curretnControlsIndex, {
					left: this.controlsPositionArray[this.curretnControlsIndex].left + (pageX - this.recordPosition.x),
					top: this.controlsPositionArray[this.curretnControlsIndex].top + (pageY - this.recordPosition.y),
				});
				// 记录位置
				this.recordPosition = { x: pageX, y: pageY };
				// 判断当前移动的位置是否需要进行排序
				// 向右移动
				if(this.curretnControlsIndex + 1 !== this.controlsList.length && (this.curretnControlsIndex + 1) % this.maxWidthCount !== 0 && this.controlsPositionArray[this.curretnControlsIndex].left + this.controlsSize.width >= this.recordInitControlsPoisitonList[this.curretnControlsIndex].left + this.controlsSize.width + this.margin.margin_x + this.controlsSize.width / 2) {
					this._handleChangeControlsPosition(this.curretnControlsIndex + 1);
				}
				// 向左移动
				else if(this.curretnControlsIndex % this.maxWidthCount !== 0 && this.controlsPositionArray[this.curretnControlsIndex].left <= this.recordInitControlsPoisitonList[this.curretnControlsIndex - 1].left + this.controlsSize.width / 2 && this.controlsPositionArray[this.curretnControlsIndex].top < this.recordInitControlsPoisitonList[this.curretnControlsIndex].top + this.controlsSize.height / 3 + this.margin.margin_y && this.controlsPositionArray[this.curretnControlsIndex].top > this.recordInitControlsPoisitonList[this.curretnControlsIndex].top - this.controlsSize.height / 3 - this.margin.margin_y) {
					this._handleChangeControlsPosition(this.curretnControlsIndex - 1);
				}
				// 向下拖动
				else if(Math.ceil(this.curretnControlsIndex / this.maxWidthCount) !== Math.ceil(this.controlsList.length / this.maxWidthCount) && this.controlsPositionArray[this.curretnControlsIndex].top + this.controlsSize.height > this.recordInitControlsPoisitonList[this.curretnControlsIndex].top + this.controlsSize.height + this.margin.margin_y + this.controlsSize.height / 2) {
					this._handleChangeControlsPosition((this.curretnControlsIndex + this.maxWidthCount) >= this.controlsArray.length ? this.controlsArray.length - 1 : this.curretnControlsIndex + this.maxWidthCount);
				}
				// 向上拖动
				else if(parseInt(this.curretnControlsIndex / this.maxWidthCount) !== 0 && this.controlsPositionArray[this.curretnControlsIndex].top < this.recordInitControlsPoisitonList[this.curretnControlsIndex].top - this.margin.margin_y - this.controlsSize.height / 3 * 2) {
					this._handleChangeControlsPosition(this.curretnControlsIndex - this.maxWidthCount);
				}
			},
			
			/** 处理手指触摸开始事件 */
			handleTouchstart(event, index) {
				const { pageX, pageY } = event.touches[0];
				
				// 记录一些数据
				this.curretnControlsIndex = index;
				this.recordPosition = { x: pageX, y: pageY };
				this.recordControlsPositionItem = this.controlsPositionArray[index];
			},
		
			/** 处理手指松开事件 */
			handleTouchend(event) {
				// 将操控的控件归位
				this.controlsPositionArray[this.curretnControlsIndex] = this.recordInitControlsPoisitonList[this.curretnControlsIndex];
				this.curretnControlsIndex = -1;
			},
			
			/**
			 * 处理交换控件位置的方法 - 
			 * @param {number} index	需要与第几个下标交换位置
			 * */
			_handleChangeControlsPosition(index) {
				// 判断是否在交换中
				if(this.isMobile) {
					return;
				}
				this.isMobile = true;
				
				// 记录当前操控的控件数据
				let tempControls = this.controlsArray[this.curretnControlsIndex];
				// 交换位置
				this.controlsArray[this.curretnControlsIndex] = this.controlsArray[index];
				this.controlsArray[index] = tempControls;
				
				// 调整控件位置数据
				this.controlsPositionArray[index] = this.controlsPositionArray[this.curretnControlsIndex];
				this.controlsPositionArray[this.curretnControlsIndex] = this.recordControlsPositionItem;
				
				// 改变当前选中的位置
				this.curretnControlsIndex = index;
				
				// 记录新位置的数据
				this.recordControlsPositionItem = this.recordInitControlsPoisitonList[this.curretnControlsIndex];
				
				// 交换结束
				this.isMobile = false;
			},
		}
	}
</script>
 
<style scoped lang="scss">
	.drag-and-drop-sort-A {
		position: relative;
		
		._item {
			position: absolute;
		}
	}
</style>