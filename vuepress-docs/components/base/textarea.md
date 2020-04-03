# 文本域
---
#### 属性
---
| 属性名              | 类型                 | 默认值 | 描述                                    |
| :------------------ | :------------------: | :----: | :-------------------------------------- |
| v-model             | ` String `           | 无     | 组件值                                  |
| disabled            | ` Boolean `          | false  | 是否禁用                                |
| options             | ` Object `           | 无     | 配置对象                                |
| options.maxlength   | ` Number `           | 无     | 最大输入长度                            |
| options.rows        | ` Number `           | 无     | 行数，默认3                             |
| options.autosize    | ` Boolean / Object ` | 无     | 高度随内容自适应,{minRows:3,maxRows:10} |
| options.placeholder | ` String `           | 无     | 输入提示                                |
| options.clearable   | ` Boolean `          | 无     | 是否可清空                              |
| options.lengthTip   | ` Boolean `          | 无     | 输入字数提示                            |
#### 事件
---
| 属性名 | 参数         | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

#### 示例
---
<template>
  <div class="demo-container">
		<xui-textarea v-model="v" :options="options" @change="changeHandle"></xui-textarea>
        <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {    
            v:'123',
            options:{
                placeholder:"请输入",
                rows: 5,
				maxlength: 200,
				lengthTip: true
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
    <xui-textarea v-model="v" :options="options" @change="changeHandle"></xui-textarea>
    <p>value : {{v}}</p>
```
``` js
export default {
    data(){
        return {    
            v:'123',
            options:{
                placeholder:"请输入",
                rows: 5,
				maxlength: 200,
				lengthTip: true
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
