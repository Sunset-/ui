<style>
.test-box p {
    width: 700px;
}
</style>

<template>
    <div style="position:relative;height:400px;background:#dedede;border:1px solid #DEDEDE;">
        <np-button @click="setData">设置数据</np-button>
        <np-button @click="clear">清空</np-button>
        <np-virtualized ref="viewport" style="background:#FFF;" :options="viewportOptions" :data="ddd">
            <template slot-scope="{item}">
                <div style="border:1px solid red;height:33px;">
                    {{item.name}}
                    <button type="button" class="remove" @click="removeItem(item)">删除</button>
                </div>
            </template>
        </np-virtualized>
    </div>
</template>
<script>
var demoData = [];

for (var i = 0; i < 10000; i++) {
    demoData.push({
        name: "name-" + i,
        id: i
    });
}

export default {
    data() {
        return {
            flag: true,
            ddd: [],
            viewportOptions: {
                containerHeight() {
                    return 350;
                },
                recordHeight: 35,
                records: []
            }
        };
    },
    methods: {
        setData() {
            // this.$refs.viewport.setData(demoData);
            this.ddd = demoData;
            //this.viewportOptions.records = demoData
        },
        clear() {
            // this.$refs.viewport.clear();
            this.ddd = [];
            // this.viewportOptions.records = []
        },
        removeItem(item) {
            if (item) {
                this.viewportOptions.records.forEach((_item, index) => {
                    if (_item.id == item.id) {
                        this.viewportOptions.records.splice(index, 1);
                    }
                });
            }
        }
    },
    mounted() {}
};
</script>