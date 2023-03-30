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


<script setup lang="ts">
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


<style scoped>
.form {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.form .body {
    overflow-y: auto;
}

.form .actions {
    height: 50px;
    @apply mt-auto flex items-center justify-center;
}
</style>