<template>
	<div class="np-tree" v-if='data'>
		<tree-checkbox :options="checkBoxOptions" v-model="checkAll" v-if="searchResult && searchResult.length > 0 && options.select && options.select.selectType === 'checkbox'" class="tree-checkBox"></tree-checkbox>
		<tree-nodelist ref="tree" :data='searchResult || data' :options="options" :selectValues="showCheckedNodes" :isSearchMode="isSearchMode" @initialed="initialed" @dbclickOnNode="dbclickOnNode" @clickOnNode='clickOnNode' @dbclickOnLeaf='dbclickOnLeaf' @clickOnLeaf='clickOnLeaf' @dragstartHandler="dragstartHandler" @checkNode="checkNode" @renderNode="renderNode" @focusId="focusId" />
	</div>
</template>
<script>
import utils from "./src/utils";
import Sunset from "../../../common/sunset";
import treeNodelist from "./src/tree-node-list.vue";
import treeMixin from "./src/tree-mixin";
import focusMixin from "./src/focus-mixin";
import selectBizMixin from "./src/selectbiz-mixin";
import treeCheckbox from "../checkbox";

let searchKey = "";
export default {
	name: "tree",
	mixins: [treeMixin, focusMixin, selectBizMixin],
	components: {
		treeNodelist,
		treeCheckbox
	},
	props: {
		isSelectOrg: { type: Boolean, default: true }
	},
	data: function() {
		return {
			checkAll: "",
			isSearchMode: false,
			showCheckedNodes: [],
			//initCache: [],
			searchResult: null,
			checkBoxOptions: {
				disabled: false,
				size: "small",
				data: {
					all: "全选"
				}
			}
		};
	},
	mounted: function() {
		console.log("树组件的配置项:", this.options);
		//初始化，加载根节点
		this.init();
		//初始化已选列表
		this.selectDevs = utils.extendSelectedData(this.selectOptions.selectValues);
	},
	watch: {
		checkAll(val) {
			this.checkAllFn(val);
		}
	},
	methods: {
		init: function() {
			if (this.data.length === 0) {
				//加载根组织
				this.options.async.load(null, res => {
					utils.formatData(res, this.options.render.format, null).forEach(item => {
						this.data.push(item);
					});
				});
			}
		},
		/**
		 * 对外接口，根据关键字搜索树数据结构，已做防抖处理
		 * @param val - 搜索关键字
		 * @param needSearch - val为空时，是否还需要搜索【特殊处理，主要是搜索接口里包含了其他查询条件】
		 */
		search: function(val, needSearch) {
			var key = (searchKey = typeof val === "string" ? val.trim() : "");
			this.isSearchMode = true;
			this.checkAll = "";
			this.selecetedAll = true;
			this.$nextTick(() => {
				this.selecetedAll = false;
			});
			utils.debounce(() => {
				if (!key && !needSearch) {
					this.isSearchMode = false;
					// 退出搜索模式
					this.searchResult = null;
					return;
				}
				//触发请求
				this.options.async.search(key, res => {
					//如果临界值上，即搜索结果还没有回来，此时搜索条件已经清空，不管后面是否新返回数据，均不在响应列表
					if (searchKey !== "" || needSearch)
						this.searchResult = utils.formatData(res, this.options.render.format, null);
				});
			});
		},
		checkAllFn(val) {
			if (this.selecetedAll) {
				this.selecetedAll = false;
				return;
			}
			this.selectAll = true;
			for (let i = 0, l = this.searchResult.length; i < l; i++) {
				this.searchResult[i].isSelected = !val ? true : false;
				this.checkNode(this.searchResult[i]);
			}
			this.notify();
			this.selectAll = false;
		},
		/**
		 * 对外接口，回显已经选择的节点
		 * @param arr - 待回显的节点数据数组
		 * @param delId - 树选组件，删除了某个已选节点的id【特殊处理】
		 */
		showSelNodes: function(arr, delId) {
			//扩展回显的数据
			var values = utils.extendSelectedData(arr);
			//初始化已选变量
			this.selectDevs = values;
			this.initCache = [].concat(values);
			setTimeout(() => {
				this.showCheckedNodes = utils.getNeedCheckedNodes(this.data, values);
			});
			//如果全部清除，则同步树上点位状态
			if (values.length === 0) {
				this.clearAllSelected(this.data);
				return;
			}
			//判断是否是树选单个删除
			if (!delId) return;
			//树选单个删除-初始化
			this.curOperaNode = { isDelItem: true, node: { id: delId } };
			//通知调用方获取数据
			this.notify();
		},
		/**
		 * 对外接口，根据id刷新某个节点，包括其本身
		 * @param node - 待更新的节点数据对象
		 * @param delId - 搜索模式下，删除某个节点的id【特殊处理】
		 */
		refreshNode: function(node, delId) {
			if (!node.id) {
				//如果待刷新的节点id为空，会出现两种情况，1是根节点，2是搜索模式下的删除
				if (this.isSearchMode) {
					//如果是搜索模式下，删除某个结果【业务分组】
					this.searchResult = this.searchResult.filter(function(item) {
						return item.id !== delId;
					});
				} else {
					//ToDo 根节点
				}
				return;
			}
			utils.dealOnRefreshNode(node, this.searchResult || this.data, item => {
				this.options.async.load(item, res => {
					//如果子节点为空，则标记当前节点为子节点
					if (res.length === 0) {
						delete item.isOpen;
						item.isLeaf = true;
						return;
					}
					if (!item.isOpen) this.$set(item, "isOpen", false);
					item.children = utils.formatData(res, this.options.render.format, item);
				});
			});
		},
		/**
		 * 对外接口，根据节点Id展开节点
		 * @param id - 待展开节点id
		 * @param isPlay - 如果是叶子节点是否播放
		 */
		expandGroupNode(id, isPlay, cbfn) {
			var data = this.searchResult || this.data,
				isPlay = isPlay ? isPlay : false;
			this.options.async.getAncestors({ id: id }, res => {
				if (Sunset.isArray(res)) {
					res.shift();
				} else {
					res = [];
				}
				res.push({ id: id });
				this.$refs.tree.openNode(res, isPlay);
			});
			// this.$refs.tree.openNode([{id:"001z48vu3WkC9W29"}],isPlay)
		},
		/**
		 * 对外接口，设置节点的focus状态
		 * @param idArr - 待设置的节点id数组或者id字符串
		 * @param isFocused - 设置是否高亮
		 */
		setFocus: function(idArr, isFocused) {
			this.showFocusNode(this.searchResult || this.data, idArr, isFocused);
		},
		setFocusFalse() {
			this.setAllFocusFalse(this.searchResult || this.data);
		},
		/**
		 * 节点展开时的事件回调
		 * 1. 根据展开节点的选中状态，初始化其子节点
		 * 2. 回显已选择的节点
		 * @param node - 当前展开的节点数据对象
		 */
		renderNode: function(node) {
			//根据当前组织节点的状态，展开时回显列表及节点是否全选的判断逻辑
			this.dealOnRenderChild(this.data, node, childNodes => {
				if (childNodes.length > 0) this.showCheckedNodes = this.showCheckedNodes.concat(childNodes);
			});
		},
		checkNode: function(node) {
			var isUpdateInitCache = false;
			if (this.selectOptions.selectType === "checkbox") {
				//根据是否勾选组织进行判断
				if (!this.isSelectOrg || this.isDevicePerTree) {
					//多选不带组织【仅选择叶子节点时】
					this.checkboxSelect(this.selectDevs, node);
					//通知调用方获取数据e
					if (!this.selectAll) {
						this.notify();
					}
					return;
				}
				//勾选带组织
				this.curOperaNode = { isDelItem: false, node: node };
				//多选带组织
				this.dealOrgSelect(
					node,
					this.data,
					!!this.searchResult,
					this.initCache || [],
					this.selectAll,
					status => {
						//如果是取消组织，并且之前已选列表不为空，则需要删除其下所有的已选点位
						if (!node.isLeaf && !status && this.initCache && this.initCache.length > 0)
							isUpdateInitCache = !status;
					}
				);
				//收集结果
				this.dealNotify(node, isUpdateInitCache);
			}
			//radio单选时输出逻辑
			if (this.selectOptions.selectType === "radio") {
				this.radioSelect(this.selectDevs, node);
				//通知调用方获取数据e
				this.notify();
			}
		},
		/**
		 * 收集结果对外输出
		 * @param node - 当前操作的节点对象
		 * @param isUpdateInitCache - 是否需要更新已选设备列表
		 */
		dealNotify: function(node, isUpdateInitCache) {
			if (!isUpdateInitCache) {
				//通知调用方获取数据e
				if (!this.selectAll) {
					this.notify();
				}
				return;
			}
			//如果是取消组织，并且之前已选列表不为空，则需要删除其下所有的已选点位，故先更新已选列表
			this.updateInitCache(node, this.initCache || [], () => {
				//通知调用方获取数据e
				if (!this.selectAll) {
					this.notify();
				}
			});
		},
		focusId(val) {
			this.focusNodes.push(val);
		},
		//对外通知调用方获取数据
		notify: function() {
			if (this.selectOptions.selectType === "checkbox" && this.isSelectOrg) {
				//多选带组织
				this.getSelectedDevs(
					this.data,
					this.curOperaNode,
					(result, resultex, delItemInfo, originSelectedNodes) => {
						if (this.curOperaNode && this.curOperaNode.isDelItem) {
							if (delItemInfo) {
								//更新组织，在树选组件单击删除某个设备时，如果对应的组织未展开，则直接更新selectDevs即可，不在收集整棵树
								utils.mapFn(delItemInfo, item => {
									this.updateSelectedOnDelItem(item, this.selectDevs);
								});
							}
							this.validateIsAll();
							this.$emit("check", this.selectOptions.resultMode === 1 ? this.selectDevs : resultex);
							return;
						}
						console.log("merge searchcache over.");
						this.showCheckedNodes = originSelectedNodes;
						this.selectDevs =
							this.initCache && this.initCache.length !== 0
								? this.getMergeResult(result, this.initCache)
								: result;
						this.validateIsAll();
						this.$emit("check", this.selectOptions.resultMode === 1 ? this.selectDevs : resultex);
						console.log("merge initcache over.");
					}
				);
				return;
			} else {
				//触发回显
				this.showCheckedNodes = this.selectDevs;
			}
			this.validateIsAll();
			this.$emit("check", this.selectDevs);
		},
		emitData(val) {
			if (val) {
				this.showCheckedNodes = this.searchResult;
			} else {
				this.showCheckedNodes = [];
			}
		},
		validateIsAll() {
			//search模式下校验是否全选
			if (!this.selectAll && !!this.searchResult) {
				if (this.selectDevs.length === this.searchResult.length) {
					this.checkAll = "all";
				} else {
					this.checkAll = "";
				}
				this.selecetedAll = true;
				this.$nextTick(() => {
					this.selecetedAll = false;
				});
			}
		}
	}
};
</script>
<style lang="less">
.node > a {
	font-size: 0;
}
.tree-checkBox .xui-checkbox-label {
	cursor: pointer;
}
</style>
