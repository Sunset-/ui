import demo1 from "./demo/demo1.vue";

module.exports = {
    title: "输入框",
    isFormField : true,
	props: {
		"v-model": "组件值",
		options: {
			type: "<i class='vt' >String</i>类型 [ text , password ]",
			placeholder: "<i class='vt' >String</i>输入提示",
			disabled: "<i class='vt' >Boolean</i>是否禁用",
			clearable: "<i class='vt' >Boolean</i>是否可清空",
			prepend: "<i class='vt' >String/Object</i>前置字符串或select配置对象",
			append: "<i class='vt' >String/Object</i>后置字符串或select配置对象",
			prependSpliter: "<i class='vt' >String</i>前置拼接分隔符",
            appendSpliter: "<i class='vt' >String</i>后置拼接分隔符",
            appendClick : "<i class='vt' >Function</i>后置点击回调"
		}
	},
	methods: {
		clear: {
			desc: "清空",
			args: "无",
			result: "无"
		}
	},
	events: {
		input: {
			desc: "输入回调",
			args: "当前组件值"
		}
	},
	demos: [demo1]
};
