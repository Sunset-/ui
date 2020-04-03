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
		<np-button @click="upload">上传</np-button>
		<np-file ref="uploader" class="upload-test" :options="options" :ctx="{name : '小明'}" @queue="queue" @progress="progress" @single-error="errorHandle" @success="success">
			<div class="test-class"></div>
		</np-file>
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
		remove(f){
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
			list:[],
			v: "",
			options: {
				label: "文件选择",
				icon: "ios-cloud-upload",
				disabled: false,
				color: "success",
				filename: "ahahah",
				wait: true,
				max :3,
				url: "/test-upload/screeningOm/receive",
				className: "my-uploader-trigger",
				filter(f) {
					return ~f.type.indexOf("image");
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
