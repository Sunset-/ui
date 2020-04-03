import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "IP地址",
	accendant: "亮亮",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			disabled: "<i class='vt' >Boolean</i>是否禁用",
			default: "<i class='vt' >String</i>默认值"
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
		change: {
			desc: "值变更",
			args: "当前值value"
		}
	},
	demos: [demo1]
};
