<template>
    <div>
        <np-cascader v-model="v" style="width:200px;" :options="options"></np-cascader>
        <input type="text" v-model="v">
        {{v}}
    </div>
</template>
<script>
export default {
    data() {
        return {
            v: "091743353157466135",
            v2: "",
            options: {
                key: {
                    value: "id",
                    text: "name",
                    parent: "parentId"
                },
                root: "0",
                level: false,
                onlyLeaf : true,
                data: () => [
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "09092755841442170777",
                        name: "未央区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "090927558414421707"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "09092755841442170766",
                        name: "未央区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "090927558414421707"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "09092755841442170755",
                        name: "未央区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "090927558414421707"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "09092755841442170744",
                        name: "未央区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "090927558414421707"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "09092755841442170733",
                        name: "未央区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "090927558414421707"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "09092755841442170722",
                        name: "未央区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "090927558414421707"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "09092755841442170711",
                        name: "未央区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "090927558414421707"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "090927558414421707",
                        name: "未央区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "090927558414421707"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "091108286918469402",
                        name: "鱼化寨街道",
                        parentId: "096342717982804829",
                        thirdId: "",
                        type: 1,
                        uid: "091108286918469402"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "091743353157466135",
                        name: "小寨路街道",
                        parentId: "096342717982804829",
                        thirdId: "",
                        type: 1,
                        uid: "091743353157466135"
                    },
                    {
                        accessType: 4,
                        areaCode: "111",
                        gbid: "222",
                        id: "095070850744170857",
                        name: "西安市",
                        parentId: "0",
                        thirdId: "",
                        type: 1,
                        uid: "095070850744170857"
                    },
                    {
                        accessType: 4,
                        areaCode: "111",
                        gbid: "222",
                        id: "0950708507441708578",
                        name: "西安市",
                        parentId: "0",
                        thirdId: "",
                        type: 1,
                        uid: "095070850744170857"
                    },
                    {
                        accessType: 4,
                        areaCode: "111",
                        gbid: "222",
                        id: "0950708507441708577",
                        name: "西安市",
                        parentId: "0",
                        thirdId: "",
                        type: 1,
                        uid: "095070850744170857"
                    },
                    {
                        accessType: 4,
                        areaCode: "111",
                        gbid: "222",
                        id: "0950708507441708576",
                        name: "西安市",
                        parentId: "0",
                        thirdId: "",
                        type: 1,
                        uid: "095070850744170857"
                    },
                    {
                        accessType: 4,
                        areaCode: "111",
                        gbid: "222",
                        id: "0950708507441708575",
                        name: "西安市",
                        parentId: "0",
                        thirdId: "",
                        type: 1,
                        uid: "095070850744170857"
                    },
                    {
                        accessType: 4,
                        areaCode: "111",
                        gbid: "222",
                        id: "0950708507441708574",
                        name: "西安市",
                        parentId: "0",
                        thirdId: "",
                        type: 1,
                        uid: "095070850744170857"
                    },
                    {
                        accessType: 4,
                        areaCode: "111",
                        gbid: "222",
                        id: "0950708507441708573",
                        name: "西安市",
                        parentId: "0",
                        thirdId: "",
                        type: 1,
                        uid: "095070850744170857"
                    },
                    {
                        accessType: 4,
                        areaCode: "111",
                        gbid: "222",
                        id: "0950708507441708572",
                        name: "西安市",
                        parentId: "0",
                        thirdId: "",
                        type: 1,
                        uid: "095070850744170857"
                    },
                    {
                        accessType: 4,
                        areaCode: "111",
                        gbid: "222",
                        id: "0950708507441708571",
                        name: "西安市",
                        parentId: "0",
                        thirdId: "",
                        type: 1,
                        uid: "095070850744170857"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "096342717982804829",
                        name: "雁塔区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "096342717982804829"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "096555630275557918",
                        name: "科技路街道",
                        parentId: "096342717982804829",
                        thirdId: "",
                        type: 1,
                        uid: "096555630275557918"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "097585440531137444",
                        name: "新城区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "097585440531137444"
                    },
                    {
                        accessType: 4,
                        areaCode: "",
                        gbid: "",
                        id: "098050598354635709",
                        name: "莲湖区",
                        parentId: "095070850744170857",
                        thirdId: "",
                        type: 1,
                        uid: "098050598354635709"
                    }
                ]
            }
        };
    }
};
</script>
