# 气泡提示

> 在需要气泡提示的 dom 节点上添加 class`xui-pop`,并添加属性`pop-content`即可
> 样式可覆盖`.xui-pop-wrap`

## 属性

| 属性名      |   类型   | 默认值 | 描述                    |
| :---------- | :------: | :----: | :---------------------- |
| pop-content | `String` |   无   | 气泡提示内容，支持 HTML |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<template>
  <div class="demo-container">
    <div style="display:inline-block;" class="xui-pop" :pop-content="123">AAA</div>
  </div>
</template>

<script>
export default {
    data(){
        return {
        }
    },
    methods : {
    }
}
</script>
</script>
