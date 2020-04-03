import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "日期区间组件",
	accendant: "鲜竞峰",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			type: "类型",
			startPlaceholder: "开始输入提示",
			defaultFitst:"当传入shortcuts，默认选中第一个，并返回初始值",
			endPlaceholder: '结束输入提示',
			format:'显示在输入框的格式',
			valueformat:'输出值格式 默认为Date对象 可选值为"timestamp、yyyy-MM-dd"',
			clearable: "是否可清空",
            searchCallBack: "回掉函数",
			searchButton:"查询按钮，参数与np-button一致，如果不传入该项则不现实查询按钮",
			shortcuts:"快捷方式数组 [ {label : 名称1 , value : 取值函数1},... ] 如果该值为空显示双日期组件"
		}
	},
	methods: {
	},
	events: {
	},
	demos: [demo1]
};
