<template>
    <!-- line -->
    <div v-if="cmanner=='line'" :class="[' xui-progress xui-progress-line xui-progress-line-style']">
        <div :class="['xui-progress-inner',canimate?'xui-progress-animate':'',semanticsColors[realcolor]?'xui-progress-inner-'+semanticsColors[realcolor]:'',cstripe?'stripe':'']" :style="lineInnerStyle">
            <slot :progress="pg"></slot>
        </div>
    </div>
    <!-- circle -->
    <div v-else-if="cmanner=='circle'" class="xui-progress xui-progress-circle xui-progress-circle-style">
        <svg :height="svgWidth" :width="svgWidth">
            <circle class="xui-progress-bg" :cx="svgWidth/2" :cy="svgWidth/2" :r="cradius" fill="none" :stroke="cbackgroundColor" :stroke-width="clineWidth" stroke-linecap="round" />
            <circle :class="['xui-progress-circle-inner',cstripe?'stripe':'']" :style="circleLineStyle" :cx="svgWidth/2" :cy="svgWidth/2" :r="cradius" fill="none" :stroke="realcolor" :stroke-width="clineWidth" :stroke-dasharray="dasharray" />
        </svg>
        <slot :progress="pg"></slot>
    </div>
</template>
<script>
import Sunset from "../../../common/sunset";

export default {
    props: {
        value: {},
        manner: {},
        color: {},
        total: {},
        animate: {},
        radius: {},
        lineWidth: {},
        stripe: {},
        backgroundColor: {},
        start: {},
        options: {}
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        cmanner() {
            return this.manner || this.safeOptions.manner || "line";
        },
        ccolor() {
            return this.color || this.safeOptions.color || "primary";
        },
        ctotal() {
            return this.total || this.safeOptions.total || 100;
        },
        cradius() {
            return this.radius || this.safeOptions.radius || 50;
        },
        clineWidth() {
            return +(this.lineWidth || this.safeOptions.lineWidth || 5);
        },
        cbackgroundColor() {
            return (
                this.backgroundColor ||
                this.safeOptions.backgroundColor ||
                "#dbdbdb"
            );
        },
        cstart() {
            return this.start || this.safeOptions.start || "top";
        },
        canimate() {
            return !(
                this.animate === false || this.safeOptions.animate === false
            );
        },
        cstripe() {
            return this.stripe || this.safeOptions.stripe;
        },
        pg() {
            var v = this.value,
                total = this.ctotal;
            if (v === "" || v === null || v === void 0) {
                v = 0;
            }
            return v === total ? 1 : (v * 1.0) / total;
        },
        realcolor() {
            var color = this.ccolor;
            if (Sunset.isFunction(this.ccolor)) {
                color = this.ccolor(this.pg);
            }
            return this.semanticsColors[color] || color;
        },
        lineInnerStyle() {
            var style = {
                width: `${this.pg * 100}%`
            };
            if (this.realcolor) {
                style["background-color"] = this.realcolor;
            }
            return style;
        },
        svgWidth() {
            return this.cradius * 2 + this.clineWidth;
        },
        circleLength() {
            return Math.floor(2 * Math.PI * this.cradius);
        },
        dasharray() {
            return "" + this.circleLength * this.pg + ",10000";
        },
        circleLineStyle() {
            var style = {
                "transform-origin": "center",
                transform: `rotate(${
                    { top: -90, left: -180, right: 0, bottom: 90 }[this.cstart]
                }deg)`
            };
            if (this.canimate) {
                style.transition =
                    "stroke-dasharray 0.3s ease-in, stroke 0.4s linear";
            }
            return style;
        }
    },
    data() {
        return {
            semanticsColors: {
                primary: "#40a4ff",
                success: "#8fc31f",
                danger: "#ff4949",
                warning: "#f7ba2a"
            }
        };
    }
};
</script>
<style lang="scss">
$colors: (
    (
        name: "primary",
        color: #40a4ff
    ),
    (
        name: "success",
        color: #8fc31f
    ),
    (
        name: "danger",
        color: #ff4949
    ),
    (
        name: "warning",
        color: #f7ba2a
    )
);
.xui-progress {
    &.xui-progress-line {
        background: #ccc;
        height: 5px;
        border-radius: 100px;
        overflow: hidden;
        .xui-progress-inner {
            height: 100%;
            @for $i from 1 through length($colors) {
                $item: nth($colors, $i);
                &.xui-progress-inner-#{map-get($item, name)} {
                    background: map-get($item, color);
                }
            }
            &.xui-progress-animate {
                transition: width 0.3s ease-in-out, background-color 0.4s linear;
            }
        }
    }

    &.xui-progress-circle {
        position: relative;
        display: inline-block;
    }
    @-webkit-keyframes progress-bar-stripes {
        from {
            background-position: 30px 0;
        }
        to {
            background-position: 0 0;
        }
    }
    @keyframes progress-bar-stripes {
        from {
            background-position: 30px 0;
        }
        to {
            background-position: 0 0;
        }
    }

    .stripe {
        background-image: -webkit-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
        );
        background-image: -o-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
        );
        background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
        );
        -webkit-background-size: 30px 30px;
        background-size: 30px 30px;

        -webkit-animation: progress-bar-stripes 2s linear infinite;
        -o-animation: progress-bar-stripes 2s linear infinite;
        animation: progress-bar-stripes 2s linear infinite;
    }
}
</style>
