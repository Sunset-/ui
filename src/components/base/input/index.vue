<template>
    <div style="position:relative;" :class="['xui-input xui-input-style',cclearable?'clearable':'']">
        <!-- prepend -->
        <div v-if="prependText||prependSelect" class="xui-input-prepend">
            <input-attach-button v-if="prependText" style="cursor:pointer;" slot="prepend" v-html="prependText" @click="prependClick"></input-attach-button>
            <input-attach-select v-if="prependSelect" slot="prepend" v-model="prependValue" :options="safeOptions.prepend"></input-attach-select>
        </div>
        <div class="xui-input-wrap">
            <div>
                <input class="xui-input-inner" :class="[(prependSelect||appendSelect)?'input-with-select':'',safeOptions.className]" @blur="blurMethod" @on-blur="blur" @focus="focusMethod" :type="ctype" v-model="inputValue" :maxlength="maxlength" :disabled="cdisabled" :clearable="safeOptions.clearable" :readonly="safeOptions.readonly" :placeholder="cplaceholder" :size="safeOptions.size" :style="safeOptions.style">
                <i v-if="safeOptions.icon" :class="safeOptions.icon"></i>
                <i v-if="cclearable&&inputValue&&!cdisabled" class="input-clear-icon xui-icon xui-icon-delete_fill" @click.stop="clear"></i>
            </div>
        </div>
        <!-- append -->
        <div v-if="appendText||appendSelect" class="xui-input-append">
            <input-attach-button v-if="appendText" style="cursor:pointer;" @click="clickButton" slot="append" v-html="appendText"></input-attach-button>
            <input-attach-select v-if="appendSelect" slot="append" v-model="appendValue" :options="safeOptions.append"></input-attach-select>
        </div>
        <!-- tips -->
        <div class="xui-tips" v-show="showTips" v-if="tips" v-html="tips"></div>
    </div>
</template>
<script>
import Utils from "../../Helper.js";
import Sunset from "../../../common/sunset";

import inputAttachSelect from "../select";
import inputAttachButton from "../button";

export default {
    components: {
        inputAttachSelect,
        inputAttachButton
    },
    model: {
        prop: "value",
        event: "input"
    },
    props: {
        options: {
            type: Object
        },
        value: {},
        type: {},
        disabled: {},
        clearable: {},
        placeholder: {}
    },
    data() {
        return {
            prependItems: [],
            appendItems: [],
            inputValue: void 0,
            prependValue: void 0,
            appendValue: void 0,
            lock: false,
            valueLock: false,
            inited: false,
            showTips: false
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        cclearable() {
            return (
                this.clearable !== false && this.safeOptions.clearable !== false
            );
        },
        ctype() {
            return this.type || this.safeOptions.type || "text";
        },
        isNumber() {
            return (
                this.safeOptions.widget == "number" ||
                this.safeOptions.type == "number"
            );
        },
        digits() {
            return this.safeOptions.digits || 0;
        },
        cdisabled() {
            return this.disabled === true || this.safeOptions.disabled === true;
        },
        cplaceholder() {
            return this.placeholder || this.safeOptions.placeholder || "";
        },
        maxlength() {
            return (
                this.safeOptions.maxlength ||
                (this.safeOptions.validate &&
                    (Sunset.isNumber(this.safeOptions.validate.maxlength)
                        ? this.safeOptions.validate.maxlength
                        : this.safeOptions.validate.maxlength &&
                          this.safeOptions.validate.maxlength.rule))
            );
        },
        prependText() {
            return this.safeOptions.prepend &&
                Sunset.isString(this.safeOptions.prepend)
                ? this.safeOptions.prepend
                : false;
        },
        prependSelect() {
            return this.safeOptions.prepend &&
                Sunset.isObject(this.safeOptions.prepend)
                ? this.safeOptions.prepend
                : false;
        },
        prependSpliter() {
            return (this.prependSelect && this.prependSelect.spliter) || ",";
        },
        appendText() {
            return this.safeOptions.append &&
                Sunset.isString(this.safeOptions.append)
                ? this.safeOptions.append
                : false;
        },
        appendSelect() {
            return this.safeOptions.append &&
                Sunset.isObject(this.safeOptions.append)
                ? this.safeOptions.append
                : false;
        },
        appendSpliter() {
            return (this.appendSelect && this.appendSelect.spliter) || ",";
        },
        defaultPrependValue() {
            if (this.prependSelect) {
                return this.prependSelect.default == null
                    ? null
                    : this.prependSelect.default;
            }
            return null;
        },
        defaultAppendValue() {
            if (this.appendSelect) {
                return this.appendSelect.default == null
                    ? null
                    : this.appendSelect.default;
            }
            return null;
        },
        tips() {
            return this.safeOptions.tips &&
                Sunset.isString(this.safeOptions.tips)
                ? this.safeOptions.tips
                : false;
        }
    },
    methods: {
        clickButton() {
            if (this.safeOptions.appendClick) {
                Promise.resolve(
                    this.safeOptions.appendClick(this.value, this.safeOptions)
                ).then(res => {
                    if (Sunset.isString(res)) {
                        this.valueToInputValue(res);
                    }
                });
            }
        },
        prependClick() {
            if (this.safeOptions.prependClick) {
                Promise.resolve(
                    this.safeOptions.prependClick(this.value, this.safeOptions)
                ).then(res => {
                    if (Sunset.isString(res)) {
                        this.valueToInputValue(res);
                    }
                });
                // return this.valueToInputValue(this.safeOptions.prependClick(this.value, this.safeOptions));
            }
        },
        init() {
            this.inited = false;
            this.valueToInputValue(this.value);
            this.inited = true;
        },
        slientRefreshValue() {
            this.lock = true;
            var value =
                this.inputValue && this.inputValue.length
                    ? `${
                          this.prependSelect
                              ? `${(this.prependValue || "") +
                                    this.prependSpliter}`
                              : ""
                      }${this.inputValue}${
                          this.appendSelect
                              ? `${(this.appendSpliter || "") +
                                    this.appendValue}`
                              : ""
                      }`
                    : this.inputValue;
            this.$emit("input", value);
            if (value != this.value) {
                this.$emit("change", value);
            }
            this.lock = false;
        },
        blur() {
            if (this.isNumber) {
                if (
                    this.inputValue === "" ||
                    this.inputValue === null ||
                    this.inputValue === void 0
                ) {
                    this.inputValue = "";
                } else {
                    this.inputValue =
                        Sunset.Numbers.fixed(this.inputValue, this.digits) + "";
                    if (!isNaN(this.inputValue)) {
                        if (
                            !isNaN(this.safeOptions.min) &&
                            +this.inputValue < +this.safeOptions.min
                        ) {
                            this.inputValue =
                                Sunset.Numbers.fixed(
                                    this.safeOptions.min,
                                    this.digits
                                ) + "";
                        }
                        if (
                            !isNaN(this.safeOptions.max) &&
                            +this.inputValue > +this.safeOptions.max
                        ) {
                            this.inputValue =
                                Sunset.Numbers.fixed(
                                    this.safeOptions.max,
                                    this.digits
                                ) + "";
                        }
                    }
                }
            }
        },
        blurMethod() {
            this.showTips = false;
            this.$emit("blur"); //抛出blur方法，渐进增强独立组件方法
        },
        focusMethod() {
            this.showTips = true;
            this.$emit("focus");
        },
        clear() {
            this.inputValue = "";
            this.$emit("clear");
        },
        changePrepend(v) {
            if (!this.valueLock) {
                var change = this.prependSelect && this.prependSelect.onChange;
                if (change === "CLEAR") {
                    this.inputValue = "";
                } else if (Sunset.isFunction(change)) {
                    change.apply(null, [v, this.value]);
                }
            }
        },
        changeAppend(v) {
            if (!this.valueLock) {
                var change = this.appendSelect && this.appendSelect.onChange;
                if (change === "CLEAR") {
                    this.inputValue = "";
                } else if (Sunset.isFunction(change)) {
                    change.apply(null, [v, this.value]);
                }
            }
        },
        valueToInputValue(v) {
            v = v === void 0 || v === null ? "" : v + "";
            if (!this.lock) {
                this.valueLock = true;
                //拆出前缀
                if (this.defaultPrependValue != null) {
                    this.prependValue = this.defaultPrependValue;
                }
                if (this.prependSelect && ~v.indexOf(this.prependSpliter)) {
                    this.prependValue = v.substring(
                        0,
                        v.indexOf(this.prependSpliter)
                    );
                    v = v.substring(
                        v.indexOf(this.prependSpliter) +
                            this.prependSpliter.length,
                        v.length
                    );
                }
                //拆出后缀
                if (this.defaultAppendValue != null) {
                    this.appendValue = this.defaultAppendValue;
                }
                if (this.appendSelect && ~v.indexOf(this.appendSpliter)) {
                    this.appendValue = v.substring(
                        v.indexOf(this.appendSpliter) +
                            this.prependSpliter.length,
                        v.length
                    );
                    v = v.substring(0, v.indexOf(this.appendSpliter));
                }
                this.inputValue = v;
                this.$nextTick(() => {
                    this.valueLock = false;
                });
            }
        }
    },
    mounted() {
        this.init();
    },
    watch: {
        inputValue(v) {
            this.slientRefreshValue();
        },
        prependValue(v, oldv) {
            this.changePrepend(v);
            this.slientRefreshValue();
        },
        appendValue(v, oldv) {
            this.changeAppend(v);
            this.slientRefreshValue();
        },
        value(v) {
            this.valueToInputValue(v);
        }
    }
};
</script>

<style lang="scss">
@import "~src/style/variable.scss";

$input-height: 28px;

.xui-input {
    box-sizing: border-box;
    display: inline-table;
    flex-direction: row;
    font-size: 0px;
    border: 1px solid $color-border;
    line-height: $input-height;
    height: $input-height;
    border-radius: 2px;
    & > * {
        display: table-cell;
        vertical-align: top;
        font-size: 12px;
    }
    .xui-input-wrap {
        position: relative;
        width: 100%;
        & > div {
            display: table;
            width: 100%;
        }
    }
    .xui-input-inner {
        width: 100%;
        box-sizing: border-box;
    }
    &.clearable {
        .xui-input-inner {
            padding-right: 25px;
        }
    }
    .xui-select {
        vertical-align: top;
        line-height: $input-height;
        height: $input-height;
        min-width: 0px;
        .xui-select-inputwrap {
            border: none;
        }
    }
    .xui-btn {
        vertical-align: top;
        line-height: $input-height;
        height: $input-height;
        min-width: 0px;
        border: none;
        border-radius: 0px;
    }
    .xui-input-inner {
        height: $input-height;
        line-height: $input-height;
        padding: 0px 5px;
        margin: 0px;
        border: none;
        outline: none;
        vertical-align: top;
        font-size: 12px;
    }
    .xui-input-prepend {
        height: 100%;
        border-right: 1px solid $color-border;
        white-space: nowrap;
    }
    .xui-input-append {
        height: 100%;
        border-left: 1px solid $color-border;
        white-space: nowrap;
    }
    .input-clear-icon {
        position: absolute;
        font-size: 20px;
        color: lighten($color-subcolor, 25%);
        cursor: pointer;
        top: 50%;
        right: 0px;
        transform: translate(0%, -50%);
        width: 24px;
        &:hover {
            color: $color-subcolor;
        }
    }
}
</style>
