<template>
	<div class="xui-time-picker xui-time-picker-style">
		<time-check-btn v-model="isTaskSection" align="right" :options="checkOptions" v-if="isCheckBox" style="display:inline-block"></time-check-btn>
		<element-time-select :placeholder="safeOptions.startplaceholder" :disabled="disabled || isDisabled" v-model="startTime" :picker-options="safeOptions" :value-format="valueFormat">
		</element-time-select>
		<element-time-select :placeholder="safeOptions.endplaceholder" :disabled="disabled || isDisabled" v-model="endTime" :picker-options="safeOptions" :value-format="valueFormat">
		</element-time-select>
	</div>
</template>
<script>
import timeCheckBtn from "../checkbox";
import { TimeSelect } from "element-ui";

export default {
	components: {
		timeCheckBtn,
		elementTimeSelect: TimeSelect
	},
	data() {
		return {
			isDisabled: false,
			isTaskSection: false,
			checkOptions: {
				multiple: false,
				clearable: true,
				disabled: false,
				// max:2,
				size: "normal",
				// enum: "SEX"
				data: [
					{
						text: "",
						value: 1
					}
				]
			}
		};
	},
	model: {
		prop: "value",
		event: "change"
	},
	props: {
		options: {
			type: Object,
			default() {
				return {};
			}
		},
		value: {
			type: Array,
			default() {
				return [];
			}
		},
		disabled:{
			type:Boolean,
			default:false
		}
	},
	computed: {
		safeOptions() {
			return this.options;
		},
		valueFormat() {
			return this.safeOptions.valueFormat;
		},
		isCheckBox() {
			return this.safeOptions.ischeckbox;
		},
		widgetValue() {
			return this.value;
		},
		startTime: {
			set(v) {
				this.widgetValue[0] = v;
				this.caculcateValue();
			},
			get() {
				return this.widgetValue[0];
			}
		},
		endTime: {
			set(v) {
				this.widgetValue[1] = v;
				this.caculcateValue();
			},
			get(v) {
				return this.widgetValue[1];
			}
		}
	},
	methods: {
		caculcateValue() {
			var value = [];
			value[0] = this.widgetValue[0];
			value[1] = this.widgetValue[1];
			this.$emit("change", value);
			this.$emit("search");
		}
	},
	mounted() {
		if (this.isCheckBox) {
			this.isDisabled = true;
		}
	},
	watch: {
		isTaskSection(v) {
			if (!!v) {
				this.isDisabled = false;
			} else {
				this.isDisabled = true;
			}
		}
	}
};
</script>
<style lang="less">
.xui-time-picker-style {
	.el-date-editor.el-input {
		width: 120px;
		margin-left: 7px;
	}
}
</style>
