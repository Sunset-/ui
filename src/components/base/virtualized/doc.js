import demo1 from "./demo/demo.vue";

module.exports = {
	title: "窗口",
	isFormField: false,
	accendant: "付胜",
	desc: "大批量数据时，仅渲染视窗范围内的dom元素，提高渲染性能,支持slot插槽",
	props: {
		options: {
			containerHeight: "<i class='vt' >Number/Function</i>容器的高度",
			recordHeight: "<i class='vt' >Number/Function</i>单个条目的高度",
			records: "<i class='vt' >Array</i>总数据list",
		}
	},
	methods: {
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
			desc: "清空数据",
			args: "",
			result: "无"
        }
	},
	events: {},
	demos: [demo1]
};
