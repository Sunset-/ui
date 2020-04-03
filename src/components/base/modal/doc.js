import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "模态窗",
	accendant: "郝勇",
	isFormField: false,
	desc: "遮罩弹出层，自定义窗体内容",
	slot: {
		content: "弹框中间显示部分,插槽作用域（opened:表示弹窗打开过，用于延迟加载内容组件和延长生命周期）",
		footer: "弹框底部显示部分,插槽作用域（opened:表示弹窗打开过，用于延迟加载内容组件和延长生命周期）"
	},
	props: {
		top: "<i class='vt' >Number</i>主框体距顶部距离，默认为100px",
		width: "<i class='vt' >Number</i>主框体宽度，默认为自适应",
		title: "<i class='vt' >String</i>标题，支持html",
		maskClose: "<i class='vt' >Boolean</i>遮罩点击是否关闭，默认为true,false时不关闭",
		options: "<i class='vt' >Object</i>可将上述属性以对象方式传入"
	},
	methods: {
		open: {
			desc: "打开弹窗",
			args: "无",
			result: "无"
		},
		close: {
			desc: "关闭弹窗",
			args: "无",
			result: "无"
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
