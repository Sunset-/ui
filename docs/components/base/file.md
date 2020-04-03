# 文件

> 面向数据的文件上传组件，可高度自定义上传流程

## 插槽

| 插槽名  | 插槽作用域属性 | 描述         |
| :-----: | :------------- | :----------- |
| default | 无             | 上传按钮 dom |

## 属性

| 属性名            |           类型           |   默认值   | 描述                                      |
| :---------------- | :----------------------: | :--------: | :---------------------------------------- |
| ctx               |         `Object`         |     无     | 作用域对象                                |
| disabled          |        `Boolean`         |   false    | 是否禁用                                  |
| options           |         `Object`         |     无     | 配置对象                                  |
| options.text      |         `String`         | '上传文件' | 上传按钮文本                              |
| options.url       |         `String`         |     无     | 上传服务器地址                            |
| options.filename  |         `String`         |   'file'   | 上传文件域 name                           |
| options.max       |         `Number`         |     无     | 单次队列最大上传数量                      |
| options.directory |        `Boolean`         |   false    | 选择文件夹上传                            |
| options.formData  | `Object / Function(ctx)` |     无     | 上传携带表单对象                          |
| options.wait      |        `Boolean`         |   false    | 是否等待业务调用再上传,默认选择后直接上传 |
| options.progress  |        `Function`        |     无     | 进度回调                                  |
| options.queue     |        `Function`        |     无     | 上传队列变更回调                          |
| options.filter    |        `Function`        |     无     | 文件上传前校验过滤，支持 promise 返回     |

## 方法

| 方法名     |   参数   | 返回值 | 描述               |
| :--------- | :------: | :----- | :----------------- |
| upload     |    无    | 无     | 开始上传           |
| removeFile | 上传对象 | 无     | 将文件从队列中移除 |
| clear | 无 | 无     | 清空上传队列 |
| cancel | 无 | 无     | 取消 |

## 事件

| 属性名         | 参数                              | 描述                                     |
| :------------- | :-------------------------------- | :--------------------------------------- |
| queue          | queue-上传队列<br>ctx-上下文对象  | 上传队列变更事件                         |
| queue-error    | msg - 错误信息                    | 加入队列异常（通常由超出文件数限制引起） |
| start-upload   | 无                                | 开始上传事件                             |
| progress       | progress-总进度<br>ctx-上下文对象 | 进度事件                                 |
| single-success | 上传对象<br>上下文对象 ctx        | 单项成功事件                             |
| single-error   | 上传对象<br>上下文对象 ctx        | 单项失败事件                             |
| success        | queue-上传队列,ctx-上下文对象     | 成功事件                                 |
| finish         | queue-上传队列,ctx-上下文对象     | 完成事件                                 |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<style>
	/* 自定义上传按钮样式 */
    .upload-trigger{
        display: inline-block;
        width: 80px;
        height: 80px;
        border:2px solid #ddd;
        background:#FFF;
        text-align:center;
        line-height:80px;
        cursor:pointer;
    }
    .upload-trigger:hover{
        background:#ccc;
    }
</style>
<template>
  <div class="demo-container">
	<xui-file ref="uploader" class="upload-test" :options="options" :ctx="ctx"
        @queue="queueHandle"
        @progress="progressHandle"
        @single-error="errorHandle"
        @success="successHandle">
		<div class="upload-trigger">选择文件</div>
	</xui-file>
    <xui-button @click="upload" color="primary" style="margin-left:20px;vertical-align:top;">开始上传</xui-button>
    <ul>
        <li v-for="(item,index) in queue" :key="index">
        <div>
            <div>文件名：{{item.name}}</div>
            <div>状态：{{item.status}}</div>
            <div>上传进度：{{item.progress}}</div>
            <div>服务器返回结果：{{item.result}}</div>
        </div>
        <a href="javascript:;" @click="removeFile(item)">删除</a>
        </li>
    </ul>
  </div>
</template>
<script>
export default {
    data(){
        return {
			queue : [],
			ctx : {name : '小明'},//宿主作用域对象
            options: {
				label: "文件选择",
				icon: "ios-cloud-upload",
				disabled: false,
				color: "success",
				filename: "file",
				wait: true,
				max :3,
				directory : false,
				url: "/test-upload/receive",
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
                    // console.log(`总上传进度:`+v);
				}
			}
        }
    },
    methods : {
		upload() {
			this.$refs.uploader.upload();
		},
		removeFile(f){
			this.$refs.uploader.removeFile(f);
		},
		queueHandle(queue) {
			this.queue = queue;
		},
		progressHandle(v) {
            console.log(`总上传进度:`+v);
        },
		errorHandle(v) {
            console.warn(`上传异常:`);
            console.warn(v);
		},
		successHandle() {
            console.log(`上传成功`);
        }
    }
}
</script>
</script>
