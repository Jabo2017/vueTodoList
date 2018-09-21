<template>
	<div id="app">
		<div id="cover"></div>
		<Header></Header>
		<Todo></Todo>
		<Footer></Footer>
	</div>
</template>

<script>
	import Header from './todo/Header.vue'
	import Footer from './todo/Footer.jsx'
	import Todo from './todo/todo.vue'
	export default{
		name:'App',
		components:{
			Header,
			Footer,
			Todo,
		}
	}
</script>

<style lang="scss">
	#app{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}

	#cover{
		position: absolute;
		left: 0;
		right: 0;
		top:0;
		bottom: 0;
		opacity: .9;
		z-index: -1;
		background-color: #999;

	}
</style>