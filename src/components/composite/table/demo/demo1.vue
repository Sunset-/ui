<template>
    <div>
        <np-toolbar :options="toolbarOptions"></np-toolbar>
        <np-table key="a" v-if="!vflag" ref="table" :options="options" @checked="onChecked" @click-record="clickHandle">
            <np-table slot="subtable" slot-scope="props" ref="subtable" :ctx="props.parent" :options="subOptions" @checked="onChecked" @click-record="clickHandle">
            </np-table>
            <div slot="empty" style="padding:30px 0px;text-align:center;">
                无数据1232
            </div>
        </np-table>
        <np-table key="b" v-if="vflag" ref="table2" :options="subOptions" @checked="onChecked" @click-record="clickHandle">
        </np-table>

        <p>
            勾选：
            <br> {{JSON.stringify(checkedItems)}}
        </p>
    </div>
</template>

<script>
import hahaha from "./haha.vue";

var progress = 0;
var subprogress = 0;
export default {
    components: {
        hahaha
    },
    data() {
        return {
            vflag: false,
            flag: true,
            toolbarOptions: {
                tools: [
                    {
                        label: "设置静态数据",
                        color: "primary",
                        operate: () => {
                            var items = [];
                            for (var i = 0; i < 200; i++) {
                                items.push({
                                    name: i + 1,
                                    filesize: 8602340,
                                    timelength: 8886659
                                });
                            }
                            this.$refs.table.setData({
                                data: items,
                                totalCount: 500
                            });
                        }
                    },
                    {
                        label: "清空",
                        color: "danger",
                        operate: () => {
                            this.$refs.table.clear();
                        }
                    },
                    {
                        label: "搜索",
                        color: "info",
                        operate: () => {
                            this.$refs.table.search({
                                keyword: "一个搜索条件"
                            });
                        }
                    },
                    {
                        label: "刷新",
                        color: "info",
                        operate: () => {
                            this.$refs.table.refresh();
                        }
                    },
                    {
                        label: "重新渲染",
                        color: "info",
                        operate: () => {
                            setInterval(() => {
                                this.$refs.table.render();
                            }, 1000);
                        }
                    },
                    {
                        label: "重新渲染",
                        color: "info",
                        operate: () => {
                            this.vflag = !this.vflag;
                        }
                    },
                    {
                        label: "获取当前本地分页页数",
                        operate: () => {
                            alert(this.$refs.table.getCurrentLocalPageNumber());
                        }
                    }
                ]
            },
            checkedItems: null,
            options: {
                fixedHead: false,
                bodyHeight: 200,
                useIconFold: false,
                checked: {
                    key: "name"
                    // premise(item) {
                    // 	return +item.name > 3;
                    // }
                },
                pagerOptions: {
                    foldCount: 8
                },
                // loopRender: 1000,
                polling: 3000,
                columns: [
                    {
                        width: 100,
                        title: "姓名",
                        name: "name",
                        headAlign: "left",
                        align: "center",
                        style: "text-align:right;",
                        format(v) {
                            return `<div style="color:red;">${v}</div>`;
                        }
                    },
                    {
                        width: 200,
                        title: "性别",
                        name: "gender",
                        headAlign: "left",
                        enum: "SEX",
                        format(...rest) {
                            return Date.now(); //`<p title="${rest[rest.length - 1]}">${rest[rest.length - 1]}</p>`;
                        }
                    },
                    {
                        width: 100,
                        title: "年龄",
                        name: "age",
                        style: "text-align:center;",
                        format(v) {
                            return `<p title="${v}">${v}</p>`;
                        }
                    },
                    {
                        title: "文件大小",
                        name: "filesize",
                        format: "FILESIZE"
                    },
                    {
                        title: "时长",
                        name: "timelength",
                        format: "TIMELENGTH"
                    },
                    {
                        title: "操作栏",
                        style: "text-align:center;",
                        headToolbar: {
                            size: "mini",
                            tools: [
                                {
                                    label: "修改顺序",
                                    operate: () => {
                                        this.flag = !this.flag;
                                    }
                                },
                                {
                                    icon: "el-icon-location",
                                    style: "color:yellowgreen;",
                                    premise: () => {
                                        return this.flag;
                                    },
                                    operate: () => {
                                        this.flag = !this.flag;
                                    }
                                }
                            ]
                        },
                        toolbar: {
                            size: "mini",
                            tools: [
                                {
                                    title: "5555",
                                    widget: "select",
                                    style: "color:yellowgreen;",
                                    data() {
                                        debugger;
                                        return [{text:"a",value:"a"},{text:"b",value:"b"}]
                                    },
                                    operate: (record,a,b,c) => {
                                        debugger;
                                        return new Promise(() => {
                                            // throw new Error();
                                        });
                                    }
                                },
                                {
                                    title: "5555",
                                    type: "switch",
                                    style: "color:yellowgreen;",
                                    disabled(record) {
                                        return +record.name > 3;
                                    },
                                    operate: record => {
                                        return new Promise(() => {
                                            // throw new Error();
                                        });
                                    }
                                },
                                {
                                    title: "123",
                                    color: "success",
                                    icon: "el-icon-location",
                                    style: "color:yellowgreen;",
                                    operate: record => {
                                        alert(record.name);
                                    }
                                },
                                {
                                    label: "新增",
                                    color: "primary",
                                    icon: "el-icon-edit",
                                    visible: (record, index) => {
                                        return index != 0;
                                    },
                                    operate: record => {
                                        alert(9999);
                                        alert(record.name);
                                    }
                                },
                                {
                                    label: "修改",
                                    color: "warning",
                                    operate: record => {
                                        var $tables = this.$refs.subtable;
                                        debugger;
                                        alert(record.gender);
                                    }
                                }
                            ]
                        }
                    }
                ],
                children: true,
                expandSingle: true,
                pageNumberStart: 0,
                pageSize: 10,
                localPageSize: 10,
                format: {
                    list: "data",
                    count: "totalCount",
                    pageSize: "pageSize",
                    currentPage: "pageNumber"
                },
                // polling: 3000,
                datasource: filter => {
                    return this.loadData(filter);
                }
            },
            subOptions: {
                // loopRender: 500,
                pagerOptions: {
                    foldCount: 3
                },
                columns: [
                    {
                        title: "姓名33",
                        name: "name",
                        align: "center",
                        style: "width:200px;"
                    },
                    {
                        title: "年龄",
                        name: "age",
                        format() {
                            return Date.now();
                        }
                    },
                    {
                        title: "操作栏",
                        style: "width:220px;text-align:center;",
                        headToolbar: {
                            size: "mini",
                            tools: [
                                {
                                    label: "修改顺序",
                                    operate: () => {
                                        this.flag = !this.flag;
                                    }
                                },
                                {
                                    icon: "el-icon-location",
                                    style: "color:yellowgreen;",
                                    premise: () => {
                                        return this.flag;
                                    },
                                    operate: () => {
                                        this.flag = !this.flag;
                                    }
                                }
                            ]
                        },
                        toolbar: {
                            size: "mini",
                            tools: [
                                {
                                    title: "5555",
                                    type: "switch",
                                    style: "color:yellowgreen;",
                                    disabled(record) {
                                        return +record.name > 3;
                                    },
                                    operate: record => {
                                        return new Promise(() => {
                                            // throw new Error();
                                        });
                                    }
                                },
                                {
                                    title: "123",
                                    color: "success",
                                    icon: "el-icon-location",
                                    style: "color:yellowgreen;",
                                    operate: record => {
                                        alert(record.name);
                                    }
                                },
                                {
                                    label: "新增",
                                    color: "primary",
                                    icon: "el-icon-edit",
                                    visible: (record, index) => {
                                        return index != 0;
                                    },
                                    operate: record => {
                                        alert(9999);
                                        alert(record.name);
                                    }
                                },
                                {
                                    label: "修改",
                                    color: "warning",
                                    operate: record => {
                                        alert(record.gender);
                                    }
                                }
                            ]
                        }
                    }
                ],
                pageNumberStart: 0,
                pageSize: 5,
                localPageSize: 5,
                lazy: false,
                format: {
                    list: "",
                    count: "length",
                    pageSize: "pageSize",
                    currentPage: "pageNumber"
                },
                // polling: 1000,
                datasource: (filter, ctx) => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            subprogress++;
                            console.log(subprogress);
                            resolve([
                                {
                                    id: "1",
                                    name: ctx.name + "-1",
                                    age: 33 + subprogress
                                },
                                {
                                    id: "2",
                                    name: ctx.name + "-2",
                                    age: 33 + subprogress
                                }
                            ]);
                        }, 500);
                    });
                }
            }
        };
    },
    methods: {
        test() {},
        clickHandle(item) {
            // alert(item.name);
        },
        onChecked(checkedItems) {
            this.checkedItems = checkedItems;
        },
        search() {
            this.$refs.table.search({
                keyword: "一个搜索条件"
            });
        },
        refresh() {
            this.$refs.table.refresh();
        },
        setOptions() {
            this.$refs.table.setOptions({
                localPageSize: 3
            });
        },
        loadData(filter) {
            return new Promise(resolve => {
                setTimeout(() => {
                    progress++;
                    resolve({
                        totalCount: 15,
                        data: [
                            {},
                            {
                                id: "2",
                                name: "2",
                                gender: "1",
                                age: 33 + progress
                            },
                            {
                                id: "3",
                                name: "3",
                                gender: "1",
                                age: 33 + progress
                            },
                            {
                                id: "4",
                                name: "4",
                                gender: "0",
                                age: 33 + progress
                            },
                            {
                                id: "5",
                                name: "5",
                                gender: "0",
                                age: 33 + progress
                            }
                        ]
                    });
                }, 0);
            });
        }
    }
};
</script>