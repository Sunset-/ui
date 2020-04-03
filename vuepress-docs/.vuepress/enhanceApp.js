import promise from "promise-polyfill";
import Vue from "vue";
// import jquery from "jquery";
// window.$ = window.jQuery = jquery;

import jsonview from "./lib/jqueryview/jquery.jsonview.js";
import "./lib/jqueryview/jquery.jsonview.css";
//加载element-ui组件
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import NetPosaXUI from "../../src/np-xui-build-doc";
// var NetPosaXUI = require("../../dist/netposa-xui.js");
// import NetPosaXUI from "../../src/np-xui-build-doc";
import "../../dist/netposa-xui.css";

Vue.jsonview = jsonview;

//ztree
// require("../../src/vendor/ztree/jquery.ztree.all-3.5.min");
// require("../../src/vendor/ztree/jquery.ztree.exhide.min.js");
// require("../../src/vendor/ztree/zTreeStyle/zTreeStyle.css");

export default ({ Vue, options, router }) => {
	Vue.use(ElementUI);
	Vue.use(NetPosaXUI);
};
