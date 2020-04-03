// treeMixin
import utils from "./utils";
module.exports = {
	props: {
		data: {type: Array, default: function () {return [];}},
		options: {type: Object, default: {}}
	},
	computed: {
		renderOptions () {
			//格式化默认值
			return {
				autoCollapse: (!utils.isUndefined(this.options.render) && !utils.isUndefined(this.options.render.autoCollapse)) ? this.options.render.autoCollapse : true,
				isExpandOnClickNode: (!utils.isUndefined(this.options.render) && !utils.isUndefined(this.options.render.isExpandOnClickNode)) ? this.options.render.isExpandOnClickNode : false,
				isTreeAsyncLoad: (!utils.isUndefined(this.options.render) && !utils.isUndefined(this.options.render.isTreeAsyncLoad)) ? this.options.render.isTreeAsyncLoad : true,
				asyncNodesNum: (!utils.isUndefined(this.options.render) && !utils.isUndefined(this.options.render.asyncNodesNum)) ? this.options.render.asyncNodesNum : 300,
				asyncTimeSlot: (!utils.isUndefined(this.options.render) && !utils.isUndefined(this.options.render.asyncTimeSlot)) ? this.options.render.asyncTimeSlot : 50
			};
		},
		focusOptions() {
			return {
				focusClass: (!utils.isUndefined(this.options.focus) && !utils.isUndefined(this.options.focus.focusClass)) ? this.options.focus.focusClass : "",
				focusOn: (!utils.isUndefined(this.options.focus) && !utils.isUndefined(this.options.focus.focusOn)) ? this.options.focus.focusOn : "click",
				allowFocus: (!utils.isUndefined(this.options.focus) && !utils.isUndefined(this.options.focus.allowFocus)) ? this.options.focus.allowFocus : (() => {
					return false;
				}),
				allowMutiFocus: (!utils.isUndefined(this.options.focus) && !utils.isUndefined(this.options.focus.allowMutiFocus)) ? this.options.focus.allowMutiFocus : (() => {
					return false;
				})
			};
		},
		selectOptions() {
			return {
				selectType: (!utils.isUndefined(this.options.select) && !utils.isUndefined(this.options.select.selectType)) ? this.options.select.selectType : "",
				selectValues: (!utils.isUndefined(this.options.select) && !utils.isUndefined(this.options.select.selectValues)) ? this.options.select.selectValues : [],
				resultMode: (!utils.isUndefined(this.options.select) && !utils.isUndefined(this.options.select.resultMode)) ? this.options.select.resultMode : 1,
				//selectType不为空时，哪些节点需要展示选择框，自定义逻辑
				showSelect: (!utils.isUndefined(this.options.select) && !utils.isUndefined(this.options.select.showSelect)) ? this.options.select.showSelect : (() => {
					return true;
				})
			};
		},
		styleIconOptions(){
			return {
				"i-group": (!utils.isUndefined(this.options.style) && !utils.isUndefined(this.options.style.icon) && !utils.isUndefined(this.options.style.icon["i-group"])) ? this.options.style.icon["i-group"] : "",
				"i-leaf": (!utils.isUndefined(this.options.style) && !utils.isUndefined(this.options.style.icon) && !utils.isUndefined(this.options.style.icon["i-leaf"])) ? this.options.style.icon["i-leaf"] : "",
				"i-focus": (!utils.isUndefined(this.options.style) && !utils.isUndefined(this.options.style.icon) && !utils.isUndefined(this.options.style.icon["i-focus"])) ? this.options.style.icon["i-focus"] : "",
				"i-root": (!utils.isUndefined(this.options.style) && !utils.isUndefined(this.options.style.icon) && !utils.isUndefined(this.options.style.icon["i-root"])) ? this.options.style.icon["i-root"] : "",
			};
		},
		isDevicePerTree() {
			return this.options.isDevicePerTree || false;
		}
	},
	methods: {
		initialed: function (rootNode) {
			this.$emit("initialed", rootNode);
		},
		clickOnNode: function (node) {
			this.$emit("clickOnNode", node);
		},
		dbclickOnNode: function (node) {
			this.$emit("dbclickOnNode", node);
		},
		clickOnLeaf: function (node) {
			this.$emit("clickOnLeaf", node);
		},
		dbclickOnLeaf: function (node) {
			this.$emit("dbclickOnLeaf", node);
		},
		dragstartHandler: function (node) {
			this.$emit("dragstartHandler", node);
		}
	}
};
