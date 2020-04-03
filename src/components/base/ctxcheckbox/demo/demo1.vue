<template>
    <div>
        <div>
            <np-toolbar :options="toolbarOptions"></np-toolbar>
        </div>
        <np-ctxcheckbox v-model="v" @change="handleChange" theme="dark"></np-ctxcheckbox>
        <span>全选</span>
        <div>是否选中：{{v?"是":"否"}}</div>
    </div>
</template>
<script>
import ctxcheckbox from "../index"
export default {
    components:{
        ctxcheckbox
    },
    data() {
        return {
            v:false,
            toolbarOptions:{
                tools: [
					{
                        label:"切换状态",
                        operate:()=>{
                            this.v = !this.v
                        }
                    }
				]
            }
        }
    },
    methods:{
        handleChange(item) {
            // alert("changed:"+(this.v?"是":"否"))
        }
    }
}
</script>

