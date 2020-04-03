# 下拉选择框
---
#### 属性
---
| 属性名                  | 类型                                     | 默认值 | 描述                                                                                   |
| :---------------------- | :--------------------------------------: | :----: | :------------------------------------------------------------------------------------- |
| v-model                 | ` String `                               | 无     | 组件值                                                                                 |
| disabled                | ` Boolean `                              | false  | 是否禁用                                                                               |
| options                 | ` Object `                               | 无     | 配置对象                                                                               |
| options.placeholder     | ` String `                               | 无     | 输入提示                                                                               |
| options.clearable       | ` Boolean `                              | true   | 可清空单选                                                                             |
| options.multiple        | ` Boolean `                              | false  | 可多选                                                                                 |
| options.filter          | ` Boolean`/<br>`Function(item,keyword) ` | false  | 可输入过滤<br>默认规则为text或value包含输入值                                          |
| options.spliter         | ` String `                               | ','    | 多选时，多值拼接分隔符，默认逗号                                                       |
| options.enum            | ` String `                               | 无     | 枚举字典类型                                                                           |
| options.data            | ` String `                               | 无     | 枚举项<br>数组 [{text : text1,value : value1}]<br>对象 {value1 : text1,value2 : text2} |
| options.disabledOptions | ` Function(option) `                     | 无     | 禁选项条件函数                                                                         |
#### 事件
---
| 属性名 | 参数         | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

#### 示例
---
<template>
  <div class="demo-container">
		<xui-select v-model="v" :options="options"></xui-select>
		<p>value : {{v}}</p>
  </div>
</template>

``` html
    <xui-select v-model="v" :options="options"></xui-select>
    <p>value : {{v}}</p>
```
``` js
export default {
    data(){
        return {    
            v:'shanghai',
			options: {
				multiple: false,
				clearable: true,
				filter: false,
				placeholder: "请选择一个城市",
				data: [
					{
						text: "北京",
						value: "beijing"
					},
					{
						text: "上海",
						value: "shanghai"
					},
					{
						text: "深圳",
						value: "shenzhen"
					},
					{
						text: "广州",
						value: "guangzhou"
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
```
---
<template>
  <div class="demo-container">
		多选 <xui-select v-model="v1" :options="options1"></xui-select>
		<p>value : {{v1}}</p>
		搜索 <xui-select v-model="v2" :options="options2"></xui-select>
		<p>value : {{v2}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {  
            v:'shanghai',   
            v1:'', 
            v2:'', 
            v3:'',
			options: {
				multiple: false,
				clearable: true,
				filter: false,
				placeholder: "请选择一个城市",
				data: [
					{
						text: "北京",
						value: "beijing"
					},
					{
						text: "上海",
						value: "shanghai"
					},
					{
						text: "深圳",
						value: "shenzhen"
					},
					{
						text: "广州",
						value: "guangzhou"
					}
				]
			},
			options1: {
				multiple: true,
				clearable: true,
				filter: false,
				placeholder: "请选择一个城市",
				data: [
					{
						text: "北京",
						value: "beijing"
					},
					{
						text: "上海",
						value: "shanghai"
					},
					{
						text: "深圳",
						value: "shenzhen"
					},
					{
						text: "广州",
						value: "guangzhou"
					}
				]
			},options2: {
				multiple: true,
				clearable: true,
				filter: true,
				placeholder: "请选择一个城市",
				data: [
					{
						text: "北京",
						value: "beijing"
					},
					{
						text: "上海",
						value: "shanghai"
					},
					{
						text: "深圳",
						value: "shenzhen"
					},
					{
						text: "广州",
						value: "guangzhou"
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