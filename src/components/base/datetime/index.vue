<template>
	<div class="xui-datetime xui-datetime-style">
		<datetime-radio v-if="shortcuts" v-model="currentShortcut" :options="{manner:'button',data:shortcuts}" @click-item="clickShortcut"></datetime-radio>
		<element-date-picker ref="picker" :clearable="clearable" :disabled="disabled" v-model="widgetValue" :type="type" range-separator="-" :start-placeholder="startPlaceholder" :end-placeholder="endPlaceholder">
		</element-date-picker>
	</div>
</template>
<script>
import Sunset from "../../../common/sunset.js";
import datetimeRadio from "../radio";
import { DatePicker } from "element-ui";

export default {
	components: {
		datetimeRadio,
		elementDatePicker: DatePicker
	},
	model: {
		prop: "value",
		event: "input"
	},
	props: ["value", "options"],
	data() {
		return {
			currentShortcut: "",
			widgetValue: this.value,
			shortcutsMap: {},
			lock: false,
			tempdisabled:false
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		clearable() {
			return this.options.clearable;
		},
		disabled() {
			return this.options.disabled || this.tempdisabled;
		},
		shortcuts() {
			var shortcuts = this.safeOptions.shortcuts;
			if (shortcuts) {
				shortcuts = shortcuts.map(item => {
					this.shortcutsMap[item.label] = item;
					return {
						text: item.label,
						value: item.label
					};
				});
				shortcuts.push({
					text: "自定义",
					value: ""
				});
			}
			return shortcuts;
		},
		startPlaceholder() {
			return this.safeOptions.startPlaceholder || "";
		},
		endPlaceholder() {
			return this.safeOptions.endPlaceholder || "";
		},
		format() {
			return this.safeOptions.endPlaceholder || "yyyy-MM-dd";
		},
		type() {
			return this.safeOptions.type || "date";
		},
		valueFormat() {
			return this.safeOptions.valueFormat;
		},
		isMulti() {
			return this.type == "daterange" || this.type == "datetimerange";
		}
	},
	methods: {
		defaultValue(index) {
			this.lock = true;
			this.currentShortcut = this.shortcuts ? this.shortcuts[index].value : "";
			this.$nextTick(() => {
				this.lock = false;
			});
			return this.calculateValue();
		},
		selectShortcut(index) {
			this.currentShortcut = this.shortcuts ? this.shortcuts[index].value : "";
			return this.calculateValue();
		},
		clickShortcut(v) {
			if (v == "") {
				this.tempdisabled=false;
				this.$refs.picker.focus();
			}else {
				this.tempdisabled=true;
			}
		},
		formatDateValue(v) {
			var value = new Date(v);
			if (this.valueFormat === "timestamp") {
				return value.getTime();
			} else if (Sunset.isString(this.valueFormat)) {
				return Sunset.Dates.format(value, this.valueFormat);
			} else {
				return value;
			}
		},
		calculateValue() {
			var value = void 0;
			var currentShortcut = this.currentShortcut;
			var outValue = this.shortcutsMap[currentShortcut]
				? this.shortcutsMap[currentShortcut].value()
				: this.widgetValue;
			if (outValue) {
				value = [this.formatDateValue(outValue[0]), this.formatDateValue(outValue[1])];
			}
			if (!value || (!value[0] && !value[1])) {
				value = void 0;
			} else {
				value.__xui_daterange_type = this.currentShortcut;
			}
			this.$emit("input", value);
			if (this.value && (this.value[0] != value[0] || this.value[1] != value[1])) {
				this.$emit("change", value);
			}
			return value;
		}
	},
	watch: {
		currentShortcut(v) {
			if (!this.lock) {
				this.lock = true;
				this.calculateValue();
				this.$nextTick(() => {
					this.lock = false;
				});
			}
		},
		widgetValue(v) {
			if (!this.lock) {
				this.lock = true;
				this.calculateValue();
				this.$nextTick(() => {
					this.lock = false;
				});
			}
		},
		value(v) {
			var widgetValue = void 0;
			if (v) {
				if (v.__xui_daterange_type) {
					this.currentShortcut = v.__xui_daterange_type;
				} else {
					this.currentShortcut = "";
				}
				if (this.isMulti) {
					widgetValue = [v[0] && new Date(v[0]), v[1] && new Date(v[1])];
				} else {
					widgetValue = v;
				}
			}
			this.widgetValue = widgetValue;
		}
	}
};
</script>
<style lang="less">
.xui-datetime {
	display: inline-block;
}
</style>
