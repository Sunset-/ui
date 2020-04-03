import Sunset from "../common/sunset";
import FilterWidgets from "./composite/filter/filter-widgets";
import FormWidgets from "./composite/form/form-widgets";

import button from "./base/button";
import input from "./base/input";
import select from "./base/select";
// import datepicker from "./base/datepicker";
import radio from "./base/radio";
import checkbox from "./base/checkbox";
import switchCompo from "./base/switch";
import slider from "./base/slider";
import file from "./base/file";
import textarea from "./base/textarea";
import ip from "./base/ip";
import pager from "./base/pager";
import loading from "./base/loading";
import tabs from "./base/tabs";
import customchecker from "./base/customchecker";
import modal from "./base/modal";
import timeline from "./base/timeline";
// import stree from "./base/stree";
// import tree from "./base/tree";
import dialog from "./base/dialog";
import progress from "./base/progress";

import toolbar from "./composite/toolbar";
import form from "./composite/form";
import filter from "./composite/filter";
import table from "./composite/table";
import infoTable from "./composite/infoTable";
import datapage from "./composite/datapage";
import waterfall from "./composite/waterfall";
// import daterange from "./composite/daterange";
// import treeselect from "./composite/treeselect";
// import imageMarker from "./composite/imageMarker";
import fileuploader from "./composite/fileuploader";
import counter from "./base/counter"

const COMPONENT_PREFIX = "xui";
var components = {};

//基础组件
components["button"] = button;
components["input"] = input;
components["select"] = select;
// components["datepicker"] = datepicker;
components["radio"] = radio;
components["checkbox"] = checkbox;
components["switch"] = switchCompo;
components["slider"] = slider;
components["file"] = file;
components["textarea"] = textarea;
components["ip"] = ip;
components["pager"] = pager;
components["loading"] = loading;
components["tabs"] = tabs;
components["customchecker"] = customchecker;
components["modal"] = modal;
components["timeline"] = timeline;
// components["stree"] = stree;
// components["tree"] = tree;
components["dialog"] = dialog;
components["progress"] = progress;
components["counter"] = counter;

//复合组件
components["toolbar"] = toolbar;
components["filter"] = filter;
components["form"] = form;
components["table"] = table;
components["infoTable"] = infoTable;
components["datapage"] = datapage;
components["waterfall"] = waterfall;
// components["daterange"] = daterange;
// components["treeselect"] = treeselect;
// components["imageMarker"] = imageMarker;
components["fileuploader"] = fileuploader;

export default function(Vue, options, xui) {
	Object.keys(components).forEach(key => {
		var component = components[key];
		var componentTag = `${options.prefix || COMPONENT_PREFIX}-${Sunset.Strings.toHyphenate(key)}`;
		Vue.component(componentTag, component);
	});
	//安装表单组件
	xui.Component = {
		registFormField(name, widget) {
			FilterWidgets.regist(name, widget);
			FormWidgets.regist(name, widget);
		}
	};
}
