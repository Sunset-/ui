<style>
.test-box p {
	width: 700px;
}
</style>

<template>
	<div style="position:relative;height:400px;background:#dedede;border:1px solid #DEDEDE;">
		<np-button @click="setData">设置数据</np-button>
		<np-button @click="clear">清空</np-button>
		<np-viewport ref="viewport" style="background:#FFF;" :options="viewportOptions"></np-viewport>
	</div>
</template>
<script>
var demoData = [];

for (var i = 0; i < 10000; i++) {
	demoData.push({
		name: "name-" + i,
		id: i
	});
}

export default {
	data() {
		return {
			flag: true,
			viewportOptions: {
				containerHeight() {
					return 400;
				},
				recordHeight: 35,
				template(record) {
					return `<div style="border:1px solid red;height:33px;">${
						record.name
					}<button type="button" class="remove">删除</button></div>`;
				},
				empty: "<div>暂无数据</div>",
				operate: (record, ev) => {
					if (ev.target.className == "remove") {
						this.$refs.viewport.removeRecord(record);
					}
				}
			}
		};
	},
	methods: {
		setData() {
			this.$refs.viewport.setData(demoData);
		},
		clear() {
			this.$refs.viewport.clear();
		}
	},
	mounted() {
	}
};
</script>