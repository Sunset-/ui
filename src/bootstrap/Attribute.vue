<style lang="scss">
	.attribute-value {
		color: #09c;
		i.vt {
			display: block;
			color: darken(orange, 5%);
		}
		i.vtl {
			display: inline-block;
			padding-right: 5px;
			color: darken(orange, 5%);
		}
	}
</style>

<template>
	<div class="attribute-value">
		<el-table style="font-size:16px;" :data="rowData.rows" :cell-class-name="cellClassName">
			<el-table-column v-for="(col,index) in rowData.columns" :key="index" :prop="col.key" :label="'#'">
				<span slot-scope="scope" v-html="scope.row[col.key]"></span>
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
				cellClassName: obj => {
					return obj.row.lastCol == obj.columnIndex ? "attribute-value" : "";
				}
			};
		},
		computed: {
			rowData() {
				var root = this.options;
				var rows = [];
				var columns = [];

				function depress(parent, prefixs) {
					Object.keys(parent).forEach(key => {
						if (typeof parent[key] == "object") {
							depress(parent[key], prefixs.concat([key]));
						} else {
							rows.push(prefixs.concat([key, parent[key]]));
						}
					});
				}
				depress(root, []);

				var last = {};
				var max = 0;
				rows = rows.map(item => {
					var o = {};
					max = Math.max(max, item.length);
					item.forEach((v, index) => {
						if (last[index] && last[index] == v) {
							v = "";
						} else if (last[index] != v) {
							last[index] = v;
						}
						o["col_" + index] = v;
						o.lastCol = item.length - 1;
					});
					return o;
				});
				for (var i = 0; i < max; i++) {
					columns.push({
						type: "html",
						key: "col_" + i
					});
				}
				return {
					rows: rows,
					columns: columns
				};
			}
		}
	};
</script>