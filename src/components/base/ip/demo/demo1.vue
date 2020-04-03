<template>
	<div>
		<np-button @click="clear">CLEAR</np-button>
		<input v-model="v">CLEAR</input>
		<np-ip ref="radio" v-model="v" :options="options" @change="change"></np-ip>
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
			v: null,
			options: {
				disabled: false
			}
		};
	}
};
</script>
