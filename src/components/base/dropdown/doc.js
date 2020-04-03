import demo1 from './demo/demo1.vue';

module.exports = {
    title : '下拉菜单',
    props : {
        options : {
            type : '类型',
            placeholder : '输入提示',
            clearable : '是否可清空'
        }
    },
    methods : {
        clear : {
            desc : '清空',
            args : '无',
            result : '无'
        }
    },
    events : {
        refresh : {
            desc : '刷新',
            args : '无'
        }
    },
    demos : [demo1]
};