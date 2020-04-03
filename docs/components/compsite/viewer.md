# 浏览器

> 针对自定义 dom 元素，提供平移、缩放、旋转、翻转等操作

## 属性

| 属性名 |       类型       | 默认值 | 描述                                                       |
| :----- | :--------------: | :----: | :--------------------------------------------------------- |
| wait   | `String / Array` |   无   | 等待条件，放入异步前置条件，如图片 src，可支持多个图片 src |

## 方法

| 方法名 | 参数 | 返回值 | 描述                                                   |
| :----- | :--: | :----- | :----------------------------------------------------- |
| init   |  无  | 无     | 在外部加载完所有资源后，调用此方法（如图片 onload 后） |
| hide   |  无  | 无     | 隐藏内容，用于切换图片前                               |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">


<style>
.image-viewer {
	width: 900px;
	height: 600px;
	border: 1px solid #ddd;
}
</style>
<template>
<div>
	<xui-button color="primary" @click="init('kuantu')">初始化宽图</xui-button>
	<xui-button color="primary" @click="init('gaotu')">初始化高图</xui-button>
	<xui-button color="primary" @click="reset">还原</xui-button>
	<xui-button color="primary" @click="rotate">旋转</xui-button>
	<xui-button color="primary" @click="flipHorizintal">水平翻转</xui-button>
	<xui-button color="primary" @click="flipVertical">垂直翻转</xui-button>
	<xui-viewer ref="viewer" :wait="src" class="image-viewer">
		<div style="position:relative;">
			<!-- 我是图片上的一个标记 -->
			<div style="position:absolute;top:100px;left:100px;width:50px;height:50px;background:red;border-radius:100px;"></div>
			<!-- 我是图片 -->
			<img ondragstart="return false;" :src="src" />
		</div>
	</xui-viewer>
</div>
</template>
<script>
var deg = 0;
export default {
	data() {
		return {
			src: "",
			kuantu:
				"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528891911729&di=ec8e9d078ebb0a3a9cbbf33c1b8f84a3&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fbba1cd11728b47107aee31eac8cec3fdfd0323d7.jpg",
			gaotu:
				"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529486558&di=a561e8910d23a3c9c75fa22afec54832&imgtype=jpg&er=1&src=http%3A%2F%2Fpic.iyishu.com%2F20140209%2F219288553.jpg"
		};
	},
	methods: {
		init(which) {
			deg = 0;
			this.src = this[which];
		},
		reset() {
			this.$refs.viewer.reset();
		},
		rotate() {
			this.$refs.viewer.rotate((deg += 90));
		},
		flipHorizintal() {
			this.$refs.viewer.flipHorizintal();
		},
		flipVertical() {
			this.$refs.viewer.flipVertical();
		}
	},
	mounted() {}
};
</script>
</script>
