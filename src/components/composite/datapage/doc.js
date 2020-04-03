import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "数据分页",
	accendant: "亮亮",
	desc:
		"提供抽象的分页数据组件，通过声明实现获取数据，数据分页器，加载中，懒加载等功能，slot中定义数据分页中每一项的样式",
	slot: {
		default: "分页内容模板,插槽作用域（list:当前分页数据,count:数据总数）",
		empty: "数据为空时，提示信息"
	},
	props: {
		options: {
			pageNumberStart: "<i class='vt' >Number [default:1]</i>服务器分页页码起始",
			pageSize: "<i class='vt' >Number [default:10]</i>服务器端分页大小",
			lazy: "<i class='vt' >Boolean [default:false]</i>是否懒加载",
			localPageSize: "<i class='vt' >Number</i>前端分页大小,前后端分页大小不同时设置此项",
			cache: "<i class='vt' >Boolean [default:false]</i>是否缓存数据（仅在分页器操作时使用缓存）",
			preload: "<i class='vt' >Number [default:0]</i>预加载提前页数",
			formatFilter: "<i class='vt' >Function</i>请求前参数格式化回调函数",
			datasource: "<i class='vt' >Function</i>数据源回调函数",
			format: {
				list: "<i class='vt' >String</i>数据返回中列表数据的命名空间，可用多级取值（data.list）",
				count: "<i class='vt' >String</i>数据返回中数据总量的命名空间，可用多级取值（data.count）",
				pageSize: "<i class='vt' >String</i>数据请求时服务端接收分页大小字段名",
				currentPage: "<i class='vt' >String</i>数据请求时服务端接收分页页码字段名"
			}
		}
	},
	methods: {
		search: {
			desc: "搜索加载数据",
			args: "filter-搜索条件对象, localFilter-本地过滤函数",
			result: "无"
		},
		refresh: {
			desc: "刷新",
			args: "pageNumber-页码(为空时刷新当前页)",
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
		},
		setOptions: {
			desc: "设置配置属性",
			args: "options-配置对象, isReload-是否重新加载数据",
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
