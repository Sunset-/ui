import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "树组件",
	isFormField: true,
	props: {
		options: {
			style: {
				"i-group": {"string/function": '自定义组织节点图标的class，可以是字符串，也可以是函数【函数参数为当前节点数据对象】'},
				"i-leaf": {"string/function": '自定义叶子节点图标的class，可以是字符串，也可以是函数【函数参数为当前节点数据对象】'},
				"i-root": {"string/function": '自定义根节点图标的class，可以是字符串，也可以是函数【函数参数为当前节点数据对象】'}
			},
			focus: {
				allowFocus: {boolean: '是否在单双击时选中节点，默认为true'},
				allowMutiFocus: {function: '是否允许选中多个节点，自定义逻辑，返回结果为true/false，默认为false'}
			},
			render: {
				autoCollapse: {boolean: '是否在单双击时选中节点，默认为true'},
				isExpandOnClickNode: {boolean: '是否在单双击时选中节点，默认为false'},
				isTreeAsyncLoad: {boolean: '是否异步加载某一节点的子节点，默认为true'},
				asyncNodesNum: {number: '单次异步加载的节点个数，isTreeAsyncLoad为true是有效，默认为100'},
				asyncTimeSlot: {number: '单次异步加载的时间间隔，isTreeAsyncLoad为true是有效，默认为50'},
				format: {
					id: {string: '树单个节点数据的唯一标示【数据库中存储的字段】，对应格式化为树节点数据的id，默认为id'},
					pid: {string:'树单个节点数据父节点的唯一标示【数据库中存储的字段】，对应格式化为树节点数据的pid，默认为pid'},
					name: {string: '树单个节点数据的名称【数据库中存储的字段】，对应格式化为树节点数据的name，默认为name'},
					isLeaf: {function: '判断节点是否为叶子节点，自定义逻辑，返回结果为true/false，函数参数为当前节点数据对象和父节点数据对象'}
				}
			},
			select: {
				selectType: {string: '树节点选择类型【checkbox/radio】，默认为""，即没有选择图标'},
				selectValues: {array: '已勾选的数据[{id:"XXX"}, ...]'},
				resultMode: {number: '树选结果模式【1/2】，配合事件check使用，1标示回传叶子节点数组，2标示回传组织【此处的组织是选中的节点，即不在返回其子孙节点】和叶子节点'},
				showSelect: {function: "selectType不为空时，哪些节点需要展示选择框，自定义逻辑，函数参数为当前节点的数据对象，默认返回true，即所有节点均出现选择图标"}
			},
			async: {
				load: {function: "树节点展开时的数据获取，参数为当前待展开节点的数据对象和回调函数，回调函数接收最终的数据列表数组"},
				descendants: {function: "某节点子孙节点数据获取，配合勾选为展开的组织节点时使用，参数为当前待展开节点的数据对象和回调函数，回调函数接收最终的数据列表数组"},
				search: {function: "搜索数据获取，参数为搜索key值和回调函数，回调函数接收最终的数据列表数组"}
			},
			toolbars: {array: '树节点右侧扩展对象数组[{title:"XXX",icon:"",style:"", visible:func, operate: func}, ...]'},
			toolbarsItem: {
				title: {string: '添加项的title，及鼠标移入后显示的内容'},
				icon: {string: '添加项的icon，这里是class'},
				style: {string: '添加项的style定制，如"cursor: default"'},
				visible: {function: "添加项是否显示的判断函数，自定义函数逻辑"},
				operate: {function: "添加项的点击事件回调函数，自定义函数逻辑"},
			}
		},
		data : 'Array 树节点数据'
	},
	methods: {
		search: {
			desc: "根据关键字搜索树节点",
			args: "关键字，字符串",
			result: "无"
		},
		showSelNodes: {
			desc: "反选树节点",
			args: "需要反选的节点列表，如[id,id,id...]",
			result: "无"
		},
		refreshNode: {
			desc: "刷新节点，树节点的添加/编辑/删除时用",
			args: "节点数据对象，如{id:XXX}",
			result: "无"
		}
	},
	events: {
		initialed: {
			desc: "树初始化完成后，对外暴露根节点",
			args: "[node]根节点数据"
		},
		load: {
			desc: "展开/加载数据时的回调",
			args: "[node]待加载子节点的节点,[cbFn]加载完成后的回调函数"
		},
		clickOnNode: {
			desc: "单击组织节点事件",
			args: "[node]单击的节点数据"
		},
		dbclickOnNode: {
			desc: "双击组织节点事件",
			args: "[node]双击的节点数据"
		},
		clickOnLeaf: {
			desc: "单击叶子节点事件",
			args: "[node]单击的节点数据"
		},
		dbclickOnLeaf: {
			desc: "双击叶子节点事件",
			args: "[node]双击的节点数据"
		},
		dragstartHandler: {
			desc: "拖拽叶子节点事件",
			args: "[node]拖拽的节点数据"
		},
		check: {
			desc: "选择/取消选中节点的事件",
			args: "[data]当前选中的结果集，selectType为[checkbox|radio]时有效"
		}
	},
	demos: [demo1]
};
