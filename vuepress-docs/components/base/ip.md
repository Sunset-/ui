# IP地址
> IPV4地址便捷输入框
---
#### 属性
---
| 属性名   | 类型        | 默认值 | 描述     |
| :------- | :---------: | :----: | :------- |
| v-model  | ` String `  | 无     | 组件值   |
| disabled | ` Boolean ` | false  | 是否禁用 |
#### 事件
---
| 属性名 | 参数         | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

#### 示例
---
<template>
  <div class="demo-container">
    <xui-ip v-model="v" @change="changeHandle"></xui-ip>
    <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {    
            v:'192.168.0.106'
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
    <xui-ip v-model="v" @change="changeHandle"></xui-ip>
    <p>value : {{v}}</p>
```
``` js
export default {
    data(){
        return {    
            v:'192.168.0.106'
        }
    },
  methods : {
      changeHandle(v){
        console.log(v)
      }
  }
}
```