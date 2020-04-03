<style lang="scss">
.xui-imagemarker {
	position: relative;
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Chrome/Safari/Opera */
	-khtml-user-select: none; /* Konqueror */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently not supported by any browser */
	img {
		width: 100%;
	}
	canvas {
		position: absolute;
		top: 0px;
		left: 0px;
		z-index: 2;
	}
}
</style>

<template>
	<div class="xui-imagemarker">
		<img ref="img" src="" alt="">
	</div>
</template>
<script>
import Marker from "./marker";

export default {
	props: {
		width: {},
		height: {},
		options: {}
	},
	data() {
		return {
			url: null
		};
	},
	computed: {
		safeOptions() {
			return this.options || {};
		},
		cwidth() {
			return this.width || this.safeOptions.width || 150;
		},
		cheight() {
			return this.height || this.safeOptions.height || 150;
		},
		cwh() {
			return this.cwidth * 1.0 / this.cheight;
		}
	},
	methods: {
		setImage(url) {
			this.url = url;
			var img = this.$refs.img,
				self = this;
			img.src = url;
			img.onload = function() {
				img.onload = null;
				self.initMarker(img);
			};
			this.img = img;
		},
		setMarkType(t) {
			this.marker.setMarkType(t);
		},
		setMarkStyle(style) {
			this.marker.setMarkStyle(style);
		},
		markFont(text, pos) {
			this.marker.markFont(text, pos);
		},
		backspace() {
			this.marker.backspace();
		},
		recover() {
			this.marker.recover();
		},
		setMarks(marks) {
			return this.marker.setMarks(marks);
		},
		addMarks(marks) {
			return this.marker.addMarks(marks);
		},
		getMarks() {
			return this.marker.getMarks();
		},
		clearMarks() {
			return this.marker.clearMarks();
		},
		resize() {
			var img = this.$refs.img;
			var scale = this.$el.offsetWidth / img.naturalWidth;
			this.marker.resize({
				scale: scale
			});
		},
		initMarker(img) {
			var imgWh = img.naturalWidth * 1.0 / img.naturalHeight;
			if (this.cwh < imgWh) {
				this.$el.style.width = this.cwidth + "px";
				this.$el.style.height = this.cwidth / imgWh + "px";
			} else {
				this.$el.style.width = this.cheight * imgWh + "px";
				this.$el.style.height = this.cheight + "px";
			}
			//标注器的缩放比例
			var scale = this.$el.offsetWidth / img.naturalWidth;
			if (this.marker) {
				this.marker.reset({
					scale: scale
				});
			} else {
				this.marker = new Marker(this.$el, {
					scale: scale
				});
				this.marker.subscribe("MARK_FONT", pos => {
					this.$emit("mark-font", pos);
				});
			}
			this.resize();
			this.$emit("inited", this.url);
		},
		createSnapshoot() {
			return this.marker.createSnapshoot(this.img);
		}
	}
};
</script>
