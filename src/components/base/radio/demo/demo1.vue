<template>
	<div>
		<np-button @click="clear">CLEAR</np-button>
		<np-radio ref="radio" v-model="v" :options="options" @change="change"></np-radio>
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
			v: "1",
			options: {
				disabled: false,
				defaultFirst: true,
				// manner: "button",
				size: "small",
				enum: "SEX"
			}
		};
	}
};
</script>
