# 模态窗
> 遮罩弹窗，支持标题尺寸自定义，插槽自定义弹窗内容区及底部操作栏区
---
#### 插槽
---
| 插槽名  | 插槽作用域属性                                                  | 描述         |
| :-----: | :-------------------------------------------------------------- | :----------- |
| default | opened:弹窗打开过，首次打开后始终为true，配合v-if用于懒加载内容 | 主体内容模板 |
| content | 同default                                                       | 同default    |
| footer  | 同default                                                       | 底部内容模板 |

#### 属性
---
| 属性名     | 类型        | 默认值 | 描述                          |
| :--------- | :---------: | :----: | :---------------------------- |
| title      | ` String `  | 无     | 标题，支持html                |
| top        | ` Number `  | 100    | 主框体距顶部距离，默认为100px |
| width      | ` Number `  | 无     | 主框体宽度，默认为自适应      |
| mask-close | ` Boolean ` | true   | 点击遮罩是否关闭模态窗        |
| options    | ` Object `  | 无     | 配置对象，可包含上述值        |

#### 方法
---
| 方法名 | 参数  | 返回值 | 描述     |
| :----- | :---: | :----- | :------- |
| open   | 无    | 无     | 打开弹窗 |
| close  | 无    | 无     | 关闭弹窗 |

#### 事件
---
| 属性名 | 参数 | 描述         |
| :----- | :--- | :----------- |
| opened | 无   | 弹窗打开事件 |
| closed | 无   | 弹窗关闭事件 |

#### 示例
---
<template>
  <div class="demo-container">
    <xui-button color="primary" @click="open">打开</xui-button>
    <xui-modal ref="modal" title="标题" @opened="tip('opened')" @closed="tip('closed')">
        <template slot-scope="props">
            <div v-if="props.opened" style="width:500px;height:300px;padding:20px;">
                开始日期：<xui-datepicker></xui-datepicker>
            </div>
        </template>
        <div slot="footer" style="padding:10px;text-align:center;">
            <xui-button color="success">保存</xui-button>&nbsp;&nbsp;
            <xui-button color="normal" @click="close">取消</xui-button>
        </div>
    </xui-modal>
  </div>
</template>

<script>
export default {
	methods: {
		open: function() {
			this.$refs.modal.open();
		},
		close: function() {
			this.$refs.modal.close();
		},
		tip: function(msg) {
			console.log(msg);
		}
	}
};
</script>
<style>
</style>
``` html
<xui-button color="primary" @click="open">打开</xui-button>
<xui-modal ref="modal" title="标题" @opened="tip('opened')" @closed="tip('closed')">
    <template slot-scope="props">
        <div v-if="props.opened" style="width:500px;height:300px;padding:20px;">
            开始日期：<xui-datepicker></xui-datepicker>
        </div>
    </template>
    <div slot="footer" style="padding:10px;text-align:center;">
        <xui-button color="success">保存</xui-button>&nbsp;&nbsp;
        <xui-button color="normal" @click="close">取消</xui-button>
    </div>
</xui-modal>
```
``` js
export default {
	methods: {
		open: function() {
			this.$refs.modal.open();
		},
		close: function() {
			this.$refs.modal.close();
		},
		tip: function(msg) {
			console.log(msg);
		}
	}
};
```