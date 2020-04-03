<template>
  <div>
    <np-button @click="a" size="mini" color="danger" :disabled="true" icon="el-icon-info" label="12&nbsp;&nbsp;&nbsp;3"></np-button>
    <np-button @click="a" size="small" color="primary" icon="xui-icon xui-icon-back">按钮A</np-button>
    <np-button @click="a" size="normal" color="success" icon="el-icon-info" label="按按123按按钮A"></np-button>
    <np-button @click="a" size="big" color="warning" icon="el-icon-info" label="123">按钮A</np-button>
    <np-button @click="a" size="large" color="info" icon="el-icon-info" label="123">按钮A</np-button>
    <np-button @click="a" color="ghost" icon="el-icon-info" label="123">按钮A</np-button>
    <np-button @click="a" color="white" icon="el-icon-info" label="123">按钮A</np-button>

    <!-- {{v}} -->
  </div>
</template>

<script>
export default {
	methods: {
		a() {
			// alert(123)
		}
	},
	data() {
		return {
			options: {}
		};
	}
};
</script>
