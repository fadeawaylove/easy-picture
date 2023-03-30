<template>
  <el-tabs v-model="activeName" class="" @tab-click="handleClick">
    <el-tab-pane label="Gitlab" name="Gitlab">
      <Gitlab></Gitlab>
    </el-tab-pane>
    <el-tab-pane label="Config" name="second">Config</el-tab-pane>
    <el-tab-pane label="Role" name="third">Role</el-tab-pane>
    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import Gitlab from './Gitlab.vue';
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('Gitlab')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<style scoped>

</style>