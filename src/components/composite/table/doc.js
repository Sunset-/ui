import demo1 from "./demo/demo1.vue";
import datapageDoc from "../datapage/doc";

module.exports = {
	title: "数据表格",
	accendant: "亮亮",
	desc: "提供分页数据表格组件，支持勾选，数据操作栏，通过声明实现获取数据，数据分页器，加载中，懒加载等功能",
	slot: {
		empty: "数据为空时，提示信息",
		subtable: "子表格,插槽作用域（data:子表格数据,parent:子表格父条目数据）"
	},
	props: {
		options: Object.assign(
			{
				columns: {
					title: "<i class='vt' >String</i>列名",
					name: "<i class='vt' >String</i>列标识，从记录中取值，支持多级取值，如'person.name'",
					align: "<i class='vt' >String</i>文字水平排列，left/center/right",
					headAlign: "<i class='vt' >String</i>表头文字水平排列，left/center/right",
					enum: "<i class='vt' >String</i>字典类型，需预装字典",
					format:
						"<i class='vt' >String / Function</i>格式化函数，内置DATETIEM,DATE / Function(value,record,column,parent,index)",
					style:
						"<i class='vt' >String / Function</i>单元格样式,支持String / Function(value,record,column,parent,translatedValue)",
					headStyle: "<i class='vt' >String / Object</i>表头样式",
					toolbar: "<i class='vt' >Object</i>设置此属性后，该内容变为操作栏，配置见操作栏配置",
					headToolbar: "<i class='vt' >Object</i>设置此属性后，表头添加操作栏，配置见操作栏配置",
					children: "<i class='vt' >Function</i>子表格数据获取回调函数Function(parent)"
				},
				checked: {
					key: "<i class='vt' >String</i>记录中的主键名，默认为id"
				},
				clickRecord: "<i class='vt' >Function</i>数据条目点击事件"
			},
			datapageDoc.props.options
		)
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
		},
		getCurrentLocalPageNumber: {
			desc:"获取datepage本地分页当前页数",
			args:"无",
			result:"number"
		}
	},
	events: {
		output: {
			desc: "数据输出",
			args: "list - 当前分页数据列表 , total - 数据总数"
		},
		checked: {
			desc: "数据输出",
			args: "checklist - 勾选数据列表"
		},
		"click-record": {
			desc: "数据条目点击事件",
			args: "record - 数据条目"
		}
	},
	demos: [demo1]
};
