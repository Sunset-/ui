# 表单
> 组合表单项组件，提供可装配的表单组件
> 支持输入输出格式化  
> 支持声明校验规则对表单进行校验,提供实时校验状态提示  
> 支持组件间监听变化变更自身属性，可用于实现级联组件等功能      
> 可通过NetPosaXUI.Component.registFormField('widget名称',component);方法将业务组件注入组件库  
---

#### 属性
---
| 属性名                         | 类型                   | 默认值       | 描述                                                                     |
| :----------------------------- | :--------------------: | :----------: | :----------------------------------------------------------------------- |
| options                        | ` Object `             | 无           | 配置对象                                                                 |
| options.cast                   | ` Function(model) `    | 无           | 输入格式化函数                                                           |
| options.format                 | ` Function(model) `    | 无           | 输出格式化函数                                                           |
| options.cols                   | ` Boolean / Number `   | false        | 布局,false时为横向流式布局,[1-24]为栅格布局                              |
| options.lazy                   | ` Boolean `            | false        | 初始是否触发查询                                                         |
| options.filterEmpty            | ` Boolean `            | false        | 空值过滤，过滤掉model中的null,undefind,空字符串                          |
| options.fillEmpty              | ` 任意 `               | false        | 空值填充，使用配置值填充model中的null,undefind,空字符串                  |
| options.toolbar                | ` Object `             | 保存取消按钮 | 底部操作栏，配置见toolbar<br>设置操作项中的signal='SUBMIT'，触发表单提交 |
| options.labelStyle             | ` String / Object `    | 无           | label样式，影响所有组件样式，优先级低于field                             |
| options.widgetStyle            | ` String / Object `    | 无           | 组件样式，影响所有组件样式，优先级低于field                              |
| options.fields                 | ` Array[Object] `      | 无           | 表单项数组                                                               |
| options.fields[x].group        | ` String `             | 无           | 分组名，直到下一个group出现前，接下来所有field为一组                     |
| options.fields[x].groupVisible | ` Boolean / Function ` | 无           | 分组是否展示,影响该分组下所有field,function(model)                       |
| options.fields[x].label        | ` String `                                                    | 无           | 表单项label                                                              |
| options.fields[x].name         | ` String `                                                    | 无           | 参数名                                                                   |
| options.fields[x].default      | ` 任意 `                                                      | 无           | 默认值,支持promise异步返回默认值                                         |
| options.fields[x].defaultFirst | ` Boolean `                                                   | false        | 【选项型组件】默认首个                                                   |
| options.fields[x].defaultIndex | ` Number `                                                    | 无           | 【选项型组件】默认第index个，为负数时，从末尾倒数                        |
| options.fields[x].newline      | ` Boolean `                                                   | false        | 另起一行                                                                 |
| options.fields[x].monopolize   | ` Boolean `                                                   | false        | 独占一行                                                                 |
| options.fields[x].premise      | ` Boolean / Function(ctx)`                                    | true         | 是否存在(搜索参数清除)                                                   |
| options.fields[x].visible      | ` Boolean / Function(ctx)`                                    | true         | 是否显示(搜索参数依然存在)                                               |
| options.fields[x].view         | ` 'DATETIEM' / 'DATE' / Function(value, model, fieldOptions)` | 无           | 表单项查看状态下的的展示结果，支持html                                   |
| options.fields[x].cols         | ` Number[1-24] / Boolean ` | 无           | 数字时，为栅格布局，宽度为24/x，false时为流式布局                        |
| options.fields[x].fieldClass   | ` String `                 | 无           | 表单组件容器class                                                        |
| options.fields[x].fieldStyle   | ` String / Object `        | 无           | 表单组件容器样式                                                         |
| options.fields[x].labelStyle   | ` String / Object `        | 无           | label样式                                                                |
| options.fields[x].widgetStyle  | ` String / Object `        | 无           | 组件样式                                                                 |

#### 方法
---
| 方法名           | 参数                                            | 返回值                       | 描述                     |
| :--------------- | :---------------------------------------------: | :--------------------------- | :----------------------- |
| reset            | model-数据对象                                  | 无                           | 重置                     |
| getModel         | origin `Boolean` - 是否获取原始对象，默认为拷贝 | "model - 数据对象            | 同步获取数据对象         |
| getValidateModel | 无                                              | model - 校验通过后的数据对象 | 异步获取校验后的数据对象 |
| validate         | 无                                              | isValid - 是否通过检验       | 获取表单校验状态         |

#### 事件
---
| 属性名      | 参数            | 描述               |
| :---------- | :-------------- | :----------------- |
| submit      | model-数据对象  | 通过校验的提交事件 |
| validate    | errors-错误信息 | 校验未通过事件     |
| modelchange | 无              | 数据对象值变更事件 |

#### 示例
---
<template>
    <div class="demo-container">
        <div class="filter-params">
            <div><b>输出model:</b></div>
            <div ref="result"></div>
        </div>
        <br>
        <div class="filter-params">
            <div><b>异常信息:</b></div>
            <div ref="errors"></div>
        </div>
        <br>
        <div>
            栅格布局：<xui-switch @change="changeLayout" size="small"></xui-switch>&nbsp;&nbsp;
            隐藏更多：<xui-switch v-model="showMore" size="small"></xui-switch>&nbsp;&nbsp;
            重置：<xui-button color="primary" @click="reset">空值重置</xui-button>&nbsp;&nbsp;
            <xui-button color="danger" @click="resetWithModel">有值重置</xui-button>&nbsp;&nbsp;
            视图展示：<xui-switch v-model="viewMode" size="small"></xui-switch>&nbsp;&nbsp;
        </div>
        <br>
        <xui-form ref="form" :view="viewMode" :options="options" @submit="submitHandle" @validate="onVlidateError"></xui-form>
    </div>
</template>

<script>

export default {
	methods: {
        changeLayout(v){
            this.options.cols = v?2:false;
        },
		submitHandle(model) {
			console.warn("model:" + JSON.stringify(model));
            $(this.$refs.result).JSONView(model);
            $(this.$refs.errors).html("");
		},
		reset() {
			//空值重置会使用每一项配置的default值
			this.$refs.form.reset();
		},
		resetWithModel() {
			this.$refs.form.reset({
				inputname: "张三丰"
			});
        },
        onVlidateError(errors){
            $(this.$refs.result).html("无");
			$(this.$refs.errors).JSONView(errors);
        }
	},
	data() {
		return {
            showMore:true,
            viewMode:false,
			params: "",
			options: {
				cols : false,//布局方式
                lazy : false,//初始搜索
                filterEmpty : false,//过滤掉空值项
                fillEmpty : "",//空值替换
				labelStyle : 'min-width:80px',
				widgetStyle : 'min-width:150px',
				fields: [
					{
                        group : "基本信息",
						label: "文本框",
						widget: "input",
                        name: "inputname",
                        validate : {
                            required : true//非空为给label加上红色星号
                        }
					},
					{
						label: "手机号校验",
						widget: "input",
                        name: "phonename",
                        validate : {
                            regexp : {
                                rule : /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
                                message : '手机号码格式不合法'
                            }
                        }
					},
					{
						label: "下拉框",
						widget: "select",
						name: "selectname",
						defaultFirst: true,//默认首个
						changeFilter :true,//值变更会触发搜索
						data: [
							{
								text: "超级管理员",
								value: "1"
							},
							{
								text: "管理员",
								value: "2"
							},
							{
								text: "普通用户",
								value: "3"
							}
						]
					},
					{
						label: "单选框",
                        widget: "radio",
                        manner : 'button',
						name: "radioname",
						default: "FEMALE",
						changeFilter :true,
						data: [
							{
								text: "男",
								value: "MALE"
							},
							{
								text: "女",
								value: "FEMALE"
							},
							{
								text: "未知",
								value: "UNKNOW"
							}
						]
					},
					{
						label: "复选框",
						widget: "checkbox",
						name: "checkboxname",
						default: "ps",
						data: [
							{
								text: "踢球",
								value: "tq"
							},
							{
								text: "游泳",
								value: "yy"
							},
							{
								text: "爬山",
								value: "ps"
							}
						],
                        visible:()=>{
                            return this.showMore;
                        },
                        validate : {
                            func : {
                                rule : function(v){
                                    return !(v&&v.split(',').length>2);
                                },
                                message : '最多选择2个'
                            }
                        }
					},
					// {
					// 	label: "日期框",
					// 	widget: "datepicker",
                    //     name: "datename",
                    //     placeholder:"出生日期",
                    //     format : 'yyyy-MM-dd',
                    //     valueFormat : 'timestamp',
                    //     default(){
                    //         return new Promise(resolve=>resolve(new Date(new Date().getTime() - 10 * 86400000)));
                    //     },
                    //     visible:()=>{
                    //         return this.showMore;
                    //     }
					// },
					{
						label: "车牌颜色",
						name: "plateColor",
						widget: "color",
						defaultFirst: true,
						default: "blue,yellow",
						changeFilter: true,
						multiple: true,
						template(item, active) {
							return `<div style="width:20px;height:20px;border-radius:3px;margin-right:5px;background:${
								item.value
							};border:2px solid ${active ? "orange" : "#777"};"></div>`;
						},
						data: [
							{
								text: "红色",
								value: "red"
							},
							{
								text: "绿色",
								value: "green"
							},
							{
								text: "蓝色",
								value: "blue"
							},
							{
								text: "黄色",
								value: "yellow"
							}
						],
                        visible:()=>{
                            return this.showMore;
                        }
					},
					// {
                    //     group : "其他信息",
					// 	label: "日期区间",
					// 	name: "daterangename",
					// 	widget: "daterange",
					// 	startPlaceholder: "开始时间",
					// 	endPlaceholder: "结束时间",
					// 	type: "datetime",
					// 	format: "yyyy-MM-dd hh:mm:ss",
					// 	valueFormat: "timestamp",
					// 	defaultIndex: 1,
                    //     changeFilter:true,
                    //     monopolize : true,
					// 	shortcuts: [
					// 		{
					// 			label: "24小时",
					// 			value() {
					// 				var now = new Date();
					// 				return [new Date(now.getTime() - 86400000), now];
					// 			}
					// 		},
					// 		{
					// 			label: "近7天",
					// 			value() {
					// 				var now = new Date();
					// 				var start = new Date();
					// 				start.setDate(start.getDate() - 6);
					// 				start.setHours(0);
					// 				start.setMinutes(0);
					// 				start.setSeconds(0);
					// 				start.setUTCMilliseconds(0);
					// 				return [new Date(start), now];
					// 			}
					// 		},
					// 		{
					// 			label: "近30天",
					// 			value() {
					// 				var now = new Date();
					// 				var start = new Date();
					// 				start.setDate(start.getDate() - 30);
					// 				start.setHours(0);
					// 				start.setMinutes(0);
					// 				start.setSeconds(0);
					// 				start.setUTCMilliseconds(0);
					// 				return [new Date(start), now];
					// 			}
					// 		}
                    //     ],
                    //     visible:()=>{
                    //         return this.showMore;
                    //     }
                    // },
                    // {
                    //     label: "头像",
                    //     text : '上传图片',
                    //     name: "picture",
                    //     widget: "fileuploader",
                    //     color: "primary",
                    //     max: 5,
                    //     monopolize : true,
                    //     url: "/gateway/uploadservice/upload/uploadVehicle",
                    //     tip: "请上传两张jpg/jpeg/png图片",
                    //     filter(f) {
                    //         return ~f.type.indexOf("image");
                    //     },
                    //     format(data) {
                    //         return JSON.parse(data).data;
                    //     },
                    //     thumbnail(v) {
                    //         return `/vdtimg/${v}`;
                    //     },
                    //     onError(e) {
                    //         if (typeof e == "string") {
                    //             $tip(e, "warning");
                    //         }
                    //     }
                    // },
                    {
                        label : '备注',
                        name : 'textareaname',
                        widget : 'textarea',
                        placeholder : '请输入备注',
                        maxlength : 200,
                        lengthTip : true,
                        monopolize : true,
                        rows : 4
                    },
                    {
                        group : '级联展示',
                        label : 'premise控制',
                        name : 'premise-control',
                        widget : 'switch',
                        default : true,
                        cols : 4//通过设置此值微调布局
                    },
                    {
                        label : '被premise控制',
                        name : 'premise-widget',
                        widget : 'input',
                        premise(model){
                            return model['premise-control'];//使用上一个组件值
                        }
                    },
                    {
                        newline : true,
                        label : 'visible控制',
                        name : 'visible-control',
                        widget : 'switch',
                        default : true,
                        cols : 4//通过设置此值微调布局
                    },
                    {
                        label : '被visible控制',
                        name : 'visible-widget',
                        widget : 'input',
                        visible(model){
                            return model['visible-control'];//使用上一个组件值
                        }
                    },
                    {
                        newline : true,
                        label : 'disabled控制',
                        name : 'disabled-control',
                        widget : 'switch',
                        default : false,
                        cols : 4//通过设置此值微调布局
                    },
                    {
                        label : '被disabled控制',
                        name : 'disabled-widget',
                        widget : 'input',
                        disabled(model){
                            return model['disabled-control'];//使用上一个组件值
                        }
                    },
                    {
                        newline : true,
                        label : 'watch被监听1',
                        name : 'watchDep1',
                        widget : 'input',
                        default : '名称'
                    },
                    {
                        label : 'watch被监听2',
                        name : 'watchDep2',
                        widget : 'radio',
                        data : {
                            'vehicle' : '汽车',
                            'person' : '人类'
                        }
                    },
                    {
                        label : 'watch监听',
                        name : 'watch-widget',
                        widget : 'select',
                        watch:['watchDep1,watchDep2',function(model,options){
                            options.label = model.watchDep1;
                            var optionsMap = {
                                'vehicle' : {
                                    'bc' :'奔驰',
                                    'bm' :'宝马',
                                    'ad' :'奥迪'
                                },
                                'person' : {
                                    'man' : '男人',
                                    'woman' : '女人'
                                }
                            };
                            if(optionsMap[model.watchDep2]!=options.data){
                                model['watch-widget'] = "";
                                options.data = optionsMap[model.watchDep2]||{};
                            }
                        }],
                        data : {}
                    }
				],
				format(filter){
					filter.attachname = "格式化中添加的属性";
				}
			}
		};
	}
};
</script>
<style>
.jsonview{
	padding:10px;
	font-size:14px;
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
}
.jsonview .null {  
    color: #ff6363;  
}  
.jsonview .bool {  
  color: #f8c243;  
}  
.jsonview .num {  
  color: #bf55ec;  
}  
.jsonview .string {  
  color: #00b16a;  
  white-space: pre-wrap;  
}   
</style>
``` html
<div class="filter-params">
    <div><b>输出model:</b></div>
    <div ref="result"></div>
</div>
<br>
<div class="filter-params">
    <div><b>异常信息:</b></div>
    <div ref="errors"></div>
</div>
<br>
<div>
    栅格布局：<xui-switch @change="changeLayout" size="small"></xui-switch>&nbsp;&nbsp;
    隐藏更多：<xui-switch v-model="showMore" size="small"></xui-switch>&nbsp;&nbsp;
    重置：<xui-button color="primary" @click="reset">空值重置</xui-button>&nbsp;&nbsp;
    <xui-button color="danger" @click="resetWithModel">有值重置</xui-button>&nbsp;&nbsp;
    视图展示：<xui-switch v-model="viewMode" size="small"></xui-switch>&nbsp;&nbsp;
</div>
<br>
<xui-form ref="form" :view="viewMode" :options="options" @submit="submitHandle" @validate="onVlidateError"></xui-form>
```
``` js
export default {
	methods: {
        changeLayout(v){
            this.options.cols = v?2:false;
        },
		submitHandle(model) {
			console.warn("model:" + JSON.stringify(model));
            $(this.$refs.result).JSONView(model);
            $(this.$refs.errors).html("");
		},
		reset() {
			//空值重置会使用每一项配置的default值
			this.$refs.form.reset();
		},
		resetWithModel() {
			this.$refs.form.reset({
				inputname: "张三丰"
			});
        },
        onVlidateError(errors){
            $(this.$refs.result).html("无");
			$(this.$refs.errors).JSONView(errors);
        }
	},
	data() {
		return {
            showMore:true,
            viewMode:false,
			params: "",
			options: {
				cols : false,//布局方式
                lazy : false,//初始搜索
                filterEmpty : false,//过滤掉空值项
                fillEmpty : "",//空值替换
				labelStyle : 'min-width:80px',
				widgetStyle : 'min-width:150px',
				fields: [
					{
                        group : "基本信息",
						label: "文本框",
						widget: "input",
                        name: "inputname",
                        validate : {
                            required : true//非空为给label加上红色星号
                        }
					},
					{
						label: "手机号校验",
						widget: "input",
                        name: "phonename",
                        validate : {
                            regexp : {
                                rule : /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
                                message : '手机号码格式不合法'
                            }
                        }
					},
					{
						label: "下拉框",
						widget: "select",
						name: "selectname",
						defaultFirst: true,//默认首个
						changeFilter :true,//值变更会触发搜索
						data: [
							{
								text: "超级管理员",
								value: "1"
							},
							{
								text: "管理员",
								value: "2"
							},
							{
								text: "普通用户",
								value: "3"
							}
						]
					},
					{
						label: "单选框",
                        widget: "radio",
                        manner : 'button',
						name: "radioname",
						default: "FEMALE",
						changeFilter :true,
						data: [
							{
								text: "男",
								value: "MALE"
							},
							{
								text: "女",
								value: "FEMALE"
							},
							{
								text: "未知",
								value: "UNKNOW"
							}
						]
					},
					{
						label: "复选框",
						widget: "checkbox",
						name: "checkboxname",
						default: "ps",
						data: [
							{
								text: "踢球",
								value: "tq"
							},
							{
								text: "游泳",
								value: "yy"
							},
							{
								text: "爬山",
								value: "ps"
							}
						],
                        visible:()=>{
                            return this.showMore;
                        },
                        validate : {
                            func : {
                                rule : function(v){
                                    return !(v&&v.split(',').length>2);
                                },
                                message : '最多选择2个'
                            }
                        }
					},
					// {
					// 	label: "日期框",
					// 	widget: "datepicker",
                    //     name: "datename",
                    //     placeholder:"出生日期",
                    //     format : 'yyyy-MM-dd',
                    //     valueFormat : 'timestamp',
                    //     default(){
                    //         return new Promise(resolve=>resolve(new Date(new Date().getTime() - 10 * 86400000)));
                    //     },
                    //     visible:()=>{
                    //         return this.showMore;
                    //     }
					// },
					{
						label: "车牌颜色",
						name: "plateColor",
						widget: "color",
						defaultFirst: true,
						default: "blue,yellow",
						changeFilter: true,
						multiple: true,
						template(item, active) {
							return `<div style="width:20px;height:20px;border-radius:3px;margin-right:5px;background:${
								item.value
							};border:2px solid ${active ? "orange" : "#777"};"></div>`;
						},
						data: [
							{
								text: "红色",
								value: "red"
							},
							{
								text: "绿色",
								value: "green"
							},
							{
								text: "蓝色",
								value: "blue"
							},
							{
								text: "黄色",
								value: "yellow"
							}
						],
                        visible:()=>{
                            return this.showMore;
                        }
					},
					// {
                    //     group : "其他信息",
					// 	label: "日期区间",
					// 	name: "daterangename",
					// 	widget: "daterange",
					// 	startPlaceholder: "开始时间",
					// 	endPlaceholder: "结束时间",
					// 	type: "datetime",
					// 	format: "yyyy-MM-dd hh:mm:ss",
					// 	valueFormat: "timestamp",
					// 	defaultIndex: 1,
                    //     changeFilter:true,
                    //     monopolize : true,
					// 	shortcuts: [
					// 		{
					// 			label: "24小时",
					// 			value() {
					// 				var now = new Date();
					// 				return [new Date(now.getTime() - 86400000), now];
					// 			}
					// 		},
					// 		{
					// 			label: "近7天",
					// 			value() {
					// 				var now = new Date();
					// 				var start = new Date();
					// 				start.setDate(start.getDate() - 6);
					// 				start.setHours(0);
					// 				start.setMinutes(0);
					// 				start.setSeconds(0);
					// 				start.setUTCMilliseconds(0);
					// 				return [new Date(start), now];
					// 			}
					// 		},
					// 		{
					// 			label: "近30天",
					// 			value() {
					// 				var now = new Date();
					// 				var start = new Date();
					// 				start.setDate(start.getDate() - 30);
					// 				start.setHours(0);
					// 				start.setMinutes(0);
					// 				start.setSeconds(0);
					// 				start.setUTCMilliseconds(0);
					// 				return [new Date(start), now];
					// 			}
					// 		}
                    //     ],
                    //     visible:()=>{
                    //         return this.showMore;
                    //     }
                    // },
                    // {
                    //     label: "头像",
                    //     text : '上传图片',
                    //     name: "picture",
                    //     widget: "fileuploader",
                    //     color: "primary",
                    //     max: 5,
                    //     monopolize : true,
                    //     url: "/gateway/uploadservice/upload/uploadVehicle",
                    //     tip: "请上传两张jpg/jpeg/png图片",
                    //     filter(f) {
                    //         return ~f.type.indexOf("image");
                    //     },
                    //     format(data) {
                    //         return JSON.parse(data).data;
                    //     },
                    //     thumbnail(v) {
                    //         return `/vdtimg/${v}`;
                    //     },
                    //     onError(e) {
                    //         if (typeof e == "string") {
                    //             $tip(e, "warning");
                    //         }
                    //     }
                    // },
                    {
                        label : '备注',
                        name : 'textareaname',
                        widget : 'textarea',
                        placeholder : '请输入备注',
                        maxlength : 200,
                        lengthTip : true,
                        monopolize : true,
                        rows : 4
                    },
                    {
                        group : '级联展示',
                        label : 'premise控制',
                        name : 'premise-control',
                        widget : 'switch',
                        default : true,
                        cols : 4//通过设置此值微调布局
                    },
                    {
                        label : '被premise控制',
                        name : 'premise-widget',
                        widget : 'input',
                        premise(model){
                            return model['premise-control'];//使用上一个组件值
                        }
                    },
                    {
                        newline : true,
                        label : 'visible控制',
                        name : 'visible-control',
                        widget : 'switch',
                        default : true,
                        cols : 4//通过设置此值微调布局
                    },
                    {
                        label : '被visible控制',
                        name : 'visible-widget',
                        widget : 'input',
                        visible(model){
                            return model['visible-control'];//使用上一个组件值
                        }
                    },
                    {
                        newline : true,
                        label : 'disabled控制',
                        name : 'disabled-control',
                        widget : 'switch',
                        default : false,
                        cols : 4//通过设置此值微调布局
                    },
                    {
                        label : '被disabled控制',
                        name : 'disabled-widget',
                        widget : 'input',
                        disabled(model){
                            return model['disabled-control'];//使用上一个组件值
                        }
                    },
                    {
                        newline : true,
                        label : 'watch被监听1',
                        name : 'watchDep1',
                        widget : 'input',
                        default : '名称'
                    },
                    {
                        label : 'watch被监听2',
                        name : 'watchDep2',
                        widget : 'radio',
                        data : {
                            'vehicle' : '汽车',
                            'person' : '人类'
                        }
                    },
                    {
                        label : 'watch监听',
                        name : 'watch-widget',
                        widget : 'select',
                        watch:['watchDep1,watchDep2',function(model,options){
                            options.label = model.watchDep1;
                            var optionsMap = {
                                'vehicle' : {
                                    'bc' :'奔驰',
                                    'bm' :'宝马',
                                    'ad' :'奥迪'
                                },
                                'person' : {
                                    'man' : '男人',
                                    'woman' : '女人'
                                }
                            };
                            if(optionsMap[model.watchDep2]!=options.data){
                                model['watch-widget'] = "";
                                options.data = optionsMap[model.watchDep2]||{};
                            }
                        }],
                        data : {}
                    }
				],
				format(filter){
					filter.attachname = "格式化中添加的属性";
				}
			}
		};
	}
};
```