import module_a from "./module_a";
import module_b from "./module_b";

export default {
    modules : {
        '模块A'  : 'config-module-a',
        '模块B'  : 'config-module-b',
    },
	components: {
		"config-module-a": module_a,
		"config-module-b": module_b
	}
};
