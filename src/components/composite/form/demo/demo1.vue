<template>
  <div>
    <span style="font-size:12px">form-validate:{{formValid}}</span>
    <np-switch :options="{}" v-model="isView"></np-switch>
    <np-form
      ref="form"
      :view="isView"
      :options="options"
      @submit="submitHandle"
      @validate="onError"
      @modelchange="modelchange"
    ></np-form>
    <p>{{result}}</p>
    <np-button type="button" @click="reset">重置</np-button>
    <np-button type="button" @click="reset2">重置2</np-button>
    <np-button type="button" @click="submitHandle">提交</np-button>
    <div style="height:200px"></div>
  </div>
</template>

<script>
export default {
  methods: {
    onError(errs) {
      alert(JSON.stringify(errs));
    },
    submitHandle(model) {
      $.ajax({
        url: "aaa",
        type: "POST",
        data: model
      });
      this.result = `${new Date().getTime()}表单提交：${JSON.stringify(model)}`;
      this.$refs.form
        .getValidateModel()
        .then(models => {})
        .catch(e => {});
    },
    reset() {
      this.$refs.form.reset();
    },
    reset2() {
      this.$refs.form.reset({
        safeIp: " ",
        inputname: "123"
      });
    },
    modelchange() {
      this.formValid = this.$refs.form.validate();
    }
  },
  data() {
    return {
      formValid: false,
      isView: false,
      result: "",
      options: {
        cols: 2,
        blurValidate: true,
        fields: [
          {
            name : "testHidden",
            widget : "static",
            value : "123",
            visible : true
          },
          {
            label: "文本框",
            widget: "input",
            name: "inputname",
            default: "55",
            valueFormat(a) {
              return 3;
            },
            watch: [
              "selectname,radioname",
              (model, options) => {
                options.label = model.radioname + "文本框";
              }
            ],
            monopolize: true,
            tip: ctx => {
              return "<div>提示：请正确输入</div>";
            },
            widgetStyle: "width:200px",
            tipStyle: "min-width:200px;",
            validate: {
              func: {
                rule(v) {
                  return v.length < 10;
                },
                message: "222"
              }
            }
          },
          {
            label: "开始时间",
            widget: "datepicker",
            name: "BeginTime",
            type: "datetime",
            newline: true,
            placeholder: "开始时间",
            format: "yyyy-MM-dd HH:mm:ss",
            changeFilter: 150,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            disabledDate: (time, model) => {
              if (this.$refs.form.getModel()) {
                return time.getTime() > this.$refs.form.getModel().EndTime;
              } else {
                return time.getTime() > Date.now();
              }
            },
            validate: {
              required: false
            }
          },
          {
            label: "结束时间",
            widget: "datepicker",
            name: "EndTime",
            type: "datetime",
            placeholder: "结束时间",
            format: "yyyy-MM-dd HH:mm:ss",
            changeFilter: 150,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            disabledDate: (time, model) => {
              if (this.$refs.form.getModel()) {
                return (
                  this.$refs.form.getModel().EndTime - 86400000 >
                    time.getTime() || time.getTime() > Date.now()
                );
              } else {
                return time.getTime() > Date.now();
              }
            },
            validate: {
              required: false
            },
            watch: [
              "BeginTime,EndTime",
              function(model, options) {
                if (model.EndTime < model.BeginTime) {
                  $tip("结束时间不能小于开始时间！", "warning");
                  model.EndTime = model.BeginTime;
                }
              }
            ]
          },
          {
            label: "输入框",
            name: "input_1",
            widget: "input",
            placeholder: "请输入信息",
            newline: true,
            appendClick() {}
          },
          {
            label: "输入框",
            name: "input_2",
            widget: "input",
            placeholder: "请输入信息",
            newline: true,
            appendClick() {}
          },
          {
            label: "下拉一",
            name: "select1",
            widget: "select",
            data: [
              {
                text: "1",
                value: "1"
              },
              {
                text: "2",
                value: "2"
              },
              {
                text: "3",
                value: "3"
              }
            ]
          },
          {
            label: "下拉二",
            name: "select2",
            widget: "select",
            data: [],
            watch: [
              "select1",
              (model, options) => {
                return Promise.resolve(
                  [1, 2, 3].map(v => {
                    return {
                      text: `${model.select1}_${v}`,
                      value: `${model.select1}_${v}`
                    };
                  })
                ).then(res => {
                  options.data = res;
                  model.select2 = void 0;
                });
              }
            ]
          },
          {
            label: "输入框",
            widget: "input",
            placeholder: "请输入信息",
            append: "点击",
            newline: true,
            appendClick() {}
          },
          {
            label: "日期框",
            widget: "fileuploader",
            name: "fileuploader",
            url: "/123",
            validate: {
              func: {
                rule(v) {
                  alert(1);
                  return false;
                },
                message: "错误"
              }
            }
          },
          {
            label: "IP地址",
            name: "safeIp",
            widget: "ip",
            default: "192.168.60.126"
          },
          {
            label: "日期开关",
            widget: "switch",
            name: "sss",
            placeholder: "请输入时间",
            premise(m) {
              return m.inputname != "123";
            }
          },
          {
            label: "日期框",
            widget: "datepicker",
            name: "datename",
            placeholder: "请输入时间123",
            default() {
              return Date.now();
            },
            valueFormat: "timestamp"
          },
          {
            group: "ggg",
            groupVisible: true,
            label: "日期区间",
            name: "daterangename",
            fieldClass: "xxxx",
            manner: "all",
            widget: "daterange",
            startPlaceholder: "开始时间",
            endPlaceholder: "结束时间",
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "timestamp",
            defaultFirst: true,
            cols: false,
            searchButton: {
              color: "primary",
              icon: "",
              size: "",
              label: "筛选",
              disabled: ""
            },
            searchCallBack(val) {
              console.log(val);
            },
            shortcuts: [
              {
                label: "24小时",
                value() {
                  var now = new Date();
                  return [new Date(now.getTime() - 86400000), now];
                }
              },
              {
                label: "近7天",
                value() {
                  var now = new Date();
                  var start = new Date();
                  start.setDate(start.getDate() - 6);
                  start.setHours(0);
                  start.setMinutes(0);
                  start.setSeconds(0);
                  start.setUTCMilliseconds(0);
                  return [new Date(start), now];
                }
              },
              {
                label: "近30天",
                value() {
                  var now = new Date();
                  var start = new Date();
                  start.setDate(start.getDate() - 30);
                  start.setHours(0);
                  start.setMinutes(0);
                  start.setSeconds(0);
                  start.setUTCMilliseconds(0);
                  return [new Date(start), now];
                }
              }
            ]
          },
          {
            label: "下拉框",
            cols: false,
            widget: "select",
            name: "selectname",
            default: "1",
            data: [
              {
                text: "超级管理员",
                value: "0"
              },
              {
                text: "管理员",
                value: "1"
              },
              {
                text: "普通用户",
                value: "3"
              }
            ],
            premise(m) {
              return m.select1 == "1";
            }
          },
          {
            label: "单选框",
            widget: "radio",
            name: "radioname",
            cols: false,
            defaultIndex: 1,
            data: [
              {
                text: "男",
                value: "MALE"
              },
              {
                text: "女",
                value: "FEMALE"
              },
              {
                text: "未知",
                value: "UNKNOW"
              }
            ]
          },
          {
            label: "复选框",
            widget: "checkbox",
            name: "checkboxname",
            default: "yy,ps",
            data: [
              {
                text: "全部",
                value: "all"
              },
              {
                text: "踢球",
                value: "tq"
              },
              {
                text: "游泳",
                value: "yy"
              },
              {
                text: "爬山",
                value: "ps"
              },
              {
                text: "其他",
                value: "other"
              }
            ],
            premise(m) {
              return m.radioname == "MALE";
            }
          }
          // {
          //     label: "自定义选择",
          //     name: "customcheckername",
          //     widget: "customchecker",
          //     disabled: false,
          //     multiple: false,
          //     defaultFirst: true,
          //     template(item, active) {
          //         return `<div style="width:20px;height:20px;border-radius:3px;margin-right:5px;background:${
          //             item.value
          //         };border:2px solid ${
          //             active ? "orange" : "#777"
          //         };"></div>`;
          //     },
          //     default: "",

          //     prependData: [
          //         {
          //             text: "全部1",
          //             value: ""
          //         }
          //     ],
          //     data: [
          //         {
          //             text: "红色",
          //             value: "red"
          //         },
          //         {
          //             text: "绿色",
          //             value: "green"
          //         },
          //         {
          //             text: "蓝色",
          //             value: "blue"
          //         },
          //         {
          //             text: "黄色",
          //             value: "yellow"
          //         }
          //     ]
          // },
          // {
          //     label: "树形下拉框",
          //     widget: "treeselect",
          //     placeholder: "请选择所属部门",
          //     monopolize: true,
          //     multiple: false,
          //     autoExpand: true,
          //     default: "2222",
          //     clearable: true,
          //     filter: true,
          //     name: "treeselectname",
          //     enum: "Org"
          // }
        ],
        lazy: true,
        toolbar: [
          {
            label: "提交",
            color: "success",
            signal: "SUBMIT"
          },
          {
            label: "自定义操作",
            color: "primary",
            operate(m) {
              alert(JSON.stringify(m));
            }
          }
        ],
        view: true,
        validate(M) {},
        format(model) {
          model.attachment = "我是附加属性";
        }
      }
    };
  }
};
</script>
<style lang="less">
.xui-field-widget.invalid:after {
  content: " (" attr(validate-msg) ")";
  font-size: 12px;
}
</style>