<template>
	<div>
		<div style="margin-bottom:20px;">
			<el-button type="primary" @click="search">搜索</el-button>
			<el-button type="warning" @click="clear">清空</el-button>
			<el-button type="info" @click="setData">设置静态数据</el-button>
			<el-button type="info" @click="changeMode">切换模式</el-button>
			<el-button type="info" @click="scrollToTop">回到顶部</el-button>
			<el-button type="info" @click="setMode('WATERFALL')">切换瀑布流模式</el-button>
			<el-button type="info" @click="setMode('TABLE')">切换分页模式</el-button>
		</div>
		<np-waterfall ref="waterfall" style="max-height:700px" :options="options">
			<wf-piece slot-scope="props" :item="props.item" :visible="props.visible" :index="props.index"></wf-piece>
			<div style="background:red;height:300px;" slot="header"></div>
		</np-waterfall>
	</div>
</template>

<script>
import wfPiece from "./piece";

var demoData = [];

for (var i = 0; i < 1000; i++) {
	demoData.push({ text: i + 1 });
}
var index = 1;

export default {
	components: {
		wfPiece
	},
	methods: {
		changeMode() {
			this.$refs.waterfall.changeMode(++index % 2 == 0 ? "TABLE" : "WATERFALL");
		},
		scrollToTop() {
			this.$refs.waterfall.scrollToTop();
		},
		search() {
			this.$refs.waterfall.search({
				keyword: "一个搜索条件"
			});
		},
		clear() {
			this.$refs.waterfall.clear();
		},
		setData() {
			var items = [];
			for (var i = 0; i < 200; i++) {
				items.push({ release: false, text: 0 });
			}
			this.$refs.waterfall.setData({
				list: items,
				total: 500
			});
		},
		setMode(mode) {
			this.options.mode = mode;
		}
	},
	data() {
		return {
			options: {
				windowMargin: -100,
				preloadHeight: 100,
				pageMode: true,
				mode:"TABLE",
				release: {
					container: {
						width() {
							return 1602 - 60;
						},
						height() {
							return 700;
						}
					},
					piece: {
						width() {
							return 132;
						},
						height() {
							return 132;
						}
					}
				},
				debug: true,
				lazy: true,
				chaos: false,
				height() {
					return 100;
				},
				scrollOptions: {
					wrapStyle: "max-height:700px;",
					innerStyle: "padding:30px;"
				},
				format: {
					list: "list",
					count: "total"
				},
				isUseloading:true,
				datasource(filter, list) {
					console.log("------  请求");
					return new Promise(resolve => {
						setTimeout(() => {
							resolve({
								list: demoData.slice(list.length, list.length + 100),
								total: demoData.length
							});
						}, 300);
					});
				},
				datapageOptions: {
					pageSize: 20,
					preload: 2
				}
			}
		};
	}
};
</script>
<style>
.ttttttttt {
	max-height: 700px;
}
</style>

