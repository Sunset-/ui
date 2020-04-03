# 树组件

## 属性

| 属性名                             |    类型    | 默认值 | 描述                                                                                                                                       |
| :--------------------------------- | :--------: | :----: | :----------------------------------------------------------------------------------------------------------------------------------------- |
| options                            |  `Object`  |   无   | 配置对象                                                                                                                                   |
| options.style                      |  `Object`  |   无   | 自定义组织节点图标的 class，可以是字符串，也可以是函数【函数参数为当前节点数据对象】                                                       |
| options.focus.allowFocus           | `boolean`  |  true  | 是否在单双击时选中节点                                                                                                                     |
| options.focus.allowMutiFocus       | `function` | false  | 是否允许选中多个节点，自定义逻辑，返回结果为 true/false，默认为 false                                                                      |
| options.render.autoCollapse        | `Boolean`  |  true  | 是否在单双击时选中节点                                                                                                                     |
| options.render.isExpandOnClickNode | `boolean`  | false  | 是否在单双击时选中节点                                                                                                                     |
| options.render.isTreeAsyncLoad     | `boolean`  |  true  | 是否异步加载某一节点的子节点                                                                                                               |
| options.render.asyncNodesNum       |  `number`  |  100   | 单次异步加载的节点个数，isTreeAsyncLoad 为 true 是有效                                                                                     |
| options.render.asyncTimeSlot       |  `number`  |   50   | 单次异步加载的时间间隔，isTreeAsyncLoad 为 true 是有效                                                                                     |
| options.render.format.id           |  `string`  |   id   | 树单个节点数据的唯一标示【数据库中存储的字段】，对应格式化为树节点数据的 id                                                                |
| options.render.format.pid          |  `string`  |  pid   | 树单个节点数据父节点的唯一标示【数据库中存储的字段】，对应格式化为树节点数据的 pid                                                         |
| options.render.format.name         |  `string`  |  name  | 树单个节点数据的名称【数据库中存储的字段】，对应格式化为树节点数据的 name                                                                  |
| options.render.format.isLeaf       | `function` |   无   | 判断节点是否为叶子节点，自定义逻辑，返回结果为 true/false，函数参数为当前节点数据对象和父节点数据对象                                      |
| options.select.selectType          |  `string`  |   ""   | 树节点选择类型【checkbox/radio】，默认为""，即没有选择图标                                                                                 |
| options.select.selectValues        |  `array`   |   无   | 已勾选的数据[{id:"XXX"}, ...]                                                                                                              |
| options.select.resultMode          |  `number`  |   无   | 树选结果模式【1/2】，配合事件 check 使用，1 标示回传叶子节点数组，2 标示回传组织【此处的组织是选中的节点，即不在返回其子孙节点】和叶子节点 |
| options.select.showSelect          | `function` |   无   | selectType 不为空时，哪些节点需要展示选择框，自定义逻辑，函数参数为当前节点的数据对象，默认返回 true，即所有节点均出现选择图标             |
| options.async.load                 | `function` |   无   | 树节点展开时的数据获取，参数为当前待展开节点的数据对象和回调函数，回调函数接收最终的数据列表数组                                           |
| options.async.descendants          | `function` |   无   | 某节点子孙节点数据获取，配合勾选为展开的组织节点时使用，参数为当前待展开节点的数据对象和回调函数，回调函数接收最终的数据列表数组           |
| options.async.search               | `function` |   无   | 搜索数据获取，参数为搜索 key 值和回调函数，回调函数接收最终的数据列表数组                                                                  |
| options.toolbars                   |  `array`   |   无   | 树节点右侧扩展对象数组[{title:"XXX",icon:"",style:"", visible:func, operate: func}, ...]                                                   |
| options.toolbarsItem.title         |  `string`  |   无   | 添加项的 title，及鼠标移入后显示的内容                                                                                                     |
| options.toolbarsItem.icon          |  `string`  |   无   | 添加项的 icon，这里是 class                                                                                                                |
| options.toolbarsItem.style         |  `string`  |   无   | 添加项的 style 定制，如"cursor: default"                                                                                                   |
| options.toolbarsItem.visible       | `function` |   无   | 添加项是否显示的判断函数，自定义函数逻辑                                                                                                   |
| options.toolbarsItem.operate       | `function` |   无   | 添加项的点击事件回调函数，自定义函数逻辑                                                                                                   |
| data                               |  `Array`   |   无   | Array 树节点数据                                                                                                                           |

## 方法

| 方法名       |                参数                 | 返回值 | 描述                                 |
| :----------- | :---------------------------------: | :----- | :----------------------------------- |
| search       |           关键字，字符串            | 无     | 根据关键字搜索树节点                 |
| showSelNodes | 需要反选的节点列表，如[id,id,id...] | 无     | 反选树节点                           |
| refreshNode  |      节点数据对象，如{id:XXX}       | 无     | 刷新节点，树节点的添加/编辑/删除时用 |

## 事件

|      属性名      |                            参数                             | 描述                           |
| :--------------: | :---------------------------------------------------------: | :----------------------------- |
|    initialed     |                      [node]根节点数据                       | 树初始化完成后，对外暴露根节点 |
|       load       |     [node]待加载子节点的节点,[cbFn]加载完成后的回调函数     | 展开/加载数据时的回调          |
|   clickOnNode    |                    [node]单击的节点数据                     | 单击组织节点事件               |
|  dbclickOnNode   |                    [node]双击的节点数据                     | 双击组织节点事件               |
|   clickOnLeaf    |                    [node]单击的节点数据                     | 单击叶子节点事件               |
|  dbclickOnLeaf   |                    [node]双击的节点数据                     | 双击叶子节点事件               |
| dragstartHandler |                    [node]拖拽的节点数据                     | 拖拽叶子节点事件               |
|      check       | [data]当前选中的结果集，selectType 为[checkbox/radio]时有效 | 选择/取消选中节点的事件        |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<style lang="less">
    .np-tree-node-list .icon-root {width: 16px; height: 14px;background-image: url(./components/base/icon/icon16x14-org.png);}
    .np-tree-node-list .icon-group,.np-tree-node-list .icon-leaf {width: 16px; height: 14px;background-image: url(./components/base/icon/icon16x14-police.png);}
    .np-tree-node-list .icon-tool { width: 16px; height: 14px; background-image: url(./components/base/icon/icon16x14-org.png);}
</style>
<template>
  <div class="demo-container">
    <div class="np-tree" v-if='data'>
		<input type="button" value="设置静态数据" @click.stop = 'login()' />
		<input type="button" value="回显" @click.stop = 'showSelectedNodes()' />
        <xui-tree ref="tree" v-if="isInit"
				:data ='data'
				:options="treeOptions"
                @initialed="initialed"
				@dbclickOnNode = "dbclickOnNode"
				@clickOnNode='clickOnNode'
				@dbclickOnLeaf='dbclickOnLeaf'
				@clickOnLeaf='clickOnLeaf'
				@dragstartHandler="dragstartHandler"
				@check="checkResult"/>
	</div>
  </div>
</template>

<script>
var demoData;
	function iterateTree(items, fn) {
		IX.iterate(items, function(item) {
			if (fn(item)) {
				iterateTree(item.children || [], fn);
			}
		});
	}

	function getData(node) {
		if (!node) {
			console.log("请求根组织数据：", node);
			return [demoData[0]]
		}
		var res = [];
		iterateTree(demoData, function (item) {
			if (item.id === node.id) {
				res = item.children;
				return false;
			}
			return true;
		});
		return res;
	}

	function loadData(node) {
		return getData(node);
	}

	export default {
		data: function () {
			return {
                treeOptions: {
                    isEnableDragger: false,
                    style: {
                        icon: {
                            "i-group": "icon-group",
                            "i-leaf": function () {
                                return "";
                            },
                            "i-root": "icon-root"
                        }
                    },
                    focus: {
                        allowFocus: true,
                        allowMutiFocus: function () {
                            return false;/*(window.mapConfig.isShowMultitonWin) || this.sence === "monitor"*/
                        }
                    },
                    render: {
                        autoCollapse: true,
                        isExpandOnClickNode: false,
                        isTreeAsyncLoad: true,
                        asyncNodesNum: 1000,
                        asyncTimeSlot: 50,
                        format: {
                            id: "id",
                            pid: "parentId",
                            name: "name",
                            isLeaf: (item, node) => {
								return (item.nodeType !== "org");
                            }
                        }
                    },
                    select: {
                        selectType: "checkbox",
                        selectValues: [/*"6de7a8c6-5104-4f75-902c-47b02af4e035"*/],
                        resultMode: 1,
                        //selectType不为空时，哪些节点需要展示选择框，自定义逻辑
                        showSelect: (node) => {
                            return true/*node.isLeaf*/;
                        }
                    },
					async: {
						//树节点展开时用
						load: (node, cbFn) => {
							$.get({url:"./components/base/data.json", dataType:'json'}, res => {
								demoData = res;
								cbFn(loadData(node))
							})
						},
                        //获取子孙节点，选中未展开组织节点时用
                        descendants: (node, cbFn) => {
                        },
                        //搜索节点时用
                        search: (key, cbFn) => {
                        }
					},
					toolbars: [{
                        title: "点击事件",
                        icon: "icon-tool hover",
                        style: "cursor: default",
                        visible: (item) => {
                            return item.isLeaf;
                        },
                        operate: (item) => {
                            console.log("operate:", item);
                        }
					}],
					tips:[{
						class: function (item) {
                            return "zy";
						},
						style: "cursor: default",
                        visible: (item) => {
	                        return !item.isLeaf;
                        },
                        content: function (item) {
                            return "tips";
                        }
					}]
                },
				data: [],//demoData
				isInit: false
			};
		},
		methods: {
			login: function () {
				this.isInit = true;
			},
			searchTree: function (key) {
				if(typeof key === "string"){
					this.$refs.tree.search("");
				} else {
					this.$refs.tree.search("连云港");
				}
			},
			showSelectedNodes: function () {
				this.$refs.tree.showSelNodes([{
					id: "001z48vu3WkCA7H"
				}, {
					id: "001z48vu3WkCA7G"
				}]);
			},
            initialed: function (node) {
                console.log("根节点：", node);
            },
			clickOnNode: function (node) {
				debugger
				console.log("clickOnNode:", node);
			},
			dbclickOnNode: function (node) {
				console.log("dbclickOnNode:", node);
			},
			clickOnLeaf: function (node) {
				console.log("clickOnLeaf:", node);
			},
			dbclickOnLeaf: function (node) {
				console.log("dbclickOnLeaf:", node);
			},
			dragstartHandler: function (node) {
				console.log(node);
			},
            checkResult: function (data) {
				console.log("checkResult:", data);
			}
		}
	};
</script>
</script>
