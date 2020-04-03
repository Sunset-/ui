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
                    label : '结构化定时器',
                    name : 'structutionTimer',
                    widget : 'input'
                },{
                    label : '技战法定时器',
                    name : 'skillsTimer',
                    newline : true,
                    widget : 'input'
                },{
                    label : '动画定时器',
                    name : 'skillsAnimateTimer',
                    newline : true,
                    widget : 'input'
                },{
                    label : '显示技战法统计',
                    name : 'isShowSkillsStatistics',
                    newline : true,
                    widget : 'switch'
                }]
            }
        }
    }
}
</script>
