<template>
	<div>
		<div style="margin-bottom:20px;">
			 <np-info-table 
			 	:data="tableData"
				:options="options"  
			 	></np-info-table>
		</div>
	</div>
</template>

<script>
export default {

	data() {
		return {
			tableData : { 
				"people" : {
					name : 'zhangsan'
				},
				"case_name": "案件: 失联案件", 
				"sex": "1",
				"case_happening_place": "123",
				"case_register_org_id": "受理单位111",
				"case_register_time": new Date().getTime()
			},
			options: {
				items: [
					{ label : '人员名称', name : 'people.name'
						, format: function(v,data){
							return '<span style="font-weight: bold">' + v + '</span>'; 
						}
					},
					{ label : '事件名称', name : 'case_name' },
					{ label : '案件地点', name : 'case_happening_place' },
					{ label : '时间', name : 'case_register_time', 
						format: function(v) {
							return new Date(v); 
						}
					},
					{ label : '性别', name : 'sex', enum : 'SEX' }
				], 
				cols: 3,
				labelAlign: "right",
				contentAlign: "left", 
				colHeight: 28,
				labelWidth: 100,
				labelBgClolor: "#eee",
				contentBgClolor: "#fff"
			}
			 
		};
	},
	methods: {
		 
	}
};
</script>
