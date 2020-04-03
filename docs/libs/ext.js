/**
 * 组件库注册业务组件
 */

import deviceSelector from "components/device/device-selector";

module.exports = function(NetPosaXUI) {
	NetPosaXUI.Component.registFormField("deviceselector", deviceSelector);
};
