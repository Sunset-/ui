import Sunset from "../common/sunset";
var ENUMS = {};
var ENUM_MAP = {};
var ALIAS_MAP = {};

var remoteRequesters = [];

export default {
	install: function(dictionaryItems, valuePlace, textPlace) {
		valuePlace = valuePlace || "value";
		textPlace = textPlace || "text";
		//数组型
		if (Sunset.isArray(dictionaryItems) && dictionaryItems.length) {
			//按type分类
			dictionaryItems.forEach(item => {
				var v = item[valuePlace];
				var t = item[textPlace];
				item.value = v;
				item.text = t;
				this._installItem(item);
			});
		} else if (Sunset.isObject(dictionaryItems)) {
			Object.keys(dictionaryItems).forEach(type => {
				var dicts = dictionaryItems[type];
				if (Sunset.isArray(dicts)) {
					dicts.forEach(item => {
						var v = item[valuePlace];
						var t = item[textPlace];
						item.value = v;
						item.text = t;
						item.type = type;
						this._installItem(item);
					});
				} else if (Sunset.isObject(dicts)) {
					Object.keys(dicts).forEach(value => {
						this._installItem({
							type: type,
							value: value,
							text: dicts[value]
						});
					});
				}
			});
		}
	},
	_installItem(item) {
		var enums = ENUMS[item.type] || (ENUMS[item.type] = []),
			enumMap = ENUM_MAP[item.type] || (ENUM_MAP[item.type] = {}),
			aliasMap = ALIAS_MAP[item.type] || (ALIAS_MAP[item.type] = {});
		enums.push(item);
		enumMap[item.value] = item.text;
		if (item.alias !== void 0) {
			aliasMap[item.alias] = item.value;
		}
	},
	installRemote(checker, requester) {
		remoteRequesters.push({
			checker: checker,
			requester: requester
		});
	},
	getEnumsPromise(type) {
		return Promise.resolve().then(() => {
			if (ENUMS[type]) {
				return ENUMS[type];
			}
			var remoteRequester = remoteRequesters.filter(item => {
				return Sunset.isFunction(item.checker) ? item.checker(type) : true;
			})[0];
			if (remoteRequester) {
				return Promise.resolve(remoteRequester.requester(type)).then(dicts => {
					this.install(dicts);
					return dicts;
				});
			}
			Sunset.warning(`未找到字典【${type}】`);
			return [];
		});
	},
	getEnums(type) {
		return ENUMS[type] || [];
	},
	transcode(type, value, defaultText) {
		var v = ENUM_MAP[type] && ENUM_MAP[type][value];
		return v !== void 0 ? v : defaultText !== void 0 ? defaultText : value;
	},
	alias(type, alias) {
		return (ALIAS_MAP[type] && ALIAS_MAP[type][alias]) || alias;
	},
	getEnumsMap() {
		return ENUM_MAP;
	},
	getAllEnums() {
		return ENUMS;
	}
};
