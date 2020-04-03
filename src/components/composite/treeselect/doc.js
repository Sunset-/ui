import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "下拉树选择",
	accendant: "亮亮",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			multiple: "<i class='vt' >Boolean</i>是否可多选",
			autoExpand: "<i class='vt' >Boolean</i>是否初次自动展开所有树节点",
			clearable: "<i class='vt' >Boolean</i>是否可清空",
			enum: "<i class='vt' >String</i>字典类型（需预装字典，字典项中parent为上级value）",
			placeholder: "<i class='vt' >String</i>输入提示",
			spliter: "<i class='vt' >String</i>值分隔符，默认','",
			filter: "<i class='vt' >Function</i>过滤函数(实现中...)",
			treeOptions: "<i class='vt' >Object</i>自定义树配置，见stree组件",
			treeNodes: "<i class='vt' >Array / Promise</i>自定义树节点，见stree组件"
		}
	},
	methods: {
		clear: {
			desc: "清空",
			args: "无",
			result: "无"
		}
	},
	events: {
		input: {
			desc: "输入回调",
			args: "当前组件值"
		}
	},
	demos: [demo1]
};
