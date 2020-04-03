<style lang="scss">
.component-detail {
	& > h3 {
		padding: 5px;
		margin: 0px;
	}
	& > h4 {
		color: #09c;
		font-size: 16px;
		padding: 5px;
		margin: 0px;
	}
}
</style>

<template>
	<div class="component-detail">
		<template v-if="!isBusiness">
			<h3>
				<span style="color:orange;">{{options.title}}</span>
				<span>【
					<span style="color:#09c;">{{options.tag}}</span>】</span>
				<span v-if="options.doc.accendant">（维护人员：{{options.doc.accendant}}）</span>
			</h3>
			<h3>是否表单项组件：
				<span style="color:#09c;">{{!!options.doc.isFormField?'是':'否'}}</span>
			</h3>
			<h3 v-if="options.doc.desc">描述：
				<span style="color:#09c;">{{options.doc.desc}}</span>
			</h3>
			<h3 v-if="slotDoc">SLOT</h3>
			<component-slot v-if="slotDoc" :options="slotDoc"></component-slot>
			<template v-if="options.desc">
				<h3>说明</h3>
				<h4>{{options.desc}}</h4>
			</template>
			<h3>Props</h3>
			<component-attribute :options="propsDoc"></component-attribute>
			<h3 v-if="methodsDoc">Methods</h3>
			<component-methods v-if="methodsDoc" :options="methodsDoc"></component-methods>
			<h3>Events</h3>
			<component-events :options="eventsDoc"></component-events>
		</template>
		<h3 v-if="demo">Demo</h3>
		<component-demo v-if="demo" :comp="demo"></component-demo>
	</div>
</template>

<script>
import ComponentAttribute from "./Attribute";
import ComponentSlot from "./Slot";
import ComponentMethods from "./Methods";
import ComponentEvents from "./Events";
import ComponentDemo from "./Demo";

export default {
	components: {
		ComponentAttribute,
		ComponentSlot,
		ComponentMethods,
		ComponentEvents,
		ComponentDemo
	},
	props: {
		options: {}
	},
	computed: {
		isBusiness() {
			return this.options.group == "business";
		},
		doc() {
			return this.options.doc || {};
		},
		propsDoc() {
			return this.doc.props || {};
		},
		methodsDoc() {
			return this.doc.methods || {};
		},
		eventsDoc() {
			return this.doc.events || {};
		},
		slotDoc() {
			return this.doc.slot;
		},
		demo() {
			return (this.options.demos || [])[0];
		}
	}
};
</script>
