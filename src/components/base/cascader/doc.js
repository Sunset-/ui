import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "级联选择框",
	isFormField: true,
	props: {
		options: {
			root: "<i class='vt' >String</i>枚举类型（需预装）",
			key: "<i class='vt' >Object</i>枚举类型（需预装）",
			data: "<i class='vt' >Object / Array</i>选项数据，支持对象 {value : text} 和数组 [{ text:text1 , value:value1 , group : group1 }....]",
			placeholder: "<i class='vt' >String</i>输入提示",
			clearable: "<i class='vt' >Boolean</i>可清空单选",
			spliter: "<i class='vt' >String</i>多选时，多值拼接分隔符，默认逗号",
			disabled: "<i class='vt' >Boolean</i>是否禁用",
			disabledOptions: "<i class='vt' >Function</i>禁选项条件函数"
		}
	},
	methods: {
		clear: {
			name: "清空",
			args: "无",
			result: "void"
		}
	},
	events: {},
	demos: [demo1]
};
