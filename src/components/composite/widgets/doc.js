import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "组件集-表单组件",
	desc: "组合多种组件的表单组件",
	slot: {
		default: "上传触发dom样式"
	},
	props: {
		queue: "上传队列,[]",
		ctx: "上下文对象,{}",
		options: {
			url: "<i class='vt' >String</i>上传服务器地址",
			filename: "<i class='vt' >String</i>上传文件域name，默认file",
			formData: "<i class='vt' >Object</i>上传携带表单",
			wait: "<i class='vt' >Boolean</i>是否等待业务调用再上传，默认false",
			progress: "<i class='vt' >Function</i>进度回调",
			queue: "<i class='vt' >Function</i>上传队列变更回调",
			filter: "<i class='vt' >Function</i>文件上传前校验过滤，支持promise返回"
		}
	},
	methods: {
		upload: {
			desc: "开始上传",
			args: "无",
			result: "无"
		},
		removeFile: {
			desc: "将文件从队列中移除",
			args: "file - 文件",
			result: "无"
		}
	},
	events: {
		queue: {
			desc: "上传队列变更事件",
			args: "上传队列,上下文对象ctx"
		},
		"queue-error": {
			desc: "加入队列异常（通常由超出文件数限制引起）",
			args: "msg - 错误信息"
		},
		"start-upload": {
			desc: "开始上传事件",
			args: "无"
		},
		progress: {
			desc: "进度事件",
			args: "总进度progress,上下文对象ctx"
		},
		"single-success": {
			desc: "单项成功事件",
			args: "单项描述对象{status: 标志,result: 服务器返回信息,file: 文件对象},上下文对象ctx"
		},
		success: {
			desc: "成功事件",
			args: "无",
			args: "上传队列,上下文对象ctx"
		},
		"single-error": {
			desc: "单项失败事件",
			args: "单项描述对象{status: 标志,file: 文件对象},上下文对象ctx"
		},
		finish: {
			desc: "完成事件",
			args: "上传队列,上下文对象ctx"
		}
	},
	demos: [demo1]
};
