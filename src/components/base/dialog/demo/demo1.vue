<template>
	<div>
		<np-button color="success" @click="showDialog()">打开</np-button>
		<np-dialog ref="dialog" :options="dialogOptions" @opened="opened" @closed="closed">
			<template slot-scope="props">
				是否打开过：{{props.opened}}
				<np-button color="danger" @click="close">关闭</np-button>
			</template>
		</np-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isShow: false,
			dialogOptions: {
				title: "我是标题",
				top: 50,
				animate: true,
				closeable: true
			}
		};
	},
	methods: {
		showDialog(val) {
			this.$refs.dialog.open();
		},
		close() {
			this.$refs.dialog.close();
		},
		opened() {
			console.log("打开了");
		},
		closed() {
			console.log("关闭了");
		}
	}
};
</script>
<style>

</style>
