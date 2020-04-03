# 表单校验

针对表单，提供了声明式的表单校验  
可自定义规则，校验规则集中管理

## 内置校验规则

---

1.  required 必填 （添加此校验规则后会自动给表单的 label 加上红色星号）
2.  maxlength 最大长度 （添加此校验规则后会自动给 input,textarea 添加 maxlength 属性）
3.  regexp 正则 （建议仅针对复用性极低的正则表达式采用此规则，尽量使用全局注册来复用正则校验）
4.  func 函数

## 全局注册校验规则

---

```js
XUI.Validator.regist("email", {
	//校验未通过的提示信息，支持String和Function(value)
	message: function(value) {
		return "邮箱格式不合法";
	},
	//校验方法，返回true/false，true表示校验通过
	check: function(val) {
		return !val||
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				val
			)
		);
	}
});
```

## 表单中使用校验

---

```js
...
xuiFormOptions : {
    fields : [{
        label : '用户名',
        name : 'username',
        widget : 'input',
        validate : {
            required : true//必填
        }
    },{
        label : '密码',
        name : 'password',
        widget : 'input',
        validate : {
            required : true,
            password : true//业务校验规则
        }
    },{
        label : 'ICK编号',
        name : 'password',
        widget : 'input',
        validate : {
            regexp : {//正则型
                rule : /^[1-9][0-9]{4}$/,
                message : 'ICK编号格式不正确'
            }
        }
    },{
        label : '等级',
        name : 'password',
        widget : 'input',
        validate : {
            func : {//函数型
                rule : function(v){
                    return !isNaN(v);
                },
                message : '等级格式不正确'
            }
        }
    }]
}
...
```
