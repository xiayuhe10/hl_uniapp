<!-- 查询班主任的班级 -->
<template>
	<view class="content">
		<view class=" bg-white solid-bottom  padding" style="height: 100rpx;">
			<view style="float: left;">{{className?className:'暂无班级'}}</view>
			<view v-if="classList.length >1" class="text-right" @tap="classListShow" data-target="RadioModa2">
				<text class="cuIcon-sort"></text>
			</view>
		</view>
		<!--选择班级弹出框 start-->
		<view class="cu-modal" :class="modalName=='RadioModa2'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="" catchtap>
				<view class="cu-bar bg-white justify-end align-center ">
					<view class="content">选择班级</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view >
					<scroll-view scroll-y style="max-height:760rpx" @scrolltolower="scrollLower" >
						<radio-group class="block">
							<view class="cu-list menu text-left">
								<view class="cu-item" v-for="(item,index) in classList" :key="index">
									<label class="flex justify-between align-center flex-sub" @click="classcheak(item)">
										<view class="flex-sub">{{item.name}}</view>
										<radio class="round" :checked="item.id==classId"></radio>
									</label>
								</view>
							</view>
						</radio-group>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Request from '@/common/request.js';
	import webUrl from '@/common/config.js';
	export default {
		name: "classSelect",
		props: ['dateId','dateName'],
		watch: {
			dateId: {
				handler: function(val) {
					// console.log(this.dateId, "监听dateId")
					this.dateId = val?val:''
					this.classId = val?val:''
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
			dateName: {
				handler: function(val) {
					// console.log(this.dateName, "监听dateName")
					this.dateName = val?val:''
					this.className = val?val:''
				},
				immediate: true, //--首次加载时执行监听
				deep: true //--值改变时执行监听
			},
		},
		data() {
			return {
				modalName: null,
				pageNum: 1,
				pageSize: 25,
				listTotal: 25,
				isLoad: false,
				classList: [],
				className: '',
				classId: '',
			};
		},
		created() {
			this.getClassList();
		},
		methods: {
			getClassList() { //查询班主任的班级
				Request.get(Request.API.selectClassDeptUserId, {
					"pageNum": this.pageNum,
					"pageSize": this.pageSize
				}).then(res => {
					if (res.data.code == 200) {
						this.classList = res.data.rows
						if (res.data.rows.length > 0) {
							if (this.classId=='') {
								this.className = this.classList[0].name;
								this.classId = this.classList[0].id;
							}
							this.$emit('classIdShow', this.classId);
						}
						this.listTotal = res.data.total
						this.isLoad = true
						console.info('班级selclassList', this.classList)
					} else {
						uni.showToast({
							title: '班级加载失败',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			classListShow(e) { // 班级选择弹窗
				this.modalName = e.currentTarget.dataset.target
			},
			classcheak(value) { // 班级选择内容点击
				uni.showLoading({
					title: '切换中 '
				});
				this.modalName = null
				this.$emit('dataTypesChange', value);
				console.info(value.id)
			},
			scrollLower() {
				console.log('我滚动到底部了')
				if (this.pageSize <= this.listTotal) {
					this.isLoad = false
					this.pageSize = this.pageSize + 10
					this.getClassList();
				}
			},
			hideModal(e) {
				this.modalName = null
			},
		}
	}
</script>

<style>
.avatarwrap {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-height: 460rpx;
	}

	.avatarwrap .scroll-box {
		flex: 1;
		overflow: scroll;
	}
</style>
