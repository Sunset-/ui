/**
 * Created by Zhangyu on 2018/4/28.
 */

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

var isUndefined = function (obj) {
	return typeof(obj) === 'undefined';
}

function iterateTree(items, fn) {
	iterateFn(items, function(item) {
		if (fn(item, items)) {
			iterateTree(item.children || [], fn);
		}
	});
}
var BaseTypes = {
	"object": Object,
	"function": Function,
	"string":String,
	"boolean":Boolean,
	"number": Number
};
var isTypeFn = function (type){
	return function(obj){
		return (obj !== null && (typeof(obj)==type || obj instanceof BaseTypes[type]));
	};
}

var loopFn = function(varr, sIdx, eIdx, acc0, fun, isAscLoop) {
	if (!varr || varr.length===0)
		return acc0;
	var len=varr.length;
	eIdx = (eIdx===-1)?len: eIdx;
	if (sIdx>=eIdx)
		return acc0;
	
	var acc = acc0, min = Math.max(0, sIdx), max = Math.min(len, eIdx);
	var xlen = len -1;
	for (var i=0; i<=xlen; i++) {
		var idx = isAscLoop?i:(xlen-i);
		if (idx>=min && idx<max && (idx in varr))
			acc = fun(acc, varr[idx], idx);
	}
	return acc;
}

var mapFn = function(arr, fun){
    return loopFn(arr, 0, -1, [], function(acc, item, idx){
        acc.push(fun(item, idx));
        return acc;
    }, true);
}

var merge2Set = function(arr1, arr2, equalFn){
    return toSet([].concat(arr1, arr2), equalFn);
}

function toSet(arr, equalFn) {
	var fn = getEqualFn(equalFn);
	return compact(arr, function(item, acc){return !isFoundFn(item, acc, fn);});
}

function getEqualFn(equalFn){
	return isFn(equalFn)?equalFn:function(a, b) {
		return (isObject(a) &&("equal" in a) && isFn(a.equal))?a.equal(b):(a==b);
	};
}

function compact(arr, validFn) {
	var fn = isFn(validFn) ? validFn : selfFn;
	return loop(arr, [], function(acc, item) {
		if (fn(item, acc))
			acc.push(item);
		return acc;
	});
}
function isFoundFn(elem, arr, equalFn){
	return 0 <= indexOfFn(arr, function(item){
		return equalFn(elem, item);
	});
}
var loop = function(varr, acc0, fun){return loopFn(varr, 0, -1, acc0, fun, true);}
var selfFn = function (o){return o;}
var indexOfFn = function (arr, matchFn) {
	if(!arr || arr.length===0)
		return -1;
	var len = arr.length;
	for (var i=0; i<len; i++)
		if (matchFn(arr[i])) return i;
	return -1;
}
var inherit = function(){
	return loop(cvtToArray(arguments), {}, extendFn);
}
var extendFn = function(dst, src) {
	if (dst===null || dst===undefined)
		dst = {};
	for (var pname in src)
		dst[pname] = src[pname];
	return dst;
};
var cvtToArray = function (iterable) {
	if (!iterable)
		return [];
	if (iterable.toArray)
		return iterable.toArray();
	var results = [];
	var len = iterable.length;
	for (var i = 0; i < len; i++)
		results.push(iterable[i]);
	return results;
}
var isBoolean = isTypeFn("boolean"),
	isObject = isTypeFn("object"),
	isString = isTypeFn("string"),
	isNumber = isTypeFn("number"),
	isFn = isTypeFn ("function");
module.exports = {
	/**
    * 遍历树数据，寻找队形的节点数据
    * @param items - 递归的设备节点数据
    * @param fn - 寻找判断的回调函数
    */
	iterateTree: iterateTree,
	isUndefined: isUndefined,
	mapFn:mapFn,
	merge2Set:merge2Set,
	indexOfFn:indexOfFn,
	isBoolean : isBoolean,
	isObject : isObject,
	isString : isString,
	isNumber : isNumber,
	isFn : isFn,
    /**
    * 动态刷新树上某个节点
    * @param node - 待刷新的节点信息{id:"",name:""}
    * @param treeData - 树节结构数据
    * @param cbFn - 回调函数，刷新node的子节点
    */
    dealOnRefreshNode(node, treeData, cbFn) {
        //遍历树结构数据，找到要更新的节点
        iterateTree(treeData, function(item) {
            if (item.id === node.id) {
                //更新当前节点
                if (node.name) item.name = node.name;
                //刷新其子节点列表
                if (isFn(cbFn)) cbFn(item);
                return false;
            }
            return true;
        });
    },
	/**
    * 格式化服务返回的结点字段，以满足树组件上的需要
    * @param dataArr - 待格式化的数据列表，从数据库中来
    * @param format - 格式化函数，用来格式化数据列表中的每一项
    * @param node - 父节点，如果为null，则标记当前列表为根节点
    */
	formatData(dataArr, format, node){
		return mapFn(dataArr, function (item) {
			var isLeaf = format.isLeaf(item, node);
			//树节点的基本扩展
			var baseInfo = inherit(item, {
				id: item[format.id],
				pid: item[format.pid],
				name: item[format.name],
				isLeaf: isLeaf,
				isSelected: false,
				isFocused: false,
				isChecked: false,
				isDevicePerChecked: true,
				level: (!node ? 1 : node.level + 1),
				parentNodeId: (!node ? "" : node.id),
				parentNodeName: (!node ? "" : node.name)
			});
			return (isLeaf) ? inherit(baseInfo, {
				status: ""
			}) : inherit(baseInfo, {
				isRoot: !node,
				isOpen: false,
				children: [],
				childLoaded: false
			})
		});
	},
	/**
	 * 格式化子孙节点，用来和树上节点属性同步，以便回显
	 * @param dataArr - 待格式化的子孙节点数组
	 * @param format - 通用的格式化配置
	 * @returns {*} - 格式化后的数据对象
	 */
	formatDescendants(data, format){
		//树节点的基本扩展
		return inherit(data, {
			id: data[format.id],
			name: data[format.name],
			pid: data[format.pid]
		});
	},
	/**
	 * 获取节点的配置信息
	 * @param node - 当前节点数据对象
	 * @param ext - 配置内容【可以为字符串、也可以为函数】
	 * @returns {*} - 返回class字符串
	 */
	getStyle(node, ext){
		if(typeof ext === "function"){
			return ext(node);
		}
		return ext;
	},
	/**
	 * 已选列表提供的都是id数组，内部收到后转换成对象数组
	 * @param arr - 已选列表的id或者对象数组，如[id,id,***]或[{id:XXX, ...},{id:XXX, ...},***]
	 * @returns {*} - 对象数组
	 */
	extendSelectedData: function (arr) {
		if (!arr || arr.length === 0) return [];
		if (this.isString(arr[0])) {
			return mapFn(arr, function (item) {
				return {id: item};
			});
		}
		return [].concat(arr);
	},
	/**
	 * 找出两个数组之间的差异列表
	 * @param arr1 - 数组1
	 * @param arr2 - 数组2
	 * @returns {T[]} - 返回差异列表
	 */
	getDiffItem: function (arr1, arr2) {
		var isContain = function (arr, id) {
			for (var i = 0; i < arr.length; i++) {
				if(arr[i].id === id) return i;
			}
			return -1;
		}
		//由于vue监听的变量中添加了seter/geter，不能用indexOf判断，所以写的函数
		return (arr1.concat(arr2)).filter((item) => {
			return isContain(arr1, item.id) === -1 || isContain(arr2, item.id) === -1;
		});
	},
	debounceTimer: null,
	/**
	 *  函数防抖
	 *  函数节流的要点，也是需要一个setTimeout来辅助实现。延迟执行需要跑的代码。
	 *  如果方法多次触发，则把上次记录的延迟执行代码用clearTimeout清掉，重新开始。
	 *  如果计时完毕，没有方法进来访问触发，则执行代码。
	 * */
	debounce: function(callback,timer) {
		//清除已经存在的延迟执行定时器
		if (this.debounceTimer) clearTimeout(this.debounceTimer);
		this.debounceTimer = setTimeout(function () {
			callback && callback();
		}, timer || 500);
	},
	getNeedCheckedNodes: function (treeData, values) {
		let res = [];
		iterateTree(treeData, item => {
			let isIn = !!values.filter((m)=> { return m.id === item.id; }).length;
			if (isIn) {
				res.push(item);
			}
			return true;
		});
		return res;
	}
};