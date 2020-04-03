# 滚动区域

> 自定义样式滚动条，支持自动监听内容变化，重置滚动条

## 属性

| 属性名         |       类型        | 默认值 | 描述                       |
| :------------- | :---------------: | :----: | :------------------------- |
| innerClassName |     `String`      | false  | 滚动条内容区自定义样式类名 |
| innerStyle     | `String / Object` |   无   | 滚动条内容区自定义样式     |
| options        |     `Object`      |   无   | 配置对象，可包含上述值     |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<style>
.scroll-container{
    height:300px;
    border:1px solid #ddd;
}
.scroll-container .scroll-content{
    padding:10px;
}
</style>
<template>
  <div class="demo-container">
        <xui-button color="primary" @click="flag=true">添加数据</xui-button>
		<xui-scroll ref="scroll" class="scroll-container">
			<div class="scroll-content">
				<p>1</p>
				<p>2</p>
				<p>3</p>
				<p>4</p>
				<p>5</p>
				<p>6</p>
				<p>7</p>
				<p>8</p>
				<p>9</p>
				<p>10</p>
				<template v-if="flag">
				    <p>11</p>
				    <p>12</p>
					<p>13</p>
					<p>14</p>
					<p>15</p>
					<p>16</p>
					<p>17</p>
					<p>18</p>
					<p>19</p>
					<p>20</p>
				</template>
			</div>
		</xui-scroll>
  </div>
</template>
<script>
export default {
   	data() {
		return {
			flag: false
		};
	}
}
</script>
</script>
