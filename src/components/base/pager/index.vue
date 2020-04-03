<style lang="scss">
.xui-page {
    overflow: hidden;
    text-align: center;
    .page-prev,
    .page-item,
    .page-next {
        display: inline-block;
        cursor: pointer;
        font-size: 12px;
        padding: 5px;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        &.disabled {
            cursor: not-allowed;
        }
    }
    .page-item {
        font-weight: bold;
        min-width: 20px;
        &.active,
        &:hover {
            color: #409eff;
        }
    }
    .page-jump-prev {
        font-size: 0px;
        cursor: default;
        &:after {
            content: "...";
            font-size: 12px;
        }
    }
    .page-jump-next {
        font-size: 0px;
        cursor: default;
        &:after {
            content: "...";
            font-size: 12px;
        }
    }
    .page-nav {
        display: inline-block;
        vertical-align: middle;
    }
    .xui-page-sizer {
        display: inline-block;
        vertical-align: middle;
    }
    .xui-page-total {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        &:before {
            content: "共";
        }
        &:after {
            content: "条";
        }
    }
}
</style>
<template>
    <div :class="['xui-page xui-page-style',cmanner?'xui-page-manner-'+cmanner:'']">
        <div class="page-nav" :data-total="total" :data-page-total="totalPages">
            <span v-show="layout['prev']" :class="['page-prev',currentPage == 1?'disabled':'']" @click="jump(-1,'pre')">{{prevText}}</span>
            <span :class="['page-item',p=='PREV'?'page-jump-prev':'',p=='NEXT'?'page-jump-next':'',currentPage==p?'active':'']" v-for="(p,index) in pages" :key="index" @click="go(p)">{{p}}</span>
            <span v-show="layout['next']" :class="['page-next',currentPage==totalPages?'disabled':'']" @click="jump(+1, 'next')">{{nextText}}</span>
        </div>
        <pager-select class="xui-page-sizer" v-if="showSizer" :value="cpageSize" :options="sizerOptions" @change="changePagerSize"></pager-select>
        <span v-show="showTotal" class="xui-page-total">{{total}}</span>
    </div>
</template>
<script>
import PagerSelect from "../select";

export default {
    components: {
        PagerSelect
    },
    props: {
        pageNumber: {},
        pageSize: {},
        total: {},
        size: {},
        foldCount: {},
        manner: {},
        mini: {},
        options: {}
    },
    data() {
        return {
            currentPage: this.pageNumber
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        prevText() {
            return this.safeOptions.prevText || "< 上一页";
        },
        nextText() {
            return this.safeOptions.nextText || "下一页 >";
        },
        cmanner() {
            return this.manner || this.safeOptions.manner;
        },
        cpageNumber() {
            return this.pageNumber || this.safeOptions.pageNumber || 1;
        },
        cpageSize() {
            return this.pageSize || this.safeOptions.pageSize || 10;
        },
        ctotal() {
            return this.total || this.safeOptions.total || 0;
        },
        cfoldCount() {
            return this.foldCount || this.safeOptions.foldCount || 7;
        },
        csize() {
            return this.size || this.safeOptions.size || "normal";
        },
        layout() {
            var layout = this.safeOptions.layout || "prev,first,last,next";
            return layout.split(",").reduce((res, item) => {
                if (item) {
                    res[item.trim()] = true;
                }
                return res;
            }, {});
        },
        isMini() {
            return this.csize == "mini" || this.mini;
        },
        totalPages() {
            return Math.ceil(this.ctotal / this.cpageSize);
        },
        showTotal() {
            return this.layout["total"];
        },
        showSizer() {
            return this.safeOptions.sizer;
        },
        sizerOptions() {
            var ops = {
                    clearable: false
                },
                sizer = this.safeOptions.sizer;
            if (sizer) {
                ops.data = sizer.map(v => ({
                    text: v,
                    value: v
                }));
            }
            return ops;
        },
        pages() {
            var pages = [];
            var totalPages = this.totalPages,
                foldCount = this.cfoldCount,
                layout = this.layout;
            if (totalPages <= foldCount) {
                for (var i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                var currentPage = this.currentPage;
                var foldCountWithoutHead = foldCount - 2;
                pages.push(currentPage);
                if (currentPage == 1 || currentPage == totalPages) {
                    foldCountWithoutHead++;
                }
                var offset = 0;
                while (pages.length < foldCountWithoutHead) {
                    offset++;
                    if (currentPage - offset > 1) {
                        pages.unshift(currentPage - offset);
                    }
                    if (currentPage + offset < totalPages) {
                        pages.push(currentPage + offset);
                    }
                }
                if (pages[0] != 1) {
                    if (layout["first"]) {
                        pages.unshift(1);
                    }
                }
                if (this.total != Number.MAX_VALUE) {
                    if (pages[pages.length - 1] != totalPages) {
                        if (layout["last"]) {
                            pages.push(totalPages);
                        }
                    }
                }
                if(this.foldCount > 2){
                    if (pages[1] - pages[0] != 1) {
                        pages.splice(1, 0, "PREV");
                    }
                    if (this.total != Number.MAX_VALUE) {
                        if (
                            pages[pages.length - 1] - pages[pages.length - 2] !=
                            1
                        ) {
                            pages.splice(pages.length - 1, 0, "NEXT");
                        }
                    }
                }
            }
            return pages;
        }
    },
    methods: {
        jump(offset, type) {
            if (type === "pre" && this.currentPage === 1) {
                return;
            }
            if (type === "next" && this.currentPage === this.totalPages) {
                return;
            }
            var index = this.currentPage + offset;
            index = Math.max(1, index);
            index = Math.min(this.totalPages, index);
            this.go(index);
        },
        go(index) {
            if (this.total != Number.MAX_VALUE) {
                if (index == "PREV") {
                    index = Math.max(1, this.currentPage - this.cfoldCount + 2);
                } else if (index == "NEXT") {
                    index = Math.min(
                        this.totalPages,
                        this.currentPage + this.cfoldCount - 2
                    );
                }
            }
            if (index == "PREV" || index == "NEXT") {
                return;
            }
            this.currentPage = index;
            this.$emit("change", index);
        },
        changePagerSize(v) {
            if (v != this.cpageSize) {
                this.$emit("changePageSize", v);
            }
        }
    },
    watch: {
        pageNumber(v) {
            this.currentPage = v;
        }
    }
};
</script>