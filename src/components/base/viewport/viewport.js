import Sunset from "src/common/sunset";
import scrollbarwidth from "./scrollbarwidth";
import listenResize from "./listenResize.js";

/**
 * 高性能树
 *
 * author:sunset
 */

function Viewport(el, options, $vm) {
	this.$el = el;
	this.$vm = $vm;
	this.options = options || {};
	this.init();
}

function getElAttribute(el, attrName) {
	if (el) {
		var attrs = el.attributes || [];
		for (var i = 0, attr; (attr = attrs[i++]); ) {
			if (attr.name == attrName) {
				return attr.value;
			}
		}
	}
}
function closest(el, className) {
	if (!el) {
		return null;
	}
	while (true) {
		if (~(" " + el.className + " ").indexOf(" " + className + " ")) {
			return el;
		}
		if (el.parentNode == null) {
			return null;
		}
		el = el.parentNode;
	}
	return null;
}

function addClass(el, value) {
	var classes = (value || "").split(",");
	var j = 0;
	var cur = el.nodeType === 1 && (el.className ? " " + el.className + " " : " ");
	var clazz = null;
	while ((clazz = classes[j++])) {
		if (cur.indexOf(" " + clazz + " ") < 0) {
			cur += clazz + " ";
		}
	}
	var finalValue = cur.trim();
	if (el.className !== finalValue) {
		el.className = finalValue;
	}
}

function removeClass(el, value) {
	var classes = (value || "").split(",");
	var j = 0;
	var cur = el.nodeType === 1 && (el.className ? " " + el.className + " " : " ");
	var clazz = null;
	while ((clazz = classes[j++])) {
		while (cur.indexOf(" " + clazz + " ") >= 0) {
			cur = cur.replace(" " + clazz + " ", " ");
		}
	}
	var finalValue = cur.trim();
	if (el.className !== finalValue) {
		el.className = finalValue;
	}
}

Viewport.prototype = {
	constructor: Viewport,
	/**
	 * 初始化
	 */
	init() {
		this.initStatus();
		this.initRecordsWrap();
		this.initOptions();
		this.initEvent();
		this.initScroll();
		this.initWrapStatus();
		this.render();
	},
	/**
	 * 初始化状态
	 */
	initStatus() {
		//数据缓存
		this.records = [];
	},
	/**
	 * 初始化dom结构
	 */
	initRecordsWrap() {
		//container
		var $container = (this.$container = document.createElement("DIV"));
		$container.style.position = "relative";
		$container.className = "xui-viewport-scroll";
		if (this.options.containerHeight) {
			$container.style.height = `${
				Sunset.isFunction(this.options.containerHeight)
					? this.options.containerHeight()
					: this.options.containerHeight
			}px`;
		}
		var barWidth = scrollbarwidth();
		$container.style.marginRight = `-${barWidth}px`;
		this.$el.appendChild($container);
		//wrap
		var $wrap = (this.$wrap = document.createElement("DIV"));
		$wrap.style.position = "relative";
		$wrap.className = "xui-viewport-wrap";
		$wrap.style.height = `100%`;
		this.$container.appendChild($wrap);
		//records
		var $records = (this.$records = document.createElement("DIV"));
		$records.className = "xui-viewport-records";
		this.$wrap.appendChild($records);
		$records.style.position = "absolute";
		//slider
		var $sliderBar = (this.$sliderBar = document.createElement("DIV"));
		$sliderBar.className = "xui-viewport-scroll-bar vertical";
		this.$el.appendChild($sliderBar);
		var $slider = (this.$slider = document.createElement("DIV"));
		$slider.className = "xui-viewport-scroll-bar-slider";
		this.$sliderBar.appendChild($slider);
	},
	/**
	 * 初始化配置
	 */
	initOptions() {
		var options = this.options;
		var keyMap = options.key || {};
		this.rootId = options.rootId || null;
		this.pIdKey = keyMap.parentId || "parentId";
		this.idKey = keyMap.id || "id";
		this.nameKey = keyMap.name || "name";
		this.titleKey = keyMap.title || "name";
		this.callbacks = options.callbacks || {};
		//焦点选中
		var focus = options.focus || {};
		this.enableFocus = focus.enable;
		this.focusOn = focus.focusOn || "click";
		this.multiFocus = Sunset.isFunction(focus.multiple) ? focus.multiple() : !!focus.multiple;
		//勾选
		var check = options.check || {};
		this.enableCheck = check.enable;
		this.isCheckMultiple = check.type == "multiple";
		this.isCheckCascdeChildren = check.cascade && check.cascade.indexOf("C") >= 0;
		this.isCheckCascdeParent = check.cascade && check.cascade.indexOf("P") >= 0;
	},
	/**
	 * 初始化滚动
	 */
	initScroll() {
		this.unlistenResize = listenResize(this.$wrap, () => {
			this._updateBar();
		});
		this._updateBar();

		//drag and click
		var self = this;
		function setVSliderTop(newTop) {
			self.$slider.style.top = `${newTop}px`;
			self.$container.scrollTop = ((newTop * 1.0) / self.scrollBarSpaceHeight) * self.scrollSpaceHeight;
		}
		var startTop = 0,
			startX = 0,
			startY = 0;
		this.$sliderBar.addEventListener("click", ev => {
			if (self.draging) {
				return;
			}
			if (ev.target == self.$sliderBar) {
				setVSliderTop(ev.offsetY - self.scrollSliderHeight * 0.5);
			}
		});
		function down(ev) {
			self.draging = true;
			startTop = parseInt(self.$slider.style.top);
			startX = ev.pageX;
			startY = ev.pageY;
			self.$el.style.userSelect = self.$el.style.webkitUserSelect = "none";
			addClass(self.$sliderBar, "hover");
		}
		function move(ev) {
			var offsetY = ev.pageY - startY;
			var newTop = startTop + offsetY;
			newTop = Math.max(newTop, 0);
			newTop = Math.min(self.scrollBarSpaceHeight, newTop);
			setVSliderTop(newTop);
		}
		function up(ev) {
			self.draging = false;
			document.body.style.userSelect = document.body.style.webkitUserSelect = "";
			removeClass(self.$sliderBar, "hover");
			setTimeout(() => {
				self.draging = false;
			});
		}
		function unmove(ev) {
			up(ev);
			document.removeEventListener("mousemove", move);
			document.removeEventListener("mouseup", unmove);
		}
		this.$slider.addEventListener("mousedown", ev => {
			down(ev);
			document.addEventListener("mousemove", move);
			document.addEventListener("mouseup", unmove);
		});
	},
	_updateBar() {
		var pane = this.$container,
			vslider = this.$slider,
			clientHeight = pane.clientHeight,
			scrollHeight = pane.scrollHeight,
			barHeight = this.$sliderBar.clientHeight;
		var sliderHeightPoint = (pane.clientHeight * 1.0) / pane.scrollHeight;
		var sliderHeight = barHeight * sliderHeightPoint;
		var diff = 0;
		if (sliderHeight < 50) {
			sliderHeight = 50;
		}
		vslider.style.height = `${sliderHeight}px`;
		this.scrollSliderHeight = sliderHeight;
		this.scrollSpaceHeight = scrollHeight - clientHeight;
		this.scrollBarSpaceHeight = barHeight - sliderHeight;
		this._scrollHandle(false);
		this.vscroll = this.scrollSpaceHeight > 0;
		if (clientHeight == scrollHeight) {
			removeClass(this.$sliderBar, "visible");
		} else {
			addClass(this.$sliderBar, "visible");
		}
	},
	_scrollHandle(flag) {
		if (this.draging) {
			return;
		}
		var pane = this.$container,
			clientHeight = pane.clientHeight,
			scrollHeight = pane.scrollHeight,
			scrollTop = pane.scrollTop;
		var move = (scrollTop * 1.0) / this.scrollSpaceHeight;
		this.$slider.style.top = `${move * this.scrollBarSpaceHeight}px`;
	},
	/**
	 * 初始化dom结构状态
	 */
	initWrapStatus() {
		var wrapRecordCount;
		this.containerHeight = this.options.containerHeight
			? Sunset.isFunction(this.options.containerHeight)
				? this.options.containerHeight()
				: this.options.containerHeight
			: this.$el.clientHeight;
		this.recordHeight =
			this.recordHeight ||
			(Sunset.isFunction(this.options.recordHeight)
				? this.options.recordHeight()
				: this.options.recordHeight || 30);
		wrapRecordCount = Math.ceil(this.containerHeight / this.recordHeight) + 1;
		if (wrapRecordCount == 0 || isNaN(wrapRecordCount)) {
			wrapRecordCount = 80;
		}
		if (wrapRecordCount != this.wrapRecordCount) {
			this._updateBar();
			this.wrapRecordCount = wrapRecordCount;
		}
		// console.log("containerHeight:" + this.containerHeight);
		// console.log("recordHeight:" + this.recordHeight);
	},
	/**
	 * 初始化事件
	 */
	initEvent() {
		var callbacks = this.callbacks;
		this.$container.addEventListener("scroll", () => {
			var start = Math.floor(this.$container.scrollTop / this.recordHeight);
			this.render(start);
			this._scrollHandle();
		});
		this.$container.addEventListener("mousedown", ev => {
			ev.preventDefault();
		});
		this.$container.addEventListener("click", ev => {
			var index = getElAttribute(closest(ev.target, "xui-viewport-record"), "data-index");
			if (!isNaN(index)) {
				this.operate(index, ev);
			}
		});
	},
	/**
	 * 渲染
	 * @param {int} start 渲染起始位置
	 */
	render(start) {
		// console.time("all");
		// console.time("struct");
		var records = this.records;
		var range = this._caculateRenderStart(start),
			start = range.start,
			end = range.end;
		var html = [];
		if (!records || records.length == 0) {
			html = this._renderEmpty();
		} else {
			for (var i = start; i < end; i++) {
				html.push(this._template(records[i], i));
			}
		}
		// console.timeEnd("struct");
		this.$records.style.top = start * this.recordHeight + "px";
		this.$wrap.style.height = records.length * this.recordHeight + "px";
		// console.time("innerHTML");
		// this.$records.innerHTML = html.join("");
		var $records = this.$records;
		delete this.$records;
		$records = this.replaceHtml($records, html.join(""));
		this.$records = $records;
		// console.timeEnd("innerHTML");
		// console.timeEnd("all");
	},
	_renderEmpty() {
		var html = [];
		html.push(`<div class="xui-viewport-empty">`);
		if (this.options.empty) {
			html.push(Sunset.isFunction(this.options.empty) ? this.options.empty() : this.options.empty);
		}
		html.push("</div>");
		return html;
	},

	/**
	 * 计算渲染可视域的起始和终止位置
	 *
	 * @param {int} start 渲染起始位
	 *
	 */
	_caculateRenderStart(start) {
		start = start === void 0 ? (this.lastStart === void 0 ? 0 : this.lastStart) : start;
		this.lastStart = start;
		var records = this.records || [];
		this.initWrapStatus();
		var end = Math.min(start + this.wrapRecordCount + 5, records.length); //+5个，延伸出视窗，防止闪烁
		if (end - start < this.wrapRecordCount) {
			start = Math.max(end - this.wrapRecordCount, 0);
		}
		start = Math.max(start, 0);
		// console.log(start);
		return {
			start,
			end
		};
	},
	/**
	 * 重置起始渲染
	 */
	_resetRender() {
		if (this.$container.scrollTop == 0) {
			this.render(0);
		} else {
			this.$container.scrollTop = "0px";
		}
	},
	/**
	 * 构建单个条目的dom
	 * @param {*} record
	 * @param {*} level
	 */
	_template(record, index) {
		var html = [];
		html.push(`<div class="xui-viewport-record" data-index="${index}">`);
		if (Sunset.isFunction(this.options.template)) {
			// var d = this.$vm.$vue.compile(this.options.template(record),{},this.$vm);
			// this.$vm.$el.appendChild(d);
			html.push(`${this.options.template(record)}`);
		} else {
			console.error("viewport record-render template is not a function");
		}
		html.push("</div>");
		return html.join("");
	},
	/**
	 * 高性能更新dom
	 * @param {dom} el 目标dom
	 * @param {String} html 内容
	 */
	replaceHtml(el, html) {
		var oldEl = typeof el === "string" ? document.getElementById(el) : el;
		var newEl = oldEl.cloneNode(false);
		newEl.innerHTML = html;
		oldEl.parentNode.replaceChild(newEl, oldEl);
		return newEl;
	},
	/**
	 * 设置全量数据
	 */
	setRecords(records) {
		this.records = records || [];
		setTimeout(() => {
			this._resetRender();
		}, 0);
	},
	/**
	 * 追加数据
	 * @param {*} records
	 */
	appendRecords(records) {
		this.records = this.records.concat(records);
		setTimeout(() => {
			this.render();
		}, 0);
	},
	removeRecord(filter) {
		if (Sunset.isFunction(filter)) {
			this.records = this.records.filter(filter);
		} else {
			this.records.splice(this.records.indexOf(filter), 1);
		}
		setTimeout(() => {
			this.render();
		}, 0);
	},
	clear() {
		this.records = [];
		setTimeout(() => {
			this._resetRender();
		}, 0);
	},
	operate(index, ev) {
		var record = this.records[index];
		if (Sunset.isFunction(this.options.operate)) {
			this.options.operate(record, ev, index);
		}
	}
};

export default Viewport;
