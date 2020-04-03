<template>
	<div :class="['xui-treeselect xui-treeselect-style',opened?'focus':'',safeOptions.className]">
		<div class="xui-treeselect-trigger" :class="{'disabled-status': options.disabled}" :title="checkedsLabel" @click="triggerOpen">
			<div class="xui-treeselect-results-wrap">
				<div class="xui-treeselect-results">
					<div v-if="isMultiple" v-for="(label,index) in checkedsLabel" :key="index">
						<span>{{label}}</span>
						<i class="close-css-icon" @click.stop="removeChecked(index)"></i>
					</div>
					<span v-if="!isMultiple">{{checkedsLabel}}</span>
				</div>
				<div class="xui-treeselect-searchinput">
					<input :placeholder="!value?safeOptions.placeholder:''" ref="search" @keydown.stop="keydown" v-model="searchKeyword" @input="filterNodes" :readonly="!filterable">
				</div>
			</div>
			<i class="xui-treeselect-trigger-icon"></i>
			<i v-if="clearable&&checkedNodes" class="xui-treeselect-trigger-clear close-css-icon" @click.stop="clear"></i>
		</div>
		<div ref="dropdown" v-if="inited" v-show="opened" class="xui-treeselect-tree" :style="dropdownStyle">
			<treeselect-stree ref="tree" :options="treeOptions" @check="checkedHandle" ></treeselect-stree>
		</div>
	</div>
</template>
<script>
import Sunset from "../../../common/sunset";
import Utils from "../../Helper";
import TreeselectStree from "../../base/tree";

export default {
	components: {
		TreeselectStree
	},
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		options: {},
		value: {},
		model: {}
	},
	data() {
		return {
			opened: false,
			inited: false,
			checkedNodes: "",
			searchKeyword: "",
			dropdownStyle: {},
			treeOptionsData:{
				isEnableDragger: false,
				style:{},
				 render: {
					autoCollapse: true,
					isExpandOnClickNode: true,
					isTreeAsyncLoad: true,
					asyncNodesNum: 1000,
					asyncTimeSlot: 50
				},
				select: {
					selectValues: ["001z48vu3WkC9W1y"],
					resultMode: 1,
					//selectType不为空时，哪些节点需要展示选择框，自定义逻辑
					showSelect: (node) => {
						return true/*node.isLeaf*/;
					}
				},
			}
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		idPlace() {
			return Sunset.getAttribute(this.treeOptions.setting, "data.simpleData.idKey", "id");
		},
		pIdPlace() {
			return Sunset.getAttribute(this.treeOptions.setting, "data.simpleData.pIdKey", "pId");
		},
		isMultiple() {
			return this.safeOptions.multiple;
		},
		filterable() {
			return !!this.safeOptions.filter;
		},
		clearable() {
			return this.safeOptions.clearable;
		},
		isEnumTree() {
			return !!this.safeOptions.enum;
		},
		selectType() {
			return this.safeOptions.treeOptions.selectType || 'checkbox';
		},
		treeOptions() {
			this.treeOptionsData.style.icon = this.safeOptions.treeOptions.icon;//节点icon
			this.treeOptionsData.render.format = this.safeOptions.treeOptions.format;//数据格式化
			this.treeOptionsData.select.selectType = this.selectType;//复选框/单选框
			debugger
			// this.treeOptionsData.select.selectValues = Sunset.isObject(this.value) ? this.treeOptionsData.select.selectValues.push(this.value.id) : this.treeOptionsData.select.selectValues.concat(this.value.split(","));//复选框/单选框
			return Object.assign(this.treeOptionsData, this.safeOptions.treeOptions)
		},
		treeNodes() {
			var enumType = this.safeOptions.enum,
				treeNodes = this.safeOptions.treeNodes;
			if (enumType) {
				return Utils.generateTreeItems(enumType).then(items => {
					return items.map(item => {
						return {
							value: item.value,
							text: item.text,
							type: item.type,
							parent: item.parent,
							nocheck: this.nocheck ? this.nocheck(item) : false,
							icon: Sunset.isFunction(this.icon) ? this.icon(item) : this.icon,
							data: item
						};
					});
				});
			} else if (treeNodes) {
				return treeNodes;
			} else {
				return [];
			}
		},
		checkedsLabel() {
			var checkedNodes = this.checkedNodes;
			if (checkedNodes) {
				if (Sunset.isFunction(this.template)) {
					return this.template(checkedNodes, this.model);
				} else {
					if (this.isEnumTree) {
						return Sunset.isArray(checkedNodes) ? checkedNodes.map(item => item.text) : checkedNodes.text;
					} else {
						var namePlace = this.treeOptions.setting.data.key.name;
						return Sunset.isArray(checkedNodes)
							? checkedNodes.map(item => item[namePlace])
							: checkedNodes[namePlace];
					}
				}
			} else if (Sunset.isFunction(this.options.view)) {
				return this.options.view(this.value, this.model, this.options);
			} else {
				return this.value;
			}
		},
		format() {
			return Sunset.isFunction(this.safeOptions.format)
				? this.safeOptions.format
				: this.isEnumTree
					? function(item) {
							return item.value;
					  }
					: false;
		},
		filter() {
			return Sunset.isFunction(this.safeOptions.filter)
				? this.safeOptions.filter
				: this.isEnumTree
					? function(item, v) {
							return (
								item.text.indexOf(v) >= 0 ||
								item.value.indexOf(v) >= 0 ||
								(item.keywords && item.keywords.indexOf(v) >= 0)
							);
					  }
					: false;
		},
		template() {
			return this.safeOptions.template;
		},
		icon() {
			return this.safeOptions.icon;
		},
		autoExpand() {
			return this.safeOptions.autoExpand;
		},
		nocheck() {
			return Sunset.isFunction(this.safeOptions.nocheck) ? this.safeOptions.nocheck : false;
		},
		spliter() {
			return this.safeOptions.spliter || ",";
		},
		baseDropdownStyle() {
			var style = {},
				dropdownStyle = this.safeOptions.dropdownStyle;
			if (Sunset.isObject(dropdownStyle)) {
				Object.assign(style, dropdownStyle);
			} else if (Sunset.isString(dropdownStyle)) {
				dropdownStyle.split(";").forEach(s => {
					var ss = s.split(":");
					style[ss[0]] = ss[1];
				});
			}
			return style;
		}
	},
	methods: {
		triggerOpen(ev) {
			if (this.options.disabled) {
				return;
			}
			this.inited = true;
			if (!this.opened) {
				this.$nextTick(() => {
					this.calculateDropdownStyle();
					this.opened = true;
					var func = eev => {
						if ($(eev.target).closest($(this.$el)).length == 0) {
							this.opened = false;
							document.removeEventListener("mousedown", func);
						}
					};
					document.addEventListener("mousedown", func);
				});
			} else {
				if ($(ev.target).closest($(this.$refs.search)).length == 0) {
					this.opened = false;
				}
			}
		},
		removeChecked(index) {
			var item = this.checkedNodes[index];
			this.checkedNodes.splice(index, 1);
			this.$refs.tree.checkNode(item, false);
			this.calculateValue(this.checkedNodes);
		},
		calculateDropdownStyle() {
			var dropdownHeight = $(this.$refs.dropdown).height();
			var bottomPadding = $("body").height() - $(this.$el).offset().top - $(this.$el).height();
			var baseDropdownStyle = this.baseDropdownStyle;
			if (bottomPadding > dropdownHeight + 10) {
				baseDropdownStyle.top = "105%";
				baseDropdownStyle.bottom = "auto";
			} else {
				baseDropdownStyle.top = "auto";
				baseDropdownStyle.bottom = "105%";
			}
			this.dropdownStyle = baseDropdownStyle;
		},
		checkedHandle(nodes) {
			this.calculateValue(nodes);
		},
		selectedHandle(node) {
			if (this.safeOptions.enum && !this.isMultiple) {
				node.parents = node.parents || this.$refs.tree.getParentNodes(node);
				this.calculateValue(node);
			}
		},
		calculateValue(nodes) {
			// this.checkedNodes = nodes;
			// var value = nodes;
			// if (this.format) {
			// 	value = Sunset.isArray(nodes)
			// 		? nodes.map(node => this.format(node)).join(this.spliter)
			// 		: this.format(nodes);
			// }
			var value;
			if(this.selectType === 'checkbox') {
				for(let i = 0, l = nodes.length; i < l; i++ ) {
					value.push({id:nodes[i].id, name:nodes[i].name})
				}
			} else {
				value = {id:nodes[0].id, name:nodes[0].name}
			}
			this.$emit("input", value);
		},
		filterNodes() {
			var v = this.searchKeyword.trim();
			if (!this.filter) {
				return;
			}
			var nodes = this.$refs.tree.getAllNodes();
			var nodesMap = this.$refs.tree.getAllNodesMap();
			if (!nodes) {
				return;
			}
			if (!v) {
				this.$refs.tree.showNodes(true);
				return;
			}
			var idPlace = this.idPlace;
			var pIdPlace = this.pIdPlace;
			var showNodesMap = {};
			var filterNodesMap = {};
			var filterNodes = nodes.filter(item => {
				if (this.filter(item, v)) {
					showNodesMap[item[idPlace]] = filterNodesMap[item[idPlace]] = item;
					return true;
				}
			});
			var baseNodes = filterNodes;
			var addNodes;
			//寻找父节点
			while (true) {
				addNodes = [];
				for (var i = 0, n; (n = baseNodes[i++]); ) {
					if (!showNodesMap[n[pIdPlace]] && nodesMap[n[pIdPlace]]) {
						var p = nodesMap[n[pIdPlace]];
						addNodes.push(p);
						showNodesMap[p[idPlace]] = p;
					}
				}
				if (addNodes.length == 0) {
					break;
				} else {
					baseNodes = addNodes;
				}
			}
			//寻找子节点
			var findNew = false;
			while (true) {
				findNew = false;
				for (var i = 0, n; (n = nodes[i++]); ) {
					if (!filterNodesMap[n[idPlace]] && filterNodesMap[n[pIdPlace]]) {
						showNodesMap[n[idPlace]] = filterNodesMap[n[idPlace]] = n;
						findNew = true;
					}
				}
				if (!findNew) {
					break;
				}
			}
			this.$refs.tree.showNodes(showNodesMap);
		},
		keydown(ev) {
			if (ev.keyCode == 8) {
				if (ev.target.value == "" && this.isMultiple && this.checkedNodes.length) {
					this.removeChecked(this.checkedNodes.length - 1);
				}
			}
		},
		clear() {
			this.$refs.tree && this.$refs.tree.refreshChecked();
			this.$refs.tree && this.$refs.tree.cancelSelectedNode();
			this.checkedNodes = "";
			this.$emit("input", "");
		}
	},
	watch: {
		value(v) {
			debugger
			// if (v === "" || v === null || v === void 0) {
			// 	this.clear();
			// }
		}
	}
};
</script>
<style lang="scss">
.xui-treeselect {
	$borderColor: #bfcbd9;
	$borderActiveColor: #8391a5;

	.close-css-icon {
		display: inline-block;
		vertical-align: middle;
		position: relative;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		cursor: pointer;
		&:before,
		&:after {
			content: "";
			position: absolute;
			background: #aaa;
			display: inline-block;
			top: 10%;
			left: 45%;
		}
		&:before {
			width: 1px;
			height: 10px;
			-webkit-transform: rotate(45deg);
			-moz-transform: rotate(45deg);
			-o-transform: rotate(45deg);
			-ms-transform: rotate(45deg);
			transform: rotate(45deg);
		}
		&:after {
			width: 1px;
			height: 10px;
			-webkit-transform: rotate(-45deg);
			-moz-transform: rotate(-45deg);
			-o-transform: rotate(-45deg);
			-ms-transform: rotate(-45deg);
			transform: rotate(-45deg);
		}
	}

	position: relative;
	display: inline-block;
	width: 100%;
	box-sizing: border-box;
	border: 1px solid $borderColor;
	border-radius: 3px;
	transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
	&:hover {
		border-color: $borderActiveColor;
		.xui-treeselect-trigger {
			.xui-treeselect-trigger-clear {
				display: block;
			}
		}
	}
	&.focus {
		outline: 0;
		border-color: #20a0ff;
		.xui-treeselect-trigger-icon {
			-webkit-transform: rotate(180deg);
			-moz-transform: rotate(180deg);
			-o-transform: rotate(180deg);
			-ms-transform: rotate(180deg);
			transform: rotate(180deg);
		}
	}
	.xui-treeselect-trigger {
		position: relative;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		padding-left: 5px;
		padding-right: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
		font-size: 12px;
		height: 36px;
		line-height: 36px;
		&.disabled-status {
			background-color: #eee;
			cursor: not-allowed;
			.xui-treeselect-searchinput > input {
				background-color: #eee !important;
				cursor: not-allowed;
			}
		}
		.xui-treeselect-results-wrap {
			width: 100%;
			height: 100%;
			display: inline-table;
			font-size: 12px;
			.xui-treeselect-results {
				display: table-cell;
				& > .placeholder {
					color: #bbb;
				}
				& > div {
					display: inline-block;
					border: 1px solid #ccc;
					padding: 4px 5px;
					line-height: 14px;
					margin-right: 5px;
					background-color: rgba(32, 160, 255, 0.1);
					border-color: rgba(32, 160, 255, 0.2);
					color: #20a0ff;
					border-radius: 3px;
					cursor: default;
					& > span {
						font-size: 13px;
						display: inline-block;
						vertical-align: middle;
					}
					& > i {
						&:hover {
							&:before {
								background: #444;
							}
							&:after {
								background: #444;
							}
						}
					}
				}
			}
			.xui-treeselect-searchinput {
				display: table-cell;
				width: 100%;
				& > input {
					font-size: 12px;
					width: 100%;
					height: 100%;
					display: table-cell;
					outline: 0px;
					border: none;
				}
			}
		}
		.xui-treeselect-trigger-icon {
			position: absolute;
			top: 50%;
			margin-top: -5px;
			right: 10px;
			width: 12px;
			height: 12px;
			transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
			&:after {
				position: absolute;
				top: 4px;
				left: 0px;
				content: "";
				width: 0px;
				height: 0px;
				border-style: solid;
				border-color: $borderColor transparent transparent transparent;
				border-width: 6px;
			}
		}
		.xui-treeselect-trigger-clear {
			display: none;
			position: absolute;
			top: 11px;
			right: 8px;
			width: 16px;
			height: 16px;
			background: $borderColor;
			&:before,
			&:after {
				top: 20%;
				background: #fff;
			}
			&:before {
				width: 2px;
				height: 10px;
			}
			&:after {
				width: 2px;
				height: 10px;
			}
			&:hover {
				background: $borderActiveColor;
			}
		}
	}
	.xui-treeselect-tree {
		position: absolute;
		top: 105%;
		width: 100%;
		height: 200px;
		z-index: 999;
		box-sizing: border-box;
		border: 1px solid #dedede;
		background: #fff;
		overflow: auto;
	}
}
</style>

