<template>
	<div>
		<div class="rangePicker" style="height:50px">
			<np-daterange v-model="v" :options="options"></np-daterange>
		</div>
		<np-button @click="test">www</np-button>
		{{v}}
	</div>
</template>

<script>
export default {
	data() {
		return {
			v: [new Date(new Date().getTime() - 86400000),new Date().getTime()],
			options: {
				// disabledStart:true,
				startPlaceholder: "开始时间",
				endPlaceholder: "结束时间",
				type: "datetime",
				format: "yyyy-MM-dd hh:mm:ss",
				// defaultFirst: true,
				valueFormat: "timestamp",
				searchButton: {
					color: "primary",
					icon: "",
					size: "",
					label: "筛选",
					disabled: ""
				},
				timeInterval:1,
				maxTime:1554048000000,
				searchCallBack(val) {
					console.log(val);
				},
				disabledDate: function(time) {
					return time.getTime() > Date.now();
				},
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
	},
	methods: {
		test() {
			this.v = [new Date().getTime(), new Date().getTime()];
		}
	},
	watch: {
		v(v) {
			console.log(v);
		}
	}
};
</script>
