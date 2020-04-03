# loading 容器

> 为内容区提供 loading 遮罩，需要内容区在文档流中有宽高  
> 提供自定义遮罩及文字样式，业务中可覆盖`.xui-loading-spin`修改 loading 图片

## 插槽

| 插槽名  | 插槽作用域属性 | 描述 |
| :-----: | :------------- | :--- |
| default | 无             | 内容 |

## 属性

| 属性名  |        类型        | 默认值 | 描述                                           |
| :------ | :----------------: | :----: | :--------------------------------------------- |
| loading |     `Boolean`      | false  | 加载状态标志                                   |
| text    |      `String`      |   无   | 加载提示，支持 html                            |
| shim    | `String / Object`  |   无   | 遮罩样式                                       |
| delay   | `Number / Boolean` |   无   | 延迟时间，请求迅速时启用，避免频繁闪烁 loading |
| options |      `Object`      |   无   | 配置对象，可包含上述值                         |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<template>
  <div class="demo-container">
    <xui-button color="primary" @click="loading=!loading">{{loading?'加载完成':'点击加载'}}</xui-button>
    <p>loading:{{loading}}</p>
    <xui-loading :loading="loading" text="数据获取中..." shim="background:rgba(255,255,255,0.7)">
        <!-- 内容 -->
        <div class="loading-demo-content" style="height:200px;border:1px solid #cdcdcd;">这是内容</div>
    </xui-loading>
  </div>
</template>
<script>
export default {
	data() {
		return {
			loading: true
		};
	}
};
</script>
</script>
