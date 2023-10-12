使用方式

<comp-select-address class="address" @selectAddress="selectAddress" />

.address{
这里写你的样式
}

// 点击确定的回调
selectAddress(value) {
const [province, city, county] = value;
console.log('省份', province);
console.log('城市', city);
console.log('区域', county);
},
