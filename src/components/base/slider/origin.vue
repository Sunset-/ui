<style lang="scss">
.xui-slider {
	.el-slider {
		display: inline-block;
		vertical-align: middle;
		width: 200px;
		height: 26px;
		.el-slider__runway {
			margin: 10px 0px !important;
			height: 8px;
			background: #e7e7e7;
		}
		.el-slider__bar {
			height: 8px;
			background-color: #368fff;
		}
		.el-slider__button {
			width: 8px;
			height: 8px;
			margin-top: 2px;
			background-color: #fff;
			border: 1px solid #20a0ff;
		}
		.el-slider__button-wrapper {
			transform: translateX(-50%);
		}
	}
	.range-number {
		display: inline-block;
		vertical-align: middle;
		margin: 0px 5px;
	}
}
</style>

<template>
	<div :class="['xui-slider xui-slider-style',safeOptions.range?'range-slider':'',safeOptions.className]">
		<span v-if="safeOptions.range" class="range-number">{{widgetValue[0]}}</span>
		<element-slider v-model="widgetValue" :min="safeOptions.min" :max="safeOptions.max" :disabled="safeOptions.disabled" :range="safeOptions.range" :step="safeOptions.step" :style="sliderStyle">
		</element-slider>
		<span v-if="safeOptions.range" class="range-number">{{widgetValue[1]}}</span>
		<span v-if="!safeOptions.range" class="range-number">{{widgetValue}}</span>
	</div>
</template>
<script>
import { Slider } from "element-ui";
import Utils from "../../Helper.js";
import Sunset from "../../../common/sunset";

export default {
	components: {
		elementSlider: Slider
	},
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
		return {};
	},
	computed: {
		widgetValue: {
			get() {
				var value = this.value;
				var widgetValue;
				if (this.safeOptions.range) {
					if (Sunset.isString(value)) {
						value = value.split(this.spliter);
					}
					if (Sunset.isArray(value)) {
						widgetValue = value.slice(0, 2).map(n => +n);
					} else {
						widgetValue = [+this.options.min, +this.options.max];
					}
				} else {
					widgetValue = +(value === void 0 ? this.options.min || 0 : value);
				}
				return widgetValue;
			},
			set(v) {
				var value = Sunset.isArray(v) ? v.join(this.spliter) : v;
				this.$emit("input", value);
				if (value != this.value) {
					this.$emit("change", v);
				}
			}
		},
		safeOptions() {
			return this.options || {};
		},
		spliter() {
			return this.safeOptions.spliter || ",";
		},
		sliderStyle() {
			if (this.safeOptions.sliderStyle) {
				return this.safeOptions.sliderStyle;
			} else if (this.safeOptions.sliderWidth) {
				return {
					width: `${this.safeOptions.sliderWidth}px`
				};
			}
		}
	}
};
</script>