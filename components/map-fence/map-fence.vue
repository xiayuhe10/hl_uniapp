<template>
	<view>
		<map :longitude="longitude" :latitude="latitude"
			@tap="bindtapMap" @markertap="removeMarker" :markers="markers" show-compass :polygons="polygons"
			show-location style="width: 100%;height: 80vh;">
		</map>
		<button type="primary" @click="removePolygons">清空</button>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				latitude: 34.747192,
				longitude: 113.625351,
				markers: [],
				polygons: [],
			}
		},
		onLoad(options) {

		},
		methods: {
			// 绘制多边形围栏
			creatPolygons() {
				if (this.markers.length < 3) {
					return false
				}
				let polygons = this.polygons;
				let markers = this.coordinateSort(this.markers)
				let newArray = [];
				let params = {
					fillColor: "#3336fc66",
					strokeColor: "#ff383b",
					strokeWidth: 2,
					zIndex: 3
				}
				for (let j = 0; j < markers.length; j++) {
					let obj = {
						latitude: markers[j].latitude,
						longitude: markers[j].longitude
					};
					newArray.push(obj);
				}
				polygons[0] = {};
				polygons[0].points = newArray;
				newArray = Object.assign(polygons[0], params);
				this.polygons[0] = newArray
				this.$emit("getPointsArr", newArray)
			},

			// 创建标记点
			bindtapMap(e) {
				let tapPoint = e.detail;
				let markers = this.markers
				let newContent = markers.length
				let markerItem = {
					id: newContent,
					latitude: null,
					longitude: null,
					iconPath: 'http://yjzhyl.com:3000/upload/dingwei.png',
					width: '34px',
					height: '34px',
					rotate: 0,
					alpha: 1,
					zIndex: 4
				}
				markerItem.latitude = tapPoint.latitude;
				markerItem.longitude = tapPoint.longitude;
				markers.push(markerItem)
				this.markers = markers
				if (this.markers.length > 2) {
					this.creatPolygons()
				}
			},

			// 删除重复点击的标记点
			removeMarker(e) {
				let id = e.markerId
				let markers = JSON.parse(JSON.stringify(this.markers))
				for (let i in markers) {
					if (markers[i].id == id) {
						markers.splice(i, 1)
					}
				}
				// 重置marker数组的id
				for (let j = 0; j < markers.length; j++) {
					markers[j].id = j;
				}
				this.markers = markers
				if (this.markers.length <= 2) {
					this.polygons = []
				} else {
					this.creatPolygons()
				}
			},

			// 删除围栏和标记
			removePolygons() {
				this.markers = []
				this.polygons = []
			},

			// 使用reduce获取中心（平均值）
			coordinateSort(points) {
				const center = points.reduce((acc, {
					latitude,
					longitude
				}) => {
					acc.latitude += latitude / points.length;
					acc.longitude += longitude / points.length;
					return acc;
				}, {
					latitude: 0,
					longitude: 0
				});
				// 使用tan（angle）=y/x将角度特性添加到每个点
				const angles = points.map(({
					latitude,
					longitude
				}) => {
					return {
						latitude,
						longitude,
						angle: Math.atan2(longitude - center.longitude, latitude - center.latitude) * 180 / Math.PI
					};
				});
				// 按角度排序
				const pointsSorted = angles.sort((a, b) => a.angle - b.angle);
				return pointsSorted
			}
		},
	}
</script>

<style>
</style>