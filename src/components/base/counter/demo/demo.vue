<template>
	<div>
        <input type="number" placeholder="最小值" v-model="min">
        <input type="number" placeholder="最大值" v-model="max">
        <input type="number" placeholder="递进数" v-model="step">
		<np-counter v-model="value" :max="max" :min="min" :step="step" :disabled="disabled"></np-counter>
        disabled?<np-switch v-model="disabled"></np-switch>
	</div>
</template>

<script>
export default {
	data() {
		return {
            min:0,
            max:20,
            step:1,
            value:45,
            disabled:false
		};
	}
};
</script>
