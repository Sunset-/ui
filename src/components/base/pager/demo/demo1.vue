<template>
    <div>
        <np-pager :options="options" :total="148" :page-number="1" @change="onChange"></np-pager>
        {{v}}
    </div>
</template>

<script>
export default {
    methods: {
        onChange(v) {
            console.log(v);
        }
    },
    data() {
        return {
            v: "",
            options: {
                // size: "mini",
                // foldCount: 5,
                // manner: "simple",
                // pageSize: 10,
                // small:true
                layout: "prev,first,last,next,total,sizer",
                sizer : [10,20,50,100,200,500],
                manner: "mini",
                pageSize: 10
            }
        };
    }
};
</script>
