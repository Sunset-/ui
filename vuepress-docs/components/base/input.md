# 输入框
> 支持前置后置插入文本或下拉框
---
#### 属性
---
| 属性名                 | 类型         | 默认值 | 描述                       |
| :--------------------- | :----------: | :----: | :------------------------- |
| v-model                | ` String `   | 无     | 组件值                     |
| disabled               | ` Boolean `  | false  | 是否禁用                   |
| options                | ` Object `   | 无     | 配置对象                   |
| options.type           | ` String `   | 无     | 类型 [text,password]       |
| options.placeholder    | ` String `   | 无     | 输入提示                   |
| options.clearable      | ` Boolean `  | 无     | 是否可清空                 |
| options.prepend        | ` String `   | 无     | 前置字符串或select配置对象 |
| options.append         | ` String `   | 无     | 后置字符串或select配置对象 |
| options.prependSpliter | ` String `   | 无     | 前置拼接分隔符             |
| options.appendSpliter  | ` String `   | 无     | 后置拼接分隔符             |
| options.appendClick    | ` Function ` | 无     | 后置点击回调"              |
#### 事件
---
| 属性名 | 参数         | 描述       |
| :----: | :----------: | :--------- |
| input  | value-当前值 | 输入事件   |  |
| change | value-当前值 | 值变更事件 |  |

#### 示例
---
<template>
  <div class="demo-container">
		<xui-input v-model="v" :options="options" @input="inputHandle"></xui-input>
        <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {    
            v:'',
			options: {
				type: "text",
				placeholder: "当前为空，请输入",
				clearable: true,
				prepend: {
					style : 'width:100px',
					placeholder: "请选择",
					data: {
						"1": "地址",
						"2": "电话"
					}
				},
				append: "点击发送",
				appendClick :(v,options)=>{
					this.options.append='已发送';
				}
			}
        }
    },
  methods : {
      inputHandle(v){
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
    <xui-input v-model="v" :options="options" @input="inputHandle"></xui-input>
    <p>value : {{v}}</p>
```
``` js
export default {
    data(){
        return {    
            v:'',
			options: {
				type: "text",
				placeholder: "当前为空，请输入",
				clearable: true,
				prepend: {
					style : 'width:100px',
					placeholder: "请选择",
					data: {
						"1": "地址",
						"2": "电话"
					}
				},
				append: "点击发送",
				appendClick :(v,options)=>{
					this.options.append='已发送';
				}
			}
        }
    },
  methods : {
      inputHandle(v){
            console.log(v)
      }
  }
}
```
