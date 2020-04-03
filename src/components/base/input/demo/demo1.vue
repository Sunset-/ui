<template>
	<div>
		<np-input v-model="v" :options="options" @input="inputHandle" style="width:300px;"></np-input>
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
					style: "width:150px",
					placeholder: "请选择",
					data: {
						"1": "地址",
						"2": "电话"
					}
				},
				// append: {
				// 	style: "width:100px",
				// 	placeholder: "请选择",
				// 	data: {
				// 		"1": "地址",
				// 		"2": "电话"
				// 	}
				// },
				default : '2',
				append: "点击发送",
				appendClick(v, options) {
					return +v + 1 + "";
				},
				icon: "xui-icon xui-icon-addressbook_fill",
				tips: "老板,来碗油泼面"
			}
		};
	}
};
</script>
