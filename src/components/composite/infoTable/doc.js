import demo1 from "./demo/demo1.vue"; 

module.exports = {
	title: "信息框表格",
	desc: "提供数据多列表格形式展示，支持数据自定义，列数自定义等",
	/*slot: {
		default: "分页内容模板,插槽作用域（list:当前分页数据,count:数据总数）"
	},*/
	props: {
		data: "<i class='vt' >Object</i>数据源",
		options: Object.assign(
			{
				items: {
					label: "<i class='vt' >String</i>列名",
					name: "<i class='vt' >String</i>属性名",
					enum: "<i class='vt' >String</i>字典枚举",
					format: "<i class='vt' >Function</i>格式化回调函数"
				},
				cols:  "<i class='vt' >Number</i>划分列数[1]",
				labelAlign:  "<i class='vt' >String(left,right,center)</i>label列文字对齐方式[left]",
				contentAlign:  "<i class='vt' >String(left,right,center)</i>内容文字对齐方式[left]",
				colHeight:  "<i class='vt' >Number</i>行高[38]",
				labelWidth:  "<i class='vt' >Number</i>label列文固定宽度(px)[100]",
				labelBgClolor:  "<i class='vt' >String</i>label列背景色['#fff']",
				contentBgClolor:  "<i class='vt' >String</i>内容列背景色['#fff']"
			}
		)
	},
	methods: {
		 
	},
	events: {
		 
	},
	demos: [demo1]
};
