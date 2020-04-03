<template>
	<ctx-checkbox v-model="widgetValue" class="xui-ctxchecbox-single" :theme="theme"></ctx-checkbox>
</template>
<script>
import ctxCheckbox from "../checkbox";

export default {
	model: {
		prop: "value",
		event: "input"
	},
	components: {
		ctxCheckbox
	},
	props: {
		ctx: {},
		value: {},
		theme:{
			type:String
		}
	},
	computed: {
		widgetValue: {
			get() {
				return !!this.value;
			},
			set(v) {
				this.$emit("input", v, this.ctx);
				if (v != this.value) {
					this.$emit("change", v, this.ctx);
				}
			}
		}
	}
};
</script>
<style>
.xui-ctxchecbox-single {
	display: inline-block!important;
	vertical-align: middle;
	margin-right: 5px;
}
</style>

