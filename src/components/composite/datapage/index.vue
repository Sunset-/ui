<style lang="scss">
@import "~src/style/variable.scss";

.xui-datapage {
    .xui-datapage-footer {
        margin-top: 15px;
        .xui-table-loadmore {
            text-align: center;
            cursor: pointer;
            .loadmore-trigger {
                display: inline-block;
            }
            .load-finish-tip {
                display: none;
                &:after {
                    font-size: 14px;
                    color: $color-subcolor;
                }
            }
            &.loading {
                .loadmore-trigger {
                    display: none;
                }
                .load-finish-tip {
                    display: inline-block;
                    &:after {
                        content: "加载中...";
                    }
                }
            }
            &.load-finish {
                .loadmore-trigger {
                    display: none;
                }
                .load-finish-tip {
                    display: inline-block;
                    &:after {
                        content: "已无更多数据";
                    }
                }
            }
        }
    }
}
</style>
<template>
    <div :class="['xui-datapage xui-datapage-style',!list.length?'empty':'']">
        <datapage-loading :loading="isCumulate?false:loading">
            <slot :list="list" :count="count"></slot>
            <div v-show="!list.length&&!loading">
                <slot name="empty">
                    <div class="xui-empty xui-empty-style">
                        <i></i>
                    </div>
                </slot>
            </div>
        </datapage-loading>
        <!--分页-->
        <div v-if="!isCumulate" v-show="showPager" class="xui-datapage-footer">
            <datapage-pager @change="refreshFromPagination" :page-number="localPageNumber" :total="count" :options="pagerOptions" @changePageSize="changePageSize"></datapage-pager>
        </div>
        <!--加载更多-->
        <div v-if="isCumulate" v-show="showPager" class="xui-datapage-footer">
            <div :class="['xui-table-loadmore',loading?'loading':'',isLoadFinished?'load-finish':'']">
                <datapage-button class="loadmore-trigger" size="normal" @click="loadMore">点击加载更多</datapage-button>
                <span class="load-finish-tip">
                    <i></i>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import Sunset from "../../../common/sunset";
import DatapagePager from "../../base/pager";
import DatapageLoading from "../../base/loading";
import DatapageButton from "../../base/button";

export default {
    components: {
        DatapagePager,
        DatapageLoading,
        DatapageButton
    },
    props: {
        ctx: {},
        options: {
            type: Object
        }
    },
    data() {
        return {
            localPageNumber: 1,
            pageNumber: 1,
            filter: {},
            localFilter: null,
            data: null,
            count: 0,
            loading: false,
            list: [],
            allDataList: [],
            pageDataCache: {},
            requestCache: {},
            isLocalDataSource: false,
            localData: null,
            afterClear: false,
            pollingTimer: null,
            loopRenderTimer: null
        };
    },
    computed: {
        idKey() {
            return this.options.key || "id";
        },
        isCache() {
            var preload = this.preload,
                cache = this.options.cache,
                localPageSize = this.localPageSize,
                pageSize = this.pageSize;
            return (
                !!preload ||
                !!cache ||
                localPageSize != pageSize ||
                this.isCumulate
            );
        },
        pagerOptions() {
            var localPageSize = this.localPageSize;
            var pagerOptions = Object.assign(
                {},
                this.options.pagerOptions || {
                    size: "normal"
                }
            );
            return Object.assign(pagerOptions, {
                pageSize: localPageSize
            });
        },
        pageStart() {
            return this.options.pageNumberStart === 0 ? 0 : 1;
        },
        format() {
            return this.options.format || {};
        },
        localPageSize() {
            return this.isCumulate
                ? this.pageSize
                : this.options.localPageSize || this.pageSize;
        },
        pageSize() {
            return this.options.pageSize || 10;
        },
        datasource() {
            return this.options.datasource;
        },
        formatFilter() {
            return this.options.formatFilter;
        },
        showPager() {
            return (
                this.count > this.localPageSize ||
                (!!this.pagerOptions.sizer && this.count != 0)
            );
        },
        slientLoading() {
            return this.options.loading === false;
        },
        preload() {
            return this.isCumulate ? 0 : this.options.preload || 0;
        },
        isCumulate() {
            return this.options.cumulate;
        },
        isLoadFinished() {
            var count = 0;
            var pageDataCache = this.pageDataCache;
            Object.keys(pageDataCache).forEach(key => {
                count += this._getListFromData(pageDataCache[key]).length;
            });
            return count == this.count;
        }
    },
    methods: {
        setOptions(ops, reload) {
            Object.keys(ops).forEach(key => {
                this.$set(this.options, key, ops[key]);
            });
            if (reload) {
                this.refresh();
            } else {
                this._output();
            }
        },
        setCount(count) {
            this.count = count;
            var pageDataCache = this.pageDataCache;
            if (pageDataCache) {
                Object.keys(pageDataCache).forEach(k => {
                    Sunset.setAttribute(
                        pageDataCache[k],
                        this.format["count"] || "count",
                        count
                    );
                });
            }
        },
        //设置查询条件
        search(filter, localFilter) {
            this.isLocalDataSource = false;
            this.filter = Sunset.clone(filter || {});
            this.localFilter = localFilter;
            this.refresh(1);
        },
        //分页切换（查询条件不变）
        refreshFromPagination(localPageNumber) {
            if (this.afterClear) {
                this.afterClear = false;
                return;
            }
            this.$emit("pagechange", localPageNumber);
            this.refresh(localPageNumber, true);
        },
        loadMore() {
            if (!this._isLoadFinished()) {
                this.refreshFromPagination((this.localPageNumber += 1));
            }
        },
        //刷新数据
        refresh(localPageNumber, fromPage, silent) {
            if (!this.format) {
                return;
            }
            if (!fromPage) {
                //清缓存
                this.requestCache = {};
                this.pageDataCache = {};
            }
            //计算本地页码
            localPageNumber =
                localPageNumber == void 0
                    ? this.localPageNumber
                    : localPageNumber;
            this.localPageNumber = localPageNumber;
            //计算服务端页码
            var pageNumber = this._calculateServerPageNumber(localPageNumber);
            //加载数据
            var currentLoadFilter = this.filter;
            return Promise.resolve()
                .then(() => {
                    if (this.isLocalDataSource) {
                        return this.localData;
                    } else {
                        return this._loadData(
                            pageNumber,
                            silent,
                            currentLoadFilter
                        );
                    }
                })
                .then(res => {
                    if (currentLoadFilter === this.filter) {
                        this.data = res;
                        this._output();
                    }
                });
        },
        setData(data) {
            this.isLocalDataSource = true;
            this.localData = data;
            this.refresh(1);
        },
        getData(){
            return this.list
        },
        clear() {
            this.data = null;
            this.count = 0;
            this.list = [];
            //清缓存
            this.requestCache = {};
            this.pageDataCache = {};
            this.isLocalDataSource = false;
            this.localData = null;
            this.afterClear = true; //count变为0会触发分页的change事件
            this.$emit("output", this.list, this.count);
            this.$nextTick(() => {
                this.afterClear = false;
            });
        },
        _loadData(pageNumber, isPreload, curretLoadFilter, returnPageNumbers) {
            return Promise.resolve()
                .then(() => {
                    this.$emit("load-start");
                    var cacheData;
                    if ((cacheData = this.pageDataCache[pageNumber])) {
                        //缓存获取
                        return cacheData;
                    } else {
                        //远程获取
                        isPreload || this._refreshLoader(true);
                        return this._request(pageNumber);
                    }
                })
                .then(res => {
                    if (curretLoadFilter === this.filter) {
                        if (!isPreload) {
                            //判断是否回退到前一页
                            var list =
                                (res &&
                                    Sunset.getAttribute(
                                        res,
                                        this.format["list"] || "list",
                                        res
                                    )) ||
                                [];
                            var count =
                                (res &&
                                    Sunset.getAttribute(
                                        res,
                                        this.format["count"] || "count",
                                        0
                                    )) ||
                                0;
                            if (
                                list.length == 0 &&
                                count > 0 &&
                                this.localPageNumber > 1
                            ) {
                                this.refresh(this.localPageNumber - 1, true);
                                Sunset.warning("当前页无数据，回退至前一页");
                            }
                        }
                    }
                    return res;
                })
                .then(res => {
                    this._refreshLoader(false);
                    if (curretLoadFilter === this.filter) {
                        this._preloadData(); //预加载
                        this.$emit("load-end");
                    }
                    if (this.isCache) {
                        var count = this._getCountFromData(res);
                        var loadDataCount = this._getLoadDataCount(res);
                        var showDataCount =
                            this.localPageSize * this.localPageNumber;
                        if (
                            loadDataCount < count &&
                            loadDataCount < showDataCount
                        ) {
                            if (returnPageNumbers) {
                                returnPageNumbers.push(pageNumber);
                            } else {
                                returnPageNumbers = [pageNumber];
                            }
                            return this._loadData(
                                pageNumber + 1,
                                false,
                                curretLoadFilter,
                                returnPageNumbers
                            );
                        }
                        if (returnPageNumbers && returnPageNumbers.length) {
                            var returnPageNumber = returnPageNumbers.pop();
                            return this._loadData(
                                returnPageNumber,
                                false,
                                curretLoadFilter,
                                returnPageNumbers
                            );
                        } else {
                            return res;
                        }
                    } else {
                        return res;
                    }
                })
                .catch(e => {
                    console.warn && console.warn(e);
                    this.$emit("load-error", e);
                    this._refreshLoader(false);
                });
        },
        _isLoadFinished() {
            var count = 0;
            var pageDataCache = this.pageDataCache;
            Object.keys(pageDataCache).forEach(key => {
                count += this._getListFromData(pageDataCache[key]).length;
            });
            return count == this.count;
        },
        _request(pageNumber) {
            if (this.requestCache[pageNumber]) {
                return this.requestCache[pageNumber];
            } else {
                var request = Promise.resolve()
                    .then(() => {
                        //格式化查询参数
                        var filter;
                        var currentPagePlace =
                            this.format["currentPage"] || "currentPage";
                        //分页参数
                        filter = Sunset.clone(this.filter);
                        filter[currentPagePlace] =
                            this.pageStart === 0 ? pageNumber - 1 : pageNumber;
                        filter[
                            this.format["pageSize"] || "pageSize"
                        ] = this.pageSize;
                        //参数格式化钩子函数
                        filter =
                            (this.formatFilter && this.formatFilter(filter)) ||
                            filter;
                        return this.datasource(
                            filter,
                            this.ctx,
                            this._getLoadDataList()
                        );
                    })
                    .then(res => {
                        //缓存
                        if (this.isCache) {
                            this.$set(this.pageDataCache, pageNumber, res);
                            // this.pageDataCache[pageNumber] = res;
                        }
                        delete this.requestCache[pageNumber];
                        return res;
                    })
                    .catch(e => {
                        delete this.requestCache[pageNumber];
                        throw e;
                    });
                this.requestCache[pageNumber] = request;
                return request;
            }
        },
        //预加载数据
        _preloadData() {
            if (!this.preload || this._isLoadFinished()) {
                return;
            }
            var maxPage = 0;
            Object.keys(this.pageDataCache).forEach(p => {
                maxPage = Math.max(maxPage, +p);
            });
            if (
                (this.pageSize * maxPage) / this.localPageSize -
                    this.localPageNumber <
                this.preload
            ) {
                this._loadData(maxPage + 1, true, this.filter);
            }
        },
        //输出数据
        _output() {
            var list,
                count = 0;
            if (this.format) {
                //列表数据
                list = this._getListFromData(this.data) || [];
                count =
                    this.data &&
                    Sunset.getAttribute(
                        this.data,
                        this.format["count"] || "count",
                        0
                    );
                var pagelist = this._splitLocalDataPage(list);
                if (pagelist.length == 0 && list.length != 0) {
                    this.refresh(this.localPageNumber - 1, true);
                    Sunset.warning("当前页无数据，回退至前一页");
                    return;
                }
                //开始轮询(并将附带数据继承下来)
                this._polling(pagelist);
                //输出数据
                if (!this.isCumulate) {
                    this.$emit(
                        "output",
                        (this.list = pagelist),
                        (this.count = count)
                    );
                } else {
                    this.$emit(
                        "output",
                        (this.list = this._getLoadDataList()),
                        (this.count = count)
                    );
                }
            }
        },
        /**
         * loading
         */
        _refreshLoader(flag) {
            if (!this.slientLoading) {
                this.loading = flag;
            }
        },
        /**
         * 计算服务端页码
         */
        _calculateServerPageNumber(localPageNumber) {
            if (this.localPageSize == this.pageSize) {
                return localPageNumber;
            } else {
                var start = this.localPageSize * (localPageNumber - 1) + 1;
                return start % this.pageSize == 0
                    ? start / this.pageSize
                    : Math.ceil((start * 1.0) / this.pageSize);
            }
        },
        /**
         * 将数据按本地分页大小拆分
         */
        _splitLocalDataPage(list) {
            if (this.localPageSize != this.pageSize || this.isLocalDataSource) {
                var dataPageSize = this.isLocalDataSource
                    ? 999999999
                    : this.pageSize;
                var start =
                    ((this.localPageNumber - 1) * this.localPageSize) %
                    dataPageSize;
                var end = start + this.localPageSize;
                list = list.slice(start, end);
                if (list.length < this.localPageSize) {
                    var currentPageNumber = this._calculateServerPageNumber(
                        this.localPageNumber
                    );
                    var nextPageNumber = currentPageNumber;
                    while (true) {
                        nextPageNumber++;
                        if (this.pageDataCache[nextPageNumber]) {
                            //列表数据
                            var nextList = this._getListFromData(
                                this.pageDataCache[nextPageNumber]
                            );
                            list = list.concat(
                                nextList.slice(
                                    0,
                                    this.localPageSize - list.length
                                )
                            );
                            if (list.length == this.localPageSize) {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
                return list;
            } else {
                return list;
            }
        },
        _getListFromData(data) {
            var list;
            //列表数据
            if (this.format && this.format["list"] == "") {
                list = data || [];
            } else {
                list =
                    data &&
                    Sunset.getAttribute(
                        data,
                        this.format["list"] || "list",
                        []
                    );
            }
            return list;
        },
        _getCountFromData(data) {
            var count;
            //列表数据
            if (this.format && this.format["count"] == "") {
                count = data || 0;
            } else {
                count =
                    data &&
                    Sunset.getAttribute(
                        data,
                        this.format["count"] || "count",
                        0
                    );
            }
            return Math.max(count, this._getListFromData(data).length);
        },
        /**
         * 获取已加载的数据列表
         */
        _getLoadDataList() {
            var pageDataCache = this.pageDataCache;
            return Object.keys(pageDataCache)
                .sort((o1, o2) => {
                    o1 = +o1;
                    o2 = +o2;
                    return o1 < o2 ? -1 : o1 > o2 ? 1 : 0;
                })
                .reduce((res, key) => {
                    return res.concat(
                        this._getListFromData(pageDataCache[key])
                    );
                }, []);
        },
        /**
         * 获取已加载的数据总量
         */
        _getLoadDataCount(res) {
            var count = 0;
            var pageDataCache = this.pageDataCache;
            Object.keys(pageDataCache).forEach(key => {
                count += this._getListFromData(pageDataCache[key]).length;
            });
            return Math.max(count, this._getListFromData(res).length);
        },
        /**
         * 从缓存中获取分页数据
         */
        _sliceDataFromCache(localPageNumber) {},
        /**
         * 轮询更新数据
         */
        _polling(newList) {
            clearTimeout(this.pollingTimer);
            if (!this._isDestroyed && this.list) {
                var polling = this.options.polling;
                if (Sunset.isNumber(polling)) {
                    var originList = this.list;
                    //将子表格数据合并入源数据
                    var idKey = this.idKey;
                    var xuiAttrsCache = originList.reduce((res, item) => {
                        var xuiAttrs = Object.keys(item).filter(
                            key => key.indexOf("__xui") == 0
                        );
                        if (xuiAttrs.length > 0) {
                            res[item[idKey]] = xuiAttrs.reduce((attrs, key) => {
                                attrs[key] = item[key];
                                return attrs;
                            }, {});
                        }
                        return res;
                    }, {});
                    newList &&
                        newList.forEach(item => {
                            if (xuiAttrsCache[item[idKey]]) {
                                Object.keys(xuiAttrsCache[item[idKey]]).forEach(
                                    key => {
                                        this.$set(
                                            item,
                                            key,
                                            xuiAttrsCache[item[idKey]][key]
                                        );
                                    }
                                );
                            }
                        });
                    this.pollingTimer = setTimeout(() => {
                        Promise.resolve(this.refresh(void 0, void 0, true));
                    }, polling);
                } else if (Sunset.isArray(this.options.polling)) {
                    var pollingSpace = this.options.polling[1];
                    var pollingFunc = this.options.polling[0];
                    if (
                        Sunset.isFunction(pollingFunc) &&
                        Sunset.isNumber(pollingSpace)
                    ) {
                        this.pollingTimer = setTimeout(() => {
                            Promise.resolve(
                                pollingFunc(this.list, this.ctx)
                            ).then(isContinue => {
                                if (isContinue !== false) {
                                    this._polling();
                                }
                            });
                        }, pollingSpace);
                    }
                }
            }
        },
        changePageSize(v) {
            if (
                this.options.localPageSize &&
                this.options.localPageSize == this.localPageSize
            ) {
                this.setOptions({ localPageSize: v }, true);
            } else {
                this.setOptions({ pageSize: v }, true);
            }
        }
    },
    mounted() {
        if (!this.options.lazy) {
            this.refresh(1);
        }
        if (Sunset.isNumber(this.options.loopRender)) {
            this.loopRenderTimer = setInterval(() => {
                this.list = this.list.concat([]);
            }, this.options.loopRender);
        }
    },
    beforeDestroy() {
        clearTimeout(this.pollingTimer);
        clearTimeout(this.loopRenderTimer);
    }
};
</script>