<template>
	<div :class="['xui-color-group',cdisabled?'disabled':'']">
		<span v-for="(item,index) in items" :key="index" @click="selectItem(item)" :title="item.text" v-html="template(item,widgetValue[item.value]||value===item.value)"></span>
	</div>
</template>
<script>
import Utils from "../../Helper.js";

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
			items: []
		};
	},
	computed: {
		widgetValue: {
			set(v) {
				var value = void 0;
				if (Object.keys(v).length) {
					value = Object.keys(v).join(this.spliter);
				}
				this.$emit("input", value);
				if (v != this.value) {
					this.$emit("change", value);
				}
			},
			get() {
				var v = this.value;
				var checkedMap = {};
				if (v && v.length) {
					v.split(this.spliter).forEach(key => {
						checkedMap[key] = true;
					});
				} else if (v === "") {
					checkedMap[""] = true;
				}
				return checkedMap;
			}
		},
		safeOptions() {
			return this.options || {};
		},
		multiple() {
			return this.safeOptions.multiple;
		},
		cdisabled() {
			return this.disabled || this.safeOptions.disabled;
		},
		spliter() {
			return this.safeOptions.spliter || ",";
		},
		template() {
			return (
				this.safeOptions.template ||
				function(item, active) {
					return item.value;
				}
			);
		}
	},
	methods: {
		init() {
			Utils.generateItems(this.safeOptions).then(items => {
				this.items = items;
			});
		},
		selectItem(item) {
			if (this.cdisabled) {
				return;
			}
			if (this.multiple) {
				var widgetValue = this.widgetValue;
				if (widgetValue[item.value]) {
					delete widgetValue[item.value];
				} else {
					widgetValue[item.value] = true;
				}
				this.widgetValue = widgetValue;
			} else {
				var temp = {};
				temp[item.value] = true;
				this.widgetValue = temp;
			}
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
<style lang="scss">
.xui-color-group {
	&.disabled {
		& > span {
			cursor: not-allowed;
		}
	}
	& > span {
		display: inline-block;
		cursor: pointer;
		vertical-align: middle;
	}
}
</style>

