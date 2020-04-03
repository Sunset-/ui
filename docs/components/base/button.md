# 按钮

> 提供语义化的按钮配置,同时支持 Options 和展开的 props 配置

## 插槽

| 插槽名  | 描述                            |
| :-----: | :------------------------------ |
| default | 按钮文本，会覆盖 label 属性配置 |

## 属性

| 属性名   |   类型    | 默认值 | 描述                                                                     |
| :------- | :-------: | :----: | :----------------------------------------------------------------------- |
| label    | `String`  |   无   | 按钮文本                                                                 |
| icon     | `String`  |   无   | 图标 class                                                               |
| color    | `String`  |   无   | 语义颜色:primary、success、danger、warning<br>可扩展:**.xui-btn-颜色名** |
| size     | `String`  | normal | 尺寸:mini,small,normal,big,large<br>可扩展:**.xui-btn-尺寸名**           |
| disabled | `Boolean` | false  | 是否禁用                                                                 |
| options  | `Object`  |   无   | 可将上述属性组合成一个对象传入                                           |

## 事件

| 属性名 | 参数 | 描述     |
| :----- | :--: | :------- |
| click  |  无  | 点击事件 |  |

## 游乐场

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
  <template>
    <div class="aaa">
        <xui-button @click="clickHandle">按钮</xui-button>
        <xui-button @click="clickHandle" :disabled="true">禁用</xui-button>
        <xui-button color="success" icon="xui-icon xui-icon-favoritesfilling">success</xui-button>
        <xui-button color="primary" icon="xui-icon xui-icon-add">primary</xui-button>
        <xui-button color="warning">warning</xui-button>
        <xui-button color="danger">danger</xui-button>
        <xui-button size="mini">mini</xui-button>
        <xui-button size="big">big</xui-button>
        <xui-button :options="options" />
    </div>
  </template>

  <script>
    module.exports = {
        data(){
            return {
                options :{
                    label : 'options11',
                    color : 'success'
                }
            }
        },
        methods : {
            clickHandle(){
                alert(123);
            }
        }
    }
  </script>
</script>
