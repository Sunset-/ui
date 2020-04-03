<template>
    <div v-show="visible" class="xui-modal xui-modal-style">
        <iframe scroll="none" src="about:blank" class="xui-modal-iframe"></iframe>
        <div class="xui-modal-masker" @click="close(true)"></div>
        <div class="xui-modal-box" :style="style">
            <div class="xui-modal-header">
                <div class="xui-modal-title" v-html="ctitle"></div>
                <slot name="header"></slot>
                <div class="xui-modal-close-icon" @click="close()">
                    <i class="xui-icon xui-icon-close"></i>
                </div>
            </div>
            <div class="xui-modal-content">
                <slot :opened="opened" />
                <slot name="content" :opened="opened" />
            </div>
            <div class="xui-modal-footer">
                <slot name="footer" :opened="opened" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        top: {},
        width: {},
        height: {},
        maskClose: {}, // 点击空白区域是否关闭
        title: {},
        options: {}
    },
    data() {
        return {
            visible: false,
            opened: false
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        style() {
            var style = this.safeOptions.style || {};
            var w = this.width || this.safeOptions.width;
            var h = this.height || this.safeOptions.height;
            var top = this.top || this.safeOptions.top || 100;
            if (!isNaN(w)) {
                w = w + "px";
            }
            if (!isNaN(h)) {
                h = h + "px";
            }
            if (!isNaN(top)) {
                top = top + "px";
            }
            style.width = w || "";
            style.height = h || "auto";
            style.top = top || "auto";
            return style;
        },
        ctitle() {
            return this.title || this.safeOptions.title;
        },
        cmaskNotClose() {
            return (
                this.maskClose === false || this.safeOptions.maskClose === false
            );
        }
    },
    methods: {
        open: function() {
            this.visible = true;
            this.opened = true;
            this.$emit("opened");
        },
        close: function(fromMask) {
            if (fromMask === true && this.cmaskNotClose) {
                return;
            }
            this.visible = false;
            this.$emit("closed");
        }
    },
    mounted() {
        document.body.appendChild(this.$el);
    },
    destroyed() {
        this.$el && this.$el.remove();
    }
};
</script>

<style lang="less">
.xui-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    text-align: center;
    .xui-modal-iframe {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    i {
        font-style: normal;
    }
    .xui-modal-masker {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(102, 102, 102, 0.7);
        z-index: 0;
        display: table-cell;
        text-align: center;
    }
    .xui-modal-box {
        text-align: left;
        display: inline-block;
        position: relative;
        z-index: 1;
        // left: 50%;
        // top: 40%;
        // transform: translate(-50%, -50%);
        // -webkit-transform: translate(-50%, -50%);
        box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.1);
        background-color: white;
        border-radius: 3px;
        z-index: 1;
    }
    .xui-modal-header {
        position: relative;
    }
    .xui-modal-title {
        font-size: 14px;
        padding: 10px 10px;
        font-weight: bold;
        // border-bottom: 1px solid #dedede;
    }
    .xui-modal-close-icon {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
        -webkit-transform: translate(0, -50%);
        cursor: pointer;
        &:hover {
            color: #40a4ff;
        }
    }
}
</style>