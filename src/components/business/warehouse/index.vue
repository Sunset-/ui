<template>
	<el-input :class="options.className" @on-blur="blur" :type="type" v-model="inputValue" :maxlength="maxlength" :disabled="options.disabled" :clearable="options.clearable" :readonly="options.readonly" :placeholder="options.placeholder" :icon="options.icon" :size="options.size" :style="options.style">
		<!-- prepend -->
		<span v-if="prependText" slot="prepend" v-html="prependText"></span>
		<el-select v-if="prependSelect" v-model="prependValue" slot="prepend" :style="prependSelect.style">
			<el-option v-for="item in prependItems" :key="item.value" :value="item.value">{{ item.text }}</el-option>
		</el-select>
		<!-- append -->
		<span v-if="appendText" style="cursor:pointer;" @click="clickButton" slot="append" v-html="appendText"></span>
		<el-select v-if="appendSelect" v-model="appendValue" slot="append" :style="appendSelect.style">
			<el-option v-for="item in appendItems" :key="item.value" :value="item.value">{{ item.text }}</el-option>
		</el-select>
	</el-input>
</template>
<script>
import Utils from "../../Helper.js";

export default {
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		options: {
			type: Object
		},
		value: {}
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
		type() {
			return (
				(this.options.type == "input" || this.options.type == "number" ? "text" : this.options.type) || "text"
			);
		},
		isNumber() {
			return this.options.widget == "number" || this.options.type == "number";
		},
		digits() {
			return this.options.digits || 0;
		},
		maxlength() {
			return (
				this.options.maxlength ||
				(this.options.validate &&
					(Sunset.isNumber(this.options.validate.maxlength)
						? this.options.validate.maxlength
						: this.options.validate.maxlength && this.options.validate.maxlength.rule))
			);
		},
		prependText() {
			return this.options.prepend && Sunset.isString(this.options.prepend) ? this.options.prepend : false;
		},
		prependSelect() {
			return this.options.prepend && Sunset.isObject(this.options.prepend) ? this.options.prepend : false;
		},
		prependSpliter() {
			return (this.prependSelect && this.prependSelect.spliter) || ",";
		},
		appendText() {
			return this.options.append && Sunset.isString(this.options.append) ? this.options.append : false;
		},
		appendSelect() {
			return this.options.append && Sunset.isObject(this.options.append) ? this.options.append : false;
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
			if (this.options.click) {
				this.options.click(this.options, this.value);
			}
		},
		init() {
			this.inited = false;
			if (this.prependSelect) {
				Utils.generateItems(this.prependSelect).then(items => {
					this.prependItems = items;
					if (!this.value) {
						this.prependValue =
							this.defaultPrependValue == null
								? items.length ? items[0].value : null
								: this.defaultPrependValue;
					}
				});
			}
			if (this.appendSelect) {
				Utils.generateItems(this.appendSelect).then(items => {
					this.appendItems = items;
					if (!this.value) {
						this.appendValue =
							this.defaultAppendValue == null
								? items.length ? items[0].value : null
								: this.defaultAppendValue;
					}
				});
			}
			this.valueToInputValue(this.value);
			this.inited = true;
		},
		slientRefreshValue() {
			this.$nextTick(() => {
				this.lock = true;
				var value =
					this.inputValue && this.inputValue.length
						? `${this.prependSelect ? `${this.prependValue + this.prependSpliter}` : ""}${this.inputValue}${
								this.appendSelect ? `${this.appendSpliter + this.appendValue}` : ""
							}`
						: this.inputValue;
				this.$emit("input", value);
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
						if (!isNaN(this.options.min) && +this.inputValue < +this.options.min) {
							this.inputValue = Sunset.Numbers.fixed(this.options.min, this.digits) + "";
						}
						if (!isNaN(this.options.max) && +this.inputValue > +this.options.max) {
							this.inputValue = Sunset.Numbers.fixed(this.options.max, this.digits) + "";
						}
					}
				}
			}
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