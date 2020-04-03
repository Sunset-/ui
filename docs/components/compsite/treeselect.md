# 树形下拉框

## 属性

| 属性名              |         类型         |   默认值   | 描述                                                           |
| :------------------ | :------------------: | :--------: | :------------------------------------------------------------- |
| v-model             |       `String`       |     无     | 组件值                                                         |
| disabled            |      `Boolean`       |   false    | 是否禁用                                                       |
| options             |       `Object`       |     无     | 配置对象                                                       |
| options.multiple    |      `Boolean`       |   false    | 是否可多选                                                     |
| options.autoExpand  |      `Boolean`       |   false    | 是否初次自动展开所有树节点                                     |
| options.clearable   |      `Boolean`       |   false    | 是否可清空                                                     |
| options.enum        |       `String`       |     无     | 字典类型（需预装字典，字典项中 parent 为上级 value）           |
| options.placeholder |       `String`       |     无     | 输入提示                                                       |
| options.spliter     |       `String`       |    ','     | 值分隔符，默认                                                 |
| options.filter      | `Boolean / Function` |   false    | 过滤函数,设置为 true 时，默认用 text,value,keywords 做包含测试 |
| options.treeOptions |       `Object`       | ztree 配置 | 自定义树配置，见 stree 组件                                    |
| options.treeNodes   |  `Array / Promise`   |     无     | 自定义树节点，见 stree 组件                                    |

## 事件

| 属性名 |     参数     | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<template>
	<div class="demo-container" style="height:300px;">
		<xui-treeselect v-model="v" :options="options"></xui-treeselect>
        <p>value : {{v}}</p>
	</div>
</template>
<script>
export default {
    data(){
        return {
            v:'444',
			options: {
				multiple: false,
				autoExpand: true,
				nocheck(item) {
					return false;
				},
				template(item) {
					return (
						item &&
						item.parents
							.map(item => item.text)
							.concat([item.text])
							.join("-")
					);
                },
                treeNodes :[
					{
						type: "Org",
						parent: null,
						value: "111",
						text: "111"
					},
					{
						type: "Org",
						parent: null,
						value: "222",
						text: "222"
					},
					{
						type: "Org",
						parent: "111",
						value: "333",
						text: "333"
					},
					{
						type: "Org",
						parent: "222",
						value: "444",
						text: "444"
					},
					{
						type: "Org",
						parent: "222",
						value: "555",
						text: "555"
					},
					{
						type: "Org",
						parent: "555",
						value: "777",
						text: "777"
					}
				]
			}
        }
    },
  methods : {
      changeHandle(v){
            console.log(v)
      }
  }
}
</script>
</script>
