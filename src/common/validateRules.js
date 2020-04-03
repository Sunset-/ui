const rules = {};
import Sunset from "./sunset";

function addRule(name, config) {
	rules[name] = config;
}

addRule("required", {
	message: "不能为空",
	check: function (val, r) {
		if (!r) {
			return true;
		}
		if (val === void 0 || val === null) {
			return false;
		}
		if (Sunset.isString(val) && val.trim() == "") {
			return false;
		}
		return true;
	}
});

//整数
addRule("integer", {
	message: "请输入整数",
	check: function (val) {
		return /^-?\d+$/.test(val);
	}
});

//最大长度
addRule("maxlength", {
	message: function (a, b, c) {
		return `最大长度${b.rule}`;
	},
	check: function (val, rule, b) {
		if (val && (val + "").length > rule) {
			return false;
		}
		return true;
	}
});

//正则表达式
addRule("regexp", {
	message: "格式不正确",
	check: function (val, rule) {
		if (Sunset.isString(rule)) {
			rule = new RegExp(rule);
		}
		return Sunset.isEmpty(val) || rule.test(val);
	}
});

//正则表达式
addRule("func", {
	message: "校验不通过",
	check: function (val, rule) {
		return Sunset.isEmpty(val) || rule(val);
	}
});

export default {
	rules: rules,
	addRule: addRule
};