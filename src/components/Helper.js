import Service from "../services";
import Sunset from "../common/sunset";

var cache = [];

export default {
	/**
	 * 生成多项选择
	 */
	generateItems(options, ctx) {
		var matchs = cache.filter(item => item.options === options && item.ctx === ctx);
		if (matchs.length == 0) {
			Promise.resolve()
				.then(res => {
					var data = options.data,
						enumType = options.enum;
					var items = [];
					if (data) {
						return Promise.resolve()
							.then(() => {
								if (Sunset.isFunction(data)) {
									return data(ctx);
								}
								return data;
							})
							.then(data => {
								return this._generateArrayOrObjectItems(data, options);
							});
					} else if (enumType) {
						//字典型
						return Service.Dictionary.getEnumsPromise(enumType);
					} else {
						return [];
					}
				})
				.then(list => {
					if (options.prependData) {
						list = options.prependData.concat(list);
					}
					if (options.appendData) {
						list = list.concat(options.appendData);
					}
					cache = cache.filter(item => {
						if (item.options === options && item.ctx === ctx) {
							item.resolve(list);
							return false;
						} else {
							return true;
						}
					});
				});
		}
		return new Promise(resolve => {
			cache.push({
				options,
				ctx,
				resolve
			});
		});
	},
	_generateArrayOrObjectItems(data, options) {
		var items = [];
		data = Sunset.clone(data);
		if (Sunset.isArray(data)) {
			//数组型
			var valuePlace = options.valuePlace || "value",
				textPlace = options.textPlace || "text";
			data.forEach(item => {
				items.push(
					Object.assign(item, {
						value: item[valuePlace],
						text: item[textPlace]
					})
				);
			});
		} else if (Sunset.isObject(data)) {
			//对象型
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					items.push({
						value: key,
						text: data[key]
					});
				}
			}
			items.sort((o1, o2) => {
				return o1.key == o2.key ? 0 : o1.key < o2.key ? -1 : 1;
			});
		}
		return items;
	},
	/**
	 * 生成树形字典数据
	 */
	generateTreeItems(enumType) {
		//字典型
		return Service.Dictionary.getEnumsPromise(enumType);
	},
	/**
	 * 执行操作
	 *
	 * @param {any} tool
	 * @param {any} ctx
	 * @returns
	 */
	operate(tool, ctx, value, reset, options) {
		if (tool.signal) {
			this.$emit("signal", tool.signal, ctx);
		} else if (Sunset.isFunction(tool.operate)) {
			if (tool.confirm) {
				return Promise.resolve()
					.then(() => {
						return Sunset.isFunction(tool.confirm) ? tool.confirm(ctx) : tool.confirm;
					})
					.then(confirmMsg => {
						var clear = Sunset.confirm({
							content: confirmMsg,
							loading: true,
							onOk: () => {
								Promise.resolve()
									.then(() => {
										return tool.operate(ctx, value, reset, options);
									})
									.then(res => {
										clear();
									});
							}
						});
					});
			} else {
				return tool.operate(ctx, value, reset, options);
			}
		}
	},
	/**
	 * 判断是否禁用
	 * @param {*} tool
	 */
	checkDisabled(tool, ctx) {
		var disabledValue = false;
		if (tool.disabled === true) {
			disabledValue = true;
		} else if (Sunset.isFunction(tool.disabled)) {
			disabledValue = !!tool.disabled(ctx);
		} else {
			disabledValue = false;
		}
		return disabledValue;
	}
};