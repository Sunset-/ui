# 视窗

> 针对大数据量的展现，实现视窗渲染，提高性能

## 属性

| 属性名                  |       类型        | 默认值 | 描述                             |
| :---------------------- | :---------------: | :----: | :------------------------------- |
| options                 |     `Object`      |   无   | 配置对象                         |
| options.containerHeight | `Number/Function` |   无   | 容器的高度                       |
| options.recordHeight    | `Number/Function` |   无   | 单个条目的高度                   |
| options.template        |    `Function`     |   无   | 单个条目的渲染函数               |
| options.empty           | `String/Function` |   无   | 无数据时的渲染函数               |
| options.operate         |    `Function`     |   无   | 点击操作回调 Function(record,ev) |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<style>
</style>
<template>
  <div class="demo-container">
  		<p>
        	<xui-button color="primary" @click="setData">添加数据</xui-button>
        	<xui-button color="primary" @click="clear">清空</xui-button>
		</p>
		<xui-viewport ref="viewport" style="background:#FFF;border:1px solid #ccc;" :options="viewportOptions"></xui-viewport>
  </div>
</template>
<script>
export default {
   	data() {
		return {
			viewportOptions: {
				containerHeight() {
					return 400;//容器高度
				},
				recordHeight: 35,//条目高度
				template(record) {//条目渲染函数
					return `<div style="border:1px solid red;height:35px;box-sizing:border-box;">${
						record.name
					}<button type="button" class="remove">删除</button></div>`;
				},
				empty: "<div>暂无数据</div>",//空渲染函数
				operate: (record, ev) => {//操作
					if (ev.target.className == "remove") {
						this.$refs.viewport.removeRecord(record);
					}
				}
			}
		};
	},
	methods : {
		setData(){
			var demoData = [];
			for (var i = 0; i < 10000; i++) {
				demoData.push({
					name: "name-" + i,
					id: i
				});
			}
			this.$refs.viewport.setData(demoData);
		},
		clear(){
			this.$refs.viewport.clear();
		}
	}
}
</script>
</script>
