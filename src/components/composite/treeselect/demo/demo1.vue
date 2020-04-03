<template>
	<div>
		<np-treeselect v-model="v" :options="options" :model="{a:123}"></np-treeselect>
		{{v}}
		<div style="height:800px"></div>
	</div>
</template>
<script>
export default {
	methods: {
		change(v) {
			alert(v);
		}
	},
	data() {
		return {
			v: "444",
			options: {
				multiple: false,
				enum: "Org",
				// disabled: true,
				autoExpand: true,
				nocheck(item) {
					return false;
				},
				template(item) {
					return (
						item &&
						item.parents
							.map(item => item.text)
							.concat([item.text])
							.join("-")
					);
				},
				view(v, m) {
					return m.a;
				}
				// format(item) {
				// 	return item;
				// }
				// treeOptions: {
				// 	autoExpand: false,
				// 	// check: "multiple",
				// 	setting: {
				// 		data: {
				// 			key: {
				// 				name: "value",
				// 				title: "value"
				// 			},
				// 			simpleData: {
				// 				enable: true,
				// 				idKey: "key",
				// 				pIdKey: "parent",
				// 				rootPId: null
				// 			}
				// 		},
				// 		check: {
				// 			radioType: "all",
				// 			chkboxType: { Y: "s", N: "s" }
				// 		}
				// 	}
				// },
				// treeNodes: (() => {
				// 	return Promise.resolve().then(() => {
				// 		var map = NetPosaXUI.Dictionary.getAllEnums(),
				// 			nodes = [];
				// 		Object.keys(map).forEach(type => {
				// 			nodes.push({
				// 				key: type,
				// 				value: type,
				// 				data: {
				// 					key: type,
				// 					value: type
				// 				}
				// 			});
				// 			map[type].forEach(item => {
				// 				item.parent = type;
				// 				item.data = {
				// 					key: item.key,
				// 					value: item.value
				// 				};
				// 				nodes.push(item);
				// 			});
				// 		});
				// 		return nodes;
				// 	});
				// })()
			}
		};
	}
};
</script>
