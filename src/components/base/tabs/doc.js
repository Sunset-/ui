import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "标签页",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			type: '{data:{value:"xx",text:"xx"}}'
		}
	},
	methods: {
		refresh: {
			desc: "清空",
			args: "无",
			result: "无"
		}
	},
	events: {
		selected: {
			desc: "选择页签",
			args: "无"
		}
	},
	demos: [demo1]
};
