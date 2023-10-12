let getFileSize = (fileByte) => {
	var fileSizeByte = fileByte;
	var fileSizeMsg = "";
	if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
	else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
	else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024))
		.toFixed(2) + "MB";
	else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
	else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 *
		1024 * 1024)).toFixed(2) + "GB";
	else fileSizeMsg = "文件超过1TB";
	return fileSizeMsg;
}
export{
	getFileSize
}