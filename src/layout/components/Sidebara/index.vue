<template>
	<div>
		<logo v-if="showLogo" :collapse="isCollapse" />
		<div class="horizontal_div">
			<el-menu :default-active="activeMenu" mode="horizontal">
				<sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :index="index" :item="route"
					:base-path="route.path" />
			</el-menu>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import Logo from "./Logo";
	import SidebarItem from "./SidebarItem";
	import variablesa from "@/assets/styles/variablesa.scss";

	export default {
		components: { SidebarItem, Logo },
		created (){
			// console.log(this.sidebarRouters)
		},
		computed: {
			...mapGetters(["sidebarRouters", "sidebar"]),
			activeMenu() {
				const route = this.$route;
				const { meta, path } = route;
				// if set path, the sidebar will highlight the path you set
				if (meta.activeMenu) {
					return meta.activeMenu;
				}
				return path;
			},
			showLogo() {
				return this.$store.state.settings.sidebarLogo;
			},
			variables() {
				return variablesa;
			},
			isCollapse() {
				return !this.sidebar.opened;
			}
		}
	};
</script>
<style lang="scss" scoped>
.horizontal_div{
	float: left;
	height: 50px;
	line-height: 50px;
	margin-left: 20px;
}
</style>