<template>
	<transition name="xui-dialog-frame" :css="canimate">
		<div v-show="visible" class="xui-dialog xui-dialog-style" :style="{top:ctop + 'px'}">
			<iframe scroll="none" src="about:blank" class="xui-dialog-iframe"></iframe>
			<div class="dialog-main">
				<p class="dialog-title-box">
					<span class="dialog-title" v-html="ctitle"></span>
					<a href="javascript:void(0)" class="fr el-icon-close" v-show="ccloseable" @click="close"></a>
				</p>
				<div class="dialog-content">
					<slot :opened="opened"></slot>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
export default {
	name: "newDialog",
	props: {
		title: {},
		animate: {},
		top: {},
		closeable: {},
		options: {
			type: Object
		}
	},
	data() {
		return {
			visible: false,
			opened: false //是否打开过，用于延迟加载内容
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		ctitle() {
			return this.title || this.safeOptions.title || "";
		},
		canimate() {
			return !(this.animate === false || this.safeOptions.animate === false);
		},
		ctop() {
			return this.top || this.safeOptions.top || 0;
		},
		ccloseable() {
			return !(this.closeable === false || this.safeOptions.closeable === false);
		}
	},
	methods: {
		open() {
			this.visible = true;
			this.opened = true;
			this.$emit("opened");
		},
		close() {
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
.xui-dialog-frame-enter {
	opacity: 0;
	transform: translateY(800px);
	-webkit-transform: translateY(800px);
}
.xui-dialog-frame-enter-active {
	opacity: 1;
	transition: all 0.2s ease;
}
.xui-dialog-frame-leave {
	opacity: 1;
}
.xui-dialog-frame-leave-active {
	opacity: 0;
	transition: all 0.5s ease;
	transform: translateY(800px);
	-webkit-transform: translateY(800px);
}

.el-icon-close {
	text-decoration: none;
	position: absolute;
	right: 0;
	top: 8px;
	width: 30px;
	height: 30px;
	text-align: center;
	text-decoration: none;
	color: white;
	cursor: pointer;
}
.xui-dialog {
	position: fixed;
	top: 50px;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1000;
}
.xui-dialog-iframe {
	position: absolute;
	width: 100%;
	height: 100%;
}
.dialog-main {
	position: absolute;
	height: 100%;
	width: 100%;
	bottom: 0px;
	left: 0px;
	background: #fff;
	z-index: 900;
	overflow: hidden;
}
.dialog-title-box {
	position: relative;
	margin: 0;
	height: 30px;
	background: #303845;
	color: #fff;
	text-align: left;
	padding-left: 30px;
	font-size: 14px;
	line-height: 30px;
}
.dialog-content {
	position: absolute;
	left: 0;
	right: 0;
	top: 30px;
	bottom: 0;
	overflow-y: auto;
	overflow-x: hidden;
}
.dialog-title {
	position: relative;
}
</style>
