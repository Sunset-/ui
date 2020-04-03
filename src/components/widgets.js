var widgets = {};

import input from "./base/input";
import select from "./base/select";
import datepicker from "./base/datepicker";
import radio from "./base/radio";
import checkbox from "./base/checkbox";
import slider from "./base/slider";
import tabs from "./base/tabs";
import customchecker from "./base/customchecker";
import textarea from "./base/textarea";
import switchComp from "./base/switch";
import cascader from "./base/cascader";
import ip from "./base/ip";
import timepicker from "./base/timepicker";
import datetime from "./base/datetime";
import multiselect from "./base/multiselect";
import _static from "./base/static";

import daterange from "./composite/daterange";
import treeselect from "./composite/treeselect";
import fileuploader from "./composite/fileuploader";

import cascadeselect from "./composite/cascading-select"
import counter from "./base/counter";

widgets[`input`] = input;
widgets[`select`] = select;
widgets[`datepicker`] = datepicker;
widgets[`radio`] = radio;
widgets[`checkbox`] = checkbox;
widgets[`slider`] = slider;
widgets[`tabs`] = tabs;
widgets[`color`] = customchecker;
widgets[`customchecker`] = customchecker;
widgets[`textarea`] = textarea;
widgets[`switch`] = switchComp;
widgets[`ip`] = ip;
widgets[`timepicker`] = timepicker;
widgets[`datetime`] = datetime;
widgets[`multiselect`] = multiselect;
widgets[`cascader`] = cascader;
widgets[`static`] = _static;

widgets[`daterange`] = daterange;
widgets[`treeselect`] = treeselect;
widgets[`fileuploader`] = fileuploader;
widgets[`cascadeselect`] = cascadeselect;
widgets[`counter`] = counter;
export default widgets;
