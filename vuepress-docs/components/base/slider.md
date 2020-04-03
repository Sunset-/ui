# 滑轨
---
#### 属性
---
| 属性名              | 类型        | 默认值 | 描述         |
| :------------------ | :---------: | :----: | :----------- |
| v-model             | ` String `  | 无     | 组件值       |
| disabled            | ` Boolean ` | false  | 是否禁用     |
| options             | ` Object `  | 无     | 配置对象     |
| options.range       | ` Boolean ` | false  | 是否为区间   |
| options.min         | ` Number `  | 无     | 最小值       |
| options.max         | ` Number `  | 无     | 最大值       |
| options.step        | ` Number `  | 无     | 步长         |
| options.spliter     | ` String `  | ','    | 区间值分隔符 |
| options.sliderWidth | ` Number `  | 无     | 宽度         |
#### 事件
---
| 属性名 | 参数         | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

#### 示例
---
<template>
  <div class="demo-container">
		<xui-slider v-model="v" :options="options" @change="changeHandle"></xui-slider>
        <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {    
            v:50,
            options:{
				min: 10,
				max: 100,
				step: 5,
				sliderWidth: 200,
                range: true
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
    <xui-slider v-model="v" :options="options" @change="changeHandle"></xui-slider>
    <p>value : {{v}}</p>
```
``` js
export default {
    data(){
        return {    
            v:50,
            options:{
				min: 10,
				max: 100,
				step: 5,
				sliderWidth: 200,
				range: false
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
