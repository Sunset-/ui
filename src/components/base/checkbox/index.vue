<template>
    <div class="xui-checkbox-group xui-checkbox-style" :disabled="cdisabled" :class="{'dark':theme==='dark'}">
        <template v-if="items.length">
            <label class="xui-checkbox" :key="item.value" v-for="item in items" :class="[safeOptions.size?('xui-checkbox-'+safeOptions.size):'',{'is-disabled': cdisabled || item.disabled,'is-checked': isChecked(item)}]">
                <span class="xui-checkbox-inner">
                    <input type="checkbox" :name="name" :value="item.value" :disabled="cdisabled || item.disabled" class="xui-checkbox-original" @change="check(item)" />
                </span>
                <span class="xui-checkbox-label" v-if="item.text">
                    {{item.text}}
                </span>
            </label>
        </template>
        <label class="xui-checkbox" v-if="!items.length" :class="{'is-disabled': cdisabled,'is-checked': value,'xui-checkbox-single' : true}">
            <span class="xui-checkbox-inner">
                <input type="checkbox" :disabled="cdisabled" class="xui-checkbox-original" @change="check()" />
            </span>
            <span class="xui-checkbox-label" v-if="safeOptions.text">
                {{safeOptions.text}}
            </span>
        </label>
    </div>
</template>
<script>
import Sunset from "../../../common/sunset";
import Utils from "../../Helper.js";

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
        value: {},
        theme: {
            type: String,
            default: "light"
        }
    },
    data() {
        return {
            name: "xui-checkbox",
            items: []
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        cdisabled() {
            return this.disabled === true || this.safeOptions.disabled === true;
        },
        isCheckGroup() {
            return this.safeOptions.data || this.safeOptions.enum;
        },
        spliter() {
            return this.safeOptions.spliter || ",";
        },
        errorHandle() {
            return this.safeOptions.errorHandle || false;
        }
    },
    methods: {
        init() {
            this.items = [];
            this.$nextTick(() => {
                Utils.generateItems(this.safeOptions).then(items => {
                    this.items = JSON.parse(JSON.stringify(items));
                });
            });
        },
        isChecked(item) {
            var value = this.value;
            if (value === void 0 || value === null) {
                return false;
            } else {
                if (this.safeOptions.bit) {
                    return (+value & +item.value) === +item.value;
                } else {
                    value += "";
                    var values = value.split(this.spliter);
                    return values.indexOf(item.value) >= 0;
                }
            }
        },
        check(item) {
            //禁用则返回
            if (this.cdisabled) {
                return;
            }
            var currentValue = this.value;
            var value = void 0;
            if (this.isCheckGroup) {
                if (currentValue === void 0 || currentValue === null) {
                    value = item.value;
                } else {
                    if (this.safeOptions.bit) {
                        currentValue = +currentValue;
                        var itemValue = +item.value;
                        if ((currentValue & itemValue) == itemValue) {
                            value = currentValue - itemValue;
                        } else {
                            value = currentValue + itemValue;
                        }
                        if (value == 0) {
                            value = void 0;
                        }
                    } else {
                        currentValue += "";
                        var values = currentValue.split(this.spliter);
                        var index = values.indexOf(item.value);
                        if (index < 0) {
                            values.push(item.value);
                        } else {
                            values.splice(index, 1);
                        }
                        if (values.length) {
                            value = values.join(this.spliter);
                        } else {
                            value = void 0;
                        }
                    }
                }
            } else {
                value = !currentValue;
            }
            this.$emit("input", value);
            if (value !== this.value) {
                this.$emit("change", value);
            }
        }
    },
    mounted() {
        this.init();
        this.$watch("options.data", function() {
            this.init();
        });
        this.$watch("options.enum", function() {
            this.init();
        });
        this.$watch("value", function() {
            this.init();
        });
    }
};
</script>
<style lang="scss">
.xui-checkbox-group {
    $borderColor: #dcdfe6;
    $sizes: (
        (
            name: "mini",
            font: 12
        ),
        (
            name: "small",
            font: 14
        ),
        (
            name: "normal",
            font: 16
        )
    );

    .xui-checkbox.is-checked .xui-checkbox-inner {
        background-color: #409eff;
        border-color: #409eff;
    } //禁用

    .xui-checkbox.is-disabled .xui-checkbox-inner {
        background-color: #edf2fc;
        border-color: $borderColor;
        cursor: not-allowed;
    } //禁用
    .xui-checkbox.is-disabled span.xui-checkbox-label {
        color: #c0c4cc;
        cursor: not-allowed;
    }
    .xui-checkbox.is-disabled.is-checked .xui-checkbox-inner {
        background-color: #f2f6fc;
        border-color: $borderColor;
    }
    .xui-checkbox.is-disabled.is-checked .xui-checkbox-inner:after {
        border-color: #c0c4cc;
    }
    .xui-checkbox-inner {
        vertical-align: middle;
        display: inline-block;
        position: relative;
        border: 1px solid $borderColor;
        border-radius: 2px;
        box-sizing: border-box;
        width: 14px;
        height: 14px;
        background-color: #fff;
        z-index: 1;
        transition: border-color 0.15s cubic-bezier(0.71, -0.46, 0.29, 1.46),
            background-color 0.15s cubic-bezier(0.71, -0.46, 0.29, 1.46);
        -webkit-transition: border-color 0.15s
                cubic-bezier(0.71, -0.46, 0.29, 1.46),
            background-color 0.15s cubic-bezier(0.71, -0.46, 0.29, 1.46);
    }
    .xui-checkbox-label {
        display: inline-block;
        vertical-align: middle;
    }
    .xui-checkbox-original {
        opacity: 0;
        outline: none;
        position: absolute;
        margin: 0;
        width: 0;
        height: 0;
        z-index: -1;
    }
    .xui-checkbox-inner:after {
        box-sizing: content-box;
        content: "";
        border: 1px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0) translateZ(0);
        width: 3px;
        transition: transform 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
        -webkit-transition: transform 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6)
            0.05s;
        transform-origin: center;
    }
    .xui-checkbox.is-checked .xui-checkbox-inner:after {
        transform: rotate(45deg) scaleY(1) translateZ(0);
    }
    .xui-checkbox {
        display: inline-block;
        margin: 5px 15px 5px 0px;
        &.xui-checkbox-single {
            margin: 0px;
        }
    }
    //size
    @for $i from 1 through length($sizes) {
        $item: nth($sizes, $i);
        .xui-checkbox-#{map-get($item, name)} {
            .xui-checkbox-label {
                font-size: map-get($item, font) + px;
            }
            .xui-checkbox-inner {
                width: map-get($item, font) + px;
                height: map-get($item, font) + px;
            }
            .xui-checkbox-inner:after {
                box-sizing: content-box;
                content: "";
                border: 1px solid #fff;
                border-left: 0;
                border-top: 0;
                height: map-get($item, font) / 2 + px;
                left: map-get($item, font) / 4 + px;
                position: absolute;
                top: 1px;
                transform: rotate(45deg) scaleY(0);
                width: map-get($item, font) / 2-3 + px;
                transform-origin: center;
            }
        }
    }
}
.xui-checkbox-group.dark {
    $darkBorderColor: #11b1e1;
    .xui-checkbox.is-checked .xui-checkbox-inner {
        background-color: transparent;
        border-color: $darkBorderColor;
    }
    .xui-checkbox-inner {
        border-color: $darkBorderColor;
        background-color: transparent;
    }
    .xui-checkbox-inner:after {
        border-color: $darkBorderColor;
    }
}
</style>