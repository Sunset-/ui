# 复选框
---
#### 属性
---
| 属性名              | 类型        | 默认值   | 描述                                                                                   |
| :------------------ | :---------: | :------: | :------------------------------------------------------------------------------------- |
| v-model             | ` String `  | 无       | 组件值                                                                                 |
| disabled            | ` Boolean ` | false    | 是否禁用                                                                               |
| options             | ` Object `  | 无       | 配置对象                                                                               |
| options.size        | ` String `  | 'normal' | 尺寸(normal / small / mini)                                                            |
| options.max         | ` Number `  | 无       | 最多选择几项                                                                           |
| options.enum        | ` String `  | 无       | 枚举字典类型                                                                           |
| options.data        | ` String `  | 无       | 枚举项<br>数组 [{text : text1,value : value1}]<br>对象 {value1 : text1,value2 : text2} |
| options.errorHandle | ` String `  | 无       | 错误回调                                                                               |
#### 事件
---
| 属性名 | 参数         | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

#### 示例
---
<template>
  <div class="demo-container">
		<xui-checkbox v-model="v" :options="options" @change="changeHandle"></xui-checkbox>
        <p>value : {{v}}</p>
  </div>
</template>

<script>
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
