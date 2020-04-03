<template>
    <input :class="['xui-switch xui-switch-style',canimate?'xui-switch-anim':'',csize?('xui-switch-'+csize):'',cdisabled?'disabled':'']" type="checkbox" :title="ctitle" :disabled="cdisabled" v-model="widgetValue">
</template>
<script>
import Sunset from "../../../common/sunset";
import Helper from "../../Helper";

export default {
    model: {
        prop: "value",
        event: "input"
    },
    props: {
        animate: {},
        size: {},
        disabled: {},
        options: {
            type: Object
        },
        ctx: {},
        value: {}
    },
    data() {
        var widgetValue = !!this.value;
        var d = this.options && this.options.default;
        if (this.value === void 0) {
            if (Sunset.isBoolean(d)) {
                widgetValue = d;
            } else if (Sunset.isFunction(d)) {
                widgetValue = d(this.ctx);
            }
            this.$nextTick(() => {
                this.emitValue(widgetValue, true);
            });
        }
        return {
            widgetValue: widgetValue,
            resetLock: false
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        canimate() {
            return this.animate !== false && this.safeOptions.animate !== false;
        },
        csize() {
            return this.size || this.safeOptions.size;
        },
        default() {
            return this.safeOptions.default;
        },
        cdisabled() {
            return (
                this.disabled ||
                Helper.checkDisabled(this.safeOptions, this.ctx)
            );
        },
        ctitle() {
            return this.title || this.safeOptions.title || "";
        }
    },
    methods: {
        reset(v) {
            this.widgetValue = !!v;
        },
        slientReset(v) {
            this.resetLock = true;
            this.reset(v);
            this.$nextTick(() => {
                this.resetLock = false;
            });
        },
        emitValue(v, slient) {
            if (this.resetLock) {
                return;
            }
            //change事件传递第三个参数为设值函数，用于处理开关回退等功能
            this.$emit("input", v, this.safeOptions, rv => {
                this.slientReset(rv);
            });
            if (!slient) {
                this.$emit("change", v, this.safeOptions, rv => {
                    this.slientReset(rv);
                });
            }
        }
    },
    watch: {
        widgetValue(v) {
            this.emitValue(v);
        },
        value(v) {
            this.widgetValue = v;
        },
        ctx(v) {
            var widgetValue = !!this.value;
            var d = this.options && this.options.default;
            if (this.value === void 0) {
                if (Sunset.isBoolean(d)) {
                    widgetValue = d;
                } else if (Sunset.isFunction(d)) {
                    widgetValue = d(this.ctx);
                }
            }
            this.widgetValue = widgetValue;
            this.resetLock = true;
            this.$nextTick(() => {
                this.resetLock = false;
            });
        }
    }
};
</script>
<style lang="scss">
@mixin borderRadius($radius: 20px) {
    border-radius: $radius;
    border-top-left-radius: $radius;
    border-top-right-radius: $radius;
    border-bottom-left-radius: $radius;
    border-bottom-right-radius: $radius;
}

$duration: 0.15s;

$checkedColor: #2d8cf0;
$backgroundColor: #ccc;
$borderColor: #dfdfdf;
$disabledColor: #acacac;
$disabledBgColor: #ddd;

$sizes: (
    (
        name: "mini",
        width: 30px,
        height: 16px
    ),
    (
        name: "small",
        width: 36px,
        height: 19px
    ),
    (
        name: "big",
        width: 52px,
        height: 27px
    )
);
$width: 46px;
$height: 24px;

.xui-switch {
    width: $width;
    height: $height;
    position: relative;
    border: 1px solid $borderColor;
    background-color: $backgroundColor;
    box-shadow: $borderColor 0 0 0 0 inset;
    @include borderRadius();
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;
    cursor: pointer;
    vertical-align: middle;
    &:before {
        content: "";
        width: $height - 2px;
        height: $height - 2px;
        position: absolute;
        top: 0px;
        left: 0;
        @include borderRadius();
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }
    &:checked {
        border-color: $checkedColor;
        box-shadow: $checkedColor 0 0 0 16px inset;
        background-color: $checkedColor;
        &:before {
            left: $width - $height;
        }
    }
    &.xui-switch-anim {
        transition: border cubic-bezier(0, 0, 0, 1) $duration,
            box-shadow cubic-bezier(0, 0, 0, 1) $duration;
        &:before {
            transition: left 0.3s;
        }
        &:checked {
            box-shadow: $checkedColor 0 0 0 16px inset;
            background-color: $checkedColor;
            transition: border ease $duration, box-shadow ease $duration,
                background-color ease $duration * 3;
            &:before {
                transition: left 0.3s;
            }
        }
    }
    // size
    @for $i from 1 through length($sizes) {
        $item: nth($sizes, $i);
        &.xui-switch-#{map-get($item, name)} {
            width: map-get($item, width);
            height: map-get($item, height);
            &:before {
                width: map-get($item, height)-2px;
                height: map-get($item, height)-2px;
            }
            &:checked:before {
                left: map-get($item, width) - map-get($item, height);
            }
        }
    }
    //disabled
    &.disabled {
        cursor: not-allowed;
        background-color: $disabledBgColor;
        &:before {
            background-color: $disabledColor;
        }
        &:checked {
            border-color: $disabledBgColor;
            box-shadow: $disabledBgColor 0 0 0 16px inset;
        }
    }
}
</style>
