import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "瀑布流",
	isFormField: false,
	slot: {
		default: "内容模板,插槽作用域（item:单条数据,visible:条目是否在视窗内,index:数据索引）"
	},
	props: {
		options: {
			preloadHeight: "<i class='vt' >Number</i>预加载底部像素高度",
			lazy: `<i class='vt' >Boolean</i>是否懒加载`,
			format: {
				list: "<i class='vt' >String</i>数据返回中列表数据的命名空间<br/>可用多级取值（'data.list'）",
				count: "<i class='vt' >String</i>数据返回中数据总量的命名空间<br/>可用多级取值（'data.count'）"
			},
			datasource: "<i class='vt' >Function</i>数据源回调<br/>参数为 ( 搜索条件filter , 全数据列表list ) ",
			release: `<i class='vt' >Boolean</i>是否释放资源`,
			windowMargin:
				"<i class='vt' >Number</i>视窗外边距像素高度<br/>(超出视窗外边距visible为false，用于释放资源)",
			debug: "<i class='vt' >Boolean</i>性能调优开关 ",
			throttleTime: "<i class='vt' >Number</i>性能调优：节流时间，默认500ms ",
			debounceTime: "<i class='vt' >Number</i>性能调优：防抖时间，默认100ms ",
			mode:"<i class='vt' >String</i>展示模式：TABLE或者WATERFALL"
		}
	},
	methods: {
		search: {
			desc: "搜索加载数据",
			args: "filter-搜索条件对象",
			result: "无"
		},
		clear: {
			desc: "清空",
			args: "无",
			result: "无"
		},
		setData: {
			desc: "设置数据",
			args: "data (结构同datasource返回)",
			result: "无"
		}
	},
	events: {
		output: {
			desc: "数据输出",
			args: "list - 当前分页数据列表 , total - 数据总数"
		}
	},
	demos: [demo1]
};
