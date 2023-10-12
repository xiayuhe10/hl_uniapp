<template>
	<text class="chat-timestamp">{{ getTimeDesc(time) }}</text>
</template>

<script>
	import moment from 'moment'
	
	export default {
		props: {
			time: String
		},
		methods: {
			// 格式化时间，用户聊天记录
			getTimeDesc(stamp) {
				let time = moment(new Date(stamp * 1000)).format('YYYY-MM-DD HH:mm:ss');
				let temp = time.split(' ');
				if (moment().isSame(time, 'day')) {
					temp[0] = '今天';
				} else if (moment().subtract(1, 'days').isSame(time, 'day')) {
					temp[0] = '昨天';
				} else if (moment().isSame(time, 'year')) {
					temp[0] = moment(temp[0]).format("MM月DD日")
				} else {
					temp[0] = moment(temp[0]).format("YYYY年MM月DD日")
				}
				let hms = temp[1].split(':');
				hms.splice(2, 1);
				temp[1] = hms.join(':');
				return temp.join(' ');
			},
		}
	}
</script>

<style lang="scss">
	.chat-timestamp {
		width: 100px;
		margin: 8upx 0 32upx;
		text-align: center;
		color: rgba(0, 0, 0, 0.2);
		font-size: 22upx;
		height: 32upx;
		line-height: 32upx;
	}
</style>
