<template>
	<div class="np-date-picker-panel" ref="dateContainer" v-if='showItem'>
		<div class="date-input" :class="{
                inputactive : isShowTime,
				'disabledInput':disabled
            }">
			<span class="date_icon" @click="showView()"></span>
			<input :class="{'disabled-input': disabled}" type="text" class="time-input" :placeholder="placeholder" v-model="_dateControl" @click="showView()" readonly="readonly" />
		</div>
		<transition name="toggle">
			<div id="calendarPanel" v-show="isShowTime" class="calendarPanel" :class="containerClass" ref="calendarPanel">
				<iframe scroll="none" src="about:blank" class="picker-panel__iframe"></iframe>
				<div name="calendarForm" style="margin: 0px; position: relative;">
					<table width="100%" border="0" cellpadding="0" cellspacing="1" class="tableHeader">
						<tr>
							<th align="left" width="1%">
								<button type="button" class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left" id="prevMonth" @click="goPrevMonth()"></button>
							</th>
							<th align="center" width="98%" nowrap="nowrap">
								<div id="calendarYear" class="select_main">
									<input class="select_text" min="1968" max="2050" v-model="calendarYear.currentValue" readonly="readonly" />
									<div class="select_arrow" :class="{'open_select_arrow':calendarYear.show_dropDown,'select_arrow':!calendarYear.show_dropDown}" @click="calendarYear.taggleDropDown()"></div>
									<ul class="select_dropDown" v-if="calendarYear.show_dropDown">
										<scroll-bar>
											<li v-for="(sel,k) in calendarYear.options" :key="k" :class="{option_selected:calendarYear.currentValue==sel}" :data-value="sel" @click="clickOption('calendarYear',sel)">{{sel}}</li>
										</scroll-bar>
									</ul>
								</div>
								<div id="calendarMonth" class="select_main">
									<input min="1" max="12" class="select_text" v-model="calendarMonth.currentValue" readonly="readonly" />
									<div class="select_arrow" :class="{'open_select_arrow':calendarMonth.show_dropDown,'select_arrow':!calendarMonth.show_dropDown}" @click="calendarMonth.taggleDropDown()"></div>
									<ul class="select_dropDown" v-if="calendarMonth.show_dropDown">
										<scroll-bar>
											<li v-for="(sel,k) in calendarMonth.options" :key="k" :class="{option_selected:calendarYear.currentValue==sel}" :data-value="sel" @click="clickOption('calendarMonth',sel)">{{sel}}</li>
										</scroll-bar>
									</ul>
								</div>
							</th>
							<th align="right" width="1%">
								<button type="button" aria-label="下个月" id="nextMonth" class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right" @click="goNextMonth()"></button>
							</th>
						</tr>
					</table>
					<table id="calendarTable" ref="calendarTable" width="100%" style="" border="0" cellpadding="3" cellspacing="1" class="calendarTable">
					</table>
				</div>
				<div v-if="!isOnlyDay" class="select_container">
					<span style="float:left">
						</i>时 间 :</span>
					<div id="calendarHour" class="select_main calendarHour" style="width: 55px" ref="calendarHour">
						<input class="select_text" min="0" max="23" v-model="calendarHour.currentValue" readonly="readonly" />
						<div class="select_arrow" :class="{'open_select_arrow':calendarHour.show_dropDown,'select_arrow':!calendarHour.show_dropDown}" @click="calendarHour.taggleDropDown()"></div>
						<ul class="select_dropDown" v-if="calendarHour.show_dropDown">
							<scroll-bar>
								<li style="cursor: pointer;" v-for="(sel,k) in calendarHour.options" :key="k" :class="{option_selected:calendarYear.currentValue==sel.value}" :data-value="sel" @click="calendarHour.optionClick(sel)">{{sel.value}}</li>
							</scroll-bar>
						</ul>
					</div>
					<em style="float:left;font-style: normal">:</em>
					<div id="calendarMinute" class="select_main calendarMinute" style="width: 55px" ref="calendarMinute">
						<input class="select_text" min="0" max="59" v-model="calendarMinute.currentValue" readonly="readonly" />
						<div class="select_arrow" :class="{'open_select_arrow':calendarMinute.show_dropDown,'select_arrow':!calendarMinute.show_dropDown}" @click="calendarMinute.taggleDropDown()"></div>
						<ul class="select_dropDown" v-if="calendarMinute.show_dropDown">
							<scroll-bar>
								<li style="cursor: pointer;" v-for="(sel,k) in calendarMinute.options" :key="k" :class="{option_selected:calendarYear.currentValue==sel.value}" :data-value="sel" @click="calendarMinute.optionClick(sel)">{{sel.value}}</li>
							</scroll-bar>
						</ul>
					</div>
					<em style="float:left;font-style: normal">:</em>
					<div id="calendarSecond" class="select_main calendarSecond" style="width: 55px" ref="calendarSecond">
						<input class="select_text" min="0" max="59" v-model="calendarSecond.currentValue" readonly="readonly" />
						<div class="select_arrow" :class="{'open_select_arrow':calendarSecond.show_dropDown,'select_arrow':!calendarSecond.show_dropDown}" @click="calendarSecond.taggleDropDown()"></div>
						<ul class="select_dropDown" v-if="calendarSecond.show_dropDown">
							<scroll-bar>
								<li style="cursor: pointer;" v-for="(sel,k) in calendarSecond.options" :key="k" :class="{option_selected:calendarYear.currentValue==sel.value}" :data-value="sel" @click="calendarSecond.optionClick(sel)">{{sel.value}}</li>
							</scroll-bar>
						</ul>
					</div>
				</div>
				<div class="date_picker_bottom">
					<datepicker-button @click="clearTime" v-show="clearable" color="info" size="mini" >{{context.clear}}</datepicker-button>
					<datepicker-button @click="currentTime" color="info" size="mini"  :class="{clearableStyle:!clearable}">{{context.current}}</datepicker-button>
					<datepicker-button @click="confirmTime" color="primary" size="mini" class="blue">{{context.confirm}}</datepicker-button>
				</div>
			</div>
		</transition>
		<div class="datePickerCover" v-if="isShowTime" @click="hideCover"></div>
	</div>
</template>
<script>
import datepickerButton from "../../button";
import sunSet from "../../../../common/sunset";
import propertyJS from "./propertyJs.js";
import scrollBar from "../../scroll";
var contextsZh = {
	year: [""],
	months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
	weeks: ["日", "一", "二", "三", "四", "五", "六"],
	abort: "时间",
	clear: "清空",
	current: "当前",
	confirm: "确定"
};
var contextsEn = {
	year: [""],
	months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
	weeks: ["SUN", "MON", "TUR", "WED", "THU", "FRI", "SAT"],
	abort: "TIME",
	clear: "CLS",
	current: "CURRENT",
	confirm: "CONFIRM"
};
var LANG = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
LANG = LANG.indexOf("zh") > -1 ? 0 : 1;

/*格式化日期 */
Date.prototype.toFormat = function(style) {
	var o = {
		"M+": this.getMonth() + 1, // month
		"d+": this.getDate(), // day
		"h+": this.getHours(), // hour
		"m+": this.getMinutes(), // minute
		"s+": this.getSeconds(), // second
		"w+": "天一二三四五六".charAt(this.getDay()), // week
		"q+": Math.floor((this.getMonth() + 3) / 3), // quarter
		S: this.getMilliseconds()
		// millisecond
	};
	if (/(y+)/.test(style)) {
		style = style.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(style)) {
			style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return style;
};
var beginYear, endYear;
var isFocus = false;

function SelectControl() {
	this.show_dropDown = false;
	this.options = [];
	this.currentValue = "";
}
SelectControl.prototype.optionClick = function(sel) {
	if (sel.isDisabled) {
		return;
	}
	this.currentValue = sel.value ? sel.value : sel;
	this.show_dropDown = false;
};

var timeLabel = function(timeNum) {
	return parseInt(timeNum) < 10 ? "0" + parseInt(timeNum) : "" + timeNum;
};
export default {
	components: {
		datepickerButton,
		scrollBar
	},
	mixins: [propertyJS],
	name: "npDatePicker",
	props: {
		type: { type: String, default: "date" }, //时间类型：datetime|date
		clearable: { type: Boolean, default: true }, //是否可以清空时间
		disabled: { type: Boolean, default: false }, //禁用状态
		editable: { type: Boolean, default: true }, //是否可以手动编辑时间
		placeholder: { type: String, default: "" }, //默认placeholder
		size: { type: String, default: "large" }, //输入框大小
		format: { type: String, default: "yyyy-MM-dd HH:mm:ss" }, //输入框显示的时间格式，需提供规范的时间格式模板
		pickerOptions: {
			type: Object,
			default: function() {
				return {
					disabledDate: function(time) {
						//禁用状态定义
						return false;
					}
				};
			}
		},
		value: { default: "" },
		startTimeValue: { type: Number },
		yearRange: {
			type: Array,
			default() {
				return [new Date().getFullYear() - 20, new Date().getFullYear() + 20];
			}
		},
		containerClass:{
			type: String,
			default:""
		}
	},
	data: function() {
		return {
			isOnlyDay: this.type === "date", //是否是显示日期不显示时分秒
			isShowTime: false,
			showItem:true,
			myValue: this.value,
			context: LANG === 0 ? contextsZh : contextsEn,
			dateValue: new Date().getDate(),
			calendarYear: new SelectControl(),
			calendarMonth: new SelectControl(),
			calendarHour: new SelectControl(),
			calendarMinute: new SelectControl(),
			calendarSecond: new SelectControl()
		};
	},
	computed: {
		_dateControl: function() {
			return this.myValue;
		}
	},
	beforeDestroy: function() {
		document.body.removeEventListener("mousewheel", this.eventListenerCallBack);
		// var bodyObj = document.getElementsByTagName("body")[0];
		var	iframeObj = document.getElementsByClassName("picker-panel__iframe");
		if (iframeObj && iframeObj.parentNode) {
		iframeObj.parentNode.removeChild(iframeObj);
		}
	},
	watch: {
		value: function(val) {
			this.myValue = val ? sunSet.Dates.format(new Date(val), this.dateFormat) : "";
		},
		_dateControl: function(val) {
			var date = val.replace(/-/g, "/"),
				timestamp = new Date(date).getTime();
			this.$emit("input", timestamp);
		},
		isShowTime: function(val) {
			if (!val) {
				document.getElementsByClassName("picker-panel__iframe")[0].remove();
				this.$refs.calendarPanel.remove();
			}
			if (!val || !this.container) {
				this.defaultStatus();
				document.body.removeEventListener("mousewheel", this.eventListenerCallBack);
				return;
			}
			var iframeObj = document.createElement("iframe"),
				bodyObj = document.getElementsByTagName("body")[0];
			iframeObj.setAttribute("sroll", "none");
			iframeObj.setAttribute("src", "about:blank");
			iframeObj.setAttribute("class", "picker-panel__iframe");
			bodyObj.appendChild(iframeObj);
			bodyObj.appendChild(this.$refs.calendarPanel);
			this.datePanelPosition();
			setTimeout(
				function() {
					var iframeHeight = this.isOnlyDay ? "371px" : "413px";
					iframeObj.style.left = this.panel.offsetLeft + "px";
					(iframeObj.style.top = this.panel.offsetTop + "px"), (iframeObj.style.width = "320px");
					iframeObj.style.height = iframeHeight;
					if (this.isOnlyDay) {
						iframeObj.style.height = "371px";
					}
				}.bind(this),
				300
			);
			document.body.addEventListener("mousewheel", this.eventListenerCallBack);
		}
	},
	mounted: function() {
		this.container = this.$el;
		this.panel = this.container.getElementsByClassName("calendarPanel")[0];
		var mvAry = [];
		mvAry[mvAry.length] = " <tr>";
		for (var i = 0; i < 7; i++) {
			mvAry[mvAry.length] = ' <th class = "th_head">' + this.context["weeks"][i] + "</th>";
		}
		mvAry[mvAry.length] = " </tr>";
		for (var i = 0; i < 6; i++) {
			mvAry[mvAry.length] = ' <tr align="center">';
			for (var j = 0; j < 7; j++) {
				mvAry[mvAry.length] = " <td ><span></span></td>";
			}
			mvAry[mvAry.length] = " </tr>";
		}
		this.container.getElementsByClassName("calendarTable")[0].innerHTML = mvAry.join("");
	},
	created: function() {
		beginYear = this.yearRange[0];
		endYear = this.yearRange[1];
		this.date = new Date();
		this.year = this.date.getFullYear();
		this.month = this.date.getMonth();
		this.hour = this.date.getHours();
		this.minute = this.date.getMinutes();
		this.second = this.date.getSeconds();
		this.dateFormat = this.isOnlyDay ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm:ss";
		if (this.format !== "yyyy-MM-dd HH:mm:ss" && !this.isOnlyDay) {
			//如果用户自定义了格式 按照用户定义方式显示
			this.dateFormat = this.format;
		}
		if (this.myValue) {
			var date = new Date();
			date.setTime(this.myValue);
			this.myValue = sunSet.Dates.format(date, this.dateFormat);
		}
		for (var i = beginYear; i <= endYear; i++) {
			this.calendarYear.options.unshift(i); //年份倒排 否则最近的年份放最下面不方便
		}
		for (var i = 0; i < 60; i++) {
			if (i < 12) {
				this.calendarMonth.options.push(this.context.months[i]);
			}
			if (i < 24 && !this.isOnlyDay) {
				this.calendarHour.options.push({ value: i < 10 ? "0" + i : i, isDisabled: false });
			}
			if (!this.isOnlyDay) {
				this.calendarMinute.options.push({ value: i < 10 ? "0" + i : i, isDisabled: false });
				this.calendarSecond.options.push({ value: i < 10 ? "0" + i : i, isDisabled: false });
			}
		}
		this.getTime();
		this.initShowDropDown();
		this.calendarYear.taggleDropDown = function() {
			this.initShowDropDown({ isYear: true });
			this.calendarYear.show_dropDown = !this.calendarYear.show_dropDown;
		}.bind(this);
		this.calendarMonth.taggleDropDown = function() {
			this.initShowDropDown({ isMonth: true });
			this.calendarMonth.show_dropDown = !this.calendarMonth.show_dropDown;
		}.bind(this);
		this.calendarHour.taggleDropDown = function() {
			this.initShowDropDown({ isHour: true });
			this.calendarHour.show_dropDown = !this.calendarHour.show_dropDown;
			if (this.calendarHour.show_dropDown) {
				this.hmsToggle("calendarHour");
			}
		}.bind(this);
		this.calendarMinute.taggleDropDown = function() {
			this.initShowDropDown({ isMinute: true });
			this.calendarMinute.show_dropDown = !this.calendarMinute.show_dropDown;
			if (this.calendarMinute.show_dropDown) {
				this.hmsToggle("calendarMinute");
			}
		}.bind(this);
		this.calendarSecond.taggleDropDown = function() {
			this.initShowDropDown({ isSecond: true });
			this.calendarSecond.show_dropDown = !this.calendarSecond.show_dropDown;
			if (this.calendarSecond.show_dropDown) {
				this.hmsToggle("calendarSecond");
			}
		}.bind(this);
	},
	methods: {
		initNpScrollBar: function(clickDom) {
			if (clickDom) {
				var offsetTop = this.getAbsPoint($(this.container).find("#" + clickDom)[0]).top,
					offsetHeight = $("#" + clickDom).height(),
					documentTop = $(window).height(),
					decreaseHeight = documentTop - offsetTop - offsetHeight,
					domNode = ".select_dropDown";
				$(this.container)
					.find("#" + clickDom + " .select_dropDown")
					.removeClass("specialPosition");
			} else {
				var domNode = ".select_dropDown";
			}
			this.$nextTick(function() {
				Scrollbar.initScrollBar(domNode, 0, "inside");
				if (clickDom) {
					if (decreaseHeight < 300) {
						$(this.container)
							.find("#" + clickDom + " .select_dropDown")
							.addClass("specialPosition");
					}
				}
			});
		},
		hmsToggle(toggleDom) {
			var currentDom = this.$refs[toggleDom];
			var offsetTop = this.getAbsPoint(currentDom).top,
				offsetHeight = currentDom.offsetHeight,
				documentTop = document.documentElement.clientHeight,
				decreaseHeight = documentTop - offsetTop - offsetHeight,
				domNode = "select_dropDown";
			this.$nextTick(() => {
				if (this.hasClass(currentDom.getElementsByClassName("select_dropDown")[0], "specialPosition")) {
					this.removeClass(currentDom.getElementsByClassName("select_dropDown")[0], "specialPosition");
				}
				if (decreaseHeight < 300) {
					this.addClass(currentDom.getElementsByClassName("select_dropDown")[0], "specialPosition");
				}
			});
		},
		eventListenerCallBack() {
			if (this.isShowTime) {
				setTimeout(
					function() {
						this.datePanelPosition(); //更新时间面板位置
					}.bind(this),
					1000 / 60
				);
			}
		},
		defaultStatus: function() {
			this.calendarYear.show_dropDown = false;
			this.calendarMonth.show_dropDown = false;
			this.calendarHour.show_dropDown = false;
			this.calendarMinute.show_dropDown = false;
			this.calendarSecond.show_dropDown = false;
		},
		showView: function() {
			if (this.disabled) {
				return;
			} // 禁用状态
			var b = this.myValue;
			if (b) {
				this.year = b.substring(0, 4) - 0;
				this.month = b.substring(5, 7) - 1;
				this.dateValue = b.substring(8, 11) - 0;
				this.hour = b.substring(11, 13) - 0;
				this.minute = b.substring(14, 16) - 0;
				this.second = b.substring(17, 19) - 0;
			}
			this.getTime();
			this.bindData();
			this.isShowTime = !this.isShowTime;
		},
		hideCover: function() {
			this.isShowTime = false;
			this.calendarYear.show_dropDown = false;
			this.calendarMonth.show_dropDown = false;
		},
		getShowValue: function() {
			this.year = this.calendarYear.currentValue;
			this.month = this.context.months.indexOf(this.calendarMonth.currentValue);
			if (!this.isOnlyDay) {
				this.hour = this.calendarHour.currentValue;
				this.minute = this.calendarMinute.currentValue;
				this.second = this.calendarSecond.currentValue;
			}
		},
		initShowDropDown: function(slecteFlag) {
			slecteFlag = slecteFlag || {};
			if (!slecteFlag.isYear) {
				this.calendarYear.show_dropDown = false;
			}
			if (!slecteFlag.isMonth) {
				this.calendarMonth.show_dropDown = false;
			}
			if (!slecteFlag.isHour) {
				this.calendarHour.show_dropDown = false;
			}
			if (!slecteFlag.isMinute) {
				this.calendarMinute.show_dropDown = false;
			}
			if (!slecteFlag.isSecond) {
				this.calendarSecond.show_dropDown = false;
			}
		},
		getTime: function() {
			this.calendarYear.currentValue = this.year;
			this.calendarMonth.currentValue = this.context.months[this.month];
			if (!this.isOnlyDay) {
				this.calendarHour.currentValue = timeLabel(this.hour);
				this.calendarMinute.currentValue = timeLabel(this.minute);
				this.calendarSecond.currentValue = timeLabel(this.second);
			}
		},
		refreshSource(val) {
			for (let i = 0, j = this.calendarMinute.options.length; i < j; i++) {
				if (i < 24) {
					this.calendarHour.options[i].isDisabled = false;
				}
				this.calendarMinute.options[i].isDisabled = false;
				this.calendarSecond.options[i].isDisabled = false;
			}
		},
		initDisableClass(val) {
			var startDateObj = sunSet.isDate(val) ? val : new Date(val),
				year = startDateObj.getFullYear(),
				month = startDateObj.getMonth() + 1,
				hour = startDateObj.getHours(),
				minute = startDateObj.getMinutes(),
				second = startDateObj.getSeconds();
			for (let i = 0, j = this.calendarMinute.options.length; i < j; i++) {
				if (i < 24) {
					if (this.calendarHour.options[i].value < hour) {
						this.calendarHour.options[i].isDisabled = true;
					} else {
						this.calendarHour.options[i].isDisabled = false;
					}
				}
				if (this.calendarMinute.options[i].value < minute) {
					this.calendarMinute.options[i].isDisabled = true;
				} else {
					this.calendarMinute.options[i].isDisabled = false;
				}
				if (this.calendarSecond.options[i].value < second) {
					this.calendarSecond.options[i].isDisabled = true;
				} else {
					this.calendarSecond.options[i].isDisabled = false;
				}
			}
		},
		/**
		 * 校验当前日期是否可选
		 **/
		isDisabledDate: function(time) {
			return this.pickerOptions.disabledDate(time);
		},
		/**
		 *  获取单元格的日子
		 **/
		getTdDate: function(type, val) {
			var day = Number(val),
				year = Number(this.calendarYear.currentValue),
				month = Number(this.calendarMonth.currentValue) - 1;
			switch (type) {
				case "currentMonth":
					break;
				case "preMonth":
					if (--month < 0) {
						month = 11;
						year--;
					}
					break;
				case "nextMonth":
					if (++month > 11) {
						month = 0;
						year++;
					}
					break;
			}
			return new Date(year, month, day);
		},
		//数据绑定的月视图
		bindData: function() {
			var calendar = this;
			var dataArray = this.getMonthViewArray(this.year, this.month);
			var dayTds = this.$refs.calendarTable.getElementsByTagName("span");
			for (var i = 0, tdsLen = dayTds.length; i < tdsLen; i++) {
				dayTds[i].onclick = null;
				dayTds[i].innerHTML = dataArray[i].value;
				dayTds[i].setAttribute("class", dataArray[i].type);
				var currentType = dataArray[i].type,
					isOptionDisable = this.isDisabledDate(this.getTdDate(currentType, dataArray[i].value)),
					$dayTds = dayTds[i];
				this.removeClass($dayTds, "date-normal");
				this.removeClass($dayTds, "date-disabled");
				this.removeClass($dayTds, "date-normal-checked");
				this.removeClass($dayTds, "date-pre-month");
				this.removeClass($dayTds, "date-next-month");
				switch (currentType) {
					case "currentMonth":
						this.addClass($dayTds, "date-normal");
						// $dayTds.addClass("date-normal");
						if (isOptionDisable) {
							this.addClass($dayTds, "date-disabled");
						}
						var self = this;
						dayTds[i].onclick = function() {
							if (self.hasClass(this, "date-disabled")) {
								return;
							}
							for (var j = 0; j < tdsLen; j++) {
								if (
									dayTds[j].innerHTML == calendar.dateValue &&
									self.hasClass(dayTds[j], "currentMonth")
								) {
									self.removeClass(dayTds[j], "date-normal-checked");
									self.addClass(dayTds[j], "date-normal");
									break;
								}
							}
							calendar.dateValue = this.innerHTML;
							// if(this.innerHTML == new Date(calendar.startTimeValue).getDate()) {
							// 	calendar.initDisableClass(calendar.startTimeValue);
							// } else {
							// 	calendar.refreshSource(calendar.dateValue);

							// }
							self.addClass(this, "date-normal-checked");
						};
						break;
					case "preMonth":
						this.addClass($dayTds, "date-pre-month");
						// $dayTds.addClass("date-pre-month");
						if (isOptionDisable) {
							this.addClass($dayTds, "date-disabled");
							// $dayTds.addClass("date-disabled");
						}
						var self = this;
						dayTds[i].onclick = function() {
							if (self.hasClass(this, "date-disabled")) {
								return;
							}
							calendar.goPrevMonth(this.innerHTML);
						};
						break;
					case "nextMonth":
						this.addClass($dayTds, "date-next-month");
						if (isOptionDisable) {
							this.addClass($dayTds, "date-disabled");
						}
						var self = this;
						dayTds[i].onclick = function() {
							if (self.hasClass(this, "date-disabled")) {
								return;
							}
							calendar.goNextMonth(this.innerHTML);
						};
						break;
				}
				if (i > dataArray.length - 1) {
					break;
				}
				if (dayTds[i].innerHTML == calendar.dateValue && this.hasClass($dayTds, "currentMonth")) {
					if (!this.hasClass($dayTds, "date-disabled")) {
						this.addClass($dayTds, "date-normal-checked");
					}
				}
			}
		},
		getAbsPoint: function(e) {
			var boxInfo = e.getBoundingClientRect(),
				result = {
					left: 0,
					top: 0,
					bottom: 0,
					right: 0,
					width: 0,
					height: 0
				};
			if (boxInfo && boxInfo.bottom) {
				result.bottom = boxInfo.bottom;
			}
			if (boxInfo && boxInfo.height) {
				result.height = boxInfo.height;
			}
			if (boxInfo && boxInfo.left) {
				result.left = boxInfo.left;
			}
			if (boxInfo && boxInfo.right) {
				result.right = boxInfo.right;
			}
			if (boxInfo && boxInfo.top) {
				result.top = boxInfo.top;
			}
			if (boxInfo && boxInfo.width) {
				result.width = boxInfo.width;
			}

			return result;
		},
		// 根据页面大小和时间组件的位置自适应展开面板的位置
		datePanelPosition: function() {
			var xy = this.getAbsPoint($(this.container).find(".date-input")[0]);
			// var xy = this.getAbsPoint(this.container.getElementsByClassName("date-input")[0]);
			xy.bottom += 5;
			var pageWidth = document.body.clientWidth, //页面宽度
				pageHeight = document.body.clientHeight, //页面高度
				panelHeight = 413, //面板高度
				panelWidth = 320, //面板宽度
				posLeft = xy.left, //面板定位left值
				posTop = xy.bottom, //面板定位top值
				rightFix = 0, //往左侧推移距离
				bottomFix = 0; //往上侧推移距离(面板在时间框下面)
			if (this.isOnlyDay) {
				panelHeight = 371;
			}
			if (pageWidth - xy.left < panelWidth) {
				//页面右侧放不下面板
				rightFix = panelWidth - (pageWidth - xy.left) + 5; //留出5px阴影距离
			}
			if (pageHeight - xy.bottom < panelHeight) {
				//页面下方放不下
				if (xy.top < panelHeight) {
					//页面上面放不下, 放下面,加微调
					bottomFix = panelHeight - (pageHeight - xy.bottom) + 5; //留出5px阴影距离
				} else {
					//页面上面放得下
					posTop = xy.top - panelHeight - 5;
					bottomFix = 0;
				}
			}
			//...不在继续处理左边放不下的, 这不可能

			this.panel.style.left = posLeft - rightFix + "px";
			this.panel.style.top = posTop - bottomFix + "px";
		},
		getMonthViewArray: function(year, month) {
			var mvArray = [];
			var cont = 1;
			var dayOfFirstDay = new Date(year, month, 1).getDay();
			var preMonth = new Date(year, month, 0).getDate();
			var daysOfMonth = new Date(year, month + 1, 0).getDate();
			for (var i = dayOfFirstDay - 1; i >= 0; --i) {
				mvArray[i] = {
					value: preMonth,
					type: "preMonth"
				};
				--preMonth;
			}
			for (var i = 0; i < daysOfMonth; i++) {
				mvArray[i + dayOfFirstDay] = {
					value: i + 1,
					type: "currentMonth"
				};
			}
			for (var i = mvArray.length; i < 42; i++) {
				mvArray[i] = {
					value: cont,
					type: "nextMonth"
				};
				cont++;
			}
			return mvArray;
		},
		goPrevMonth: function(clickVal) {
			this.getShowValue();
			if (this.year === beginYear && this.month === 0) {
				return;
			}
			this.month--;
			if (this.month === -1) {
				this.year--;
				this.calendarYear.currentValue = this.year;
				this.month = 11;
			}
			this.calendarMonth.currentValue = this.context.months[this.month];
			this.dateValue = clickVal ? clickVal : 1;
			this.date = new Date(this.year, this.month, this.dateValue, this.hour, this.minute, this.second);
			this.bindData();
		},
		goNextMonth: function(clickVal) {
			this.getShowValue();
			if (this.year === endYear && this.month === 11) {
				return;
			}
			this.month++;
			if (this.month === 12) {
				this.year++;
				this.calendarYear.currentValue = this.year;
				this.month = 0;
			}
			this.calendarMonth.currentValue = this.context.months[this.month];
			this.dateValue = clickVal ? clickVal : 1;
			this.date = new Date(this.year, this.month, this.dateValue, this.hour, this.minute, this.second);
			this.bindData();
		},
		clearTime: function() {
			this.myValue = "";
			this.isShowTime = false;
			this.$nextTick(
				function() {
					this.$emit("change", null);
				}.bind(this)
			);
		},
		currentTime: function() {
			this.date = new Date();
			this.year = this.date.getFullYear();
			this.month = this.date.getMonth();
			this.hour = this.date.getHours();
			this.minute = this.date.getMinutes();
			this.second = this.date.getSeconds();
			this.dateValue = this.date.getDate();
			this.calendarYear.currentValue = this.year;
			this.calendarMonth.currentValue = this.context.months[this.month];
			this.bindData();
			this.confirmTime(true);
		},
		confirmTime: function(flag) {
			if (!flag) {
				this.getShowValue();
			}
			var oldValue = this.myValue,
				dateObj = new Date(this.year, this.month, this.dateValue, this.hour, this.minute, this.second);
			this.myValue = this.isDisabledDate(dateObj)
				? oldValue
				: sunSet.Dates.format(
						new Date(this.year, this.month, this.dateValue, this.hour, this.minute, this.second),
						this.dateFormat
				  );
			if (flag) {
				this.myValue = sunSet.Dates.format(
					new Date(this.year, this.month, this.dateValue, this.hour, this.minute, this.second),
					this.dateFormat
				);
			}
			this.isShowTime = false;
			var date = this.myValue.replace(/-/g, "/");
			var timestamp = new Date(date).getTime();
			this.$nextTick(() => {
				this.$emit("change", timestamp);
			});
		},
		clickOption: function(selectoption, sel) {
			this[selectoption].optionClick(sel);
			this.year = this.calendarYear.currentValue;
			this.month = this.calendarMonth.currentValue - 1;
			this.dateValue = 1;
			this.bindData();
		}
	}
};
</script>
<style lang="less">
.np-date-picker-panel {
	min-width: 172px;
	max-width: 100%;
	height: 28px;
	display: inline-block;
	vertical-align: middle;
}
	.date-input {
		width: 100%;
		display: inline-block;
		border: 1px solid #d1dbe5;
		height: 28px;
		background-color: white;
		&.disabledInput {
			background-color: #eef1f6;
			&:hover {
				border-color: #d1dbe5 !important;
			}
		}
		.disabled-input {
			background-color: #eef1f6;
			border: 1px solid #eef1f6;
			color: #bbb;
			cursor: not-allowed;
		}
	}
	.clearableStyle {
		margin-left: 35px;
	}
	.date-input .date_icon {
		display: block;
		float: right;
		width: 20px;
		height: 28px;
		background: url("./datepicker.png") no-repeat;
		background-position-y: 6px;
		cursor: pointer;
	}
	.time-input {
		-webkit-appearance: none;
		background-image: none;
		width: calc(~"100% - 20px");
		height: 26px;
		display: inline-block;
		border: 1px solid #fff;
		box-sizing: border-box;
		color: #333;
		font-size: 12px;
		background-color: #fff;
		line-height: 26px;
		outline: none;
		padding: 0 8px;
		float: left;
	}

	.date-input.inputactive {
		border-color: #40a4ff;
	}
	.date-input:not(.inputactive):hover {
		border-color: #8391a5;
	}
	#calendarPanel {
		position: fixed;
		z-index: 100002;
		background-color: #fff;
		border: 1px solid #ccc;
		width: 320px;
		font-size: 12px;
		border-radius: 5px;
		line-height: 30px;
		box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.1);
		.xui-scroll {
			height: 100%;
		}
	}
	#calendarYear {
		width: 70px;
	}
	#calendarMonth {
		width: 55px;
		margin-left: 10px;
	}
	.tableHeader {
		padding: 18px 14px 5px 14px;
		border-collapse: separate;
		border-spacing: inherit;
	}
	.th_head {
		padding: 5px;
		border-bottom: 1px solid #ebeef5;
		color: #606266;
	}
	#calendarTable {
		padding: 0 15px;
		border-collapse: separate;
		border-spacing: inherit;
	}
	#calendarTable tr td {
		width: 27px;
		height: 27px;
		box-sizing: border-box;
		text-align: center;
		cursor: pointer;
		position: relative;
		padding: 4px 0 4px 10px;
	}
	#calendarTable tr td span {
		font-size: 12px;
		display: block;
		width: 27px;
		height: 27px;
		line-height: 27px;
		border-radius: 50%;
	}
	#calendarTable .preMonth,
	.nextMonth {
		color: #c0c4cc;
	}
	#calendarTable tr:nth-child(2) {
		margin-top: 15px;
	}
	#calendarHour {
		margin-left: 15px;
		margin-right: 10px;
	}
	#calendarMinute {
		margin-left: 10px;
		margin-right: 10px;
	}
	#calendarSecond {
		margin-left: 10px;
	}
	.select_container {
		position: relative;
		margin-top: 10px;
		height: 30px;
	}

	.select_container span {
		width: 42px;
		height: 27px;
		display: inline-block;
		line-height: 27px;
		margin-left: 25px;
	}
	.select_main {
		display: inline-block;
		height: 26px;
		position: relative;
		width: 100%;
		float: left;
		margin-left: 50px;
	}
	.date_picker_bottom {
		position: relative;
		height: 45px;
		padding-top: 10px;
		padding-left: 59px;
		margin-top: 14px;
		border-top: 1px solid #cccccc;
	}
	.date_picker_bottom button {
		width: 60px;
		border-radius: 3px;
	}
	.date_picker_bottom .el-button.gray {
		color: #606266;
		background-color: #e5e5e5;
		border-color: #e5e5e5;
		float: left;
	}
	.date_picker_bottom .el-button.blue {
		float: left;
	}
	.date_picker_bottom .el-button.gray:hover {
		opacity: 0.8;
	}
	.select_main .select_text {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		float: right;
		margin: 0px;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
		height: 26px;
		line-height: 25px;
		text-indent: 10px;
		box-sizing: border-box;
		border: #ddd 1px solid;
		&:hover {
			border-color: #aaa;
		}
	}
	input.select_text::-webkit-outer-spin-button,
	input.select_text::-webkit-inner-spin-button {
		appearance: none !important;
	}
	.select_main .select_dropDown {
		position: absolute;
		z-index: 1;
		top: 100%;
		left: 0;
		width: 100%;
		height: 300px;
		margin: 0;
		padding: 0;
		overflow-y: auto;
		background: #fff;
		border: 1px solid #ccc;
		box-shadow: 6px 6px 0px rgba(34, 34, 34, 0.1);
		transition-property: top;
		transition-duration: 0.3s;
		-moz-transition-property: top;
		-moz-transition-duration: 0.3s;
		-webkit-transition-property: top;
		-webkit-transition-duration: 0.3s;
		-o-transition-property: top;
		-o-transition-duration: 0.3s;
	}
	.select_main .select_dropDown.specialPosition {
		top: -300px;
		box-shadow: none;
	}
	.select_main .select_dropDown li {
		list-style: none;
		padding: 0 10px;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
		text-align: center;
	}
	.select_main .select_dropDown li:hover {
		background-color: #f9f9f9;
	}
	.select_main .select_dropDown .option_item {
		cursor: pointer;
	}
	.select_main .select_dropDown .option_item:hover {
		background-color: #f9f9f9;
		color: #999;
	}
	.select_main .select_dropDown .option_selected {
		background-color: #f9f9f9;
		color: #444;
		font-weight: 700;
	}

	.select_main .select_arrow {
		position: absolute;
		top: 0;
		right: 0;
		height: 26px;
		cursor: pointer;
		text-align: center;
		font-size: 14px;
		width: 20px;
		font-size: 12px;
		color: #999;
	}
	.select_main .select_arrow:hover:before {
		border-top-color: #999;
	}
	.select_main .select_arrow:before {
		content: " ";
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 5px solid #cccccc;
		display: block;
		width: 0;
		height: 0;
		top: 0;
		right: 5px;
		bottom: 0;
		position: absolute;
		margin: auto 0;
	}
	.select_main .open_select_arrow {
		border-color: #51a7e8;
	}
	.select_main .open_select_arrow:before {
		border-top: none;
		border-bottom: 5px solid #cccccc;
	}
	.datePickerCover {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
	}
	/*日期结点控制状态类*/
	.date-normal {
		color: #444;
	}
	.date-normal:not(.date-normal-checked, .date-disabled):hover {
		color: #40a4ff !important;
	}
	.date-normal-checked {
		color: #fff;
		background-color: #40a4ff;
	}
	.date-pre-month,
	.date-next-month,
	.date-disabled {
		color: #c0c4cc;
	}
	.date-disabled {
		cursor: not-allowed;
	}
	.disabled {
		cursor: not-allowed !important;
		color: #c0c4cc;
	}
.toggle-enter,
.toggle-leave-active {
	opacity: 0;
	transform: translateY(-10px);
}
.toggle-enter-active,
.toggle-leave-active {
	transition: all ease 0.2s;
}
.picker-panel__iframe {
	position: absolute;
	top: 0;
	left: 0;
	background: transparent;
	pointer-events: none; /*鼠标穿透效果*/
	border: 0;
}
</style>