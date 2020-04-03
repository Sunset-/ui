<template>
	<ctx-checkbox v-model="widgetValue"></ctx-checkbox>
</template>
<script>
import ctxCheckbox from "../../base/checkbox";

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
		value: {}
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
