export default function(Vue) {
	//权限
	Vue.directive("permission", {
		update: function(newValue, oldValue) {
			// if (newValue && !(Base && Base.permissions[newValue])) {
			// 	this.el.remove();
			// }
		}
	});

	// 默认图片
	var DEFAULT_IMG = {
		DEFAULT: "/assets/img/nopic.png",
		DICOM: "/assets/img/dicom-nopic.png",
		AVATAR: "/assets/img/default-doctorhead.png"
	};
	Vue.directive("default-img", {
		update: function(newValue, oldValue) {
			var defaultImage = DEFAULT_IMG[this.expression] || DEFAULT_IMG.DEFAULT;
			this.el.onerror = () => {
				this.el.src = defaultImage;
			};
		}
	});
}
