import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "操作栏",
	accendant : '亮亮',
	props: {
		ctx: "上下文，会作为参数传入操作回调中",
		options: {
			size : "<i class='vt' >String</i>尺寸",
			tools: {
				type: "<i class='vt' >String [default:button]</i>操作类型：button,download,switch,file,dropdown",
				disabled: "<i class='vt' >Boolean</i>是否禁用",
				premise: "<i class='vt' >Boolean / Function</i>是否显示",
				label: "<i class='vt' >String</i>按钮label",
				icon: "<i class='vt' >String</i>图标",
				color: "<i class='vt' >String</i>语义颜色,见按钮语义颜色",
				operate: "<i class='vt' >Function</i>操作回调",
				name: "<i class='vt' >Function</i>下载操作时，下载文件名称",
				data: "<i class='vt' >Function</i>下载操作时，下载文件内容"
			},
			size: "尺寸（medium / small / mini）"
		}
	},
	methods: {},
	events: {
	},
	demos: [demo1]
};
