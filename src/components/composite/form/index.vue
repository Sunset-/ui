<style lang="scss">
.xui-form {
    .form-row {
        position: relative;
        margin-left: 0;
        margin-right: 0;
        font-size: 0px;
        height: auto;
        zoom: 1;
        display: block;
        &:after,
        &:before {
            content: "";
            display: table;
        }
        &:after {
            clear: both;
            visibility: hidden;
            font-size: 0;
            height: 0;
        }
    }
    .group-title {
        font-size: 14px;
        padding: 5px 15px;
    }
    .ivu-alert {
        margin-bottom: 0px;
    }
    &.xui-form-show-warning {
        .sunset-field-wraning-pop-wrap {
            display: block;
        }
    }
}
</style>
<template>
    <form :class="['xui-form xui-form-style',view?'xui-form-view':'',showWarning?'xui-form-show-warning':'']" @submit.prevent="submit">
        <div class="form-row">
            <template v-for="(field,index) in fields" >
                <div v-if="field.group" :key="'key_'+field.name" v-show="fieldGroupRels[field.name].visible" :class="['ivu-col ivu-col-span-24',field.groupClassName]" :style="field.groupStyle">
                    <div class="group-title">
                        <span v-html="field.group"></span>
                        <form-toolbar v-if="field.groupToolbar" :options="field.groupToolbar" :ctx="model" @signal="operateSignal"></form-toolbar>
                    </div>
                </div>
                <span :key="'newline_'+field.name" class="newline" v-if="newline(field)" v-html="newline(field)"></span>
                <form-field  :key="'field_'+field.name+'_'+index" ref="fields" :options="field" :form-options="options" :group="fieldGroupRels[field.name]" :view="view" v-model="model[field.name]" :model="model" :has-model="hasModel" :record="record" @change="fieldValueChange" @remove="removeField(field)"></form-field>
            </template>
        </div>
        <!-- toolbar -->
        <div v-if="!hidedefaulttoolbar&&options.toolbar!==false" :style="options.toolbarStyle||'text-align:center;'">
            <form-toolbar :options="toolbar" :ctx="model" @signal="operateSignal"></form-toolbar>
        </div>
    </form>
</template>
<script>
import Sunset from "../../../common/sunset";
import FormToolbar from "../toolbar";
import FormField from "./field";
import Utils from "../../Helper.js";

const FULL_COLS = 24;
const DEFAULT_COLS = 3;

export default {
    components: {
        FormField,
        FormToolbar
    },
    props: {
        options: {
            type: Object
        },
        view: {},
        hidedefaulttoolbar: {}
    },
    data() {
        return {
            record: null,
            model: {},
            hasModel: false,
            fieldsRefresher: 0,
            showWarning: false,
            fieldValueDirty: {},
            dirtyPending: false
        };
    },
    computed: {
        fieldGroupRels() {
            var fields = this.options.fields;
            var rels = {};
            var group = {
                visible: true,
                premise: true,
                disabled: false
            };
            fields.forEach(f => {
                if (f.group) {
                    group = {
                        visible: Sunset.isFunction(f.groupVisible)
                            ? f.groupVisible(this.model)
                            : f.groupVisible !== false,
                        premise: Sunset.isFunction(f.groupPremise)
                            ? f.groupPremise(this.model)
                            : f.groupPremise !== false,
                        disabled: Sunset.isFunction(f.groupDisabled)
                            ? f.groupDisabled(this.model)
                            : f.groupDisabled === false
                    };
                }
                rels[f.name] = group;
            });
            return rels;
        },
        fields() {
            var model = this.model,
                fieldsRefresher = this.fieldsRefresher;
            return ((this.options && this.options.fields) || []).filter(
                field => {
                    if (field.premise) {
                        return field.premise(model);
                    } else {
                        return true;
                    }
                }
            );
        },
        toolbar() {
            return (
                this.options.toolbar || [
                    {
                        label: "保存",
                        color: "success",
                        signal: "SUBMIT"
                    },
                    {
                        label: "取消",
                        signal: "CANCEL"
                    }
                ]
            );
        },
        formDirty() {
            return Object.keys(this.fieldValueDirty).length > 0;
        },
        blurValidate() {
            return this.options.blurValidate &&
                Sunset.isBoolean(this.options.blurValidate)
                ? this.options.blurValidate
                : false;
        }
    },
    methods: {
        init() {
            this.dirtyPending = true;
            var model = this.model,
                fields = this.fields || [],
                prall = [];
            this.$refs.fields &&
                this.$refs.fields.forEach(f => {
                    f.initDefaultValue();
                });
            setTimeout(() => {
                this.fieldValueDirty = {};
                this.dirtyPending = false;
            }, 1000);
            //异步计算默认值
            // fields.forEach((field, fieldIndex) => {
            //     if (!field.name) {
            //         return;
            //     }
            //     this.$set(this.model, field.name, void 0);
            //     if (field.default !== void 0) {
            //         prall.push(
            //             Promise.resolve()
            //                 .then(() => {
            //                     return Sunset.isFunction(field.default)
            //                         ? field.default()
            //                         : field.default;
            //                 })
            //                 .then(value => {
            //                     return {
            //                         name: field.name,
            //                         value: value
            //                     };
            //                 })
            //         );
            //     } else if (
            //         field.defaultFirst ||
            //         Sunset.isNumber(field.defaultIndex)
            //     ) {
            //         prall.push(
            //             Promise.resolve()
            //                 .then(() => {
            //                     return Utils.generateItems(field);
            //                 })
            //                 .then(items => {
            //                     var index = field.defaultFirst
            //                         ? 0
            //                         : field.defaultIndex >= 0
            //                         ? field.defaultIndex
            //                         : items.length + field.defaultIndex;
            //                     if (items && items.length) {
            //                         return {
            //                             name: field.name,
            //                             value: items[index].value
            //                         };
            //                     } else if (
            //                         Sunset.isFunction(
            //                             this.$refs.fields[fieldIndex]
            //                                 .$children[0].defaultValue
            //                         )
            //                     ) {
            //                         return {
            //                             name: field.name,
            //                             value: this.$refs.fields[
            //                                 fieldIndex
            //                             ].$children[0].defaultValue(index)
            //                         };
            //                     } else {
            //                         return {
            //                             name: field.name,
            //                             value: void 0
            //                         };
            //                     }
            //                 })
            //         );
            //     }
            // });
            // Promise.all(prall).then(res => {
            //     if (model === this.model) {
            //         res.forEach(dv => {
            //             model[dv.name] = dv.value;
            //         });
            //         this.$nextTick(() => {
            //             this.$emit("inited", model);
            //         });
            //     }
            // });
        },
        removeField(field) {
            var model = this.model;
            this.options.fields.splice(this.options.fields.indexOf(field), 1);
            delete this.model[field.name];
        },
        onFieldValidate(name, valid) {
            this.$set(this.fieldValidate, name, valid);
        },
        getModel(origin) {
            return origin ? this.model : Sunset.clone(this.model);
        },
        generateModel() {
            this.$refs.fields &&
                this.$refs.fields.forEach(f => f.setDirty(true));
            return Promise.resolve().then(() => {
                //校验
                if (!this.validate()) {
                    this.showWarning = true;
                    var e = new Error("校验不通过");
                    e.errors = this.getFormValidErrors();
                    throw e;
                }
                var model = this.formatModel();
                //外部校验
                if (Sunset.isFunction(this.options.validate)) {
                    return Promise.resolve()
                        .then(() => {
                            return this.options.validate(model);
                        })
                        .then(() => {
                            return model;
                        });
                } else {
                    return model;
                }
            });
        },
        formatModel() {
            var model = Sunset.clone(this.model);
            if (model) {
                Object.keys(model).forEach(key => {
                    if (Sunset.isString(model[key])) {
                        model[key] = model[key].trim();
                    }
                });
            }
            //空值填充
            if (this.options.fillEmpty !== void 0) {
                var fields = this.fields;
                fields.forEach(f => {
                    if (f.name && Sunset.isEmpty(model[f.name])) {
                        model[f.name] = this.options.fillEmpty;
                    }
                });
            }
            //空值过滤
            if (this.options.filterEmpty) {
                Object.keys(model).forEach(key => {
                    if (Sunset.isEmpty(model[key])) {
                        delete model[key];
                    }
                });
            }
            //premise值过滤
            var fields = this.options.fields,
                premiseFields = this.fields,
                filterKeys = {};
            fields.forEach(item => {
                filterKeys[item.name] = true;
                if (!Sunset.isEmpty(model[item.name])) {
                    if (Sunset.isFunction(item.valueFormat)) {
                        model[item.name] = item.valueFormat.call(
                            null,
                            model[item.name]
                        );
                    }
                }
                var valueType = null;
                if (item.valueFormat === "Number") {
                    valueType = Number;
                } else if (item.valueFormat === "String") {
                    valueType = String;
                } else if (item.valueFormat === "Boolean") {
                    valueType = Boolean;
                }
                if (
                    item.valueFormat === Number ||
                    item.valueFormat === String ||
                    item.valueFormat === Boolean
                ) {
                    valueType = item.valueFormat;
                }
                if (valueType != null) {
                    if (
                        valueType === Number &&
                        (model[item.name] === "" ||
                            model[item.name] === void 0 ||
                            model[item.name] === null)
                    ) {
                        delete model[item.name];
                    } else {
                        model[item.name] = valueType.call(
                            null,
                            model[item.name]
                        );
                    }
                }
            });
            premiseFields.forEach(item => {
                delete filterKeys[item.name];
            });
            Object.keys(filterKeys).forEach(key => {
                delete model[key];
            });
            //格式化钩子
            if (Sunset.isFunction(this.options.format)) {
                model =
                    (this.options.format &&
                        this.options.format(model, this.record)) ||
                    model;
            }
            return model;
        },
        getFormValidErrors() {
            var fields = this.$refs.fields || [];
            var errors = {};
            fields.forEach(f => {
                if (f.invalid) {
                    Object.assign(errors, f.getInvalidErrors());
                }
            });
            return errors;
        },
        operateSignal(signal) {
            switch (signal) {
                case "SUBMIT":
                    try {
                        this.submit();
                    } catch (e) {}
                    break;
                case "RESET":
                    try {
                        this.reset();
                    } catch (e) {}
                    break;
                default:
                    this.$emit(signal.toLowerCase());
                    this.$emit.apply(
                        this,
                        ["signal"].concat([].slice.call(arguments))
                    );
            }
        },
        getValidateModel() {
            return this.generateModel().catch(e =>
                this.triggerValidateErrors(e)
            );
        },
        submit() {
            this.generateModel()
                .then(model => {
                    if (Sunset.isFunction(this.options.submit)) {
                        Promise.resolve(this.options.submit(model))
                            .then(res => {
                                this.$emit("signal", "SAVED", res, model);
                            })
                            .catch(e => {
                                console.error(e);
                                this.$emit("signal", "SAVE-ERROR", e);
                            });
                    }
                    this.$emit("submit", model);
                })
                .catch(e => this.triggerValidateErrors(e));
        },
        triggerValidateErrors(e) {
            this.$emit("signal", "SAVE-ERROR", e.errors || e);
            var firstErrorMsg = null;
            if (e.errors) {
                var key = Object.keys(e.errors)[0];
                var field = this.options.fields.filter(f => f.name == key)[0];
                firstErrorMsg = `${field && field.label}${e.errors[key][0]}`;
            }
            this.$emit("validate", e.errors || e, firstErrorMsg);
            if (Sunset.isFunction(this.options.onValidate)) {
                this.options.onValidate(e.errors || e, firstErrorMsg);
            }
            throw e;
        },
        reset(record) {
            this.hasModel = !!record;
            this.$refs.fields &&
                this.$refs.fields.forEach(f => f.setDirty(false));
            Promise.resolve(this.rebuild(record)).then(record => {
                this.record = Sunset.clone(record);
                var model = this.cast(Sunset.clone(record) || {});
                if (Sunset.isFunction(this.options.cast)) {
                    model = this.options.cast(model) || model;
                }
                this.fieldsRefresher++;
                this.model = model;
                this.bindFieldValueOnModel(model);
                this.$nextTick(() => {
                    if (!this.hasModel) {
                        this.init();
                    } else {
                        this.$emit("reseted", model);
                    }
                });
            });
        },
        bindFieldValueOnModel(model) {
            this.options.fields &&
                this.options.fields.forEach(field => {
                    if (field.name) {
                        this.$set(model, field.name, model[field.name]);
                    }
                });
        },
        cast(model) {
            this.fields &&
                this.fields.forEach(f => {
                    if (model[f.name] != null && f.dataType) {
                        switch (f.dataType) {
                            case String:
                                model[f.name] = String(model[f.name]);
                        }
                    }
                });
            return model;
        },
        fieldValueChange(v, model, fieldOptions) {
            if (!this.dirtyPending && fieldOptions && fieldOptions.name) {
                this.$set(this.fieldValueDirty, fieldOptions.name, true);
                this.$nextTick(() => {
                    this.$emit("dirty");
                });
            }
            this.$nextTick(() => {
                this.$emit("modelchange");
            });
            this.showWarning = false;
        },
        validate() {
            var fields = (this.$refs.fields && this.$refs.fields) || [];
            for (var i = 0, l = fields.length; i < l; i++) {
                if (fields[i].invalid) {
                    return false;
                }
            }
            return true;
        },
        newline(field) {
            if (field.newline) {
                if (
                    (!this.fieldGroupRels[field.name] ||
                        this.fieldGroupRels[field.name].visible) &&
                    (Sunset.isFunction(field.visible)
                        ? field.visible(this.model)
                        : field.visible !== false)
                ) {
                    return `</div><div style="z-index:-1;" class="form-row">`;
                } else {
                    return "";
                }
            } else {
                return "";
            }
            return field.newline
                ? `</div><div style="z-index:-1;" class="form-row">`
                : "";
        },
        rebuild(model) {
            if (this.options.rebuild) {
                return this.options.rebuild.call(null, model, this.options);
            } else {
                return model;
            }
        }
    },
    mounted() {
        this.init();
    }
};
</script>