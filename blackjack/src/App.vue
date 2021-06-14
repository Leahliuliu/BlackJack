<template>
  <div id="app">
    <router-view></router-view> <!--Vue-cli项目的唯一单页面（所有的内容都是在router-view中通过路由呈现）-->
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  * {
    overflow: hidden;
    padding:0;
    margin:0;
  }
  #app{
    background-color: black;
  }
</style>
