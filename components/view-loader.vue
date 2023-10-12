<template name="pre_loading_full">
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="page" v-bind:style="{ height: t_height + 'px' , width: t_width + 'px' }" v-show="show_wx_loading">
			<cover-view class="controls-title load_title">{{ loading_title }}</cover-view>
		</view>
		<!-- #endif -->
		<view id="loader-wrapper" v-show="show_loading">
			<view id="loader"></view>
			<view class="loader-section section-left"></view>
			<view class="loader-section section-right"></view>
			<view class="load_title">
				{{ loading_title }}
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "pre_loading_full",
		data() {
			return {
				show_loading: false,
				show_wx_loading: false,
				t_height: 0,
				t_width: 0,
				loading_title: '数据加载中，请稍后'
			};
		},
		methods: {
			pre_loading: function(val) {

				var type = '';
				type = uni.getSystemInfoSync().platform;
				if (type == 'android' || type == 'ios') {
					this.show_loading = val ? true : false;
					this.beginLoading();
				} else if (type == 'devtools') {
					this.show_loading = false;
					this.show_wx_loading = val ? true : false;

					if (this.show_wx_loading) {
						this.t_height = uni.getSystemInfoSync().windowHeight;
						this.t_width = uni.getSystemInfoSync().windowWidth;
					} else {
						this.t_height = 0;
						this.t_width = 0;
					}

					this.beginLoading2();
				} else {
					this.show_loading = val ? true : false;;
					this.beginLoading();
				}

			},
			beginLoading: function() {
				var bl;
				var num = 1;
				var that = this;
				bl = setInterval(function() {
					that.loading_title = that.loading_title + '.';
					num = num + 1;
					if (num > 6) {
						num = 1;
						that.loading_title = '数据加载中，请稍后';
					}
					if (!that.show_loading) {
						clearInterval(bl);
					}
				}, 500);
			},
			beginLoading2: function() {
				var bl;
				var num = 1;
				var that = this;
				bl = setInterval(function() {
					that.loading_title = that.loading_title + '.';
					num = num + 1;
					if (num > 6) {
						num = 1;
						that.loading_title = '数据加载中，请稍后';
					}
					if (!that.show_wx_loading) {
						clearInterval(bl);
					}
				}, 500);
			}
		}
	}
</script>

<style scoped>
	/* 微信部分 */
	.page {
		display: flex;
		justify-content: center;
		background: rgba(25, 63, 101, 0.15);
		padding: 0px;
		position: absolute;
		left: 0px;
		top: 0px;
	}

	.controls-title {
		padding-top: 80%;
		;
	}

	/* H5部分 */
	.chromeframe {
		margin: 0.2em 0;
		background: #ccc;
		color: #000;
		padding: 0.2em 0;
	}

	#loader-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999999;
	}

	#loader {
		display: block;
		position: relative;
		left: 50%;
		top: 50%;
		width: 50px;
		height: 50px;
		margin: 0 0 0 -30px;
		border-radius: 50%;
		border: 3px solid transparent;
		/* COLOR 1 */
		border-top-color: #fff;
		-webkit-animation: spin 2s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		-ms-animation: spin 2s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		-moz-animation: spin 2s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		-o-animation: spin 2s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		animation: spin 2s linear infinite;
		/* Chrome, Firefox 16+, IE 10+, Opera */
		z-index: 1001;
	}

	#loader:before {
		content: "";
		position: absolute;
		top: 5px;
		left: 5px;
		right: 5px;
		bottom: 5px;
		border-radius: 50%;
		border: 3px solid transparent;
		/* COLOR 2 */
		border-top-color: #fff;
		-webkit-animation: spin 3s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		-moz-animation: spin 3s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		-o-animation: spin 3s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		-ms-animation: spin 3s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		animation: spin 3s linear infinite;
		/* Chrome, Firefox 16+, IE 10+, Opera */
	}

	#loader:after {
		content: "";
		position: absolute;
		top: 15px;
		left: 15px;
		right: 15px;
		bottom: 15px;
		border-radius: 50%;
		border: 3px solid transparent;
		border-top-color: #fff;
		/* COLOR 3 */
		-moz-animation: spin 1.5s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		-o-animation: spin 1.5s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		-ms-animation: spin 1.5s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		-webkit-animation: spin 1.5s linear infinite;
		/* Chrome, Opera 15+, Safari 5+ */
		animation: spin 1.5s linear infinite;
		/* Chrome, Firefox 16+, IE 10+, Opera */
	}

	@-webkit-keyframes spin {
		0% {
			-webkit-transform: rotate(0deg);
			/* Chrome, Opera 15+, Safari 3.1+ */
			-ms-transform: rotate(0deg);
			/* IE 9 */
			transform: rotate(0deg);
			/* Firefox 16+, IE 10+, Opera */
		}

		100% {
			-webkit-transform: rotate(360deg);
			/* Chrome, Opera 15+, Safari 3.1+ */
			-ms-transform: rotate(360deg);
			/* IE 9 */
			transform: rotate(360deg);
			/* Firefox 16+, IE 10+, Opera */
		}
	}

	@keyframes spin {
		0% {
			-webkit-transform: rotate(0deg);
			/* Chrome, Opera 15+, Safari 3.1+ */
			-ms-transform: rotate(0deg);
			/* IE 9 */
			transform: rotate(0deg);
			/* Firefox 16+, IE 10+, Opera */
		}

		100% {
			-webkit-transform: rotate(360deg);
			/* Chrome, Opera 15+, Safari 3.1+ */
			-ms-transform: rotate(360deg);
			/* IE 9 */
			transform: rotate(360deg);
			/* Firefox 16+, IE 10+, Opera */
		}
	}

	#loader-wrapper .loader-section {
		position: fixed;
		top: 0;
		width: 50%;
		height: 100%;
		background: rgba(25, 63, 101, 0.15);
		/* Old browsers */
		z-index: 1000;
		-webkit-transform: translateX(0);
		/* Chrome, Opera 15+, Safari 3.1+ */
		-ms-transform: translateX(0);
		/* IE 9 */
		transform: translateX(0);
		/* Firefox 16+, IE 10+, Opera */
	}

	#loader-wrapper .loader-section.section-left {
		left: 0;
	}

	#loader-wrapper .loader-section.section-right {
		right: 0;
	}

	/* Loaded */
	.loaded #loader-wrapper .loader-section.section-left {
		-webkit-transform: translateX(-100%);
		/* Chrome, Opera 15+, Safari 3.1+ */
		-ms-transform: translateX(-100%);
		/* IE 9 */
		transform: translateX(-100%);
		/* Firefox 16+, IE 10+, Opera */
		-webkit-transition: all 0.5s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
		transition: all 0.5s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
	}

	.loaded #loader-wrapper .loader-section.section-right {
		-webkit-transform: translateX(100%);
		/* Chrome, Opera 15+, Safari 3.1+ */
		-ms-transform: translateX(100%);
		/* IE 9 */
		transform: translateX(100%);
		/* Firefox 16+, IE 10+, Opera */
		-webkit-transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
		transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	}

	.loaded #loader {
		opacity: 0;
		-webkit-transition: all 0.3s ease-out;
		transition: all 0.3s ease-out;
	}

	.loaded #loader-wrapper {
		visibility: hidden;
		-webkit-transform: translateY(-100%);
		/* Chrome, Opera 15+, Safari 3.1+ */
		-ms-transform: translateY(-100%);
		/* IE 9 */
		transform: translateY(-100%);
		/* Firefox 16+, IE 10+, Opera */
		-webkit-transition: all 0.3s 1s ease-out;
		transition: all 0.3s 1s ease-out;
	}

	/* JavaScript Turned Off */
	.no-js #loader-wrapper {
		display: none;
	}

	.no-js h1 {
		color: #222222;
	}

	#loader-wrapper .load_title {
		font-family: "Open Sans";
		font-size: 16px;
		width: 100%;
		text-align: center;
		z-index: 9999999999999;
		position: absolute;
		top: 60%;
		opacity: 1;
		line-height: 30px;

	}

	#loader-wrapper .load_title span {
		font-weight: normal;
		font-style: italic;
		font-size: 16px;
		color: #fff;
		opacity: 0.5;
	}
</style>
