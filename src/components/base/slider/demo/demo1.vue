<template>
	<div>
		<!-- <np-button @click="toggle">toggle</np-button> -->
		<!-- <np-modal ref="modal" :options="{width:600}"> -->
			<np-slider v-model="v" :options="options" @input="inputHandle"></np-slider>
		<!-- </np-modal> -->
		<input type="text" v-model="v"> {{v}}
	</div>
</template>

<script>
export default {
	methods: {
		toggle(v) {
			this.$refs.modal.open();
		}
	},
	data() {
		return {
			flag: false,
			v: [20, 40],
			options: {
				min: 10,
				max: 100,
				step: 5,
				sliderWidth: 300,
				// range: false,
				showStops: false,
				showCounter:true
			}
		};
	},
	mounted() {
		// this.$refs.modal.open();
	}
};
</script>
