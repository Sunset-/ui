<style lang="scss">
.xui-filter {
	display: inline-block;
	vertical-align: middle;
	font-size: 0px;
	&.xui-filter-block {
		display: block;
	}
	&:after {
		content: "";
		display: block;
		clear: both;
	}
	.filter-search-btn {
		margin-left: 20px;
		vertical-align: middle;
	}
}
</style>
<template>
	<form :class="['xui-filter xui-form xui-filter-style',options.className,options.cols?'xui-filter-block':'']" onsubmit="return false">
		<div class="form-row">
			<template v-for="(field,index) in fields">
				<span class="newline" v-if="newline(field)" v-html="newline(field)"></span>
				<filter-field ref="fields" :class="['form-row-col','form-row-col-'+computedFieldClass(field)]" :options="field" :form-options="options" :filter="filter" v-model="filter[field.name]" @search="fieldTriggerSearch"></filter-field>
			</template>
			<filter-button class="filter-search-btn" v-if="searchButton" :options="searchButton" @click="search" />
			<filter-toolbar v-if="options.toolbar" :options="options.toolbar"></filter-toolbar>
		</div>
	</form>
</template>
<script>
import Sunset from "../../../common/sunset";
import FilterField from "./FilterField.vue";
import FilterButton from "../../base/button";
import FilterToolbar from "../toolbar";
import Utils from "../../Helper.js";

const FULL_COLS = 24;

export default {
	components: {
		FilterField,
		FilterButton,
		FilterToolbar
	},
	props: {
		options: {}
	},
	computed: {
		fields() {
			var filter = this.filter;
			return ((this.options && this.options.fields) || []).filter(field => {
				if (field.premise) {
					var pr = field.premise(filter);
					if (!pr) {
						delete this.filter[field.name];
					}
					return pr;
				} else {
					return true;
				}
			});
		},
		searchButton() {
			return (this.options && this.options.searchButton) || "";
		}
	},
	data() {
		return {
			filter: {},
			inited: false
		};
	},
	methods: {
		init() {
			var filter = this.filter,
				fields = this.fields,
				prall = [];
			this.inited = false;
			fields.forEach((field, fieldIndex) => {
				if (!field.name) {
					return;
				}
				this.$set(this.filter, field.name, void 0);
				if (field.default) {
					prall.push(
						Promise.resolve()
							.then(() => {
								return Sunset.isFunction(field.default) ? field.default() : field.default;
							})
							.then(value => {
								return {
									name: field.name,
									value: value
								};
							})
					);
				} else if (field.defaultFirst || Sunset.isNumber(field.defaultIndex)) {
					prall.push(
						Promise.resolve()
							.then(() => {
								return Utils.generateItems(field);
							})
							.then(items => {
								var index = field.defaultFirst
									? 0
									: field.defaultIndex >= 0 ? field.defaultIndex : items.length + field.defaultIndex;
								if (items && items.length) {
									return {
										name: field.name,
										value: items[index].value
									};
								} else if (Sunset.isFunction(this.$refs.fields[fieldIndex].$children[0].defaultValue)) {
									return {
										name: field.name,
										value: this.$refs.fields[fieldIndex].$children[0].defaultValue(index)
									};
								} else {
									return {
										name: field.name,
										value: void 0
									};
								}
							})
					);
				}
			});
			Promise.all(prall).then(res => {
				if (filter === this.filter) {
					res.forEach(dv => {
						filter[dv.name] = dv.value;
					});
					this.$nextTick(() => {
						this.inited = true;
						if (!this.options.lazy) {
							this.search();
						}
					});
				}
			});
		},
		reset(filter) {
			var hasFilter = !!filter;
			this.filter = Sunset.clone(filter) || {};
			if (!hasFilter) {
				this.init();
			} else {
				this.search();
			}
		},
		getFilter() {
			var filter = Object.assign({}, this.filter);
			if (Sunset.isFunction(this.options.format)) {
				filter = this.options.format(filter) || filter;
			}
			return {
				filter: filter,
				localFilter: this.generateLocalFilter()
			};
		},
		fieldTriggerSearch() {
			this.search();
		},
		search(from) {
			if (!this.fields || !this.inited) {
				return;
			}
			var filter = Sunset.clone(this.filter);
			//空值过滤
			if (this.options.filterEmpty) {
				Object.keys(filter).forEach(key => {
					if (Sunset.isEmpty(filter[key])) {
						delete filter[key];
					}
				});
			}
			//过滤钩子
			if (Sunset.isFunction(this.options.format)) {
				filter = this.options.format(filter) || filter;
			}
			this.$emit("filter", filter, this.generateLocalFilter());
		},
		generateLocalFilter() {
			var localFilterFields = this.fields.filter(item => Sunset.isFunction(item.localFilter)) || [],
				data = Sunset.clone(this.filter) || {};
			return function(record) {
				for (var i = 0, field; (field = localFilterFields[i++]); ) {
					if (!field.localFilter.call(field, record, data[field.name])) {
						return false;
					}
				}
				return true;
			};
		},
		newline(field) {
			return field.newline ? `</div><div style="z-index:-1;" class="form-row">` : "";
		},
		computedFieldClass(field) {
			if (field.monopolize) {
				return FULL_COLS;
			} else if (field.cols) {
				return field.cols;
			} else {
				var cols = this.options.cols;
				return !isNaN(cols) ? FULL_COLS / cols : 0;
			}
		}
	},
	mounted() {
		this.init();
	}
};
</script>