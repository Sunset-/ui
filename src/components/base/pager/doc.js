import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "分页器",
	props: {
		total: "<i class='vt' >Number</i>数据总量",
		"page-number": "<i class='vt' >Number</i>当前页码，默认1",
		options: {
			pageSize: "<i class='vt' >Number</i>按钮文本",
			foldCount: "<i class='vt' >Number [default:7]</i>超过页数折叠",
			manner: "<i class='vt' >String</i>风格：simple / full / null",
			mini: "<i class='vt' >Boolean</i>是否微型分页"
		}
	},
	methods: {},
	events: {
		change: {
			desc: "页码变更事件",
			args: "pageNumber 当前页码"
		}
	},
	demos: [demo1]
};
