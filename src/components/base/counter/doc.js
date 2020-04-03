import demo1 from "./demo/demo.vue";

module.exports = {
    title: "计数器",
    accendant: "付胜",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			min: "最小值",
			max: "最大值",
			disabled: "是否禁用",
			step: "递进值",
		}
	},
	methods: {},
	events: {
		change: {
			desc: "值变更",
			args: "当前值value"
		}
	},
	demos: [demo1]
};
