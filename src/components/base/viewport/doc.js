import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "视窗",
	isFormField: false,
	desc: "大批量数据时，仅渲染视窗范围内的dom元素，提高渲染性能",
	props: {
		options: {
			containerHeight: "<i class='vt' >Number/Function</i>容器的高度",
			recordHeight: "<i class='vt' >Number/Function</i>单个条目的高度",
			template: "<i class='vt' >Function</i>单个条目的渲染函数",
			empty: "<i class='vt' >String/Function</i>无数据时的渲染函数",
			operate: "<i class='vt' >Function</i>点击操作回调Function(record,ev)"
		}
	},
	methods: {
		refresh: {
			desc: "刷新",
			args: "无",
			result: "无"
		},
		setData: {
			desc: "设置全量数据",
			args: "records[Array]",
			result: "无"
		},
		appendData: {
			desc: "追加数据",
			args: "records[Array]",
			result: "无"
		},
		removeRecord: {
			desc: "删除条目",
			args: "record 或 filter[Function]",
			result: "无"
		},
		clear: {
			desc: "清空",
			args: "无",
			result: "无"
		}
	},
	events: {},
	demos: [demo1]
};
