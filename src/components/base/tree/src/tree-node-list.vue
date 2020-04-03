<template>
    <ul class="np-tree-node-list" :class="['level-'+level]" v-if="data.length">
        <li class="np-tree-nl-list" v-for='(node, index) in newDataWithLevel' :key="index" :class="['level-'+level]" :draggable="options.isEnableDragger && node.isLeaf"
            @click.stop='clickNode(node)'
            @dblclick.stop='dbclickNode(node)'
            @dragstart.stop="dragstartHandler(node)">
            <div onselectstart="return false" class="node"
                    :class="node.isFocused && getFocusStyle(node)">
                <p class="np-tree-nodelist-slots fr" v-if="(options.toolbars && options.toolbars.length) || (options.tips && options.tips.length)">
                    <i class="icon" v-for="item in options.toolbars" v-if="checkVisible(item, node)" :title="item.title" :class="item.icon" :style="item.style" @click.stop="item.operate && item.operate(node)" />
                    <span class="tips" v-for="item in options.tips" v-if="checkVisible(item, node)" :title="getPropertyInfo(item, 'content', node)" :class="getPropertyInfo(item, 'class', node)" :style="item.style" >{{getPropertyInfo(item, 'content', node)}}</span>
                </p>
                <div class="np-tree-nodelist-info">
                    <!--展开部分的图标-->
                    <a class="icon icon-collapse fl" :class="{'expand': node.isOpen}"
                            v-if='!node.isLeaf'
                            @click.stop='expandNode(node)'/>
                    <!--多选/单选选择图标-->
                    <a class="icon icon-check checkbox fl" v-if='selectOptions.selectType==="checkbox" && selectOptions.showSelect(node)'
                       :class="{'checked': selectData[node.id] && selectData[node.id]['_checked'], 'deviceChecked': node.isChecked && isDevicePerTree}"
                       @click.stop='checkNode(node,true)'/>
                    <a class="icon icon-check radio fl" v-else-if='selectOptions.selectType==="radio" && selectOptions.showSelect(node)'
                       :class="selectData[node.id] && selectData[node.id]['_checked']"
                       @click.stop = 'checkNode(node,true)'/>
                    <!--节点类型图标-->
                    <a class="icon icon-type fl" :class="getCusStyle(node, node.isFocused)" />
                    <!--节点名字-->
                    <a class="name" :style="nameWidths[index]" style="display: block; overflow: hidden; margin-right: 10px;">
                        <span class="node-name" :title='node.name'>{{node.name}}</span>
                    </a>


                </div>
            </div>
            <tree-nodelist v-if='!node.isLeaf' v-show='node.isOpen'
                :selectValues="selectValues"
                :data='node.children' :level='level+1'
                :options="options"
                @initialed='initialed'
                @dbclickOnNode = "dbclickOnNode"
                @clickOnNode='clickOnNode'
                @dbclickOnLeaf='dbclickOnLeaf'
                @clickOnLeaf='clickOnLeaf'
                @dragstartHandler="dragstartHandler"
                @checkNode="checkNode"
                @renderNode="renderNode"/>
        </li>
    </ul>
    <div v-else style="color: grey; margin-left: 18px; height: 27px; line-height: 27px; font-size: 12px;">{{tips}}</div>
</template>
<script>
import utils from "./utils";
import treeMixin from "./tree-mixin";

var dbclickTimer = null;
var cacheData = [];

export default {
    name: "treeNodelist",
    mixins: [treeMixin],
    props: {
        selectValues: {type: Array, default: []},
        level: {type: Number, default: 1},
        isSearchMode: {type: Boolean, default: false}
    },
    data: function () {
        return {
            nameWidths: [],
            newData: [],
            useList: true,
            tips: "正在加载..."
        };
    },
    mounted: function () {
    	if(this.newData.length === 0 && this.data.length > 0) {
		    this.newData = this.data;
		    //展开第一层
		    !this.isSearchMode && this.loadFirstNode();
	    }
    },
    computed: {
	    selectData: function () {
            var _clzes = {};
            var formatValue = this.selectValues.map(item => {
                return item.id
            })
            if(this.isDevicePerTree) {
                utils.iterateTree(this.data,(items, pItem) => {
                    if(pItem.isChange === void 0) {
                        pItem.isChange = (formatValue.indexOf(pItem.id) != -1) ? false : true;
                    }
                    items.isChecked = pItem.isChange ? false : items.isChecked;
                    items.isSelected = false;
                    var isContainue = items.children ? true : false;
                    return isContainue
                })
            }
		    this.selectValues.map(item => {
		    	//将选中状态同步到树结构的数据上，避免在回显时因为树上数据的状态影响最后的结果,异步处理，避免影响主要流程
                setTimeout(() => {
	                utils.iterateTree(this.data, node => {
		                if(node.id === item.id) {
                            node.isSelected = true;
                            if(node.children && this.isDevicePerTree) {
                                utils.iterateTree(node.children,(items) => {
                                    items.isChecked = true;
                                    var isContainue = items.children ? true : false;
                                    return isContainue
                                })
                            }
                        }
	                });
                }, 50);
                _clzes[item.id] = { "_checked": 'checked' };
            });
		    return _clzes;
        },
        isShowPlayIcon() {
            var value = this.options.focus ? this.options.focus.isShowPlayIcon : false;
            return  value;
        },
        newDataWithLevel() {
            const {level} = this
            if(Array.isArray(this.newData)) {
                this.newData.forEach(item=>{
                    item._nodeLevel = level
                })
            }
            return this.newData
        }
    },
    watch: {
        data: function (val) {
            if (val.length > this.renderOptions.asyncNodesNum && this.renderOptions.isTreeAsyncLoad) {
                cacheData = [].concat(val);
                this.useList = false;
                this.newData = cacheData.splice(0, this.renderOptions.asyncNodesNum);
                this.asyncDisplayData();
            } else {
                this.useList = true;
                this.newData = val;
            }
            if(!val.length) this.tips = "暂无数据。";
            //展开第一层
            !this.isSearchMode && this.loadFirstNode();
        }
    },
    methods: {
        loadFirstNode: function () {
        	var root = this.data[0];
            //判断是否是根节点
            if(root && !root.isOpen && root.parentNodeId === "") {
                //默认展开第一层
                this.expandNode(root);
                //对外暴露根组织节点
                this.initialed(root);
            }
        },
        //异步加载树节点，在数据量比较大的时候
        asyncDisplayData: function () {
            setTimeout(() => {
                if (cacheData.length > 0) {
                    this.newData = this.newData.concat(cacheData.splice(0, this.renderOptions.asyncNodesNum));
                    this.asyncDisplayData();
                }
            }, this.renderOptions.asyncTimeSlot || 0);
        },
        expand: function (node) {
            if (node.isOpen) {
                node.isOpen = false;
                return;
            }
            if (this.renderOptions.autoCollapse)
                this.data.forEach((item) => {
                    !item.isLeaf && (item.isOpen = false);
                });
            node.isOpen = true;
        },
        expandNode: function (node) {
            this.expand(node);
            //如果子节点数据很大，则在收起时销毁页面元素
            if(!node.isOpen && node.childLoaded && node.children.length > 3000) {
            	console.log("herehere");
            	node.childLoaded = false;
            	node.children.length = 0;
            	return;
            }
            if (!node.childLoaded) { // 加载数据
                this.options.async.load(node, (res) => {
                    node.children = utils.formatData(res, this.options.render.format, node);
                    node.childLoaded = true;
                    this.$emit("renderNode", node);
                });
            } else if(this.isDevicePerTree && node.childLoaded) {
                this.$emit("renderNode", node);
            }
        },
        clickNode: function (node) {
            clearTimeout(dbclickTimer);
            dbclickTimer = setTimeout(() => {
                if (node.isLeaf) {
                    this.clickOnLeaf(node);
                    this.$emit("clickOnNode", node);
                } else {
                    this.clickOnNode(node);
                    if (!node.isOpen && this.renderOptions.isExpandOnClickNode) {
                        this.expandNode(node);
                    }
                }
            }, 300);
        },
        dbclickNode: function (node) {
            clearTimeout(dbclickTimer);
            if (node.isLeaf) {
                this.dbclickOnLeaf(node);
                this.$emit("dbclickOnNode", node);
            } else {
                this.dbclickOnNode(node);
                this.expandNode(node);
            }
        },
        checkNode: function (node,fromUserEvent) {
            // //如果是设备权限树,添加强权限与弱权限
            // if(this.isDevicePerTree && node.children && fromUserEvent) {
            //     node.isDevicePerChecked = !node.isDevicePerChecked;
            //     node.isChecked = !node.isChecked;
            //     if(node.children) {
            //         utils.iterateTree(node.children,(item) => {
            //             item.isChecked = node.isChecked ? true : false;
            //             var isContainue = item.children ? true : false;
            //             return isContainue
            //         })
            //     }
            // }
            this.$emit("checkNode", node);
        },
        renderNode: function (node) {
            this.$emit("renderNode", node);
        },
        getCusStyle: function (node, isFocused) {
            if(node.isRoot) {
                if(!this.isShowPlayIcon) {
                    return utils.getStyle(node, this.styleIconOptions["i-root"]);
                }
                return utils.getStyle(node, !isFocused ? this.styleIconOptions["i-root"] : this.styleIconOptions["i-focus"]);
            } else if(!node.isLeaf) {
                if(!this.isShowPlayIcon) {
                    return utils.getStyle(node, this.styleIconOptions["i-group"]);
                }
                return utils.getStyle(node, !isFocused ? this.styleIconOptions["i-group"] : this.styleIconOptions["i-focus"]);
            } else {
                if(!this.isShowPlayIcon || node.nodeType === "monitor" || node.nodeType === "wifi" || node.nodeType === "face_monitor" || node.nodeType === "rfid") {
                    return  utils.getStyle(node, this.styleIconOptions["i-leaf"]) || "leaf";
                }
                return utils.getStyle(node, !isFocused ? this.styleIconOptions["i-leaf"] : this.styleIconOptions["i-focus"]) || "leaf";
            }
        },
        checkVisible: function (item, node) {
            if(item.visible) {
                return item.visible(node);
            }
            return true;
        },
	    getPropertyInfo: function (item, property, node) {
            if(typeof item[property] === "function") {
            	return item[property](node);
            }
            return item[property];
	    },
        getFocusStyle: function (node) {
	        if (this.focusOptions.focusClass) {
		        return utils.getStyle(node, this.focusOptions.focusClass);
	        } else {
		        return "focused";
	        }
        },
        recursiveData(data, arr, isPlay) {
            if(arr.length === 0) {
                return;
            }
            utils.iterateTree(data, function(item) {
                if(item.id === arr[0].id) {
                    arr.shift();
                    console.log(item.name);
                    if(item.isLeaf) {
                        if(isPlay) {
                            item.isFocused = true;
                            this.$emit("focusId",item);
                        }
                        return false;
                    }
                    item.isOpen = true;
                    if (!item.childLoaded) { // 加载数据
                        this.options.async.load(item, (res) => {
                            item.children = utils.formatData(res, this.options.render.format, item);
                            item.childLoaded = true;
                            this.$emit("renderNode", item);
                            this.recursiveData([item],arr,isPlay);
                            return false;
                        })
                    } else {
                        this.recursiveData([item],arr,isPlay);
                        return false;
                    }
                } else {
                    return true;
                }
            }.bind(this));
        },
        openNode(openArr,isPlay) {
            this.loadFirstNode();
            this.recursiveData(this.newData,openArr,isPlay);
        }
    }
};
</script>
<style lang="less">
@import './default-icon.less';
@levelPadding: 20px;

.np-tree-node-list{
	padding:0;

	li {list-style: none;}
	li > .node{
		position: relative;
		height:30px;
		font-size:0;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	li > .node:hover{
		background-color:#f6f6f6;
		font-weight:bold;
		cursor:pointer;
		.node-name{color: #2d87f9;}
        .icon.hover {display: inline-block;}
	}
	li > .node.focused {
		font-weight:bold;
		background-color:#f6f6f6;

		.node-name{color: #FF8D33;}
	}
	li > .node > .name {
		display: inline-block;
		height: 100%;
	}
	.name > span {
		display: inline-block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 12px;
		color: #333;
		cursor: pointer;
	}

	/*.level-1 > div{padding-left:@levelPadding;}*/
	.level-2 > div{padding-left:@levelPadding*1;}
	.level-3 > div{padding-left:@levelPadding*2;}
	.level-4 > div{padding-left:@levelPadding*3;}
	.level-5 > div{padding-left:@levelPadding*4;}
	.level-6 > div{padding-left:@levelPadding*5;}
	.level-7 > div{padding-left:@levelPadding*6;}
	.level-8 > div{padding-left:@levelPadding*7;}
	.level-9 > div{padding-left:@levelPadding*8;}
    .level-10 > div{padding-left:@levelPadding*9;}
    .level-11 > div{padding-left:@levelPadding*10;}
    .level-12 > div{padding-left:@levelPadding*11;}
    .level-13 > div{padding-left:@levelPadding*12;}
    .level-14 > div{padding-left:@levelPadding*13;}
    .level-15 > div{padding-left:@levelPadding*14;}
    .icon {
        width: 12px;
        height: 12px;
        margin-right: 5px;
        cursor: pointer;
        margin-top: 8px;
    }
    .tips {
        font-size: 12px;
        line-height: 30px;
    }
	.np-tree-nodelist-slots {
        display: inline-block; width: auto;
        .icon {display: inline-block;}
        .icon.hover {display: none;}
    }
	.np-tree-nodelist-info {overflow: hidden; height: 100%; line-height: 30px;}

	/*展开和折叠图标样式*/
    .icon-collapse.icon {
        width: 11px;height: 11px;margin-top: 9px;
        background-image: url(@expand);
        &:hover {
             background-image: url(@expandHover);
        }
    }
	.icon-collapse.expand {
        background-image: url(@collapse);
        &:hover {
             background-image: url(@collapseHover);
         }
    }
    /*节点类型图标样式*/
	.icon-type{background-image: url(@folder);}
	.icon-type.leaf{background-image: url(@file);}
    /*单选和多选图标样式*/
    .icon-check.icon {width:13px;height:13px;}
    .icon-check.checkbox {background-image: url(@checkbox);}
    .icon-check.checkbox.checked {background-image: url(@checkboxSelected)!important;}
    .icon-check.checkbox.deviceChecked {background: #ccc; box-shadow: 2px 5px 4px #888;}
    .icon-check.radio {background-image: url(@radio);}
    .icon-check.radio.checked {background-image: url(@radioSelected);}

	.fl {float: left;}
	.fr {float: right;}
}
</style>
