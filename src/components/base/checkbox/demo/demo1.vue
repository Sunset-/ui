<template>
    <div>
        <np-checkbox v-model="v" :options="options" @change="change" theme="dark"></np-checkbox>
        <np-checkbox v-model="v1" :options="options" @change="change"></np-checkbox>
        <np-button @click="a" size="normal" color="success" icon="el-icon-info" label="改变v-model的值"></np-button>
        {{v}}
    </div>
</template>
<script>
export default {
    methods: {
        change(v) {
            console.log(v);
        },
        a() {
            this.v = "0";
            this.v1 = "1";
        }
    },
    data() {
        return {
            v: null,
            v1: "",
            options: {
                multiple: false,
                clearable: true,
                disabled: false,
                max: 2,
                size: "normal",
                valuePlace: "key",
                textPlace: "value",
                bit: true,
                // enum: "SEX",
                data: [
                    {
                        key: "1",
                        value: "AAA"
                    },
                    {
                        key: "2",
                        value: "BBB"
                    },
                    ,
                    {
                        key: "4",
                        value: "cccc"
                    },
                    {
                        key: "8",
                        value: "dddd"
                    }
                ],
                errorHandle(v) {
                    // alert(v)
                }
            }
        };
    }
};
</script>
