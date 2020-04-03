# 数据分页
> 组合loading,pager,提供分页数据加载容器  
> 支持声明式分页参数配置  
> 支持后端分页，前端分页，前后端异步分页  
> 支持预加载数据  
> 支持数据缓存  
> 支持条目数据自定义渲染  


#### 插槽
---
| 插槽名  | 插槽作用域属性                                     | 描述                 |
| :-----: | :------------------------------------------------- | :------------------- |
| default | list`Array`:当前分页数据<br>count`Number`:数据总数 | 分页内容模板         |
| empty   | 无                                                 | 数据为空时，提示信息 |

#### 属性
---
| 属性名                     | 类型                         | 默认值        | 描述                                                                                                                                               |
| :------------------------- | :--------------------------: | :-----------: | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| ctx                        | `Object`                     | 无            | 作用域对象                                                                                                                                         |
| options                    | `Object`                     | 无            | 配置对象                                                                                                                                           |
| options.pageNumberStart    | `Number`                     | 1             | 服务器分页页码起始，根据接口可配置为0                                                                                                              |
| options.pageSize           | `Number        `             | 10            | 服务器端分页大小                                                                                                                                   |
| options.localPageSize      | `Number`                     | 无            | 前后端分页大小不同时设置此项                                                                                                                       |
| options.cache              | `Boolean`                    | false         | 是否缓存数据（仅在分页器操作时使用缓存）                                                                                                           |
| options.preload            | `Number`                     | 0             | 预加载提前页数                                                                                                                                     |
| options.formatFilter       | `Function`                   | 无            | 请求前参数格式化回调函数                                                                                                                           |
| options.datasource         | `Function`                   | 无            | 数据源函数，同步或异步返回数据，Function(filter,ctx)                                                                                               |
| options.polling            | `Number / [Function,Number]` | 无            | 轮询配置，Number为轮询间隔<br>数值：使用datasource刷新数据<br>数组:[Function(records,ctx),Number]在方法中可修改records条目中的数据，同步或异步返回 |
| options.lazy               | `Boolean`                    | false         | 是否懒加载，设置为true时，初始不请求数据                                                                                                           |
| options.format             | `Object`                     | false         | 分页参数命名映射                                                                                                                                   |
| options.format.list        | `String`                     | 'list'        | 数据返回中列表数据的命名空间，可用多级取值（data.list）                                                                                            |
| options.format.count       | `String`                     | 'count'       | 数据返回中数据总量的命名空间，可用多级取值（data                                                                                                   |
| options.format.pageSize    | `String`                     | 'pageSize'    | 数据请求时服务端接收分页大小参数名                                                                                                                 |
| options.format.currentPage | `String`                     | 'currentPage' | 数据请求时服务端接收分页页码参数名                                                                                                                 |

#### 方法
---
| 方法名     | 参数                                                                  | 返回值 | 描述         |
| :--------- | :-------------------------------------------------------------------- | :----- | :----------- |
| search     | filter `Object` - 搜索条件对象                                        | 无     | 搜索加载数据 |
| refresh    | pageNumber `Number` - 页码(为空时刷新当前页)                          | 无     | 刷新         |
| clear      | 无                                                                    | 无     | 清空         |
| setData    | data `Object / Array` - (结构同datasource返回)                        | 无     | 设置静态数据 |
| setOptions | options `Object` - 配置对象<br> isReload `Boolean` - 是否重新加载数据 | 无     | 设置配置属性 |

#### 事件
---
| 属性名 | 参数                                                          | 描述     |
| :----- | :------------------------------------------------------------ | :------- |
| output | list `Array` - 当前分页数据列表<br> total `Number` - 数据总数 | 数据输出 |

#### 示例
---
<template>
  <div class="demo-container">
    <div class="filter-params">
        <div><b>请求服务器参数:</b></div>
        <div ref="params" v-html="params"></div>
    </div>
    <div>
        后端分页尺寸：<xui-slider v-model="pageSize" :options="{min:5,step:5,max:100}" />&nbsp;
        前端分页尺寸：<xui-slider v-model="localPageSize" :options="{min:5,step:5,max:100}" />&nbsp;
        预加载提前页数：<xui-slider v-model="preload" :options="{min:0,step:1,max:3}" />&nbsp;
        缓存数据：<xui-switch v-model="cache"/>&nbsp;
    </div>
    <div>
        <xui-button color="primary" @click="search" label="搜索" />&nbsp;
        <xui-button color="success" @click="refresh" label="刷新" />&nbsp;
        <xui-button color="warning" @click="setStaticData" label="设置静态数据" />&nbsp;
        <xui-button color="danger" @click="clear" label="清空" />
    </div>
    <xui-datapage ref="datapage" :options="options" @output="outputHandle">
        <template slot-scope="props">
            <div v-for="(item,index) in props.list" :key="index" class="custom-item">
                {{index+1}} : {{item.name}}
            </div>
        </template>
        <div slot="empty" style="padding:30px 0px;text-align:center;">
            无数据
        </div>
    </xui-datapage>
  </div>
</template>

<script>

import Vue from 'vue';

var demoData = [];
for(var i=0;i<95;i++){
    demoData.push({
        id : i,
        name : `record-${i}`
    });
}

export default {
	methods: {
        search(){
            this.$refs.datapage.search({
				keyword: "一个搜索条件"
			});
        },
        refresh(){
            this.$refs.datapage.refresh();
        },
		
        setStaticData(){
            var items = [];
            for (var i = 0; i < 200; i++) {
                items.push({ name: i + 1 });
            }
            this.$refs.datapage.setData({
                data: items,
                totalCount: 500
            });
        },
        clear(){
            this.$refs.datapage.clear();
        },
        outputHandle(list, total) {
        },
        setTableOptions(options) {
            this.$refs.datapage.setOptions(options,true);
        }
	},
	data() {
		return {
            params:"",
            pageSize : 5,
            localPageSize : 5,
            preload : 0,
            cache:false,
			options: {
				pageNumberStart: 1,
				pageSize: 5,
                localPageSize : 5,
                cache:false,
                preload : 0,
				format: {
					list: "data",
					count: "totalCount",
					pageSize: "pageSize",
					currentPage: "pageNumber"
				},
				datasource: filter => {
                    filter._timestamp = Date.now();
                    this.params = Vue.jsonview(filter);
                    console.log('请求：'+JSON.stringify(filter))
					return new Promise(resolve => {
						setTimeout(() => {
							resolve({
								totalCount: demoData.length,
								data: demoData.slice(
									filter.pageSize * (filter.pageNumber-1),
									filter.pageSize * (filter.pageNumber-1) + filter.pageSize
								)
							});
						}, 500);
					});
				}
			}
		};
    },
    watch:{
        pageSize(v){
            var options = this.options;
            options.pageSize = v;
            this.setTableOptions(options);
        },
        localPageSize(v){
            var options = this.options;
            options.localPageSize = v;
            this.setTableOptions(options);
        },
        preload(v){
            var options = this.options;
            options.preload = v;
            this.setTableOptions(options);
        },
        cache(v){
            var options = this.options;
            options.cache = v;
            this.setTableOptions(options);
        }
    }
};
</script>
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
    .demo-container .jsonview{
        padding:10px;
        font-size:14px;
        font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
    }
    .jsonview .null {  
        color: red;  
    }  
    .jsonview .bool {  
    color: #fde3a7;  
    }  
    .jsonview .num {  
    color: #bf55ec;  
    }  
    .jsonview .string {  
    color: #00b16a;  
    white-space: pre-wrap;  
    }   
    .custom-item{
        border:1px solid #dedede;
        width:200px;
        margin:5px 0px;
        padding:2px;
    }
</style>
``` html
<div class="filter-params">
    <div><b>请求服务器参数:</b></div>
    <div ref="params"></div>
</div>
<div>
    后端分页尺寸：<xui-slider v-model="pageSize" :options="{min:5,step:5,max:100}" />&nbsp;
    前端分页尺寸：<xui-slider v-model="localPageSize" :options="{min:5,step:5,max:100}" />&nbsp;
    预加载提前页数：<xui-slider v-model="preload" :options="{min:0,step:1,max:3}" />&nbsp;
    缓存数据：<xui-switch v-model="cache"/>&nbsp;
</div>
<div>
    <xui-button color="primary" @click="search" label="搜索" />&nbsp;
    <xui-button color="success" @click="refresh" label="刷新" />&nbsp;
    <xui-button color="warning" @click="setStaticData" label="设置静态数据" />&nbsp;
    <xui-button color="danger" @click="clear" label="清空" />
</div>
<xui-datapage ref="datapage" :options="options" @output="outputHandle">
    <template slot-scope="props">
        <div v-for="(item,index) in props.list" :key="index" class="custom-item">
            {{index+1}} : {{item.name}}
        </div>
    </template>
    <div slot="empty" style="padding:30px 0px;text-align:center;">
        无数据
    </div>
</xui-datapage>
```
``` js
var demoData = [];
for(var i=0;i<95;i++){
    demoData.push({
        id : i,
        name : `record-${i}`
    });
}

export default {
	methods: {
        search(){
            this.$refs.datapage.search({
				keyword: "一个搜索条件"
			});
        },
        refresh(){
            this.$refs.datapage.refresh();
        },
		
        setStaticData(){
            var items = [];
            for (var i = 0; i < 200; i++) {
                items.push({ name: i + 1 });
            }
            this.$refs.datapage.setData({
                data: items,
                totalCount: 500
            });
        },
        clear(){
            this.$refs.datapage.clear();
        },
        outputHandle(list, total) {
        },
        setTableOptions(options) {
            this.$refs.datapage.setOptions(options,false);
        }
	},
	data() {
		return {
            pageSize : 5,
            localPageSize : 5,
            preload : 0,
            cache:false,
			options: {
				pageNumberStart: 1,
				pageSize: 5,
                localPageSize : 5,
                cache:false,
                preload : 0,
				format: {
					list: "data",
					count: "totalCount",
					pageSize: "pageSize",
					currentPage: "pageNumber"
				},
				datasource: filter => {
                    filter._timestamp = Date.now();
                    $(this.$refs.params).JSONView(filter);
                    console.log('请求：'+JSON.stringify(filter))
					return new Promise(resolve => {
						setTimeout(() => {
							resolve({
								totalCount: demoData.length,
								data: demoData.slice(
									filter.pageSize * (filter.pageNumber-1),
									filter.pageSize * (filter.pageNumber-1) + filter.pageSize
								)
							});
						}, 500);
					});
				}
			}
		};
    },
    watch:{
        pageSize(v){
            var options = this.options;
            options.pageSize = v;
            this.setTableOptions(options);
        },
        localPageSize(v){
            var options = this.options;
            options.localPageSize = v;
            this.setTableOptions(options);
        },
        preload(v){
            var options = this.options;
            options.preload = v;
            this.setTableOptions(options);
        },
        cache(v){
            var options = this.options;
            options.cache = v;
            this.setTableOptions(options);
        }
    }
};
```