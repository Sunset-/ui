
<template>
	<div class="np-info-table-container">
		<div class="table-item" v-for="(item, index) in options.items" :key="index"
			:style="{
				'width': index===options.items.length-1 ? (options.cols - (options.items.length % options.cols) + 1)*widthPercent + '%' : widthPercent + '%',
				'height': options.colHeight + 'px',
				'line-height': options.colHeight + 'px'
			}">
			<div class="info-label" :style="{
				'width': options.labelWidth + 'px',
				'background-color': options.labelBgClolor,
				'text-align': options.labelAlign
			}">
				{{ item.label }}
			</div>
			<div class="info-content" :style="{ 
				'background-color': options.contentBgClolor,
				'text-align': options.contentAlign,
                'height': options.colHeight + 'px'
			}" v-html="renderCell(data, item.name, item.enum, item.format)">
			</div>
		</div>
	</div>
</template>
<script>

import Dictionary from "../../../services/Dictionary";
import Sunset from "../../../common/sunset";
export default {
	components: {
		
	},
	props: { 
		data: { type: Object, default: function() { return {} } },
		options: { type: Object, default: function() { return {
			items: [],
			cols: 1,
			colHeight: 38,
			labelWidth: 100,
			labelAlign: "left",
			contentAlign: "left",
			labelBgClolor: "#eee",
			contentBgClolor: "#fff"
		} } }
	},
	data() {
		return { 
		};
	},
	created: function() {
		
	},
	computed: {
		widthPercent: function() {
			return 100 / this.options.cols;
		}
	},
	methods: { 
		// renderCell(item, col,parent) {
		renderCell(data, item, enumC, format) {
			var html = null;
			var value = Sunset.getAttribute(data, item, "");
			if (format) {
				if (Sunset.isFunction(format)) {
					return format(value, item);
				} 
			} else if (enumC) {
				html = Dictionary.transcode(enumC, value);
			} else {
				html = value;
			}
			return html;
		},
	},
	filters: {
		transferName: function(value, enumconfig, format) {
			var html = value;
			if(enumconfig) {
				html = Dictionary.transcode(enumconfig, value);
			}
			if(format) {
				html = format(value);
			}
			return html ? html : "--";
		}
	}
};
</script>
<style lang="less">
.np-info-table-container {
	position: relative;
	font-size: 0;
	width: 100%;
	height: 100%;
	font-family: "微软雅黑";
	border-right: 1px solid #E5E5E5; border-bottom: 1px solid #E5E5E5;
	box-sizing: border-box;
	* { box-sizing: border-box; }
	.table-item { display: inline-block; border-left: 1px solid #E5E5E5; border-top: 1px solid #E5E5E5; }
	.info-label { float: left; padding-right: 5px; font-size: 12px; border-right: 1px solid #E5E5E5; }
	.info-content { overflow: hidden; padding-left: 10px; font-size: 12px; }
}
</style>