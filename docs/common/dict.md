# 字典

## 集中管理

---

由于字典的数据结构有特殊性，为方便组件使用字典，可将字典通过同步或异步的方式注入到组件库中，对于选项型组件以及表格数据转义提供 enum 支持。

## 字典项数据结构

---

```js
{
    type : '字典类型',
    text : '字典项显示',
    value : '字典项值',
    alias : '抽象别名'//用于在代码中书写
}

//例子
{
    type : 'GENDER',
    text : '男',
    value : '1',
    alias : 'MALE'//用于在代码中书写
},
{
    type : 'GENDER',
    text : '女',
    value : '2',
    alias : 'FEMALE'//用于在代码中书写
}
```

## 安装字典

---

支持装载多种数据结构的字典集合，可兼容不同系统下的字典。

```js
//安装方法
XUI.Dictionary.install(items, valuePlace, textPlace);

//****************  数组型  *****************
XUI.Dictionary.install([
	{
		type: "GENDER",
		text: "男",
		value: "1",
		alias: "MALE" //用于在代码中书写
	},
	{
		type: "GENDER",
		text: "女",
		value: "2",
		alias: "FEMALE" //用于在代码中书写
	}
]);

//valuePlace 和 textPlace 的使用
XUI.Dictionary.install(
	[
		{
			type: "GENDER",
			value: "男",
			key: "1",
			alias: "MALE"
		},
		{
			type: "GENDER",
			value: "女",
			key: "2",
			alias: "FEMALE"
		}
	],
	"key",
	"value"
);

//****************  对象型  *****************

XUI.Dictionary.install({
    GENDER : [{
        text: "男",
		value: "1",
		alias: "MALE"
    },{
        text: "女",
		value: "2",
		alias: "FEMALE"
    }]
}


XUI.Dictionary.install({
    GENDER : {
        "1": "男",
		"2": "女"
    }
}
```

## 安装字典请求方法

---

对于字典项较多的字典，提供异步加载机制

```js
//安装方法(checker用于匹配是否启用当前注册的requester ，requester用于请求字典数据)可安装多组checker-requester
XUI.Dictionary.installRemote(checker, requester);

//例子
var largeDictType = ["CITY", "COLOR"];
XUI.Dictionary.installRemote(
	function(type) {
		return largeDictType.indexOf(type) > 0;
	},
	function(type) {
		return new Promise(resolve => {
			//异步请求
		});
	}
);
```

::: warning
异步请求字典可工作于选项型组件，但对**数据表格**中的转码无效
:::
