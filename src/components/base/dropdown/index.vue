<template>
    <div ref="reference" :class="['xui-dropdown xui-dropdown-style']">
        <dropdown-button class="xui-dropdown-trigger" :size="size" :disabled="checkDisabled(options)" :options="options" @click="toggleDropdown">
            {{options.label}}
            <i class="xui-icon xui-icon-unfold"></i>
        </dropdown-button>
        <dropdown-picker ref="picker" class="xui-dropdown-picker">
            <ul ref="dropdown" class="xui-dropdown-ul">
                <template v-for="(item,index) in items">
                    <li v-if="item.line" :key="index" class="xui-dropdown-line" :style="item.style"></li>
                    <li v-if="!item.line" :key="index" :class="['xui-dropdown-option',checkDisabled(item)?'disabled':'']" :style="item.style" @click="operate(item)">
                        <i v-if="item.icon" :class="item.icon"></i>
                        {{item.label}}
                    </li>
                </template>
            </ul>
        </dropdown-picker>
    </div>
</template>
<script>
import Helper from "../../Helper.js";
import Sunset from "../../../common/sunset";
import dropdownButton from "../button";
import dropdownPicker from "../picker";

export default {
    components: {
        dropdownButton,
        dropdownPicker
    },
    props: {
        options: {},
        disabled: {},
        ctx: {},
        size: {}
    },
    data() {
        return {};
    },
    computed: {
        items() {
            var tools = this.options.items || [];
            return (
                tools &&
                tools.filter(item => {
                    if (item.premise && Sunset.isFunction(item.premise)) {
                        return item.premise(this.ctx);
                    } else {
                        return true;
                    }
                })
            );
        }
    },
    methods: {
        toggleDropdown() {
            if (this.checkDisabled(this.options)) {
                return;
            }
            this.$refs.picker.toggle();
        },
        checkDisabled(tool) {
            var disabledValue = false;
            if (tool.disabled === true) {
                disabledValue = true;
            } else if (Sunset.isFunction(tool.disabled)) {
                disabledValue = !!tool.disabled(this.ctx);
            } else {
                disabledValue = false;
            }
            return disabledValue;
        },
        operate(item) {
            if (this.checkDisabled(item)) {
                return;
            }
            Helper.operate.call(this, item, this.ctx);
            this.$refs.picker.toggle();
        }
    }
};
</script>
<style lang="scss">
@import "~src/style/variable.scss";

.xui-dropdown {
    display: inline-block;
    .xui-dropdown-trigger {
    }
    .xui-dropdown-picker {
        max-height: 200px;
        display: flex;
        background: #fff;
        z-index: 900;
        & > * {
            width: 100%;
        }
        .xui-dropdown-ul {
            list-style-type: none;
            padding: 0px;
            margin: 0px;
            .xui-dropdown-line {
                height: 1px;
                width: 100%;
                background: #dedede;
            }
            .xui-dropdown-option {
                margin: 0;
                line-height: normal;
                padding: 7px 16px;
                clear: both;
                color: #495060;
                font-size: 12px !important;
                white-space: nowrap;
                list-style: none;
                cursor: pointer;
                transition: background 0.2s ease-in-out;
                &:hover {
                    background: $color-background;
                }
                &.disabled {
                    cursor: not-allowed;
                    color: $color-disabled;
                }
            }
        }
    }
}
</style>
