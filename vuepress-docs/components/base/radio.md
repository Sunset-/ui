# 单选框
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
		<xui-radio v-model="v" :options="options" @change="changeHandle"></xui-radio>
        <p>value : {{v}}</p>
  </div>
</template>


<template>
  <div class="demo-container">
    <span style="display:inline-block;vertical-align:middle;">按钮风格：</span><xui-radio v-model="v" :options="optionsOther" @change="changeHandle"></xui-radio>
    <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {    
            v:'2',
			options: {
				disabled: false,
				size:"mini",
				data: {
                    '1' : '男',
                    '2' : '女',
                    '3' : '未知'
                }
            },
            optionsOther: {
				disabled: false,
                size:"mini",
                manner : 'button',
				data: {
                    '1' : '男',
                    '2' : '女',
                    '3' : '未知'
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
</script>
``` html
	<xui-radio v-model="v" :options="options" @change="change"></xui-radio>
    <p>value : {{v}}</p>
```
``` html
    <span>按钮风格：</span>
    <xui-radio v-model="v" :options="optionsOther" @change="changeHandle"></xui-radio>
    <p>value : {{v}}</p>
```
``` js
export default {
    data(){
        return {    
            v:'',
			options: {
				disabled: false,
				max:2,
				size:"small",
				data: {
                    '1' : '男',
                    '2' : '女',
                    '3' : '未知'
                }
            },
            optionsOther: {
				disabled: false,
                size:"mini",
                manner : 'button',
				data: {
                    '1' : '男',
                    '2' : '女',
                    '3' : '未知'
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

