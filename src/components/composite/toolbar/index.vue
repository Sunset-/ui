<style lang="scss">
@import "~src/style/variable.scss";

.xui-toolbar {
	display: inline-block;
	vertical-align: middle;
	.xui-toolbar-item {
		display: inline-block;
		vertical-align: middle;
		padding-right: 5px;
		font-size: 0px;
		&:last-child {
			padding-right: 0px;
		}
		.xui-toolbar-icon {
			font-size: 20px;
			margin: 0px 5px;
			cursor: pointer;
			&.disabled {
				color: $color-disabled;
				cursor: not-allowed;
			}
		}
		.el-button {
			text-decoration: none;
		}
		&.xui-tool-hidden {
			visibility: hidden;
		}
		.xui-toolbar-widget {
			font-size: 12px;
		}
	}
}
</style>
<template>
	<div :class="['xui-toolbar xui-toolbar-style',options.className]" :style="options.style">
		<template v-for="tool in showTools">
			<div v-permission="tool.permission" :class="['xui-toolbar-item',visible(tool)?'':'xui-tool-hidden']" :style="tool.itemStyle">
				<!-- 按钮 -->
				<template v-if="!tool.type&&!tool.widget">
					<i v-if="!tool.label&&tool.icon" :title="computedTitle(tool.title)" :class="['xui-toolbar-icon',computedIcon(tool.icon),checkDisabled(tool)?'disabled':'']" @click.stop="operate(tool)" :style="tool.style"></i>
					<toolbar-button v-if="tool.label" :disabled="checkDisabled(tool)" :size="size" :options="tool" :style="tool.style" @click="operate(tool)"></toolbar-button>
				</template>
				<!-- 下载 -->
				<template v-else-if="tool.type=='download'">
					<toolbar-button :disabled="checkDisabled(tool)" :size="size" :options="tool" :style="tool.style" :link="true" :href="!checkDisabled(tool)&&downloadData(tool)" :download="downloadName(tool)"></toolbar-button>
				</template>
				<!-- 文件 -->
				<template v-else-if="tool.type=='file'">
					<toolbar-file :disabled="checkDisabled(tool)" :options="tool" :size="size" :ctx="ctx" @click.native.stop="emptyHandle"></toolbar-file>
				</template>
				<!-- 开关 -->
				<template v-else-if="tool.type=='switch'">
					<toolbar-switch :disabled="checkDisabled(tool)" :options="tool" :ctx="ctx" :size="size" @click.native.stop="emptyHandle" @change="switchOperate"></toolbar-switch>
				</template>
				<!-- 其他表单组件 -->
				<template v-else-if="tool.widget">
					<toolbar-widget :options="tool" :ctx="ctx"></toolbar-widget>
				</template>
				<!-- 下拉菜单 -->
				<template v-else-if="tool.type=='dropdown'">
					<toolbar-dropdown :disabled="checkDisabled(tool)" :size="size" :options="tool" :ctx="ctx"></toolbar-dropdown>
				</template>
				<!-- 普通文本 -->
				<template v-else-if="tool.type=='text'">
					<span :style="tool.style" :class="tool.className" v-html="getText(tool)"></span>
				</template>
			</div>
		</template>
	</div>
</template>
<script>
import Sunset from "../../../common/sunset";
import Helper from "../../Helper.js";
import ToolbarFile from "../../base/file";
import ToolbarButton from "../../base/button";
import ToolbarSwitch from "../../base/switch";
import ToolbarDropdown from "../../base/dropdown";
import ToolbarWidget from "./widget";

export default {
	components: {
		ToolbarFile,
		ToolbarButton,
		ToolbarSwitch,
		ToolbarDropdown,
		ToolbarWidget
	},
	props: {
		options: {},
		ctx: {},
		index: {}
	},
	computed: {
		showTools() {
			var tools = Sunset.isArray(this.options) ? this.options : this.options && this.options.tools;
			return (
				tools &&
				tools.filter(item => {
					if (item.premise && Sunset.isFunction(item.premise)) {
						return item.premise(this.ctx);
					} else {
						return true;
					}
				})
			);
		},
		size() {
			return this.options.size;
		}
	},
	methods: {
		emptyHandle() {
		},
		computedTitle(title) {
			return Sunset.isFunction(title) ? title(this.ctx) : title;
		},
		computedIcon(icon) {
			return Sunset.isFunction(icon) ? icon(this.ctx) : icon;
		},
		checkDisabled(tool) {
			var disabledValue = false;
			if (tool.disabled === true) {
				disabledValue = true;
			} else if (Sunset.isFunction(tool.disabled)) {
				disabledValue = !!tool.disabled(this.ctx);
			} else {
				disabledValue = false;
			}
			return disabledValue;
		},
		operate(tool) {
			if (this.checkDisabled(tool)) {
				return true;
			}
			Helper.operate.call(this, tool, this.ctx, this.index, null, this.options);
		},
		switchOperate(v, tool, reset) {
			Promise.resolve(Helper.operate.call(this, tool, this.ctx, v, this.index, this.options)).catch(e => {
				reset && reset(!v);
			});
		},
		visible(tool) {
			return Sunset.isFunction(tool.visible) ? tool.visible(this.ctx, this.index) : tool.visible !== false;
		},
		downloadName(tool) {
			return Sunset.isFunction(tool.name) ? tool.name(this.ctx) : tool.name || "未命名";
		},
		downloadData(tool) {
			return Sunset.isFunction(tool.data) ? tool.data(this.ctx) : tool.data || "未命名";
		},
		widgetOperate(v) {
			Helper.operate.call(this, tool, this.ctx, v, this.index, this.options);
		},
		getText(tool) {
			if (Sunset.isFunction(tool.text)) {
				return tool.text(this.ctx);
			} else {
				return tool.text;
			}
		}
	}
};
</script>