<template>
	<div class="np-tree" v-if='data'>
        <np-tree ref="tree" v-if="isInit"
				:data ='data'
				:options="treeOptions"
				:isSelectOrg = 'false'
                @initialed="initialed"
				@dbclickOnNode = "dbclickOnNode"
				@clickOnNode='clickOnNode'
				@dbclickOnLeaf='dbclickOnLeaf'
				@clickOnLeaf='clickOnLeaf'
				@dragstartHandler="dragstartHandler"
				@check="checkResult"/>
		<input type="button" value="login" @click.stop = 'login()' />
		<input type="button" value="回显" @click.stop = 'showSelectedNodes()' />
		<input type="button" value="搜索" @click.stop = 'searchTree()' />
		<input type="button" value="清除搜索" @click.stop = 'searchTree("")' />
		<input type="button" value="搜索2" @click.stop = 'searchTree2()' />
		<input type="button" value="高亮" @click.stop = 'highlight()' />
		<input type="button" value="展开节点" @click.stop = 'expandNode()' />
		<input type="button" value="状态清除" @click.stop = 'setAllFalse()' />
	</div>
</template>
<script>
	import demoData from "./data.json";

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
			return [demoData[0]];
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
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				resolve(getData(node));
			}, 100);
		});
	}

	export default {
		data: function () {
			return {
                treeOptions: {
					isEnableDragger: false,
					isDevicePerTree: true,
                    style: {
                        icon: {
                            "i-group": "icon-group",
                            "i-leaf": function () {
                                return "";
                            },
                            "i-root": "icon-root",
	                        "i-focus": "icon-focus"
                        }
                    },
                    focus: {
                    	/*focusClass: "focus-bg",*/
						focusOn: "click",//['click','dbclick']
						// isShowPlayIcon: false,
                        allowFocus: function (node) {
                            return node.isLeaf;
                        },
                        allowMutiFocus: function () {
                            return true;/*(window.mapConfig.isShowMultitonWin) || this.sence === "monitor"*/
                        }
                    },
                    render: {
                        autoCollapse: true,
                        isExpandOnClickNode: true,
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
                            var params = JSON.stringify({id: (!node ? "" : node.id), abilities: [], nodeTypes: ["camera", "monitor", "face_monitor"]});
                            return $.ajax({
                                url: "/gateway/searchservice/v2/tree",
                                contentType: "application/json;charset=UTF-8",
                                dataType :  'json',
                                type: "POST",
                                data: params
                            }).then(res => {
                                cbFn(res.data);
                            });
						},
                        //获取子孙节点，选中未展开组织节点时用
                        descendants: (node, cbFn) => {
                            return $.ajax({
                                url: "/gateway/searchservice/v2/deviceobj/by",
                                contentType: "application/json;charset=UTF-8",
                                dataType :  'json',
                                type: "POST",
                                data: JSON.stringify({
                                    id: node.orgId,
	                                abilities: ["camera", "face", "traffic", "body", "nonmotor", "wifi", "rfid"],
									nodeTypes: ["camera", "monitor", "face_monitor", "wifi", "rfid", "ice"]
                                })
                            }).then(res => {
                                cbFn(res.data);
                            });
                        },
                        //搜索节点时用
                        search: (key, cbFn) => {
                            return $.ajax({
                                url: "/gateway/searchservice/v2/tree_search",
                                contentType: "application/json;charset=UTF-8",
                                dataType :  'json',
                                type: "POST",
                                data: JSON.stringify({key: key, topx: 50, abilities: [], nodeTypes: ["camera", "monitor", "face_monitor"]})
                            }).then(res => {
                                cbFn(res.data);
                            });
						},
						//根据叶子节点id，获取其祖先节点的id数组，目前用于反向定位
						getAncestors(params, cbFn) {
							return $.ajax({
								url:"/gateway/searchservice/v2/tree_ancestors/{id}",
								contentType: "application/json;charset=UTF-8",
								dataType: 'json',
								type:'GET',
								data:params.id
							}).then(res => {
								cbFn(res);
							})
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
				$.ajax({
					url: "/gateway/login?1.0.5",
					type: "POST",
					data: {
						visitHost: "192.168.60.126",
						cip: "192.168.61.61",
						cmac: "B0-83-FE-93-87-D6",
						username: "admin",
						password: "e10adc3949ba59abbe56e057f20f883e"
					}
				}).then(res => {
					alert("登陆成功");
					this.isInit = true;
				});
			},
			searchTree: function (key) {
				if(typeof key === "string"){
					this.$refs.tree.search("");
				} else {
					this.$refs.tree.search("连云港");
				}
			},
			searchTree2() {
				this.$refs.tree.search("人脸");
			},
			showSelectedNodes: function () {
				this.$refs.tree.showSelNodes([{
					id: "5c985ab0-85f5-4d11-9dcf-5796e30f3318"
				}, {
					id: "001z48vu3WkC9W2A"
				}]);
			},
			highlight: function() {
				this.focus = !this.focus;
				//this.$refs.tree.setFocus("003J003J3WkC9WB", this.focus);
				this.$refs.tree.setFocus(["003J003J3WkC9WB", "003J003J3WkC9WG"], this.focus);
			},
			expandNode: function () {
				this.$refs.tree.expandGroupNode("001z48vu3WkC9W29", true);
			},
			setAllFalse() {
				this.$refs.tree.setFocusFalse();
			},
            initialed: function (node) {
                console.log("根节点：", node);
            },
			clickOnNode: function (node) {
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
<style lang="less">
    .np-tree-node-list .icon-root {width: 16px; height: 14px;background-image: url(./icon/icon16x14-org.png);}
    .np-tree-node-list .icon-group,.np-tree-node-list .icon-leaf {width: 16px; height: 14px;background-image: url(./icon/icon16x14-police.png);}
    .np-tree-node-list .icon-tool { width: 16px; height: 14px; background-image: url(./icon/icon16x14-org.png);}
    .np-tree-node-list .icon-focus {width: 16px; height: 16px; background-image: url(./icon/camera-inspecting.gif);}
    .np-tree-node-list .focus-bg {
        background-color: red;
    }
</style>
