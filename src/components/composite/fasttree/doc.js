import demo1 from "./demo/demo1.vue";
module.exports = {
	title: "高性能树",
	accendant: "亮亮",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			autoExpand: "<i class='vt' >Boolean</i>是否自动展开",
			check: "<i class='vt' >Boolean / String</i>选择类型 false / single / multi",
			setting: "<i class='vt' >Object</i>树配置，见ztree文档"
		},
		nodes: "节点数据"
	},
	methods: {
		init: {
			desc: "重新初始化",
			args: "无",
			result: "无"
		},
		refresh: {
			desc: "刷新树",
			args: "nodes新的节点数据",
			result: "无"
		},
		addNodes: {
			desc: "添加节点",
			args:
				"parentData 父节点, childs 子节点数组, clear 是否清空后添加, editing 是否开启编辑, isParent 是否父节点",
			result: "无"
		},
		updateNode: {
			desc: "更新节点数据",
			args: "node",
			result: "无"
		},
		removeNode: {
			desc: "删除节点",
			args: "node",
			result: "无"
		},
		reAsyncChildNodes: {
			desc: "强制刷新子节点",
			args: "parentNode父节点",
			result: "无"
		},
		refreshChecked: {
			desc: "设置勾选节点",
			args: "无",
			result: "无"
		}
	},
	events: {
		inited: {
			desc: "初始化完成",
			args: "无"
		},
		selected: {
			desc: "选择节点",
			args: "选择节点数据"
		},
		checked: {
			desc: "勾选节点",
			args: "勾选节点集合"
		}
	},
	demos: [demo1]
};