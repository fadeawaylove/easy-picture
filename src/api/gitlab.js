import axios from "~/axios";

export function checkAccessToken(projectId, accessToken) {
    return axios.get("https://gitlab.com/api/v4/projects/" + projectId + "?private_token=" + accessToken)
}

export function getStatistics3(type) {
    return axios.get("/admin/statistics3?type=" + type)
}

export function getStatistics2() {
    return axios.get("/admin/statistics2")
}