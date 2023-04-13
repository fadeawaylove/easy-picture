export function getFileNameFromPath(path: string): string {
    const pathSegments = path.split(/[\\/]/);
    const fileName = pathSegments[pathSegments.length - 1];
    return fileName;
}

export function readFileAndConvertToBase64(filePath: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        (window as any).fileAPI.fsReadFile(filePath).then((content: any) => {
            (window as any).fileAPI.uint8ToBase64(content).then((fileContent: string) => {
                resolve(fileContent);
            }).catch(() => {
                resolve(null);
            });
        }).catch(() => {
            resolve(null);
        });
    });
}

export function formatDateTime(date: Date): string {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formatter = new Intl.DateTimeFormat('zh-CN', options as any);
    const parts = formatter.formatToParts(date);
    const year = parts.find(part => part.type === 'year')?.value ?? '0000';
    const month = parts.find(part => part.type === 'month')?.value ?? '01';
    const day = parts.find(part => part.type === 'day')?.value ?? '01';
    const hour = parts.find(part => part.type === 'hour')?.value ?? '00';
    const minute = parts.find(part => part.type === 'minute')?.value ?? '00';
    const second = parts.find(part => part.type === 'second')?.value ?? '00';
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    return (bytes / 1073741824).toFixed(2) + " GB";
}


export async function writeTextToClipboard(c: string) {
    await (window as any).fileAPI.writeClipboardText(c)
}


export async function browserOpenExternal(url: string) {
    await (window as any).shellAPI.browserOpenExternal(url)
}