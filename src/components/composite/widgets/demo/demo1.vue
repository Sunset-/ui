<template>
	<div>
		<np-widgets style="width:500px;" v-model="v" :options="options"></np-widgets>
		<input type="text" v-model="v">
		{{v}}
		{{v2}}
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
				disabled: false,
				format(m) {
					return JSON.stringify(m);
				},
				cast(value) {
					return JSON.parse(value);
				},
				widgets: [
					{
						widget: "input",
						name: "input",
						placeholder: "aaaaa"
					},
					{
						widget: "select",
						name: "select",
						placeholder: "bbbbb",
						data: [
							{
								text: "A",
								value: "1a"
							},
							{
								text: "2b",
								value: "2b"
							},
							{
								text: "3c",
								value: "3"
							},
							{
								text: "4d",
								value: "4d"
							},
							{
								text: "5e",
								value: "5e"
							},
							{
								text: "6e",
								value: "6e"
							},
							{
								text: "7e",
								value: "7e"
							},
							{
								text: "8e",
								value: "8e"
							}
						]
					}
				]
			}
		};
	}
};
</script>
