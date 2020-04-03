<style lang="scss">
.xui-widgets {
	.xui-widgets-item {
		display: inline-block;
		vertical-align: middle;
	}
}
</style>
<template>
	<div class="xui-widgets xui-widgets-style">
		<div v-for="(widget,index) in widgets" :key="index" class="xui-widgets-item" :style="widget.wrapstyle">
			<div class="xui-widgets-item-label" v-if="widget.label" v-html="widget.label"></div>
			<component :is="'xui-formwidget-'+widget.widget" :options="widget" :disabled="disabled" v-model="inputValues[widget.name]"></component>
		</div>
	</div>
</template>
<script>
import Sunset from "../../../common/sunset";
import widgets from "../../widgets.js";

var widgetComponents = Object.keys(widgets).reduce((res, key) => {
	res[`xui-formwidget-${key}`] = widgets[key];
	return res;
}, {});

export default {
	components: widgetComponents,
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		options: {
			type: Object
		},
		value: {},
		disabled: {}
	},
	data() {
		return {
			inputValues: {},
			lock: false
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		widgets() {
			return this.options.widgets || [];
		},
		format() {
			if (Sunset.isFunction(this.safeOptions.format)) {
				return this.safeOptions.format;
			} else {
				return function(m) {
					return JSON.parse(JSON.stringify(m));
				};
			}
		},
		cast() {
			if (Sunset.isFunction(this.safeOptions.cast)) {
				return this.safeOptions.cast;
			} else {
				return function(m) {
					return m || {};
				};
			}
		}
	},
	methods: {
		init() {
			this.widgets.forEach(w => {
				if (w.name) {
					this.$set(this.inputValues, w.name, void 0);
				}
			});
		}
	},
	mounted() {
		this.init();
	},
	watch: {
		inputValues: {
			handler(values) {
				if (!this.lock) {
					var value = this.format(values);
					if (value != this.value) {
						this.$emit("change", value);
					}
					this.$emit("input", value);
				}
			},
			deep: true
		},
		value: {
			handler(value) {
				this.lock = true;
				var values = this.cast(value);
				this.inputValues = values;
				this.$nextTick(() => {
					this.lock = false;
				});
			},
			deep: true
		}
	}
};
</script>