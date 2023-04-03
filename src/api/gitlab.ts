import axios from "~/axios";
import { Base64 } from 'js-base64';

export function checkAccessToken(projectId: string, accessToken: string) {
    return axios.get(`https://gitlab.com/api/v4/projects/${projectId}?private_token=${accessToken}`);
}



export async function uploadFile(
    projectId: string,
    branch: string,
    filePath: string,
    uploadPath: string,
    accessToken: string
): Promise<string | null> {
    const commitMessage = 'Add a new file via API';
    var content = await (window.fileAPI as any).fsReadFile(filePath)
    console.log(content instanceof Uint8Array)


    const encoder = new TextEncoder();
    const str = encoder.encode(String.fromCharCode.apply(null, content));

    // const fileContent = btoa(str);

    // const decoder = new TextDecoder();
    // const decodedString = decoder.decode(content);
    // console.log(typeof decodedString)

    const fileContent = Base64.encode(str)
    console.log(typeof fileContent)

   

    const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(uploadPath)}`;

    try {
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
        const response = await axios.post(url, data, { headers });
        console.log('New file created successfully:', response);
        return `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(uploadPath)}/raw?ref=${branch}`;
    } catch (error) {
        console.error(error);
        return null;
    }
}

