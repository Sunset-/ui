# 表单项

在表单和搜索条件中，存在很多功能各异的表单项组件  
XUI 提供了将业务中的组件注册入组件库中的功能

#### 业务表单组件规范

---

1.  业务组件必须实现 **`v-model`** 和 **`disabled`** 的 props 属性
2.  业务组件应根据应用场景制定接口数据格式，拥有输出值和回显值的能力
3.  业务组件尽量适应更多业务场景，提供参数配置（而非对相似场景编写多个业务组件）

#### 注册方法

---

```js
import BusinessComponent from 'xxx';

//注册
XUI.Component.registFormField('business-field',BusinessComponent);

//使用
...
xuiFormOptions : {
    fields : [{
        label : '业务组件',
        name : 'xxx',
        widget : 'business-field'
    }]
}
...
```
