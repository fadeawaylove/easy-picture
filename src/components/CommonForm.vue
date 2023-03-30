<template>
    <div class="form">
        <div class="body">
            <slot></slot>
        </div>
        <div class="actions">
            <el-button type="primary" :loading="loading" @click="submit">{{ confirmText }}</el-button>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'


const props = defineProps({
    confirmText: {
        type: String,
        default: "提交"
    }
})

const emit = defineEmits(['submit'])

const submit = () => emit("submit")

const loading = ref(false)
const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false

defineExpose({
    showLoading,
    hideLoading
})

</script>


<style>
.formDrawer {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.formDrawer .body {
    overflow-y: auto;
}

.formDrawer .actions {
    height: 50px;
    @apply mt-auto flex items-center;
}
</style>