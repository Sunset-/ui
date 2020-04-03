<template>
	<el-input :class="['xui-input xui-input-style',(prependSelect||appendSelect)?'input-with-select':'',safeOptions.className]" @blur="blurMethod" @on-blur="blur" :type="type" v-model="inputValue" :maxlength="maxlength" :disabled="cdisabled" :clearable="safeOptions.clearable" :readonly="safeOptions.readonly" :placeholder="cplaceholder" :icon="safeOptions.icon" :size="safeOptions.size" :style="safeOptions.style">
		<!-- prepend -->
		<span v-if="prependText" slot="prepend" v-html="prependText"></span>
		<input-attach-select v-if="prependSelect" slot="prepend" v-model="prependValue" :options="safeOptions.prepend"></input-attach-select>
		<!-- append -->
		<span v-if="appendText" style="cursor:pointer;" @click="clickButton" slot="append" v-html="appendText"></span>
		<input-attach-select v-if="appendSelect" slot="append" v-model="appendValue" :options="safeOptions.append"></input-attach-select>
		<el-button slot="append" :class="safeOptions.icon" v-if="safeOptions.icon" @click="clickButton" class='inputIcon'></el-button>
	</el-input>
</template>
<script>
import Utils from "../../Helper.js";
import Sunset from "../../../common/sunset";

import inputAttachSelect from "../select";

export default {
	components: {
		inputAttachSelect
	},
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		options: {
			type: Object
		},
		value: {},
		disabled: {},
		placeholder: {}
	},
	data() {
		return {
			prependItems: [],
			appendItems: [],
			inputValue: void 0,
			prependValue: void 0,
			appendValue: void 0,
			lock: false,
			valueLock: false,
			inited: false
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		type() {
			return (
				(this.safeOptions.type == "input" || this.safeOptions.type == "number"
					? "text"
					: this.safeOptions.type) || "text"
			);
		},
		isNumber() {
			return this.safeOptions.widget == "number" || this.safeOptions.type == "number";
		},
		digits() {
			return this.safeOptions.digits || 0;
		},
		cdisabled() {
			return this.disabled === true || this.safeOptions.disabled === true;
		},
		cplaceholder() {
			return this.placeholder || this.safeOptions.placeholder || "";
		},
		maxlength() {
			return (
				this.safeOptions.maxlength ||
				(this.safeOptions.validate &&
					(Sunset.isNumber(this.safeOptions.validate.maxlength)
						? this.safeOptions.validate.maxlength
						: this.safeOptions.validate.maxlength && this.safeOptions.validate.maxlength.rule))
			);
		},
		prependText() {
			return this.safeOptions.prepend && Sunset.isString(this.safeOptions.prepend)
				? this.safeOptions.prepend
				: false;
		},
		prependSelect() {
			return this.safeOptions.prepend && Sunset.isObject(this.safeOptions.prepend)
				? this.safeOptions.prepend
				: false;
		},
		prependSpliter() {
			return (this.prependSelect && this.prependSelect.spliter) || ",";
		},
		appendText() {
			return this.safeOptions.append && Sunset.isString(this.safeOptions.append)
				? this.safeOptions.append
				: false;
		},
		appendSelect() {
			return this.safeOptions.append && Sunset.isObject(this.safeOptions.append)
				? this.safeOptions.append
				: false;
		},
		appendSpliter() {
			return (this.appendSelect && this.appendSelect.spliter) || ",";
		},
		defaultPrependValue() {
			if (this.prependSelect) {
				return this.prependSelect.default == null ? null : this.prependSelect.default;
			}
			return null;
		},
		defaultAppendValue() {
			if (this.appendSelect) {
				return this.appendSelect.default == null ? null : this.appendSelect.default;
			}
			return null;
		}
	},
	methods: {
		clickButton() {
			if (this.safeOptions.appendClick) {
				this.safeOptions.appendClick(this.value, this.safeOptions);
			}
		},
		init() {
			this.inited = false;
			this.valueToInputValue(this.value);
			this.inited = true;
		},
		slientRefreshValue() {
			this.$nextTick(() => {
				this.lock = true;
				var value =
					this.inputValue && this.inputValue.length
						? `${this.prependSelect ? `${(this.prependValue || "") + this.prependSpliter}` : ""}${
								this.inputValue
						  }${this.appendSelect ? `${(this.appendSpliter || "") + this.appendValue}` : ""}`
						: this.inputValue;
				this.$emit("input", value);
				if (value != this.value) {
					this.$emit("change", value);
				}
				this.$nextTick(() => {
					this.lock = false;
				});
			});
		},
		blur() {
			if (this.isNumber) {
				if (this.inputValue === "" || this.inputValue === null || this.inputValue === void 0) {
					this.inputValue = "";
				} else {
					this.inputValue = Sunset.Numbers.fixed(this.inputValue, this.digits) + "";
					if (!isNaN(this.inputValue)) {
						if (!isNaN(this.safeOptions.min) && +this.inputValue < +this.safeOptions.min) {
							this.inputValue = Sunset.Numbers.fixed(this.safeOptions.min, this.digits) + "";
						}
						if (!isNaN(this.safeOptions.max) && +this.inputValue > +this.safeOptions.max) {
							this.inputValue = Sunset.Numbers.fixed(this.safeOptions.max, this.digits) + "";
						}
					}
				}
			}
		},
		blurMethod() {
			this.$emit("blur"); //抛出blur方法，渐进增强独立组件方法
		},
		changePrepend(v) {
			if (!this.valueLock) {
				var change = this.prependSelect && this.prependSelect.onChange;
				if (change === "CLEAR") {
					this.inputValue = "";
				} else if (Sunset.isFunction(change)) {
					change.apply(null, [v, this.value]);
				}
			}
		},
		changeAppend(v) {
			if (!this.valueLock) {
				var change = this.appendSelect && this.appendSelect.onChange;
				if (change === "CLEAR") {
					this.inputValue = "";
				} else if (Sunset.isFunction(change)) {
					change.apply(null, [v, this.value]);
				}
			}
		},
		valueToInputValue(v) {
			v = v === void 0 || v === null ? "" : v + "";
			if (!this.lock) {
				this.valueLock = true;
				//拆出前缀
				if (this.defaultPrependValue != null) {
					this.prependValue = this.defaultPrependValue;
				}
				if (this.prependSelect && ~v.indexOf(this.prependSpliter)) {
					this.prependValue = v.substring(0, v.indexOf(this.prependSpliter));
					v = v.substring(v.indexOf(this.prependSpliter) + this.prependSpliter.length, v.length);
				}
				//拆出后缀
				if (this.defaultAppendValue != null) {
					this.appendValue = this.defaultAppendValue;
				}
				if (this.appendSelect && ~v.indexOf(this.appendSpliter)) {
					this.appendValue = v.substring(
						v.indexOf(this.appendSpliter) + this.prependSpliter.length,
						v.length
					);
					v = v.substring(0, v.indexOf(this.appendSpliter));
				}
				this.inputValue = v;
				this.$nextTick(() => {
					this.valueLock = false;
				});
			}
		}
	},
	mounted() {
		this.init();
	},
	watch: {
		inputValue(v) {
			this.slientRefreshValue();
		},
		prependValue(v, oldv) {
			this.changePrepend(v);
			this.slientRefreshValue();
		},
		appendValue(v, oldv) {
			this.changeAppend(v);
			this.slientRefreshValue();
		},
		value(v) {
			this.valueToInputValue(v);
		}
	}
};
</script>

<style lang="less">
.inputIcon {
	[class*=" el-icon-"],
	[class^="el-icon-"] {
		font-size: 28px;
		font-weight: bold;
		color: #20a0ff;
	}
}
.el-input-group__append {
	.el-button {
		background: #fff;
		padding: 5px 20px;
		vertical-align: top;
	}
}
.el-input {
	.el-input__inner {
		height: 30px;
		line-height: 30px;
	}
}
</style>
