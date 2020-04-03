<style>
.attribute-value {
	color: #09c;
}
</style>

<template>
	<div>
		<el-table :data="rowData">
			<el-table-column v-for="(col,index) in columns" :key="index" :prop="col.key" :label="col.title">
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	props: {
		options: {}
	},
	data() {
		return {
			columns: [
				{
					title: "方法名",
					key: "method"
				},
				{
					title: "描述",
					key: "desc"
				},
				{
					title: "参数",
					key: "args"
				},
				{
					title: "返回值",
					key: "result"
				}
			]
		};
	},
	computed: {
		rowData() {
			var root = this.options;
			var rows = [];
			var columns = [];
			Object.keys(root).forEach(method => {
				var obj = root[method];
				obj.method = method;
				rows.push(obj);
			});

			return rows;
		}
	}
};
</script>
