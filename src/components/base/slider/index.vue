<template>
	<div :class="['xui-slider xui-slider-style',safeOptions.range?'range-slider':'',safeOptions.className]">
		<span v-if="safeOptions.range" class="range-number">{{start}}</span>
		<div ref="bar" class="xui-slider-bar" :style="sliderStyle" @click="jump($event)">
			<div class="xui-slider-bar-inner" :style="barInnerStyle">
				<div @mousedown="drag($event,end)" ondragstart="return false;" class="xui-slider-point xui-sp-start"></div>
				<div @mousedown="drag($event,start)" ondragstart="return false;" class="xui-slider-point xui-sp-end"></div>
			</div>
			<span v-if="showStops" class="xui-slider-stop" v-for="(stop,index) in stops" :key="index" :style="stop"></span>
		</div>
		<span class="range-number" v-if="!safeOptions.showCounter">{{end}}</span>
		<np-counter v-model="value" v-if="safeOptions.showCounter && !safeOptions.range" @change="handleChange" :max="options.max" :min="options.min" :step="options.step"></np-counter>
	</div>
</template>
<script>
import Utils from "../../Helper.js";
import Sunset from "../../../common/sunset";
import DomHelper from "../../dom-helper";
import NpCounter from "../counter/index"
export default {
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
	components:{
		NpCounter
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
		isRange() {
			return this.safeOptions.range === true;
		},
		start() {
			return this.isRange ? this.widgetValue[0] : this.min;
		},
		end() {
			return this.isRange ? this.widgetValue[1] : this.widgetValue;
		},
		min() {
			return this.safeOptions.min;
		},
		max() {
			return this.safeOptions.max;
		},
		step() {
			return this.safeOptions.step || 1;
		},
		stops() {
			var stops = [];
			for (var i = this.min + this.step; i < this.max; i += this.step) {
				stops.push(`left:${(i - this.min) * 100.0 / this.fullRange}%;`);
			}
			return stops;
		},
		showStops() {
			return this.safeOptions.showStops;
		},
		range() {
			return this.end - this.start;
		},
		fullRange() {
			return this.max - this.min;
		},
		barInnerStyle() {
			var left = (this.start - this.min) * 100.0 / this.fullRange;
			return `width:${this.range * 100.0 / this.fullRange}%;left:${left}%;`;
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
	},
	methods: {
		jump(ev) {
			var near = this.calculate(ev.pageX);
			if (!this.isRange) {
				this.widgetValue = near;
			} else {
				if (Math.abs(this.start - near) < Math.abs(this.end - near)) {
					this.widgetValue = [near, this.widgetValue[1]];
				} else {
					this.widgetValue = [this.widgetValue[0], near];
				}
			}
		},
		drag(ev, other) {
			var target = ev.target,
				self = this;
			function move(e) {
				var near = self.calculate(e.pageX);
				if (!self.isRange) {
					self.widgetValue = near;
				} else {
					self.widgetValue = [other, near].sort((o1, o2) => {
						return o1 < o2 ? -1 : o1 > o2 ? 1 : 0;
					});
					console.log(self.widgetValue);
				}
			}
			function remove(e) {
				document.removeEventListener("mousemove", move);
				document.removeEventListener("mouseup", remove);
				e.stopPropagation();
				return false;
			}
			document.addEventListener("mousemove", move);
			document.addEventListener("mouseup", remove);
		},
		calculate(x) {
			var clickPoint = (x - DomHelper.offset(this.$refs.bar).left) * 1.0 / this.$refs.bar.clientWidth;
			clickPoint = clickPoint * this.fullRange + this.min;
			var p = Math.round(clickPoint / this.step) * this.step;
			p = Math.min(this.max, p);
			p = Math.max(this.min, p);
			return p;
		},
		handleChange(v) {
			this.$emit("input",v);
			this.$emit("change",v);
		}
	}
};
</script>
<style lang="scss">
@import "~src/style/variable.scss";

.xui-slider {
	.xui-slider-bar {
		display: inline-block;
		color: $color-primary;
		position: relative;
		width: 100%;
		margin: 10px 0;
		height: 8px;
		background-color: $color-border;
		border-radius: 10px;
		position: relative;
		cursor: pointer;
		vertical-align: middle;
		.xui-slider-bar-inner {
			border-radius: 10px;
			position: absolute;
			z-index: 1;
			height: 100%;
			background-color: currentColor;
		}
		.xui-slider-stop {
			position: absolute;
			border-radius: 20px;
			width: 8px;
			height: 8px;
			background: darken($color-background, 15%);
			top: 50%;
			transform: translate(-50%, -50%);
		}
		.xui-slider-point {
			position: absolute;
			border: 1px solid currentColor;
			border-radius: 10px;
			width: 10px;
			height: 10px;
			background: #fff;
			top: 50%;
			transition: 0.2s;
			-ms-user-select: none;
			user-select: none;
			cursor: -webkit-grab;
			cursor: grab;
			&.xui-sp-start {
				display: none;
				left: 0px;
				transform: translate(-50%, -50%);
			}
			&.xui-sp-end {
				right: 0px;
				transform: translate(50%, -50%);
			}
			&:hover {
				width: 16px;
				height: 16px;
			}
		}
	}
	&.range-slider {
		.xui-slider-point.xui-sp-start {
			display: block;
		}
	}
	.range-number {
		display: inline-block;
		vertical-align: middle;
	}
}
</style>
