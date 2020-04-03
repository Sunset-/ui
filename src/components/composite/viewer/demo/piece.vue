<template>
	<div :style="'border:1px solid #ccc;width:120px;height:120px;float:left;margin:5px;'">
		{{index}}
		<img v-if="visible" width="100%" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523423248279&di=493bc72e3e45e82ec5875a7898bc714c&imgtype=0&src=http%3A%2F%2Fimg1.cache.netease.com%2Fcatchpic%2FC%2FC7%2FC722DF5405D1F1BB68771B7A163F65C5.jpg" alt="">
	</div>
</template>
<script>
export default {
	props: {
		item: {},
		index: {},
		visible: {}
	}
};
</script>
