<template>
	<div class="xui-multiselect xui-multiselect-style" ref="reference">
		<div :class="['multiselect-trigger',cdisabled?'disabled':'',showDropdown?'open':'']" @click="togglePicker()" :title="searchKeyword">
			<div v-if='title' :title='title' class='multiselect-trigger-title'>{{title}}</div>
			<div v-if='!title&&safeOptions.readonly' class='multiselect-trigger-title-placeholder'>{{safeOptions.placeholder||''}}</div>
			<input :class="['multiselect-trigger-input',cdisabled?'disabled':'',showDropdown?'active':'']" :title="searchKeyword" @input="filterMethod" :disabled="cdisabled" :placeholder="!safeOptions.readonly&&!value?safeOptions.placeholder:''" :readonly="safeOptions.readonly||false" v-model="searchKeyword" />
			<i :class="['select-trigger-icon xui-icon xui-icon-unfold',showDropdown?'active':'']"></i>
		</div>
		<multiselect-picker ref="picker" :fixed="true" @visible="pickerVisible">
			<div class="xui-multiselect-box" :style="'min-width:'+pickerWidth+'px'">
				<div class="multiselect-toolbar" v-show="items && items.length>0">
					<div class="left-btns">
						<span :class="['check-all',isSelectedAll?'selected':'']" @click="selectAll" href="javascript:;">全选</span>
						<span class="clear-all" @click="clearAll" href="javascript:;">清空</span>
					</div>
					<div class="right-btns">
						<span class="finish" @click="togglePicker(false)">完成</span>
					</div>
				</div>
				<multiselect-scroll style="max-height:200px;" wrap-style="max-height:200px;">
					<ul class="multiselect-options">
						<li :class="['multiselect-option',selectedMap[item.value]?'selected':'']" v-for="item in filterItems||items" @click="selectItem(item)" :title="item.text" :key="item.value" v-html="template(item)">
						</li>
					</ul>
				</multiselect-scroll>
			</div>
		</multiselect-picker>
	</div>
</template>
<script>
import Sunset from "../../../common/sunset";
import Utils from "../../Helper.js";
import MultiselectPicker from "../picker";
import MultiselectScroll from "../scroll";
import { debuglog } from "util";

export default {
	components: { MultiselectPicker, MultiselectScroll },
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		options: {},
		value: {},
		disabled: {}
	},
	data: function() {
		return {
			items: [],
			title: "",
			filterItems: null,
			showDropdown: false,
			isCheckedAll: false,
			searchKeyword: "",
			pickerWidth: 200
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		splitter() {
			return this.safeOptions.splitter || ",";
		},
		cdisabled() {
			return this.disabled || this.safeOptions.disabled;
		},
		selectedMap: {
			get() {
				var v = this.value || "";
				return v.split(this.splitter).reduce((res, v) => {
					if (v != "") {
						res[v] = true;
					}
					return res;
				}, {});
			},
			set(v) {
				v = v || {};
				var value = Object.keys(v).join(this.splitter);
				if (value != this.value) {
					this.$emit("change", value);
				}
				this.changeFilter();
				this.$emit("input", value);
			}
		},
		isSelectedAll() {
			var map = this.selectedMap,
				items = this.filterItems || this.items;
			this.changeFilter();
			for (var i = 0, l = items.length; i < l; i++) {
				if (!map[items[i].value]) {
					return false;
				}
			}
			return true;
		},
		// title() {
		// 	var selectItems = this.items.filter(item => this.selectedMap[item.value]);
		// 	if (!selectItems.length) {
		// 		return "";
		// 	}
		// 	if (Sunset.isFunction(this.safeOptions.render)) {
		// 		return this.safeOptions.render(selectItems);
		// 	} else {
		// 		return selectItems.map(item => item.text).join(this.splitter);
		// 	}
		// },
		template() {
			if (Sunset.isFunction(this.safeOptions.template)) {
				return this.safeOptions.template;
			} else {
				return function(item) {
					return item.text;
				};
			}
		}
	},
	methods: {
		init() {
			this.inited = true;
			Utils.generateItems(this.options).then(items => {
				this.items = items;
			});
			this.refreshPickerWidth();
		},
		/********  过滤 *********/
		filterMethod(e) {
			var v = this.searchKeyword.replace(/(^\s*)|(\s*$)/g, "").toLowerCase();
			if (v == "" || v == void 0) {
				this.filterItems = null;
				return;
			}
			var filterMethod = Sunset.isFunction(this.options && this.options.filter)
				? this.options.filter
				: function(item, v) {
						return (
							(item.text + "").toLowerCase().indexOf(v) >= 0 ||
							(item.value + "").toLowerCase().indexOf(v) >= 0 ||
							(item.keywords && (item.keywords + "").toLowerCase().indexOf(v) >= 0)
						);
				  };
			var filterItems = this.items.filter(item => {
				return filterMethod(item, v);
			});
			this.filterItems = filterItems;
		},
		// filter
		changeFilter() {
			var selectItems = this.items.filter(item => this.selectedMap[item.value]);
			if (!selectItems.length) {
				this.title = "";
			} else {
				if (Sunset.isFunction(this.safeOptions.render)) {
					this.title = this.safeOptions.render(selectItems);
				} else {
					this.title = selectItems.map(item => item.text).join(this.splitter);
				}
			}
		},
		selectItem(item) {
			var selectedMap = this.selectedMap;
			if (!selectedMap[item.value]) {
				selectedMap[item.value] = true;
			} else {
				delete selectedMap[item.value];
			}
			this.selectedMap = selectedMap;
		},

		selectAll() {
			var selectedMap = this.selectedMap;
			let allData = this.filterItems || this.items;
			if (!this.isSelectedAll) {
				allData.forEach(item => {
					selectedMap[item.value] = true;
				});
			} else {
				allData.forEach(item => {
					delete selectedMap[item.value];
				});
			}
			this.selectedMap = selectedMap;
		},
		clearAll() {
			this.selectedMap = {};
			this.title = "";
		},
		isSelected(item) {
			return this.selectedMap[item.value];
		},
		togglePicker() {
			this.$refs.picker.toggle();
		},
		pickerVisible(v) {
			this.showDropdown = v;
			this.refreshPickerWidth();
		},
		refreshPickerWidth() {
			this.pickerWidth = this.$el.clientWidth;
		}
	},
	mounted() {
		this.init();
		this.$watch("options.data", () => {
			this.init();
		});
		this.$watch("options.enum", () => {
			this.init();
		});
	}
};
</script>
<style lang="scss">
@import "~src/style/variable.scss";

.xui-multiselect {
	position: relative;
	display: inline-block;
	width: 140px;
	height: 28px;
	vertical-align: middle;
	.icon {
		display: inline-block;
		width: 13px;
		height: 16px;
		vertical-align: middle;
	}
	.multiselect-trigger {
		position: relative;
		display: block;
		width: 100%;
		height: 28px;
		font-size: 12px;
		text-indent: 10px;
		line-height: 28px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		color: rgb(31, 45, 61);
		background: #fff;
		border: 1px solid #bfc7d1;
		outline: none;
		&.disabled {
			cursor: not-allowed;
		}
		.multiselect-trigger-title {
			float: left;
		}
		.multiselect-trigger-title-placeholder {
			float: left;
			color: #a5b0b6;
		}
		.multiselect-trigger-input {
			border: none;
			// position: absolute;
			// top: 0px;
			// left: 0px;
			// bottom: 0px;
			// right: 25px;
			// padding: 0px 5px;
			text-overflow: ellipsis;
			outline: none;
			width: 100%;
			padding-right: 20px;
			box-sizing: border-box;
		}
	}

	.select-trigger-icon {
		position: absolute;
		right: 5px;
		top: 0px;
		transition: all 0.3s;
		text-indent: 0px;
		&.active {
			transform: rotate(180deg);
		}
	}
}
.xui-multiselect-box {
	width: 100%;
	background: #fff;
	box-sizing: border-box;
	z-index: 10;
	border: 1px solid rgb(209, 219, 229);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	.multiselect-toolbar {
		line-height: 20px;
		padding: 4px 0px;
		font-size: 0;
		background: #f8f8f8;
	}
	.left-btns {
		display: inline-block;
		width: 70%;
		font-size: 12px;
		vertical-align: middle;
		.check-all {
			position: relative;
			display: inline-block;
			vertical-align: middle;
			padding-left: 30px;
			cursor: pointer;
			&:before {
				content: "";
				position: absolute;
				left: 10px;
				top: 50%;
				margin-top: -6px;
				width: 12px;
				height: 12px;
				border: 1px solid $color-border;
				border-radius: 2px;
			}
			&.selected {
				&:before {
					border: 1px solid $color-info;
					background: $color-info;
				}
				&:after {
					content: "\E74E";
					font-family: "xuiiconfont" !important;
					font-style: normal;
					-webkit-font-smoothing: antialiased;
					position: absolute;
					left: 11px;
					top: 50%;
					margin-top: -4px;
					width: 12px;
					height: 12px;
					line-height: 12px;
					color: #fff;
				}
			}
		}
		.clear-all {
			display: inline-block;
			color: $color-subcolor;
			vertical-align: middle;
			margin-left: 10px;
			cursor: pointer;
			&:hover {
				color: darken($color-subcolor, 10%);
			}
		}
	}
	.right-btns {
		display: inline-block;
		width: 30%;
		font-size: 12px;
		text-align: right;
		vertical-align: middle;
		.finish {
			padding-right: 10px;
			cursor: pointer;
			color: #00a0e9;
		}
	}
	.multiselect-options {
		display: block;
		overflow-y: auto;
		font-size: 12px;
		margin: 0px;
		padding: 0px;
		.multiselect-option {
			position: relative;
			height: 30px;
			line-height: 30px;
			padding-left: 30px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			border-top: #f1f1f1 1px solid;
			cursor: pointer;
			&:hover {
				background-color: rgb(228, 232, 241);
			}
			&:before {
				content: "";
				position: absolute;
				left: 10px;
				top: 50%;
				margin-top: -6px;
				width: 12px;
				height: 12px;
				border: 1px solid $color-border;
				border-radius: 2px;
			}
			&.selected {
				&:before {
					border: 1px solid $color-info;
					background: $color-info;
				}
				&:after {
					content: "\E74E";
					font-family: "xuiiconfont" !important;
					font-style: normal;
					-webkit-font-smoothing: antialiased;
					position: absolute;
					left: 11px;
					top: 50%;
					margin-top: -4px;
					width: 12px;
					height: 12px;
					line-height: 12px;
					color: #fff;
				}
			}
		}
	}
}
</style>
