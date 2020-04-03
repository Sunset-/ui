# 搜索条件

> 组合表单项组件，提供可装配的搜索条件  
> 提供对搜索条件的格式化  
> 可通过 NetPosaXUI.Component.registFormField('widget 名称',component);方法将业务组件注入组件库

## 属性

| 属性名                         |                类型                 | 默认值 | 描述                                                       |
| :----------------------------- | :---------------------------------: | :----: | :--------------------------------------------------------- |
| options                        |              `Object`               |   无   | 配置对象                                                   |
| options.format                 |         `Function(filter)`          |   无   | 搜索条件格式化函数                                         |
| options.cols                   |         `Boolean / Number`          | false  | 布局,false 时为横向流式布局,[1-24]为栅格布局               |
| options.lazy                   |              `Boolean`              | false  | 初始是否触发查询                                           |
| options.filterEmpty            |              `Boolean`              | false  | 空值过滤，过滤掉搜索条件中的 null,undefind,空字符串        |
| options.fillEmpty              |               `任意`                | false  | 空值填充，使用配置值填充 model 中的 null,undefind,空字符串 |
| options.searchButton           |              `Object`               |   无   | 搜索按钮，配置见 button                                    |
| options.labelStyle             |          `String / Object`          |   无   | label 样式，影响所有组件样式，优先级低于 field             |
| options.widgetStyle            |          `String / Object`          |   无   | 组件样式，影响所有组件样式，优先级低于 field               |
| options.fields                 |           `Array[Object]`           |   无   | 搜索项数组                                                 |
| options.fields[x].group        |              `String`               |   无   | 分组名，直到下一个 group 出现前，接下来所有 field 为一组   |
| options.fields[x].groupVisible |        `Boolean / Function`         |   无   | 分组是否展示,影响该分组下所有 field,function(model)        |
| options.fields[x].label        |              `String`               |   无   | 搜索项 label                                               |
| options.fields[x].name         |              `String`               |   无   | 参数名                                                     |
| options.fields[x].default      |               `任意`                |   无   | 默认值,支持 promise 异步返回默认值                         |
| options.fields[x].defaultFirst |              `Boolean`              | false  | 【选项型组件】默认首个                                     |
| options.fields[x].defaultIndex |              `Number`               |   无   | 【选项型组件】默认第 index 个，为负数时，从末尾倒数        |
| options.fields[x].newline      |              `Boolean`              | false  | 另起一行                                                   |
| options.fields[x].monopolize   |              `Boolean`              | false  | 独占一行                                                   |
| options.fields[x].changeFilter |              `Boolean`              | false  | 组件值变更是否触发搜索                                     |
| options.fields[x].rechange     | `Function(newValue,oldValue,model)` |   无   | 组件值再次变更，用于将根据新旧值决定最终值                 |
| options.fields[x].premise      |      `Boolean / Function(ctx)`      |  true  | 是否存在(搜索参数清除)                                     |
| options.fields[x].visible      |      `Boolean / Function(ctx)`      |  true  | 是否显示(搜索参数依然存在)                                 |
| options.fields[x].cols         |      `Number[1-24] / Boolean`       |   无   | 数字时，为栅格布局，宽度为 24/x，false 时为流式布局        |
| options.fields[x].fieldClass   |              `String`               |   无   | 表单组件容器 class                                         |
| options.fields[x].fieldStyle   |          `String / Object`          |   无   | 表单组件容器样式                                           |
| options.fields[x].labelStyle   |          `String / Object`          |   无   | label 样式                                                 |
| options.fields[x].widgetStyle  |          `String / Object`          |   无   | 组件样式                                                   |
| options.fields[x].validate     |              `Object`               |   无   | 校验声明对象                                               |
| options.fields[x].onValidate   |             `Function`              |   无   | 校验不通过时的回调函数<br>`function(error,firstErrorMsg)`  |

## 方法

| 方法名    |        参数         | 返回值              | 描述                                                      |
| :-------- | :-----------------: | :------------------ | :-------------------------------------------------------- |
| reset     | filter-搜索条件对象 | 无                  | 重置，为空时各项使用 default 值；不为空时，不使用 default |
| merge     | filter-搜索条件对象 | 无                  | 合并搜索条件                                              |
| search    |         无          | 无                  | 手动触发搜索                                              |
| getFilter |         无          | filter-搜索条件对象 | 获取搜索参数对象                                          |

## 事件

| 属性名   | 参数                | 描述           |
| :------- | :------------------ | :------------- |
| filter   | filter-搜索条件对象 | 触发搜索       |
| validate | errors-错误信息     | 校验未通过事件 |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<template>
    <div class="demo-container">
        <div class="filter-params">
            <div><b>搜索条件:</b></div>
            <div ref="params" v-html="params"></div>
        </div>
        <br>
        <div style="padding-bottom:10px;border-bottom:1px solid #ddd;">
            栅格布局：<xui-switch @change="changeLayout" size="small"></xui-switch>&nbsp;&nbsp;
            展开更多：<xui-switch v-model="showMore" size="small"></xui-switch>&nbsp;&nbsp;
            重置：<xui-button color="primary" @click="reset">空值重置</xui-button>&nbsp;&nbsp;
            <xui-button color="danger" @click="resetWithModel">有值重置</xui-button>&nbsp;&nbsp;
            <xui-button color="warning" @click="merge">合并条件</xui-button>
        </div>
        <xui-filter ref="filter" :options="options" @filter="onFilter"></xui-filter>
    </div>
</template>

<script>

import Vue from 'vue';

export default {
	methods: {
        changeLayout(v){
            this.options.cols = v?2:false;
        },
		onFilter(filter) {
			console.warn("filter:" + JSON.stringify(filter));
            this.params = $jsonview(filter);
		},
		reset() {
			//空值重置会使用每一项配置的default值
			this.$refs.filter.reset();
		},
		resetWithModel() {
			this.$refs.filter.reset({
				inputname: "张三丰"
			});
		},
		merge(){
			this.$refs.filter.merge({
				mergename: "合并条件"+Date.now()
			});
		}
	},
	data() {
		return {
            showMore:true,
			params: "",
			options: {
				cols : false,//布局方式
                lazy : false,//初始搜索
                filterEmpty : true,//过滤掉空值项
				labelStyle : 'min-width:80px',
				widgetStyle : 'min-width:150px',
				fields: [
					{
						group : '组件',
						label: "文本框",
						widget: "input",
                        name: "inputname"
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
                        }
					},
					{
						label: "日期框",
						widget: "datepicker",
                        name: "datename",
                        placeholder:"出生日期",
                        format : 'yyyy-MM-dd',
                        valueFormat : 'timestamp',
                        default(){
                            return new Promise(resolve=>resolve(new Date(new Date().getTime() - 10 * 86400000)));
                        },
                        visible:()=>{
                            return this.showMore;
                        }
					},
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
					{
						label: "日期区间",
						name: "daterangename",
						widget: "daterange",
						startPlaceholder: "开始时间",
						endPlaceholder: "结束时间",
						type: "datetime",
						format: "yyyy-MM-dd hh:mm:ss",
						valueFormat: "timestamp",
						defaultIndex: 1,
                        changeFilter:true,
                        monopolize : true,
						shortcuts: [
							{
								label: "24小时",
								value() {
									var now = new Date();
									return [new Date(now.getTime() - 86400000), now];
								}
							},
							{
								label: "近7天",
								value() {
									var now = new Date();
									var start = new Date();
									start.setDate(start.getDate() - 6);
									start.setHours(0);
									start.setMinutes(0);
									start.setSeconds(0);
									start.setUTCMilliseconds(0);
									return [new Date(start), now];
								}
							},
							{
								label: "近30天",
								value() {
									var now = new Date();
									var start = new Date();
									start.setDate(start.getDate() - 30);
									start.setHours(0);
									start.setMinutes(0);
									start.setSeconds(0);
									start.setUTCMilliseconds(0);
									return [new Date(start), now];
								}
							}
                        ],
                        visible:()=>{
                            return this.showMore;
                        }
					},
					{
						group : '布局',
						groupVisible :()=>{//控制整组显示隐藏
							return this.showMore;
						},
						label : '栅流混排',
						name : 'flow1',
						widget : 'checkbox',
						cols : false
					},
					{
						name : 'flow2',
						widget : 'input',
						cols : false,
						disabled(model){
							return !model.flow1;
						}
					},
					{
						label : '我占12/24',
						name : 'flow3',
						widget : 'input',
						cols : 12,
						newline : true
					},
					{
						label : '我也占12/24',
						name : 'flow4',
						widget : 'input',
						cols : 12
					},
					{
						label : '普普通通',
						name : 'flow4',
						widget : 'input'
					},
					{
						label : '我新起一行',
						name : 'flow5',
						widget : 'input',
						newline : true
					},
					{
						label : '我独占一行',
						name : 'flow6',
						widget : 'input',
						monopolize : true
					},
					{
						group : '特性展示',
						label : 'rechange',
						name : 'rechange',
						widget : 'checkbox',
						monopolize : true,
						rechange(newValue,oldValue,model){
							var newValues = newValue&&newValue.split(','),
								oldValues = oldValue&&oldValue.split(',');
							var resultValue;
							if(newValues.indexOf('')>=0&&oldValues.indexOf('')<0){
								resultValue = '';
							}else if(newValues.indexOf('')>=0&&oldValues.indexOf('')>=0){
								resultValue = newValues.filter(v=>v!='').join(',');
							}else{
								resultValue= newValue;
							}
							return resultValue;
						},
						changeFilter : true,
						data : [{
							value : '',
							text : '全部'
						},{
							value : 'red',
							text : '红'
						},{
							value : 'yellow',
							text : '黄'
						},{
							value : 'blue',
							text : '蓝'
						}]
					}
				],
				format(filter){
					filter.attachname = "格式化中添加的属性";
				},
				searchButton: {
					label: "查询",
                    color : 'primary',
                    style : 'display:block;margin:0px auto;width:200px;'//可自定义样式
				}
			}
		};
	}
};
</script>
</script>
