# 数据表格

> 基于 datapage,提供表格数据展示  
> 支持通过命名空间从 record 中取值  
> 支持对值的格式化处理  
> 支持列头，单元格的样式自定义  
> 支持操作栏声明  
> 支持表格数据勾选,支持跨页勾选  
> 支持子表格嵌套

## 插槽

| 插槽名   | 插槽作用域属性                                                    | 描述                 |
| :------: | :---------------------------------------------------------------- | :------------------- |
| subtable | data `Object / Array` - 子表格数据<br>parent`Object` - 父条目数据 | 子表格               |
| empty    | 无                                                                | 数据为空时，提示信息 |

## 属性

| 属性名                         | 类型                 | 默认值   | 描述                                                                                             |
| :----------------------------- | :------------------: | :------: | :----------------------------------------------------------------------------------------------- |
| options                        | `Object`             | 无       | 配置对象，**包含数据分页的所有配置**                                                             |
| options.columns                | `Array[Object]`      | 无       | 表格列配置                                                                                       |
| options.columns[x].title       | `String`             | 无       | 列标题                                                                                           |
| options.columns[x].name        | `String`             | 无       | 列标识，从记录中取值，支持多级取值，如'person.name'                                              |
| options.columns[x].width       | `Number`             | 无       | 列宽, 当表头固定时，调整此数值使表头表体列对齐（其中一列可不设置）                               |
| options.columns[x].align       | `String`             | 'left'   | 单元格文字水平排列，left/center/right                                                            |
| options.columns[x].headAlign   | `String`             | 'center' | 列头文字水平排列，left/center/right                                                              |
| options.columns[x].enum        | `String`             | 无       | 字典类型，需预装字典                                                                             |
| options.columns[x].format      | `String / Function`  | 无       | 格式化函数<br>内置 DATETIEM,DATE / Function(value,record,column,parent,rowIndex,translatedValue) |
| options.columns[x].style       | `String / Object`    | 无       | 单元格样式,支持 String / Function(value,record,column,parent,rowIndex)                           |
| options.columns[x].headStyle   | `String / Object`    | 无       | 表头样式                                                                                         |
| options.columns[x].toolbar     | `Object`             | 无       | 设置此属性后，该内容变为操作栏，配置见操作栏配置                                                 |
| options.columns[x].headToolbar | `Object`             | 无       | 设置此属性后，表头添加操作栏，配置见操作栏配置                                                   |
| options.fixedHead              | `Boolean`            | false    | 是否固定表头                                                                                     |
| options.bodyHeight             | `Number`             | 无       | 固定表头时，设置表格体的高度                                                                     |
| options.children               | `Function / Boolean` | false    | 子表格数据获取回调函数 Function(parent)                                                          |
| options.expandSingle           | `Boolean`            | false    | 子表格同时仅展开一个                                                                             |
| options.checked                | `Object`             | 无       | 勾选配置                                                                                         |
| options.checked.key            | `String`             | 'id'     | 数据条目中的主键名，用于区分数据                                                                 |
| options.clickRecord            | `Function`           | 无       | 数据条目点击事件回调 Function(record)                                                            |
| options.loopRender             | `Number`             | 无       | 配置循环渲染 dom，用于前端展示动态变化的数据，单位毫秒                                           |

## 方法

| 方法名     | 参数                                                                  | 返回值 | 描述         |
| :--------- | :-------------------------------------------------------------------- | :----- | :----------- |
| search     | filter `Object` - 搜索条件对象                                        | 无     | 搜索加载数据 |
| refresh    | pageNumber `Number` - 页码(为空时刷新当前页)                          | 无     | 刷新         |
| clear      | 无                                                                    | 无     | 清空         |
| setData    | data `Object / Array` - (结构同 datasource 返回)                      | 无     | 设置静态数据 |
| setOptions | options `Object` - 配置对象<br> isReload `Boolean` - 是否重新加载数据 | 无     | 设置配置属性 |

## 事件

| 属性名       | 参数                                                          | 描述     |
| :----------- | :------------------------------------------------------------ | :------- |
| output       | list `Array` - 当前分页数据列表<br> total `Number` - 数据总数 | 数据输出 |
| checked      | checklist `Array` - 勾选数据列表                              | 数据勾选 |
| click-record | record `Object` - 点击条目数据对象                            | 点击条目 |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">

<style>
    .custom-item{
        border:1px solid #dedede;
        width:200px;
        margin:5px 0px;
        padding:2px;
    }
    .checked-records{
        padding:10px 0px;
    }
    .checked-records span{
        display:inline-block;
        padding:5px 10px;
        border-radius:2px;
        color:#FFF;
        background:#40a4ff;
        margin:5px;
    }
	.demo-container table{
		display:table;
	}
</style>
<template>
  <div class="demo-container">
    <div class="checked-records">
        <div>勾选节点： <span v-for="(item,index) in checkedItems">{{item.name}}</span></div>
    </div>
    <xui-table ref="table" :options="options" @checked="onChecked" @click-record="clickHandle">
        <!-- 子表格 -->
        <template slot="subtable" scope="props">
            <xui-table ref="table" :options="subOptions" :data="props.data" @checked="onChecked" @click-record="clickHandle">
            </xui-table>
        </template>
        <div slot="empty" style="padding:30px 0px;text-align:center;">
            无数据
        </div>
    </xui-table>
  </div>
</template>
<script>
var demoData = [];
for(var i=1;i<=35;i++){
    demoData.push({
        id : `id-${i}`,
        name : `name-${i}`,
        sex : Math.random()>0.5?'1':'2',
        age : i
    });
}
export default {
	data() {
		return {
			flag: false,
			checkedItems: [],
			options: {
				checked: {
					key: "id"
				},
				columns: [
					{
						title: "序号",
						name: "name",
						style:"text-align:center;width:50px",
						format(v,record,col,parent,index){
                            return index+1;
                        }
					},
					{
						title: "姓名",
						name: "name",
						align: "center"
					},
					{
						title: "性别",
						name: "sex",
                        align:'center',
						format(v) {
							return {
                                '1' : '<font color="#09c">男</font>',
                                '2' : '<font color="red">女</font>',
                            }[v];
						}
					},
					{
						title: "年龄",
						name: "age",
						style:"text-align:center;min-width:50px",
						format(v) {
							return `<p title="${v}">${v}</p>`
						}
					},
					{
						title: "操作栏",
						style: "width:220px;text-align:center;",
						headToolbar: {
							size: "mini",
							tools: [
								{
									label: "修改顺序",
                                    color : 'primary',
                                    premise:()=>{
                                        return !this.flag;
                                    },
									operate: () => {
										this.flag = !this.flag;
									}
								},
								{
                                    label: "保存",
                                    color : 'success',
                                    premise:()=>{
                                        return this.flag;
                                    },
									operate: () => {
										this.flag = !this.flag;
									}
								},
								{
                                    label: "取消",
                                    premise:()=>{
                                        return this.flag;
                                    },
									operate: () => {
										this.flag = !this.flag;
									}
								}
							]
						},
						toolbar: {
							size: "mini",
							tools: [
								{
									title: "变更状态",
									type: "switch",
                                    style: "color:yellowgreen;",
                                    premise:()=>{
                                        return !this.flag;
                                    },
									disabled(record) {
										return record.age%3==0;
									},
									operate: (record,v) => {
                                        alert(`变更状态：${record.name} -> ${v}`)
										return new Promise(() => {
											// throw new Error();
										});
									}
								},
								{
									title: "地图定位",
									color: "success",
									icon: "el-icon-location",
                                    style: "color:yellowgreen;",
                                    premise:()=>{
                                        return !this.flag;
                                    },
									operate: record => {
										alert(`地图定位:${record.name}`);
									}
								},
								{
									label: "修改",
									icon: "el-icon-edit",
                                    color: "warning",
                                    premise:()=>{
                                        return !this.flag;
                                    },
									operate: record => {
										alert(`修改:${record.name}`);
									}
								},
								{
									label: "上移",
                                    color: "primary",
                                    premise:()=>{
                                        return this.flag;
                                    },
									operate: record => {
										alert(`上移:${record.name}`);
									}
								},
								{
									label: "下移",
                                    color: "primary",
                                    premise:()=>{
                                        return this.flag;
                                    },
									operate: record => {
										alert(`下移:${record.name}`);
									}
								}
							]
						}
					}
				],
				children(item) {
					return [{ name: item.name + "子列表1" }, { name: item.name + "子列表2" }];
				},
				pageNumberStart: 0,
				pageSize: 5,
				localPageSize: 5,
				format: {
					list: "data",
					count: "totalCount",
					pageSize: "pageSize",
					currentPage: "pageNumber"
				},
				datasource: filter => {
                    filter._timestamp = Date.now();
                    console.log('请求：'+JSON.stringify(filter))
					return new Promise(resolve => {
						setTimeout(() => {
							resolve({
								totalCount: demoData.length,
								data: demoData.slice(
									filter.pageSize * filter.pageNumber,
									filter.pageSize * filter.pageNumber + filter.pageSize
								)
							});
						}, 200);
					});
                }
            },
            // 子表格配置
			subOptions: {
				columns: [
					{
						title: "姓名",
						name: "name",
						align: "center",
						style: function(v) {
							return +v > 3 ? "color:red;" : "";
						}
					},
					{
						title: "年龄",
						name: "age",
						format(v, record, col, parent) {
							return !!parent;
						}
					},
					{
						title: "操作栏",
						style: "width:220px;text-align:center;",
						toolbar: {
							size: "mini",
							tools: [
								{
									label: "删除",
									color: "danger",
									operate: record => {
										alert(record.name);
									}
								}
							]
						}
					}
				],
				pageNumberStart: 0,
				pageSize: 5,
				localPageSize: 5,
				lazy: true,
				format: {
					list: "",
					count: "length",
					pageSize: "pageSize",
					currentPage: "pageNumber"
				}
			}
		};
	},
	methods: {
		clickHandle(item) {
			console.log('click:'+item.name);
		},
		onChecked(checkedItems) {
			this.checkedItems = checkedItems;
		}
	}
};
</script>
</script>
