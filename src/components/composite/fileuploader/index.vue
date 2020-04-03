<template>
	<div class="xui-fileuploader xui-fileuploader-style">
		<filewidget-file v-if="isPrepend&&!options.readonly" ref="file" :beforeAddFile="beforeAddFile" :thumbnail="true" :ctx="model" :options="options" :disabled="cdisabled" @queue="refreshQueue" @single-success="success" @single-error="onError" @queue-error="onError">
			<div v-if="options.dom" v-html="options.dom">
			</div>
		</filewidget-file>
		<!-- thumbnail start -->
		<div v-for="(item,index) in queue" :key="index" :class="['xf-item-wrap',cdisabled?'disabled':'']">
			<i class="xf-item-remove xui-icon xui-icon-delete" @click="remove(item)"></i>
			<div class="xf-item-thumbnail" :style="thumbnailStyle" v-html="thumbnail(item)">
			</div>
			<div v-show="!item.src" class="xf-item-shim" :style="{height:((100-(item.progress||0))+'%')}"></div>
		</div>
		<!-- thumbnail end -->
		<filewidget-file v-if="!isPrepend&&!options.readonly" ref="file" :beforeAddFile="beforeAddFile" :thumbnail="true" :ctx="model" :options="options" :disabled="cdisabled" @queue="refreshQueue" @single-success="success" @single-error="onError" @queue-error="onError">
			<div v-if="options.dom" v-html="options.dom">
			</div>
		</filewidget-file>
		<span v-if="options.tip" class="xf-tip" :style="options.tipStyle" v-html="options.tip"></span>
	</div>
</template>
<script>
import Sunset from "../../../common/sunset";
import FilewidgetFile from "../../base/file";

export default {
	components: {
		FilewidgetFile
	},
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		options: {
			type: Object
		},
		disabled: {},
		value: {},
		model: {}
	},
	data() {
		return {
			unfileValues: [],
			files: []
		};
	},
	computed: {
		queue() {
			return this.unfileValues.concat(this.files);
		},
		safeOptions() {
			return this.options || {};
		},
		isPrepend() {
			return this.safeOptions.prepend;
		},
		cdisabled() {
			return this.disabled === true || this.safeOptions.disabled === true;
		},
		thumbnailStyle() {
			var thumbnailStyle = this.options.thumbnailStyle;
			return (
				this.options.thumbnailStyle || {
					width: `${(thumbnailStyle && thumbnailStyle.width) || 100}px`,
					height: `${(thumbnailStyle && thumbnailStyle.height) || 100}px`
				}
			);
		},
		spliter() {
			return this.safeOptions.spliter || ",";
		},
		max() {
			return Sunset.isNumber(this.safeOptions.max) && this.safeOptions.max > 0 ? this.safeOptions.max : false;
		}
	},
	methods: {
		refreshQueue(files) {
			this.files = files || [];
		},
		beforeAddFile(files) {
			if (this.max && this.files.length + this.unfileValues.length >= this.max) {
				return false;
			}
		},
		thumbnail(item) {
			var src = item.src || item.thumbnail;
			if (src) {
				if (Sunset.isFunction(this.options.thumbnailRender)) {
					return this.options.thumbnailRender(src, item._value);
				} else {
					return `<img class="viewer-image" group="${this.options.name}" src="${src}" />`;
				}
			} else {
				return "";
			}
		},
		success(item) {
			var format = this.options.format;
			if (!item.value) {
				Promise.resolve()
					.then(() => {
						if (format) {
							return format(item.result, this.model);
						} else {
							return item.result;
						}
					})
					.then(res => {
						this.unfileValues.push({
							value: res
						});
						this.$refs.file.remove(item);
						// this.$set(item, "value", res);
						this.refreshValue();
					})
					.catch(e => {
						this.remove(item);
					});
			}
		},
		onError(err) {
			if (this.files.indexOf(err) >= 0) {
				this.$refs.file.remove(err);
			}
			this.options.onError && this.options.onError(err);
		},
		remove(data) {
			if (this.files.indexOf(data) >= 0) {
				this.$refs.file.remove(data);
			} else {
				this.unfileValues.splice(this.unfileValues.indexOf(data), 1);
			}
			Promise.resolve(this.options.onRemove && this.options.onRemove(data)).then(res => {
				this.refreshValue();
			});
		},
		transformValue(value) {
			var files = this.files || [];
			var haveFiles = [];
			var unfileValues = [];
			if (value) {
				var thumbnail = this.safeOptions.thumbnail;
				if (Sunset.isString(value)) {
					value = value.split(this.spliter);
				}
				value.forEach(v => {
					var item = files.filter(f => f.value === v)[0];
					if (!item) {
						unfileValues.push({
							src: Sunset.isFunction(thumbnail) ? thumbnail(v) || v : thumbnail || v,
							value: v
						});
					} else {
						item.src = Sunset.isFunction(thumbnail) ? thumbnail(v) || v : thumbnail || v;
					}
				});
			}
			this.unfileValues = unfileValues;
		},
		refreshValue() {
			var value = this.queue.filter(item => item.value).map(item => item.value);
			if (Sunset.isString(value[0]) || Sunset.isNumber(value[0])) {
				value = value.join(this.spliter);
			}
			this.$emit("input", value);
		},
		init() {
			this.transformValue(this.value);
		}
	},
	watch: {
		value(v) {
			this.transformValue(v);
		}
	},
	created() {
		this.init();
	}
};
</script>
<style lang="scss">
.xui-fileuploader {
	.xf-item-wrap {
		position: relative;
		border: 1px solid #eee;
		display: inline-block;
		vertical-align: top;
		margin-right: 10px;
		font-size: 0px;
		.xf-item-thumbnail {
			display: inline-block;
		}
		img {
			width: 100%;
			height: 100%;
		}
		.xf-item-shim {
			position: absolute;
			top: 0px;
			z-index: 1;
			left: 0px;
			right: 0px;
			background: rgba(0, 0, 0, 0.7);
			transition: 0.5s;
		}
		.xf-item-remove {
			position: absolute;
			top: 2px;
			z-index: 2;
			right: 2px;
			color: #fff;
			font-size: 16px;
			line-height: 18px;
			color: #d9534f;
			font-family: 微软雅黑;
			font-style: normal;
			cursor: pointer;
			&:hover {
				color: darken(#d9534f, 10%);
			}
		}
		&.readonly {
			.xf-item-remove {
				display: none;
			}
		}
	}
	.xf-tip {
		display: inline-block;
		vertical-align: top;
		font-size: 12px;
	}
}
</style>