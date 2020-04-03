# 自定义单选复选框

> 可自定义选项样式，可实现单选复选

## 属性

| 属性名           |            类型             | 默认值 | 描述                                                                                   |
| :--------------- | :-------------------------: | :----: | :------------------------------------------------------------------------------------- |
| v-model          |          `String`           |   无   | 组件值                                                                                 |
| disabled         |          `Boolean`          | false  | 是否禁用                                                                               |
| options          |          `Object`           |   无   | 配置对象                                                                               |
| options.multiple |          `Boolean`          | false  | 是否多选                                                                               |
| options.template | `Function(item,isSelected)` |   无   | 选项模板函数，返回 html                                                                |
| options.enum     |          `String`           |   无   | 枚举字典类型                                                                           |
| options.data     |          `String`           |   无   | 枚举项<br>数组 [{text : text1,value : value1}]<br>对象 {value1 : text1,value2 : text2} |

## 事件

| 属性名 |     参数     | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">

<template>
  <div class="demo-container">
    <xui-customchecker ref="customchecker" v-model="v" :options="options" @change="changeHandle"></xui-customchecker>
    <p>value : {{v}}</p>
  </div>
</template>

<script>
export default {
	methods: {
		clear() {
			this.$refs.radio.clear();
		},
		changeHandle(v) {
            console.log(v)
        }
	},
	data() {
		return {
			v: "#8fc31f,#40a4ff",
			options: {
				multiple: true,
				template(item, active) {
                    return `
                    <div
                    style="width:20px;
                    height:20px;
                    border-radius:3px;
                    margin-right:5px;
                    background:${item.value};
                    border:2px solid ${active ? "orange" : "#bdbdbd"
                    };"></div>`;
				},
				data: [
					{
						text: "红色",
						value: "#ff4949"
					},
					{
						text: "绿色",
						value: "#8fc31f"
					},
					{
						text: "蓝色",
						value: "#40a4ff"
					},
					{
						text: "白色",
						value: "#FFF"
					}
				]
			}
		};
	}
};
</script>
</script>
