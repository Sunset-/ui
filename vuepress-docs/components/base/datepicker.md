# 日期选择框
---
#### 属性
---
| 属性名                 | 类型                | 默认值   | 描述                                                      |
| :--------------------- | :-----------------: | :------: | :-------------------------------------------------------- |
| v-model                | ` String `          | 无       | 组件值                                                    |
| disabled               | ` Boolean `         | false    | 是否禁用                                                  |
| options                | ` Object `          | 无       | 配置对象                                                  |
| options.format         | ` String `          | 'normal' | 显示在输入框的格式                                        |
| options.valueformat    | ` String `          | 无       | 输出值格式 默认为Date对象 可选值为"timestamp、yyyy-MM-dd" |
| options.placeholder    | ` String `          | 无       | 输入提示                                                  |
| options.clearable      | ` Boolean `         | true     | 是否可清空                                                |
| options.disabledDate   | ` Function(date) `  | true     | 禁选日期                                                  |
| options.changeCallBack | ` Function(value) ` | true     | 值变更回调函数                                            |
#### 事件
---
| 属性名 | 参数         | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

#### 示例
---
<template>
  <div class="demo-container">
        <xui-datepicker v-model="v" :options="options" @change="changeHandle"></xui-datepicker>
        <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {    
            v:new Date(),
            v1:new Date(),
			options: {
			    type: "datetime",
                placeholder: "当前为空，请输入",
                clearable: true,
                format:'yyyy-MM-dd HH:mm:ss',
                disabledDate:function(time) {
                    return time.getTime() > Date.now();
                }
            },
			options1: {
			    type: "datetime",
                placeholder: "当前为空，请输入",
                clearable: true,
                        format : 'yyyy-MM-dd',
                valueFormat:'timestamp',
                disabledDate:function(time) {
                    return time.getTime() > Date.now();
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
    <xui-datepicker v-model="v" :options="options" @change="changeHandle"></xui-datepicker>
    <p>value : {{v}}</p>
```
``` js
export default {
    data(){
        return {    
            v:new Date(),
			options: {
			    type: "datetime",
                placeholder: "当前为空，请输入",
                clearable: true,
                format:'yyyy-MM-dd HH:mm:ss',
                disabledDate:function(time) {
                    return time.getTime() > Date.now();
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

<template>
  <div class="demo-container">
    <span style="display:inline-block;vertical-align:middle;">时间戳输出：</span>
    <xui-datepicker v-model="v1" :options="options1" @change="changeHandle"></xui-datepicker>
    <p>value : {{v1}}</p>
  </div>
</template>
