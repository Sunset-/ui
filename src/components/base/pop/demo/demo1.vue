<template>
	<div>
		<div style="display:inline-block;" class="xui-pop" :pop-content="123">AAA</div>
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
				clearable: false,
				prepend: {
					style: "width:100px",
					placeholder: "请选择",
					data: {
						"1": "地址",
						"2": "电话"
					}
				},
				append: "点击发送",
				appendClick(v, options) {
					options.append = "已发送短信";
				}
			}
		};
	}
};
</script>
