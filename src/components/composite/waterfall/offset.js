function isWindow(obj) {
	return obj != null && obj === obj.window;
}
function getWindow(elem) {
	return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
}
export default function offset(elem) {
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
}
