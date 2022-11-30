import {
    getClientSiteLang,
    getClientCookie,
    setClientCookie,
    isServer,
    getClientQueryParamValue, TARGET_AUTO_ENROLLMENT_KEY,
    getQueryStringFromParams
} from "./common";

const DEFAULT_LANG = 'english';
const COOKIE_LANG_KEY = 'language';
const COOKIE_TB_TOKEN = 'tb_token';

export class PlatformService {

    isServerFlag: boolean = false;

    isServerLoggedInFlag: boolean = false;

    isMobileFlag: boolean = false;

    isIosFlag: boolean = false;

    serverLang: string = 'english';

    pathname: string = '/';

    protocol: string ='https:'

    hostName: string = 'testbook.com';

    query: any = {};

    cookies: any = {};

    token: string = '';

    goal: any = {};

    userAgent: string = '';

    serverDir = '';

    clientPathName = '';

    public constructor() {

    }


    
    setIsMobileFlag(val) {
        this.isMobileFlag = val;
    }

    isMobileSvr() {
        return this.isMobileFlag;
    }

    setMobileFlag(userAgent) {
        this.setIsMobileFlag(this.isMobileUserAgent(userAgent));
    }

    setIsIosFlag(val) {
        this.isIosFlag = val;
    }

    isIosSvr() {
        return this.isIosFlag;
    }


    setServerLang(lang) {
        this.serverLang = lang || DEFAULT_LANG;
    }

    getServerLang() {
        return this.serverLang;
    }


    isMobileUserAgent(userAgent) {

        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i,
            /Mobile/i
        ];

        if (userAgent) {
            return toMatch.some((toMatchItem) => {
                let m = userAgent.match(toMatchItem);
                return m && m.length > 0;
            });
        }
        return false;
    };

    isIosUserAgent(userAgent) {

        const toMatch = [
            /iPhone/i,
            /iPad/i,
            /iPod/i
        ];

        if (userAgent) {
            return toMatch.some((toMatchItem) => {
                let m = userAgent.match(toMatchItem);
                return m && m.length > 0;
            });
        }
        return false;
    };

    getSiteLang() {
        if (isServer()) {
            return this.getServerLang();
        }
        return getClientSiteLang();
    }

    isMobile(): boolean {
        if (isServer()) {
            return this.isMobileSvr();
        }
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    isIosDevice(): boolean {
        if (isServer()) {
            return this.isIosSvr();
        }
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    isLoggedIn(): boolean {
        if (isServer()) {
            return false; //implement later
        }
        return !!this.getCookie(KEY_TOKEN);

    }

    isChrome() {
        if (isServer()) {
            // browser irrelavant on server
            return false
        }
        return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    }
    getToken () {
        if(isServer()) {
            return this.getServerToken();
        }
        return getClientToken();
    }
    setToken(value, expiry) {
        if(isServer()) {
            this.token = value;
        }
        else {
            setClientToken(value, expiry)
        }
        return this.getToken();
    }

    // to be used internally only, use authentication service's getGoal method instead of this one
    _getGoalCookie() {
        if(isServer()) {
            return this.getServerSelectedGoal();
        }
        return getClientGoal();
    }

    // to be used internally only, use authentication service's setGoal method instead of this one
    _setGoalCookie(value, expiry) {
        if(isServer()) {
            this.setServerSelectedGoal(value);
        } else {
            setClientGoal(value, expiry);
        }
        return this._getGoalCookie();
    }

    setServerCookie(cookies) {
        this.cookies = cookies;
    }

    getServerCookie(key) {
        return this.cookies[key];
    }

    setTargetHints(targets){
        // setting target id to be passed for auto-enrollment during signup
        if(!isServer() && !this.isLoggedIn()) {
            window[TARGET_AUTO_ENROLLMENT_KEY] = targets.slice(0, 5).map(t => t.id).join(",");
        }
    }

    getQueryParamValue(key, url?) {

        if(isServer()) {
            return this.getServerQueryParamValue(key);
        }

        return getClientQueryParamValue(key, url);
    }

    getPathName() {
        if(isServer()) {
            return this.getServerPathName();
        }
        return this.clientPathName || window.location.pathname || '/';
    }

    setClientPathName(path) {
        this.clientPathName = path;
    }

    getProtocol() {
        // returns with trailing :
        if(isServer()) {
            return this.getServerProtocol();
        }
        return window.location.protocol;
    }

    getCookie(key) {
        if(isServer()) {
            return this.getServerCookie(key);
        }
        return getClientCookie(key);
    }

    setCookie(cname, cvalue, exdays?) {
        if(isServer()) {
            return;
        }
        return setClientCookie(cname, cvalue, exdays);
    }

    setClientBuildDirectory(serverDir){
        this.serverDir = serverDir;
    }
    getClientBuildDirectory(){
        if(isServer()){
            return this.serverDir;
        }
        return 'NOT_ON_SERVER';
    }

    setUserAgent(val) {
        this.userAgent = val;
    }

    getUserAgent() {
        if(isServer()) {
            return this.userAgent;
        }
        return window.navigator.userAgent;
    }

    setHost(host) {
        this.hostName = host;
    }

    getHost() {
        if(isServer()) {
            return this.hostName || 'testbook.com';
        }
        return window.location.hostname;
    }

    redirect(url,status?){
        if(isServer() && this.response){
            if(!this.response.headersSent){
                // send redirect response from express
                this.response.set('location', url);
                this.response.status(status || 302).send();
            }
            return;
        }
        return window.location.href = url;
    }

    hideLivePanel() {
        this.addClass('lp-never');
    }

    showLivePanel() {
        this.removeClass('lp-never');
    }

    addClass(className){
        this.document.body.classList.add(className);
    }

    removeClass(className){
        this.document.body.classList.remove(className);
    }

    gotoErrorPage() {
        if (isServer()) {
            if (this.response) {
                this.response.statusCode = 404;
            }
        }
        location.href = '/error';
    }


}
