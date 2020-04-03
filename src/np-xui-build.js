// import "element-ui/lib/theme-chalk/index.css";
import Sunset from "./common/sunset";
import "./style";

//基础
import Filters from "./common/filters";
import Directives from "./common/directives";
import Validators from "./common/validators";
//组件
import Components from "./components/build";
//服务
import services from "./services";

var registQueue = [];
var installed = false;

var xui = {
	install(Vue, options) {
		options = options || {};
		//基础
		Filters(Vue, options, this);
		Directives(Vue, options, this);
		Validators(Vue, options, this);
		//注册组件
		Components(Vue, options, this);
		while (registQueue.length) {
			var c = registQueue.shift();
			xui.Component.registFormField(c.name, c.widget);
		}
		installed = true;
	},
	Component: {
		registFormField(name, widget) {
			if (!installed) {
				registQueue.push({
					name,
					widget
				});
			}
		}
	},
	Sunset: Sunset
};

//挂载服务
Object.assign(xui, services);

if (window && window.Vue) {
	window.Vue.use(xui);
}

module.exports = xui;
