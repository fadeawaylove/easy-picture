import { ElNotification, ElMessageBox } from "element-plus";
import nProgress from "nprogress";

// 消息提示
export function toast(message: string, type: string = "success", duration: number = 2000, dangerouslyUseHTMLString: boolean = false) {
    ElNotification({
        type: type,
        message: message,
        dangerouslyUseHTMLString: dangerouslyUseHTMLString,
        duration: duration,
    })
}

// 消息弹框
export function showModal(content: string = "提示内容", type: string = "warning", title: string = ""): Promise<ActionResult> {
    interface ActionResult {
        value: string;
        action: string;
    }

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