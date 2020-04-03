<style lang="scss">
.test-class {
    display: inline-block;
    width: 100px;
    height: 100px;
    background: yellowgreen;
    &:hover {
        background: red;
    }
}
</style>

<template>
    <div>
        <np-file ref="uploader" :options="options" :ctx="{name : 'sunset'}" @queue="queue" @start-upload="startUpload" @single-success="sss">
            <div class="test-class"></div>
        </np-file>
        <np-button @click="upload">上传</np-button>
        <np-button @click="cancel">取消</np-button>
        <div v-for="(f,index) in list" :key="index" style="padding:5px;border:1px solid #ccc;margin-bottom:10px;">
            <img width="100" :src="f.thumbnail" /> {{f.name}}
            <i style="font-size:20px;" class="xui-icon xui-icon-delete" @click="remove(f)"></i>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        startUpload(){
            console.log("start-upload")
        },
        sss(e) {
            this.$refs.uploader.clear()
        },
        upload() {
            this.$refs.uploader.upload();
        },
        cancel(){
            this.$refs.uploader.cancel();
        },
        queue(list) {
            this.list = list;
        },
        remove(f) {
            this.$refs.uploader.removeFile(f);
        },
        progress() {},
        errorHandle(v) {
        },
        success() {}
    },
    data() {
        return {
            list: [],
            v: "",
            options: {
                label: "文件选择",
                icon: "xui-icon xui-icon-share",
                multiple: true,
                directory: false,
                disabled: false,
                color: "success",
                method: "post",
                filename: "file",
                thumbnail: true,
                wait: false,
                max: 10,
                drop:true,
                url: "/gateway/api/proxy/image/upload",
                className: "my-uploader-trigger",
                filter(f) {
                    return f.name != "Chrysanthemum.jpg";
                },
                headers : {
                    aaa : 333
                },
                formData: record => {
                    return {
                        taskToken: "token",
                        xiaoname: record.name
                    };
                },
                progress(v) {
                    console.log(v);
                }
            }
        };
    }
};
</script>
