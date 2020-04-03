# 开关

## 属性

| 属性名   |   类型    | 默认值 | 描述                                     |
| :------- | :-------: | :----: | :--------------------------------------- |
| v-model  | `String`  |   无   | 组件值                                   |
| disabled | `Boolean` | false  | 是否禁用                                 |
| animate  | `Boolean` |  true  | 开启动画                                 |
| size     | `String`  |   无   | 尺寸(normal / small / mini)              |
| ctx      | `Object`  |   无   | 作用域对象                               |
| options  | `Object`  |   无   | 配置对象(包含 animate,size,disabled,ctx) |

## 事件

| 属性名 |     参数     | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<template>
  <div class="demo-container">
		<xui-switch v-model="v" size="mini"></xui-switch>
		<xui-switch v-model="v" size="small"></xui-switch>
		<xui-switch v-model="v" @change="changeHandle"></xui-switch>
		<xui-switch v-model="v" size="big"></xui-switch>
		<xui-switch :disabled="true"></xui-switch>
		<xui-switch :animate="false"></xui-switch>
        <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {
            v:true
        }
    },
    methods : {
        changeHandle(v){
            console.log(v)
        }
    }
}
</script>
</script>
