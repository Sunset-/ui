<style lang="scss">
.test-class {
	display: inline-block;
	width: 100px;
	height: 100px;
	background: yellowgreen;
}

.upload-test:hover {
	.test-class {
		background: red;
	}
}
</style>

<template>
	<div>
		<np-button @click="v=''">CLEAR</np-button>
		<div>{{v}}</div>
		<np-fileuploader v-model="v" ref="uploader" class="upload-test" :options="options" :ctx="{name : '小明'}" @queue="queue" @progress="progress" @single-error="errorHandle" @success="success">
			<div class="test-class"></div>
		</np-fileuploader>
		<div v-for="(f,index) in list" :key="index" @click="remove(f)" style="padding:5px;border:1px solid #ccc;margin-bottom:10px;">
			{{f.name}}
		</div>
	</div>
</template>

<script>
export default {
	methods: {
		upload() {
			this.$refs.uploader.upload();
		},
		queue(list) {
			this.list = list;
		},
		remove(f) {
			this.$refs.uploader.removeFile(f);
		},
		progress() {},
		errorHandle(v) {
			debugger;
		},
		success() {}
	},
	data() {
		return {
			list: [],
			v: "",
			options: {
				label: "文件选择",
				// dom : "<div>aaa</div>",
				icon: "ios-cloud-upload",
				disabled: false,
				color: "primary",
				filename: "file",
				// wait: true,
				max: 2,
				prepend: true,
				url: "/gateway/uploadservice/upload/uploadVehicle",
				className: "my-uploader-trigger123",
				tip: "最多上传2个",
				filter(f) {
					return ~f.type.indexOf("image");
				},
				thumbnail(v) {
					return `/vdtimg/${v}`;
				},
				// thumbnailRender(v,a){
				// 	debugger;
				// },
				format(res) {
					return res.data;
				},
				formData: record => {
					return {
						taskToken: "token"
						// xiaoname: record.name
					};
				},
				progress(v) {
					console.log(v);
				},
				onError() {
					debugger;
				}
			}
		};
	}
};
</script>