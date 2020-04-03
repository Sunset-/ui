/**
 * 树节点被选中部分的操作逻辑
 * Created by Zhangyu on 2017/9/12.
 */
/**
 * 遍历树数据，寻找队形的节点数据
 * @param items - 递归的设备节点数据
 * @param fn - 寻找判断的回调函数
 */
function iterateTree(items, fn) {
	iterateFn(items, function (item) {
		if(fn(item)) {
			iterateTree(item.children || [], fn);
		}
	});
}
var iterateFn = function(arr, fun, cancel){
	if (isEmptyFn(arr))
		return;
	var len = arr.length;
	for (var i=0; i<len; i+=1) {
		var res = fun(arr[i], i);
		if(!res && cancel) break;
	}
};

var isEmptyFn = function (str){
	return (str === undefined || str === null || str === "");
}
module.exports = {
	data: function () {
		return {
			focusNodes:[]
		};
	},
	methods: {
		/**
		 * 选中当前的节点
		 * @param node - 待选中的节点
		 * @param flag - 特殊情况下的逻辑，不需要经过allowFocus过滤，如反向定位，主动显示
		 */
		focusOnNode: function (node, flag) {
			if (!this.focusOptions.allowFocus(node) && !flag) {
				return;
			}
			//根据不同的选中逻辑进行处理
			if (this.focusOptions.allowMutiFocus()) {
				node.isFocused = true;
				this.focusNodes.push(node);
			} else {
				var prevFocusedNode = this.focusedNode;
				if (prevFocusedNode) prevFocusedNode.isFocused = false;
				this.focusedNode = node;
				node.isFocused = true;
			}
		},
		/**
		 * 根据id取消焦点缓存
		 * @param id - 待取消的节点缓存id
		 */
		updateFocusedCache: function(id) {
			//根据不同的选中逻辑进行处理
			if (this.focusOptions.allowMutiFocus()) {
				this.focusNodes = this.focusNodes.filter((item) => {
					return item.id !== id;
				});
			} else {
				this.focusedNode = undefined;
			}
		},
		/**
		 * 回显需要选中的节点
		 * @param treeData - 树结构数据对象
		 * @param idArr - 当前需要处理的数据的id列表
		 * @param isFocused - 是否高亮对应id的节点
		 */
		showFocusNode: function (treeData, idArr, isFocused) {
			//遍历树结构数据
			iterateTree(treeData, item => {
				if (idArr.indexOf(item.id) >= 0) {
					if (isFocused) {
						//设置高亮
						this.focusOnNode(item, true);
					} else {
						//取消高亮
						item.isFocused = false;
						//清空缓存
						this.updateFocusedCache(item.id);
					}
					return false;
				}
				return true;
			});
		},
		/**
		 * 扩展点击节点，是否在单击时选中节点
		 * @param node - 待判断的节点数据对象
		 */
		clickOnNode: function (node) {
			//判断是否需要选中状态
			if (this.focusOptions.focusOn === "click") {
				this.focusOnNode(node);
			}
			this.$emit('clickOnNode', node);
		},
		/**
		 * 扩展点击节点，是否在双击时选中节点
		 * @param node - 待判断的节点数据对象
		 */
		dbclickOnNode: function (node) {
			//判断是否需要选中状态
			if (this.focusOptions.focusOn === "dbclick") {
				this.focusOnNode(node);
			}
			this.$emit("dbclickOnNode", node);
		},
		setAllFocusFalse(data) {
			var focusIds =[];
			for(let i = 0, l =this.focusNodes.length; i < l ; i++) {
				focusIds.push(this.focusNodes[i].id);
			}
			this.showFocusNode(data, focusIds, false);
		}
		
	}
};