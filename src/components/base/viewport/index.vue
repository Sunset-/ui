<template>
	<div class="xui-viewport xui-viewport-style">
		<slot></slot>
	</div>
</template>
<script>
import Vue from "vue";
import Sunset from "src/common/sunset";
import Viewport from "./viewport.js";

export default {
	props: {
		options: {}
	},
	data() {
		return {
			viewport: null
		};
	},
	methods: {
		init() {
			this.viewport = new Viewport(this.$el, this.options, this);
		},
		refresh() {
			this.viewport && this.viewport.render();
		},
		setData(records) {
			if (!Sunset.isArray(records)) {
				console.warn("viewport data must be Array , it's " + records);
			}
			this.viewport && this.viewport.setRecords(records);
		},
		appendData(records) {
			if (!Sunset.isArray(records)) {
				console.warn("viewport data must be Array , it's " + records);
			}
			this.viewport && this.viewport.appendRecords(records);
		},
		removeRecord(record) {
			this.viewport && this.viewport.removeRecord(record);
		},
		clear() {
			this.viewport && this.viewport.clear();
		}
	},
	mounted() {
		this.init();
	}
};
</script>
<style lang="scss">
.xui-viewport {
	position: relative;
	height: 100%;
	overflow: hidden;
	.xui-viewport-scroll {
		position: relative;
		height: 100%;
		overflow-y: scroll;
		overflow-x: hidden;
		margin-right: -17px;
	}
	.xui-viewport-scroll-bar {
		position: absolute;
		right: 2px;
		bottom: 2px;
		z-index: 1;
		border-radius: 10px;
		background: rgba(#ccc, 0);
		transition: all 0.12s ease-out;
		visibility: hidden;
		&.visible {
			visibility: visible;
		}
		&.vertical {
			width: 6px;
			top: 2px;
			& > div {
				width: 100%;
			}
		}
		&:hover,
		&.hover {
			width: 10px;
			background: rgba(#ccc, 0.5);
		}
	}
	.xui-viewport-scroll-bar-slider {
		position: relative;
		display: block;
		width: 100%;
		height: 0;
		cursor: pointer;
		border-radius: inherit;
		background: rgba(#777, 0.5);
		transition: background-color 0.3s;
	}
}
</style>


