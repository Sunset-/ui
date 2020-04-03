# 日期区间选择器

> 集成 radio 组件和 datepicker 组件  
> 支持自定义快捷方式

## 属性

| 属性名                   |       类型        |        默认值         | 描述                                                                                    |
| :----------------------- | :---------------: | :-------------------: | :-------------------------------------------------------------------------------------- |
| v-model                  |     `String`      |          无           | 组件值                                                                                  |
| disabled                 |     `Boolean`     |         false         | 是否禁用                                                                                |
| options                  |     `Object`      |          无           | 配置对象                                                                                |
| options.type             |     `String`      |        'date'         | 类型：date,datetime                                                                     |
| options.format           |     `String`      | 'yyyy-MM-dd HH:mm:ss' | 显示在输入框的格式                                                                      |
| options.valueFormat      |     `String`      |          无           | 输出值格式 默认为 Date 对象 可选值为"timestamp、yyyy-MM-dd"                             |
| options.startPlaceholder |     `String`      |          无           | 开始输入提示                                                                            |
| options.endPlaceholder   |     `String`      |          无           | 结束输入提示                                                                            |
| options.clearable        |     `Boolean`     |         true          | 是否可清空                                                                              |
| options.shortcuts        |  `Array[Object]`  |          无           | 快捷方式数组<br>[{label : 名称 1 , value : 取值函数 1},... ] 如果该值为空显示双日期组件 |
| options.searchButton     |     `Object`      |          无           | 查询按钮，参数与 button 一致，如果不传入该项则不现实查询按钮                            |
| options.searchCallBack   | `Function(dates)` |          无           | 查询按钮点击回调                                                                        |

## 事件

| 属性名 |     参数     | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">

<template>
	<div class="demo-container">
		<xui-daterange v-model="v" :options="options" @change="changeHandle"></xui-daterange>
		<p>value : {{v}}</p>
	</div>
</template>
<script>
export default {
    data(){
        return {
            v:[new Date(Date.now() - 86400000 * 7),new Date()],
			options: {
				type: "datetime",
				format: "yyyy-MM-dd HH:mm:ss",
				valueFormat: "timestamp",
				startPlaceholder: "开始时间",
				endPlaceholder: "结束时间",
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
				searchButton: {
                    color: "primary",
                    label: "筛选",
                    operate:(val)=>{
					    console.log('SEARCH:'+val);
                    }
				}
			}
        }
    },
	methods : {
		changeHandle(v){
				console.log(v)
		}
	}
}
</script>
</script>
