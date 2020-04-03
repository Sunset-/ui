# 瀑布流

> 单列或多列瀑布流交互，滚动加载更多数据  
> 支持超出可视范围外的元素释放资源

## 插槽

| 插槽名  | 插槽作用域属性                                              | 描述                 |
| :-----: | :---------------------------------------------------------- | :------------------- |
| default | `item`:单条数据,`visible`:条目是否在视窗内,`index`:数据索引 | 单条内容模板         |
|  empty  | 无                                                          | 数据为空时，提示信息 |

## 属性

| 属性名                  |        类型        |  默认值  | 描述                                                                                                                                    |
| :---------------------- | :----------------: | :------: | :-------------------------------------------------------------------------------------------------------------------------------------- |
| options                 |      `Object`      |    无    | 配置对象                                                                                                                                |
| options.preloadHeight   |      `Number`      | 'normal' | 预加载底部像素高度                                                                                                                      |
| options.lazy            |     `Boolean`      |  false   | 是否懒加载                                                                                                                              |
| options.format          |      `Object`      |    无    | 数据映射关系                                                                                                                            |
| options.format.list     |      `String`      |   list   | 数据返回中列表数据的命名空间<br/>可用多级取值（'data.list'）                                                                            |
| options.format.count    |      `String`      |  count   | 数据返回中数据总量的命名空间<br/>可用多级取值（'data.count'）                                                                           |
| options.datasource      |     `Function`     |    无    | 数据源回调<br/>参数为 ( 搜索条件 filter , 全数据列表 list )                                                                             |
| options.release         | `Boolean / Object` |  false   | 是否释放资源,true 为释放资源，也可配置为对象,用以计算可视区域:<br/> {container: {width:1600,height:700},piece: {width:130,height:130} } |
| options.windowMargin    |      `Number`      |    无    | 视窗外边距像素高度<br/>(超出视窗外边距 visible 为 false，用于释放资源)                                                                  |
| options.debug           |     `Boolean`      |    无    | 性能调优开关                                                                                                                            |
| options.throttleTime    |      `Number`      |    无    | 性能调优：节流时间，默认 500ms                                                                                                          |
| options.debounceTime    |      `Number`      |    无    | 性能调优：防抖时间，默认 100ms                                                                                                          |
| options.pageMode        |     `Boolean`      |  false   | 支持传统分页模式切换                                                                                                                    |
| options.datapageOptions |      `Object`      |    无    | 同数据分页配置，无需配置 datasource，与当前瀑布流共用                                                                                   |

## 方法

| 方法名      | 参数                                      | 返回值 | 描述         |
| :---------- | :---------------------------------------- | :----- | :----------- |
| search      | `filter`- 搜索条件对象                    | 无     | 搜索加载数据 |
| clear       | 无                                        | 无     | 清空         |
| setData     | `data` - 静态数据(结构同 datasource 返回) | 无     | 设置数据     |
| scrollToTop | 无                                        | 无     | 回到顶部     |
| changeMode  | `mode` - 模式名称`WATERFALL`/`TABLE`      | 无     | 切换展示模式 |

## 事件

| 属性名 | 参数                                           | 描述     |
| :----- | :--------------------------------------------- | :------- |
| output | `list` - 当前分页数据列表 , `total` - 数据总数 | 数据输出 |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">

<style>
.piece{
    border:1px solid #ccc;
    width:110px;
    height:110px;
    display:inline-block;
    margin:5px;
}
</style>
<template>
    <div style="margin-bottom:20px;">
        <xui-button color="primary" @click="search">搜索</xui-button>
        <xui-button color="warning" @click="clear">清空</xui-button>
        <xui-button color="info" @click="setData">设置静态数据</xui-button>
        <xui-button color="info" @click="changeMode">切换显示模式</xui-button>
        <xui-button color="info" @click="scrollToTop">回到顶部</xui-button>
        <xui-waterfall ref="waterfall" style="height:700px;" :options="options">
            <div class="piece" slot-scope="props" :item="props.item" :visible="props.visible" :index="props.index">
                {{props.item.text}}
                <img v-if="props.visible" width="100%" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523423248279&di=493bc72e3e45e82ec5875a7898bc714c&imgtype=0&src=http%3A%2F%2Fimg1.cache.netease.com%2Fcatchpic%2FC%2FC7%2FC722DF5405D1F1BB68771B7A163F65C5.jpg" alt="">
            </div>
        </xui-waterfall>
    </div>
</template>
<script>


var demoData = [];

for (var i = 0; i < 1000; i++) {
	demoData.push({ text: i + 1 });
}

export default {
	methods: {
		search() {
			this.$refs.waterfall.search({
				keyword: "一个搜索条件"
			});
		},
		clear() {
			this.$refs.waterfall.clear();
		},
		setData() {
			var items = [];
			for (var i = 0; i < 200; i++) {
				items.push({ release: false, text: 0 });
			}
			this.$refs.waterfall.setData({
				list: items,
				total: 500
			});
		},
		changeMode(){
			this.mode = this.mode=="WATERFALL"?"TABLE":"WATERFALL";
			this.$refs.waterfall.changeMode(this.mode);
		},
		scrollToTop(){
			this.$refs.waterfall.scrollToTop();
		}
	},
	data() {
		return {
			mode : "WATERFALL",
			options: {
				windowMargin: -100,//正常应为正整数，此处负数为了看到释放资源的效果
				preloadHeight: 100,
				release: true,
				debug: true,
				lazy: true,
				pageMode : true,
				scrollOptions: {
					innerStyle: "padding:30px;"
				},
				format: {
					list: "list",
					count: "total"
				},
				datasource(filter, list) {
					console.log("------  请求");
					return new Promise(resolve => {
						setTimeout(() => {
							resolve({
								list: demoData.slice(list.length, list.length + 100),
								total: demoData.length
							});
						}, 300);
					});
				},
				datapageOptions : {
					pageSize : 21,
					preload : 2
				}
			}
		};
	}
};
</script>
</script>
