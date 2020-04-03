<style lang="scss">
.modules {
	padding: 10px 0px;
}
.module-config {
	padding: 10px;
}
</style>

<template>
	<div>
		<np-toolbar :options="options"></np-toolbar>
		<div>
			<h4>总配置对象</h4>
			{{JSON.stringify(configData)}}
		</div>
		<div class="modules">
			<el-button v-for="(m,index) in modules" :type="currentModule==m?'success':''" :key="index" @click="selectModule(m)">{{m.name}}</el-button>
		</div>
		<div class="module-config">
			<component ref="configer" v-if="currentModule" :is="currentModule.component" @save="saveConfig"></component>
		</div>
	</div>
</template>

<script>
import modulesConfig from "./modules";

export default {
	components: modulesConfig.components,
	methods: {
		selectModule(m) {
			this.currentModule = m;
			this.$nextTick(() => {
				this.$refs.configer.reset(this.configData[m.name]);
			});
		},
		saveConfig(config) {
			this.$set(this.configData, this.currentModule.name, config);
		}
	},
	data() {
		var self = this;
		return {
			configData: {},
			currentModule: null,
			modules: Object.keys(modulesConfig.modules).map(key => ({
				name: key,
				component: modulesConfig.modules[key]
			})),
			options: {
				size: "mini",
				tools: [
					{
						label: "导入配置",
						type: "file",
						filter(file) {
							if (file) {
								var reader = new FileReader();
								//将文件以Data URL形式读入页面
								reader.readAsText(file.getSource().source);
								reader.onload = function(e) {
									try {
										self.configData = JSON.parse(this.result);
										self.selectModule(self.currentModule);
										alert("导入成功");
									} catch (e) {
										alert("导入失败");
										throw e;
									}
								};
							}
							return false;
						}
					},
					{
						label: "下载配置",
						type: "download",
						name: () => {
							return "config.json";
						},
						data: () => {
							return `data:text/plain,${JSON.stringify(this.configData)}`;
						}
					}
				]
			}
		};
	}
};
</script>
