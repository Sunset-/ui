<style>
.loading-demo-content {
	position: relative;
	width: 100%;
	height: 400px;
	background: #eee;
}
</style>

<template>
	<div>
		<button type="button" @click="loading=!loading">{{loading?'加载完成':'点击加载'}}</button>
		<p>loading:{{loading}}</p>
		<np-loading ref="loading" :loading="loading" :options="options">
			<div class="loading-demo-content"></div>
		</np-loading>
	</div>
</template>

<script>
export default {
	data() {
		return {
			v: "",
			loading: true,
			options: {
				delay: 3000,
				loadingText: "数据获取中，请稍后",
				shimStyle: "background:rgba(0,0,0,0.7)"
			}
		};
	}
};
</script>
