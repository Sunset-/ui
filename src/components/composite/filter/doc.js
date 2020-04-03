import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "搜索条件",
	accendant: "亮亮",
	desc: "聚合各表单组件，提供标准化搜索配置",
	props: {
		options: {
			fields: `<i class='vt' >Array[Object]</i>搜索项数组,<br/>
            [{<br/>
            label : <i class='vtl' >String</i>表单项label,<br/>
            name :<i class='vtl' >String</i> 搜索项标识,<br/>
            newline : <i class='vtl' >Boolean</i>另起一行,<br/>
            premise : <i class='vtl' >Function</i>前置条件函数,<br/>
			changeFilter : <i class='vt' >Boolean</i>组件值变更是否触发搜索<br/>
			enterSearchFilter : <i class='vt' >Boolean</i>input组件敲回车是否触发搜索<br/>
            表单组件的其他配置<br/>
            },...]`,
			lazy: "<i class='vt' >Boolean</i>初始是否触发查询,默认false",
			format: "<i class='vt' >Function</i>搜索条件格式化输出",
			searchButton: "<i class='vt' >Object</i>搜索按钮，配置见按钮"
		}
	},
	methods: {
		reset: {
			desc: "重置搜索条件",
			args: "搜索条件对象",
			result: "无"
		},
		getFilter: {
			desc: "获取当前搜索条件",
			args: "无",
			result: "搜索条件对象"
		}
	},
	events: {
		fitler: {
			desc: "触发搜索",
			args: "搜索条件filterModel"
		}
	},
	demos: [demo1]
};
