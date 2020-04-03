<template>
	<div>
		<button @click="show=!show">ttt</button>
		<np-datepicker v-if="show"  :options="options" @change="changeCallBack" v-model="v"></np-datepicker>
		{{v}}
	</div>
</template>

<script>
export default {
	data() {
		return {
			show :true,
			v: Date.now(),
			options: {
				type: "datetime",
				placeholder: "当前为空，请输入",
				clearable: true,
				format: "yyyy-MM-dd",
				valueFormat: "yyyy-MM-dd HH:mm",
				clearable: false,
				disabled: false,
				yearRange: [2018, 2037],
				class:"text-class"
			}
		};
	},
	methods: {
		changeCallBack(val) {
			console.log(val);
		}
	}
};
</script>
