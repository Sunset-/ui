<template>
  <div>
    <np-cascade-select :options="options" v-model="defaultValue" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: {
        fieldMap: {
          key: "name",
          value: "num"
        },
        datasource(parent) {
          return new Promise(resolve => {
            let result = [];
            if (parent == "ROOT") {
              result = [
                { name: "陕西省", num: "1" },
                { name: "山西省", num: "2" },
                { name: "江苏省", num: "3" },
                { name: "广东省", num: "4" },
                { name: "湖南省", num: "5" },
                { name: "湖北省", num: "6" }
              ];
            }
            if (parent == "1") {
              result = [
                { name: "西安市", num: "10" },
                { name: "商洛市", num: "11" },
                { name: "咸阳市", num: "12" },
                { name: "安康市", num: "13" },
                { name: "汉中市", num: "14" }
              ];
            }
            if (parent == "2") {
              result = [
                { name: "太原市", num: "20" },
                { name: "晋中市", num: "21" }
              ];
            }
            if (parent == "3") {
              result = [
                { name: "南京市", num: "30" },
                { name: "无锡市", num: "31" },
                { name: "常州市", num: "32" }
              ];
            }
            if (parent == "10") {
              result = [
                { name: "碑林区", num: "100" },
                { name: "雁塔区", num: "101" },
                { name: "高新区", num: "102" }
              ];
            }
            if (parent == "11") {
              result = [
                { name: "莲湖区", num: "111" },
                { name: "铲灞区", num: "112" },
                { name: "未央区", num: "113" }
              ];
            }
            resolve(result);
          });
        },
        items: [
          {
            label: "省",
            name: "province"
            // datasource(parent) {
            //   console.log(1);
            //   return new Promise((resolve, reject) => {
            //     resolve([
            //       { name: "陕西省", num: "1" },
            //       { name: "山西省", num: "2" },
            //       { name: "江苏省", num: "3" },
            //       { name: "广东省", num: "4" },
            //       { name: "湖南省", num: "5" },
            //       { name: "湖北省", num: "6" }
            //     ]);
            //   });
            // }
          },
          {
            label: "市",
            name: "city"
            // datasource(parent) {
            //   console.log(2);
            //   return new Promise(resolve => {
            //     let result = [];
            //     if (parent == "1") {
            //       result = [
            //         { name: "西安市", num: "10" },
            //         { name: "商洛市", num: "11" },
            //         { name: "咸阳市", num: "12" },
            //         { name: "安康市", num: "13" },
            //         { name: "汉中市", num: "14" }
            //       ];
            //     }
            //     if (parent == "2") {
            //       result = [
            //         { name: "太原市", num: "10" },
            //         { name: "晋中市", num: "11" }
            //       ];
            //     }
            //     if (parent == "3") {
            //       result = [
            //         { name: "南京市", num: "10" },
            //         { name: "无锡市", num: "11" },
            //         { name: "常州市", num: "12" }
            //       ];
            //     }
            //     resolve(result);
            //   });
            // }
          },
          {
            label: "区县",
            name: "region"
            // datasource(parentValue) {
            //   console.log(3);
            //   return new Promise(resolve => {
            //     let result = [];
            //     if (parentValue == "10") {
            //       result = [
            //         { name: "碑林区", num: "100" },
            //         { name: "雁塔区", num: "101" },
            //         { name: "高新区", num: "102" }
            //       ];
            //     }
            //     if (parentValue == "11") {
            //       result = [
            //         { name: "莲湖区", num: "111" },
            //         { name: "铲灞区", num: "112" },
            //         { name: "未央区", num: "113" }
            //       ];
            //     }
            //     resolve(result);
            //   });
            // }
          }
        ]
      },
      defaultValue: {
        province: "2",
        city: "21",
        region: null
      }
    };
  }
};
</script>
