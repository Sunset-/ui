/**
 * Created by Zhangyu on 2017/6/6.
 */
/**
 * 遍历树数据，获取对应节点的父节点路径
 * @param items - 递归的设备节点数据
 * @param fn - 寻找判断的回调函数
 * @param pId - 当前递归节点的父节点id,用来记录路径使用
 * @param paths - 父路径记录容器数组
 * @param level - 递归层次，用来记录每个层次的标示
 */
function iterateTreeEx(items, fn, pId, paths, level) {
    if (pId !== "" && items.length !== 0) {
        paths[level] = pId;
    }
    level++;
    iterateFn(items, function(item) {
        if (fn(item)) {
            iterateTreeEx(item.children || [], fn, item.id, paths, level);
        }
    });
}
var isEmptyFn = function (str){
	return (str === undefined || str === null || str === "");
}

var iterateFn = function(arr, fun, cancel){
	if (isEmptyFn(arr))
		return;
	var len = arr.length;
	for (var i=0; i<len; i+=1) {
		var res = fun(arr[i], i);
		if(!res && cancel) break;
	}
};

/**
 * 遍历树数据，寻找队形的节点数据
 * @param items - 递归的设备节点数据
 * @param fn - 寻找判断的回调函数
 */
function iterateTree(items, fn) {
    iterateFn(items, function(item) {
        if (fn(item)) {
            iterateTree(item.children || [], fn);
        }
    });
}
/**
 * 扩展结果字段内容(卡口/摄像机/wifi)
 * @param item - 结果数据
 * @param node - 待收集的节点对象
 */
function extendResult(item, node) {
    if (item.nodeType === "group") {
        //如果是组织，则需要修改和扩展字段
        item.childLoaded = node.childLoaded;
    } else {
        item.status = node.status;
    }
    return item;
}
/**
 * 格式化输出函数
 * @param val - 当前需要格式化的数据
 */
function getSelectedData(val) {
    return val;
    return extendResult({
        id: val.id,
        name: val.name || val.nodeName,
        nodeType: val.type,
        latitude: val.latitude,
        longitude: val.longitude,
        isRoot: val.isRoot
    }, val);
}
/**
 * 格式化单选数据
 * @param list - 已选的数据列表
 * @param val - 当前更新的数据
 */
function checkboxSelect(list, val) {
    //如果已经存在，则删除
    var len = list.length;
    for (var i = 0; i < len; i++) {
        if (list[i].id === val.id) {
            list.splice(i, 1);
            break;
        }
    }
    //新的选中节点，则加入
    if (i === len) {
        list.push(getSelectedData(val));
    }
}
/**
 * 格式化单选数据
 * @param list - 已选的数据列表
 * @param val - 当前更新的数据
 */
function radioSelect(list, val) {
    if (list.length) list.length = 0;
    list.push(getSelectedData(val));
}
/**
 * 添加节点时，遍历当前节点的子节点，根据子节点判断当前节点的状态【允许组织可选中时有效】
 * @param item - 当前待判断状态的节点数据
 * @returns {boolean} - 返回节点状态
 */
function getStatus(item) {
    var status = true;
    iterateFn(item.children || [], function(val) {
        if (!val.isSelected) {
            status = false;
        }
    });
    return status;
}
/**
 * 根据当前节点的添加/删除操作，动态更新当前节点子节点选中状态【允许组织可选中时有效】
 * @param item - 当前节点数据，遍历其子节点设置选择状态
 * @param status - 返回节点状态
 */
function dealSelectDown(item, status) {
    iterateTree(item.children || [], function(val) {
        val.isSelected = status;
        return true;
    });
}
/**
 * 根据节点的操作状态，更新树结构数据的状态
 * @param treeData - 树结构数据
 * @param curId - 待更新状态的节点id
 * @param status - 操作的状态, 添加（true）/删除（false）
 * @param cbFn - 回调函数
 */
function unpdateNodeStatus(treeData, curId, status, cbFn) {
    //遍历树结构数据
    iterateTree(treeData, function(item) {
        if (item.id === curId) {
            item.isSelected = status ? getStatus(item) : status;
            //触发回调
            if(item.isSelected) cbFn && cbFn(item);
            return false;
        }
        return true;
    });
}
/**
 * 根据当前节点的添加/删除操作，向上遍历路径节点并设置路径节点的状态【允许组织可选中时有效】
 * @param treeData - 树节点数据
 * @param status - 当前的操作类型，添加/删除
 * @param paths - 当前节点的父节点路径数组
 */
function dealSelectUp(treeData, status, paths) {
    iterateFn(paths, function(curId) {
        //根据节点的操作状态，更新树结构数据的状态
        unpdateNodeStatus(treeData, curId, status);
    });
}
/**
 * 当前操作节点的处理函数【允许组织可选中时有效】
 * @param item - 当前操作节点数据对象
 * @param cFnDown - 从当前操作节点向下遍历子节点，设置子节点状态
 * @param cFnUp - 从当前节点操作节点向上遍历父节点路劲个，设置路径节点的状态
 */
function dealSelected(item, selectAll, node, cFnDown, cFnUp) {
    console.log("selectAll, node.isSelected:", selectAll, node.isSelected);
    //更新节点状态
    if(selectAll) {
        item.isSelected = !node.isSelected;
    } else {
        item.isSelected = !item.isSelected;
    }
    //根据节点类型进行遍历,item.isSelected为true标示添加，为false标示删除
    cFnDown(item, item.isSelected);
    //向上处理
    cFnUp(item, item.isSelected);
}
/**
 * 多选带组织的使用场景下，向上/向下遍历当前操作节点，设置节点状态
 * @param treeData - 树节点数据
 * @param node - 当前操作的节点对象
 * @param cbFn - 回调函数
 * @param selectAll 是否全选状态
 */
function _dealOrgSelect(treeData, node, selectAll, cbFn) {
    var paths = [],
        isInTreeData = false,
	    selectStatus = true;
    iterateTreeEx(treeData, function(item) {
        if (node.id === item.id) {
            dealSelected(item, selectAll, node, function(val, status) {
                //向下
                dealSelectDown(val, status);
            }, function(val, status) {
                //向上
                dealSelectUp(treeData, status, paths.reverse());
            });
	        selectStatus = item.isSelected;
            //标示在树中能找到
            isInTreeData = true;
            return false;
        }
        return true;
    }, "", paths, -1);
    if(!isInTreeData) {
        selectStatus = node.isSelected = !node.isSelected;
    }
    //回调函数
    if (utils.isFn(cbFn)) cbFn(isInTreeData, selectStatus);
}
/**
 * 根据当前节点，获取其父节点的路径数组【从根节点开始】
 * @param treeData - 树节点数据
 * @param itemId - 当前操作的节点对象的id
 * @param status - 节点状态，用来更新路径上的节点状态
 * @param cbFn - 回调函数
 */
function getOrgPath(treeData, itemId, status, cbFn) {
    var paths = [];
    iterateTreeEx(treeData, function(item) {
        return !(itemId === item.id);
    }, "", paths, -1);
    //加上当前节点
	paths.push(itemId);
	paths = paths.reverse();
    //返回并格式化数据
    return utils.mapFn(paths, function(item) {
        //更新树结构数据节点的状态
        unpdateNodeStatus(treeData, item, status, cbFn);
        //格式化返回
        return { id: item };
    });
}
/**
 * 更新搜索缓存
 * @param searchCache - 搜索缓存数据
 * @param node - 当前选中的节点对象
 * @param isSearchMode - 标记是否在搜索模式
 * @param selectStatus - 选中状态
 * @param isInTreeData - 在树中是否存在
 */
function updateSearchCache(searchCache, node, isSearchMode, selectStatus, isInTreeData) {
    var isInCache = false;
    for (var i = 0; i < searchCache.length; i++) {
        if (searchCache[i].id === node.id) {
            //从缓存中删除
            isInCache = true;
            console.log("hereherehere", selectStatus);
            if(!selectStatus) {
                searchCache.splice(i, 1);
            }
            break;
        }
    }
    if (!isInCache && selectStatus && isSearchMode && !isInTreeData) {
        searchCache.push(getSelectedData(node));
    }
}
/**
 * 获取树结构中已经选择的节点信息【组织可选时使用】
 * @param treeData - 树结构数据
 * @returns {Array} - 结果列表
 */
function getSelectedList(treeData) {
    var res = [], unloadedGroupIds = [];
    iterateTree(treeData, function(item) {
        if (item.isSelected) {
        	res.push(getSelectedData(item));
	        //如果是组织选中,判断其是否已经展开
	        if (!item.isLeaf && !item.childLoaded) {
		        unloadedGroupIds.push(item.id);
		        return false;
	        }
        }
        return true;
    }.bind(this));
    return {
    	nodes: res,
	    unloadedGroupIds: unloadedGroupIds
    };
}
/**
 * 获取树结构中已经选择的节点信息【组织可选时使用】
 * @param treeData - 树结构数据
 * @returns {Array} - 结果列表
 */
function getSelectedListEx(treeData) {
    var res = [];
    iterateTree(treeData, function(item) {
        if (item.isSelected) {
            //添加已选择的项
	        res.push(getSelectedData(item));
            //如果是组织选中，则不再遍历其子组织
            if (!item.isLeaf) {
            	return false;
            }
        }
        //返回true进行子结构遍历
        return true;
    }.bind(this));
    return res;
}
/**
 * 在已选择的结果列表中，合并树搜索缓存中的数据（即节点未展开，但是搜索出来后选中的节点）【组织可选时使用】
 * @param result - 树结构中已选择的数据节点
 * @param searchCache - 树搜索缓存
 * @returns {*} - 结果列表
 */
function mergeSearchCache(result, searchCache) {
    return utils.merge2Set(result, searchCache, function(item1, item2) {
    	if(item1.id === item2.id) {
    		//更新搜索缓存
		    updateSearchCache(searchCache, item1, false, false);
	    }
        return item1.id === item2.id;
    });
}
/**
 * 节点展开时，判断是否已经处于选择状态
 * @param node - 当前需要判断的组织节点
 * @param treeData - 树结构数据
 * @param selectList - 已选节点列表
 * @param searchCache - 搜索缓存
 */
function checkGroupSelect(node, treeData, selectList, searchCache) {
    var childLen = node.children.length,
        isInCount = 0,
        tempItem;
    for (var i = 0; i < childLen; i++) {
        tempItem = node.children[i];
        iterateFn(selectList, function(item) {
            if (item.id === tempItem.id) {
                //标记已经选中
                tempItem.isSelected = true;
                //清除搜索缓存
                updateSearchCache(searchCache, tempItem, false, false);
                return false;
            }
        });
        if (tempItem.isSelected) isInCount++;
    }
    if (isInCount === childLen && childLen !== 0) {
        //全部已经选中，则选中该根组织及祖先组织的判断
	    getOrgPath(treeData, node.id, true, item => {
		    //添加到已选列表中
		    selectList.push(getSelectedData(item));
	    });
    }
}
/**
 * 节点展开时，改组织节点已经选中，则处理其子节点的状态【resultMode == 2时有效】
 * @param node - 节点对象
 * @param searchCache - 搜索缓存
 */
function extendChildList(node, searchCache, isDevicePerTree) {
    //遍历
    iterateFn(node.children, function(item) {
        //标记已经选中
        item.isSelected = isDevicePerTree ? item.isSelected : true;
        item.isChecked = (node.isChecked || node.isSelected) ? true : false;
        //清除搜索缓存
        updateSearchCache(searchCache, item, false, false);
    });
}
/**
 * 在树选组件中，对于已选中的值进行删除时，如果树组织节点未展开，则在notify收集结果的时候进行过滤
 * @param data - 对于为展开节点的子设备列表
 * @param format - 格式化参数
 */
function formateListDev(data, format) {
    var len = data.length;
    for (var i = 0; i < len; i++) {
	    data[i] = utils.formatDescendants(data[i], format);
    }
}
/**
 * 如果是取消组织，则需要删除其下所有的已选点位
 * @param data - 待过滤的数据列表
 * @param initCache - 之前选过的列表
 */
function dealInitCache(data, initCache) {
	utils.mapFn(data, function (item) {
		var matchFlag = utils.indexOfFn(initCache, function (obj) {
			return obj.id === item.id;
		});
		if (matchFlag >= 0) {
			initCache.splice(matchFlag, 1);
		}
	});
}
/**
 * 循环遍历数组，对组织进行缓存
 * @param node - 待缓存的组织节点
 * @param arr - 批量子孙的结果列表
 * @param format - 数据格式化
 * @returns {Array} - node对应的子孙节点，用来缓存
 */
function iterateArr(node, arr, format) {
	var result = [];
	arr.map(function (item) {
		if(item.pid === node.id) {
			if (!format.isLeaf(item)) {
				//组织节点
				result = result.concat(iterateArr(item, arr, format));
			}
			//叶子节点
			result.push(item);
		}
	});
	return result;
}
/**
 * 根据返回的子孙数据，缓存未展开的组织节点，以提高后续的请求效率
 * @param orgListCache - 组织节点缓存数据列表
 * @param noCachedGroupIds - 已选的未展开的组织节点数组
 * @param data - noCachedGroupIds对应的子孙节点请求结果
 * @param format - 数据格式化
 */
function updateOrgCache(orgListCache, noCachedGroupIds, data, format) {
	if(noCachedGroupIds.length > 1) {
		//先整体缓存
		orgListCache[noCachedGroupIds.join(",")] = data;
	}
	//找到结果中的组织列表
	var orgNodes = data.filter((item) => {
		return !format.isLeaf(item);
	});
	//遍历每个组织列表，组装缓存
	orgNodes.map((item) => {
		orgListCache[item.id] = iterateArr(item, data, format);
	});
}
/**
 * 存在缓存或者请求获取子孙节点后，如果是树选组件的删除操作，则需要获取对应删除项的已显示祖先id，以便进行清除
 * @param delItem - 树选组件删除项数据对象
 * @param data - 缓存数据对象，或者是请求的子孙节点数据对象
 * @param noCachedGroupIds - 当前比对成功的缓存组织id串，或者请求子孙节点的组织id串
 * @param delChildOrgs - 子孙节点中的组织节点，待删除
 */
function getNoCachedGroupId(delItem, data, noCachedGroupIds, delChildOrgs) {
	if(noCachedGroupIds.indexOf(delItem.pid) >= 0) {
		return delItem.pid;
	} else {
		var parent = data.filter(item => {
			return item.id === delItem.pid;
		});
		delChildOrgs.push(parent[0]);
		return getNoCachedGroupId(parent[0], data, noCachedGroupIds, delChildOrgs);
	}
}

import utils from "../src/utils";

module.exports = {
    props: {},
    data: function() {
        return {
            searchCache: [],
	        orgListCache: []
        };
    },
    methods: {
        /**
         * 非叶子节点允许选择时的处理入口【组织节点可以选择】
         * @param node - 当前选中的节点数据对象
         * @param treeData - 树结构数据对象
         * @param isSearchMode - 当前是否在搜索模式下
         * @param initCache - 已选设备列表
         * @param selectAll - 是否全选
         * @param cbFn - 回调函数
         */
        dealOrgSelect: function(node, treeData, isSearchMode, initCache, selectAll, cbFn) {
            _dealOrgSelect(treeData, node, selectAll, function(status, selectStatus) {
                //如果在树中没有找到该节点，则标记该节点暂未展开，添加到搜索缓存里
                if (!status && isSearchMode) {
                    updateSearchCache(this.searchCache, node, isSearchMode, selectStatus, status);
                }
                //如果在树中能找到，而此时的搜索缓存有数据，则需要过滤掉，否则在结果merge时又添加进去了
                if (status && this.searchCache.length > 0) {
                    updateSearchCache(this.searchCache, node, isSearchMode, selectStatus, status);
                }
	            //同步更新缓存，如果当前操作的点在已选列表里，则标记反选并删除
	            this.updateSelectedOnDelItem(node, initCache);
	            //回调函数
	            if (utils.isFn(cbFn)) cbFn(selectStatus);
            }.bind(this));
        },
	    /**
	     * 如果是取消组织，则需要删除其下所有的已选点位
	     * @param node - 当前选中的节点数据对象
	     * @param initCache - 之前选过的列表
	     * @param cbFn - 回调函数
	     */
	    updateInitCache: function (node, initCache, cbFn) {
		    if (this.orgListCache[node.id] && this.orgListCache[node.id].length > 0) {
			    //如果已有缓存，则直接取并处理
			    dealInitCache(this.orgListCache[node.id], initCache);
			    if (utils.isFn(cbFn)) cbFn();
			    return;
		    }
		    this.options.async.descendants({orgId: node.id}, (data) => {
			    if (!data || data.length === 0) {
				    if (utils.isFn(cbFn)) cbFn();
			    }
			    //遍历数据，处理缓存
			    dealInitCache(data, initCache);
			    //添加到缓存，过滤掉已经存在的自己的值
			    this.orgListCache[node.id] = data.filter(item => {
			    	return item.id !== node.id;
			    });
			    if (utils.isFn(cbFn)) cbFn();
		    });
	    },
        /**
         * 只允许选择叶子节点，且选择类型为checkbox时的处理入口
         * @param selectDevs - 已选设备列表
         * @param node - 当前选中的节点数据对象
         */
        checkboxSelect: checkboxSelect,
        /**
         * 只允许选择叶子节点，且选择类型为radio时的处理入口
         * @param selectDevs - 已选设备列表
         * @param node - 当前选中的节点数据对象
         */
        radioSelect: radioSelect,
        /**
         * 允许组织可以勾选的情况下，获取已经选中的节点数据【组织可选时使用】
         * @param treeData - 树节点数据对象
         * @param curOperaNode - 当前操作的节点信息
         * @param cbFn - 回调函数
         */
        getSelectedDevs: function(treeData, curOperaNode, cbFn) {
	        var result = getSelectedList(treeData);
	        var resultex = getSelectedListEx(treeData);
	        var selectedNodes = result.nodes, originSelectedNodes = [].concat(result.nodes);
	        var noCachedGroupIds = result.unloadedGroupIds, delItemInfo = [], isGetDelInfo = false, delChildOrgs = [];
	        //如果是单节点，则表示对应的节点已经显示出来了，此时如果是树选组件的删除，则同步更新该节点的祖先节点；
			if(curOperaNode && curOperaNode.isDelItem) {
				utils.mapFn(selectedNodes, (item) => {
					if (curOperaNode.node.id === item.id) {
						delItemInfo = getOrgPath(treeData, item.id, false);
						isGetDelInfo = true;
					}
				});
			}
			//如果不存在获取子孙节点的情况
	        if(!noCachedGroupIds.length) {
		        if(this.searchCache.length !== 0) {
			        console.log("merge 搜索缓存");
			        //补充搜索缓存中的内容
			        selectedNodes = mergeSearchCache(selectedNodes, this.searchCache);
			        //如果resultMode为2，则对外暴露到勾选的组织层即可，另外合并搜索结果
			        resultex = (this.selectOptions.resultMode === 1) ? [] : mergeSearchCache(resultex, this.searchCache);
                }
                console.log("缓存缓存缓存",this.searchCache);
		        //触发回调
		        if (utils.isFn(cbFn)) cbFn(selectedNodes, resultex, delItemInfo, originSelectedNodes.concat(this.searchCache));
		        return;
	        }
	        //先访问缓存
	        if(this.orgListCache[noCachedGroupIds.join(",")]) {
				console.log("命中缓存...");
		        //如果是树选组件删除，则需要获取删除对象的祖先节点
		        !isGetDelInfo && this.orgListCache[noCachedGroupIds.join(",")].map(item => {
			        if (curOperaNode && curOperaNode.isDelItem && item.id === curOperaNode.node.id) {
				        delItemInfo = getOrgPath(treeData, getNoCachedGroupId(item, this.orgListCache[noCachedGroupIds.join(",")], noCachedGroupIds.join(","), delChildOrgs), false);
			        }
		        });
		        //直接从缓存中补充结果
		        selectedNodes = selectedNodes.concat(this.orgListCache[noCachedGroupIds.join(",")]);
		        if(this.searchCache.length !== 0) {
			        console.log("merge 搜索缓存");
			        //如果没有搜索缓存，则根据输出的类型，直接梳理结果
			        selectedNodes = mergeSearchCache(selectedNodes, this.searchCache);
			        //如果resultMode为2，则对外暴露到勾选的组织层即可，另外合并搜索结果
			        resultex = (this.selectOptions.resultMode === 1) ? [] : mergeSearchCache(resultex, this.searchCache);
		        }
		        //触发回调
		        if (utils.isFn(cbFn)) cbFn(selectedNodes, resultex, delItemInfo.concat(delChildOrgs), originSelectedNodes.concat(this.searchCache));
		        return;
	        }
	        console.log("请求子孙节点...", noCachedGroupIds);
	        //每次选择的节点，只有一个通过id获取子孙节点
	        this.options.async.descendants({orgId: noCachedGroupIds.join(",")}, (data) => {
		        if (data && data.length > 0) {
			        //格式化数据
			        formateListDev(data, this.options.render.format);
			        //过滤掉已经存在的自己的值
			        data = data.filter(item => {
			        	return (noCachedGroupIds.indexOf(item.id) < 0);
			        });
			        //如果是树选组件删除，则需要获取删除对象的祖先节点
			        !isGetDelInfo && data.map(item => {
				        if (curOperaNode && curOperaNode.isDelItem && item.id === curOperaNode.node.id) {
					        delItemInfo = getOrgPath(treeData, getNoCachedGroupId(item, data, noCachedGroupIds.join(","), delChildOrgs.concat(delChildOrgs)), false);
				        }
			        });
			        //添加到缓存,数据分析采用异步模式，不占用主流程的效率
			        setTimeout(() => {
			        	updateOrgCache(this.orgListCache, noCachedGroupIds, data, this.options.render.format);
			        }, 100);
			        //补充到已选结果中
			        selectedNodes = selectedNodes.concat(data);
		        }
		        console.log("请求over");
		        if(this.searchCache.length !== 0) {
		        	console.log("merge 搜索缓存");
			        //如果没有搜索缓存，则根据输出的类型，直接梳理结果
			        selectedNodes = mergeSearchCache(selectedNodes, this.searchCache);
			        //如果resultMode为2，则对外暴露到勾选的组织层即可，另外合并搜索结果
			        resultex = (this.selectOptions.resultMode === 1) ? [] : mergeSearchCache(resultex, this.searchCache);
		        }
		        //触发回调
		        if (utils.isFn(cbFn)) cbFn(selectedNodes, resultex, delItemInfo, originSelectedNodes.concat(this.searchCache));
	        });
        },
        /**
         * 根据当前组织节点的状态，展开时回显列表及节点是否全选的判断逻辑
         * @param treeData - 待遍历的设备树
         * @param node - 当前需要判断的组织节点
         * @param cbFn - 回调函数
         */
        dealOnRenderChild: function(treeData, node, cbFn) {
            if(this.selectOptions.selectType === "radio") return;
            if (node.isSelected && !this.isDevicePerTree) {
                //如果当前组织节点已经选中，则扩展其子节点的选中状态
                extendChildList(node, this.searchCache);
                //触发回调，勾选
	            if (utils.isFn(cbFn)) cbFn(node.children);
            } else if(this.isDevicePerTree) {
                extendChildList(node, this.searchCache, this.isDevicePerTree);
            } else  {
                //如果当前组织节点未选择，则根据已选列表判断展开时是否选中该节点
                checkGroupSelect(node, treeData, this.selectDevs, this.searchCache);
            }
        },
        /**
         * 树选组件全部清除功能
         * @param treeData - 待遍历的设备树
         */
        clearAllSelected: function(treeData) {
            //搜索模式下也需要同步更新树上的状态
            iterateTree(treeData || [], function(item) {
                item.isSelected = false;
                return true;
            });
            //清除搜索缓存
	        this.searchCache = [];
        },
        /**
         * 对树的结果进行merge，解决树回显时，在组织结构没有展开的情况下，新勾选的设备列表会覆盖原有已选值问题
         * @param list - 从树上进行过滤生成的已选设备列表【bug70210】
         * @param initCache - 树初始化时，回显的设备列表
         */
        getMergeResult: function(list, initCache) {
            //合并已选值
            return utils.merge2Set(list, initCache, function(item1, item2) {
                return item1.id === item2.id;
            }.bind(this));
        },
        /**
         * 当设备取消勾选时，需要更新selectDevs，不然getMergeResult函数会让结果复现
         * @param node - 当前勾选的节点
         * @param dataArr - 树初始化时，回显的设备列表
         */
        updateSelectedOnDelItem: function (node, dataArr) {
	        if (!dataArr || dataArr.length === 0) return;
	        for (var i = 0; i < dataArr.length; i++) {
		        var tempNodeId = dataArr[i].id;
		        if (tempNodeId === node.id) {
			        dataArr.splice(i, 1);
			        break;
		        }
	        }
        }
    }
};