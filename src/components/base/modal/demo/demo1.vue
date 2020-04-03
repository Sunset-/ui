<template>
	<div style="transform:translate(0,0)">
		<np-button @click="open">打开</np-button>
		<np-modal ref="modal" :options="options" @opened="tip('opened')" @closed="tip('closed')">
			<template slot-scope="props" slot="content">
				<div v-if="props.opened" style="width:500px;height:300px;">
					<np-datepicker></np-datepicker>
				</div>
			</template>
			<div slot="footer" style="padding:10px;text-align:center;">
				<np-toolbar :options="toolbarOptions"></np-toolbar>
			</div>
		</np-modal>
	</div>
</template>

<script>
export default {
	methods: {
		open: function() {
			this.$refs.modal.open();
		},
		tip: function(msg) {
			console.log(msg);
		}
	},
	data() {
		return {
			options: {
				// top:200,
				title: "<span style='color: red'>标12312题</span>",
				maskClose: true
			},
			toolbarOptions: {
				size: "medium",
				tools: [
					{
						label: "保存",
						color: "success",
						operate() {}
					},
					{
						label: "取消",
						color: "info",
						operate: () => {
							this.$refs.modal.close();
						}
					}
				]
			}
		};
	}
};
</script>
