# 分页器

> 为内容区提供 loading 遮罩，需要内容区在文档流中有宽高  
> 提供自定义遮罩及文字样式，业务中可覆盖`.xui-loading-spin`修改 loading 图片

## 插槽

| 插槽名  | 插槽作用域属性 | 描述 |
| :-----: | :------------- | :--- |
| default | 无             | 内容 |

## 属性

| 属性名        |     类型     | 默认值 | 描述                            |
| :------------ | :----------: | :----: | :------------------------------ |
| total         |   `Number`   |   0    | 数据总量                        |
| page-number   |   `Number`   |   1    | 当前页码，从 1 开始             |
| pageSize      |   `Object`   |   10   | 配置对象                        |
| size          |   `Object`   |   无   | 尺寸，支持 normal,mini          |
| foldCount     |   `Object`   |   无   | 超过页数折叠                    |
| manner        |   `Object`   |   无   | 风格，支持 simple,full 或自定义 |
| options       |   `Object`   |   无   | 配置对象，可包含上述属性        |
| options.sizer | `Array[Int]` |   无   | 分页大小调整器                  |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<template>
  <div class="demo-container">
	<xui-pager :total="98" :page-number="1" :options="options" @change="changeHandle"></xui-pager>
  </div>
</template>

<script>
export default {
	data() {
		return {
			v: "",
			options: {
				size : "normal",
				foldCount: 5,
				manner: "simple",
				pageSize: 10
			}
		};
	},
	methods: {
		changeHandle(v) {
			console.log(v);
		}
	}
};
</script>
</script>
