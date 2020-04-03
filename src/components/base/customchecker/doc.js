import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "自定义单选复选选择器",
	accendant: "亮亮",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			disabled: "<i class='vt' >Boolean</i>是否禁用",
			multiple: "<i class='vt' >Boolean [default:false]</i>是否多选",
			template: "<i class='vt' >Function(item,isSelected)</i>色块模板函数",
			enum: "<i class='vt' >String</i>枚举字典类型",
			data: "<i class='vt' >Object/Array</i>枚举项，数组[{text : text1},{value : value1}]或对象{value1 : text1}"
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
