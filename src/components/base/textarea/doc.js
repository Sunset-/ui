import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "文本域",
	accendant: "亮亮",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			placeholder: "<i class='vt' >String</i>输入提示",
			disabled: "<i class='vt' >Boolean</i>是否禁用",
			clearable: "<i class='vt' >Boolean</i>是否可清空",
			rows: "<i class='vt' >Number</i>行数，默认3",
			autosize: "<i class='vt' >Boolean / Object</i>高度随内容自适应,{minRows:3,maxRows:10}",
			lengthTip: "<i class='vt' >Boolean</i>输入字数提示"
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
