<template>
    <div>
        <np-switch v-model="flag"></np-switch>
        <np-filter ref="filter" :options="optionsOne" @filter="onFilter"></np-filter>
        <!-- <np-filter ref="filter" :options="options" @filter="onFilter"></np-filter> -->
        <p>{{result}}</p>
        <button type="button" @click="reset">重置</button>
        <button type="button" @click="reset2">重置2</button>
        <button type="button" @click="reset3">重置3</button>
    </div>
</template>

<script>
export default {
    mounted() {
        this.$refs.filter.reset({
            inputname : 555
        })
    },
    methods: {
        onFilter(filter, a) {
            console.log("SEARCH: ", filter);
            this.result = `${new Date().getTime()}搜索：${JSON.stringify(
                filter
            )}`;
        },
        reset() {
            this.$refs.filter.reset();
        },
        reset2() {
            this.$refs.filter.reset({
                inputname: "hidden"
            });
        },
        reset3() {
            this.optionsOne.fields[2].defaultIndex = 1;
        }
    },
    data() {
        return {
            groupVisible: true,
            result: "",
            flag: true,
            optionsOne: {
                cols: 2,
                lazy: false,
                widgetStyle: "min-width:230px",
                filterEmpty: true,
                cols: 3,
                onValidate(e, first) {
                    alert(first);
                },
                format: filter => {
                    // console.log("filter",filter.daterangename)
                },
                fields: [
                    {
                        label: "文本框1",
                        widget: "input",
                        name: "inputname",
                        default: "123",
                        changeFilter : true,
                        enterSearchFilter: true
                        // append: "点击发送",
                        // disabled: false,
                        // appendClick(v, options) {
                        // 	return +v + 1 + "";
                        // },
                        // validate: {
                        // 	required: true
                        // }
                    },
            //         {
            //             label: "分析类型",
            //             name: "analysisType",
            //             widget: "select",
            //             widgetStyle: "width:210px",
            //             default: "1",
            //             changeFilter: true,
            //             clearable: false,
            //             premise(model) {
            //                 return model.inputname != "hidden";
            //             },
            //             data: [
            //                 {
            //                     text: "全部",
            //                     value: ""
            //                 },
            //                 {
            //                     text: "常驻车辆",
            //                     value: "1"
            //                 },
            //                 {
            //                     text: "过境车辆",
            //                     value: "0"
            //                 }
            //             ]
            //         },
            //         {
            //             label: "日期框",
            //             widget: "datepicker",
            //             name: "datename",
            //             format: "yyyy-MM-dd HH",
            //             valueFormat: "timestamp",
            //             changeFilter: true,
            //             yearRange: [2008, 2019],
            //             default() {
            //                 return new Promise(resolve =>
            //                     resolve(
            //                         new Date(
            //                             new Date().getTime() - 10 * 86400000
            //                         )
            //                     )
            //                 );
            //             },
            //             view: "DATETIME",
            //             disabled: false
            //         },
            //         {
            //             label: "日期区间",
            //             name: "daterangename",
            //             widget: "daterange",
            //             startPlaceholder: "开始时间",
            //             endPlaceholder: "结束时间",
            //             type: "datetime",
            //             format: "yyyy-MM-dd hh:mm:ss",
            //             valueFormat: "timestamp",
            //             // defaultFirst: true,
            //             changeFilter: true,
            //             defaultIndex: 0,
            //             // default() {
            //             // 	return [Date.now()-86400000*3,Date.now()];
            //             // },
            //             premise() {
            //                 return true;
            //             },
            //             searchButton: {
            //                 color: "primary",
            //                 icon: "",
            //                 size: "",
            //                 label: "筛选",
            //                 disabled: ""
            //             },
            //             searchCallBack(val) {
            //                 // console.log(val);
            //             },
            //             shortcuts: [
            //                 {
            //                     label: "24小时",
            //                     value() {
            //                         var now = new Date();
            //                         return [
            //                             new Date(now.getTime() - 86400000),
            //                             now
            //                         ];
            //                     }
            //                 },
            //                 {
            //                     label: "近7天",
            //                     value() {
            //                         var now = new Date();
            //                         var start = new Date();
            //                         start.setDate(start.getDate() - 6);
            //                         start.setHours(0);
            //                         start.setMinutes(0);
            //                         start.setSeconds(0);
            //                         start.setUTCMilliseconds(0);
            //                         return [new Date(start), now];
            //                     }
            //                 },
            //                 {
            //                     label: "近30天",
            //                     value() {
            //                         var now = new Date();
            //                         var start = new Date();
            //                         start.setDate(start.getDate() - 30);
            //                         start.setHours(0);
            //                         start.setMinutes(0);
            //                         start.setSeconds(0);
            //                         start.setUTCMilliseconds(0);
            //                         return [new Date(start), now];
            //                     }
            //                 }
            //             ]
            //         },

            //         {
            //             label: "复选框",
            //             widget: "checkbox",
            //             name: "checkboxname",
            //             changeFilter: true,
            //             premise: () => {
            //                 return this.flag;
            //             },
            //             // default: true,
            //             default: "ps,tq",
            //             // rechange(v, oldV, model) {
            //             // 	if (v.indexOf("all") >= 0 && (!oldV || oldV.indexOf("all") < 0)) {
            //             // 		return "all";
            //             // 	} else if (oldV == "all" && v != "all") {
            //             // 		return v
            //             // 			.split(",")
            //             // 			.filter(item => item != "all")
            //             // 			.join(",");
            //             // 	}
            //             // 	return v;
            //             // },
            //             data: () => {
            //                 return new Promise(resolve => {
            //                     setTimeout(() => {
            //                         resolve([
            //                             {
            //                                 text: "全部",
            //                                 value: ""
            //                             },
            //                             {
            //                                 text: "踢球",
            //                                 value: "tq"
            //                             },
            //                             {
            //                                 text: "游泳",
            //                                 value: "yy"
            //                             },
            //                             {
            //                                 text: "爬山",
            //                                 value: "ps"
            //                             },
            //                             {
            //                                 text: "其他",
            //                                 value: "other"
            //                             }
            //                         ]);
            //                     }, 100);
            //                 });
            //             }
            //         },
            //         {
            //             label: "自定义选择",
            //             name: "customcheckername",
            //             widget: "customchecker",
            //             disabled: false,
            //             multiple: false,
            //             defaultFirst: true,
            //             template(item, active) {
            //                 return `<div style="width:20px;height:20px;border-radius:3px;margin-right:5px;background:${
            //                     item.value
            //                 };border:2px solid ${
            //                     active ? "orange" : "#777"
            //                 };"></div>`;
            //             },
            //             default: "",
            //             prependData: [
            //                 {
            //                     text: "全部1",
            //                     value: ""
            //                 }
            //             ],
            //             data: [
            //                 {
            //                     text: "红色",
            //                     value: "red"
            //                 },
            //                 {
            //                     text: "绿色",
            //                     value: "green"
            //                 },
            //                 {
            //                     text: "蓝色",
            //                     value: "blue"
            //                 },
            //                 {
            //                     text: "黄色",
            //                     value: "yellow"
            //                 }
            //             ]
            //         },
            //         {
            //             label: "树形下拉框",
            //             widget: "treeselect",
            //             placeholder: "请选择所属部门",
            //             monopolize: true,
            //             multiple: false,
            //             autoExpand: true,
            //             default: "2222",
            //             clearable: true,
            //             filter: true,
            //             name: "treeselectname",
            //             enum: "Org"
            //         }
            //     ],
            //     searchButton: {
            //         label: "查询123"
            //     },
            //     toolbar: [
            //         {
            //             label: "查询",
            //             color: "primary",
            //             style: "width: 270px;height:25px",
            //             signal: "SEARCH"
            //         },
            //         {
            //             label: "一键重置",
            //             color: "primary",
            //             style: "width: 135px;height:25px",
            //             signal: "RESET"
            //         }
            //     ]
            // },
            // options: {
            //     cols: 2,
            //     fields: [
            //         {
            //             label: "时间范围",
            //             widget: "daterange",
            //             name: "name",
            //             type: "datetime",
            //             format: "yyyy-MM-dd",
            //             valueformat: "timestamp",
            //             startPlaceholder: "开始时间",
            //             endPlaceholder: "结束时间",
            //             disabled: true
            //         },
            //         {
            //             label: "创建时间",
            //             widget: "daterange",
            //             type: "datetime",
            //             format: "yyyy-MM-dd hh:mm:ss",
            //             valueFormat: "timestamp",
            //             startPlaceholder: "开始时间",
            //             defaultFirst: true,
            //             endPlaceholder: "结束时间",
            //             name: "create_time",
            //             shortcuts: [
            //                 {
            //                     label: "24小时",
            //                     value() {
            //                         var now = new Date();
            //                         return [
            //                             new Date(now.getTime() - 86400000),
            //                             now
            //                         ];
            //                     }
            //                 },
            //                 {
            //                     label: "近7天",
            //                     value() {
            //                         var now = new Date();
            //                         var start = new Date();
            //                         start.setDate(start.getDate() - 6);
            //                         start.setHours(0);
            //                         start.setMinutes(0);
            //                         start.setSeconds(0);
            //                         start.setUTCMilliseconds(0);
            //                         return [new Date(start), now];
            //                     }
            //                 },
            //                 {
            //                     label: "近30天",
            //                     value() {
            //                         var now = new Date();
            //                         var start = new Date();
            //                         start.setDate(start.getDate() - 30);
            //                         start.setHours(0);
            //                         start.setMinutes(0);
            //                         start.setSeconds(0);
            //                         start.setUTCMilliseconds(0);
            //                         return [new Date(start), now];
            //                     }
            //                 }
            //             ],
            //             changeFilter: true
            //         },
            //         {
            //             label: "性别",
            //             widget: "datepicker",
            //             type: "datetime",
            //             name: "sex",
            //             changeFilter: true,
            //             enum: "SEX"
            //         },
            //         {
            //             label: "车牌颜色",
            //             name: "plateColor",
            //             widget: "color",
            //             defaultFirst: true,
            //             default: "blue,yellow",
            //             changeFilter: true,
            //             multiple: true,
            //             newline: true,
            //             template(item, active) {
            //                 return `<div style="width:20px;height:20px;border-radius:3px;margin-right:5px;background:${
            //                     item.value
            //                 };border:2px solid ${
            //                     active ? "orange" : "#777"
            //                 };"></div>`;
            //             },
            //             data: [
            //                 {
            //                     text: "红色",
            //                     value: "red"
            //                 },
            //                 {
            //                     text: "绿色",
            //                     value: "green"
            //                 },
            //                 {
            //                     text: "蓝色",
            //                     value: "blue"
            //                 },
            //                 {
            //                     text: "黄色",
            //                     value: "yellow"
            //                 }
            //             ]
            //         },
            //         {
            //             label: "性别复选",
            //             widget: "radio",
            //             name: "sss",
            //             disabled: true,
            //             type: "button",
            //             changeFilter: true,
            //             enum: "SEX"
            //         }
                ],
                searchButton: {
                    label: "搜索"
                },
                format(filter) {
                    filter.attachment = "我是附加属性";
                }
            }
        };
    }
};
</script>
