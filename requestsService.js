import { config } from "./config.js";

const {  apiUrl, contentEndpoint } = config;

export const requestsService = {
    
    get: async (...params) => {
        const convertedParams = params.map(param => param).join('&');
        try {
            const request = await fetch(`${apiUrl}/${contentEndpoint}?${convertedParams}`);
            const data = await request.json();
            return data;
        } catch (e) {
            const errorMsg = 'Oops!, something goes wrong.';
            return errorMsg;
        }

    }
}