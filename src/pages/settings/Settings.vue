<template>
  设置页面

  <el-button @click="test">打开文件夹</el-button>
</template>
<script lang="ts" setup>

const test = async () => {
  const filePath = await window.fileAPI.showOpenDialog({
    properties: ['openDirectory']
  })
}

</script>
<style scoped></style>