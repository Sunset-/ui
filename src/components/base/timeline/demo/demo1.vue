<template>
	<div>
		<np-timeline :data="items" :options="options">
			<div slot-scope="props" style="padding:10px;">
				{{props.item}} {{props.item}} {{props.item}}
			</div>
		</np-timeline>
	</div>
</template>
<script>
	export default {
		methods: {},
		data() {
			return {
				items: [111, 222, 333],
				options: {
					color(item, index) {
						return index % 2 != 0 ? "red" : "blue";
					}
				}
			};
		}
	};
</script>