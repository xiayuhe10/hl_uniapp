export default {
	//首页时间转化
	dateTime(e) {
		let date = e.replace(/-/g, "/");
		let old = new Date(date);
		let now = new Date();
		//获取old具体时间
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth() + 1;
		let D = old.getDate();
		//获取now具体时间
		let nd = now.getTime();
		let nh = now.getHours();
		let n = now.getMinutes();
		let nY = now.getFullYear();
		let nM = now.getMonth() + 1;
		let nD = now.getDate();

		//当天的时间
		if (D === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return h + ':' + m;
		}
		//昨天时间
		if (D + 1 === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return '昨天 ' + h + ':' + m;
		} else {
			//大于两天
			return Y + '/' + M + '/' + D;
		}

	},
	//聊天时，发送时间处理
	dateTime1(e) {
		let date = e.replace(/-/g, "/");
		let old = new Date(date);
		let now = new Date();
		//获取old具体时间
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth() + 1;
		let D = old.getDate();
		//获取now具体时间
		let nd = now.getTime();
		let nh = now.getHours();
		let n = now.getMinutes();
		let nY = now.getFullYear();
		let nM = now.getMonth() + 1;
		let nD = now.getDate();

		//当天的时间
		if (D === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return h + ':' + m;
		}
		//昨天时间
		if (D + 1 === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return '昨天 ' + h + ':' + m;
		} else if (Y == nY) {
			//今年
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return M + '月' + D + '日 ' + h + ':' + m
		} else {
			//大于今年
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return Y + '年' + M + '月' + D + '日 ' + h + ':' + m
		}
	},
	// 间隔时间差
	spaceTime(old, now) {
		old = new Date(old);
		now = new Date(now);
		var told = old.getTime();
		var tnow = now.getTime();
		if (told > (tnow + 1000 * 60 * 5)) {
			return now;
		} else {
			return '';
		}
	},
	dateTimeStr(str) {
		var date = new Date(),
			year = date.getFullYear(), //年
			month = date.getMonth() + 1, //月
			day = date.getDate(), //日
			hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(), //时
			minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(), //分
			second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //秒
		month >= 1 && month <= 9 ? (month = "0" + month) : "";
		day >= 0 && day <= 9 ? (day = "0" + day) : "";
		hour >= 0 && hour <= 9 ? (hour = "0" + hour) : "";
		minute >= 0 && minute <= 9 ? (minute = "0" + minute) : "";
		second >= 0 && second <= 9 ? (second = "0" + second) : "";
		if (str.indexOf('y') != -1) {
			str = str.replace('y', year)
		}
		if (str.indexOf('m') != -1) {
			str = str.replace('m', month)
		}
		if (str.indexOf('d') != -1) {
			str = str.replace('d', day)
		}
		if (str.indexOf('h') != -1) {
			str = str.replace('h', hour)
		}
		if (str.indexOf('i') != -1) {
			str = str.replace('i', minute)
		}
		if (str.indexOf('s') != -1) {
			str = str.replace('s', second)
		}
		return str;
	},
	dateFormat() { // 获取今天日期
		let date = new Date(new Date().toISOString());
		let year = date.getFullYear();
		// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
		let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		// 拼接
		return year + "年" + month + "月" + day + "日"
		// return year + "-" + month + "-" + day;
	},
	dateFormatToDateLg() { // 获取今天日期
		let date = new Date(new Date().toISOString());
		let year = date.getFullYear();
		// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
		let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		// 拼接
		return year + "-" + month + "-" + day + " " + hours + ':' + minutes + ':' + seconds
		// return year + "-" + month + "-" + day;
	},
	dateFormats(str) { // 获取今天日期
		let dateStr = str.replace(/-/g, "/");
		let date = new Date(str);
		let year = date.getFullYear();
		// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
		let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		// 拼接
		return year + "-" + month + "-" + day + " " + hours + ':' + minutes + ':' + seconds;
	},
	dateFormatGetDate() { // 获取今天日期
		let date = new Date(new Date().toISOString());
		let year = date.getFullYear();
		// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
		let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		// 拼接
		return year + "-" + month + "-" + day;
	},
	dateFormatGetDateTime() { // 获取今天时间
		let date = new Date(new Date().toISOString());
		let year = date.getFullYear();
		// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
		let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		// 拼接
		return hours + ':' + minutes + ':' + seconds;
	},
	dateFormatGetDateTimeUpDate(str) { // 获取今天时间
		let date = new Date(str);
		let year = date.getFullYear();
		// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
		let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		// 拼接
		return hours + ':' + minutes + ':' + seconds;
	},
	dateFormatGet(str) { // 获取今天日期
		let dateStr = str.replace(/-/g, "/");
		let date = new Date(dateStr);
		let year = date.getFullYear();
		// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
		let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		// 拼接
		return year + "-" + month + "-" + day;
	},
	filterTime(stamp, type = 0,flag = 'android') {
		let str = stamp
		if (flag=='ios' && stamp && stamp.indexOf('-') > 0) {
			str = new Date(stamp.replace(/-/g, '/')).getTime()
		}
		// console.log('str', str)
		// console.log('type', type)
		let date = new Date(str)
		let y = date.getFullYear();
		let m = (date.getMonth() + 1 + '').padStart(2, '0');
		let d = (date.getDate() + '').padStart(2, '0');
		let hh = (date.getHours() + '').padStart(2, '0')
		let mm = (date.getMinutes() + '').padStart(2, '0')
		let ss = (date.getSeconds() + '').padStart(2, '0')
		let time;
		switch (type) {
			case 0:
				time = `${y}-${m}-${d}`;
				break;
			case 1:
				time = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
				break;
			case 2:
				time = `${m}-${d} ${hh}:${mm}:${ss}`;
				break;
			case 3:
				time = `${m}-${d}`;
				break;
			case 4:
				time = `${y}/${m}/${d}`;
				break;
			case 5:
				time = `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
				break;
			case 6:
				time = `${m}/${d} ${hh}:${mm}:${ss}`;
				break;
			case 7:
				time = `${m}/${d}`;
				break;
			case 8:
				time = `${y}-${m}`;
				break;
			case 9:
				time = `${m}`;
				break;
			case 10:
				time = `${hh}:${mm}`;
			case 11:
				time = `${d}`;
				break;
		}
		return time;
	},
	
	// 日期格式化
	parseTime(time, pattern) {
	  if (arguments.length === 0 || !time) {
	    return null
	  }
	  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	  let date
	  if (typeof time === 'object') {
	    date = time
	  } else {
	    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
	      time = parseInt(time)
	    } else if (typeof time === 'string') {
	      time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
	    }
	    if ((typeof time === 'number') && (time.toString().length === 10)) {
	      time = time * 1000
	    }
	    date = new Date(time)
	  }
	  const formatObj = {
	    y: date.getFullYear(),
	    m: date.getMonth() + 1,
	    d: date.getDate(),
	    h: date.getHours(),
	    i: date.getMinutes(),
	    s: date.getSeconds(),
	    a: date.getDay()
	  }
	  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
	    let value = formatObj[key]
	    // Note: getDay() returns 0 on Sunday
	    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
	    if (result.length > 0 && value < 10) {
	      value = '0' + value
	    }
	    return value || 0
	  })
	  return time_str
	}
}
