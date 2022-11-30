import {capitalize} from "./string-utils";
import {PlatformService} from "./platform";
import {isServer} from "./common";

export class NetworkService {
    private baseUrl: string = env.APIPrefix;


    constructor(private platformService: PlatformService) {
    }

    get(relativeUrl, params?, endpointType?, forceAuthOnServer = false) {
        const headers = this.generateHeaders(forceAuthOnServer);
        let apiBase =  this.baseUrl;

        if(!params) {
            params = {};
        }
        params = {...params, language: capitalize(this.platformService.getSiteLang())};
        // return this.http.get(`${apiBase + relativeUrl}`, {headers: new HttpHeaders(headers), params});
    }

    post(relativeUrl, body, params?, forceAuthOnServer = false) {
        const headers = this.generateHeaders(forceAuthOnServer);
        // return this.http.post(`${this.baseUrl + relativeUrl}`,  body ,{headers , params});
    }

    put(relativeUrl, body, params?, forceAuthOnServer = false) {
        const headers = this.generateHeaders(forceAuthOnServer);
        // return this.http.put(`${this.baseUrl  + relativeUrl}`, body, {headers, params});
    }

    delete(relativeUrl, body, params?, forceAuthOnServer = false) {
        const headers = this.generateHeaders(forceAuthOnServer);
        // return this.http.delete(`${this.baseUrl  + relativeUrl}`, {headers, params});
    }

    upload(relativeUrl, file, body?, params? ,httpOptions:any={}, forceAuthOnServer = false) {
        httpOptions.headers=this.generateHeaders(forceAuthOnServer)

        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        // return this.http.post(`${this.baseUrl + relativeUrl}`, formData, httpOptions);
    }

    generateHeaders(forceAuth = false) {
        const headers = {};

        if((!isServer() || forceAuth ) && this.platformService.isLoggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.platformService.getToken();
        }
        headers['X-Tb-Client'] = 'web,' + env.APIVersion;

        return headers;

    }
}