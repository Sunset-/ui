<template>
    <div class="xui-tabs xui-tabs-style">
        <div role="xui-tabs-tablist" class="xui-tabs-nav">
            <div v-for="tab in items" :key="tab.value" :label="tab.label||tab.text" :name="tab.value" @click="navClick(tab)" :class="['xui-tab-item',{'is-active':tab.value==widgetValue}]" v-html="tab.label||tab.text"></div>
        </div>
    </div>
</template>
<script>
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
        value: {}
    },
    data() {
        return {
            items: []
        };
    },
    computed: {
        widgetValue: {
            set(v) {
                this.$emit("input", v);
                if (v != this.value) {
                    this.$emit("change", v);
                }
            },
            get() {
                return this.value;
            }
        },
        safeOptions() {
            return this.options || {};
        }
    },
    methods: {
        init() {
            this.$emit("pending");
            Utils.generateItems(this.safeOptions).then(items => {
                this.items = items;
                if (
                    this.safeOptions.defaultFirst &&
                    (this.value === void 0 ||
                        this.value === "0" ||
                        this.value.length == 0) &&
                    this.items.length
                ) {
                    this.widgetValue = this.items[0].value;
                }
                this.$emit("ready", this.safeOptions.name, this.widgetValue);
            });
        },
        navClick(v) {
            if (this.disabled === true) {
                return;
            }
            this.widgetValue = v.value;
            this.$emit("selected", v.value);
        },
        refresh() {
            this.init();
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
    }
};
</script>
<style lang="scss">
.xui-tabs {
    position: relative;
    border-bottom: 1px solid #dddee1;
    .xui-tab-item {
        padding: 0 20px;
        height: 40px;
        box-sizing: border-box;
        line-height: 40px;
        display: inline-block;
        list-style: none;
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        position: relative;
        cursor: pointer;
        min-width: 80px;
        text-align: center;
        &:hover {
            color: #409eff;
        }
        &.is-active {
            color: #409eff;
            border-bottom: 2px solid #409eff;
        }
    }
    .xui-tabs-nav {
        white-space: nowrap;
        position: relative;
        z-index: 2;
        margin-bottom: -1px;
    }
}
</style>