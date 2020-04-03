import demo1 from "./demo/test.vue";

module.exports = {
	title: "级联选择",
	accendant: "付胜",
	isFormField: true,
	desc: "提供级联下拉框选择功能",
	props: {
		options: {
			fieldMap: {
				key: "<i class='vtl' >String</i>",
				value: "<i class='vtl' >String</i>"
			},
			datasource: "<i class='vtl' >Function</i>数据来源<br/>",
			items: `<i class='vt' >Array[Object]</i>联动项<br/>
            [{<br/>
				name : <i class='vtl' >String</i>表单name<br/>,
				name : <i class='vtl' >String</i>表单label<br/>,
				datasource: <i class='vtl' >Function</i>数据来源<br/>
            }]`
		}
	},
	events: {
		change: {
			desc: "数据输出",
			args: "{key:value}"
		}
	},
	demos: [demo1]
};
