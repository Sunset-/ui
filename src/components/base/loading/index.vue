<style lang="scss">
.xui-loading {
	position: relative;
	&.xui-loading-inner {
		position: absolute;
		left: 0px;
		right: 0px;
		top: 0px;
		bottom: 0px;
	}
	.xui-loading-shim {
		position: absolute;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		z-index: 1;
		background: rgba(255, 255, 255, 0.5);
		text-align: center;
		color: #409eff;
		.xui-loading-spin {
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translate(0, -50%);
			.circular {
				height: 42px;
				width: 42px;
				animation: loading-rotate 2s linear infinite;
			}
			.path {
				animation: loading-dash 1.5s ease-in-out infinite;
				stroke-dasharray: 90, 150;
				stroke-dashoffset: 0;
				stroke-width: 2;
				stroke: #409eff;
				stroke-linecap: round;
			}
		}
		.demo-spin-icon-load {
			animation: loading-rotate 1s linear infinite;
		}
		@keyframes loading-rotate {
			from {
				transform: rotate(0deg);
			}
			50% {
				transform: rotate(180deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
	}
}
</style>
<template>
	<div :class="['xui-loading xui-loading-style',inner?'xui-loading-inner':'']">
		<slot></slot>
		<div v-show="rloading" class="xui-loading-shim" :style="cshimStyle">
			<div class="xui-loading-spin">
				<svg viewBox="25 25 50 50" class="circular">
					<circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
				</svg>
				<div v-html="ctext"></div>
			</div>
		</div>
	</div>
</template>

<script>

import Sunset from "../../../common/sunset";

export default {
	props: {
		loading: {},
		inner: {},
		text: {},
		shim: {},
		delay: {},
		options: {}
	},
	data() {
		return {
			rloading: this.loading,
			delayTimer: null
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		ctext() {
			return this.text || this.safeOptions.text;
		},
		cshimStyle() {
			return this.shim || this.safeOptions.shim;
		},
		cdelay() {
			return this.delay || this.safeOptions.delay;
		}
	},
	methods: {
		clearTimer(nextTimer, time) {
			if (this.delayTimer) {
				clearTimeout(this.delayTimer);
				this.delayTimer = null;
			}
			if (nextTimer) {
				this.delayTimer = setTimeout(nextTimer, time);
			}
		}
	},
	watch: {
		loading(v) {
			if (v) {
				var delay = this.cdelay;
				if (!delay) {
					this.rloading = true;
					this.clearTimer();
				} else {
					var delayTime = Sunset.isNumber(delay) ? delay : 300;
					this.clearTimer(() => {
						this.rloading = true;
					}, delayTime);
				}
			} else {
				this.rloading = false;
				this.clearTimer();
			}
		}
	}
};
</script>