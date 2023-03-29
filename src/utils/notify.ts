import { ElNotification, ElMessageBox, ElMessageBoxOptions } from "element-plus";
import nProgress from "nprogress";


// 消息提示
export function toast(message: string, type: string = "success", duration: number = 2000, dangerouslyUseHTMLString: boolean = false) {
    ElNotification({
        type: type as any,
        message: message,
        dangerouslyUseHTMLString: dangerouslyUseHTMLString,
        duration: duration,
    })
}

// 消息弹框
export function showModal(content: string = "提示内容", type: string = "warning", title: string = "") {
    const options: ElMessageBoxOptions = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type as any, // 这里使用 as any 将 type 强制转换为 any 类型，否则会有类型提示警告
    }
    return ElMessageBox.confirm(
        content,
        title,
        options
    )
}


// 显示全屏loading
export function showFullLoading() {
    nProgress.start()
}

// 隐藏全屏loading
export function hideFullLoading() {
    nProgress.done()
}