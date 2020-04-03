<template>
    <div ref="reference" :class="['xui-cascader xui-cascader-style',cdisabled?'disabled':'',notEmpty?'not-empty':'',cclearable?'cclearable':'']" :style="safeOptions.style">
        <div class="xui-cascader-inputwrap" tabindex="0" @keydown.stop.prevent="keydown" @click="toggleDropdown()">
            <div class="xui-single-text" v-show="notEmpty" :title="text" v-html="text"></div>
            <div class="xui-cascader-placeholder" v-show="!notEmpty">{{cplaceholder}}</div>
            <i v-if="cclearable&&notEmpty" class="select-clear-icon xui-icon xui-icon-delete_fill" @click.stop="clear"></i>
            <i :class="['select-trigger-icon xui-icon xui-icon-unfold',showDropdown?'active':'']"></i>
        </div>
        <select-picker ref="picker" :fixed="true" :class="['xui-cascader-picker',cdisabled?'disabled':'',notEmpty?'not-empty':'',cclearable?'cclearable':'',safeOptions.pickerClass]" @visible="pickerVisible">
            <div class="xui-cascader-dropdown">
                <cascader-scroll ref="firstscroll" class="xui-cascader-group">
                    <div :class="['xui-cascader-option',activeValue(item,0)?'active':'']" v-for="item in roots" :key="item[valueKey]" @click="selectValue(item,0)">
                        <span :title="item[textKey]">{{item[textKey]}}</span>
                        <i v-if="isParent(item)" class="xui-cascader-enter xui-icon xui-icon-enter"></i>
                    </div>
                </cascader-scroll>
                <cascader-scroll ref="scroll" class="xui-cascader-group" v-show="getGroup(levelValue)" v-for="(levelValue,index) in levelValues" :key="index">
                    <div :class="['xui-cascader-option',activeValue(item,index+1)?'active':'']" v-for="item in getGroup(levelValue)" :key="item[valueKey]" @click="selectValue(item,index+1)">
                        <span :title="item[textKey]">{{item[textKey]}}</span>
                        <i v-if="isParent(item)" class="xui-cascader-enter xui-icon xui-icon-enter"></i>
                    </div>
                </cascader-scroll>
            </div>
        </select-picker>
    </div>
</template>
<script>
import Sunset from "../../../common/sunset";
import Utils from "../../Helper.js";
import selectPicker from "../picker";
import CascaderScroll from "../scroll";

export default {
    components: {
        selectPicker,
        CascaderScroll
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
            roots: [],
            id_item: {},
            parent_children: {},
            groups: [],
            showDropdown: false,
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
        spliter() {
            return this.safeOptions.spliter || ",";
        },
        parentKey() {
            return (
                (this.safeOptions.key && this.safeOptions.key.parent) ||
                "parent"
            );
        },
        textKey() {
            return (
                (this.safeOptions.key && this.safeOptions.key.text) || "text"
            );
        },
        valueKey() {
            return (
                (this.safeOptions.key && this.safeOptions.key.value) || "value"
            );
        },
        notEmpty() {
            var widgetValue = this.widgetValue;
            if (
                widgetValue === void 0 ||
                widgetValue === null ||
                widgetValue.length == 0
            ) {
                return false;
            }
            return true;
        },
        noLevel() {
            return this.safeOptions.level === false;
        },
        widgetValue: {
            set(v) {
                var value;
                if (Sunset.isArray(v)) {
                    value = v.length ? v.join(this.spliter) : "";
                } else {
                    value = v;
                }
                this.$emit("input", v.join(this.spliter));
                if (value != this.value) {
                    this.$emit("change", value);
                }
                this.$nextTick(() => {
                    var scrolls = this.$refs.scroll;
                    scrolls && scrolls.forEach(s => s.update());
                });
            },
            get() {
                var value = this.value;
                var widgetValue = null;
                if (value && value.length) {
                    widgetValue = value.split(this.spliter);
                } else {
                    widgetValue = [];
                }
                return widgetValue;
            }
        },
        levelValues() {
            var widgetValue = this.widgetValue;
            if (!widgetValue || widgetValue.length == 0) {
                return [];
            }
            if (this.noLevel) {
                var v = widgetValue[0];
                var levelValues = [v];
                var parent = this.id_item[v];
                var parentKey = this.parentKey;
                var valueKey = this.valueKey;
                while (parent) {
                    parent = this.id_item[parent[parentKey]];
                    if (parent) {
                        levelValues.unshift(parent[valueKey]);
                    }
                }
                return levelValues;
            } else {
                return widgetValue;
            }
        },
        text() {
            var levelValues = this.levelValues;
            if (!levelValues || levelValues.length == 0) {
                return "";
            } else {
                var items = levelValues.map(v => this.id_item[v] || v);
            }
            return Sunset.isFunction(this.safeOptions.format)
                ? this.safeOptions.format(items)
                : items
                      .map(item =>  
                          Sunset.isObject(item) ? item[this.textKey] : item 
                      )
                      .join(this.spliter);
        }
    },
    methods: {
        init() {
            this.$nextTick(() => {
                var data = this.safeOptions.data;
                Promise.resolve(Sunset.isFunction(data) ? data() : data).then(
                    res => {
                        if (Sunset.isArray(res)) {
                            var parentKey = this.parentKey;
                            var valueKey = this.valueKey;
                            var roots = [];
                            var parent_children = {};
                            var id_item = {};
                            res.forEach(item => {
                                var parent = item[parentKey];
                                if (
                                    parent === void 0 ||
                                    parent == this.safeOptions.root
                                ) {
                                    roots.push(item);
                                } else {
                                    parent_children[item[parentKey]] =
                                        parent_children[item[parentKey]] || [];
                                    parent_children[item[parentKey]].push(item);
                                }
                                id_item[item[valueKey]] = item;
                            });
                            this.roots = roots;
                            this.groups = [roots];
                            this.id_item = id_item;
                            this.parent_children = parent_children;
                        }
                    }
                );
            });
            this.refreshPickerWidth();
        },
        getGroup(parent) {
            return this.parent_children[parent] || null;
        },
        selectValue(item, index) {
            var level = this.calculateLevel(item);
            var newValue = item[this.valueKey];
            var widgetValue = this.widgetValue;
            if (this.noLevel) {
                this.widgetValue = [newValue];
            } else {
                if (widgetValue[level] != newValue) {
                    this.widgetValue = widgetValue
                        .slice(0, level)
                        .concat([newValue]);
                }
            }
            if (!this.isParent(item)) {
                this.toggleDropdown();
            }
        },
        calculateLevel(item) {
            var parentKey = this.parentKey,
                root = this.safeOptions.root,
                id_item = this.id_item,
                level = 0;
            if (item[parentKey] === root) {
                return level;
            }
            var parent = item;
            while (true) {
                parent = id_item[parent[parentKey]];
                if (parent) {
                    level++;
                } else {
                    break;
                }
            }
            return level;
        },
        activeValue(item, index) {
            var itemValue = item[this.valueKey];
            var levelValues = this.levelValues;
            return levelValues[index] === itemValue;
        },
        isParent(item) {
            var itemValue = item[this.valueKey];
            return !!this.parent_children[itemValue];
        },
        refreshPickerWidth() {
            this.pickerWidth = this.$el.clientWidth;
        },
        toggleDropdown(flag) {
            if (this.cdisabled) {
                return;
            }
            this.$refs.picker.toggle(flag);
        },
        clear() {
            this.widgetValue = [];
        },
        disabledOptions(item) {
            return Sunset.isFunction(this.options.disabledOptions)
                ? this.options.disabledOptions(item)
                : false;
        },
        pickerVisible: function(e) {
            if (!e) {
                var t = this.value;
                t &&
                    this.safeOptions.onlyLeaf &&
                    this.parent_children[t] &&
                    this.clear();
            }else{
                this.$nextTick(() => {
                    if(this.$refs.firstscroll){
                        this.$refs.firstscroll.update();
                    }
                    var scrolls = this.$refs.scroll;
                    scrolls && scrolls.forEach(s => s.update());
                });
            }
            this.showDropdown = e;
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

.xui-cascader {
	display: inline-block;
	color: $color-content;
	z-index: 10;
	min-width: 50px;
	font-size: 12px;
	.xui-cascader-inputwrap {
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
		.xui-single-text {
			position: absolute;
			top: 0px;
			left: 10px;
			right: 20px;
			bottom: 0px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
	.xui-cascader-placeholder {
		color: $color-disabled;
	}
	.xui-cascader-tags {
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
	.select-trigger-icon {
		position: absolute;
		right: 5px;
		top: 0px;
		transition: all 0.3s;
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
		.xui-cascader-inputwrap {
			background: $color-divider;
			.select-clear-icon {
				display: none;
			}
		}
	}
}
.xui-cascader-picker {
	max-height: 200px;
	display: flex;
	background: #fff;
	font-size: 0px;
	& > * {
		width: 100%;
	}
	.xui-cascader-dropdown {
		list-style-type: none;
		padding: 0px;
		margin: 0px;
		height: 190px;
		.xui-cascader-group {
			display: inline-block;
			width: 120px;
			height: 100%;
			padding: 0px;
			font-size: 12px;
			border-right: 1px solid $color-border;
		}
	}
	.xui-cascader-option {
		position: relative;
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
		.xui-cascader-enter {
			position: absolute;
			right: 5px;
			top: 50%;
			transform: translateY(-50%);
			font-size: 12px;
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
}
</style>
