<template>
    <div class="xui-virtualized xui-virtualized-style">
        <np-scroll ref="scroll" @scroll="handleScroll" :style="'height:'+resolveProps(options.containerHeight)+'px'" :innerStyle="innerStyle">
            <div class="scroll-content xui-virtualized-content" ref="scrollContent">
                <slot v-for="item in items" :item="item" />
            </div>
        </np-scroll>
    </div>
</template>
<script>
import NpScroll from "../../base/scroll";
export default {
    props: {
        options: {},
        data: {}
    },
    data() {
        return {
            lastStart: 0,
            items: [],
            records: []
        };
    },
    components: {
        NpScroll
    },
    watch: {
        data(v) {
            this.records = v || [];
        },
        "options.records": {
            handler: function(records) {
                if (Array.isArray(records)) {
                    this.records = records;
                }
            },
            immediate: true,
            deep: true
        },
        records: {
            handler() {
                this.render();
            }
        }
    },
    computed: {
        innerStyle() {
            return `height:${this.resolveProps(this.options.recordHeight) *
                this.records.length}px`;
        }
    },
    methods: {
        wrapRecordCount() {
            const containerHeight =
                this.resolveProps(this.options.containerHeight) ||
                this.$el.clientHeight;
            const recordHeight =
                this.resolveProps(this.options.recordHeight) || 30;
            return Math.ceil(containerHeight / recordHeight) + 1 || 80;
        },
        resolveProps(prop) {
            if (typeof prop == "function") {
                return prop();
            }
            return prop;
        },
        setData(records) {
            this.records = records || [];
        },
        render(_start) {
            const { records } = this;
            const { start, end } = this.caculateRenderStart(_start);
            const recordHeight = this.resolveProps(this.options.recordHeight);
            if (records && this.$el) {
                this.items = records.slice(start, end);
                this.$refs.scrollContent.style.top =
                    start * recordHeight + "px";
            }
        },
        handleScroll(scrollTop) {
            let start = Math.floor(scrollTop / this.options.recordHeight);
            this.render(start);
        },
        caculateRenderStart(start) {
            start =
                start === void 0
                    ? this.lastStart === void 0
                        ? 0
                        : this.lastStart
                    : start;
            this.lastStart = start;
            var records = this.records || [];
            // this.initWrapStatus();
            var wrapRecordCount = this.wrapRecordCount();
            var end = Math.min(start + wrapRecordCount + 5, records.length); //+5个，延伸出视窗，防止闪烁
            if (end - start < wrapRecordCount) {
                start = Math.max(end - wrapRecordCount, 0);
            }
            start = Math.max(start, 0);
            // console.log(start, end);
            return {
                start,
                end
            };
        },
        appendRecords(records) {
            this.records = this.records.concat(records);
        },
        removeRecords(filter) {
            if (typeof filter == "function") {
                this.records = this.records.filter(filter);
            } else if (typeof filter == "number") {
                this.records.splice(this.records.indexOf(filter), 1);
            }
        },
        clear() {
            this.records = [];
        }
    }
};
</script>
<style lang="scss">
.xui-virtualized {
    position: relative;
    height: 100%;
    overflow: hidden;
    .xui-virtualized-content {
        position: absolute;
    }
}
</style>


