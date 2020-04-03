# 进度条

## 插槽

| 插槽名  | 插槽作用域属性    | 描述       |
| :-----: | :---------------- | :--------- |
| default | progress:当前进度 | 进度条内容 |

## 属性

| 属性名          |        类型         | 默认值 | 描述                                                                                                                                       |
| :-------------- | :-----------------: | :----: | :----------------------------------------------------------------------------------------------------------------------------------------- |
| manner          |      `String`       |   无   | 风格（line,circle）默认 line                                                                                                               |
| value           |      `Number`       |   无   | 当前进度值                                                                                                                                 |
| total           |      `Number`       |   无   | 总进度值默认 100                                                                                                                           |
| animate         |      `Boolean`      |   无   | 是否开启动画，默认开启                                                                                                                     |  |
| stripe          |      `Boolean`      |   无   | 动态条纹                                                                                                                                   |
| color           | `String / Function` |   无   | 进度条颜色,支持<br>语义值:primary,success,danger,warning<br>颜色值:#09c,red...<br>函数:Function(progressValue),progressValue 为 0-1 的小数 |
| radius          |      `Number`       |   无   | 【圆环】圆环半径                                                                                                                           |
| lineWidth       |      `Number`       |   无   | 【圆环】圆环宽度                                                                                                                           |
| backgroundColor |      `String`       |   无   | 【圆环】圆环背景色                                                                                                                         |
| start           |      `String`       |   无   | 【圆环】圆环进度开始位置:top,left,right,bottom                                                                                             |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<style>
.xui-progress-line,.xui-progress-circle{
    display:inline-block;
    vertical-align:middle;
    margin-left:20px;
}
</style>
<template>
  <div class="demo-container">
		<xui-button color="primary" @click="start">开始</xui-button>
        <!-- 条形进度 -->
		<xui-progress :value="v" :options="options" style="width:200px;height:13px;border:1px solid #999;" />
		</xui-progress>
        <!-- 环形进度 -->
		<xui-progress :value="v" manner="circle" start="bottom" :radius="50" :line-width="5" :color="options.color" background-color="#dbdbdb">
			<template scope="prop">
				<div style="position:absolute;top:40%;left:50%;margin-left:-25px;width:50px;text-align:center;">
					{{prop.progress}}
				</div>
			</template>
		</xui-progress>
  </div>
</template>

<script>
export default {
	methods: {
		start() {
            var self = this;
            clearTimeout(this.timer);
            this.options.animate = false;
			this.$nextTick(() => {
				this.v = 0;
				this.timer = setTimeout(() => {
					this.options.animate = true;
					function add() {
						self.v++;
						if (self.v >= 100) {
						} else {
							self.timer = setTimeout(add, 100);
						}
					}
					add();
				}, 500);
			});
		},
		change(v) {}
	},
	data() {
		return {
            v: 0,
            timer : null,
			options: {
				animate: true,
				total: 100,
				color(v) {
					if (v < 0.5) {
						return "danger";
					} else if (v < 1) {
						return "warning";
					} else if (v >= 1) {
						return "success";
					}
				}
			}
		};
	},
	mounted() {
		this.start();
	}
};
</script>
</script>
