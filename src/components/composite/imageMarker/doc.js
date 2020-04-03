import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "图片标注器",
	isFormField: false,
	props: {
		options: {}
	},
	methods: {
		setImage: {
			desc: "设置图片路径",
			args: "图片url",
			result: "无"
		},
		setMarkType: {
			desc: "设置标注类型",
			args: "markType标注类型(目前支持LINE,ARROWS,RECT,ELLIPSE,FONT)",
			result: "无"
		},
		setMarkStyle: {
			desc: "设置标注样式",
			args: `样式对象，例如{lineColor: "red",lineWidth: 2,fontColor: "red",fontStyle: "normal 14px arial,sans-serif"}`,
			result: "无"
		},
		markFont: {
			desc: "标注文字，使用方式见示例",
			args: "text文字内容,pos标注锚点",
			result: "无"
		},
		backspace: {
			desc: "回退",
			args: "无",
			result: "无"
		},
		recover: {
			desc: "恢复",
			args: "无",
			result: "无"
		},
		setMarks: {
			desc: "设置标注，用于重现标注",
			args: "标注数组（通过getMarks获得）",
			result: "无"
		},
		addMarks: {
			desc: "添加标注，用于重现标注",
			args: "标注数组（通过getMarks获得）",
			result: "无"
		},
		getMarks: {
			desc: "获取标注数据",
			args: "无",
			result: "标注数组"
		},
		clearMarks: {
			desc: "清空标注",
			args: "无",
			result: "无"
		},
		resize: {
			desc: "重置尺寸",
			args: "无",
			result: "无"
		}
	},
	events: {
		inited: {
			desc: "初始化完成，图片已加载，用于设置标注数据",
			args: "无"
		},
		"mark-font": {
			desc: "标注文字的点击事件，用于将标注锚点抛出，业务中再使用markFont添加文字标注",
			args: "pos文字标注锚点"
		}
	},
	demos: [demo1]
};
