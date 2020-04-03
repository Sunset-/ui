<template>
	<component class="xui-toolbar-widget" :is="widgetType" v-model="widgetValue" :options="options" :disabled="checkDisabled(options)" :size="options.size" :ctx="ctx" @change="widgetOperate" @click.native.stop="emptyHandle"></component>
</template>
<script>
import Sunset from "../../../common/sunset";
import Helper from "../../Helper.js";
import widgets from "../form/form-widgets.js";

export default {
	components: widgets,
	props: {
		options: {},
		ctx: {}
	},
	data() {
		return {
			widgetValue: this.getWidgetValue()
		};
	},
	computed: {
		widgetType() {
			return "xui-formwidget-" + this.options.widget;
		}
	},
	watch:{
		ctx:{
			handler() {
				this.widgetValue = this.getWidgetValue()
			},
			deep:true
		}
	},
	methods: {
		emptyHandle() {},
		checkDisabled(tool) {
			var disabledValue = false;
			if (tool.disabled === true) {
				disabledValue = true;
			} else if (Sunset.isFunction(tool.disabled)) {
				disabledValue = !!tool.disabled(this.ctx);
			} else {
				disabledValue = false;
			}
			return disabledValue;
		},
		widgetOperate(v) {
			Helper.operate.call(this, this.options, this.ctx, v, resetV => {
				this.$nextTick(() => {
					this.widgetValue = resetV;
				});
			});
		},
		getWidgetValue() {
			return Sunset.isFunction(this.options.default) ? this.options.default(this.ctx) : this.options.default
		}
	}
};
</script>
<style>
</style>

