<style lang="scss">
$HEADER_HEIGHT: 50px;
$SIDEBAR_WIDTH: 220px;
.sunset-ui-container {
	& > header {
		position: fixed;
		top: 0px;
		left: 0px;
		right: 0px;
		z-index: 9999;
		height: $HEADER_HEIGHT;
		background: orange;
		& > .logo {
			color: #fff;
			font-size: 24px;
			line-height: $HEADER_HEIGHT;
			padding-left: 20px;
		}
	}
	& > .major {
		display: flex;
		flex-direction: row;
		padding-top: $HEADER_HEIGHT;
		& > .sidebar {
			top: $HEADER_HEIGHT;
			bottom: 0px;
			width: $SIDEBAR_WIDTH;
			min-width: $SIDEBAR_WIDTH;
		}
		& > .content {
			background: #efefef;
			width: 100%;
			& > .module {
				padding: 20px;
				h2 {
					margin-bottom: 10px;
				}
				.component-wrap {
					border: 1px solid orange;
					margin-bottom: 10px;
				}
				.component-alert {
					border: 1px solid lighten(orange, 5%);
					font-size: 14px;
					color: darken(orange, 15%);
					background: lighten(orange, 40%);
					padding: 10px;
					border-radius: 4px;
				}
			}
		}
	}
}
</style>
<template>
	<div class="sunset-ui-container">
		<header>
			<div class="logo">
				{{title}}
			</div>
		</header>
		<div class="major">
			<div class="sidebar">
				<el-menu ref="menu" width="100%" :unique-opened="true" @select="renderComponent">
					<el-submenu v-for="(m,index) in menus" :key="index" :index="index+''">
						<template slot="title">
							{{groupName[m.title]}}
						</template>
						<el-menu-item v-for="(c,cindex) in m.children" :key="cindex" :index="c.path">{{c.title}}</el-menu-item>
					</el-submenu>
				</el-menu>
			</div>
			<div class="content">
				<div class="module">
					<component-detail v-if="!pendding&&currentDoc" :options="currentDoc"></component-detail>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Xui from "./np-xui";
import ComponentDetail from "./bootstrap/ComponentDetail";

export default {
	components: {
		ComponentDetail
	},
	data() {
		return {
			pendding: true,
			title: (document.title = "NetPosa-XUI"),
			groupName: {
				base: "基础组件",
				composite: "复合组件",
				business: "业务组件"
			},
			currentDoc: null,
			menus: []
		};
	},
	methods: {
		init() {
			var components = Xui.components;
			var groups = [],
				groupMap = {};
			components.forEach(c => {
				var group;
				if (!(group = groupMap[c.group])) {
					group = {
						title: c.group,
						children: []
					};
					groups.push(group);
					groupMap[c.group] = group;
				}
				group.children.push(c);
			});
			this.menus = groups;
			this.$nextTick(() => {
				this.renderComponent(this.$route.path);
			});
		},
		renderComponent(c) {
			this.pendding = true;
			this.$nextTick(() => {
				Router.push(c);
				this.currentDoc = Xui.componentsMap[c.substr(1)];
				this.$nextTick(() => {
					this.pendding = false;
				});
			});
		}
	},
	mounted() {
		this.init();
	}
};
</script>