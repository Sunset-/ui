import Promise from "promise-polyfill";
window.Promise = Promise;
import "./jquery-vendor";
import Vue from "vue";
import Router from "vue-router";
import NetPosaXUI from "./np-xui";
// import NetPosaXUI from "../dist/netposa-xui";
//ztree
import "./vendor/ztree/jquery.ztree.all-3.5.min";
import "./vendor/ztree/jquery.ztree.exhide.min.js";
import "./vendor/ztree/zTreeStyle/zTreeStyle.css";
//加载element-ui组件
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(Router);
Vue.use(ElementUI);
Vue.use(NetPosaXUI, { prefix: "np", dev: true });
window.NetPosaXUI = NetPosaXUI;

import App from "./App.vue";

//安装表单项组件
import hahaha from "./hahaha.vue";
// NetPosaXUI.Component.registFormField('hahaha',hahaha);
//安装校验规则
NetPosaXUI.Validator.regist("customEmail", {
	message: function(a, b, c) {
		return a;
	},
	check: function(val) {
		return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			val
		);
	}
});
//安装字典
NetPosaXUI.Dictionary.installRemote(
	function(type) {
		console.log("校验远程获取字典");
		return true;
	},
	function(type) {
		console.log("远程获取字典" + type);
		return new Promise(resolve => {
			setTimeout(() => {
				resolve([
					{
						type: "Org",
						parent: null,
						value: "111",
						text: "111"
					},
					{
						type: "Org",
						parent: null,
						value: "222",
						text: "222"
					},
					{
						type: "Org",
						parent: "111",
						value: "333",
						text: "333"
					},
					{
						type: "Org",
						parent: "222",
						value: "444",
						text: "444"
					},
					{
						type: "Org",
						parent: "222",
						value: "555",
						text: "555"
					},
					{
						type: "Org",
						parent: "555",
						value: "777",
						text: "777"
					}
				]);
			}, 500);
		});
	}
);
NetPosaXUI.Dictionary.install([
	{
		type: "STRUCTURATION_TYPE",
		value: "ALL",
		keywords: "qb",
		text: "全部"
	},
	{
		type: "STRUCTURATION_TYPE",
		value: "FACE",
		keywords: "rl",
		text: "人脸"
	},
	{
		type: "STRUCTURATION_TYPE",
		value: "VEHICLE",
		keywords: "jdcl",
		text: "机动车辆"
	},
	{
		type: "SEX",
		value: "0",
		text: "男"
	},
	{
		type: "SEX",
		value: "1",
		text: "女"
	},
	{
		type: "SEX",
		value: "ALL",
		text: "全部"
	},
	{
		type: "HAVE_GLASS",
		value: "0",
		text: "未戴眼镜"
	},
	{
		type: "HAVE_GLASS",
		value: "1",
		text: "戴眼镜"
	},
	{
		type: "HAVE_GLASS",
		value: "-1",
		text: "其他"
	}
]);

var routes = [];
NetPosaXUI.components.forEach(item => {
	item.path = `/${item.tag}`;
	routes.push({
		path: `/${item.tag}`,
		component: item.component
	});
});

import businessModules from "./business";
Object.keys(businessModules).forEach(key => {
	routes.push({
		path: `/${key}`,
		component: businessModules[key]
	});
});

var router = new Router({
	routes: [
		{
			path: "/",
			component: App,
			children: routes
		}
	]
});
window.Router = router;
//开始
const app = new Vue({
	router
}).$mount("#app");
