<template>
  <div class="cascading-select-container">
    <span v-for="(item,index) in items" :key="index" class="cascading-select-item">
      <span v-show="item.label" class="cascading-select-label">{{item.label}}</span>
      <np-select v-model="safeValue[item.name]" :options="opts[index]||{data:[]}" :ref="'select_'+index" @change="(value)=>{handleChange(item,index)}" :placeholder="item.placeholder||''"/>
    </span>
  </div>
</template>
<script>
import NpSelect from "../../base/select/";
export default {
  name: "CascadeSelect",
  data() {
    return {
      safeValue: {},
      currentChangeIndex: 0,
      opts: [],
      cache: {}
    };
  },
  components: {
    NpSelect
  },
  props: {
    options: {
      type: Object,
      default() {
        return {
          fieldMap: null,
          items: [
            {
              name: ""
            }
          ]
        };
      }
    },
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.safeValue = newValue;
        for(let i in newValue) {
          if(newValue.hasOwnProperty(i)) {
            let _item = this.items.find(one=>one.name==i);
            if(_item) {
              this.$set(_item,"data",[]);
            }
          }
        }
      }
    }
  },
  computed: {
    items() {
      return this.options.items;
    }
  },
  created() {
    this.items.forEach((item,index)=>{
      this.setItemData(index);
    })
  },
  methods: {
    generatorOutput() {
      return this.safeValue;
    },
    handleChange(item, index) {
      this.currentChangeIndex = index;
      this.items.forEach((item, _index) => {
        if (_index > index) {
          this.safeValue[item.name] = null;
        }
      });
      const output = {...this.generatorOutput()};
      this.$emit("input", output);
      this.$emit("change", output);
      console.log(Object.values(output));
      if (index < this.items.length - 1) {
        let nextIndex = index + 1;
        this.setItemData(nextIndex);
      }
    },
    setItemData(index) {
      let self = this;
      let item = this.items[index];
      let datasource = this.options.datasource || item.datasource;
      if (!datasource) {
        throw new Error("请设置datasource");
      }
      let previousValue = this.getPreviousValue(index);
      if (this.cache[previousValue]) {
        let result = this.cache[previousValue];
        // let result = self.transformEmnu(res);
        self.$set(self.opts, index, {});
        self.$set(self.opts[index], "data", result);
        if (!result || !result.length) {
          this.handleChange(this.items[index], index);
        }
      } else if (typeof datasource == "function" && previousValue) {
        datasource.call(this, previousValue).then(res => {
          let result = self.transformEmnu(res);
          self.cache[previousValue] = result;
          self.$set(self.opts, index, {});
          self.$set(self.opts[index], "data", result);
          if (!result || !result.length) {
            this.handleChange(this.items[index], index);
          }
        });
      } else {
        self.$set(self.opts, index, {});
        self.$set(self.opts[index], "data", []);
        this.handleChange(this.items[index], index);
      }
    },
    transformEmnu(data) {
      if (this.options.fieldMap) {
        let { key, value } = this.options.fieldMap;
        return data.map(item => {
          return {
            text: item[key],
            value: item[value]
          };
        });
      }
      return data;
    },
    getPreviousValue(index) {
      if (index - 1 < 0) {
        return `ROOT`;
      }
      let { name } = this.items[index - 1];
      return this.safeValue[name];
    }
  }
};
</script>
<style lang="less">
.cascading-select-container {
  .cascading-select-item {
    margin-right: 10px;
  }
  .cascading-select-label {
    vertical-align: middle;
  }
  .xui-select {
    vertical-align: middle;
  }
}
</style>

