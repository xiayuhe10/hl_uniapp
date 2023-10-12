module.exports = {
	checkStatus: { // 审核状态
		WAITING: {VALUE: 0,NAME: "待审批",col: 'yellow'},
		REFUSE: {VALUE: 1,NAME: "已拒绝",col: 'red'},
		PASS: {VALUE: 2,NAME: "审核通过",col: 'green'},
		REVIEW: {VALUE: 3,NAME: "待审核",col: 'yellow'},
		CANCEL: {VALUE: 4,NAME: "已取消",col: 'gray'},
		LOSE: {VALUE: 5,NAME: "已失效",col: 'gray'}
	},
	checkType:{//审核类型
		ORDER:{VALUE: 0,NAME: "任务单",col: 'yellow'},
		REGISTER:{VALUE: 1,NAME: "用户申请",col: 'yellow'}
	},
	readStatus:{//是否已读
		UNREAD:{VALUE: 0,NAME: "未读",col: 'yellow'},
		READ:{VALUE: 1,NAME: "已读",col: 'gray'}
	},
	userStatus:{//系统用户状态
		0:{VALUE: 0,NAME: "正常",col: 'green'},
		1:{VALUE: 1,NAME: "停用",col: 'grey'},
		2:{VALUE: 2,NAME: "冻结",col: 'gray'},
		3:{VALUE: 3,NAME: "作废",col: 'gray'},
	},
	mixingStatus:{//项目状态
		0:{VALUE: 0,NAME: "未开始",col: 'gray'},
		1:{VALUE: 1,NAME: "进行中",col: 'green'},
		2:{VALUE: 2,NAME: "暂停中",col: 'gray'},
		3:{VALUE: 3,NAME: "已结束",col: 'gray'},
	},
	mixingCheck:{//项目是否开启审核
		0:{VALUE: 0,NAME: "否",col: 'gray'},
		1:{VALUE: 1,NAME: "是",col: 'green'}
	},
	mixingUserType:{//项目用户状态
		0:{VALUE: 0,NAME: "管理员",col: 'purple'},
		1:{VALUE: 1,NAME: "普通用户",col: 'gray'},
		2:{VALUE: 2,NAME: "司机",col: 'olive'}
	},
	siteStatus:{//工程状态（工地状态）
		0:{VALUE: 0,NAME: "已启动",col: 'green'},
		1:{VALUE: 1,NAME: "已停用",col: 'gray'},
	},
	orderStatus:{
		WAITING:{VALUE: 0,NAME: "待审核",col: 'yellow'},
		REFUSE:{VALUE: 1,NAME: "已拒绝",col: 'red'},
		PASS:{VALUE: 2,NAME: "审核通过",col: 'green'},
		PRODUCING:{VALUE: 3,NAME: "生产中",col: 'blue'},
		COMPLETE:{VALUE: 4,NAME: "已完成",col: 'purple'},
		CANCEL:{VALUE: 5,NAME: "已取消",col: 'gray'},
		PAUSE:{VALUE: 6,NAME: "暂停中",col: 'grey'},
		REVIEW:{VALUE: 7,NAME: "审核中",col: 'orange'},
	},

	
}