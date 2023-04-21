import { AxiosProgressEvent } from "axios";
import axios from "~/axios";

export function checkAccessToken(accessToken: string) {
    const headers = {
        "Authorization": "Bearer " + accessToken
    };
    return axios.get(`https://api.github.com/user`, { headers });
}

interface Repo {
    projectName: string;
    accessToken: string;
    branch?: string;
    path?: string;
    owner: string;
}

type OnUploadProgress = (progressEvent: AxiosProgressEvent) => void;

export async function uploadFile(
    repo: Repo,
    fileContent: string,
    fileName: string,
    commitMessage: string = 'Add a new file via API',
    onUploadProgress: OnUploadProgress
): Promise<string> {
    var { projectName, accessToken, branch, path, owner } = repo;
    branch = branch || "main"
    var uploadPath = path || "img"
    uploadPath = uploadPath === "/" ? uploadPath + fileName : uploadPath + "/" + fileName

    const url = `https://api.github.com/repos/${owner}/${projectName}/contents/${encodeURIComponent(uploadPath)}`
    const headers = { "Authorization": "Bearer " + accessToken };
    const data = {
        encoding: 'base64',
        branch,
        message: commitMessage,
        content: fileContent,
    };
    await axios.put(url, data, { headers, onUploadProgress: onUploadProgress });
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${projectName}/${branch}/${encodeURIComponent(uploadPath)}`
    return rawUrl
}

export async function createBranch(
    repo: Repo,
    ref = 'main',
): Promise<boolean> {
    const { owner, projectName, accessToken, branch } = repo;
    const branchName = branch || "master"
    if (branchName == ref) { return true }
    const headers = { 'Authorization': `Bearer ${accessToken}` };

    try {
        const data = await axios.get(`https://api.github.com/repos/${owner}/${projectName}/git/refs/heads/${ref}`, { headers });
        const response = await axios.post(`https://api.github.com/repos/${owner}/${projectName}/git/refs`, {
            ref: `refs/heads/${branchName}`,
            sha: (data as any).object.sha
        }, { headers });
        console.log('Branch created successfully:', response);
        return true;
    } catch (error) {
        console.error('Failed to create branch:', error);
    }
    return false;
}