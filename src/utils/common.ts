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