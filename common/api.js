module.exports = {
	//1、用户
	//==============用户相关===============================
	login: '/login', //登录
	register: "/register", //注册
	sysUser: "/system/user", //用户相关
	autoCode: "/sms/autoCode", // 发送验证码
	verifyCode: "/sms/verifyCode", // 校验验证码
	resetPassword: "/resetPassword", //重置密码
	//=============消息相关========================
	checkMsgMyList: "/system/checkMsg/myList", //我的消息列表
	checkMsg: "/system/checkMsg", //消息相关
	checkMsgCheck: "/system/checkMsg/check", //审批消息
	selectUnReadTotalMsg: "/system/checkMsg/selectUnReadTotalMsg", //查找未读消息

	//==================项目相关==========================
	mixingPlant: "/system/mixingPlant", //项目相关
	selectMyPlantByUserId: "/system/mixingPlant/selectMyPlantByUserId", //查找当前用户的项目列表
	selectMyPlantCountByUserId: "/system/mixingPlant/selectMyPlantCountByUserId", //查找当前用户的项目数量
	mixingUser: "/system/mixingUser", //项目人员
	site: "/system/site", //工地相关
	sitePlace: "/system/sitePlace", //施工部位
	productLine: "/system/product/line", //生产线
	checkUser: "/system/check/user", //审核人员配置
	silo: "/system/silo", //料仓操作
	concreteStrength: "/system/concreteStrength", //混凝土等级
	pouringMode: "/system/pouringMode", //浇筑方式
	workOrder: "/system/workOrder", //任务单
	car: "/system/car", //车辆管理


	getWxPhone: '/auth/getWxPhone', //解密用户手机号
	wxLoginSystem: '/auth/wxLoginSystem', // 微信授权登录
	getOpenId: '/system/wechat/getOpenId/', // 微信code获取opneId
	getAccessToken: '/system/wechat/getAccessToken/', // 微信code获取opneId
	captchaImage: "/captchaImage", //获取验证码

	verifyCodeLogin: "/auth/verifyCodeLogin", // 验证码登录
	logout: "/logout",
	//file模块
	upload: "/file/upload", //文件上传
	sysUpload: "/system/systemFile/upload", //文件上传
	commonUpload: "/system/archives/common/download", //系统文件通用下载



	//------------------用户信息start----------------------------------------------------
	selectPhoneByUserId: "/system/user/selectPhoneByUserId", //根据用户id解密手机号码 参数：userId
	getUserProfile: "/system/user/profile", //查询用户个人信息
	updateUserProfile: "/system/user/profile", // 修改用户个人信息 method: 'put', data: data
	updatePwd: "/system/user/profile/updatePwd", // 用户密码重置 method: 'put', params: data  传updateUserPwd(this.user.oldPassword, this.user.newPassword)
	updatePhoneNumber: "/system/user/profile/updatePhoneNumber", //用户修改号码
	uploadAvatar: "/system/user/profile/avatar", // 用户头像上传 method: 'post', data: data
	selectUserByOpenId: "/system/user/selectUserByOpenId", // 根据OpenId获取当前用户是否存在手机号
	selectUserByUserCode: "/system/user/selectUserByUserCode", //根据用户码查询用户
	getUserInfo: '/system/user/getInfo', //获取当前用户详细信息 使用get
	getInfoByUserId: '/system/user/getInfoByUserId', //跟进用户id获取用户详细信息 使用get
	selectUserDeptId: "/system/user/selectUserDeptId", //获取当前用户的部门id


	getBannerListByApp: "/system/indexBanner/showList", //GET APP首页轮播图
	getIndexBannerTop: "/system/indexBannerTop/showList", //GET 轮播图列表（顶部）
	getIndexBannerCenter: "/system/indexBannerCenter/showList", //GET 轮播图列表（中部
	getIndexBannerLeft: "/system/ad/banner/left/showList", //GET 广告轮播图列表(左部)
	getNewBannerRight: "/system/ad/banner/right/getNewBanner", //GET 根据类型查询广告轮播图（右部）最新的一个

	getDictDataType: "/system/dict/data/type/", //GET 根据字典类型查询字典数据信息{dictType}
	getMyMenu: "/system/SysMenuM/getMyMenu", //GET获取我的应用菜单列表
	saveMyMenuList: "/system/SysMenuMUser/saveMyMenuList", //POST 保存我的应用菜单列表
	getRouters: "/system/SysMenuM/getRouters", //获取路由菜单
	getDict: "/system/dict/data/type", //根据字典类型获取数据信息





	//--------------------IM会话相关end-------------------------------------------------
};