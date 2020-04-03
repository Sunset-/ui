<template>
	<div class="xui-viewer xui-viewer-style">
		<viewer-loading :loading="!visible" :inner="true" :delay="true"></viewer-loading>
		<div ref="wrap" ondragstart="return false;" :class="['xui-viewer-wrap',visible?'xv-visible':'',animate?'animate':'']">
			<slot></slot>
		</div>
	</div>
</template>
<script>
import Sunset from "../../../common/sunset";
import offset from "../waterfall/offset.js";
import viewerLoading from "../../base/loading";

export default {
	components: {
		viewerLoading
	},
	props: ["wait"],
	data() {
		return {
			$wrap: null,
			visible: false,
			animate: true,
			state: {
				x: 0,
				y: 0,
				scale: 1,
				horizontal: 1,
				vertical: 1,
				rotate: 0
			}
		};
	},
	methods: {
		init() {
			this.animate = false;
			this.$nextTick(() => {
				var $wrap = this.$wrap;
				this.visible = true;
				$wrap.style.marginLeft = $wrap.clientWidth / -2 + "px";
				$wrap.style.marginTop = $wrap.clientHeight / -2 + "px";
				this.reset();
				setTimeout(() => {
					this.animate = true;
				}, 100);
			});
		},
		hide() {
			this.visible = false;
		},
		initEvent() {
			this.$wrap = this.$refs.wrap;
			this.initTranslate();
			this.initZoom();
		},
		initTranslate() {
			var state = this.state;
			var $container = this.$el;
			var $wrap = this.$wrap;
			var startX, startY, startMouseX, startMouseY;
			var self = this;

			function move(ev) {
				self.translate(startX + (ev.pageX - startMouseX), startY + (ev.pageY - startMouseY));
				return false;
			}
			function up(ev) {
				self.animate = true;
				$container.removeEventListener("mousemove", move);
				document.body.addEventListener("mouseup", up);
			}
			$wrap.addEventListener("mousedown", function(ev) {
				self.animate = false;
				startX = state.x;
				startY = state.y;
				startMouseX = ev.pageX;
				startMouseY = ev.pageY;
				$container.addEventListener("mousemove", move);
				document.body.addEventListener("mouseup", up);
				return false;
			});
		},
		initZoom() {
			var $wrap = this.$wrap;
			function offset(el, oft, dire) {
				while (el && el != $wrap) {
					oft += el[dire == "x" ? "offsetLeft" : "offsetTop"];
					el = el.parentNode;
				}
				return oft;
			}
			$wrap.addEventListener("mousewheel", ev => {
				this.zoom(ev.wheelDelta > 0, offset(ev.target, ev.offsetX, "x"), offset(ev.target, ev.offsetY, "y"));
				ev.preventDefault();
			});
		},
		/**
		 * 1.还原
		 */
		reset: function() {
			Object.assign(this.state, {
				x: 0,
				y: 0,
				scale: 1,
				horizontal: 1,
				vertical: 1,
				rotate: 0
			});
			this.center();
		},
		/**
		 * 2.平移
		 */
		translate: function(x, y) {
			var state = this.state;
			state.x = x;
			state.y = y;
			this._refreshTransform();
		},
		/**
		 * 3.缩放
		 */
		zoom: function(newScale, offsetX, offsetY) {
			var state = this.state,
				wrap = this.$wrap,
				clientWidth = wrap.clientWidth,
				clientHeight = wrap.clientHeight;
			var next = newScale;
			if (newScale === true || newScale === false) {
				next = newScale ? this.state.scale * 1.1 : this.state.scale / 1.1;
			}
			if (next * clientWidth < 10 || next * clientHeight < 10) {
				return;
			}
			if (next > 0 && next < 17) {
				//以鼠标中心点缩放
				if (offsetX == void 0) {
					offsetX = clientWidth / 2;
				}
				if (offsetY == void 0) {
					offsetY = clientHeight / 2;
				}
				state.x += (clientWidth / 2 - offsetX) * (next - state.scale);
				state.y += (clientHeight / 2 - offsetY) * (next - state.scale);
				state.scale = next;
				this._refreshTransform();
			}
		},
		/**
		 * 旋转
		 */
		rotate(angle) {
			this.state.rotate = angle;
			this._refreshTransform();
		},
		/**
		 * 镜像翻转
		 */
		flipHorizintal() {
			this.state.horizontal = -this.state.horizontal;
			this._refreshTransform();
		},
		/**
		 * 镜像翻转
		 */
		flipVertical() {
			this.state.vertical = -this.state.vertical;
			this._refreshTransform();
		},
		/**
		 * 居中
		 */
		center() {
			var $wrap = this.$wrap;
			if ($wrap.clientWidth && $wrap.clientHeight) {
				var $container = this.$el;
				var scale = Math.min(
					$wrap.clientWidth < $container.clientWidth ? 1 : ($container.clientWidth * 1.0) / $wrap.clientWidth,
					$wrap.clientHeight < $container.clientHeight
						? 1
						: ($container.clientHeight * 1.0) / $wrap.clientHeight
				);
				this.zoom(scale, $wrap.clientWidth / 2, $wrap.clientHeight / 2);
			}
		},
		_refreshTransform() {
			var state = this.state,
				stl = this.$wrap.style,
				buff = [];
			buff.push("translate(");
			buff.push(state.x);
			buff.push("px,");
			buff.push(state.y);
			buff.push("px) ");
			buff.push("scale(");
			buff.push(state.scale * state.horizontal);
			buff.push(",");
			buff.push(state.scale * state.vertical);
			buff.push(") rotate(");
			buff.push(state.rotate);
			buff.push("deg)");
			buff = buff.join("");
			// 兼容各浏览器
			stl.transform = buff;
			stl.oTransform = buff;
			stl.msTransform = buff;
			stl.mozTransform = buff;
			stl.webkitTransform = buff;
			this.$emit("transform", this.state);
		},
		waitInit(){
			var v = this.wait;
			this.hide();
			if (!v) {
				this.visible = true;
				return;
			}
			if (!Sunset.isArray(v)) {
				v = [v];
			}
			Promise.all(
				v.map(src => {
					return new Promise(resolve => {
						var img = new Image();
						img.src = src;
						img.onload = () => {
							img.onload = null;
							resolve();
						};
					});
				})
			).then(res => {
				if (v == this.wait) {
					this.init();
				}
			});
		}
	},
	watch: {
		wait(v) {
			this.waitInit();
		}
	},
	mounted() {
		this.initEvent();
		this.waitInit();
	}
};
</script>
<style lang="scss">
.xui-viewer {
	overflow: hidden;
	position: relative;
	.xui-viewer-wrap {
		position: absolute;
		top: 50%;
		left: 50%;
		visibility: hidden;
		&.animate {
			transition: all 0.15s ease;
		}
		&.xv-visible {
			visibility: visible;
		}
		img {
			-webkit-user-drag: none;
			user-select: none;
		}
	}
}
</style>

