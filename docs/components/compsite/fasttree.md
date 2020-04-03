# 高性能树

> 支持同步加载、异步加载、静态数据  
> 支持视窗渲染，提高渲染性能，可支持十万级节点渲染

## 属性

| 属性名                |        类型        | 默认值  | 描述                             |
| :-------------------- | :----------------: | :-----: | :------------------------------- |
| rootId                |      `String`      |   无    | 根节点父 id                      |
| key                   |      `Object`      |   无    | 字段标识                         |
| key.id                |      `String`      |   无    | 字段标识:节点 id                 |
| key.parentId          |      `String`      |   无    | 字段标识:父节点 id               |
| key.name              |      `String`      |   无    | 字段标识:节点名称                |
| key.title             |      `String`      |   无    | 字段标识 :节点 title             |
| isParent              |     `Function`     |   无    | 是否父节点，返回 true 时可展开   |
| template              |     `Function`     |   无    | 节点渲染方法，返回 dom           |
| datasource            |     `Function`     |   无    | 数据源，返回当前节点的直接子节点 |
| search                |     `Function`     |   无    | 异步搜索方法                     |
| loadPosterity         |     `Function`     |   无    | 获取子孙节点                     |
| loadAncestors         |     `Function`     |   无    | 获取祖先节点                     |
| toolbar               |      `Array`       |   无    | 节点操作工具栏                   |
| tips                  |     `Function`     |   无    | 节点提示                         |
| check                 |      `Object`      |   无    | 勾选配置                         |
| check.enable          | `Boolean/Function` |   无    | 是否支持勾选                     |
| check.type            |      `String`      |   无    | 勾选方式：multiple,single        |
| check.cascade         |      `String`      |   "C"   | 级联勾选方案                     |
| focus                 |      `Object`      |   无    | 选中配置                         |
| select.enable          |     `Boolean`      |   无    | 是否支持选中                     |
| select.multiple        | `Boolean/Function` |   无    | 是否支持多选                     |
| select.focusOn         |      `String`      | "click" | 选中事件：click,dbclick          |
| isAutoExpandRoot      |     `Boolean`      |  false  | 是否自动展开根节点               |
| containerHeight       |      `Number`      |  false  | 容器高度                         |
| nodeHeight            |      `Number`      |         | 节点高度，如未配置则自动计算     |
| isExpandOnClickNode   |     `Boolean`      |  false  | 是否支持单击展开                 |
| isExpandOnDbClickNode |     `Boolean`      |  false  | 是否支持双击展开                 |
| isExpandSingleInLevel |     `Boolean`      |  false  | 是否同级同时仅展开一个           |
| isEnableDragger       |     `Boolean`      |  false  | 是否支持拖拽                     |
| isStrongCheckedMode   |     `Boolean`      |  false  | 是否支持强弱勾选                 |
| isExcludeCheckedMode  |     `Boolean`      |  false  | 是否支持排除勾选                 |
| levelSpace            |      `Number`      |   20    | 层级缩进宽度                     |

## 方法

| 方法名             | 参数                                                                                                | 返回值 | 描述                       |
| :----------------- | :-------------------------------------------------------------------------------------------------- | :----- | :------------------------- |
| init               | 无                                                                                                  | 无     | 初始化                     |
| refresh            | 无                                                                                                  | 无     | 刷新，重新渲染             |
| setNodes           | nodes `Array` - 节点数组                                                                            | 无     | 设置节点数据               |
| search             | keyword `String` - 关键字<br> force `Boolean` - 强制请求搜索                                        | 无     | 搜索过滤                   |
| removeNode         | id `String` - 节点 id                                                                               | 无     | 删除节点                   |
| refreshNode        | node `Object` - 节点数据                                                                            | 无     | 更新节点数据               |
| expandNode         | id `String` - 节点 id                                                                               | 无     | 展开节点                   |
| expandCascadeNodes | ids `Array` - 祖先节点 ids<br>focusId `String` - 焦点节点 id                                        | 无     | 级联展开节点并选中焦点节点 |
| setFocus           | `同setSelected`                                                                                     | 无     | `selectNode`               |
| selectNode         | id `String` - 节点 id<br> flag `Boolean` - 是否选中                                                 | 无     | 设置节点焦点状态           |
| clearSelected      | 无                                                                                                  | 无     | 清空选中状态               |
| checkNodes         | ids `Array[String]` - 选中节点 ids<br> excludeIds `Array[String]` - 排除节点 ids                    | 无     | 批量选中节点               |
| checkNode          | id `String` - 节点 id<br>flag `Boolean` - 是否选中<br>slient `Boolean` - 是否静默选中（不触发事件） | 无     | 选中节点                   |
| clearChecked       | 无                                                                                                  | 无     | 清空选中状态               |
| filterNode         | filter `Function(node)` - 渲染过滤函数                                                              | 无     | 过滤渲染                   |

## 事件

| 属性名        |     参数     | 描述       |
| :------------ | :----------: | :--------- |
| init          |      无      | 初始化完成 |
| selected-node |   选中节点   | 选中,祖先节点列表       |
| click-node    |   点击节点   | 点击节点,祖先节点列表   |
| dbclick-node  |   双击节点   | 双击节点,祖先节点列表   |
| checked       | 勾选节点数组 | 勾选       |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
  <template>
    <div class="aaa">
        <xui-fasttree ref="tree" class="fasttree-demo" :options="options" @click-node="selected" style="height:200px;"></xui-fasttree>
    </div>
  </template>

  <script>
    module.exports = {
        data(){
            return {
                options: {
				rootId: "0",
				key: {
					id: "id",
					parentId: "parentId",
					name: "name",
					title: "name"
				},
				check: {
					type: "multiple"
				},
                nodeHeight: 30,
                isExpandOnDbClickNode : true,
				template(node) {
					return `<div class="demo-node" style="height:30px;"><i class="xui-icon xui-icon-tasklist_fill"></i><span>${
						node.name
					}</span></div>`;
				},
				callbacks: {
					onClickNode(node) {
						//alert(node.name);
					}
				},
				isParent(node){
					return true;
				},
				datasource: parentNode => {
					if (!parentNode) {
						return [
							{
								id: `1`,
								parentId: "0",
								name: `node_1`
							}
						];
					} else {
						var nodes = [];
						for (var j = 1; j <= 100; j++) {
							nodes.push({
								id: `${parentNode.id}_${j}`,
								parentId: parentNode.id,
								name: `node_${parentNode.id}_${j}`
							});
						}
						return nodes;
					}
				}
			},
            }
        },
        methods : {
            selected(){
            }
        }
    }
  </script>
</script>
