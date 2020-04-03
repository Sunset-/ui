<template>
	<div>
		{{checkeds}}
		<np-button @click="setData" color="primary">设置静态数据</np-button>
		<np-fasttree ref="tree" class="fasttree-demo" :options="options" @click-node="selected" style="height:200px;">
			<template slot-scope="props">
				<div class="demo-node" style="height:30px;"><i class="xui-icon xui-icon-tasklist_fill"></i><span>{{props.name}}</span></div>
			</template>
		</np-fasttree>
		<!-- <np-stree ref="tree" :options="options" :nodes="treeNodes" @inited="inited" @selected="selected" @checked="checked"></np-stree> -->
	</div>
</template>
<script>
var uniqId = 0;
export default {
	methods: {
		setData() {
			this.$refs.tree.setNodes(this.loadData());
		},
		loadData() {
			var nodes = [];
			for (var i = 1; i <= 1; i++) {
				nodes.push({
					id: `${i}`,
					parentId: "0",
					name: `node_${i}`
				});
				for (var j = 1; j <= 20000; j++) {
					nodes.push({
						id: `${i}_${j}`,
						parentId: `${i}`,
						name: `node_${i}_${j}`
					});
					for (var k = 1; k <= 300; k++) {
						nodes.push({
							id: `${i}_${j}_${k}`,
							parentId: `${i}_${j}`,
							name: `node_${i}_${j}_${k}`,
							isParent: false
						});
					}
				}
			}
			return nodes;
		},
		inited() {
			this.$refs.tree.refreshChecked("1,3,5,6,8,15,20");
		},
		selected(node, parentNode) {
			this.selectedNode = node;
			this.selectedParentNode = parentNode;
		},
		checked(checkeds) {
			this.checkeds = checkeds;
		}
	},
	data() {
		return {
			checkeds: null,
			options: {
				rootId: "0",
				key: {
					id: "id",
					parentId: "parentId",
					name: "name",
					title: "name"
				},
				check: {
					type: "multiple"
				},
				focus : {
					enable : true,
					focusOn : "click"
				},
				doubleClickInterval : 0,
				// icon(node){
				// 	return '<i class="xui-icon xui-icon-tasklist_fill"></i>';
				// },
				nodeHeight: 30,
				template(node) {
					return `<div class="demo-node" style="height:30px;"><i class="xui-icon xui-icon-tasklist_fill"></i><span>${
						node.name
					}</span></div>`;
				},
				callbacks: {
					onClickNode(node) {
						//alert(node.name);
					}
				},
				isParent(node){
					return true;
				},
				datasource: parentNode => {
					if (!parentNode) {
						return [
							{
								id: `1`,
								parentId: "0",
								name: `node_1`
							}
						];
					} else {
						var nodes = [];
						for (var j = 1; j <= 20000; j++) {
							nodes.push({
								id: `${parentNode.id}_${j}`,
								parentId: parentNode.id,
								name: `node_${parentNode.id}_${j}`
							});
						}
						return nodes;
					}
				}
			},
			options1: {
				autoExpand: false,
				check: "multi",
				setting: {
					data: {
						key: {
							name: "value",
							title: "value"
						},
						simpleData: {
							enable: true,
							idKey: "key",
							pIdKey: "parent",
							rootPId: null
						}
					},
					check: {
						radioType: "all"
					}
				}
			},
			treeNodes: (() => {
				return Promise.resolve().then(() => {
					var map = NetPosaXUI.Dictionary.getAllEnums(),
						nodes = [];
					Object.keys(map).forEach(type => {
						nodes.push({
							key: type,
							value: type,
							data: {
								key: type,
								value: type
							}
						});
						map[type].forEach(item => {
							item.parent = type;
							item.data = {
								key: item.key,
								value: item.value
							};
							nodes.push(item);
						});
					});
					return nodes;
				});
			})()
		};
	}
};
</script>
<style lang="scss">
.fasttree-demo {
	width: 400px;
	height: 800px;
	border: 1px solid #ececec;
	.demo-node {
		font-size: 14px;
		cursor: pointer;
		.xui-icon {
			font-size: 20px;
		}
		& > * {
			display: inline-block;
			vertical-align: middle;
		}
	}
}
</style>
