<template>
	<view>
		<picker class="address" mode="multiSelector" :value="addressSelectListData" @columnchange="addressColumnchange"
			@change="addressChange" :range="addressListData">
			<view class="noneAddress text-gray text-left" v-if="!addressStr">请选择收货地址</view>
			<view class="haveAddress" v-else>
				{{ addressStr }}
			</view>
		</picker>
	</view>
</template>
<script>
	import chinaAddress from './citydata';
	export default {
		data() {
			return {
				chinaAddress: [], // 全国省市区
				addressListData: [], // 全国省市区
				addressSelectListData: [0, 0, 0], // 当前选择的省市区 index
				addressStr: '' // 当前选择的省市区
			};
		},
		mounted() {
			this.chinaAddress = chinaAddress;
			// 获取全国省份
			this.getProvince();
		},

		methods: {
			// 获取全国省份list
			getProvince() {
				const chinaAddress = this.chinaAddress;
				const provinceListData = [];
				for (const province_key in chinaAddress) {
					provinceListData.push(chinaAddress[province_key].label);
				}
				this.addressListData[0] = provinceListData;
				// 默认加载第一个省份的城市
				this.getCity(provinceListData[0]);
			},

			// 根据省份获取城市
			getCity(province) {
				// 获取省份对象
				const chinaAddress = this.chinaAddress;
				const chinaAddress_Item = chinaAddress.find((item) => {
					return item.label === province;
				});
				// 获取城市list
				const cityChildren = chinaAddress_Item.children;
				if (!cityChildren) {
					// 如果省份没有市区 清空上次的市区和区域数据
					this.addressListData[1] = '';
					this.addressListData[2] = '';
					return;
				}
				// 解析城市list
				const cityListData = [];
				for (const city_key in cityChildren) {
					cityListData.push(cityChildren[city_key].label);
				}
				this.addressListData[1] = cityListData;
				// 默认加载第一个省份的第一个城市的区域
				this.getCounty(province, cityListData[0]);
			},

			// 根据省份和城市 获取区域
			getCounty(province, city) {
				// 获取省份对象
				const chinaAddress = this.chinaAddress;
				const chinaAddress_Item = chinaAddress.find((item) => {
					return item.label === province;
				});
				// 获取城市list
				const cityChildren = chinaAddress_Item.children;

				// 根据城市获取区域
				const cityChildren_item = cityChildren.find((item) => {
					return item.label === city;
				});

				// 解析区域list
				const countyListData = [];
				if (cityChildren_item.children) {
					for (const county_key in cityChildren_item.children) {
						countyListData.push(cityChildren_item.children[county_key].label);
					}
				} else {
					countyListData.push(cityChildren_item.label);
				}
				this.addressListData[2] = countyListData;
			},
			// 配送区域更新
			addressColumnchange(e) {
				const {
					column,
					value
				} = e.detail;
				this.addressSelectListData[column] = value;
				// 当前选择的节点地址
				const selectItem = this.addressListData[column][value];
				if (column === 0) {
					// 根据省份获取城市
					this.getCity(selectItem);
				} else if (column === 1) {
					// 获取当前城市的省份
					const province = this.addressListData[0][this.addressSelectListData[0]];
					// 根据省份和城市获取区域
					if (selectItem) {
						this.getCounty(province, selectItem);
					}
				}
				this.$forceUpdate();
			},
			// 配送区域确定
			addressChange(e) {
				const {
					value
				} = e.detail;
				// 获取省、市、区
				let province = this.addressListData[0][value[0]];
				let city = this.addressListData[1][value[1]];
				let county = this.addressListData[2][value[2]];
				// 如果城市 === 区域
				if (city === county) {
					city = province;
				}
				const addressList = [];
				// 拼接地址
				if (province) {
					addressList.push(province);
				}
				if (city) {
					addressList.push(city);
				}
				if (county) {
					addressList.push(county);
				}
				this.addressStr = addressList.join('-');
				this.$emit('selectAddress', addressList);
			}
		}
	};
</script>
<style lang="less">
	.noneAddress {
		font-size: 28rpx;
		// font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		// color: #cdcdcd;
	}

	.haveAddress {
		font-size: 28rpx;
		// font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
	}
</style>
