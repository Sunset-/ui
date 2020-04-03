const COMPONENT_PREFIX = "np";
import Sunset from "./common/sunset";
import './style';

//基础
import Filters from "./common/filters";
import Directives from "./common/directives";
import Validators from "./common/validators";
//服务
import services from "./services";
//组件
import Components from "./components/index.js";

var xui = {
	install(Vue, options) {
		options = options || {};
		//基础
		Filters(Vue, options, this);
		Directives(Vue, options, this);
		Validators(Vue, options, this);
		//注册组件
		Components(Vue, options, this);
		Vue.prototype.$vue = Vue;
	}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
};

//挂载服务
Object.assign(xui, services);

module.exports = xui;
