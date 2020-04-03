<template>
	<div>
		<np-tabs v-model="v" :options="options"></np-tabs>
		{{v}}
	</div>
</template>

<script>
export default {
	data() {
		return {
			v: "ALL",
			options: {
				type: "text",
				data: [
					{
						text: "全部",
						value: "ALL"
					},
					{
						text: "车辆",
						value: "VEHICLE"
					},
					{
						text: "人体",
						value: "BODY"
					}
				]
			}
		};
	}
};
</script>
