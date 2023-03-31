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

<style scoped></style>
