<template>
	<div class="xui-textarea xui-textarea-style">
		<textarea v-model="widgetValue" :maxlength="cmaxlength" :disabled="cdisabled" :readonly="creadonly" :placeholder="cplaceholder" :rows="safeOptions.rows||3" :autosize="safeOptions.autosize" :style="options.style">
		</textarea>
		<div v-if="cmaxlength&&options.lengthTip" style="padding:2px;font-size:14px;color:#ababab;text-align:right;">
			{{inputlength}}&nbsp;/&nbsp;{{cmaxlength}}
		</div>
	</div>
</template>
<script>
import { Input } from "element-ui";

export default {
	components: {
		elementInput: Input
	},
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		options: {
			type: Object
		},
		placeholder: {},
		readonly: {},
		maxlength: {},
		value: {}
	},
	data() {
		return {
			widgetValue: this.value
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		inputlength() {
			return (this.value && this.value.length) || 0;
		},
		creadonly() {
			return this.readonly || this.options.readonly;
		},
		cdisabled() {
			return this.disabled || this.options.disabled;
		},
		cplaceholder() {
			return this.placeholder || this.options.placeholder;
		},
		cmaxlength() {
			return (
				this.maxlength ||
				this.safeOptions.maxlength ||
				(this.options.validate &&
					(Sunset.isNumber(this.options.validate.maxlength)
						? this.options.validate.maxlength
						: this.options.validate.maxlength && this.options.validate.maxlength.rule))
			);
		}
	},
	methods: {
		clear() {
			this.widgetValue = "";
		}
	},
	watch: {
		widgetValue(v) {
			this.$emit("input", v);
		},
		value(v) {
			this.widgetValue = v;
		}
	}
};
</script>
<style lang="scss">
@import "~src/style/variable.scss";

.xui-textarea {
	textarea {
		border: 1px solid $color-border;
		width: 100%;
		font-family: 微软雅黑;
		outline: none;
		box-sizing: border-box;
	}
}
</style>