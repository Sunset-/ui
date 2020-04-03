// import Vue from "vue";
// import NetPosaXUI from "./src/np-xui";
// Vue.use(NetPosaXUI, { prefix: "xui", dev: true });

module.exports = {
	title: "NetPosa-XUI",
	description: "高复用组件库",
	base: "/",
	head: [["script", { rel: "icon", href: `/jquery.js` }]],
	themeConfig: {
		nav: [
			{ text: "主页", link: "/" },
			{ text: "起步", link: "/common/start" },
			{ text: "组件", link: "/components/base/button" }
		],
		sidebar: [
			{
				title: "基础",
				children: ["start", "icon", "dict", "formfield", "validate"].map(name => `/common/${name}`)
			},
			{
				title: "基础组件",
				children: [
					"button",
					"input",
					"select",
					"radio",
					"checkbox",
					"datepicker",
					"switch",
					"customchecker",
					"textarea",
					"slider",
					"pager",
					"file",
					"tabs",
					"ip",
					"progress",
					"loading",
					"timeline",
					"modal",
					"dialog"
				].map(name => `/components/base/${name}`)
			},
			{
				title: "复合组件",
				children: [
					"daterange",
					"fileuploader",
					// "treeselect",
					"toolbar",
					"filter",
					"form",
					"datapage",
					"table"
					// "waterfall",
					// "infotable",
					// "imagemarker"
				].map(name => `/components/compsite/${name}`)
			}
		]
	}
};
