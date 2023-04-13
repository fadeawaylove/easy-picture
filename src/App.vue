<template>
  <div class="common-layout">
    <el-container>

      <SideMenu />

      <el-main><router-view></router-view></el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import SideMenu from '~/components/SideMenu.vue';
</script>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  background-color: #CCC;
}

/* Firefox 浏览器 */
html {
  scrollbar-width: none;
}

body {
  scrollbar-width: none;
}

/* Chrome 和 Safari 浏览器 */
html {
  overflow: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

body {
  overflow: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
