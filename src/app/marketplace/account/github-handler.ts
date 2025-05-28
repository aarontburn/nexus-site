"use server";

import JSZip from 'jszip';
import { RemoteModuleInfoJSON } from './EditModule';



export type Response<TSuccess, TFailure> = SuccessResponse<TSuccess> | FailureResponse<TFailure>

export interface SuccessResponse<T = any> {
    type: "success";
    body: T;
}

export interface FailureResponse<T = any> {
    type: "failure";
    body: T;
}





export async function getGitHubModuleInfo(githubURL: string): Promise<Response<RemoteModuleInfoJSON, { code: number, message: string }>> {
    try {
        const moduleZipURL: string = githubURL + "/releases/latest/releases"

        const apiGitHubURL: string = githubURL.replace("github.com", "api.github.com/repos");
        const response = await fetch(apiGitHubURL + "/releases/latest");
        

        if (!response.ok) {
            return { type: "failure", body: { code: response.status, message: response.statusText } };
        }
        const releaseData = await response.json();
        const assets: any[] | undefined = releaseData.assets;
        if (!assets || assets.length === 0) {
            return { type: "failure", body: { code: 400, message: "No latest release information found." } };

        }

        return await downloadAndReadModuleInfo(assets[0].browser_download_url)
    } catch (err) {
        return { type: "failure", body: { code: 400, message: "Bad URL." } };
    }

}

async function downloadAndReadModuleInfo(downloadURL: string): Promise<Response<RemoteModuleInfoJSON, { code: number, message: string }>> {
    const response = await fetch(downloadURL);
    const arrayBuffer = await response.arrayBuffer();
    const zip: JSZip = await JSZip.loadAsync(arrayBuffer);

    const file = zip.file('module-info.json');
    if (!file) {
        return {
            type: "failure",
            body: { code: 400, message: "Could not find module-info within the latest release." }
        }
    };

    const text = await file.async('text');
    try {
        const json: RemoteModuleInfoJSON = JSON.parse(text);
        return { type: "success", body: json };
    } catch (err) {
        return {
            type: "failure",
            body: { code: 400, message: "Could not parse module-info.json" }
        }
    }


}

