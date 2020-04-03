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
                    title: "插槽标识",
                    key: "name"
                },
                {
                    title: "描述",
                    key: "desc"
                }
            ]
        };
    },
    computed: {
        rowData() {
            var root = this.options;
            var rows = [];

            Object.keys(root).forEach(name => {
                rows.push({
                    name: name,
                    desc: root[name]
                });
            });

            return rows;
        }
    }
};
</script>
