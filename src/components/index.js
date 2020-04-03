import Sunset from "../common/sunset";
import FilterWidgets from "./composite/filter/filter-widgets";
import FormWidgets from "./composite/form/form-widgets";

const COMPONENT_PREFIX = "xui";
var groups = ["base", "composite", "business"];

const components = {};

groups.forEach(g => {
	var gCps = require(`./${g}`);
	for (var key in gCps) {
		if (gCps.hasOwnProperty(key)) {
			var widget = require(`./${g}/${key}`).default;
			var doc = require(`./${g}/${key}/doc.js`);
			var alias = gCps[key];
			if (typeof alias == "string") {
				components[`${alias}`] = {
					group: g,
					component: widget,
					doc: doc
				};
			} else {
				alias.forEach(a => {
					components[`${a}`] = {
						group: g,
						component: widget,
						doc: doc
					};
				});
			}
		}
	}
});
export default function(Vue, options, xui) {
	var registComponents = [],
		registComponentsMap = [];
	Object.keys(components).forEach(key => {
		var component = components[key];
		var componentTag = `${options.prefix || COMPONENT_PREFIX}-${Sunset.Strings.toHyphenate(key)}`;
		Vue.component(componentTag, component.component);
		var doc = component.doc;
		var pack = {
			group: component.group,
			title: doc.title,
			tag: componentTag,
			doc: doc
		};
		registComponents.push(pack);
		registComponentsMap[componentTag] = pack;
		//demo
		var demos = [];
		doc.demos &&
			doc.demos.forEach((item, index) => {
				Vue.component(`${componentTag}-${index}`, item);
				demos.push(`${componentTag}-${index}`);
			});
		pack.demos = demos;
	});
	xui.components = registComponents;
	xui.componentsMap = registComponentsMap;
	//安装表单组件
	xui.Component = {
		registFormField(name, widget) {
			FilterWidgets.regist(name, widget);
			FormWidgets.regist(name, widget);
		}
	};
}
