<template>
	<view style="bottom-input">
		<!-- 底部输入框 -->
		<div class="chat_input_box" :style="{ paddingBottom:  showBoxTools ? '0' : deviceBottom + 'px' }">
			<slot name="input-top"></slot>
			<div class="chat_input">
				<image @click="clickVoice" class="voice_img"
					:src="isVoice? '/static/img/chat/jianpan.png' : '/static/img/chat/yuyin.png'" mode=""></image>
				<div class="conter_box">
					<template v-if="isVoice">
						<div class="voice_box" @touchstart="touchstartVoice" @touchmove.stop.prevent="touchmoveVoice"
							@touchend="touchendVoice" @touchcancel="touchcancelVoice">
							<text class="voice_text">{{voiceText}}</text>
						</div>
					</template>
					<template v-else>
						<textarea v-model="textareaVal" :hideDoneButton="true" @keyboard="keyboardInput"
							ref="textareaRef" :autofocus="false" @linechange="texTlinechange" class="textarea_input"
							@focus="textareaFocus" @blur="textareaBlur" type="text" :adjust-position="false" :style="{
							paddingTop:lineCount == 1 ? '24rpx' : '0rpx',
							paddingBottom:lineCount == 1 ? '17rpx' : '0rpx'
						}" />
					</template>
				</div>
				<image @click="clickEmoj(1)" class="emoj_img" src="/static/img/chat/biaoqing.png" mode="">
				</image>
				<div class="btn_box" v-if="!textareaVal.length == 0 && !isVoice" @click="clickMsg">
					<text class="btn_text">发送 </text>
				</div>
				<image v-else @click="clickEmoj(2)" class="add_img" src="/static/img/chat/add.png" mode="">
				</image>
			</div>
			<div :style="boxToolsStyles">
				<swiper :current="currentBoxTools - 1" class="fun_swiper" disable-touch>
					<swiper-item>
						<div class="swiper_item">
							<emoji-box @setEmoj="setEmoj" :emojiList="emojiList"></emoji-box>
						</div>
					</swiper-item>
					<swiper-item>
						<div class="swiper_item">
							<tool-box :menu="menu" @toolItem="toolItem"></tool-box>
						</div>
					</swiper-item>
				</swiper>
			</div>
		</div>
		<!-- 语音状态显示 -->
		<template v-if="voiceFlg">
			<div class="voice_bd">
				<div class="voice_ui">
					<image class="voice_ui_img" src="/static/img/chat/microphone.png"></image>
					<text class="voice_ui_text">{{voiceTis}}</text>
				</div>
			</div>
		</template>
	</view>
</template>

<script>
	import Chat from './minxi/chat.js'
	import ToolBox from "./tool.vue"
	import EmojiBox from "./emoj.vue"

	export default {
		props: {
			value: String,
			// 底部菜单
			menu: {
				type: Array,
				default: () => []
			},
			isSafeArea: Boolean
		},
		mixins: [Chat],
		components: { ToolBox, EmojiBox },
		watch: {
			value: {
				handler(val) {
					this.textareaVal = val || ''
				},
				immediate: true
			}
		}
	}
</script>

<style>
	.chat_input_box {
		width: 750rpx;
		background-color: #F8F8F8;
	}

	.chat_input {
		flex-direction: row;
		align-items: center;
		height: 108rpx;
	}

	.textarea_input {
		flex: 1;
		height: 82rpx;
		line-height: 45rpx;
		padding-left: 14rpx;
		padding-right: 14rpx;
		background-color: #FFFFFF;
		border-radius: 6rpx;
		font-size: 14px;
	}

	.voice_img {
		width: 51rpx;
		height: 51rpx;
		margin-left: 30rpx;
		margin-right: 18rpx;
	}

	.emoj_img {
		width: 51rpx;
		height: 51rpx;
		margin-left: 18rpx;
		margin-right: 13rpx;
	}

	.add_img {
		width: 51rpx;
		height: 51rpx;
		margin-left: 15rpx;
		margin-right: 30rpx;
	}

	.btn_box {
		width: 112rpx;
		height: 60rpx;
		align-items: center;
		justify-content: center;
		border-radius: 6rpx;
		background-color: #1E89FF;
		margin-right: 18rpx;
	}

	.btn_text {
		font-size: 28rpx;
		color: #FFFFFF;
	}

	.fun_swiper {
		flex: 1;
		background-color: #F8F8F8;
	}

	.swiper_item {
		flex: 1;
	}

	.conter_box {
		flex: 1;
		flex-direction: row;
	}

	.voice_box {
		flex: 1;
		height: 82rpx;
		background-color: #FFFFFF;
		border-radius: 6rpx;
		align-items: center;
		justify-content: center;
	}

	.voice_text {
		font-size: 32rpx;
		font-weight: 400;
		color: #161616;
	}

	/* 语音ui */
	.voice_bd {
		position: fixed;
		align-items: center;
		bottom: 400rpx;
		width: 750rpx;
		height: 400rpx;
	}

	.voice_ui {
		width: 320rpx;
		height: 360rpx;
		border-radius: 8rpx;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.8);
		border-radius: 8px;
	}

	.voice_ui_img {
		width: 180rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}

	.voice_ui_text {
		color: #FFFFFF;
		font-size: 30rpx;
	}

	.audio_box {
		width: 200rpx;
		height: 300rpx;
	}
</style>
