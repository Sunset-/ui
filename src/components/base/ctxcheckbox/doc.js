import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "单个复选框",
	isFormField: true,
	props: {
        "v-model": "组件值",
        "ctx": "单个数据的上下文"
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
