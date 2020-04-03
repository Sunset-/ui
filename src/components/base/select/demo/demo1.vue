<template>
    <div>
        <np-select style="width:400px;" v-model="v" :options="options"></np-select>
        <np-select v-model="v2" :options="multipleOptions"></np-select>
        <input type="text" v-model="v">
        {{v}}
        {{v2}}
        <div style="height:300px;">

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            v: "",
            v2: "",
            options: {
                multiple: false,
                clearable: false,
                disabled: false,
                filter: true,
                placeholder: "请选择一个性别",
                disabledOptions(item) {
                    return item.value == "3"
                },
                format(item) {
                    return item.value + "-" + item.text
                },
                // enum : 'SEX'
                data: [
                    {
                        text: "全部",
                        value: ""
                    },
                    {
                        text: "有效套牌",
                        value: 1
                    },
                    {
                        text: "无效套牌",
                        value: 0
                    },
                    {
                        text: "未处理",
                        value: 2
                    },
                    {
                        text: "全部",
                        value: "3"
                    },
                    {
                        text: "有效套牌",
                        value: 4
                    },
                    {
                        text: "无效套牌",
                        value: 5
                    },
                    {
                        text: "未处理",
                        value: 6
                    }
                ]
            },
            multipleOptions: {
                clearable: true,
                filter: false,
                placeholder: "请选择一个城市",
                data: [
                    {
                        text: "北京",
                        value: "beijing"
                    },
                    {
                        text: "上海",
                        value: "shanghai"
                    },
                    {
                        text: "深圳",
                        value: "shenzhen"
                    },
                    {
                        text: "广州",
                        value: "guangzhou"
                    }
                ]
            }
        }
    }
}
</script>
