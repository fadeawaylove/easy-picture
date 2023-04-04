import { AxiosProgressEvent } from "axios";
import axios from "~/axios";
import { addImageToGallary } from "./localRepo";

export function checkAccessToken(projectId: string, accessToken: string) {
    return axios.get(`https://gitlab.com/api/v4/projects/${projectId}?private_token=${accessToken}`);
}

interface Repo {
    projectId: string;
    accessToken: string;
    branch?: string;
    path?: string;
}

type OnUploadProgress = (progressEvent: AxiosProgressEvent) => void;

export async function uploadFile(
    repo: Repo,
    fileContent: string,
    fileName: string,
    commitMessage: string = 'Add a new file via API',
    onUploadProgress: OnUploadProgress
): Promise<string> {
    var projectId = repo.projectId
    var accessToken = repo.accessToken
    var branch = repo.branch || "master"
    var uploadPath = repo.path || "img"
    uploadPath = uploadPath + "/" + fileName

    const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(uploadPath)}`;
    const headers = {
        'Content-Type': 'application/json',
        'Private-Token': accessToken,
    };
    const data = {
        encoding: 'base64',
        branch,
        commit_message: commitMessage,
        content: fileContent,
    };
    const response = await axios.post(url, data, { headers, onUploadProgress: onUploadProgress });
    console.log('New file created successfully:', response);
    var res = `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(uploadPath)}/raw?ref=${branch}`;
    await addImageToGallary({ url: res, name: fileName })
    return res
}

export async function createBranch(
    repo: Repo,
    ref = 'main',
): Promise<boolean> {
    const { projectId, accessToken, branch } = repo;
    const branchName = branch || "ddd"
    const branchUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(
        projectId,
    )}/repository/branches`;
    const branchData = {
        branch: branchName,
        ref,
    };
    const headers = {
        'Content-Type': 'application/json',
        'Private-Token': accessToken,
    };
    try {
        const response = await axios.post(branchUrl, branchData, { headers });
        console.log('Branch created successfully:', response);
        return true;
    } catch (error) {
        console.error('Failed to create branch:', error);
    }
    return false;
}