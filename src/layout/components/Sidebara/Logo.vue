<template>
	<div class="sidebar-logo-container">
		<transition name="sidebarLogoFade">
			<router-link key="expand" class="sidebar-logo-link" to="/">
				<img v-if="logo" src="@/assets/logo/LogoTKY.svg" class="sidebar-logo">
				<h1 class="sidebar-title">公务用车</h1>
			</router-link>
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'SidebarLogo',
		props: {
			collapse: {
				type: Boolean,
				required: true
			}
		},
		data() {
			return {
				title: '中科院后台管理',
				logo: '@/assets/images/tiekeyuan.jpg'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sidebarLogoFade-enter-active {
		transition: opacity 1.5s;
	}

	.sidebarLogoFade-enter,
	.sidebarLogoFade-leave-to {
		opacity: 0;
	}

	.sidebar-logo-container {
		position: relative;
		height: 50px;
		line-height: 50px;
		text-align: center;
		overflow: hidden;
		float: left;
		& .sidebar-logo-link {
			height: 100%;
			width: 100%;

			& .sidebar-logo {
				width: 62px;
				height: 30px;
				vertical-align: middle;
				margin-right: 12px;
			}

			& .sidebar-title {
				display: inline-block;
				margin: 0;
				color: #515a6e;
				font-weight: 600;
				line-height: 50px;
				font-size: 16px;
				font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
				vertical-align: middle;
			}
		}

		&.collapse {
			background-color: #fff;
			.sidebar-logo {
				width: 45px;
				height: 45px;
				display: inline-block;
				margin-right: 0px;
			}
		}
	}
</style>
