# 上传文件
> 组合file组件，实现可预览的上传文件  
> 可作为表单项组件(widget : fileuploader)，将上传结果序列化为字符串值  
> 支持自定义预览样式
---
#### 属性
---
| 属性名                  | 类型                    | 默认值                     | 描述                                           |
| :---------------------- | :---------------------: | :------------------------: | :--------------------------------------------- |
| v-model                 | ` String `              | 无                         | 组件值                                         |
| disabled                | ` Boolean `             | false                      | 是否禁用                                       |
| options                 | ` Object `              | 无                         | 配置对象，包含file组件的所有配置               |
| options.dom             | ` String `              | 无                         | 文件选择按钮dom，支持html                      |
| options.format          | ` Function(result) `    | 无                         | 上传成功后将后端返回数据格式化为**结果值**     |
| options.thumbnail       | ` Function(value) `     | 'date'                     | 缩略图src函数,根据**结果值**转换为**图片地址** |
| options.thumbnailStyle  | ` String / Object `     | {width:100px,height:100px} | 缩略图样式                                     |
| options.thumbnailRender | ` Function(src,value) ` | 无                         | 缩略图生成函数                                 |
| options.prepend         | ` Boolean `             | false                      | 上传按钮是否始终处于缩略图首位                 |
| options.tip             | ` String `              | 'date'                     | 提示信息                                       |
| options.spliter         | ` String `              | ','                        | 结果值分隔符                                   |
#### 事件
---
| 属性名 | 参数         | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |

#### 示例
---
<template>
  <div class="demo-container">
    <xui-fileuploader v-model="v" :options="options" @change="changeHandle"></xui-fileuploader>
    <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {    
            v:"a,b",
			options: {
                max: 5,
                prepend: true,
                url: "/gateway/uploadservice/upload/uploadVehicle",
                tip: "请上传jpg/jpeg/png图片",
                filter(f) {
                    return ~f.type.indexOf("image");
                },
                //服务器返回值转换为最终结果值
                format(data) {
                    return JSON.parse(data).data;
                },
                //上传异常
                onError(item){
                    //提示
                    console.log(`上传失败：${item.name}`);
                },
                //结果值转化为图片路径
                thumbnail(v) {
                    return `/vdtimg/${v}`;
                },
                //缩略图样式
                thumbnailStyle : "width:150px;height:150px;",
                //自定义缩略图
                thumbnailRender(v,a){
                    return `<img src="${v}" />`
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

``` html
<xui-fileuploader v-model="v" :options="options" @change="changeHandle"></xui-fileuploader>
<p>value : {{v}}</p>
```
``` js
export default {
    data(){
        return {    
            v:"a,b",
			options: {
                max: 5,
                prepend: true,
                url: "/gateway/uploadservice/upload/uploadVehicle",
                tip: "请上传jpg/jpeg/png图片",
                filter(f) {
                    return ~f.type.indexOf("image");
                },
                //服务器返回值转换为最终结果值
                format(data) {
                    return JSON.parse(data).data;
                },
                //上传异常
                onError(item){
                    //提示
                    console.log(`上传失败：${item.name}`);
                },
                //结果值转化为图片路径
                thumbnail(v) {
                    return `/vdtimg/${v}`;
                },
                //缩略图样式
                thumbnailStyle : "width:150px;height:150px;",
                //自定义缩略图
                thumbnailRender(v,a){
                    return `<img src="${v}" />`
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
```