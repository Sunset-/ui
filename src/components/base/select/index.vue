<template>
    <div ref="reference" :class="['xui-select xui-select-style',cmultiple?'multiple':'',cdisabled?'disabled':'',notEmpty?'not-empty':'',cclearable?'cclearable':'',showDropdown?'open':'']"
        :style="safeOptions.style">
        <div class="xui-select-inputwrap" tabindex="0" @keydown.stop.prevent="keydown" @click="toggleDropdown()">
            <div class="xui-single-text" v-if="!cmultiple" v-show="notEmpty&&!searching" v-html="text(widgetValue)"></div>
            <div class="xui-select-placeholder" v-show="!notEmpty&&!searching">{{cplaceholder}}</div>
            <div v-if="cmultiple" class="xui-select-tags">
                <div v-for="(v,index) in widgetValue" :key="index">
                    <span v-html="text(v)"></span>
                    <i class="xui-icon xui-icon-close" @click.stop="selectItem(v,null,true)"></i>
                </div>
            </div>
            <input v-if="filterable" v-show="searching" ref="search" class="xui-select-search" placeholder="请输入"
                @keydown.stop="keydown" @keyup.stop="keyup" v-model="searchKeyword" @focus="searching=true" @input="filterMethod"
                @click.stop="toggleDropdown(true)" type="text">
            <i v-if="cclearable&&notEmpty" class="select-clear-icon xui-icon xui-icon-delete_fill" @click.stop="clear"></i>
            <i :class="['select-trigger-icon xui-icon xui-icon-unfold',showDropdown?'active':'']"></i>
        </div>
        <select-picker ref="picker" :fixed="true" :class="['xui-select-picker',cmultiple?'multiple':'',cdisabled?'disabled':'',notEmpty?'not-empty':'',cclearable?'cclearable':'',safeOptions.pickerClass]"
            @visible="pickerVisible">
            <ul ref="dropdown" class="xui-select-dropdown" :style="'min-width:'+pickerWidth+'px'">
                <li ref="options" :class="['xui-select-option',notEmpty&&(item.value===widgetValue)?'active':'',disabledOptions(item)?'disabled':'',hoverSelectItem==item?'hover':'']"
                    v-for="(item,index) in filterItems||items" :key="index" v-html="item.text" @click.stop="selectItem(item.value,item)"></li>
            </ul>
        </select-picker>
    </div>
</template>
<script>
import Sunset from "../../../common/sunset";
import Utils from "../../Helper.js";
import selectPicker from "../picker";

export default {
    components: {
        selectPicker
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
        disabled: {},
        multiple: {},
        placeholder: {}
    },
    data() {
        return {
            searching: false,
            groupable: false,
            showDropdown: false,
            originItems: [],
            items: [],
            filterItems: null,
            lock: false,
            searchKeyword: "",
            hoverSelectItem: null,
            pickerWidth: 200
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        cdisabled() {
            return this.disabled === true || this.safeOptions.disabled === true;
        },
        cplaceholder() {
            return this.placeholder || this.safeOptions.placeholder || "请选择";
        },
        cclearable() {
            return this.safeOptions.clearable !== false;
        },
        cmultiple() {
            return this.multiple || this.safeOptions.multiple;
        },
        csize() {
            return this.size || this.safeOptions.size;
        },
        spliter() {
            return this.safeOptions.spliter || ",";
        },
        filterable() {
            return this.safeOptions.filter;
        },
        notEmpty() {
            var widgetValue = this.widgetValue;
            if (widgetValue === void 0 || widgetValue === null || widgetValue === "" ) {
                return false;
            }
            return true;
        },
        widgetValue: {
            set(v) {
                var value;
                if (Sunset.isArray(v)) {
                    if (this.options.max) {
                        if (v.length > this.options.max) {
                            Sunset.tip(`最多选择${this.options.max}个`);
                            v.pop();
                        }
                    }
                    value = v.length ? v.join(this.spliter) : "";
                } else {
                    value = v;
                }
                this.$emit("input", value);
                if (value != this.value) {
                    this.$emit("change", value);
                    this.$nextTick(() => {
                        this.$refs.picker && this.$refs.picker.update();
                    });
                }
            },
            get() {
                var value = this.value;
                var widgetValue = null;
                if (this.cmultiple) {
                    if (Sunset.isArray(value)) {
                        widgetValue = value;
                    } else {
                        widgetValue = !!value ? value.split(this.spliter) : [];
                    }
                } else {
                    widgetValue = value;
                }
                return widgetValue;
            }
        }
    },
    methods: {
        init() {
            this.$nextTick(() => {
                Utils.generateItems(this.options).then(items => {
                    var groups = {},
                        others = [],
                        groupable = false;
                    items &&
                        items.forEach(item => {
                            if (item.group) {
                                groupable = true;
                                (
                                    groups[item.group] ||
                                    (groups[item.group] = [])
                                ).push(item);
                            } else {
                                others.push(item);
                            }
                        });
                    if ((this.groupable = groupable)) {
                        var groupItems = [];
                        for (var g in groups) {
                            if (groups.hasOwnProperty(g)) {
                                groupItems.push({
                                    group: g,
                                    items: groups[g]
                                });
                            }
                        }
                        others.length &&
                            groupItems.push({
                                group: "其他",
                                items: others
                            });
                        this.items = groupItems;
                    } else {
                        this.items = items;
                    }
                    this.originItems = this.items;
                    this.elWidth = this.$el.clientWidth;
                });
            });
            this.refreshPickerWidth();
        },
        refreshPickerWidth() {
            this.pickerWidth = this.$el.clientWidth;
        },
        toggleDropdown(flag) {
            if (this.cdisabled) {
                return;
            }
            this.refreshPickerWidth();
            var visible = this.$refs.picker.toggle(flag);
            if (visible) {
                if (this.filterable) {
                    this.searching = true;
                }
                if (!this.cmultiple) {
                    this.hoverSelectItem = this.getItemByValue(
                        this.widgetValue
                    );
                    this.$nextTick(() => {
                        this.activeSearchResultItem();
                    });
                }
                this.getItemByValue(this.value);
            } else {
                this.searching = false;
                this.searchKeyword = "";
                this.hoverSelectItem = null;
                this.filterMethod();
            }
        },
        text(value) {
            var currentItem = this.getItemByValue(value);
            if (currentItem !== null) {
                return Sunset.isFunction(this.safeOptions.format)
                    ? this.safeOptions.format(currentItem)
                    : currentItem.text;
            } else {
                return "";
            }
        },
        getItemByValue(v) {
            var items = this.items.filter(item => item.value === v);
            return items.length ? items[0] : null;
        },
        selectItem(value, item, fromRemove) {
            if (this.cdisabled) {
                return;
            }
            if (!item) {
                item = this.getItemByValue(value);
            }
            var isDisabled = this.disabledOptions(item);
            if (isDisabled && !fromRemove) {
                return;
            }
            if (!this.cmultiple) {
                this.widgetValue = value;
                this.toggleDropdown(false);
            } else {
                var index;
                if ((index = this.widgetValue.indexOf(value)) >= 0) {
                    this.widgetValue.splice(index, 1);
                } else {
                    this.widgetValue.push(value);
                }
                this.widgetValue = this.widgetValue.slice(0);
            }
        },
        clear() {
            this.widgetValue = void 0;
        },
        disabledOptions(item) {
            return Sunset.isFunction(this.options.disabledOptions)
                ? this.options.disabledOptions(item)
                : false;
        },
        pickerVisible(v) {
            this.showDropdown = v;
            if (!v) {
                this.searching = false;
            }
        },
        /********  过滤 *********/
        filterMethod() {
            var v = this.searchKeyword.toLowerCase();
            if (v == "" || v == void 0) {
                this.filterItems = null;
                return;
            }
            var filterMethod = Sunset.isFunction(
                this.options && this.options.filter
            )
                ? this.options.filter
                : function(item, v) {
                      return (
                          (item.text + "").toLowerCase().indexOf(v) >= 0 ||
                          (item.value + "").toLowerCase().indexOf(v) >= 0 ||
                          (item.keywords &&
                              (item.keywords + "").toLowerCase().indexOf(v) >=
                                  0)
                      );
                  };
            var filterItems = this.items.filter(item => {
                return filterMethod(item, v);
            });
            this.filterItems = filterItems;
        },
        /********  键盘选择 *********/
        keydown(ev) {
            var widgetValue = this.widgetValue;
            switch (ev.keyCode) {
                case 38:
                    this.activeSearchResultItem(-1);
                    break;
                case 40:
                    this.activeSearchResultItem(1);
                    break;
                case 13:
                    if (this.hoverSelectItem != null) {
                        this.selectItem(
                            this.hoverSelectItem.value,
                            this.hoverSelectItem
                        );
                    }
                    break;
                case 8:
                    if (this.searchKeyword === "") {
                        if (this.cmultiple && this.widgetValue.length) {
                            this.widgetValue = this.widgetValue.slice(
                                0,
                                this.widgetValue.length - 1
                            );
                        }
                    }
                    this.hoverSelectItem = null;
                    break;
            }
        },
        keyup(ev) {
            this.$emit("searchKeyword", this.searchKeyword);
        },
        activeSearchResultItem(which) {
            var list = this.filterItems || this.items,
                current = this.hoverSelectItem,
                length = list.length;
            if (which) {
                var index = list.indexOf(current);
                index += which;
                if (index < 0) {
                    index += length;
                }
                index %= length;
                current = list[index];
                var i = 0;
                while (this.disabledOptions(current)) {
                    index += which;
                    if (index < 0) {
                        index += length;
                    }
                    index %= length;
                    current = list[index];
                    i++;
                    if (i - 1 >= list.length) {
                        break;
                    }
                }
            }
            this.hoverSelectItem = current;
            setTimeout(() => {
                var $dropdown = this.$refs.dropdown;
                var $wrap = $dropdown.parentNode.parentNode;
                var $activer = this.$refs.options.filter(
                    item => item.className.indexOf("hover") >= 0
                )[0];
                var activeIndex = this.$refs.options.indexOf($activer);
                if ($activer) {
                    var height = $activer.clientHeight;
                    var diff = (activeIndex + 1) * height - $wrap.clientHeight;
                    if (diff > 0) {
                        $wrap.scrollTop = diff;
                    } else {
                        $wrap.scrollTop = 0;
                    }
                }
            }, 0);
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
@import "~style/variable.scss";

$select-height: 28px;

.xui-select {
    display: inline-block;
    color: $color-content;
    z-index: 10;
    min-width: 50px;
    font-size: 12px;
    .xui-select-inputwrap {
        outline: none;
        position: relative;
        min-height: $select-height;
        line-height: $select-height;
        padding: 0px 25px 0px 5px;
        border: 1px solid $color-border;
        border-radius: 2px;
        cursor: pointer;
        display: table;
        width: 100%;
        box-sizing: border-box;
        & > * {
            display: inline-block;
        }
    }
    .xui-select-placeholder {
        color: $color-disabled;
    }
    .xui-select-tags {
        flex-grow: 1;
        & > div {
            display: inline-block;
            border: 1px solid $color-border;
            background: $color-background;
            padding: 3px 5px;
            line-height: 1;
            border-radius: 2px;
            margin-right: 5px;
            i {
                font-size: 12px;
                &:hover {
                    color: $color-primary;
                }
            }
            &:last-child {
                margin-right: 0px;
            }
        }
    }
    .xui-select-search {
        height: $select-height;
        border: none;
        outline: none;
        font-size: 14px;
        font-family: 微软雅黑;
        flex: 10;
        padding: 0px 0px 0px 5px;
        margin: 0px;
        line-height: $select-height;
    }
    .select-trigger-icon {
        position: absolute;
        right: 5px;
        top: 0px;
        transition: all 0.3s;
        transform: rotate(0deg);
        &.active {
            transform: rotate(180deg);
        }
    }
    .select-clear-icon {
        position: absolute;
        right: 3px;
        top: 0px;
        font-size: 20px;
        color: lighten($color-subcolor, 25%);
        cursor: pointer;
        &:hover {
            color: $color-subcolor;
        }
    }
    &.not-empty.cclearable:not(.disabled) {
        &:hover {
            .select-clear-icon {
                display: block;
            }
            .select-trigger-icon {
                display: none;
            }
        }
    }
    .select-clear-icon {
        visibility: hidden;
    }
    &:hover {
        .select-clear-icon {
            visibility: visible;
        }
    }
    &.disabled {
        cursor: not-allowed;
        * {
            cursor: not-allowed;
        }
        .xui-select-inputwrap {
            background: $color-divider;
            .select-clear-icon {
                display: none;
            }
        }
    }
}
.xui-select-picker {
    max-height: 200px;
    display: flex;
    background: #fff;
    font-size: 12px;
    & > * {
        width: 100%;
    }
    .xui-select-dropdown {
        list-style-type: none;
        padding: 0px;
        margin: 0px;
    }
    .xui-select-option {
        list-style-type: none;
        padding: 8px;
        margin: 0px;
        cursor: pointer;
        &:hover,
        &.hover {
            background: darken($color-background, 2%);
        }
        &.active {
            background: $color-primary;
            color: #fff;
        }
        &.disabled {
            color: $color-disabled;
            cursor: not-allowed;
            &:hover,
            &.hover {
                background: inherit;
            }
        }
    }
    &.multiple {
        .xui-select-option {
            &.active {
                background: #fff;
                color: $color-primary;
                &:after {
                    content: "\E750";
                    font-family: "iconfont" !important;
                    float: right;
                    font-size: 18px;
                }
                &:hover,
                &.hover {
                    background: $color-background;
                }
            }
        }
    }
}
</style>
