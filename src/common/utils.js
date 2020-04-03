const FILESIZE = "FILESIZE";
const TIMELENGTH = "TIMELENGTH";
export default {
    /**
     * 文件内存格式化
     * @param {number} bytes - 字节数
     * @return {string} "B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"
     */
	[FILESIZE](bytes) {
		if (bytes === 0) return "0 B";
		let k = 1024;
		let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		let i = Math.floor(Math.log(bytes) / Math.log(k));
		let output = (bytes / Math.pow(k, i)).toFixed(1) + "&nbsp;" + sizes[i];
		return output;
    },
    /**
     * 时间长度格式化
     * @param {number} ms - 毫秒数
     * @return {string} hh时mm分ss秒
     */
	[TIMELENGTH](ms) {
		let time = parseFloat(ms) / 1000; //换算成秒
		let hh = 0,
			mm = 0,
			ss = 0;
		if (time != "") {
			if (time < 60) {
				hh = 0;
				mm = 0;
				ss = parseInt(time);
			} else if (time > 60 && time < 60 * 60) {
				hh = 0;
				mm = parseInt(time / 60.0);
				ss = parseInt(
					(parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60
				);
			} else if (time >= 60 * 60) {
				hh = parseInt(time / 3600.0);
				mm = parseInt(
					(parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
				);
				ss = parseInt(
					(parseFloat(
						(parseFloat(time / 3600.0) - parseInt(time / 3600.0)) *
							60
					) -
						parseInt(
							(parseFloat(time / 3600.0) -
								parseInt(time / 3600.0)) *
								60
						)) *
						60
				);
			}
        }
        return `${hh}时${mm}分${ss}秒`
	}
};
