
interface Repo {
    name: string;
    projectId?: string;
    projectName?: string;
    accessToken: string;
    branch: string;
    path: string;
    type: string;
    id: string;
    owner?: string
}


export const saveRepoList = async (repoList: any) => {
    return await (window as any).storeApi.storeSet("repo.list", repoList)
}


export const getRepoList = async (): Promise<Repo[]> => {
    return await (window as any).storeApi.storeGet("repo.list", [])
}


export const getRepoByID = async (rid: string): Promise<Repo | undefined> => {
    return (await getRepoList()).find(item => item.id === rid)
}


export const getRepoIndexByID = async (rid: string): Promise<Repo | undefined> => {
    return (await getRepoList()).find(item => item.id === rid)
}


export const deleteRepoByID = async (rid: string) => {
    // 通过id删除某个存储仓库
    var repoList = await getRepoList()
    const index: number = repoList.findIndex(item => item.id === rid);
    if (index !== -1) {
        repoList.splice(index, 1);
    }
    await saveRepoList(repoList)
}


export const saveRepo = async (repo: Repo) => {
    // 保存某个配置
    var repoList = await getRepoList()
    const existingIndex: number = repoList.findIndex(item => item.id === repo.id);
    if (existingIndex !== -1) {
        repoList.splice(existingIndex, 1, repo); // 用新的对象替换原来的对象
    } else {
        repoList.unshift(repo); // 不存在则插入头部
    }
    await saveRepoList(repoList)
}



export const deleteAllRepos = async () => {
    await (window as any).storeApi.storeDelete("repo.list")
}


export const setDefaultRepo = async (sid: string) => {
    return await (window as any).storeApi.storeSet("defaul.repo.id", sid)
}

export const deleteDefaultRepo = async () => {
    return await (window as any).storeApi.storeDelete("defaul.repo.id")
}


export const getDefaultRepo = async () => {
    var sid = await (window as any).storeApi.storeGet("defaul.repo.id", "")
    return await getRepoByID(sid)
}

export const getDefaultRepoID = async () => {
    return await (window as any).storeApi.storeGet("defaul.repo.id", "")
}


export const addImageToGallary = async (imageInfo: any) => {
    var images = await (window as any).storeApi.storeGet("image.gallary", []);
    images.unshift(imageInfo); // 在第一位添加新图片信息
    await (window as any).storeApi.storeSet("image.gallary", images); // 保存到本地存储中
    return images;
};

export const getImagesFromGallary = async (i: number = 1, n: number = 5) => {
    const images = await (window as any).storeApi.storeGet('image.gallary', []);
    const startIndex = (i - 1) * n;
    const endIndex = startIndex + n;
    const result = {
        total: images.length,
        items: images.slice(startIndex, endIndex),
    };
    return result;
};