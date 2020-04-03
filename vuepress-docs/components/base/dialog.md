# 弹窗
> 鱼骨时间轴，可自定义节点内容及时间轴样式
---
#### 插槽
---
| 插槽名  | 插槽作用域属性                                                  | 描述         |
| :-----: | :-------------------------------------------------------------- | :----------- |
| default | opened:弹窗打开过，首次打开后始终为true，配合v-if用于懒加载内容 | 主体内容模板 |

#### 属性
---
| 属性名    | 类型        | 默认值 | 描述                            |
| :-------- | :---------: | :----: | :------------------------------ |
| title     | ` String `  | 无     | 弹窗显示名称                    |
| top       | ` Number `  | 0      | 弹窗距离顶部的距离 top值(默认0) |
| animate   | ` Boolean ` | true   | 是否使用动画弹出,默认开启       |
| closeable | ` Boolean ` | true   | 是否可通过右上角关闭窗口        |
| options   | ` Object `  | 无     | 包含上述所有属性                |

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
    <xui-button color="success" @click="open()">打开</xui-button>
    <xui-dialog ref="dialog" title="我是标题" :top="50" @opened="opened" @closed="closed">
        <template slot-scope="props">
            是否打开过：{{props.opened}}
            <xui-button color="danger" @click="close">关闭</xui-button>
        </template>
    </xui-dialog>
  </div>
</template>

<script>
export default {
	data() {
		return {
			isShow: false,
			dialogOptions: {
				title: "我是标题",
				top: 50,
				animate: true,
				closeable: true
			}
		};
	},
	methods: {
		open(val) {
			this.$refs.dialog.open();
		},
		close() {
			this.$refs.dialog.close();
		},
		opened() {
			console.log("打开了");
		},
		closed() {
			console.log("关闭了");
		}
	}
};
</script>
<style>
</style>
``` html
<xui-button color="success" @click="open()">打开</xui-button>
<xui-dialog ref="dialog" title="我是标题" :top="50" @opened="opened" @closed="closed">
    <template slot-scope="props">
        是否打开过：{{props.opened}}
        <xui-button color="danger" @click="close">关闭</xui-button>
    </template>
</xui-dialog>
```
``` js
export default {
	data() {
		return {
			isShow: false,
			dialogOptions: {
				title: "我是标题",
				top: 50,
				animate: true,
				closeable: true
			}
		};
	},
	methods: {
		open(val) {
			this.$refs.dialog.open();
		},
		close() {
			this.$refs.dialog.close();
		},
		opened() {
			console.log("打开了");
		},
		closed() {
			console.log("关闭了");
		}
	}
};
```