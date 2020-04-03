<template>
	<div>
		<np-button color="primary" @click="init('kuantu')">初始化宽图</np-button>
		<np-button color="primary" @click="init('gaotu')">初始化高图</np-button>
		<np-button color="primary" @click="reset">还原</np-button>
		<np-button color="primary" @click="rotate">旋转</np-button>
		<np-button color="primary" @click="flipHorizintal">水平翻转</np-button>
		<np-button color="primary" @click="flipVertical">垂直翻转</np-button>

		<np-viewer ref="viewer" class="image-viewer" :wait="viewerWait">
			<div style="position:relative;">
				<div style="position:absolute;top:100px;left:100px;width:50px;height:50px;background:red;border-radius:100px;"></div>
				<img :src="src" />
			</div>
		</np-viewer>
	</div>
</template>
<script>
var deg = 0;
export default {
	data() {
		return {
			viewerWait: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528891911729&di=ec8e9d078ebb0a3a9cbbf33c1b8f84a3&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fbba1cd11728b47107aee31eac8cec3fdfd0323d7.jpg",
			src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528891911729&di=ec8e9d078ebb0a3a9cbbf33c1b8f84a3&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fbba1cd11728b47107aee31eac8cec3fdfd0323d7.jpg",
			kuantu:
				"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528891911729&di=ec8e9d078ebb0a3a9cbbf33c1b8f84a3&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fbba1cd11728b47107aee31eac8cec3fdfd0323d7.jpg",
			gaotu:
				"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529486558&di=a561e8910d23a3c9c75fa22afec54832&imgtype=jpg&er=1&src=http%3A%2F%2Fpic.iyishu.com%2F20140209%2F219288553.jpg"
		};
	},
	methods: {
		init(which) {
			deg = 0;
			this.viewerWait = this.src = this[which];
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
<style>
.image-viewer {
	width: 1000px;
	height: 600px;
	border: 1px solid #ddd;
}
</style>
