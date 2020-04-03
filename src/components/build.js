import Sunset from "../common/sunset";
import FilterWidgets from "./composite/filter/filter-widgets";
import FormWidgets from "./composite/form/form-widgets";

import button from "./base/button";
import input from "./base/input";
import select from "./base/select";
import datepicker from "./base/datepicker";
import radio from "./base/radio";
import checkbox from "./base/checkbox";
import ctxcheckbox from "./base/ctxcheckbox";
import switchCompo from "./base/switch";
import slider from "./base/slider";
import dropdown from "./base/dropdown";
import file from "./base/file";
import cascader from "./base/cascader";
import textarea from "./base/textarea";
import ip from "./base/ip";
import pager from "./base/pager";
import loading from "./base/loading";
import tabs from "./base/tabs";
import customchecker from "./base/customchecker";
import modal from "./base/modal";
import timeline from "./base/timeline";
import stree from "./base/stree";
import tree from "./base/tree";
import dialog from "./base/dialog";
import scroll from "./base/scroll";
import progress from "./base/progress";
import timepicker from "./base/timepicker";
import datetime from "./base/datetime";
import viewport from "./base/viewport";
import vituralized from "./base/virtualized";
import "./base/pop";
import multiselect from "./base/multiselect";
import picker from "./base/picker";

import toolbar from "./composite/toolbar";
import form from "./composite/form";
import filter from "./composite/filter";
import table from "./composite/table";
import infoTable from "./composite/infoTable";
import datapage from "./composite/datapage";
import waterfall from "./composite/waterfall";
import daterange from "./composite/daterange";
import treeselect from "./composite/treeselect";
import imageMarker from "./composite/imageMarker";
import fileuploader from "./composite/fileuploader";
import viewer from "./composite/viewer";
import widgets from "./composite/widgets";
import fasttree from "./composite/fasttree";
import cascadeSelect from "./composite/cascading-select";
import counter from "./base/counter";

const COMPONENT_PREFIX = "xui";
var components = {};

//基础组件
components["button"] = button;
components["input"] = input;
components["select"] = select;
components["datepicker"] = datepicker;
components["radio"] = radio;
components["checkbox"] = checkbox;
components["ctxcheckbox"] = ctxcheckbox;
components["switch"] = switchCompo;
components["slider"] = slider;
components["dropdown"] = dropdown;
components["file"] = file;
components["cascader"] = cascader;
components["textarea"] = textarea;
components["ip"] = ip;
components["pager"] = pager;
components["loading"] = loading;
components["tabs"] = tabs;
components["customchecker"] = customchecker;
components["modal"] = modal;
components["timeline"] = timeline;
components["stree"] = stree;
components["tree"] = tree;
components["dialog"] = dialog;
components["scroll"] = scroll;
components["progress"] = progress;
components["timepicker"] = timepicker;
components["datetime"] = datetime;
components["viewport"] = viewport;
components["vituralized"] = vituralized;
components["multiselect"] = multiselect;
components["picker"] = picker;
components["counter"] = counter;

//复合组件
components["toolbar"] = toolbar;
components["filter"] = filter;
components["form"] = form;
components["table"] = table;
components["infoTable"] = infoTable;
components["datapage"] = datapage;
components["waterfall"] = waterfall;
components["daterange"] = daterange;
components["treeselect"] = treeselect;
components["imageMarker"] = imageMarker;
components["fileuploader"] = fileuploader;
components["viewer"] = viewer;
components["widgets"] = widgets;
components["fasttree"] = fasttree;
components["cascadeSelect"] = cascadeSelect;

export default function(Vue, options, xui) {
	Object.keys(components).forEach(key => {
		var component = components[key];
		var componentTag = `${options.prefix || COMPONENT_PREFIX}-${Sunset.Strings.toHyphenate(key)}`;
		console.log(componentTag,component)
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
