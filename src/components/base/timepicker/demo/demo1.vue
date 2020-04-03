<template>
    <div class="time-picker">
        {{time}}
        <np-timepicker :options ="options" v-model="time"></np-timepicker>
    </div>
</template>
<script>
export default {
    data() {
        return  {
            time:["10:30",""],
            options:{
                startplaceholder:"起始时间",
                endplaceholder:"结束时间",
                start: '08:30',
                step: '00:60',
                end: '18:30',
                ischeckbox:true
            }
        }
    },
    methods:{

    }
}    
</script>
<style lang="less">

</style>
