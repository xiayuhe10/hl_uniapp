# base_app

#### 介绍
APP基础架构，uniapp

#### 软件架构
1、修改连接后端接口：common/config.js
2、后端API接口存放：common/api.js
3、枚举状态等：common/enums/status.js
枚举直接根据后端返回进行引入展现
页面调用：
	<view class="text-content text-left">
									<view :class="'text-'+STATUS[item.status].col">{{STATUS[item.status].NAME}}</view>
	</view>
<script>
	import status from '@/common/enums/status.js';
	export default {
		data() {
			return {
				STATUS:status.checkStatus,

			}
		},
    .....
</script>


#### 特技
