<style lang="scss">
.xui-radio-group {
	display: inline-block;
	vertical-align: middle;
	$color: #409eff;
	$borderColor: #cdcdcd;
	line-height: 1;

	$sizes: (
		(name: "mini", font: 12px, circle: 12px),
		(name: "small", font: 14px, circle: 14px),
		(name: "normal", font: 16px, circle: 16px)
	);

	.xui-radio {
		padding-right: 5px;
		cursor: pointer;
		& > span {
			font-size: 14px;
			display: inline-block;
			vertical-align: middle;
		}
		input[type="radio"] {
			display: none;
		}
		input[type="radio"] + i {
			position: relative;
			display: inline-block;
			vertical-align: middle;
			border-radius: 50%;
			width: 12px;
			height: 12px;
			border: 1px solid $borderColor;
		}
		input[type="radio"]:checked + i {
			border: 1px solid $color;
		}
		input[type="radio"] + i:hover {
			border: 1px solid $color;
		}
		input[type="radio"] + i:before {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			width: 0;
			height: 0;
			border-radius: 50%;
			background: $color;
			transition: all 0.1s ease;
			-webkit-transition: all 0.1s ease;
			-moz-transition: all 0.1s ease;
		}
		input[type="radio"]:checked + i:before {
			width: 70%;
			height: 70%;
		}
	}
	// disabled
	&.disabled {
		.xui-radio {
			cursor: not-allowed;
			& > span {
				color: $borderColor;
			}
			input[type="radio"] + i:hover {
				border: 1px solid $borderColor;
			}
		}
	}
	//size
	@for $i from 1 through length($sizes) {
		$item: nth($sizes, $i);
		&.xui-radio-#{map-get($item, name)} {
			.xui-radio {
				& > span {
					font-size: map-get($item, font);
				}
				input[type="radio"] + i {
					width: map-get($item, circle);
					height: map-get($item, circle);
				}
			}
		}
	}
	//manner
	&.xui-radio-manner-button {
		.xui-radio {
			& > input[type="radio"] + i {
				display: none;
			}
			& > span {
				padding: 2px 5px;
				border-radius: 2px;
			}
			&.checked > span {
				background: $color;
				color: #fff;
			}
		}
	}
}
</style>
<template>
	<div :class="['xui-radio-group xui-radio-group-style',safeOptions.size?('xui-radio-'+safeOptions.size):'',safeOptions.manner?('xui-radio-manner-'+safeOptions.manner):'',cdisabled?'disabled':'']">
		<label v-for="(item,index) in items" :key="index" :class="['xui-radio',item.value===widgetValue?'checked':'']" @click="clickHandle(item.value)">
			<input type="radio" :name="uid" v-model="widgetValue" :value="item.value" :disabled="cdisabled" />
			<i></i>
			<span v-html="item.text"></span>
		</label>
	</div>
</template>
<script>
import Sunset from "../../../common/sunset";
import Utils from "../../Helper.js";
var uniqId = 0;

export default {
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		options: {
			type: Object
		},
		disabled: {},
		value: {}
	},
	data() {
		return {
			uid: "xui-radio-group-" + ++uniqId,
			items: []
		};
	},
	computed: {
		widgetValue: {
			set(v) {
				this.$emit("input", v);
				if (v != this.value) {
					this.$emit("change", v);
				}
			},
			get() {
				return this.value;
			}
		},
		safeOptions() {
			return this.options || {};
		},
		cdisabled() {
			return this.disabled === true || this.safeOptions.disabled === true;
		},
		border() {
			return this.safeOptions.type == "button";
		}
	},
	methods: {
		init() {
			this.$emit("pending");
			Utils.generateItems(this.safeOptions).then(items => {
				this.items = items;
			});
		},
		clear() {
			this.widgetValue = "";
		},
		clickHandle(v) {
			this.$emit("click-item", v);
		}
	},
	mounted() {
		this.init();
		this.$watch("options.data", function() {
			this.init();
		});
		this.$watch("options.enum", function() {
			this.init();
		});
	}
};
</script>