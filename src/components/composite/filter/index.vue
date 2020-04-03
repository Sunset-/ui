<style lang="scss">
.xui-filter {
    display: inline-block;
    vertical-align: middle;
    font-size: 0px;
    &.xui-filter-block {
        display: block;
    }
    &:after {
        content: "";
        display: block;
        clear: both;
    }
    .filter-search-btn {
        margin-left: 20px;
        vertical-align: middle;
    }
}
</style>
<template>
    <form :class="['xui-filter xui-filter-style xui-form ',options.className,options.cols?'xui-filter-block':'']" onsubmit="return false">
        <div class="form-row">
            <template v-for="field in fields">
                <div v-if="field.group" :key="'key_'+field.name" v-show="fieldGroupRels[field.name].visible" :class="['ivu-col ivu-col-span-24',field.groupClassName]" :style="field.groupStyle">
                    <div class="group-title">
                        <span v-html="field.group"></span>
                    </div>
                </div>
                <span :key="'newline_'+field.name" class="newline" v-if="newline(field)" v-html="newline(field)"></span>
                <filter-field :key="'field_'+field.name" ref="fields" :options="field" :form-options="options" :group="fieldGroupRels[field.name]" v-model="filter[field.name]" :has-model="hasFilter" :model="filter" @inited="fieldInited" @change="fieldTriggerSearch(field)" @search="searchHandle(field)"></filter-field>
            </template>
            <filter-button class="filter-search-btn" v-if="searchButton" :options="searchButton" @click="search" />
            <filter-toolbar v-if="options.toolbar" :options="options.toolbar" @signal="operateSignal"></filter-toolbar>
        </div>
    </form>
</template>
<script>
import Sunset from "../../../common/sunset";
import FilterField from "../form/field.vue";
import FilterButton from "../../base/button";
import FilterToolbar from "../toolbar";
import Utils from "../../Helper.js";

const FULL_COLS = 24;

export default {
    components: {
        FilterField,
        FilterButton,
        FilterToolbar
    },
    props: {
        options: {}
    },
    computed: {
        fields() {
            var filter = this.filter;
            return ((this.options && this.options.fields) || []).filter(
                (field, fieldIndex) => {
                    if (field.premise) {
                        return field.premise(filter);
                    } else {
                        return true;
                    }
                }
            );
        },
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
                            ? f.groupVisible(this.filter)
                            : f.groupVisible !== false,
                        premise: Sunset.isFunction(f.groupPremise)
                            ? f.groupPremise(this.filter)
                            : f.groupPremise !== false,
                        disabled: Sunset.isFunction(f.groupDisabled)
                            ? f.groupDisabled(this.filter)
                            : f.groupDisabled === false
                    };
                }
                if (group && f.name) {
                    rels[f.name] = group;
                }
            });
            return rels;
        },
        searchButton() {
            return (this.options && this.options.searchButton) || "";
        },
        inited() {
            var f = this.filter;
            return this.initedFieldCount >= this.fields.length;
        }
    },
    watch: {
        inited(newV, oldV) {
            if (newV && !oldV) {
                this.$nextTick(() => {
                    if (this.waitSetFilter != null) {
                        var filter = this.waitSetFilter;
                        this.waitSetFilter = null;
                        this.reset(filter);
                    } else if (!this.options.lazy) {
                        this.search();
                    }
                });
            }
        }
    },
    data() {
        return {
            filter: {},
            hasFilter: false,
            initedFieldCount: 0,
            fieldTriggerTimer: null,
            searchPending: false
        };
    },
    methods: {
        init() {
            this.initedFieldCount = 0;
            this.$refs.fields.forEach(f => {
                f.initDefaultValue();
            });
        },
        fieldInited() {
            this.initedFieldCount++;
        },
        searchHandle(field) {
            field.enterSearchFilter && this.search();
        },
        reset(filter) {
            var inited = this.inited;
            if (!inited) {
                this.waitSetFilter = filter;
                return;
            }
            var hasFilter = (this.hasFilter = !!filter);
            this.filter = Sunset.clone(filter) || {};
            this.bindFieldValueOnModel(this.filter);
            this.searchPending = true;
            this.$nextTick(() => {
                if (!hasFilter) {
                    this.init();
                } else {
                    this.search();
                }
                this.searchPending = false;
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
        merge(filter) {
            Object.keys(filter).forEach(key => {
                this.$set(this.filter, key, filter[key]);
            });
            this.search();
        },
        getFilter() {
            var filter = Object.assign({}, this.filter);
            if (Sunset.isFunction(this.options.format)) {
                filter = this.options.format(filter) || filter;
            }
            return {
                filter: filter,
                localFilter: this.generateLocalFilter()
            };
        },
        fieldTriggerSearch(field) {
            if (!this.searchPending && field.changeFilter) {
                if (field.changeFilter === true) {
                    this.search();
                } else if (Sunset.isNumber(field.changeFilter)) {
                    if (this.fieldTriggerTimer) {
                        clearTimeout(this.fieldTriggerTimer);
                    }
                    this.fieldTriggerTimer = setTimeout(() => {
                        this.fieldTriggerTimer = null;
                        this.search();
                    }, +field.changeFilter);
                }
            }
        },
        validate() {
            var fields = this.$refs.fields;
            for (var i = 0, l = fields.length; i < l; i++) {
                if (fields[i].invalid) {
                    return false;
                }
            }
            return true;
        },
        getFormValidErrors() {
            var fields = this.$refs.fields;
            var errors = {};
            fields.forEach(f => {
                if (f.invalid) {
                    Object.assign(errors, f.getInvalidErrors());
                }
            });
            return errors;
        },
        search(from) {
            if (!this.fields || !this.inited) {
                return;
            }
            var filter = Sunset.clone(this.filter);
            //空值填充
            if (this.options.fillEmpty !== void 0) {
                var fields = this.fields;
                fields.forEach(f => {
                    if (f.name && Sunset.isEmpty(filter[f.name])) {
                        filter[f.name] = this.options.fillEmpty;
                    }
                });
            }
            //空值过滤
            if (this.options.filterEmpty) {
                Object.keys(filter).forEach(key => {
                    if (Sunset.isEmpty(filter[key])) {
                        delete filter[key];
                    }
                });
            }
            //premise值过滤
            var fields = this.options.fields,
                premiseFields = this.fields,
                filterKeys = {};
            fields.forEach(item => (filterKeys[item.name] = true));
            premiseFields.forEach(item => {
                delete filterKeys[item.name];
            });
            Object.keys(filterKeys).forEach(key => {
                delete filter[key];
            });
            //过滤钩子
            if (Sunset.isFunction(this.options.format)) {
                filter = this.options.format(filter) || filter;
            }
            Promise.resolve()
                .then(() => {
                    //校验
                    if (!this.validate()) {
                        var e = new Error("校验不通过");
                        e.errors = this.getFormValidErrors();
                        throw e;
                    }
                    //外部校验
                    if (Sunset.isFunction(this.options.validate)) {
                        return Promise.resolve(this.options.validate(filter));
                    } else {
                        return filter;
                    }
                })
                .then(() => {
                    this.$emit("filter", filter, this.generateLocalFilter());
                })
                .catch(e => {
                    this.$emit("signal", "SAVE-ERROR", e.errors || e);
                    var firstErrorMsg = null;
                    if (e.errors) {
                        var key = Object.keys(e.errors)[0];
                        var field = this.options.fields.filter(
                            f => f.name == key
                        )[0];
                        firstErrorMsg = `${field && field.label}${
                            e.errors[key][0]
                        }`;
                    }
                    this.$emit("validate", e.errors || e, firstErrorMsg);
                    if (Sunset.isFunction(this.options.onValidate)) {
                        this.options.onValidate(e.errors || e, firstErrorMsg);
                    }
                });
        },
        generateLocalFilter() {
            var localFilterFields =
                    this.fields.filter(item =>
                        Sunset.isFunction(item.localFilter)
                    ) || [],
                data = Sunset.clone(this.filter) || {};
            return function(record) {
                for (var i = 0, field; (field = localFilterFields[i++]); ) {
                    if (
                        !field.localFilter.call(field, record, data[field.name])
                    ) {
                        return false;
                    }
                }
                return true;
            };
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
        operateSignal(signal) {
            switch (signal) {
                case "FILTER":
                case "SEARCH":
                    try {
                        this.search();
                    } catch (e) {}
                    break;
                case "RESET":
                    try {
                        this.reset();
                    } catch (e) {}
                    break;
                default:
                    this.$emit.apply(
                        this,
                        ["signal"].concat([].slice.call(arguments))
                    );
            }
        }
    }
};
</script>