# 标签页
---
#### 属性
---
| 属性名         | 类型        | 默认值   | 描述                                                                                   |
| :------------- | :---------: | :------: | :------------------------------------------------------------------------------------- |
| v-model        | ` String `  | 无       | 组件值                                                                                 |
| disabled       | ` Boolean ` | false    | 是否禁用                                                                               |
| options        | ` Object `  | 无       | 配置对象                                                                               |
| options.size   | ` String `  | 'normal' | 尺寸(normal / small / mini)                                                            |
| options.manner | ` String `  | 无       | 风格，圆点(default)或按钮(button)                                                      |
| options.enum   | ` String `  | 无       | 枚举字典类型                                                                           |
| options.data   | ` String `  | 无       | 枚举项<br>数组 [{text : text1,value : value1}]<br>对象 {value1 : text1,value2 : text2} |
#### 事件
---
| 属性名 | 参数         | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

#### 示例
---
<template>
  <div class="demo-container">
		<xui-tabs v-model="v" :options="options" @change="changeHandle"></xui-tabs>
        <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {    
            v:'VEHICLE',
			options: {
                type: "text",
				data: [
					{
						text: "全部",
						value: "ALL"
					},
					{
						text: "车辆",
						value: "VEHICLE"
					},
					{
						text: "人体",
						value: "BODY"
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
``` html
    <xui-tabs v-model="v" :options="options"></xui-tabs>
    <p>value : {{v}}</p>
```
``` js
export default {
    data(){
        return {    
            v:'VEHICLE',
			options: {
                type: "text",
				data: [
					{
						text: "全部",
						value: "ALL"
					},
					{
						text: "车辆",
						value: "VEHICLE"
					},
					{
						text: "人体",
						value: "BODY"
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