
interface Repo {
    name: string;
    projectId: string;
    accessToken: string;
    branch: string;
    path: string;
    type: string;
    id: string;
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


export const getDefaultRepo = async () => {
    var sid = await (window as any).storeApi.storeGet("defaul.repo.id", "")
    return await getRepoByID(sid)
}

export const getDefaultRepoID = async () => {
    return await (window as any).storeApi.storeGet("defaul.repo.id", "")
}

