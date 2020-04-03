let scrollBarWidth;

function isWindow(obj) {
	return obj != null && obj === obj.window;
}
function getWindow(elem) {
	return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
}

function injectObject(element, callback) {
	var OBJECT_STYLE =
		"display: block;visibility:hidden; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; padding: 0; margin: 0; opacity: 0; z-index: -1000; pointer-events: none;";
	var object = document.createElement("object");
	object.style.cssText = OBJECT_STYLE;
	object.tabIndex = -1;
	object.type = "text/html";
	object.data = "about:blank";
	object.isResizeElm = true;
	object.onload = () => {
		object.contentDocument.defaultView.addEventListener("resize", callback, false);
	};
	element.appendChild(object);
	return function destroy() {
		if (object.contentDocument) {
			callback();
		}
		element.removeChild(object);
	};
}
export default {
	offset(elem) {
		var docElem,
			win,
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if (!doc) {
			return;
		}
		docElem = doc.documentElement;

		box = elem.getBoundingClientRect();
		win = getWindow(doc);
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},
	listenResize(element, callback) {
		return injectObject(element, callback);
	},
	getScrollbarwidth() {
		if (scrollBarWidth !== undefined) return scrollBarWidth;

		const outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		outer.style.position = "absolute";
		outer.style.top = "-9999px";
		document.body.appendChild(outer);

		const widthNoScroll = outer.offsetWidth;
		outer.style.overflow = "scroll";

		const inner = document.createElement("div");
		inner.style.width = "100%";
		outer.appendChild(inner);

		const widthWithScroll = inner.offsetWidth;
		outer.parentNode.removeChild(outer);
		scrollBarWidth = widthNoScroll - widthWithScroll;

		return scrollBarWidth;
	}
};
