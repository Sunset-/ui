<template>
    <div v-show="visible" :class="['xui-picker xui-picker-style']" @click.stop="emptyClick">
        <picker-scroll ref="scroll">
            <slot></slot>
        </picker-scroll>
        <iframe scroll="none" src="about:blank" class="xui-picker-iframe"></iframe>
    </div>
</template>
<script>
import Popper from "./popper.js";
import pickerScroll from "../scroll";
import offset from "src/tools/offset";

export default {
    components: {
        pickerScroll
    },
    props: {
        placement: {
            type: String,
            default: "bottom-start"
        },
        fixed: {}
    },
    data() {
        return {
            inited: false,
            visible: false,
            popper: null,
            closeFunc: null
        };
    },
    methods: {
        init() {
            if (!this.$parent.$refs.reference) {
                console.error(
                    `未找到picker挂载目标，请在父组件中指定：ref="reference"`
                );
            }
            // this.$el.style.width = this.$el.parentNode.clientWidth + "px";
            if (this.popper) {
                this.$nextTick(() => {
                    this.update();
                    this.popperStatus = true;
                });
            } else {
                this.$nextTick(() => {
                    this.popper = new Popper(
                        this.$parent.$refs.reference,
                        this.$el,
                        {
                            placement: this.placement,
                            modifiers: {
                                computeStyle: {
                                    gpuAcceleration: false
                                },
                                preventOverflow: {
                                    boundariesElement: "window"
                                }
                            },
                            onCreate: () => {
                                this.resetTransformOrigin();
                                this.update();
                            },
                            onUpdate: () => {
                                this.resetTransformOrigin();
                            }
                        }
                    );
                    this.$nextTick(() => {
                        this.visible = true;
                    });
                });
            }
        },
        update() {
            setTimeout(() => {
                this.popper && this.popper.update();
                this.$refs.scroll.updateBar();
                this.inited = true;
            });
        },
        resetTransformOrigin() {
            if (this.popper && this.popper.popper) {
                let x_placement = this.popper.popper.getAttribute(
                    "x-placement"
                );
                console.log(x_placement);
                // let placementStart = x_placement.split("-")[0];
                // let placementEnd = x_placement.split("-")[1];
                // const leftOrRight = x_placement === "left" || x_placement === "right";
                // if (!leftOrRight) {
                // 	this.popper.popper.style.transformOrigin =
                // 		placementStart === "bottom" || (placementStart !== "top" && placementEnd === "start")
                // 			? "center top"
                // 			: "center bottom";
                // }
                // var el = this.$parent.$refs.reference;
                // var of = offset(el);
                // var scrollTop = document.body.scrollTop||document.documentElement.scrollTop;
                // var windowTop = $(el).offset().top;
                // console.log(`${windowTop} --- ${el.clientHeight} --- ${window.innerHeight}`)
                // if(windowTop+el.clientHeight>=window.innerHeight){
                // 	el.style.bottom = "0"
                // 	el.style.top = "auto"
                // }else{
                // 	el.style.bottom = "auto"
                // 	el.style.top = "0px"
                // }
            }
            // this.popper.popper.style.top = "0px";
        },
        toggle(flag) {
            if (
                flag === true ||
                (flag !== false && (this.inited = !this.inited))
            ) {
                if (!this.visible) {
                    this.$nextTick(() => {
                        this.init();
                        setTimeout(() => {
                            document.addEventListener(
                                "click",
                                (this.closeFunc = this.closeDropdown.bind(
                                    this
                                )),
                                true
                            );
                        }, 100);
                    });
                }
                return true;
            } else {
                document.removeEventListener("click", this.closeFunc);
                this.popper = null;
                this.visible = false;
                return false;
            }
        },
        closeDropdown(ev) {
            var parentNode = ev.target;
            while (parentNode) {
                if (parentNode == this.$el) {
                    return;
                }
                parentNode = parentNode.parentNode;
            }
            this.inited = false;
            this.visible = false;
            document.removeEventListener("click", this.closeFunc);
            this.popper = null;
        },
        emptyClick() {}
    },
    mounted() {
        if (this.fixed) {
            document.body.appendChild(this.$el);
        }
    },
    beforeDestroy() {
        var el = this.$el;
        if (el) {
            if (el.remove) {
                el.remove();
            }
        }
    },
    watch: {
        visible(v) {
            this.$emit("visible", v);
        }
    }
};
</script>
<style lang="scss">
@import "~style/variable.scss";

.xui-picker {
    min-width: inherit;
    overflow: auto;
    margin-top: 2px;
    padding: 0px;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    position: absolute;
    z-index: 2000;
    .xui-picker-iframe {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0px;
        left: 0px;
        border: none;
        z-index: -1;
    }
}
</style>

