import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "表单",
	accendant: "亮亮",
	desc: "聚合各表单组件，提供标准化表单配置",
	props: {
		view : "<i class='vt' >Boolean [default:false]</i>是否为视图模式",
		options: {
			cols: "<i class='vt' >Number</i>表单列布局，X=[1-24]，表示表单项X列布局",
			fields: `<i class='vt' >Array[Object]</i>搜索项数组,<br/>
            [{<br/>
                label : <i class='vtl' >String</i>表单项label,<br/>
                name : <i class='vtl' >String</i>搜索项标识,<br/>
                widget : <i class='vtl' >String</i>表单组件类型,<br/>
                newline : <i class='vtl' >Boolean</i>另起一行,<br/>
                monopolize : <i class='vtl' >Boolean</i>独占一行,<br/>
                premise : <i class='vtl' >Function</i>前置条件函数,<br/>
                valueFormat : <i class='vtl' >Number,String,Function</i>值格式化,<br/>
                validate : <i class='vtl' >Object</i>校验规则,<br/>
                view : <i class='vtl' >Function</i>视图模式格式化函数,<br/>
                表单组件的其他配置<br/>
            },...]`,
			cast: "<i class='vt' >Function</i>表单对象格式化输入",
			format: "<i class='vt' >Function</i>表单对象格式化输出",
			submit: "<i class='vt' >Function</i>提交回调",
			toolbar: "<i class='vt' >Object</i>表单底部操作栏",
			validateTip: "<i class='vt' >Boolean [default:true]</i>表单校验提示，false时关闭",
			blurValidate: "<i class='vt' >Boolean [default:false]</i>表单输入框失焦时是否校验，false时不校验，与validate配合"
		}
	},
	methods: {
		reset: {
			desc: "重置",
			args: "数据对象",
			result: "无"
		},
		getModel: {
			desc: "同步获取数据对象",
			args: "origin - 是否获取原始对象，默认为拷贝",
			result: "model - 数据对象"
		},
		getValidateModel: {
			desc: "异步获取校验后的数据对象",
			args: "无",
			result: "model - 校验通过后的数据对象"
		}
	},
	events: {
		submit: {
			desc: "通过校验的提交事件",
			args: "数据对象model"
		}
	},
	demos: [demo1]
};
