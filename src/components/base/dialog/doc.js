import demo1 from "./demo/demo1.vue";
module.exports = {
	title: "动画弹窗",
	accendant: "董磊",
	slot: {
		default: "内容模版,插槽作用域（opened:表示弹窗打开过，用于延迟加载内容组件和延长生命周期）"
	},
	props: {
		title: "<i class='vt' >String</i>弹窗显示名称",
		top: "<i class='vt' >Number</i>弹窗距离顶部的距离 top值(默认50)",
		animate: "<i class='vt' >Boolean [default:true]</i>是否使用动画弹出,默认开启",
		closeable: "<i class='vt' >Boolean [default:true]</i>是否可通过右上角关闭窗口",
		options: "<i class='vt' >Object </i>包含上述所有属性"
	},
	methods: {
		open: {
			desc: "打开弹窗",
			args: "无"
		},
		close: {
			desc: "关闭弹窗",
			args: "无"
		}
	},
	events: {
		opened: {
			desc: "弹窗打开事件",
			args: "无"
		},
		closed: {
			desc: "弹窗关闭事件",
			args: "无"
		}
	},
	demos: [demo1]
};
