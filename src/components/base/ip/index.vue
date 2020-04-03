<template>
	<div :class="['xui-ipaddr',cdisabled?'disabled':'']">
		<input ref="addr1" v-model="addr1" :readonly="cdisabled" @keydown="keydownAddr(1,$event)" type="text" maxlength="3" @keyup="keyupAddr(1,$event)" onafterpaste="this.value=this.value.replace(/\D/g,'')">
		<i></i>
		<input ref="addr2" v-model="addr2" :readonly="cdisabled" @keydown="keydownAddr(2,$event)" type="text" maxlength="3" @keyup="keyupAddr(2,$event)" onafterpaste="this.value=this.value.replace(/\D/g,'')">
		<i></i>
		<input ref="addr3" v-model="addr3" :readonly="cdisabled" @keydown="keydownAddr(3,$event)" type="text" maxlength="3" @keyup="keyupAddr(3,$event)" onafterpaste="this.value=this.value.replace(/\D/g,'')">
		<i></i>
		<input ref="addr4" v-model="addr4" :readonly="cdisabled" @keydown="keydownAddr(4,$event)" type="text" maxlength="3" @keyup="keyupAddr(4,$event)" onafterpaste="this.value=this.value.replace(/\D/g,'')">
	</div>
</template>
<script>
import Sunset from "../../../common/sunset";

export default {
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		value: {},
		disabled: {},
		options: {}
	},
	data() {
		var addrs = this.calculateAddrValue(this.value);
		return {
			addr1: addrs[0],
			addr2: addrs[1],
			addr3: addrs[2],
			addr4: addrs[3]
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		cdisabled() {
			return Sunset.isBoolean(this.disabled)
				? this.disabled
				: Sunset.isBoolean(this.safeOptions.disabled) ? this.safeOptions.disabled : false;
		}
	},
	methods: {
		keydownAddr(index, ev) {
			var selectionStart = ev.target.selectionStart;
			if ((ev.keyCode == 37 || ev.keyCode == 8) && selectionStart == 0 && index > 1) {
				this.$nextTick(() => {
					this.$refs[`addr${index - 1}`].focus();
					this.$refs[`addr${index - 1}`].selectionStart = this.$refs[`addr${index - 1}`].value.length + 1;
					if (ev.keyCode == 8) {
						this[`addr${index - 1}`] = this[`addr${index - 1}`].substr(
							0,
							this[`addr${index - 1}`].length - 1
						);
					}
				});
			} else if (ev.keyCode == 32 && index < 4) {
				this.$refs[`addr${index + 1}`].focus();
			} else if (ev.keyCode == 39 && selectionStart == ev.target.value.length && index < 4) {
				this.$nextTick(() => {
					this.$refs[`addr${index + 1}`].focus();
					this.$refs[`addr${index + 1}`].selectionStart = 0;
				});
			}
		},
		keyupAddr(index, ev) {
			var keyCode = ev.keyCode;
			if (keyCode == 8 || keyCode == 37 || keyCode == 32 || keyCode == 39) {
				return;
			}
			var v = this[`addr${index}`].replace(/\D/g, "");
			if (+v > 255) {
				v = "255";
			}
			this[`addr${index}`] = v;
			if (v.length == 3 && index < 4) {
				this.$refs[`addr${index + 1}`].focus();
			}
		},
		calculateValue() {
			var v = "";
			if (this.addr1.length && this.addr2.length && this.addr3.length && this.addr4.length) {
				v = `${+this.addr1}.${+this.addr2}.${+this.addr3}.${+this.addr4}`;
			}
			this.$emit("input", v);
			if (v != this.value) {
				this.$emit("change", v);
			}
		},
		calculateAddrValue(v) {
			if (v && v.length) {
				var addrs = v.split(".");
				if (addrs.length == 4) {
					if (
						this.isIpAddr(addrs[0]) &&
						this.isIpAddr(addrs[1]) &&
						this.isIpAddr(addrs[2]) &&
						this.isIpAddr(addrs[3])
					) {
						this.addr1 = addrs[0];
						this.addr2 = addrs[1];
						this.addr3 = addrs[2];
						this.addr4 = addrs[3];
						return addrs;
					}
				}
			}
			this.addr1 = "";
			this.addr2 = "";
			this.addr3 = "";
			this.addr4 = "";
			
			return ["", "", "", ""];
		},
		isIpAddr(v) {
			return !isNaN(v) && (+v >= 0 && +v <= 255);
		}
	},
	watch: {
		addr1() {
			this.calculateValue();
		},
		addr2() {
			this.calculateValue();
		},
		addr3() {
			this.calculateValue();
		},
		addr4() {
			this.calculateValue();
		},
		value(v) {
			this.calculateAddrValue(v);
		}
	}
};
</script>
<style lang="scss">
.xui-ipaddr {
	display: inline-block;
	border: 1px solid #ccc;
	padding: 2px 5px;
	&.disabled {
		cursor: not-allowed;
		& > input {
			cursor: not-allowed;
		}
	}
	& > input {
		display: inline-block;
		width: 30px;
		height: 100%;
		text-align: center;
		border: none;
		outline: none;
	}
	& > i {
		display: inline-block;
		&:after {
			content: ".";
		}
	}
}
</style>

