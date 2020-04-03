import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "单选按钮",
	accendant: "亮亮",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			manner: "<i class='vt' >String</i>风格，圆点(default)或按钮（button）",
			size: "<i class='vt' >String</i>尺寸（medium / small / mini）",
			disabled: "<i class='vt' >Boolean</i>是否禁用",
			enum: "<i class='vt' >String</i>枚举字典类型",
			data: "<i class='vt' >Object/Array</i>枚举项，数组[{text : text1},{value : value1}]或对象{value1 : text1}",
			default: "<i class='vt' >String</i>默认值",
			defaultFirst: "<i class='vt' >Boolean [default:false]</i>默认首个值"
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
