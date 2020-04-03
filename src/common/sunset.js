var toString = Object.prototype.toString;


// Browser environment sniffing
var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';


var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && UA.indexOf('trident') > 0;
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA);
var iosVersionMatch = isIos && UA.match(/os ([\d_]+)/);
var iosVersion = iosVersionMatch && iosVersionMatch[1].split('_');

var hasMutationObserverBug = iosVersion && Number(iosVersion[0]) >= 9 && Number(iosVersion[1]) >= 3 && !window.indexedDB;


var nextTick = (function () {
	var callbacks = []
	var pending = false
	var timerFunc

	function nextTickHandler() {
		pending = false
		// 之所以要slice复制一份出来是因为有的cb执行过程中又会往callbacks中加入内容
		// 比如$nextTick的回调函数里又有$nextTick
		// 这些是应该放入到下一个轮次的nextTick去执行的,
		// 所以拷贝一份当前的,遍历执行完当前的即可,避免无休止的执行下去
		var copies = callbacks.slice(0)
		callbacks = []
		for (var i = 0; i < copies.length; i++) {
			copies[i]()
		}
	}

	/* istanbul ignore if */
	// ios9.3以上的WebView的MutationObserver有bug，
	//所以在hasMutationObserverBug中存放了是否是这种情况
	if (typeof MutationObserver !== 'undefined' && !hasMutationObserverBug) {
		var counter = 1
		// 创建一个MutationObserver,observer监听到dom改动之后后执行回调nextTickHandler
		var observer = new MutationObserver(nextTickHandler)
		var textNode = document.createTextNode(counter)
		// 调用MutationObserver的接口,观测文本节点的字符内容
		observer.observe(textNode, {
			characterData: true
		})
		// 每次执行timerFunc都会让文本节点的内容在0/1之间切换,
		// 不用true/false可能是有的浏览器对于文本节点设置内容为true/false有bug？
		// 切换之后将新值赋值到那个我们MutationObserver观测的文本节点上去
		timerFunc = function () {
			counter = (counter + 1) % 2
			textNode.data = counter
		}
	} else {
		// webpack attempts to inject a shim for setImmediate
		// if it is used as a global, so we have to work around that to
		// avoid bundling unnecessary code.
		// webpack默认会在代码中插入setImmediate的垫片
		// 没有MutationObserver就优先用setImmediate，不行再用setTimeout
		const context = inBrowser ?
			window :
			typeof global !== 'undefined' ? global : {}
		timerFunc = context.setImmediate || setTimeout
	}
	return function (cb, ctx) {
		var func = ctx ?
			function () {
				cb.call(ctx)
			} :
			cb
		callbacks.push(func)
		// 如果pending为true, 就其实表明本轮事件循环中已经执行过timerFunc(nextTickHandler, 0)
		if (pending) return
		pending = true
		timerFunc(nextTickHandler, 0)
	}
})()

//工具类
var Sunset = {
	nextTick: nextTick,
	isEmpty: function (value) {
		return this.isUndefined(value) || value === "" || value === null;
	},
	isUndefined: function (value) {
		return typeof value === "undefined";
	},
	isDefined: function (value) {
		return typeof value !== "undefined";
	},
	isObject: function (value) {
		return value !== null && typeof value === "object";
	},
	isString: function (value) {
		return typeof value === "string";
	},
	isNumber: function (val) {
		var patrn = /^(-)?\d+(\.\d+)?$/;
		if (patrn.exec(val) == null || val === "") {
			return false;
		} else {
			return true;
		}
	},
	isDate: function (value) {
		return toString.call(value) === "[object Date]";
	},
	isArray: function (value) {
		return toString.call(value) == "[object Array]";
	},
	isFunction: function (value) {
		return typeof value === "function";
	},
	isBoolean: function (value) {
		return value === true || value === false;
	},
	isRegExp: function (value) {
		return value instanceof RegExp;
	},
	//正则
	REGEX: {
		PHONE: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
	},
	/**
	 * 缓存
	 * @type {Object}
	 */
	Cache: {
		isString: function (v) {
			return Object.prototype.toString.call(v) == "[object String]";
		},
		get: function (key) {
			var val = localStorage.getItem(key),
				res;
			if (val) {
				try {
					res = JSON.parse(val);
				} catch (e) {
					res = val;
				}
			}
			if (res && res.__TYPE == "SUNSET_CACHE") {
				if (res.type == "OBJECT") {
					try {
						res = JSON.parse(res.value);
					} catch (e) {
						res = res.value;
					}
				} else {
					res = res.value;
				}
			}
			return res;
		},
		put: function (key, value) {
			key += "";
			var cacheItem;
			if (!this.isString(value)) {
				try {
					cacheItem = {
						__TYPE: "SUNSET_CACHE",
						type: "OBJECT",
						value: JSON.stringify(value)
					};
				} catch (e) {
					cacheItem = {
						__TYPE: "SUNSET_CACHE",
						type: "OBJECT",
						value: (value = value ? value.toString() : "")
					};
				}
			} else {
				cacheItem = {
					__TYPE: "SUNSET_CACHE",
					type: "STRING",
					value: value
				};
			}
			return localStorage.setItem(key, JSON.stringify(cacheItem));
		},
		remove: function (key) {
			var res = this.get(key);
			localStorage.removeItem(key);
			return res;
		},
		clear: function () {
			localStorage.clear();
		}
	},
	/**
	 * 日期处理
	 * @type {Object}
	 */
	Dates: {
		reg: {
			yyyy: "getFullYear",
			MM: "getMonth",
			dd: "getDate",
			HH: "getHours",
			hh: "getHours",
			mm: "getMinutes",
			ss: "getSeconds"
		},
		format: function format(date, fmt) {
			fmt = fmt || "yyyy-MM-dd HH:mm:ss";
			if (!isNaN(date)) {
				var d = new Date(date),
					reg = this.reg;
				for (var k in reg) {
					var v;
					if (reg.hasOwnProperty(k)) {
						v = d[reg[k]]();
						if (k == "MM") {
							v++;
						}
						if (k != "yyyy" && v < 10) {
							v = "0" + v;
						}
						fmt = fmt.replace(k, v);
					}
				}
				return fmt;
			} else {
				return "";
			}
		},
		parse: function (str) {
			//根据日期字符串转换成日期
			var regEx = new RegExp("\\-", "gi");
			str = str.replace(regEx, "/");
			var milliseconds = Date.parse(str);
			var dependedDate = new Date();
			dependedDate.setTime(milliseconds);
			return dependedDate;
		},
		fromNow: function (date) {
			if (!(date instanceof Date)) {
				date = new Date(date);
			}
			var now = new Date(),
				pass = now - date;
			if (pass <= 5 * 60 * 1000) {
				return "刚刚";
			} else if (pass <= 30 * 60 * 1000) {
				return Math.round(pass * 1.0 / 60000) + "分钟前";
			} else {
				return this.format(date, "yyyy-MM-dd HH:mm:ss");
			}
		}
	},
	Numbers: {
		fixed: function (value, digits) {
			digits = digits || 0;
			var v, res;
			try {
				v = +value;
				if (!isNaN(v)) {
					if (digits == 0) {
						res = Math.round(v);
					} else {
						res = v.toFixed(digits);
					}
				} else {
					if (digits == 0) {
						res = 0;
					} else {
						res = (0).toFixed(digits);
					}
				}
			} catch (e) {
				if (digits == 0) {
					res = 0;
				} else {
					res = (0).toFixed(digits);
				}
			}
			return res;
		}
	},
	/**
	 * 字符串操作工具
	 */
	Strings: {
		toCamelCase(str) {
			return Sunset.isString(str) ?
				str.replace(new RegExp("\\-(\\w)", "g"), function (all, letter) {
					return letter.toUpperCase();
				}) :
				str;
		},
		toHyphenate(str) {
			return Sunset.isString(str) ? str.replace(new RegExp("([A-Z])", "g"), "-$1").toLowerCase() : str;
		},
		removeAsSpliter: function (str, obj, spliter) {
			var spliter = spliter === void 0 ? "," : spliter;
			var list = str.split(spliter);
			list.splice(list.indexOf(obj), 1);
			return list.join(spliter);
		},
		serialize: function (data) {
			return Object.keys(data)
				.map(function (keyName) {
					return encodeURIComponent(keyName) + "=" + encodeURIComponent(data[keyName]);
				})
				.join("&");
		}
	},
	//数组操作工具
	Arrays: {
		/**
		 * 添加全部
		 * @param {[type]} arr1 [description]
		 * @param {[type]} arr2 [description]
		 */
		addAll: function (arr1, arr2) {
			if (arr2 && arr2.length) {
				[].push.apply(arr1, arr2);
			}
			return arr1;
		},
		/**
		 * 去重
		 * @param  {[type]} arr [description]
		 * @param  {[type]} key [description]
		 * @return {[type]}     [description]
		 */
		uniq: function (arr, key) {
			if (arr && arr.length) {
				var hash = {},
					res = [],
					temp,
					id;
				for (var i = 0, l = arr.length; i < l; i++) {
					temp = arr[i];
					id = key ? utils.getAttribute(temp, key) : temp;
					if (!hash[id]) {
						hash[id] = true;
						res.push(temp);
					}
				}
				return res;
			} else {
				return arr;
			}
		},
		remove: function (arr, obj) {
			if (arr && arr.length && obj) {
				for (var i = 0, l = arr.length; i < l; i++) {
					if (arr[i] == obj) {
						arr.splice(i, 1);
						break;
					}
				}
			}
		},
		filter: function (items, cb) {
			if (!items || items.length == 0) {
				return null;
			}
			if (typeof cb != "function") {
				throw new Error("filter arguments[1] is not a function");
			}
			var res = [];
			for (var i = 0, l = items.length; i < l; i++) {
				if (cb(items[i])) {
					res.push(items[i]);
				}
			}
			return res;
		},
		filterOne: function (items, cb) {
			if (!items || items.length == 0) {
				return null;
			}
			if (typeof cb != "function") {
				throw new Error("filter arguments[1] is not a function");
			}
			for (var i = 0, l = items.length; i < l; i++) {
				if (cb(items[i])) {
					return items[i];
				}
			}
		},
		forEach: function (items, cb) {
			if (!items || items.length == 0) {
				return null;
			}
			if (typeof cb != "function") {
				throw new Error("filter arguments[1] is not a function");
			}
			for (var i = 0, l = items.length; i < l; i++) {
				cb(items[i], i);
			}
			return items;
		},
		some: function (items, cb) {
			if (!items || items.length == 0) {
				return null;
			}
			if (typeof cb != "function") {
				throw new Error("filter arguments[1] is not a function");
			}
			for (var i = 0, l = items.length; i < l; i++) {
				if (cb(items[i], i)) {
					return true;
				}
			}
			return false;
		},
		map: function (arr, cb) {
			var res = [];
			if (arr && arr.length) {
				for (var i = 0, l = arr.length; i < l; i++) {
					res.push(cb(arr[i]));
				}
			}
			return res;
		},
		merge: function (mergeTo, mergeFrom, compare) {
			var item,
				jitem,
				isNew = true;
			compare =
				compare ||
				function (obj1, obj2) {
					return obj1 === obj2;
				};
			if (mergeTo && mergeFrom && compare) {
				for (var i = 0, l = mergeFrom.length; i < l; i++) {
					item = mergeFrom[i];
					isNew = true;
					for (var j = 0, jl = mergeTo.length; j < jl; j++) {
						jitem = mergeTo[j];
						if (compare(item, jitem)) {
							isNew = false;
							mergeTo.splice(j, 1, item);
						}
					}
					isNew && mergeTo.push(item);
				}
			}
			return mergeTo;
		},
		findIndex(items, find) {
			if (!items || items.length == 0) {
				return -1;
			}
			if (typeof find != "function") {
				throw new Error("filter arguments[1] is not a function");
			}
			for (var i = 0, l = items.length; i < l; i++) {
				if (find(items[i])) {
					return i;
				}
			}
			return -1;
		}
	},
	Objects: {
		each: function (obj, cb) {
			if (obj) {
				var key;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						cb(obj[key], key, obj);
					}
				}
			}
		}
	},
	clone: function (obj) {
		if (typeof obj != "object" || Sunset.isDate(obj) || obj === null || obj === void 0) return obj;
		var re;
		if (obj.constructor == Array) {
			re = [];
		} else {
			re = {};
		}
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				re[i] = Sunset.clone(obj[i]);
			}
		}
		return re;
	},
	//获取命名空间下属性
	getAttribute: function (parent, namespace, defaultResult) {
		if (parent && namespace) {
			var ns = namespace.split(".");
			var obj = parent;
			for (var i = 0, l = ns.length; i < l; i++) {
				obj = obj[ns[i]];
				if (obj == null || obj == void 0) {
					return defaultResult;
				}
			}
			return obj;
		}
		return defaultResult;
	},
	//设置命名空间下的属性
	setAttribute: function (parent, namespace, value) {
		var lio,
			obj = parent;
		if ((lio = namespace.lastIndexOf("."))) {
			var ns = namespace.split("."),
				obj = parent,
				attrName = namespace.substring(lio + 1);
			for (var i = 0, l = ns.length - 1; i < l; i++) {
				if (obj[ns[i]] == null || obj[ns[i]] === void 0) {
					obj[ns[i]] = {};
				}
				obj = obj[ns[i]];
			}
			obj[attrName] = value;
		} else {
			obj[namespace] = value;
		}
	},
	getCookie: function (name) {
		var arr,
			reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
		else return null;
	},
	/**
	 * 获取URL参数
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	getQueryString: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	wait: function (promiseFactory, cacheHolder, cacheKey) {
		var lock = false,
			resolveStack = [],
			cacheKey = cacheKey || "cache";
		cacheHolder = cacheHolder || {};
		return function (force) {
			var self = this,
				args = [].slice.call(arguments);
			return new Promise((resolve, reject) => {
				if (!force && cacheHolder[cacheKey]) {
					resolve(cacheHolder[cacheKey]);
				} else {
					resolveStack.push({
						resolve: resolve,
						reject: reject
					});
					if (!lock) {
						lock = true;
						promiseFactory
							.apply(self, args)
							.then(res => {
								cacheHolder[cacheKey] = res;
								lock = false;
								while (resolveStack.length) {
									resolveStack.shift().resolve(res);
								}
							})
							.catch(err => {
								lock = false;
								while (resolveStack.length) {
									resolveStack.shift().reject(err);
								}
							});
					}
				}
			});
		};
	},
	debounce: function (fn, delay) {
		let timer = null;
		return function () {
			let context = this;
			let args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn.apply(context, args);
			}, delay);
		};
	},
	debounce: function debouce(func, delay, immediate) {
		var timer = null;
		return function () {
			var context = this;
			var args = arguments;
			if (timer) clearTimeout(timer);
			if (immediate) {
				var doNow = !timer;
				timer = setTimeout(function () {
					timer = null;
				}, delay);
				if (doNow) {
					func.apply(context, args);
				}
			} else {
				timer = setTimeout(function () {
					func.apply(context, args);
				}, delay);
			}
		};
	},
	throttle: function (func, delay) {
		var timer = null;
		var startTime = Date.now();

		return function () {
			var curTime = Date.now();
			var remaining = delay - (curTime - startTime);
			var context = this;
			var args = arguments;

			clearTimeout(timer);
			if (remaining <= 0) {
				func.apply(context, args);
				startTime = Date.now();
			} else {
				timer = setTimeout(func, remaining);
			}
		};
	}
};

//警告
Sunset.warning = function (err) {
	if (console && console.error) {
		console.error(err);
	} else {
		try {
			new Error(err);
		} catch (e) {}
	}
};

export default Sunset;