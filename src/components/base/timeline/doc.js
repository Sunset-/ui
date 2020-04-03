import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "时间轴",
	accendant: "亮亮",
	desc: "实现了鱼骨图时间轴",
	slot: {
		default: "内容模板,插槽作用域（item:单条数据，index:数据索引）"
	},
	props: {
		data: "<i class='vt' >Array</i>时间轴节点数组",
		options: {
			color: "<i class='vt' >String/Function</i>时间轴标线颜色",
		}
	},
	methods: {
	},
	events: {
	},
	demos: [demo1]
};
