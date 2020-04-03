<template>
	<div>
		<input type="text" v-model="v">
		<np-button @click="clear">CLEAR</np-button>
		<np-customchecker ref="customchecker" v-model="v" :options="options" @change="change"></np-customchecker>
		{{v}}
	</div>
</template>
<script>
var uniqId = 0;

export default {
	methods: {
		clear() {
			this.$refs.radio.clear();
		},
		change(v) {}
	},
	data() {
		return {
			v: "",
			options: {
				disabled: false,
				multiple: false,
				template(item, active) {
					return `<div style="width:20px;height:20px;border-radius:3px;margin-right:5px;background:${
						item.value
					};border:2px solid ${active ? "orange" : "#777"};">${item.text}</div>`;
				},
				appendData: [
					{
						text: "其他",
						value: "-1"
					}
				],
				data: [
					{
						text: "全部",
						value: ""
					},
					{
						text: "红色",
						value: "red"
					},
					{
						text: "绿色",
						value: "green"
					},
					{
						text: "蓝色",
						value: "blue"
					},
					{
						text: "黄色",
						value: "yellow"
					}
				]
			}
		};
	}
};
</script>
