<template>
	<np-date-picker class="xui-datepicker xui-datepicker-style" :type="type" v-model="widgetValue" :picker-options="dateOptions" :startTimeValue="startTimeValue" :format="safeOptions.format" :safeOptions="dateOptions" :disabled="cdisabled" :clearable="safeOptions.clearable===false?false:true" :placement="safeOptions.placement" :editable="false" :placeholder="safeOptions.placeholder" :year-range="safeOptions.yearRange" :container-class="safeOptions.class">
	</np-date-picker>
</template>
<script>
import npDatePicker from "./np_datePicker/datePicker";
import Sunset from "../../../common/sunset";
export default {
	model: {
		prop: "value",
		event: "input"
	},
	components: {
		npDatePicker: npDatePicker
	},
	props: {
		options: {
			type: Object
		},
		disabled: {},
		value: {}
	},
	data() {
		return {};
	},
	computed: {
		widgetValue: {
			set(v) {
				var value = void 0;
				if (v) {
					value = this.formatDateValue(v);
				}
				this.$emit("input", value);
				if (value != this.value) {
					this.$emit("change", value);
					if (this.safeOptions.changeCallBack) {
						this.safeOptions.changeCallBack(val);
					}
				}
			},
			get() {
				var data;
				if (this.value) {
					data = new Date(this.value);
				} else {
					data = "";
				}
				return data;
			}
		},
		safeOptions() {
			return this.options || {};
		},
		cdisabled() {
			return this.disabled || this.safeOptions.disabled;
		},
		type() {
			return this.safeOptions.type || "date";
		},
		dateOptions() {
			var op = {};
			if (this.safeOptions.disabledDate) {
				op.disabledDate = this.safeOptions.disabledDate;
			} else {
				return;
			}
			return op;
		},
		valueFormat() {
			return this.safeOptions.valueFormat;
		},
		startTimeValue() {
			return this.safeOptions.startTimeValue;
		},
		yearRange() {
			return this.safeOptions.yearRange;
		}
	},
	methods: {
		formatDateValue(v) {
			var value = new Date(v);
			if (this.valueFormat === "timestamp") {
				return value.getTime();
			} else if (Sunset.isString(this.valueFormat)) {
				return Sunset.Dates.format(value, this.valueFormat);
			} else {
				return value;
			}
		}
	}
};
</script>
<style lang="scss">
.xui-datepicker {
	.calendarPanel .select_main .select_dropDown {
		overflow: hidden;
		.xui-scroll {
			height: 300px;
		}
	}
}
</style>
