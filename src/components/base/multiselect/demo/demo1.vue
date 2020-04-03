<template>
	<div>
		<np-multiselect style="width:400px;" v-model="v" :options="options"></np-multiselect>
		<input type="text" v-model="v"> {{v}} {{v2}}
		<div style="height:300px;">

		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			v: "3",
			v2: "",
			options: {
				multiple: false,
				clearable: true,
				disabled: false,
				// readonly: true,
				filter: true,
				placeholder: "请选择一个性别",
				render(v) {
					return `已选择 ${v.length} 项`;
				},
				template(item) {
					return `${item.value} - ${item.text}`;
				},
				disabledOptions(item) {
					return item.value == "3";
				},
				format(item) {
					return item.value + "-" + item.text;
				},
				data: [
					{
						// group : 'A',
						text: "A",
						value: "1a"
					},
					{
						// group : 'A',
						text: "2b",
						value: "2b"
					},
					{
						// group : 'A',
						text: "3c",
						value: "3"
					},
					{
						// group : 'B',
						text: "4d",
						value: "4d"
					},
					{
						// group : 'B',
						text: "5e",
						value: "5e"
					},
					{
						// group : 'B',
						text: "6e",
						value: "6e"
					},
					{
						// group : 'B',
						text: "7e",
						value: "7e"
					},
					{
						// group : 'B',
						text: "8e",
						value: "8e"
					}
				]
			},
			multipleOptions: {
				multiple: true,
				clearable: true,
				filter: false,
				// iswrap: false,
				placeholder: "请选择一个城市",
				data: [
					{
						text: "北京",
						value: "beijing"
					},
					{
						text: "上海",
						value: "shanghai"
					},
					{
						text: "深圳",
						value: "shenzhen"
					},
					{
						text: "广州",
						value: "guangzhou"
					}
				]
			}
		};
	}
};
</script>
