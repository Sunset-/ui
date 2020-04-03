<template>
	<div class="xui-timeline">
		<div class="xui-timeline-item" :style="'border-color:'+ccolor(item,index,items)" v-for="(item,index) in items" :key="index">
			<i class="xui-timeline-icon default-icon" :style="'background:'+ccolor(item,index,items)"></i>
			<slot :item="item" :index="index"></slot>
		</div>
	</div>
</template>
<script>
import Sunset from "../../../common/sunset";

export default {
	props: {
		data: {},
		color: {},
		options: {}
	},
	data() {
		return {
			items: this.data || []
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		ccolor() {
			var color = this.color || this.safeOptions.color;
			return Sunset.isFunction(color)
				? color
				: () => {
						return color || "orange";
				  };
		}
	},
	methods: {
		setData(items) {
			this.items = items;
		}
	},
	watch: {
		data(v) {
			this.items = v || [];
		}
	}
};
</script>
<style lang="scss">
.xui-timeline {
	position: relative;
	height: 200px;
	&:before {
		content: "";
		position: absolute;
		left: 0px;
		right: 0px;
		top: 50%;
		margin-top: -1px;
		height: 0px;
		border-top: 2px dashed #ccc;
	}
	&:after {
		content: "";
		position: absolute;
		right: 0px;
		top: 50%;
		transform: translate(55%, -50%);
		-webkit-transform: translate(55%, -50%);
		height: 0px;
		width: 0px;
		border-style: solid;
		border-width: 8px 16px;
		border-color: transparent transparent transparent #ccc;
	}
	.xui-timeline-item {
		position: relative;
		z-index: 1;
		height: 50%;
		display: inline-block;
		border-left: 1px solid #fff;
		&:nth-child(2n) {
			position: relative;
			top: 50%;
			.xui-timeline-icon {
				bottom: auto;
				top: 0px;
				transform: translate(-50%, -50%);
				-webkit-transform: translate(-50%, -50%);
			}
		}
	}
	.xui-timeline-icon {
		position: absolute;
		left: 0px;
		bottom: 0px;
		transform: translate(-50%, 50%);
		-webkit-transform: translate(-50%, 50%);
		&.default-icon {
			width: 14px;
			height: 14px;
			background: #fff;
			border: 1px solid attr(color);
			border-radius: 50%;
			text-align: center;
			&:after {
				content: "";
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				-webkit-transform: translate(-50%, -50%);
				width: 50%;
				height: 50%;
				border: 2px solid #fff;
				border-radius: 50px;
			}
		}
	}
}
</style>
