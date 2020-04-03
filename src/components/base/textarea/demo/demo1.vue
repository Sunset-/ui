<template>
	<div>
		<np-button @click="clear">CLEAR</np-button>
		<np-textarea ref="textarea" v-model="v" :options="options" @change="change"></np-textarea>
		{{v}}
	</div>
</template>
<script>
var uniqId = 0;

export default {
	methods: {
		clear() {
			this.$refs.textarea.clear();
		},
		change(v) {}
	},
	data() {
		return {
			v: "",
			options: {
				disabled: false,
				rows: 8,
				// maxlength: 20,
				lengthTip: true
			}
		};
	}
};
</script>
