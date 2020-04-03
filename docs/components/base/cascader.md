# 级联选择框

---

## 属性

---

| 属性名              |   类型    |  默认值  | 描述                                                                                   |
| :------------------ | :-------: | :------: | :------------------------------------------------------------------------------------- |
| v-model             | `String`  |    无    | 组件值                                                                                 |
| disabled            | `Boolean` |  false   | 是否禁用                                                                               |
| options             | `Object`  |    无    | 配置对象                                                                               |
| options.placeholder | `String`  |    无    | 输入提示                                                                               |
| options.clearable   | `Boolean` |   true   | 可清空单选                                                                             |
| options.root        | `String`  |    无    | 根节点父 id                                                                            |
| options.key         | `Object`  |    无    | 节点属性映射                                                                           |
| options.key.parent  | `String`  | 'parent' | 节点父 id 属性                                                                         |
| options.key.text    | `String`  |  'text'  | 节点显示文本属性                                                                       |
| options.key.value   | `String`  | 'value'  | 节点值属性                                                                             |
| options.data        | `String`  |    无    | 枚举项<br>数组 [{text : text1,value : value1}]<br>对象 {value1 : text1,value2 : text2} |
| options.level       | `Boolean` |   true   | 输出值是否带层级，false 时仅输出叶子项值                                               |
| options.spliter     | `String`  |   ','    | 多选时，多值拼接分隔符，默认逗号                                                       |

## 事件

---

| 属性名 |     参数     | 描述       |
| :----: | :----------: | :--------- |
| change | value-当前值 | 值变更事件 |  |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">

<template>
  <div class="demo-container">
		<xui-cascader style="width:200px;" v-model="v" :options="options"></xui-cascader>
		<p><input v-model="v" /></p>
		<p>value : {{v}}</p>
  </div>
</template>
<script>
export default {
    data(){
        return {  
            v:'091108286918469402',
			options: {
                placeholder : "请选择区域",
                key: {
                    value: "value",
                    text: "text",
                    parent: "parent"
                },
                root: "0",
                data: ()=>Promise.resolve([
                    {
                        text: "text-1",
                        value: "value-1",
                        parent: "0"
                    },
                    {
                        text: "text-2",
                        value: "value-2",
                        parent: "0"
                    },
                    {
                        text: "text-1-1",
                        value: "value-1-1",
                        parent: "value-1"
                    },
                    {
                        text: "text-1-2",
                        value: "value-1-2",
                        parent: "value-1"
                    },
                    {
                        text: "text-2-1",
                        value: "value-2-1",
                        parent: "value-2"
                    },
                    {
                        text: "text-1-1-1",
                        value: "value-1-1-1",
                        parent: "value-1-1"
                    },
                    {
                        text: "text-1-1-2",
                        value: "value-1-1-2",
                        parent: "value-1-1"
                    },
                    {
                        text: "text-1-1-3",
                        value: "value-1-1-3",
                        parent: "value-1-1"
                    },
                    {
                        text: "text-1-1-4",
                        value: "value-1-1-4",
                        parent: "value-1-1"
                    },
                    {
                        text: "text-1-1-5",
                        value: "value-1-1-5",
                        parent: "value-1-1"
                    },
                    {
                        text: "text-1-1-6",
                        value: "value-1-1-6",
                        parent: "value-1-1"
                    },
                    {
                        text: "text-1-1-7",
                        value: "value-1-1-7",
                        parent: "value-1-1"
                    },
                    {
                        text: "text-1-1-8",
                        value: "value-1-1-8",
                        parent: "value-1-1"
                    }
                ])
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
