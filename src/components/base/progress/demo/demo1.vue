<template>
	<div>
		<np-button @click="start">开始</np-button>
		<np-progress ref="progress" :value="60" :total="100" :stripe="true" style="width:200px;height:13px;border:1px solid #444;">
		</np-progress>
		<np-progress ref="progress" :value="v" manner="circle" start="bottom" :radius="100" :line-width="5" :color="options.color" background-color="#dbdbdb">
			<template slot-scope="prop">
				<div style="position:absolute;top:45%;left:50%;margin-left:-10px;">
					{{prop.progress}}
				</div>
			</template>
		</np-progress>
	</div>
</template>
<script>
var uniqId = 0;

export default {
	methods: {
		start() {
			this.options.animate = false;
			this.$nextTick(() => {
				this.v = 0;
				setTimeout(() => {
					this.options.animate = true;
					var self = this;
					function add() {
						self.v++;
						if (self.v >= 100) {
						} else {
							setTimeout(add, 100);
						}
					}
					add();
				}, 100);
			});
		},
		change(v) {}
	},
	data() {
		return {
			v: 60,
			options: {
				animate: true,
				total: 100,
				color(v) {
					if (v < 0.3) {
						return "danger";
					} else if (v < 0.6) {
						return "warning";
					} else if (v < 1) {
						return "primary";
					} else if (v >= 1) {
						return "success";
					}
				}
			}
		};
	},
	mounted() {
		this.start();
	}
};
</script>
