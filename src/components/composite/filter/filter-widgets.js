import basewidgets from "../../widgets";

var widgets = Object.keys(basewidgets).reduce((res, key) => {
	res[`xui-filterwidget-${key}`] = basewidgets[key];
	return res;
}, {});

widgets.regist = function(name, widget) {
	widgets[`xui-filterwidget-${name}`] = widget;
};

export default widgets;
