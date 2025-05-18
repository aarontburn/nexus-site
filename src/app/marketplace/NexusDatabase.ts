"use server"

import axios from "axios";
import { ClientCredentials } from "simple-oauth2"

export interface ModuleInfo {
    name: string;
    id: string;
    author: string;
    version: string;
    shortDesc?: string | undefined;
    link?: string | undefined;
    platforms?: string[] | undefined;
    image?: string | undefined;
}


const apiURL = '/api/atlas/v2/';
const baseUrl = "https://cloud.mongodb.com";

// OAuth2 Client Configuration

const oauth2Config = {
    client: {
        id: u,
        secret: p,
    },
    auth: {
        tokenHost: baseUrl,
        tokenPath: '/api/oauth/token',
    }
};

const oauth2Client = new ClientCredentials(oauth2Config);

export async function fetchWithOAuth2() {
    try {
        const tokenParams = {

        };
        const tokenResponse = await oauth2Client.getToken(tokenParams);
        const accessToken = tokenResponse.token.access_token;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.atlas.2023-01-01+json'
        }

        const response = await axios.get(baseUrl + apiURL, {
            headers: headers
        });
        console.log('Response data:', response.data);

    } catch (error) {
        console.error('Error during request:');
        console.error(error);

    }

}
