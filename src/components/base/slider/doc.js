import demo1 from "./demo/demo1.vue";

module.exports = {
    title: "滑轨选择器",
    isFormField : true,
	props: {
		"v-model": "组件值",
		options: {
			type: "类型 [ text , password ]",
			placeholder: "输入提示",
			clearable: "是否可清空",
			prepend: "前置字符串或select配置对象",
			append: "后置字符串或select配置对象",
			prependSpliter: "前置拼接分隔符",
            appendSpliter: "后置拼接分隔符",
            appendClick : '后置点击回调'
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
