<template>
	<div>
		<np-button @click="clear">CLEAR</np-button>
		<np-button @click="set">set</np-button>
		<np-datetime ref="datetime" v-model="v" :options="options" @change="change"></np-datetime>
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
		set() {
			this.$refs.datetime.selectShortcut(1);
		},
		change(v) {
			console.log(v);
		}
	},
	data() {
		return {
			v: null,
			options: {
				startPlaceholder: "开始时间",
				endPlaceholder: "结束时间",
				type: "datetimerange",
				format: "yyyy-MM-dd HH:mm",
				valueFormat: "yyyy-MM-dd HH:mm:ss",
				shortcuts: [
					{
						label: "24小时",
						value() {
							var now = new Date();
							return [new Date(now.getTime() - 86400000), now];
						}
					},
					{
						label: "近7天",
						value() {
							var now = new Date();
							var start = new Date();
							start.setDate(start.getDate() - 6);
							start.setHours(0);
							start.setMinutes(0);
							start.setSeconds(0);
							start.setUTCMilliseconds(0);
							return [new Date(start), now];
						}
					},
					{
						label: "近30天",
						value() {
							var now = new Date();
							var start = new Date();
							start.setDate(start.getDate() - 30);
							start.setHours(0);
							start.setMinutes(0);
							start.setSeconds(0);
							start.setUTCMilliseconds(0);
							return [new Date(start), now];
						}
					}
				]
			}
		};
	}
};
</script>
