
<template>
	<div :class="['xui-static']">
	</div>
</template>
<script>

export default {
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		options: {
			type: Object
		},
		disabled: {},
		value: {}
	},
	data() {
		return {
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		}
    },
    watch:{
        value(v){
            if (v!=this.safeOptions.value){
                this.$nextTick(()=>{
                    this.$emit("input", this.safeOptions.value);
                })
            }
      }
    },
	methods: {
		init() {
            this.$nextTick(()=>{
                this.$emit("input", this.safeOptions.value);
            })
		}
	},
	mounted() {
		this.init();
	}
};
</script>