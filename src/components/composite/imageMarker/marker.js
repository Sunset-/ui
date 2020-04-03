import Sunset from "../../../common/sunset";
/**
 * 继承
 * @param  {function} C [子类]
 * @param  {function} P [父类]
 * @param  {object} ext [扩展]
 * @return {undifined}    无
 */
var extend = (function() {
	var F = function() {};
	return function(P, C, ext) {
		F.prototype = P.prototype;
		var cp = (C.prototype = new F());
		cp.__super = P.prototype; //添加父类原型引用
		if (ext) {
			for (var k in ext) {
				if (ext.hasOwnProperty(k)) {
					cp[k] = ext[k];
				}
			}
		}
		C.prototype.constructor = C;
		return C;
	};
})();

var PubSub = function(context) {
	this.context = context;
	this.callbacks = {};
};
PubSub.prototype = {
	/**
	 * 获取回调集合
	 */
	_getCallbacks: function() {
		return this.callbacks || (this.callbacks = {});
	},
	/**
	 * 注册事件
	 * @param  {[type]}   ev       事件名称
	 * @param  {Function} callback 回调
	 * @return {[type]}            [description]
	 */
	subscribe: function(ev, callback) {
		var callbacks = this._getCallbacks();
		if (typeof callback == "function") {
			(callbacks[ev] || (callbacks[ev] = [])).push(callback);
		} else if (Object.prototype.toString.call(callback) === "[object Array]") {
			var singleCb;
			for (var i = 0, l = callback.length; i < l; i++) {
				if (typeof (singleCb = callback[i]) == "function") {
					(callbacks[ev] || (callbacks[ev] = [])).push(singleCb);
				}
			}
		}
	},
	/**
	 * 发布事件
	 * @return {[type]} [description]
	 */
	publish: function() {
		var callbacks = this._getCallbacks();
		var args = Array.prototype.slice.call(arguments, 0),
			ev = args.shift(),
			calls = callbacks[ev];
		if (ev && calls) {
			var l;
			if ((l = calls.length) == 1) {
				return calls[0].apply(this.context, args);
			} else {
				for (var i = 0; i < l; i++) {
					calls[i].apply(this.context, args);
				}
			}
		}
	},
	/**
	 * 发布事件
	 * @return {[type]} [description]
	 */
	publishAsync: function() {
		var callbacks = this._getCallbacks();
		var args = Array.prototype.slice.call(arguments, 0),
			ev = args.shift(),
			calls = callbacks[ev],
			self = this;
		if (ev && calls) {
			var l;
			if ((l = calls.length) == 1) {
				setTimeout(function() {
					calls[0].apply(self.context, args);
				});
			} else {
				for (var i = 0; i < l; i++) {
					(function(i) {
						setTimeout(function() {
							calls[i].apply(self.context, args);
						});
					})(i);
				}
			}
		}
	},
	/**
	 * 取消订阅
	 * @param  {[type]}   ev       事件名称
	 * @param  {Function} callback 回调函数
	 * @return {[type]}            [description]
	 */
	unsubscribe: function(ev, callback) {
		var callbacks = this._getCallbacks();
		var cbs;
		if ((cbs = callbacks[ev])) {
			if (callback) {
				for (var i = 0, l = cbs.length; i < l; i++) {
					if (cbs[i] === callback) {
						cbs.slice(i);
					}
				}
			} else {
				callbacks[ev] = null;
			}
		}
	},
	/**
	 * 注册事件集合
	 * @param  {[type]} events [description]
	 * @return {[type]}        [description]
	 */
	regist: function(events) {
		if (events) {
			for (var ev in events) {
				if (events.hasOwnProperty(ev)) {
					this.subscribe(ev, events[ev]);
				}
			}
		}
		return this;
	}
};

//标注器

var Marker = extend(
	PubSub,
	function(container, options) {
		this.options = options || {};
		this.state = {
			markType: "FONT",
			style: {
				lineColor: "red",
				lineWidth: 2,
				fontColor: "red",
				fontStyle: "normal 14px arial,sans-serif"
			}
		};
		this.currentMark = null;
		this.marks = [];
		this.recoverMarks = [];
		this.container = container;
		this._initCanvas(container);
	},
	{
		reset(options) {
			this.clearMarks();
			this.resize(options);
		},
		resize(options) {
			this.options = options;
			if (this.container) {
				this.cvs.width = this.container.offsetWidth;
				this.cvs.height = this.container.offsetHeight;
			}
			this.refresh();
		},
		getScale() {
			return this.options.scale;
		},
		_initCanvas(container) {
			var canvas = document.createElement("canvas");
			var width = container.offsetWidth,
				height = container.offsetHeight;
			canvas.width = width;
			canvas.height = height;
			container.appendChild(canvas);

			this.cvs = canvas;
			this.ctx = canvas.getContext("2d");

			canvas.addEventListener("mousedown", ev => {
				var scale = this.getScale();
				if (this.state.markType == "FONT") {
					this.publish("MARK_FONT", {
						sx: ev.offsetX / scale,
						sy: ev.offsetY / scale
					});
					return;
				}
				//DOWN
				if (Marker.MARK_TYPE[this.state.markType]) {
					var mark = (this.currentMark = this.createMark(
						this.state.markType,
						{
							sx: ev.offsetX / scale,
							sy: ev.offsetY / scale,
							ex: ev.offsetX / scale,
							ey: ev.offsetY / scale
						},
						this.state.style
					));
					this._addMark(mark);
				}
				var self = this;
				function mousemove(ev) {
					//MOVE
					var mark = self.currentMark;
					if (mark) {
						mark.modify({
							ex: ev.offsetX / scale,
							ey: ev.offsetY / scale
						});
						self.refresh();
					}
				}
				function mouseup(ev) {
					//UP
					document.removeEventListener("mousemove", mousemove);
					document.removeEventListener("mouseup", mouseup);
				}
				document.addEventListener("mousemove", mousemove);
				document.addEventListener("mouseup", mouseup);
			});
		},
		setMarkType(type) {
			if (!Marker.MARK_TYPE[type]) {
				Sunset.warning(`未注册标注类型:${type}`);
				return;
			}
			this.state.markType = type;
		},
		setMarkStyle(style) {
			Object.assign(this.state.style, style);
		},
		createMark(type, params, style) {
			return new Marker.MARK_TYPE[type](Sunset.clone(params), Sunset.clone(style), this);
		},
		_addMark(mark) {
			this.marks.push(mark);
			this.recoverMarks = [];
			this.refresh();
		},
		markFont(text, pos) {
			if (typeof text == "string") {
				text = [text];
			}
			pos.text = text;
			this._addMark(this.createMark("FONT", pos, this.state.style));
		},
		backspace() {
			if (this.marks.length) {
				this.recoverMarks.push(this.marks.pop());
				this.refresh();
			}
		},
		recover() {
			if (this.recoverMarks.length) {
				this.marks.push(this.recoverMarks.pop());
				this.refresh();
			}
		},
		refresh() {
			this.clear();
			this.marks.forEach(m => {
				m.refresh(this.ctx);
			});
		},
		clear() {
			this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
		},
		setMarks(markObjs) {
			this.clearMarks();
			this.addMarks();
		},
		addMarks(markObjs) {
			if (Sunset.isArray(markObjs)) {
				var marks = [];
				markObjs.forEach(obj => {
					if (Marker.MARK_TYPE[obj.type]) {
						marks.push(this.createMark(obj.type, obj.params, obj.style));
					} else {
						Sunset.warning(`未注册标注类型:${type}`);
					}
				});
				this.marks.push.apply(this.marks, marks);
				this.recoverMarks = [];
				this.refresh();
			}
		},
		getMarks() {
			return this.marks.map(mark => ({
				type: mark.type,
				params: Sunset.clone(mark.params),
				style: Sunset.clone(mark.style)
			}));
		},
		clearMarks() {
			this.marks = [];
			this.recoverMarks = [];
			this.clear();
		},
		createSnapshoot(img) {
			var cvs = document.createElement("canvas");
			cvs.context = cvs.getContext("2d");
			// cvs.style.display = "none";
			cvs.width = img.naturalWidth;
			cvs.height = img.naturalHeight;
			var ctx = cvs.getContext("2d");
			//图
			ctx.drawImage(img, 0, 0);
			//标注
			var scale = this.options.scale;
			this.options.scale = 1;
			this.marks.forEach(m => {
				m.refresh(ctx);
			});
			this.options.scale = scale;
			var base64Data = cvs.toDataURL("image/png");
			cvs.remove();
			return base64Data;
		}
	}
);
Marker.MARK_TYPE = {};

//标注
function Mark(params, style, marker) {
	this.params = params || {};
	this.style = style || {};
	this.marker = marker;
}
Mark.prototype = {
	modify: function(params) {
		Object.assign(this.params, params);
	},
	refresh(ctx) {
		var rawParams = this.params;
		this.params = this.calculateScale(rawParams);
		this.draw(ctx);
		this.params = rawParams;
	},
	calculateScale(rawParams) {
		var params = {},
			scale = this.marker.getScale();
		Object.keys(rawParams).forEach(key => {
			if (rawParams.hasOwnProperty(key)) {
				if (typeof rawParams[key]=='number') {
					params[key] = rawParams[key] * scale;
				} else {
					params[key] = rawParams[key];
				}
			}
		});
		return params;
	},
	draw: function(ctx, cvs) {
		console.warn("子类未实现draw方法");
	}
};
Mark.prototype.constructor = Mark;

//直线
Marker.MARK_TYPE.LINE = extend(
	Mark,
	function(params, style) {
		this.type = "LINE";
		this.__super.constructor.apply(this, [].slice.call(arguments, 0));
	},
	{
		draw: function(ctx, cvs) {
			var params = this.params,
				style = this.style;
			ctx.save();
			// line
			ctx.beginPath();
			ctx.lineWidth = style.lineWidth;
			ctx.strokeStyle = style.lineColor;
			ctx.moveTo(params.sx, params.sy);
			ctx.lineTo(params.ex, params.ey);
			ctx.stroke();

			ctx.restore();
		}
	}
);

//箭头
Marker.MARK_TYPE.ARROWS = extend(
	Mark,
	function(params, style) {
		this.type = "ARROWS";
		this.__super.constructor.apply(this, [].slice.call(arguments, 0));
	},
	{
		draw: function(ctx, cvs) {
			var params = this.params,
				dx = params.ex - params.sx,
				dy = params.ey - params.sy,
				rotation = Math["atan2"](dy, dx) + Math["PI"] / 2,
				style = this.style;
			ctx.save();
			ctx.lineWidth = style.lineWidth;
			ctx.strokeStyle = style.lineColor;
			ctx.beginPath();
			ctx.moveTo(params.sx, params.sy);
			ctx.lineTo(params.ex, params.ey);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
			ctx.save();
			ctx.translate(params.ex, params.ey);
			ctx.rotate(rotation);
			ctx.lineWidth = style.lineWidth;
			ctx.beginPath();
			ctx.moveTo(0, 2);
			ctx.lineTo(-2, 4);
			ctx.lineTo(0, 0);
			ctx.lineTo(2, 4);
			ctx.lineTo(0, 2);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
			ctx.restore();
		}
	}
);

//矩形
Marker.MARK_TYPE.RECT = extend(
	Mark,
	function(params, style) {
		this.type = "RECT";
		this.__super.constructor.apply(this, [].slice.call(arguments, 0));
	},
	{
		draw: function(ctx, cvs) {
			var params = this.params,
				style = this.style,
				w = params.ex - params.sx,
				h = params.ey - params.sy;
			ctx.save();
			// line
			ctx.beginPath();
			ctx.lineWidth = style.lineWidth;
			ctx.strokeStyle = style.lineColor;
			ctx.strokeRect(params.sx, params.sy, w, h);
			ctx.restore();
		}
	}
);

//椭圆
Marker.MARK_TYPE.ELLIPSE = extend(
	Mark,
	function(params, style) {
		this.type = "ELLIPSE";
		this.__super.constructor.apply(this, [].slice.call(arguments, 0));
	},
	{
		draw: function(ctx, cvs) {
			var params = this.params,
				style = this.style,
				sx = params.sx,
				sy = params.sy,
				ex = params.ex,
				ey = params.ey,
				a = Math.abs(params.ex - params.sx) / 2,
				b = Math.abs(params.ey - params.sy) / 2,
				x = (params.sx + params.ex) / 2,
				y = (params.sy + params.ey) / 2,
				ox = 0.5 * a,
				oy = 0.6 * b;
			ctx.save();
			ctx.lineWidth = style.lineWidth;
			ctx.strokeStyle = style.lineColor;
			ctx.translate(x, y);
			ctx.beginPath();
			// 从椭圆纵轴下端开始逆时针方向绘制
			ctx.moveTo(0, b);
			ctx.bezierCurveTo(ox, b, a, oy, a, 0);
			ctx.bezierCurveTo(a, -oy, ox, -b, 0, -b);
			ctx.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
			ctx.bezierCurveTo(-a, oy, -ox, b, 0, b);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
		}
	}
);

//文字
Marker.MARK_TYPE.FONT = Marker.MARK_TYPE.TEXT = extend(
	Mark,
	function(params, style) {
		this.type = "FONT";
		this.__super.constructor.apply(this, [].slice.call(arguments, 0));
	},
	{
		/**
		 * 绘制测量结果
		 * @param  {[type]} cvs  [description]
		 * @param  {[type]} text [description]
		 * @return {[type]}      [description]
		 */
		draw: function(ctx, cvs) {
			var params = this.params,
				text = params.text,
                style = this.style;
			if (!text) {
				return;
			}
			var state = this._calculateTextBgSize(text, style.fontStyle);
			// if (params.sx + state.width > cvs.width) {
			// 	params.sx -= state.width;
			// }
			ctx.save();
			//1.绘制背景
			// ctx.beginPath();
			// ctx.fillStyle = this.isActive() ? style.ACTIVE_TEXT_BG_COLOR : style.NORMAL_TEXT_BG_COLOR;
			// ctx.rect(pos.x, pos.y, state.width, state.height);
			// ctx.fill();
			//2.绘制文字
			ctx.fillStyle = style.fontColor;
			ctx.font = style.fontStyle;
			var textY = params.sy + 14 + 2;
			for (var i = 0, t; (t = text[i++]); ) {
				ctx.fillText(t, params.sx + 3, textY);
				textY += 14 + 2;
			}
			ctx.restore();
		},
		/**
		 * 计算文字容器的尺寸
		 */
		_calculateTextBgSize: function(text, fontStyle) {
			var html = ['<div style="position:absolute;">'];
			for (var i = 0, t; (t = text[i++]); ) {
				html.push("<div>" + t + "</div>");
			}
			html.push("</div>");
			var $el = $(html.join(""))
				.css({
					visibility: "hidden",
					font: fontStyle
				})
				.appendTo($("body"));
			var state = {
				width: $el.width() + 6,
				height: $el.height() + 6 + 2 * (text.length - 1)
			};
			$el.remove();
			return state;
		}
	}
);

/**
 * 快照生成器
 */
var SnapshootCreate = (function() {
	var cvs = document.createElement("canvas");
	cvs.context = cvs.getContext("2d");
	cvs.style.display = "none";
	return function(dicomCanvas, markCanvas, marker, marks, Series) {
		//1.绘制dicom
		cvs.width = markCanvas.width;
		cvs.height = markCanvas.height;
		cvs.context.save();
		cvs.context.scale(markCanvas.width / dicomCanvas.width, markCanvas.height / dicomCanvas.height);
		let canvas;
		if (dicomCanvas.type == "WEBGL") {
			canvas = dicomCanvas.ST.changeToCanvas(function(canvas) {
				cvs.context.drawImage(canvas, 0, 0);
				//2.绘制标注
				cvs.context.restore();
				cvs.context.drawImage(markCanvas, 0, 0);
				//3.显示快照
				var data = cvs.toDataURL("image/png");
				$img.attr("src", data);
				$link.attr("href", data);
				$snapshootBox.show();
				$button.off("click");
				$button.click(function() {
					cpb.trigger("SNAPSHOOT_SELECT", {
						image: data,
						type: type
					});
				});
			});
		} else {
			canvas = dicomCanvas;

			cvs.context.drawImage(canvas, 0, 0);

			//2.绘制标注
			cvs.context.restore();
			cvs.context.drawImage(markCanvas, 0, 0);
			//3.显示快照
			var data = cvs.toDataURL("image/png");
			$img.attr("src", data);
			$link.attr("href", data);
			$snapshootBox.show();
			$button.off("click");
			$button.click(function() {
				cpb.trigger("SNAPSHOOT_SELECT", {
					image: data,
					type: type
				});
			});
			//Cateyes.GlobalPubSub.publish('AFTER_MARK_CREATED', mark);
		}
	};
})();

module.exports = Marker;
