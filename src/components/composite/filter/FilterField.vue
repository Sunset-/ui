<style lang="scss">
.xui-filter-field {
	display: inline-block;
	vertical-align: middle;
	font-size: 0px;
	min-height: 50px;
	line-height: 50px;
	&.form-row-col-0 {
		margin-right: 10px;
	}
	&.monopolize {
		display: block;
	}
	&:last-child {
		margin-right: 0px;
	}
	.xui-field-wrap {
		width: 100%;
		font-size: 12px;
		.xui-field-label {
			width: 80px;
			display: table-cell;
			padding: 0px 10px;
			white-space: nowrap;
			text-align: right;
			vertical-align: middle;
			&.xui-field-label-empty {
				padding: 0px;
			}
		}
		.xui-field {
			display: table-cell;
		}
	}
	.control-label {
		display: table-cell;
		padding: 0px 10px;
		white-space: nowrap;
		vertical-align: middle;
	}
	.input-group {
		display: table-cell;
		width: 100%;
	}
}
</style>
<template>
	<div v-show="visible" :style="options.style" :class="['xui-filter-field',options.className,options.monopolize?'monopolize':'']">
		<div class="xui-field-wrap">
			<label v-if="options.label" :style="labelStyle" class="xui-field-label">
				<span v-html="options.label"></span>
			</label>
			<div class="xui-field">
				<component :class="mannerClass" :is="widget" :options="options" :style="widgetStyle" v-model="fieldValue" @search="fieldSearch"></component>
			</div>
		</div>
	</div>
</template>
<script>
import widgets from "./filter-widgets.js";
import Sunset from "../../../common/sunset";

export default {
	components: widgets,
	model: {
		prop: "value",
		event: "change"
	},
	props: {
		options: {
			type: Object
		},
		formOptions: {},
		value: {},
		filter: {}
	},
	data() {
		return {
			fieldValue: this.value
		};
	},
	computed: {
		visible() {
			return Sunset.isFunction(this.options.visible) ? this.options.visible() : this.options.visible !== false;
		},
		widget() {
			return "xui-filterwidget-" + this.options.widget;
		},
		labelStyle() {
			if (this.options.labelStyle) {
				return this.options.labelStyle;
			} else if (this.formOptions.labelStyle) {
				return this.formOptions.labelStyle;
			} else {
				return `min-width:90px`;
			}
		},
		widgetStyle() {
			if (this.options.widgetStyle) {
				return this.options.widgetStyle;
			} else if (this.formOptions.widgetStyle) {
				return this.formOptions.widgetStyle;
			}
		},
		mannerClass() {
			return this.options.manner ? `xui-${this.options.widget}-manner-${this.options.manner}` : "";
		}
	},
	methods: {
		fieldSearch() {
			this.$emit("search");
		},
		generateWatchDependent(watchs) {
			var dep = {},
				filter = this.filter;
			watchs.split(",").forEach(w => {
				dep[w] = filter[w];
			});
			return dep;
		},
		rebuild(watchs, rebuild) {
			Promise.resolve()
				.then(() => {
					return rebuild.call(this.options, this.generateWatchDependent(watchs), this.options, this.filter);
				})
				.then(res => {
					if (res !== false) {
						this.$children[0].init && this.$children[0].init();
					}
				});
		}
	},
	mounted() {
		this.$watch("value", (v, oldv) => {
			if (JSON.stringify(v) === JSON.stringify(oldv)) {
				return;
			}
			this.fieldValue = v;
			if (this.options.onChange || this.options.changeFilter) {
				this.options.onChange && this.options.onChange(v);
				this.options.changeFilter && this.$emit("search");
			}
		});

		if (this.options.watch) {
			var watchs, rebuild;
			if (Sunset.isString(this.options.watch) && Sunset.isFunction(this.options.rebuild)) {
				watchs = this.options.watch;
				rebuild = this.options.rebuild;
			} else if (Sunset.isArray(this.options.watch)) {
				if (Sunset.isString(this.options.watch[0]) && Sunset.isFunction(this.options.watch[1])) {
					watchs = this.options.watch[0];
					rebuild = this.options.watch[1];
				}
			}
			//监听重建
			if (watchs && rebuild) {
				watchs.split(",").forEach(w => {
					this.$watch(`filter.${w}`, v => {
						this.rebuild(watchs, rebuild);
					});
				});
				this.rebuild(watchs, rebuild);
			}
		}
	},
	watch: {
		fieldValue(v) {
			this.$emit("change", v);
		}
	}
};
</script>