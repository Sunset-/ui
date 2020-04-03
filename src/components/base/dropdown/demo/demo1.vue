<template>
	<div>
		<np-dropdown :options="options" :ctx="{name:'小明'}"></np-dropdown>
	</div>
</template>

<script>
export default {
	data() {
		return {
			v: "",
			options: {
				label: "选择",
				color: "success",
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
						line : true
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
			}
		};
	}
};
</script>
