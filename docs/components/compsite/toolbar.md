# 操作栏

> 组合 button,switch,icon 等组件，实现批量操作集中定义  
> 可绑定作用域对象，该对象会出现在操作项的 operate 回调参数中

## 属性

| 属性名                    |              类型               |  默认值  | 描述                                                                                   |
| :------------------------ | :-----------------------------: | :------: | :------------------------------------------------------------------------------------- |
| ctx                       |            `Object`             |    无    | 上下文，会作为参数传入操作回调中                                                       |
| options                   |            `Object`             |    无    | 配置对象                                                                               |
| options.size              |            `String`             | 'normal' | 此属性会传入每一个操作项中                                                             |
| options.tools             |         `Array[Object]`         |    无    | 操作项数组                                                                             |
| options.tools[x].type     |            `String`             | 'button' | 类型：button,download,file,switch                                                      |
| options.tools[x].widget   |            `String`             |    无    | 未设置 type 时设置此值，则使用表单项组件渲染操作项，配置 见具体表单项组件              |
| options.tools[x].label    |            `String`             |    无    | 按钮文本,未设置此值且设置 icon 时，变为图标按钮                                        |
| options.tools[x].title    |    `String / Function(ctx)`     |    无    | 提示文本                                                                               |
| options.tools[x].icon     |    `String / Function(ctx)`     |    无    | 图标，见 button 配置                                                                   |
| options.tools[x].color    |            `String`             |    无    | 颜色，见 button 配置                                                                   |
| options.tools[x].operate  | `Function(ctx,value,resetFunc)` |    无    | 操作回调,当 type 为 switch 时存在 value 值；当为 widget 时存在 resetFunc，可用来重置值 |
| options.tools[x].disabled |    `Boolean / Function(ctx)`    |  false   | 是否禁用                                                                               |
| options.tools[x].premise  |    `Boolean / Function(ctx)`    |   true   | 是否存在                                                                               |
| options.tools[x].visible  |    `Boolean / Function(ctx)`    |   true   | 是否占位隐藏                                                                           |
| options.tools[x].name     |       `String / Function`       | '未命名' | 【下载】文件名称                                                                       |
| options.tools[x].data     |       `String / Function`       |    无    | 【下载】内容                                                                           |

## 方法

| 方法名 | 参数 | 返回值 | 描述     |
| :----- | :--: | :----- | :------- |
| open   |  无  | 无     | 打开弹窗 |
| close  |  无  | 无     | 关闭弹窗 |

## 事件

| 属性名 | 参数 | 描述         |
| :----- | :--- | :----------- |
| opened | 无   | 弹窗打开事件 |
| closed | 无   | 弹窗关闭事件 |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">

<style>
    .demo-container>.header{
        padding:10px 0px;
    }
    .demo-container>.header>div{
        display:inline-block;
        vertical-align:middle;
        margin-right:20px;
    }
    .demo-container>.header>div>label{
        display:inline-block;
        vertical-align:middle;
    }
</style>
<template>
	<div class="demo-container">
		<div class="header">
			<div><label>禁用：</label><xui-switch size="small" v-model="disabledFlag" /></div>
			<div><label>存在：</label><xui-switch size="small" v-model="premiseFlag" /></div>
			<div><label>占位显示：</label><xui-switch size="small" v-model="visibleFlag" /></div>
		</div>
		<xui-toolbar :ctx="record" :options="options"></xui-toolbar>
	</div>
</template>
<script>
export default {
	data() {
		return {
            record : {
                id : '001',
                name : '一条数据'
            },
            disabledFlag : false,
            premiseFlag : true,
            visibleFlag : true,
			options: {
                size : 'small',//可在此统一配置操作项尺寸
				tools: [
					{
						label: "普通按钮",
						color: "info",
						icon: "el-icon-circle-plus",
						operate: (ctx) => {
							alert("点击："+ctx.name);
						},
						disabled: ()=>{
                            return this.disabledFlag;
                        },
						premise: ()=>{
                            return this.premiseFlag;
                        },
						visible: ()=>{
                            return this.visibleFlag;
                        }
					},
					{
						label: "下载按钮",
						type: "download",
						icon: "el-icon-circle-plus",
						color: "primary",
						disabled: false,
						name: (ctx) => {
							return ctx.name+"-README.txt";
						},
						data: (ctx) => {
							return "data:text/plain,hello,xui! --"+ctx.id;
						},
						disabled: ()=>{
                            return this.disabledFlag;
                        },
						premise: ()=>{
                            return this.premiseFlag;
                        },
						visible: ()=>{
                            return this.visibleFlag;
                        }
					},
					{
						label: "文件选择",
						icon: "el-icon-circle-plus",
						color: "success",
						type: "file",
						url: "/service/system/file/upload",
						className: "my-uploader-trigger",
						filter(f) {
							return ~f.type.indexOf("image");
						},
						formData(ctx) {
							return {
								recordId: ctx.id
							};
						},
						operate(ctx,file){
							//直接操作文件
							alert(file.name);
						},
						disabled: ()=>{
                            return this.disabledFlag;
                        },
						premise: ()=>{
                            return this.premiseFlag;
                        },
						visible: ()=>{
                            return this.visibleFlag;
                        }
					},
					{
						title: "切换状态",
						type: "switch",
						default(ctx) {
							return true;
						},
						operate: (record, v) => {
							record.name = "false";
							return new Promise((resolve,reject) => {
                                setTimeout(()=>{
                                    alert('操作失败');
                                    reject(new Error());//在switch回调中，如果返回的数据中有异常，switch会回到操作前状态
                                },500)
							});
						},
						disabled: ()=>{
                            return this.disabledFlag;
                        },
						premise: ()=>{
                            return this.premiseFlag;
                        },
						visible: ()=>{
                            return this.visibleFlag;
                        }
					},
					{
						title: "表单组件",
						widget: "checkbox",
						default(ctx) {
							return '2,3';
						},
						data : {
							'1' : '足球',
							'2' :'篮球',
							'3' : '排球',
							'4': '网球'
						},
						operate: (record, v) => {
							alert(v);
						},
						disabled: ()=>{
                            return this.disabledFlag;
                        },
						premise: ()=>{
                            return this.premiseFlag;
                        },
						visible: ()=>{
                            return this.visibleFlag;
                        }
					}
				]
			}
		};
	}
};
</script>
</script>
