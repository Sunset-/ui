<style lang="scss">
.xui-form {
    .form-row-col {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        -webkit-box-flex: 0;
        -ms-flex: 0 0 auto;
        flex: 0 0 auto;
        @for $i from 1 through 24 {
            &.form-row-col-#{$i} {
                width: 100% * ($i/24);
            }
        }
        &.form-row-col-0 {
            width: auto;
            .xui-form-field {
                width: auto;
                .xui-field-widget {
                    width: auto;
                }
            }
        }
    }
    .xui-form-field {
        display: table;
        width: 100%;
        min-height: 40px;
        margin-top: 5px;
        margin-bottom: 5px;
        box-sizing: border-box;
        font-size: 0px;
        .xui-field-label {
            font-size: 12px;
            display: table-cell;
            min-width: 90px;
            white-space: nowrap;
            text-align: right;
            padding-left: 10px;
            padding-right: 10px;
            vertical-align: middle;
            & > span {
                vertical-align: middle;
            }
        }
        .xui-field-widget {
            font-size: 12px;
            display: table-cell;
            width: 100%;
            vertical-align: middle;
            & > * {
                max-width: 100%;
            }
        }
        .xui-form-field-remove {
            position: absolute;
            font-size: 12px;
            top: -1px;
            right: 18px;
            z-index: 5;
            &:hover {
                color: orange;
            }
        }
        &.required-field {
            .xui-field-label:before {
                content: "*";
                color: red;
                padding: 0px 2px;
                position: absolute;
                margin-left: -10px;
                margin-top: 2px;
            }
        }
        .xui-field-tip {
            display: table-cell;
            vertical-align: middle;
            font-size: 14px;
        }
    }
}
</style>
<template>
    <div  v-show="visible" :class="['form-row-col','form-row-col-'+fieldCols,options.colClass]" :style="options.colStyle">
        <div :class="['xui-form-field',options.validate && options.validate.required && !cview ? 'required-field':'',invalid?'invalid':'',dirty?'dirty':'',options.fieldClass]" :style="options.fieldStyle">
            <label v-if="options.label" :style="labelStyle" class="xui-field-label">
                <span v-html="options.label"></span>
            </label>
            <div :class="['xui-field-widget',invalid?'invalid':'',dirty?'dirty':'']" :validate-msg="$validator.$firstError(options.name)">
                <component v-show="!cview" :class="['xui-field-widget-component',invalid?'invalid':'',dirty?'dirty':'',mannerClass]" :validate-msg="$validator.$firstError(options.name)" :is="widget" ref="widget" :options="options" :form-options="formOptions" v-model="fieldValue" :disabled="cdisabled(model)" :model="model" :invalid="invalid" :style="options.widgetStyle" @search="fieldSearch"></component>
                <span v-if="cview" v-html="viewValue" ref="viewPanel"></span>
            </div>
            <div class="xui-field-tip" v-if="tip!==false" :style="options.tipStyle" v-html="tip"></div>
            <!-- 校验 -->
            <input type="hidden" field="field" v-model="fieldValue" :name="options.name" v-validate="options.validate" />
            <!-- 删除 -->
            <i v-if="options.removeable" :style="options.removeStyle" @click="removeSelf" class="xui-form-field-remove ivu-icon ivu-icon-close-circled text-danger"></i>
        </div>
    </div>
</template>
<script>
import Sunset from "../../../common/sunset.js";
import widgets from "./form-widgets.js";
import Dictionary from "../../../services/Dictionary.js";
import Utils from "../../Helper.js";

const FULL_COLS = 24;

export default {
    components: widgets,
    model: {
        prop: "value",
        event: "input"
    },
    props: {
        formOptions: {},
        options: {
            type: Object
        },
        group: {},
        value: {},
        model: {},
        hasModel: {},
        record: {},
        view: {}
    },
    data() {
        return {
            dirty: false,
            dirtyLock: false
        };
    },
    computed: {
        widget() {
            return (
                "xui-formwidget-" + (this.options.widget || this.options.type)
            );
        },
        cview() {
            return (
                (this.options.view !== false && this.view) ||
                this.options.view === true
            );
        },
        fieldValue: {
            set(v) {
                if (Sunset.isFunction(this.options.rechange)) {
                    v = this.options.rechange(
                        v,
                        this.fieldValue,
                        this.model,
                        this.options
                    );
                }
                if (!this.dirtyLock) {
                    this.dirty = true;
                }
                this.$emit("input", v);
                if (v !== this.value) {
                    if (this.options.onChange) {
                        this.options.onChange(
                            v,
                            this.value,
                            this.model,
                            this.options,
                            this.formOptions,
                            this.$parent.$parent.$parent
                        );
                    }
                    this.$emit("change", v, this.model, this.options);
                }
            },
            get() {
                return this.value;
            }
        },
        labelStyle() {
            if (this.options.labelStyle) {
                return this.options.labelStyle;
            } else if (this.formOptions.labelStyle) {
                return this.formOptions.labelStyle;
            } else {
                return "";
            }
        },
        widgetStyle() {
            if (this.options.widgetStyle) {
                return this.options.widgetStyle;
            } else if (this.formOptions.widgetStyle) {
                return this.formOptions.widgetStyle;
            }
        },
        mannerClass() {
            return this.options.manner
                ? `xui-${this.options.widget}-manner-${this.options.manner}`
                : "";
        },
        tip() {
            return Sunset.isFunction(this.options.tip)
                ? this.options.tip.call(this.options, this.value, this.model)
                : this.options.tip;
        },
        invalid() {
            if (this.options.validate) {
                return this.$validator.$invalid(this.options.name);
            }
        },
        removeable() {
            return Sunset.isFunction(this.options.removeable)
                ? this.options.removeable.call(
                      this.options,
                      this.value,
                      this.model
                  )
                : this.options.removeable;
        },
        viewValue() {
            var html = null;
            var value = this.value,
                options = this.options;
            if (options.view && options.view !== true) {
                switch (options.view) {
                    case "DATETIME":
                        return value == 0
                            ? "-"
                            : Sunset.Dates.format(
                                  new Date(isNaN(value) ? value : +value)
                              );
                        break;
                    case "DATE":
                        return value == 0
                            ? "-"
                            : Sunset.Dates.format(
                                  new Date(isNaN(value) ? value : +value),
                                  "yyyy-MM-dd"
                              );
                        break;
                    default:
                        if (Sunset.isFunction(options.view)) {
                            return options.view(
                                value,
                                this.model,
                                this.options,
                                this.$refs.viewPanel
                            );
                        }
                }
            } else if (value === "" || value == void 0) {
                return "";
            } else if (options.enum) {
                value += "";
                html = value
                    .split(options.spliter || ",")
                    .map(v => Dictionary.transcode(options.enum, v))
                    .join(options.spliter || ",");
            } else {
                html = value;
            }
            return html;
        },
        cdisabled() {
            return Sunset.isFunction(this.options.disabled)
                ? this.options.disabled
                : function() {
                      return !!this.options.disabled;
                  };
        },
        visible() {
            var group = this.group;
            return (
                group.visible &&
                (Sunset.isFunction(this.options.visible)
                    ? this.options.visible(this.model)
                    : this.options.visible !== false)
            );
        },
        fieldCols() {
            var options = this.options;
            if (options.monopolize) {
                return FULL_COLS;
            } else if (Sunset.isNumber(options.cols)) {
                return options.cols;
            } else if (options.cols === false) {
                return 0;
            } else if (Sunset.isNumber(this.formOptions.cols)) {
                return FULL_COLS / this.formOptions.cols;
            } else {
                return 0;
            }
        }
    },
    methods: {
        init() {
            var f = this.options;
            //默认值
            this.initDefaultValue();
            //监听重建
            if (this.options.watch) {
                var watchs, rebuild;
                if (Sunset.isArray(this.options.watch)) {
                    if (
                        Sunset.isString(this.options.watch[0]) &&
                        Sunset.isFunction(this.options.watch[1])
                    ) {
                        watchs = this.options.watch[0];
                        rebuild = this.options.watch[1];
                    }
                }
                if (watchs && rebuild) {
                    watchs.split(",").forEach(w => {
                        this.$watch(`model.${w}`, v => {
                            this.rebuild(watchs, rebuild);
                        });
                    });
                    this.rebuild(watchs, rebuild);
                }
            }
            //绑定校验触发事件
            if (this.options.validateTrigger) {
                if (
                    this.options.validateTrigger.events &&
                    Sunset.isFunction(this.options.validateTrigger.onError)
                ) {
                    this.options.validateTrigger.events.forEach(e => {
                        this.$refs.widget.$on(e, () => {
                            if (this.invalid) {
                                this.options.validateTrigger.onError(
                                    this.$validator.errors[this.options.name]
                                );
                            }
                        });
                    });
                }
            }
        },
        initDefaultValue() {
            var field = this.options;
            var model = this.model;

            if (!field.name || this.hasModel) {
                this.dirty = false;
                this.dirtyLock = true;
                this.$emit("inited");
                setTimeout(() => {
                    this.dirtyLock = false;
                }, 1000);
                return;
            }
            this.$set(this.model, field.name, void 0);
            Promise.resolve()
                .then(() => {
                    if (field.default !== void 0) {
                        return Sunset.isFunction(field.default)
                            ? field.default()
                            : field.default;
                    } else if (
                        field.defaultFirst ||
                        Sunset.isNumber(field.defaultIndex)
                    ) {
                        return Promise.resolve()
                            .then(() => {
                                return Utils.generateItems(field);
                            })
                            .then(items => {
                                var index = field.defaultFirst
                                    ? 0
                                    : field.defaultIndex >= 0
                                    ? field.defaultIndex
                                    : items.length + field.defaultIndex;
                                if (items && items.length) {
                                    return items[index].value;
                                } else if (
                                    Sunset.isFunction(
                                        this.$refs.widget.defaultValue
                                    )
                                ) {
                                    return this.$refs.widget.defaultValue(
                                        index
                                    );
                                }
                            });
                    }
                })
                .then(value => {
                    if (model == this.model) {
                        this.$set(this.model, field.name, value);
                    }
                    this.dirty = false;
                    this.dirtyLock = true;
                    this.$emit("inited");
                    setTimeout(() => {
                        this.dirtyLock = false;
                    }, 1000);
                });
        },
        rebuild(watchs, rebuild) {
            Promise.resolve()
                .then(() => {
                    return rebuild.call(
                        this.options,
                        this.model,
                        this.options,
                        this.formOptions
                    );
                })
                .then(res => {
                    if (res !== false) {
                        this.$children[0].init && this.$children[0].init();
                    }
                });
        },
        fieldSearch() {
            this.$emit("search");
        },
        removeSelf() {
            this.$emit("remove");
        },
        getInvalidErrors() {
            return Sunset.clone(this.$validator.errors);
        },
        setDirty(v) {
            if (!v) {
                this.dirty = false;
                this.dirtyLock = true;
                setTimeout(() => {
                    this.dirtyLock = false;
                }, 1000);
            } else {
                this.dirty = true;
            }
        }
    },
    mounted() {
        this.init();
    }
};
</script>