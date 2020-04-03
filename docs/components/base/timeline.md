# 时间轴

> 鱼骨时间轴，可自定义节点内容及时间轴样式

## 插槽

| 插槽名  | 插槽作用域属性                  | 描述         |
| :-----: | :------------------------------ | :----------- |
| default | item:单条数据<br>index:数据索引 | 节点内容模板 |

## 属性

| 属性名  |        类型         | 默认值 | 描述                                                                     |
| :------ | :-----------------: | :----: | :----------------------------------------------------------------------- |
| data    |      `Boolean`      | false  | 加载状态标志                                                             |
| color   | `String / Function` |   无   | 进度条颜色,支持<br>颜色值:#09c,red...<br>函数:Function(item,index,items) |
| options |      `Object`       |   无   | 配置对象，可包含上述值                                                   |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<template>
  <div class="demo-container">
    <xui-timeline :data="items" :color="color">
        <template scope="props">
            <div scope="props" style="padding:10px;">
                <div><b>{{props.item.time}}</b></div>
                <div>{{props.item.title}}</div>
                <div><i>{{props.item.desc}}</i></div>
            </div>
        </template>
    </xui-timeline>
  </div>
</template>
<script>
export default {
	data() {
		return {
			items: [{
                time : '2017',
                title : '立项',
                desc : '医疗项目'
            },{
                time : '2018',
                title : '测试',
                desc : '医疗项目'
            },{
                time : '2019',
                title : '上市',
                desc : '医疗项目'
            }],
			color(item, index,items) {
				return index == items.length - 1 ? "#8fc31f" : "#6fbaff" ;
			}
		};
	}
};
</script>
</script>
