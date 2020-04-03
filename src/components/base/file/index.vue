<template>
    <div :class="['xui-file xui-file-style',safeOptions.className||'',disabled?'disabled':'']">
        <upload-component ref="uploader" :timeout="timeout" :name="filename" :headers="headers" :data="formData" :post-action="method=='post'?url:(void 0)" :put-action="method=='put'?url:(void 0)" :multiple="multiple" :directory="directory" :drop="drop" @input-filter="inputFilter" @input="updatetValue" @input-file="inputFile">
        </upload-component>
        <div class="xui-upload-trigger" @click="selectFiles">
            <slot>
                <upload-button :size="size" :disabled="disabled" :options="options">{{options.text||options.label}}</upload-button>
            </slot>
        </div>
    </div>
</template>
<script>
import Sunset from "../../../common/sunset";
// import uploadComponent from "vue-upload-component/src/index";
import uploadComponent from "./uploader/index";
import uploadButton from "../button";

export default {
    components: {
        uploadComponent: uploadComponent,
        uploadButton
    },
    props: {
        ctx: {},
        disabled: {},
        thumbnail: {},
        options: {},
        size: {},
        beforeAddFile: {}
    },
    data: function() {
        return {
            files: []
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        url() {
            return this.safeOptions.url;
        },
        filename() {
            return this.safeOptions.filename || "file";
        },
        method() {
            return (this.safeOptions.method || "post").toLowerCase();
        },
        multiple() {
            return this.safeOptions.multiple !== false;
        },
        directory() {
            return this.safeOptions.directory;
        },
        timeout() {
            return this.safeOptions.timeout;
        },
        drop() {
            return this.safeOptions.drop;
        },
        wait() {
            return this.safeOptions.wait;
        },
        customFilter() {
            return this.safeOptions.filter;
        },
        headers() {
            return Sunset.isFunction(this.safeOptions.headers)
                ? this.safeOptions.headers(this.ctx)
                : this.safeOptions.headers;
        },
        formData() {
            return Sunset.isFunction(this.safeOptions.formData)
                ? this.safeOptions.formData(this.ctx)
                : this.safeOptions.formData;
        },
        max() {
            return Sunset.isNumber(this.safeOptions.max) &&
                this.safeOptions.max > 0
                ? this.safeOptions.max
                : false;
        },
        cbeforeAddFile() {
            return this.beforeAddFile || this.safeOptions.beforeAddFile;
        },
        renderThumbnail() {
            return (
                this.thumbnail === true || this.safeOptions.thumbnail === true
            );
        }
    },
    methods: {
        //选择
        selectFiles() {
            if (this.disabled) {
                return;
            }
            this.$refs.uploader.$el.querySelector("input").click();
        },
        //上传
        upload() {
            var uploader = this.$refs.uploader;
            if (uploader && !uploader.active) {
                uploader.active = true;
                this.$emit("start-upload", this.ctx);
            }
        },
        //删除
        removeFile(f) {
            this.remove(f);
            if (f) {
                this.$emit("remove", f);
            }
        },
        remove(f) {
            this.$refs.uploader.remove(f);
        },
        //清空
        clear() {
            this.$refs.uploader.clear();
        },
        cancel() {
            var files = this.files;
            if (files) {
                for (var i = 0, f; (f = files[i++]); ) {
                    if (f.xhr) {
                        f.xhr.abort();
                    }
                }
            }
            this.$nextTick(() => {
                this.clear();
            });
        },
        //选择过滤
        inputFilter(newFile, oldFile, prevent) {
            if (newFile && !oldFile) {
                // 添加文件
                if (this.max && this.files.length >= this.max) {
                    return prevent();
                }
                if (
                    Sunset.isFunction(this.cbeforeAddFile) &&
                    this.cbeforeAddFile(this.files) === false
                ) {
                    return prevent();
                }
                if (this.renderThumbnail) {
                    // 创建 `blob` 字段 用于缩略图预览
                    newFile.blob = "";
                    let URL = window.URL || window.webkitURL;
                    if (URL && URL.createObjectURL) {
                        newFile.blob = newFile.thumbnail = URL.createObjectURL(
                            newFile.file
                        );
                    }
                }
                if (this.customFilter && !newFile.__xui__passFilter) {
                    Promise.resolve(this.customFilter(newFile)).then(flag => {
                        if (flag !== false) {
                            newFile.__xui__passFilter = true;
                            this.$refs.uploader.add(newFile);
                            //直接操作文件
                            if (Sunset.isFunction(this.safeOptions.operate)) {
                                this.options.operate(this.ctx, newFile.file);
                            }
                        }
                    });
                    return prevent();
                }
            } else if (newFile && oldFile) {
                //更新
            } else if (!newFile && oldFile) {
                // 移除文件
                // 拒绝删除文件
                // return prevent()
            }
        },
        inputFile(newFile, oldFile, prevent) {
            if (newFile && oldFile) {
                if (newFile.success && !newFile.__xui__success) {
                    newFile.__xui__success = true;
                    newFile.result = newFile.response;
                    this.$emit("single-success", newFile, this.ctx);
                } else if (newFile.error && !newFile.__xui__error) {
                    newFile.__xui__error = true;
                    this.$emit("single-error", newFile, this.ctx);
                }
                this._calculateFullProgress();
            }
        },
        updatetValue(files) {
            this.files = files;
            this.$emit("queue", files);
            if (!this.wait) {
                this.$nextTick(() => {
                    var fs = files;
                    for (var i = 0, f; (f = fs[i++]); ) {
                        if (!f.xhr) {
                            this.upload();
                            return;
                        }
                    }
                });
            }
        },
        //计算总进度
        _calculateFullProgress() {
            var queue = this.files;
            var finish = 0;
            var success = 0;
            var progress = 0;
            queue.forEach(item => {
                if (item.success) {
                    success++;
                    finish++;
                    progress += 100;
                } else if (item.error) {
                    finish++;
                    progress += 100;
                } else {
                    progress += Sunset.isNumber(+item.progress)
                        ? +item.progress
                        : 100;
                }
            });
            progress = (progress * 1.0) / queue.length;
            this.options.progress && this.options.progress(progress);
            this.$emit("progress", progress, this.ctx);
            if (success == queue.length) {
                this.$emit("success", this.ctx);
            }
            if (finish == queue.length) {
                this.$emit("finish", this.ctx);
            }
        }
    }
};
</script>
<style lang="scss">
.xui-file {
    display: inline-block;
    .xui-upload-trigger {
        display: inline-block;
        vertical-align: middle;
    }
}
</style>