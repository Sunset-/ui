// import VeeValidate from "vee-validate";

import validateRules from "./validateRules";
import Sunset from "./sunset";

function generateMessage(v, ruleConfig, message) {
	var msg = ruleConfig.message || message;
	if (Sunset.isString(msg)) {
		return msg;
	} else if (Sunset.isFunction(msg)) {
		return msg(v, ruleConfig);
	}
}

function validate(ruleName, ruleConfig, value) {
	if (!(Sunset.isObject(ruleConfig) && ruleConfig.hasOwnProperty("rule"))) {
		ruleConfig = {
			rule: ruleConfig
		};
	}
	var checker = validateRules.rules[ruleName];
	if (checker) {
		// 内置
		var result = checker.check(value, ruleConfig.rule);
	} else {
		Sunset.warning(`未配置校验器【${ruleName}】`);
		return;
	}
	if (Sunset.isObject(result) && Sunset.isFunction(result.then)) {
		return {
			status: "PENDING",
			result: result
		};
	} else if (!result) {
		return {
			status: "FINISH",
			result: false,
			message: generateMessage(value, ruleConfig, checker.message)
		};
	} else {
		return {
			status: "FINISH",
			result: true
		};
	}
}

export default function(Vue, options, xui) {
	Vue.mixin({
		beforeCreate() {
			if (!this.$vnode) {
				return;
			}
			var $validator = (this.$validator = this.$validator || {
				result: true,
				errors: {},
				$invalid(v) {
					if (v === void 0) {
						return !this.result;
					} else {
						return !!this.errors[v];
					}
				},
				$firstError(v) {
					return (this.errors[v] && this.errors[v][0]) || "";
				},
				refresh: () => {
					var count = Object.keys($validator.errors).reduce((result, key) => {
						return result + $validator.errors[key].length;
					}, 0);
					$validator.result = count == 0;
				}
			});

			Vue.util.defineReactive(this.$validator, "errors", this.$validator.errors);
			Vue.util.defineReactive(this.$validator, "result", this.$validator.result);
		}
	});
	Vue.prototype.$invalid = function(methodOptions) {
		return this.$validator.result;
	};

	//表单校验
	Vue.directive("validate", {
		update: function(el, binding, vNode) {
			if (el.oldValue === el.value && binding.value === binding.oldValue) {
				return;
			}
			el.oldValue = el.value;
			var name = el.name;
			var value = vNode.context.fieldValue || el.value;
			var ruleConfigs = binding.value;
			var validateResult = vNode.context.$validator;
			var errorMessages = [];
			if (Sunset.isObject(ruleConfigs)) {
				var keys = Object.keys(ruleConfigs);
				for (var i = 0, key; (key = keys[i++]); ) {
					var result = validate(key, ruleConfigs[key], value);
					if (result && result.result === false) {
						errorMessages.push(result.message);
					}
				}
				vNode.context.$nextTick(() => {
					validateResult.refresh();
				});
			}
			if (!errorMessages.length) {
				Vue.delete(validateResult.errors, name);
			} else {
				Vue.set(validateResult.errors, name, errorMessages);
			}
		}
	});

	xui.Validator = {
		regist: function(key, opts) {
			validateRules.addRule(key, opts);
		}
	};
}
