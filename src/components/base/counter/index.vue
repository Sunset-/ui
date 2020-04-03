<template>
  <div class="xui-counter">
    <span class="spin-btn" @click="subValue" :class="{'disabled':disabled}">-</span>
    <input type="number" v-model="safeValue" class="xui-counter-input" :disabled="disabled" @change="handleChange" />
    <span class="spin-btn" @click="addValue" :class="{'disabled':disabled}">+</span>
  </div>
</template>
<script>
import Sunset from "../../../common/sunset";
export default {
  data() {
    return {
      safeValue: 0
    };
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number
    },
    min: {
      type: Number
    },
    step: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        v = parseInt(v);
        if (this.max != void 0 && v > this.max) {
          v = this.max;
        }
        if (this.min != void 0 && v < this.min) {
          v = this.min;
        }
        this.safeValue = v;
      }
    },
    max: {
      immediate: true,
      handler(v) {
        if (v < this.min) {
          throw new Error("max 必须大于 min");
        }
      }
    },
    min: {
      immediate: true,
      handler(v) {
        if (v > this.max) {
          throw new Error("min 必须小于 max");
        }
      }
    }
  },
  methods: {
    addValue() {
      if (this.disabled) return;
      if (
        this.max != void 0 &&
        parseInt(this.safeValue) + parseInt(this.step) > this.max
      ) {
        this.safeValue = this.max;
      } else {
        this.safeValue = parseInt(this.step) + parseInt(this.safeValue);
      }
      this.$emit("input", this.safeValue);
      this.$emit("change", this.safeValue);
    },
    subValue() {
      if (this.disabled) return;
      if (this.min != void 0 && this.safeValue - this.step < this.min) {
        this.safeValue = this.min;
      } else {
        this.safeValue -= this.step;
      }
      this.$emit("input", this.safeValue);
      this.$emit("change", this.safeValue);
    },
    handleChange(v) {
      this.$emit("input",this.safeValue);
      this.$emit("change", this.safeValue);
    }
  }
};
</script>
<style lang="less">
.xui-counter {
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
}
.xui-counter-input {
  float: left;
  width: 20px;
  height: 24px;
  line-height: 24px;
  outline: 0;
  text-align: center;
  border-radius: 1px;
  border-top: solid 1px #cccccc;
  border-bottom: solid 1px #cccccc;
  border-left: 0;
  border-right: 0;
  box-sizing: border-box;
}
.xui-counter .spin-btn {
  float: left;
  width: 20px;
  height: 24px;
  line-height: 24px;
  background-color: #f6fbff;
  border-radius: 1px;
  border: solid 1px #cccccc;
  user-select: none !important;
  -webkit-user-select: none !important;

  cursor: pointer;
  text-align: center;
  box-sizing: border-box;
}
.xui-counter-input,
.xui-counter-input::-webkit-outer-spin-button,
.xui-counter-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>

