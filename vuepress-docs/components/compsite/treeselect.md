# 树形下拉框
---
#### 属性
---
| 属性名              | 类型                 | 默认值    | 描述                                                       |
| :------------------ | :------------------: | :-------: | :--------------------------------------------------------- |
| v-model             | ` String `           | 无        | 组件值                                                     |
| disabled            | ` Boolean `          | false     | 是否禁用                                                   |
| options             | ` Object `           | 无        | 配置对象                                                   |
| options.multiple    | `Boolean`            | false     | 是否可多选                                                 |
| options.autoExpand  | `Boolean`            | false     | 是否初次自动展开所有树节点                                 |
| options.clearable   | `Boolean`            | false     | 是否可清空                                                 |
| options.enum        | `String`             | 无        | 字典类型（需预装字典，字典项中parent为上级value）          |
| options.placeholder | `String`             | 无        | 输入提示                                                   |
| options.spliter     | `String`             | ','       | 值分隔符，默认                                             |
| options.filter      | `Boolean / Function` | false     | 过滤函数,设置为true时，默认用text,value,keywords做包含测试 |
| options.treeOptions | `Object`             | ztree配置 | 自定义树配置，见stree组件                                  |
| options.treeNodes   | `Array / Promise`    | 无        | 自定义树节点，见stree组件                                  |
#### 事件
---
| 属性名 | 参数         | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

#### 示例
---
<template>
  <div class="demo-container">
		<xui-treeselect v-model="v" :options="options"></xui-treeselect>
        <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {    
            v:'yy,hx',
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
<style>
.demo-container button{
    margin-right:10px;
}
</style>
``` html
    <xui-checkbox v-model="v" :options="options" @change="changeHandle"></xui-checkbox>
    <p>value : {{v}}</p>
```
``` js
export default {
    data(){
        return {    
            v:'yy,hx',
			options: {
				disabled: false,
				max:2,
				size:"small",
				data: {
                    'zq' : '足球',
                    'yy' : '游泳',
                    'ps' : '爬山',
                    'hx' : '滑雪'
                },
				errorHandle(v){
                    alert(v);
				}
			}
        }
    },
  methods : {
      changeHandle(v){
            console.log(v)
      }
  }
}
```
