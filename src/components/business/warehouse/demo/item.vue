<style lang="scss">
.warehouse-item {
	display: inline-block;
	padding: 5px;
	background: #eee;
	width: 130px;
		height: 150px;
	border: 1px solid #ababab;
	margin: 5px;
	vertical-align: top;
	img {
		width: 130px;
		height: 130px;
		width: 100%;
	}
}
</style>

<template>
	<div class="warehouse-item">
		{{index}}
		<img v-if="visible" :src="visible?imgSrc:''" alt="">
	</div>
</template>
<script>
import "./base64";

export default {
	props: {
		item: {},
		visible: {},
		index: {}
	},
	computed: {
		imgSrc() {
			var item = this.item;
			if (!item.traitImg) {
				item._type = "vehicle";
			}
			if (item._type == "vehicle" || item._type == "nonmotor") {
				var location = item.location;
				var obj;
				var params = "";
				if (typeof location == "string" && location == "null") {
					location = "";
				}
				// 坐标信息处理-裁剪使用
				if (!!location) {
					obj = this.getPositionOffset(location) || "";
					if (!!obj) {
						params =
							"&left=" +
							obj.left +
							"&top=" +
							obj.top +
							"&right=" +
							obj.right +
							"&bottom=" +
							obj.bottom +
							"&adjust=" +
							obj.adjust;
					} else {
						console.warn("坐标信息缺失（" + location + "）");
					}
				} else {
					params = "&adjust=1";
				}
				return `http://192.168.60.205/vdtimg/${encodeURIComponent(
					Base64.toBase64(item.sceneImg)
				)}&ratio=1&encode=1${params}&height=213`;
			} else {
				return `http://192.168.60.205/vdtimg/${encodeURIComponent(
					Base64.toBase64(item.traitImg)
				)}&ratio=1&encode=1&adjust=1&height=213`;
			}
		}
	},
	methods: {
		getPositionOffset(postion) {
			var _array = [];
			var adjust = 0;
			if (!postion) return;
			if (typeof postion == "string") {
				_array = postion.split(".");
			} else {
				_array = postion;
			}
			if (_array.length != 4) return;
			// 进行逻辑处理-最大边长为单位，扩展1.6倍
			var Expansion = 1.6,
				left = parseInt(_array[0]),
				top = parseInt(_array[1]),
				right = parseInt(_array[2]),
				bottom = parseInt(_array[3]);
			var width = right - left,
				height = bottom - top,
				sideSize = width > height ? width : height;
			// 获取扩张比例，默认1.6倍
			var offsetSize = Math.floor(sideSize * (Expansion - 1) / 2),
				tLeft = left - offsetSize,
				tTop = top - offsetSize,
				tRight = left + sideSize + offsetSize,
				tBottom = top + sideSize + offsetSize;
			if (tLeft < 0) {
				tLeft = 0;
				tRight = sideSize + 1 * offsetSize;
			}
			if (tTop < 0) {
				tTop = 0;
				tBottom = sideSize + 1 * offsetSize;
			}
			if (tLeft > 0 && tTop > 0) {
				adjust = 1;
			}
			return {
				left: tLeft,
				top: tTop,
				right: tRight,
				bottom: tBottom,
				adjust: adjust
			};
		}
	}
};
</script>
