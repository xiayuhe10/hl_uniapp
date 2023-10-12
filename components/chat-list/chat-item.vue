<template>
	<view :class="classes" @click="">
		<view class="time" v-if="showTime">
			<Time :time="time"></Time>
		</view>
		<view class="chat-item" v-if="type === 'chat'">
			<image @click="avatarClick" style="align-self: flex-start;" class="avart" :src="avatar" mode=""></image>
			<view class="chat-content">
				<slot></slot>
			</view>
			<uni-load-more iconType="snow" v-if="loading" color="#999" :iconSize="16" class="loading" :contentText="{ contentrefresh: '' }" status="loading"></uni-load-more>
			<image v-if="isError && right && !loading" class="error-icon" @click="errorClick" src="/static/img/chat/wring.png" mode=""></image>
			<view class="read" v-if="!isError && !loading && showIsRead && right">
				<text class="text" :class="{ 'not-read': !isRead}">{{ isRead ? '已读' : '未读' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Time from './msg-template/time.vue'
	
	export default {
		components: { Time },
		props: {
			avatar: String,
			right: Boolean,
			loading: Boolean,
			type: {
				type: String,
				default: 'chat'
			},
			showTime: Boolean,
			time: String,
			isRead: Boolean,
			showIsRead: Boolean,
			isError: Boolean
		},
		data() {
			return {
			}
		},
		methods: {
			avatarClick() {
				if(this.right) {
					this.$emit('rightAvatarClick')
				}else {
					this.$emit('leftAvatarClick')
				}
			},
			errorClick() {
				uni.showModal({
				    title: '',
				    content: '重发该消息?',
				    success: (res) => {
				        if (res.confirm) {
				            this.$emit('retry')
				        } else if (res.cancel) {
				            
				        }
				    }
				});
			}
		},
		computed: {
			classes() {
				return ['list-item', { 'list-item-right': this.right }]
			}
		},
		created() {
		}
	}
</script>
<style lang="scss">
	.list-item {
		transform: rotate(180deg);
		direction: ltr;
		padding: 0 10px;
		.time {
			justify-content: center;
			flex-direction: row;
		}
		.chat-item {
			flex-direction: row;
			padding-bottom: 14px;
			align-items: center;
			.avart {
				width: 38px;
				height: 38px;
				border-radius: 19px;
				margin-right: 8px;
			}
			.chat-content {
			}
			.loading {
				margin-left: 4px;
			}
			.error-icon {
				width: 28px;
				height: 28px;
			}
			.read {
				width: 96upx;
				height: 48upx;
				.text {
					background: #2AA515;
					font-size: 36upx;
					border-radius: 8upx;
					transform: scale(0.6);
					text-align: center;
					color: #FFFFFF;
				}
				
				.not-read {
					background: #ff5252;
					color: #fff;
				}
			}
		}
		&.list-item-right {
			direction: rtl;
			.avart {
				margin-left: 8px;
				margin-right: 0px;
			}
		}
	}
</style>
