
<template>
    <table-datapage ref="datapage" class="xui-datatable xui-datatable-style" :ctx="ctx" :options="options" @output="datapageOutput">
        <template slot-scope="props">
            <table v-if="options.fixedHead" :class="['xui-datatable-table table table-bordered table-striped',options.condensed?'table-condensed':'']">
                <colgroup>
                    <col v-if="checkable" width="50">
                    <col v-for="(col,index) in showColumns" :key="index" :width="col.width">
                </colgroup>
                <thead>
                    <tr class="noselect">
                        <th v-if="checkable" class="xui-datatable-table-checkbox">
                            <table-checkbox v-model="isAllCheck" @change="checkAll"></table-checkbox>
                        </th>
                        <th v-if="options.useIconFold"></th>
                        <th v-for="(col,index) in showColumns" :key="index" :style="calculateHeadStyle(col)">
                            <span>{{col.title}}</span>
                            <table-toolbar v-if="col.headToolbar" :options="col.headToolbar"></table-toolbar>
                            <i v-if="sortable&&col.sortable!==false" :class="['fa',sortCol!=col.name?'fa-sort text-stable':(sortOrder=='ASC'?'fa-sort-asc':'fa-sort-desc')]"></i>
                        </th>
                    </tr>
                </thead>
            </table>
            <table-scroll :style="bodyStyle" v-show="!(options.fixedHead&&list.length==0)">
                <table :class="['xui-datatable-table table table-bordered table-striped',options.condensed?'table-condensed':'']">
                    <colgroup>
                        <col v-if="checkable" width="50">
                        <col v-for="(col,index) in showColumns" :key="index" :width="col.width">
                    </colgroup>
                    <thead v-if="!options.fixedHead">
                        <tr class="noselect">
                            <th v-if="checkable" class="xui-datatable-table-checkbox">
                                <table-checkbox v-model="isAllCheck" @change="checkAll"></table-checkbox>
                            </th>
                            <th v-if="options.useIconFold"></th>
                            <th v-for="(col,index) in showColumns" :key="index" :style="calculateHeadStyle(col)">
                                <span>{{col.title}}</span>
                                <table-toolbar v-if="col.headToolbar" :options="col.headToolbar" @click.native.stop="clickStop"></table-toolbar>
                                <i v-if="sortable&&col.sortable!==false" :class="['fa',sortCol!=col.name?'fa-sort text-stable':(sortOrder=='ASC'?'fa-sort-asc':'fa-sort-desc')]"></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item,index) in list">
                            <tr :class="[childrenable?'xui-subtable-parent':'',item.__xuitable__children__show?'xui-subtable-open':'']" :key="index" @click="clickHandle(item,index)">
                                <td v-if="checkable" style="text-align:center;">
                                    <table-checkbox v-if="canCheck(item)" :ctx="item" @click.native.stop="clickStop" :value="computedCheck(item)" @change="checkRecord"></table-checkbox>
                                </td>
                                <td v-if="options.useIconFold"><i @click.stop="clickIconFold(item)" :class="[item.__xuitable__children__show?'xui-foldicon-up':'xui-foldicon-down',options.foldIcon]"></i></td>
                                <td v-for="(col,colIndex) in showColumns" :key="'col-'+colIndex" :style="calculateCellStyle(item,col,null,index)">
                                    <div v-if="!col.toolbar" :title="htmlToText(renderCell(item,col,null,index))" v-html="renderCell(item,col,null,index)" :style="col.innerStyle"></div>
                                    <div v-if="col.toolbar" :style="col.innerStyle">
                                        <table-toolbar v-if="col.toolbar" :ctx="item" :index="index" :options="col.toolbar" @click.native.stop="clickStop"></table-toolbar>
                                    </div>
                                </td>
                            </tr>
                            <!-- children -->
                            <tr v-if="item.__xuitable__children__show" :key="'child-'+index">
                                <td :colspan="options.useIconFold?showColumns.length+(checkable?1:0)+1:showColumns.length+(checkable?1:0)" class="xui-subtable">
                                    <slot name="subtable" :data="item.__xuitable__children" :parent="item"></slot>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </table-scroll>
        </template>
        <div slot="empty">
            <slot name="empty"></slot>
        </div>
    </table-datapage>
</template>
<script>
import tableDatapage from "../datapage";
import tableToolbar from "../toolbar";
import tableCheckbox from "./ctxCheckbox";
import tableScroll from "../../base/scroll";
import Sunset from "../../../common/sunset";
import Dictionary from "../../../services/Dictionary";
import npDatapage from "../datapage";
import Utils from "../../../common/utils";

function htmlEscape(text) {
    return text.replace(/[<>"&]/g, function(match, pos, originalText) {
        switch (match) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case '"':
                return "&quot;";
        }
    });
}

export default {
    components: {
        tableDatapage,
        tableToolbar,
        tableCheckbox,
        tableScroll
    },
    props: {
        data: {},
        ctx: {},
        options: {
            type: Object
        }
    },
    data() {
        return {
            isAllCheck: false,
            list: [],
            checkeds: []
        };
    },
    computed: {
        //列
        columns() {
            return this.options.columns || [];
        },
        showColumns() {
            return this.columns.filter(col =>
                col.premise ? col.premise() : true
            );
        },
        bodyStyle() {
            return `height:${
                this.options.fixedHead &&
                Sunset.isNumber(this.options.bodyHeight)
                    ? `${this.options.bodyHeight}px`
                    : "auto"
            };`;
        },
        //子列表
        childrenable() {
            return !!this.options.children;
        },
        //勾选
        checkable() {
            return !!this.options.checked;
        },
        idKey() {
            return (
                (Sunset.isObject(this.options.checked) &&
                    this.options.checked.key) ||
                "id"
            );
        },
        premiseCheck() {
            if (
                Sunset.isObject(this.options.checked) &&
                Sunset.isFunction(this.options.checked.premise)
            ) {
                return this.options.checked.premise;
            }
            return true;
        },
        //排序
        sortable() {
            return !!this.options.sortable;
        },
        slientLoading() {
            return this.options.loading === false;
        }
    },
    methods: {
        /**
         * 获取本地分页当前页数
         * @return {Number}
         */
        getCurrentLocalPageNumber() {
            if (this.$refs.datapage) {
                return this.$refs.datapage.$data.localPageNumber;
            }
            return 0;
        },
        search(...args) {
            this.removeAllCheckeds();
            this.$refs.datapage.search.apply(this.$refs.datapage, args);
        },
        refresh(...args) {
            this.removeAllCheckeds();
            this.$refs.datapage.refresh.apply(this.$refs.datapage, args);
        },
        setData(...args) {
            this.removeAllCheckeds("setData");
            this.$refs.datapage.setData.apply(this.$refs.datapage, args);
        },
        getData(...args) {
            return this.$refs.datapage.getData.apply(this.$refs.datapage, args);
        },
        clear(...args) {
            this.removeAllCheckeds();
            this.$refs.datapage.clear.apply(this.$refs.datapage, args);
        },
        setOptions(...args) {
            this.$refs.datapage.setOptions.apply(this.$refs.datapage, args);
        },
        loadMore(...args) {
            this.$refs.datapage.loadMore.apply(this.$refs.datapage, args);
        },
        datapageOutput(list, total) {
            this.list = list;
            this.$emit("output", list, total);
            this.refreshAllCheck();
        },
        refreshAllCheck() {
            var list = this.list;
            if (!list || list.length == 0) {
                this.isAllCheck = false;
                return;
            }
            var idKey = this.idKey;
            for (var i = 0, item; (item = list[i++]); ) {
                if (
                    Sunset.Arrays.findIndex(
                        this.checkeds,
                        temp => temp[idKey] == item[idKey]
                    ) < 0
                ) {
                    this.isAllCheck = false;
                    return;
                }
            }
            this.isAllCheck = true;
        },
        renderCell(item, col, parent, index) {
            var html = null;
            var value = Sunset.getAttribute(item, col.name, "");
            if (col.htmlEncode && Sunset.isString(value)) {
                value = htmlEscape(value);
            }
            if (col.format) {
                if (Sunset.isFunction(col.format)) {
                    var translatedValue = col.enum
                        ? Dictionary.transcode(col.enum, value)
                        : value;
                    return col.format(
                        value,
                        item,
                        col,
                        parent,
                        index,
                        translatedValue
                    );
                } else {
                    switch (col.format) {
                        case "DATETIME":
                            return value == 0
                                ? "-"
                                : Sunset.Dates.format(
                                      new Date(
                                          Sunset.isNumber(value)
                                              ? value
                                              : +value
                                      )
                                  );
                            break;
                        case "DATE":
                            return value == 0
                                ? "-"
                                : Sunset.Dates.format(
                                      new Date(
                                          Sunset.isNumber(value)
                                              ? value
                                              : +value
                                      ),
                                      "yyyy-MM-dd"
                                  );
                            break;
                        default:
                            return value == 0 || !Utils[col.format]
                                ? "-"
                                : Utils[col.format](value);
                            break;
                    }
                }
            } else if (col.enum) {
                html = Dictionary.transcode(col.enum, value, col.unmatch);
            } else {
                html = value;
            }
            return html;
        },
        htmlToText(html) {
            if (!html) {
                return "";
            }
            html = String(html).trim();
            if (html[0] == "<" && html[html.length - 1] == ">") {
                var oDiv = document.createElement("div");
                oDiv.innerHTML = html;
                return oDiv.innerText;
            }
            return html;
        },
        calculateHeadStyle(col) {
            var style = col.headStyle || "";
            if (Sunset.isString(style)) {
                style = `text-align:${col.headAlign || "center"};` + style;
            } else if (Sunset.isObject(style) && !style["text-align"]) {
                style["text-align"] = col.headAlign || "center;";
            } else {
                style = "text-algin:center;";
            }
            return style;
        },
        calculateCellStyle(item, col, parent, index) {
            var style = "";
            if (Sunset.isFunction(col.style)) {
                style =
                    col.style(item[col.name], item, col, parent, index) || {};
            } else if (Sunset.isString(col.style)) {
                style = col.style;
            }
            if (Sunset.isString(style)) {
                style = `text-align:${col.align || "center"};` + style;
            } else if (Sunset.isObject(style) && !style["text-align"]) {
                style["text-align"] = col.align || "center";
            } else {
                style = "text-algin:center;";
            }
            return style;
        },
        clickHandle(item, index) {
            if (this.options.clickRecord) {
                this.options.clickRecord.apply(this.options, [
                    item,
                    index,
                    this.ctx
                ]);
            }
            this.$emit("click-record", item, index, this.ctx);
            if (this.childrenable && !this.options.useIconFold) {
                this.loadChildren(item);
            }
        },
        clickIconFold(item) {
            if (this.childrenable) {
                if (!item.__xuitable__children__show) {
                    this.loadChildren(item, true);
                } else {
                    item.__xuitable__children__show = !item.__xuitable__children__show;
                    this.closeOtherItem(item);
                }
            }
        },
        loadChildren(item, force) {
            if (!force && item.__xuitable__children) {
                item.__xuitable__children__show = !item.__xuitable__children__show;
                this.closeOtherItem(item);
            } else {
                var childrenFunc;
                if ((childrenFunc = this.options.children)) {
                    Promise.resolve(
                        Sunset.isFunction(childrenFunc)
                            ? childrenFunc(item, this.ctx)
                            : childrenFunc
                    ).then(children => {
                        if (children) {
                            this.$set(item, "__xuitable__children", children);
                            this.$set(item, "__xuitable__children__show", true);
                            this.closeOtherItem(item);
                        }
                    });
                } else {
                    this.$set(item, "__xuitable__children", true);
                    this.$set(item, "__xuitable__children__show", true);
                    this.closeOtherItem(item);
                }
            }
        },
        closeOtherItem(item) {
            if (this.options.expandSingle) {
                this.list.forEach(citem => {
                    if (citem.__xuitable__children__show && citem != item) {
                        citem.__xuitable__children__show = false;
                    }
                });
            }
        },
        //勾选
        canCheck(item) {
            if (this.premiseCheck === true) {
                return true;
            } else {
                return !!this.premiseCheck(item);
            }
        },
        checkAll(isToCheck) {
            this.list.forEach(item => {
                this.checkRecord(isToCheck, item, true);
            });
            this.isAllCheck = isToCheck;
            this.$emit("checked", this.checkeds);
        },
        removeAllCheckeds(eventName) {
            this.isAllCheck = false;
            this.checkeds = [];
            this.$emit("checked", this.checkeds, eventName);
        },
        checkRecord(isToCheck, item, fromCheckAll) {
            if (!this.canCheck(item)) {
                return;
            }
            var idKey = this.idKey,
                id = item[idKey];
            if (isToCheck) {
                if (
                    Sunset.Arrays.findIndex(
                        this.checkeds,
                        temp => temp[idKey] == id
                    ) < 0
                ) {
                    this.checkeds.push(item);
                }
            } else {
                var index;
                if (
                    (index = Sunset.Arrays.findIndex(
                        this.checkeds,
                        temp => temp[idKey] == id
                    )) >= 0
                ) {
                    this.checkeds.splice(index, 1);
                    this.isAllCheck = false;
                }
            }
            if (!fromCheckAll) {
                this.$emit("checked", this.checkeds);
            }
            this.refreshAllCheck();
        },
        computedCheck(item) {
            var idKey = this.idKey,
                id = item[idKey];
            return (
                Sunset.Arrays.findIndex(
                    this.checkeds,
                    temp => temp[idKey] == id
                ) >= 0
            );
        },
        refrechCheckAll() {
            if (this.options.multiCheck) {
                this.isAllCheck = false;
            }
        },
        getCheckeds() {
            return this.checkeds;
        },
        clickStop() {},
        render() {
            this.list = this.list.concat([]);
        }
    },
    mounted() {
        if (this.data) {
            this.setData(this.data);
        }
    },
    watch: {
        data(v) {
            if (v) {
                this.setData(v);
            }
        }
    }
};
</script>
<style lang="scss">
.xui-datatable {
    $borderColor: #dddddd;
    $oddBackgroundColor: #eeeeee;
    $activeBackgroundColor: #cccccc;
    $subtableBackgroundColor: #e9f2fd;

    .xui-datatable-table {
        width: 100%;
        max-width: 100%;
        border-color: $borderColor;
        margin-top: 0px;
        background-color: transparent;
        border-collapse: collapse;
        border-spacing: 0;
        thead {
            display: table-header-group;
            vertical-align: middle;
            border-color: inherit;
        }
        tr {
            display: table-row;
            vertical-align: inherit;
            border-color: inherit;
            th {
                border-top: 0;
                border-color: $borderColor;
                position: relative;
                border: 1px solid $borderColor;
                border-bottom: 1px solid $borderColor;
                color: #2c2e2f;
                padding: 12px 15px;
                &.xui-datatable-table-checkbox {
                    width: 30px;
                }
                & > span {
                    display: inline-block;
                    vertical-align: middle;
                    white-space: nowrap;
                }
            }
            td {
                border-color: $borderColor;
                border-top: 0;
                border-bottom: 1px solid $borderColor;
                padding: 8px 8px;
                border: 1px solid $borderColor;
                line-height: 1.42857143;
                vertical-align: middle;
                &.xui-subtable {
                    background: $subtableBackgroundColor;
                }
            }
        }
        tbody {
            .xui-subtable-parent {
                cursor: pointer;
                &:hover {
                    background: $activeBackgroundColor;
                }
                &.xui-subtable-open {
                    background: $subtableBackgroundColor;
                }
            }
            tr {
                background-color: #fff;
            }
            tr:nth-child(odd) {
                background-color: $oddBackgroundColor;
            }
        }
    }
    .table > thead > tr > td,
    .table > tbody > tr > td,
    .table > tfood > tr > td,
    .table > thead > tr > th,
    .table > tbody > tr > th,
    .table > tfood > tr > th {
        padding: 8px;
    }
    .table > tbody > tr > td.sunset-table-record-tools {
        position: relative;
        padding: 0px;
        text-align: center;
        & > div {
            position: absolute;
            top: 0px;
            bottom: 0px;
            width: 100%;
            & > div {
                display: table;
                height: 100%;
                width: 100%;
                & > .sunset-toolbar {
                    display: table-cell;
                    vertical-align: middle;
                }
            }
        }
    }
    .xui-foldicon-down {
        transform: rotate(0deg);
    }
    .xui-foldicon-up {
        transform: rotate(180deg);
    }
}
</style>