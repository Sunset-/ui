<template>
	<div>
		{{checkeds}}
		<np-stree ref="tree" :options="options" :nodes="treeNodes" @inited="inited" @selected="selected" @checked="checked"></np-stree>
	</div>
</template>
<script>
var uniqId = 0;

export default {
	methods: {
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
