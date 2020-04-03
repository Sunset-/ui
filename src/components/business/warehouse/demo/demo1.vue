<style lang="scss">
.warehouse-filter {
	.sunset-filter-field {
		margin-bottom: 10px;
		.sunset-field-label {
			width: 100px;
		}
	}
}
</style>

<template>
	<div>
		<div style="padding:20px 0px;">
			<el-button size="mini" type="primary" @click="login">登录</el-button>
			<el-button size="mini" type="warning" @click="test">测试</el-button>
			<p>
				当前搜索条件：{{JSON.stringify(filterObject)}}
			</p>
		</div>
		<!-- 搜索条件 -->
		<np-filter ref="filter" class="warehouse-filter" :options="filterOptions" @filter="filterData"></np-filter>
		<div style="background:orange;color:#FFF;text-align:center;padding:10px;" @click="showMore=!showMore">{{showMore?'收起搜索条件':'展开更多搜索条件'}}</div>
		<!-- 数据分页 -->
		<np-datapage ref="datapage" class="warehouse-datapage" :options="datapageOptions">
			<template slot-scope="aprops">
				<!-- 条目组件 -->
				<warehouse-item v-for="(item,index) in aprops.list" :key="index" :item="item" :visible="true"></warehouse-item>
			</template>
		</np-datapage>
		<!-- 瀑布流 -->
		<np-waterfall ref="waterfall" style="border:1px solid #eee;height:500px;overflow-y:auto;" :options="waterfallOptions">
			<!-- 条目组件 -->
			<warehouse-item slot-scope="bprops" :key="bprops.index" :item="bprops.item" :visible="bprops.visible" :index="bprops.index"></warehouse-item>
		</np-waterfall>
	</div>
</template>

<script>
import WarehouseItem from "./item";

export default {
	components: {
		WarehouseItem
	},
	data() {
		return {
			showMore: false,
			filterObject: {},
			filterOptions: {
				fields: [
					{
						name: "type",
						widget: "tabs",
						monopolize: true,
						changeFilter: true,
						defaultFirst: true,
						enum: "STRUCTURATION_TYPE"
					},
					{
						label: "时间范围",
						name: "date",
						widget: "daterange",
						monopolize: true,
						changeFilter: true,
						defaultInit: "24小时",
						shortcuts: [
							{
								label: "24小时",
								value() {
									var start = new Date();
									start.setHours(0);
									start.setMinutes(0);
									start.setSeconds(0);
									start.setUTCMilliseconds(0);
									return [start, new Date(start.getTime() + 86399999)];
								}
							},
							{
								label: "近7天",
								value() {
									var now = new Date();
									var start = new Date();
									start.setDate(start.getDate() - 6);
									start.setHours(0);
									start.setMinutes(0);
									start.setSeconds(0);
									start.setUTCMilliseconds(0);
									return [new Date(start), now];
								}
							},
							{
								label: "近30天",
								value() {
									var now = new Date();
									var start = new Date();
									start.setDate(start.getDate() - 30);
									start.setHours(0);
									start.setMinutes(0);
									start.setSeconds(0);
									start.setUTCMilliseconds(0);
									return [new Date(start), now];
								}
							}
						]
					},
					{
						label: "更多选项",
						name: "gender",
						widget: "select",
						enum: "SEX",
						visible: () => {
							return this.showMore;
						},
						premise: filter => {
							return filter.type == "FACE";
						},
						changeFilter: true
					},
					{
						name: "eyeGlass",
						widget: "select",
						enum: "HAVE_GLASS",
						visible: () => {
							return this.showMore;
						},
						premise: filter => {
							return filter.type == "FACE";
						},
						changeFilter: true
					},
					{
						label: "年龄",
						name: "age",
						widget: "slider",
						min: 1,
						max: 150,
						range: true,
						visible: () => {
							return this.showMore;
						},
						premise: filter => {
							return filter.type == "FACE";
						},
						changeFilter: true
					},
					{
						label: "号牌类型",
						name: "plateTypes",
						widget: "checkbox",
						data: [
							{
								text: "大型汽车号牌",
								value: "1"
							},
							{
								text: "小型汽车号牌",
								value: "2"
							},
							{
								text: "使馆汽车号牌",
								value: "3"
							},
							{
								text: "警用车牌",
								value: "23"
							}
						],
						premise(filter) {
							return filter.type == "VEHICLE";
						},
						changeFilter: true
					}
				],
				format(filter) {
					filter.startTime = filter.date[0].getTime();
					filter.endTime = filter.date[1].getTime();
					delete filter.date;
					if (filter.gender == "ALL") {
						delete filter.gender;
					}
					if (filter.plateTypes) {
						filter.plateTypes = filter.plateTypes.split(",");
					} else {
						delete filter.plateTypes;
					}
					if (filter.age) {
						var age = filter.age.split(",");
						filter.minAge = age[0];
						filter.maxAge = age[1];
					}
					delete filter.age;
					return filter;
				}
			},
			datapageOptions: {
				pageNumberStart: 1,
				localPageSize: 20,
				pageSize: 200,
				preload: 2,
				lazy: true,
				cache: true,
				format: {
					list: "list",
					count: "total",
					pageSize: "pageSize",
					currentPage: "currentPage"
				},
				datasource: filter => {
					return this.loadData(filter);
				}
			},
			waterfallOptions: {
				windowMargin: 800,
				preloadHeight: 500,
				debug: true,
				release: true,
				lazy: true,
				format: {
					list: "list",
					count: "total",
					pageSize: "pageSize",
					currentPage: "currentPage"
				},
				datasource: filter => {
					filter.pageSize = 200;
					if (!filter.currentPage) {
						filter.currentPage = 1;
					} else {
						filter.currentPage++;
					}
					return this.loadData(filter);
				}
			}
		};
	},
	methods: {
		test() {
			this.$refs.datapage.setOptions({
				localPageSize: 30
			});
		},
		loadData(filter) {
			var urls = {
				ALL: "/gateway/warehouse/aggregator_service/ftr/all?1.0",
				FACE: "/gateway/warehouse/face_service/face/list?1.0",
				VEHICLE: "/gateway/warehouse/vehicle_service/vehicle/search?1.0"
			};
			if (filter.type == "VEHICLE") {
				return Promise.all([
					$.ajax({
						url: urls[filter.type],
						contentType: "application/json; charset=utf-8",
						type: "POST",
						data: JSON.stringify(filter)
					}),
					$.ajax({
						url: "/gateway/warehouse/vehicle_service/vehicle/count?1.0",
						contentType: "application/json; charset=utf-8",
						type: "POST",
						data: JSON.stringify(filter)
					})
				]).then(res => {
					return {
						list: res[0].data,
						total: res[1].data
					};
				});
			} else {
				return $.ajax({
					url: urls[filter.type],
					contentType: "application/json; charset=utf-8",
					type: "POST",
					data: JSON.stringify(filter)
				}).then(res => {
					return res.data;
				});
			}
		},
		login() {
			$.ajax({
				url: "/gateway/login?1.0",
				type: "POST",
				data: {
					visitHost: "192.168.60.205",
					cip: "192.168.61.43",
					cmac: "B0-83-FE-93-87-D6",
					username: "admin",
					password: "e10adc3949ba59abbe56e057f20f883e"
				}
			}).then(res => {
				alert("登陆成功");
			});
		},
		filterData(filter) {
			this.filterObject = filter;
			alert(123)
			// this.$refs.datapage.search(filter);
			this.$refs.waterfall.search(filter);
		}
	}
};
</script>
