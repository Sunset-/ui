<template>
	<div class="demo-container">
		<div class="filter-params">
			<div>
				<b>请求服务器参数:</b>
			</div>
			<div ref="params"></div>
		</div>
		<div>
			后端分页尺寸：
			<np-slider v-model="pageSize" :options="{min:5,step:5,max:100}" />&nbsp; 前端分页尺寸：
			<np-slider v-model="localPageSize" :options="{min:5,step:5,max:100}" />&nbsp; 预加载提前页数：
			<np-slider v-model="preload" :options="{min:0,step:1,max:3}" />&nbsp; 缓存数据：
			<np-switch v-model="cache" />&nbsp;
		</div>
		<div>
			<np-button color="primary" @click="search" label="搜索" />&nbsp;
			<np-button color="success" @click="refresh" label="刷新" />&nbsp;
			<np-button color="warning" @click="setStaticData" label="设置静态数据" />&nbsp;
			<np-button color="danger" @click="clear" label="清空" />
			<np-button color="danger" @click="test" label="test" />
		</div>
		<np-datapage ref="datapage" :options="options" @output="outputHandle">
			<template slot-scope="props">
				<div v-for="(item,index) in props.list" :key="index" class="custom-item">
					{{index+1}} : {{item.name}} -- {{item.progress}}
				</div>
			</template>
			<div slot="empty" style="padding:30px 0px;text-align:center;">
				无数据
			</div>
		</np-datapage>
	</div>
</template>

<script>

var totalCount = 16;

var demoData = [];
for (var i = 0; i < 31; i++) {
	demoData.push({
		id: i,
		name: `record-${i}`,
		progress: 0
	});
}

export default {
	methods: {
		search() {
			this.$refs.datapage.search({
				keyword: "一个搜索条件"
			});
		},
		refresh() {
			this.$refs.datapage.refresh();
		},
		test(){
			totalCount--;
			this.$refs.datapage.refresh();
			// this.$refs.datapage.setCount(20000)
		},

		setStaticData() {
			var items = [];
			for (var i = 0; i < 200; i++) {
				items.push({ name: i + 1 });
			}
			this.$refs.datapage.setData({
				data: items,
				totalCount: 500
			});
		},
		clear() {
			this.$refs.datapage.clear();
		},
		outputHandle(list, total) {
		},
		setTableOptions(options) {
			this.$refs.datapage.setOptions(options, true);
		}
	},
	data() {
		return {
			pageSize: 20,
			localPageSize: 5,
			preload: 0,
			cache: false,
			options: {
				pageNumberStart: 1,
				pageSize: 100,
				localPageSize: 5,
				cache: false,
				cumulate: false,
				preload: 0,
				pagerOptions: {
					manner: "simple",
					foldCount: 5,
					// sizer : [5,10,20]
					layout: "prev,next",
				},
				format: {
					list: "data",
					count: "totalCount",
					pageSize: "pageSize",
					currentPage: "pageNumber"
				},
				// polling: 1000,
				// [
				// 	list => {
				// 		//返回一个同步或异步的数据，返回false时结束轮询
				// 		return new Promise(resolve => {
				// 			setTimeout(() => {
				// 				list &&
				// 					list.forEach(item => {
				// 						item.progress = item.progress + 1;
				// 					});
				// 				if (list[0].progress == 10) {
				// 					resolve(false); //结束轮询
				// 				} else {
				// 					resolve();
				// 				}
				// 			}, 1000); //模拟异步请求
				// 		});
				// 	},
				// 	1000 //轮询间隔
				// ],
				datasource: filter => {
					console.log("请求：" + JSON.stringify(filter));
					return new Promise(resolve => {
						setTimeout(() => {
						var demoData = [];
						for (var i = 0; i < totalCount; i++) {
							demoData.push({
								id: i,
								name: `record-${i}`,
								progress: 0
							});
						}
					resolve({
								totalCount: demoData.length,
								data: demoData
							});

							// resolve({
							// 	totalCount: demoData.length,
							// 	data: demoData.slice(
							// 		filter.pageSize * (filter.pageNumber - 1),
							// 		filter.pageSize * (filter.pageNumber - 1) + filter.pageSize
							// 	)
							// });
						}, 500);
					});
				}
			}
		};
	},
	watch: {
		pageSize(v) {
			var options = this.options;
			options.pageSize = v;
			this.setTableOptions(options);
		},
		localPageSize(v) {
			var options = this.options;
			options.localPageSize = v;
			this.setTableOptions(options);
		},
		preload(v) {
			var options = this.options;
			options.preload = v;
			this.setTableOptions(options);
		},
		cache(v) {
			var options = this.options;
			options.cache = v;
			this.setTableOptions(options);
		}
	}
};
</script>
