<template>
	<div>
		<np-switch v-model="v" :options="options" title="123" @change="onChange"></np-switch>
		{{v}}
	</div>
</template>

<script>
export default {
	methods: {
		onChange(v) {
			// alert(v);
		}
	},
	data() {
		return {
			v: "",
			options: {
				default: () => {
					return true;
				},
				animate : false,
				size: "mini",
				disabled: false
			}
		};
	}
};
</script>
