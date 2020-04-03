<template>
	<div @click="change(213)">
		<np-toolbar :ctx="{name : '小明'}" :options="options"></np-toolbar>
		{{v}}
	</div>
</template>
<script>
export default {
	methods: {
		change(v) {
			alert(v);
		}
	},
	data() {
		return {
			v: "",
			flag: false,
			options: {
				size: "small",
				tools: [
					{
						title: ctx => {
							return this.flag ? "111" : "222";
						},
						color: "info",
						icon: ctx => {
							return this.flag ? "xui-icon xui-icon-close" : "xui-icon xui-icon-add";
						},
						operate: () => {
							alert("click");
						}
					},
					{
						title: "普通按钮1",
						color: "info",
						icon: "el-icon-circle-plus",
						disabled: false,
						operate: () => {
							alert("click");
						}
					},
					{
						label: "普通按钮",
						color: "info",
						icon: "el-icon-circle-plus",
						operate: () => {
							this.flag = !this.flag;
						}
					},
					{
						label: "选择",
						type: "dropdown",
						disabled() {
							return false;
						},
						items: [
							{
								label: "图标按钮1",
								icon: "refresh",
								disabled: true,
								operate(record) {
									alert(123);
									alert(record.name);
								}
							},
							{
								label: "图标按钮2",
								premise(ctx) {
									return true;
								},
								operate(record) {
									alert(record.name);
								}
							},
							{
								label: "图标按钮3",
								icon: "refresh",
								operate(record) {
									alert(record.name);
								}
							}
						]
					},
					{
						label: "下载按钮",
						type: "download",
						icon: "el-icon-circle-plus",
						color: "primary",
						disabled: true,
						name: () => {
							return "v.txt";
						},
						data: () => {
							return "data:text/plain,12312321";
						},
						operate: () => {
							return "1234567";
						}
					},
					{
						label: "文件选择",
						icon: "el-icon-circle-plus",
						disabled: true,
						color: "success",
						type: "file",
						url: "/service/system/file/upload",
						className: "my-uploader-trigger",
						filter(f) {
							return ~f.type.indexOf("image");
						},
						formData(record) {
							return {
								sunset: record.name
							};
						},
						progress(v) {
							console.log(v);
						}
					},
					{
						label: "下拉菜单",
						color: "warning",
						type: "dropdown",
						disabled() {
							return true;
						},
						items: [
							{
								label: "图标按钮1",
								icon: "refresh",
								disabled: true,
								operate(record) {
									alert(record.name);
								}
							},
							{
								label: "图标按钮2",
								icon: "refresh",
								premise(ctx) {
									return false;
								},
								operate() {
									alert(record.name);
								}
							},
							{
								label: "图标按钮3",
								icon: "refresh",
								operate(record) {
									alert(record.name);
								}
							}
						]
					},
					{
						icon: "refresh",
						color: "success",
						type: "switch",
						disabled(ctx) {
							return false;
						},
						premise(ctx) {
							return true;
						},
						default(ctx) {
							return false;
						},
						operate: (record, v) => {
							record.name = "false";
							return Promise.resolve().then(() => {
								// throw new Error();
							});
						}
					},
					{
						icon: "refresh",
						color: "success",
						widget: "checkbox",
						data: {
							"1": "男",
							"2": "女"
						},
						default(record) {
							return record.name ? "1" : "2";
						},
						disabled(ctx) {
							return false;
						},
						operate: (record, v, reset) => {
							record.sss = v;
							// setTimeout(() => {
							if (!v) {
								reset("2");
							}
							// }, 2000);
						}
					}
				]
			}
		};
	}
};
</script>
