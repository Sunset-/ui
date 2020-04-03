<template>
    <div>
        <np-form ref="form" :options="options" @submit="save"></np-form>
    </div>
</template>
<script>

export default {
    methods : {
        reset(data){
            this.$refs.form.reset(data);
        },
        save(data){
            this.$emit('save',data);
        }
    },
    data(){
        return {
            options : {
                cols : 3,
                labelStyle : 'min-width:120px;',
                fields : [{
                    label : '接口超时时间',
                    name : 'skillsAnimateTimer',
                    newline : true,
                    widget : 'input'
                },{
                    label : '开启目标排除',
                    name : 'isShowSkillsStatistics',
                    newline : true,
                    widget : 'switch'
                }]
            }
        }
    }
}
</script>
