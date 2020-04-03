<template>
    <div class="xui-scroll xui-scroll-style">
        <div ref="pane" :class="['scrollpane',cwrapClassName,draging?'draging':'']" :style="paneStyle" @scroll.stop="scrollHandle">
            <div ref="view" :class="['scrollview',cinnerClassName]" :style="cinnerStyle">
                <slot></slot>
            </div>
        </div>
        <div ref="vbar" :class="['scroll-bar vertical',vscroll?'visible':'']">
            <div ref="vslider" class="scroll-bar-slider"></div>
        </div>
    </div>
</template>
<script>
import DomHelper from "../../dom-helper.js";

export default {
    props: {
        options: {},
        innerClassName: {},
        innerStyle: {},
        wrapClassName: {},
        wrapStyle: {}
    },
    data() {
        return {
            vscroll: true,
            unlistenResize: null,
            unlistenResize2: null,
            draging: false,
            sliderHeight: 0,
            scrollSpaceHeight: 0,
            scrollBarSpaceHeight: 0
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        paneStyle() {
            var barWidth = DomHelper.getScrollbarwidth();
            return `margin-right:-${barWidth}px;${this.wrapStyle ||
                this.safeOptions.wrapStyle ||
                ""};${this.safeOptions.paneStyle}`; //margin-bottom:-${barWidth}px;`;
        },
        cwrapClassName() {
            return this.wrapClassName || this.safeOptions.wrapClassName;
        },
        cinnerClassName() {
            return this.innerClassName || this.safeOptions.innerClassName;
        },
        cinnerStyle() {
            return this.innerStyle || this.safeOptions.innerStyle;
        }
    },
    methods: {
        init() {
            this.initEvent();
            this.unlistenResize = DomHelper.listenResize(
                this.$refs.view,
                () => {
                    this.$nextTick(() => {
                        this.updateBar();
                    });
                }
            );
            this.unlistenResize2 = DomHelper.listenResize(
                this.$refs.pane,
                () => {
                    this.$nextTick(() => {
                        this.updateBar();
                    });
                }
            );
            setTimeout(() => {
                this.updateBar();
            }, 50);
        },
        initEvent() {
            var startTop = 0,
                startX = 0,
                startY = 0;
            this.$refs.vbar.addEventListener("click", ev => {
                ev.stopPropagation();
                if (this.draging) {
                    return;
                }
                this.draging = true;
                this.setVSliderTop(ev.offsetY - this.scrollbarHeight * 0.5);
                this.$nextTick(() => {
                    this.draging = false;
                });
            });
            this.bindDrag(
                this.$refs.vslider,
                ev => {
                    ev.stopPropagation();
                    this.draging = true;
                    startTop = parseInt(this.$refs.vslider.style.top);
                    startX = ev.pageX;
                    startY = ev.pageY;
                },
                ev => {
                    ev.stopPropagation();
                    var offsetY = ev.pageY - startY;
                    var newTop = startTop + offsetY;
                    newTop = Math.max(newTop, 0);
                    newTop = Math.min(this.scrollBarSpaceHeight, newTop);
                    this.setVSliderTop(newTop);
                },
                ev => {
                    ev.stopPropagation();
                    this.draging = false;
                }
            );
        },
        setVSliderTop(newTop) {
            this.$refs.vslider.style.top = `${newTop}px`;
            let scrollTop = (this.$refs.pane.scrollTop =
                ((newTop * 1.0) / this.scrollBarSpaceHeight) *
                this.scrollSpaceHeight);
            this.$emit("scroll", scrollTop);
        },
        bindDrag(el, down, move, up) {
            function unmove(ev) {
                up(ev);
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", unmove);
            }
            el.addEventListener("mousedown", ev => {
                down(ev);
                document.addEventListener("mousemove", move);
                document.addEventListener("mouseup", unmove);
            });
        },
        scrollHandle(flag) {
            if (this.draging) {
                return;
            }
            var pane = this.$refs.pane,
                clientHeight = pane.clientHeight,
                scrollHeight = pane.scrollHeight,
                scrollTop = pane.scrollTop;
            var move = (scrollTop * 1.0) / this.scrollSpaceHeight;
            this.$refs.vslider.style.top = `${move *
                this.scrollBarSpaceHeight}px`;
            if (flag !== false) {
                this.$emit("scroll", scrollTop);
            }
        },
        update() {
            this.updateBar();
        },
        updateBar() {
            // var pane = this.$refs.pane,
            // 	vslider = this.$refs.vslider,
            // 	clientHeight = pane.clientHeight,
            // 	scrollHeight = pane.scrollHeight,
            // 	barHeight = this.$refs.vbar.clientHeight,
            // 	scrollTop = pane.scrollTop;
            // var sliderHeight = (pane.clientHeight * 1.0) / pane.scrollHeight;
            // //设置滚动条的最小高度
            // if (sliderHeight < 0.02) {
            // 	sliderHeight = 0.02;
            // }
            // vslider.style.height = `${sliderHeight * 100.0}%`;
            // this.scrollbarHeight = parseInt(vslider.clientHeight);
            // this.scrollSpaceHeight = scrollHeight - clientHeight;
            // this.scrollBarSpaceHeight = barHeight - barHeight * sliderHeight;
            // this.scrollHandle(false);
            // this.$nextTick(() => {
            // 	this.vscroll = this.scrollSpaceHeight - scrollTop > 0;
            // });
            var pane = this.$refs.pane;
            if (!pane) {
                return;
            }
            if (pane.clientHeight > this.$el.clientHeight) {
                pane.style.height = this.$el.clientHeight + "px";
            }
            var vslider = this.$refs.vslider,
                clientHeight = pane.clientHeight,
                scrollHeight = pane.scrollHeight,
                barHeight = this.$refs.vbar.clientHeight,
                scrollTop = pane.scrollTop;
            var sliderHeightPoint =
                (pane.clientHeight * 1.0) / pane.scrollHeight;
            var sliderHeight = barHeight * sliderHeightPoint;
            var diff = 0;
            if (sliderHeight < 50) {
                sliderHeight = 50;
            }
            vslider.style.height = `${sliderHeight}px`;
            this.scrollbarHeight = sliderHeight;
            this.scrollSpaceHeight = scrollHeight - clientHeight;
            this.scrollBarSpaceHeight = barHeight - sliderHeight;
            this.scrollHandle(false);
            this.vscroll = clientHeight < scrollHeight;
        },
        scrollTop() {
            return this.$refs.pane.scrollTop;
        },
        scrollHeight() {
            return this.$refs.pane.scrollHeight;
        },
        paneOffsetHeight() {
            return this.$refs.pane.offsetHeight;
        },
        offsetHeight() {
            return this.$el.offsetHeight;
        },
        getWrap() {
            return this.$refs.pane;
        },
        scrollTo(top) {
            this.$refs.pane.scrollTop = top;
        },
        scrollToTop() {
            this.setVSliderTop(0);
        }
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.unlistenResize && this.unlistenResize();
        this.unlistenResize2 && this.unlistenResize2();
    }
};
</script>
<style lang="scss">
.xui-scroll {
    position: relative;
    overflow: hidden;
    .scrollpane {
        position: relative;
        top: 0px;
        left: 0px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        &.draging {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
    }
    .scrollview {
        position: relative;
    }
    .scroll-bar {
        position: absolute;
        right: 2px;
        bottom: 2px;
        z-index: 1;
        border-radius: 4px;
        opacity: 0.6;
        transition: opacity 0.12s ease-out;
        visibility: hidden;
        &.visible {
            visibility: visible;
        }
        &.vertical {
            width: 6px;
            top: 2px;
            & > div {
                width: 100%;
            }
        }
        &.horizontal {
            height: 6px;
            left: 2px;
            & > div {
                height: 100%;
            }
        }
    }
    .scroll-bar-slider {
        position: relative;
        display: block;
        width: 0;
        height: 0;
        cursor: pointer;
        border-radius: inherit;
        background-color: hsla(220, 4%, 58%, 1.3);
        transition: background-color 0.3s;
    }
}
</style>