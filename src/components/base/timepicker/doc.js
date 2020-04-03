import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "时间选择器",
	isFormField: true,
	desc: "时间选择器",
	slot: {
		default: "内容",
	},
	props: {
		"v-model": "组件值",
		options: {
			startplaceholder: "起始时间placeholder",
			endplaceholder: "结束时间placeholder",
			start: '开始时间 str',
			step: '间隔时间 str',
			end: '结束时间 str',
			ischeckbox: "是否显示checkbox boolean"
		}
	},
	methods: {},
	events: {},
	demos: [demo1]
};