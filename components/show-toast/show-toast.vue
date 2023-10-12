<template>
	<view class="_showToast" v-show="show">
		<view class="_shade"></view>
		<view class="_ToastBox">
			<view class="Toast-box ">
				<!-- <view style="height: 10px;"></view> -->
				<view>
					<image v-if="icon=='success'" class="Toast-icon" src="@/static/broadcast/Experience.png"></image>
				</view>
				<view v-if="icon=='success'" class="Toast-title-success">{{title}}</view>
				<view>
					<image v-if="icon=='fail'" class="Toast-icon" src="@/static/broadcast/Experience.png"></image>
				</view>
				
				<view v-if="icon=='fail'" class="Toast-title-fail">{{title}}</view>
				<view class="Toast-subtitle">{{content}}</view>
			</view>
		</view>	
	</view>
</template>
 
<script>
	export default {
		name:"show-toast",
		data() {
			return {
				
			};
		},
		computed: {
			show(){
				return this.$toastStore.state.show;
			},
			title(){
				return this.$toastStore.state.title;
			},
			content(){
				return this.$toastStore.state.content;
			},
			icon(){
				return this.$toastStore.state.icon;
			}	
		},
		mounted() {
			setTimeout(()=>{
				this.$toastStore.commit('hideToast')
				// this.$toastStore.commit('success',"confirm")
			},3000)
		},
		methods:{
			closeToast(){
				this.$toastStore.commit('hideToast')
			},
			clickBtn(res){
				this.$toastStore.commit('hideToast')
				this.$toastStore.commit('success',res)
			}
		},
		beforeDestroy(){
			this.$toastStore.commit('hideToast')
		},
	}
</script>
 
<style lang="scss" scoped>
._showToast{
	position: fixed;
	top: 0;
	left:0;
	width: 100%;
	height: 100%;
	z-index:10000;
	._shade{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		// background: #000;
		opacity: .6;
		z-index:11000;
	}
	._ToastBox{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index:12000;
		display: flex;
		justify-content: center;
		align-items: center;
		.Toast-box{
			  position: absolute;
			  // width: 238.5px;
			  // min-height: 169.75px;
			  top:50%;
			  left: 50%;
			  transform: translate(-50%,-50%);
			  padding:50rpx;
			  // background: #FFFFFF;
			  background: #000;
			  opacity: .7;
			  box-shadow: 0px 10px 20px 0px rgba(28, 23, 47, 0.2);
			  border-radius: 14px;
			  display: flex;
			  flex-direction: column;
			  align-items: center;
			  .Toast-icon{
				  width: 71px;
				  height: 71px;
				  margin-top: 5px;
				  display: block;
				  // margin-top:17px;
			  }
			  .Toast-title-fail{
				  font-size: 20px;
				  font-family: Source Han Sans CN;
				  font-weight: bold;
				  color: #EC4E4E;
				  // margin-top: 18px;
			  }
			  .Toast-title-success{
				  font-size: 14px;
				  font-family: Source Han Sans CN;
				  // font-weight: bold;
				  color: #40565C;
				  // margin-top: 18px;
			  }
			  .Toast-subtitle{
				  font-size: 17px;
				  font-family: Source Han Sans CN;
				  font-weight: bold;
				  color: #ffffff;
				  // color: #666666;
				  margin-top: 6px;
				  padding: 0 12px 12px 12px;
			  }
		}
	}				
}	
</style>
 