import { ElNotification, ElMessageBox } from "element-plus";
import nProgress from "nprogress";

// 消息提示
export function toast(message, type = "success", duration = 2000, dangerouslyUseHTMLString = false) {
    ElNotification({
        type: type,
        message: message,
        dangerouslyUseHTMLString: dangerouslyUseHTMLString,
        duration: duration,
    })
}

// 消息弹框
export function showModal(content = "提示内容", type = "Warning", title = "") {

    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: type,
        }
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

