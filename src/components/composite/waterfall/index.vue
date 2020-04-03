<template>
    <waterfall-scroll class="xui-waterfall xui-waterfall-style" ref="container" @scroll="scrollHandle" :wrapStyle="scrollOptions.wrapStyle" :wrapClassName="scrollOptions.wrapClassName" :innerStyle="scrollOptions.innerStyle" :innerClassName="scrollOptions.innerClassName">
        <slot name="header"></slot>
        <div v-show="mode=='WATERFALL'">
            <!-- 整齐布局 -->
            <template v-if="!chaos">
                <div style="display:inline-block;" ref="items" v-for="(item,index) in list" :key="index" class="xui-waterfall-item">
                    <slot :item="item" :index="index" :visible="visibles[index]"></slot>
                </div>
            </template>
            <!-- 混乱布局 -->
            <template v-if="chaos">
                <div class="xwf-chaos">
                    <ul v-for="(group,gindex) in groups" :style="chaosUlStyle" :key="gindex">
                        <li v-for="(item,index) in group" :key="index">
                            <slot :item="item" :index="index"></slot>
                        </li>
                    </ul>
                </div>
            </template>
            <div v-show="list.length==0&&groups.length==0&&!loading">
                <slot name="empty">
                    <div class="xui-empty xui-empty-style">
                        <i></i>
                    </div>
                </slot>
            </div>
            <waterfall-loading :loading="loading" style="height:80px;overflow: hidden;"></waterfall-loading>
        </div>
        <!-- 分页模式兼容 -->
        <waterfall-datapage v-if="pageMode" v-show="mode!='WATERFALL'" ref="datapage" :data="list" :options="datapageOptions">
            <template slot-scope="props">
                <template v-for="(item,index) in props.list">
                    <slot :item="item" :index="index" :visible="true"></slot>
                </template>
            </template>
        </waterfall-datapage>
    </waterfall-scroll>
</template>
<script>
import WaterfallScroll from "../../base/scroll";
import Sunset from "../../../common/sunset";
import WaterfallLoading from "../../base/loading";
import WaterfallDatapage from "../datapage";
import offset from "./offset.js";

export default {
    components: {
        WaterfallScroll,
        WaterfallLoading,
        WaterfallDatapage
    },
    props: {
        options: {
            type: Object
        },
        value: {}
    },
    data() {
        return {
            groups: [],
            list: [],
            visibles: [],
            total: 10000,
            mode: "WATERFALL",
            loading: false,
            datapageOptions: Object.assign(this.options.datapageOptions || {}, {
                lazy: true,
                format: {
                    list: "list",
                    count: "count",
                    pageSize: "pageSize",
                    currentPage: "pageNumber"
                },
                pageNumberStart: 0,
                datasource: filter => {
                    var list = this.list;
                    var total = this.total;
                    var pageStart = filter.pageNumber * filter.pageSize;
                    var pageEnd = pageStart + filter.pageSize;
                    return Promise.resolve()
                        .then(() => {
                            if (pageEnd > list.length && pageEnd < total) {
                                return this._loadData();
                            }
                        })
                        .then(() => {
                            return {
                                list: list.slice(
                                    pageStart,
                                    pageStart + filter.pageSize
                                ),
                                count: this.total
                            };
                        });
                }
            })
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        chaos() {
            return this.safeOptions.chaos;
        },
        chaosUlStyle() {
            return `width:${100.0 / this.chaos}%;`;
        },
        windowMargin() {
            return this.safeOptions.windowMargin || 0;
        },
        preloadHeight() {
            return this.safeOptions.preloadHeight === void 0
                ? 50
                : this.safeOptions.preloadHeight;
        },
        loadFinish() {
            return this.list.length >= this.total;
        },
        format() {
            return (
                this.safeOptions.format || {
                    list: this.list,
                    total: this.total
                }
            );
        },
        lazy() {
            return this.safeOptions.lazy;
        },
        release() {
            return !!this.safeOptions.release;
        },
        throttleTime() {
            return this.safeOptions.throttleTime || 500;
        },
        debounceTime() {
            return this.safeOptions.debounceTime || 100;
        },
        scrollOptions() {
            return this.safeOptions.scrollOptions || {};
        },
        pageMode() {
            return this.safeOptions.pageMode;
        }
    },
    methods: {
        init() {
            if (!this.lazy) {
                this._loadData();
            }
        },
        scrollHandle: (() => {
            var timer = null,
                lastTime = 0;
            return function() {
                //节流防抖
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                var now = new Date().getTime();
                if (now - lastTime > this.throttleTime) {
                    lastTime = now;
                    this._scrollHandle();
                } else {
                    timer = setTimeout(() => {
                        this._scrollHandle();
                    }, this.debounceTime);
                }
            };
        })(),
        search(filter) {
            this.filter = Sunset.clone(filter || {});
            this.clear();
            this._loadData();
        },
        clear() {
            this.list = [];
            this.groups = [];
            this.total = 0;
            //this.$refs.datapage && this.$refs.datapage.clear();
        },
        setData(res) {
            this.clear();
            this._addToList(res);
            this.$nextTick(() => {
                this._scrollHandle();
                this.$refs.container.updateBar();
            });
        },
        _loadData() {
            if (this.loading) {
                return;
            }
            if(this.safeOptions.isUseloading == false){
                this.loading = false;
            }else{
                this.loading = true;
            }
            return Promise.resolve(
                this.options.datasource(this.filter, this.list)
            )
                .then(data => {
                    this._addToList(data);
                    this.loading = false;
                    this.$nextTick(() => {
                        this._scrollHandle();
                    });
                })
                .catch(e => {
                    this.loading = false;
                });
        },
        _addToList(res) {
            if (res) {
                var list =
                    Sunset.getAttribute(res, this.format["list"], res) || [];
                var total =
                    Sunset.getAttribute(res, this.format["count"], 0) || 0;
                this.total = total || list.length;
                if (list && list.length) {
                    var visibles = this.visibles.slice(0);
                    list.forEach((item, index) => {
                        visibles[index] = !this.release;
                    });
                    this.visibles = visibles;
                    if (this.chaos) {
                        this._addToGroups(list);
                    } else {
                        this.list.push.apply(this.list, list);
                    }
                }else{
					this.total = this.list.length;
				}
                this.$emit("output", this.list, this.total);
                this.$refs.datapage && this.$refs.datapage.refresh();
            }
        },
        _addToGroups(list) {
            var groups = this.groups;
            if (groups.length == 0) {
                for (var i = 0; i < this.chaos; i++) {
                    var g = [];
                    g._height = 0;
                    groups.push(g);
                }
            }
            list.forEach(item => {
                Promise.resolve(
                    this.options.height ? this.options.height(item) : 1
                ).then(h => {
                    var minHeightGroup = groups[0];
                    for (var i = 1, g; (g = groups[i++]); ) {
                        if (g._height < minHeightGroup._height) {
                            minHeightGroup = g;
                        }
                    }
                    minHeightGroup.push(item);
                    minHeightGroup._height += h;
                });
            });
        },
        _scrollHandle() {
            if (this.mode == "WATERFALL") {
                if (
                    this.$el.clientHeight > 0 &&
                    !this.loadFinish &&
                    this._calculateScrollBottomHeight() <= this.preloadHeight
                ) {
                    this._loadData();
                }
                this.release && this._release();
            }
        },
        //释放资源
        _release() {
            var items = this.$refs.items;
            if (items && items.length) {
                var containerSize = this._getContainerSize(),
                    pieceSize = this._getPieceSize();

                var parentOffsetTop = offset(this.$el).top;
                var top = -this.windowMargin;
                var bottom = containerSize.height + this.windowMargin;
                this.safeOptions.debug && console.time("visible-check");
                var clientWidth = this.$el.clientWidth;
                var colsCount = 0;

                if (items[0].clientWidth != 0) {
                    colsCount = Math.floor(
                        containerSize.width / pieceSize.width
                    );
                    if (this.safeOptions.debug) {
                        console.log(
                            "containerSize.width:" + containerSize.width
                        );
                        console.log("pieceSize.width:" + pieceSize.width);
                        console.log("colsCount:" + colsCount);
                    }
                }
                if (this.safeOptions.debug) {
                    console.log("top:" + top);
                    console.log("bottom:" + bottom);
                }
                if (colsCount > 0) {
                    var visibles = this.visibles;
                    for (var i = 0, l = items.length; i < l; i += colsCount) {
                        var item = items[i];
                        var visible = !this._isHidden(
                            item,
                            parentOffsetTop,
                            top,
                            bottom
                        );
                        if (
                            visibles[i] ==
                                visibles[Math.min(l - 1, i + colsCount - 1)] &&
                            visibles[i] == visible
                        ) {
                            continue;
                        }
                        for (var j = 0; j < colsCount; j++) {
                            this.$set(visibles, i + j, visible);
                            // this.list[i + j] && (this.list[i + j].__visible = visible);
                        }
                    }
                }
                this.safeOptions.debug && console.timeEnd("visible-check");
            }
        },
        _isHidden(el, parentOffsetTop, top, bottom) {
            var offsetTop = offset(el).top - parentOffsetTop;
            if (this.safeOptions.debug) {
                console.log("offset(el).top:" + offset(el).top);
                console.log("parentOffsetTop:" + parentOffsetTop);
                console.log("offsetTop:" + offsetTop);
                console.log(
                    "_isHidden   offsetTop < top || offsetTop > bottom:" +
                        (offsetTop < top || offsetTop > bottom)
                );
            }
            return offsetTop < top || offsetTop > bottom;
        },
        _calculateScrollBottomHeight() {
            var $container = this.$refs.container;
            return (
                $container.scrollHeight() -
                $container.paneOffsetHeight() -
                $container.scrollTop()
            );
        },
        _getContainerSize() {
            var release = this.safeOptions.release;
            if (
                Sunset.isObject(release) &&
                Sunset.isObject(release.container)
            ) {
                return {
                    width: Sunset.isFunction(release.container.width)
                        ? release.container.width()
                        : release.container.width,
                    height: Sunset.isFunction(release.container.height)
                        ? release.container.height()
                        : release.container.height
                };
            } else {
                return {
                    width: this.$el.clientWidth,
                    height: this.$refs.container.offsetHeight()
                };
            }
        },
        _getPieceSize() {
            var release = this.safeOptions.release;
            if (Sunset.isObject(release) && Sunset.isObject(release.piece)) {
                return {
                    width: Sunset.isFunction(release.piece.width)
                        ? release.piece.width()
                        : release.piece.width,
                    height: Sunset.isFunction(release.piece.height)
                        ? release.piece.height()
                        : release.piece.height
                };
            } else {
                return {
                    width: this.$refs.items.length
                        ? this.$refs.items[0].clientWidth
                        : 0,
                    height: this.$refs.items.length
                        ? this.$refs.items[0].clientHeight
                        : 0
                };
            }
        },
        changeMode(mode) {
            this.mode = mode == "TABLE" ? "TABLE" : "WATERFALL";
            if (this.mode == "TABLE") {
                this.$refs.datapage && this.$refs.datapage.refresh(1);
            } else {
                // this.scrollToTop();
            }
        },
        scrollToTop() {
            this.$refs.container.scrollToTop();
        }
    },
    mounted() {
        this.init();
    },
    watch:{
        "options.mode":{
            immediate:true,
            handler(mode){
                this.mode = mode;
            }
        }
    }
};
</script>
<style lang="less">
.xui-waterfall {
    .xwf-chaos {
        display: flex;
        & > ul {
            padding: 0px;
            list-style: none;
            flex-grow: 1;
            & > li {
                display: block;
                overflow: hidden;
            }
        }
    }
}
.xui-empty {
    text-align: center;
    padding: 10px 0px;
    & > i {
        &:before {
            content: "暂无数据";
            font-style: normal;
        }
    }
}
</style>
