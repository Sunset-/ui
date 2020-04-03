<template>
	<div>
		<np-input2 v-model="v" :options="options" @input="inputHandle"></np-input2>
		{{v}}
	</div>
</template>

<script>
export default {
	methods: {
		inputHandle(v) {}
	},
	data() {
		return {
			v: "",
			options: {
				type: "text",
				placeholder: "当前为空，请输入",
				clearable: true,
				prepend: {
					style: "width:100px",
					placeholder: "请选择",
					data: {
						"1": "地址",
						"2": "电话"
					}
				},
				// append: "点击发送",
				appendClick(v, options) {
					alert(v);
				},
				icon: "sdfsdf"
			}
		};
	}
};
</script>
