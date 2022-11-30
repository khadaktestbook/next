


//import * as $ from "jquery"; <= importing causes jquery to be included in the bundle
declare var $:any;
declare var window:any;
let tempCookie = {};

const MS_IN_ONE_DAY = 24 * 60 * 60 * 1000;

export const SECS_IN_ONE_HR = 60 * 60;

export const LS_KEY_FOR_SEARCH_HISTORY = 'LS_GSH_KEY';
export const TARGET_AUTO_ENROLLMENT_KEY = 'target';


// export function hideIntercom() {
//     if (isServer()) {
//         return;
//     }
//     window.document.body.classList.add('hideIntercom');
// }

// export function showIntercom() {
//     if (isServer()) {
//         return;
//     }
//     window.document.body.classList.remove('hideIntercom');
// }

// export function loadIntercom(){
//     if (isServer()) {
//         return;
//     }
//     if(!!window['intercomSettings']) { //already loaded
//         return;
//     }
//     if(typeof window['loadIntercom'] == "function"){
//         window['loadIntercom'](); // function in index.html
//     }
// }

// export function hideLivePanel() {
//     if (isServer()) {
//         return;
//     }
//     window.document.body.classList.add('lp-never');
// }

// export function showLivePanel() {
//     if (isServer()) {
//         return;
//     }
//     window.document.body.classList.remove('lp-never');
// }

// export function toggleIntercomVisibility(state=false){
//     if (isServer()) {
//         return;
//     }
//     const liveChat :any = window.document.querySelector('.intercom-lightweight-app');
//     liveChat && (liveChat.hidden = !state);
// }

export function setPageText(value){
    if(isServer()) {return;}
    let input = document.getElementById('dlPage');
    if(!input){
        input = document.createElement('input');
        input.setAttribute('id','dlPage');
        input.setAttribute('type','hidden');
        document.body.appendChild(input);
    }
    input.setAttribute('value',value);
}

export function getPageText(){
    if(isServer()) {return;}
    let isIframe = window.self !== window.top;
    let input,value;

    if (isIframe) {
        input = window.top.document.getElementById('dlPage');
    } else {
        input = document.getElementById('dlPage');
    }
    if (input) {
        value = input.getAttribute('value');
        if(value === 'Others'){
            console.error('dlpage not set : GA events will be impacted');
        }
    }
    return value || 'Others';
}

export function setClientCookie(cname, cvalue, exdays?) {
    if (exdays === 'undefined') {
        document.cookie = cname + '=' + cvalue;
    } else {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + d.toUTCString() + ('; path=/');
        document.cookie = cname + '=' + cvalue + '; ' + expires;
    }
    tempCookie[cname] = '';
}

export function getClientCookie(cname) {
    if(tempCookie[cname]) {
        return tempCookie[cname];
    }
    var ca = document.cookie.split(';');
    let c, x;
    for (var i = 0; i < ca.length; i++) {
        c = ca[i];
        x = ca[i].split('=');
        if (x[0].trim() === cname) {
            tempCookie[cname] = x.slice(1).join("") || "";
            // kept in case things break
            // tempCookie[cname] = x[1] && x[1].trim() || '';
            // why this used to trim and why it only used the second element is a mystery to me.
            return tempCookie[cname];
        }
    }
    tempCookie[cname] = '';
    return '';
}

let onServer = false;

declare var global;
export function clientBuildPath() {
   if(!isServer()){return ''}
   return global['clientPath'];
}

export function isServer() {
    return (typeof global !== "undefined");
}

export function setIsServer(bool) {
    onServer = bool;
}

export function getClientSiteLang() {
    return getClientQueryParamValue('language') || getClientCookie('language') || 'english';
}

export function resolveInheritedKey(obj,InheritIn,find){
    var current = obj;
    while(current && !current[find]){
            current = current[InheritIn];
    }
    return (typeof current === 'object') ? current[find] : undefined;
}

export function localStorageRead (key,scb,fcb) {
    let noop = ()=>{};

    (!scb) && (scb = noop);
    (!fcb) && (fcb = noop);

    if(key!==undefined && key!==null && key!==""){
            var value = getLocalStorage(key, null);
            if(value!==undefined && value!==null && value!==""){
                    scb({data:JSON.parse(value),success:true});
            } else {
                    fcb({message:'undefined or null value',success:false});
            }
    } else {
            fcb({message:'empty or invalid key',success:false});
    }
};

export function getLocalStorage(key, type?) {
	if (!window.localStorage) {
		return getClientCookie(key);
    }
	var string = localStorage && localStorage.getItem(key) || '';
	return type == 'validity' ? string.substring(string.lastIndexOf('_') + 1) : string.substring(0, string.lastIndexOf('_')) || '';
}

export function setLocalStorage(key, value, expiry=2) {
    var addTimeInSeconds = function (d, seconds) {
        if (!(d instanceof Date)) {
            d = new Date();
        }
        return new Date(d.getTime() + seconds * 1000);
    };
    var validity = addTimeInSeconds(new Date(), expiry * 24 * 3600).getTime();
    value = value + '_' + validity;
    return localStorage && localStorage.setItem(key, value);
}

export function removeLocalStorage(key) {
    if(window.localStorage) {
        window.localStorage.removeItem(key);
        return true;
    }
    return false;
}

export function setToSessionStorage(key, value) {
    var str = '';
    if (window.sessionStorage && value) {
        str = JSON.stringify(value);
        window.sessionStorage.setItem(key, str);
    } else {
        window.sessionStorage.removeItem(key);
    }
};

export function getFromSessionStorage(key) {
    if (window.sessionStorage) {
        var obj = {};
        var value = window.sessionStorage.getItem(key);
        if (value) {
            obj = JSON.parse(value);
            return obj;
        }

    }
};

export function validateDate (dateToValidate) {
    return !isNaN(new Date(dateToValidate).getTime());
};

export function reduceToModuleCount(obj){
    let count = 0;
    for(var key in obj){
      count += obj[key];
    }

    return count;
}

export function getMinsDiff(d1, d2) {
    return d1 && d2 && validateDate(d1) && validateDate(d2) ? Math.abs(d1 - d2) / (60 * 1000) : 0;
};

export function getHoursDiff(d1, d2) {
    var MS_IN_D1 = new Date(d1).getTime();
    var MS_IN_D2 = new Date(d2).getTime();
    var MS_IN_HOUR = 1000 * 60 * 60;
    if (!(d1 && d2)) {
        return 0;
    }
    return Math.ceil((MS_IN_D1 - MS_IN_D2) / MS_IN_HOUR);
}

export function getDaysDiff(d1, d2, isAbsoluteValue = false) {
    d1 = setHoursToZero(d1);
    d2 = setHoursToZero(d2);
    var diffInMS = d1.getTime() - d2.getTime();

    if(isAbsoluteValue){
        return Math.abs(diffInMS)/ MS_IN_ONE_DAY;
    }

    return (diffInMS) / MS_IN_ONE_DAY;
}

var setHoursToZero = function (d) {
    var date = new Date(d);
    return new Date(date.setHours(0, 0, 0, 0));
};

export function getEntityMainDate(entity){
    let mainDate = (entity.startTime && new Date(entity.startTime).getTime() > new Date("1947-01-01T00:00:00Z").getTime()) ? entity.startTime : entity.availFromDate;
    return mainDate;
}


export function constructOnBoardingUrl(params, isLogin) {
    params = params || {};
    var url = '/login?tile=' + (isLogin ? 'login' : 'signup') + '&modal=true&base_url=' + encodeURIComponent(window.location.pathname);
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            url += '&' + key + '=' + encodeURIComponent(params[key]);
        }
    }
    return url;
}

let infiniteScrollTimer;
export function isScrollAvailable(thresholdPercentage, scb, duration, elem = $('body')) {
    var scrollController = function () {
        clearTimeout(infiniteScrollTimer);
        infiniteScrollTimer = setTimeout(scrollHelper, duration);
    };

    var scrollHelper = function () {
        var totalScrollAvailable = elem.height() || 0;
        var screeenHeight = $(window).height() || 0;
        var currentScroll = $(document).scrollTop() || 0;
        var availableScroll = totalScrollAvailable - (screeenHeight + currentScroll);
        var threshold = Math.floor((screeenHeight * thresholdPercentage) / 100);
        if (availableScroll <= threshold) {
            scb();
        }
    };

    var init = function () {
        scrollController();
    };
    init();
};

export function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function getClassUrl (name) {
    return name.toLowerCase().replace(/ /g, '-');
};

//Get comma separated string for a certain keys value from array of objects
export  function getCommaSeparatedString (arr, key) {
	var str = '';
	for (var i = 0; i < arr.length; i++) {
		if (arr[i][key]) {
			str += arr[i][key];
			if (i < arr.length - 1) {
				str += ', ';
			}
		}
	}
	return str;
};

export let LS = {
	currentQuizInfo: {
		key: 'currentQuizInfo',
		value: {
			servesOn: '',
			course: '',
			exam: [],
			category: '',
			page: '',
			pageType: ''
		}
	},
    testStartInfo: {
		key: 'testStarted',
		value: {
			id : '',
			page: '',
			pagePath: '',
			isFree: false,
			isLive : false,
            testSeriesId: '',
            testSeriesName: '',
            isLiveQuiz:false,
		}
	}
};


export function mapFrom(arr,key){
    if(!arr || !key) return {};
    let obj:any= {};
    for(let i=0;i<arr.length;i++){
        if(arr[i][key] != undefined){
            obj[arr[i][key]] = arr[i]
        }
    }
    return obj;
}

declare var dataLayer;
export function lsWaitForSid (event){
    if(isServer()) return;
    if(event && event.sid && event.sid != '-1'){
        dataLayer && dataLayer.push(event);
        if(($(" #developMode ").val() == "1")) {
            console.info("GTM push",event);
        }
        localStorage.removeItem('signup-saved-event');
    } else {
        setLocalStorage('signup-saved-event',JSON.stringify(event),1);
    }
}
export function checkSavedEvents(){
    if(isServer()) return;
    var savedEvent = JSON.parse(getLocalStorage('signup-saved-event')||'{}');
    if(savedEvent && savedEvent.event){
        var sid = $('#sid');
        if(sid){
            savedEvent.sid = sid.val();
        }
        lsWaitForSid(savedEvent);
    }
}

export function getClientQueryParamValue(key, url = decodeURI(window.location.href)) {
    var arr = url.split('&' + key + '=');
    if (arr.length == 1) {
        arr = url.split('?' + key + '=');
    }
    if (arr.length == 1) {
        return '';
    }
    return arr[1].split('&')[0];
}

export function getTimerString(distance, stripBoilerText=true, getTimeInHours? , getUnits?) {
    if(distance < 0){
        return "00:00:00"
    }

    let days:any = Math.floor(distance / (MS_IN_ONE_DAY));
    let hours:any = Math.floor((distance % (MS_IN_ONE_DAY)) / (1000 * 60 * 60));
    let minutes:any = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds:any = Math.floor((distance % (1000 * 60)) / 1000);

    //hack to show hours properly
    hours = (days*24) +hours;

    days = days < 10 ? '0' + days : days;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    if(getUnits){
        return stripBoilerText ? hours + 'h :' + minutes + 'm :' + seconds + 's ' : 'Ends in ' + hours + 'h :' + minutes + 'm :' + seconds + 's ';
    }
    if(getTimeInHours) {
        return stripBoilerText ? hours + ':' + minutes + ':' + seconds : 'Ends in ' + hours + ':' + minutes + ':' + seconds;
    }
    if(days >= 3){
        return stripBoilerText ? days + ' days' : 'Ends in ' + days + ' days';
    }
    return stripBoilerText ? hours + ':' + minutes + ':' + seconds : 'Ends in ' + hours + ':' + minutes + ':' + seconds;
};

export function getDiffInNearestMultiple(num1, divisor){
  if(num1 % divisor == 0){
    return num1;
  }
  let quotient = Math.ceil(num1/divisor);
  return  (quotient) * divisor;
};

export function getClassSlug(liveClass: any) {
    let prefix = '', suffix = '';
    if(liveClass && liveClass.classProperties && liveClass.classProperties.slug) {
        prefix = liveClass.classProperties.slug.prefix;
        suffix = liveClass.classProperties.slug.suffix;
    }
    if(prefix && suffix) {
        if (liveClass?.isGoalCourse) {
            suffix = `${suffix}-course`;
        } else {
            suffix = liveClass.isPremium ? `online-coaching-${suffix}` : `${suffix}-online-course`;
        }
        return`/${prefix}/${suffix}`
    }
    else {
        return (liveClass.isPremium ? '/select/' : '/courses/') + liveClass.id + '/' + getClassUrl(liveClass.title)
    }
};

export function getInMultipleOfK(noOfStudents) {
    if (!noOfStudents) {
        return '';
    }
    if (noOfStudents > 1000) {
        noOfStudents = noOfStudents / 1000;
        return noOfStudents.toFixed(1) + 'k';
    }
    return noOfStudents.toString();
}

export function ArrayGroupsOfN(arrayToGroup,n) {
    var groupsOfN = (total,item,index,array)=>{
        if(index % n === 0){
                total.push(array.slice(index,index + n));
        }
        return total;
    };
    return	(arrayToGroup || []).reduce(groupsOfN,[]);
};

export function getYoutubeVideoId(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
            return match[2];
    } else {
            return '';
    }
};
export function getYtVideoID(url) {
    var tempArr = url.split('?')[0].split('/') || [];
    return tempArr.length ? tempArr[tempArr.length - 1] : '';
};

// Do not call this fn on server.
export function getFingerPrintId() {
    if (!window['branch']) {
        return;
    }

    var fpId = '';
    if (typeof window['branch'] !== 'undefined' && window['branch'] && window['branch'].getBrowserFingerprintId) {
        window['branch'].getBrowserFingerprintId(function (err, data) {
            if (!err) {
                fpId = data;
            }
        });
    }

    return fpId;
};

export function getCustomMap(arr, key, value?, isAllFields=true) {
    var customMap = {};
    arr = (arr) || [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key]) {
            var keyMap = typeof (arr[i][key]) === 'string' ? arr[i][key].toLowerCase() : arr[i][key];
            customMap[keyMap] = isAllFields ? arr[i] : arr[i][value];
        }
    }
    return customMap;
}


export function removeURLParameter(url, parameter) {
    let urlparts = url.split('?');
    if (urlparts.length >= 2) {

        let prefix = encodeURIComponent(parameter) + '=';
        let pars = urlparts[1].split(/[&;]/g);

        for (let i = pars.length; i-- > 0;) {
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
}

export function removeTrailingSlashes(str) {
	let temp = str.toString();
	while(temp.endsWith('/')) {
			temp = temp.slice(0, temp.length -1);
	}
	return temp;
}


export function showLoader(txt = 'Loading') {
    if(isServer()) {return;}
    let loader = document.getElementById('cb-await-loader');
    let textele = document.getElementById('cb-await-text');
    textele.innerText = txt;
    loader.style.display = 'block';
}

export  function hideLoader() {
    if(isServer()) {return;}
    let loader = document.getElementById('cb-await-loader');
    loader.style.display = 'none';
}

// This function is used for check if we are still in the same window or not, for various browser support included the function like this

export function isWindowVisible(){
    return !(document['hidden'] || document['webkitHidden'] || document['msHidden']) || document['visibilityState'] === "visible";
}

export  function downloadPdfFromBlob(pdf) {
    if(pdf && pdf.blob){
            pdf.blob.getData().then((u8) => {
            let blob = new Blob([u8.buffer], {
                type: 'application/pdf'
            });
            if (window.navigator && (<any> window.navigator).msSaveOrOpenBlob) {
                // IE11 and Edge
                (<any> window.navigator).msSaveOrOpenBlob(blob, pdf.name);
            } else {
                // Chrome, Safari, Firefox, Opera
                let url = URL.createObjectURL(blob);
                openLink(url, pdf.name);
                // Remove the link when done
                setTimeout(function () {
                    window.URL.revokeObjectURL(url);
                }, 5000);
            }
        });           
    }
}

export  function openLink(url, name) {
    let a = document.createElement('a');
    // Firefox requires the link to be in the body
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = name;
    a.click();
    // Remove the link when done
    document.body.removeChild(a);
}

export  function checkTestsAvailability(arr) {
    return arr.some( (arrVal) => arrVal?.tests && arrVal.tests.length > 0);
}

export  function checkIfFiltersApplied(arr){
    return arr.some( (arrVal) => arrVal?.checked && arrVal.checked == true);
}

export function inIframe() {
    if (isServer()) {
        return false;
    }
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

export function logCurrentWindowSize(){
    // this api does not exist, the idea is to get this info inside the logs instead, so a 404 is okay
    if(window.location.hostname !== "testbook.com") { return; }
    try {
        fetch(`https://api.testbook.com/width/${window.innerWidth}/height/${window.innerHeight}`)
    } catch (e) {
        console.log(e)
    }
}

export function getLessonModuleType(module){
    if(!module || !module.type) return '';
    if(module && module.type && (module.type.toLowerCase() == "live class" || module.type.toLowerCase() == "doubt class")){return 'video'};

    return module.type.toLowerCase();
}
export function reloadPageWithDelay(stripParams) {
    setTimeout(function() {
        if(stripParams) {
            window.location.href = window.location.pathname;
        }
        else {
            window.location.reload();
        }
    }, 1000);
};

export function isIos() {
    if(isServer()) {
        return false;
    }
    return !!/iPhone|iPad|iPod/i.test(window.navigator.userAgent);
}

export function watchForMathJaxRendering(){
    if(isServer()){
        return;
    }
    window?.MathJax?.Hub.Queue([["Typeset", window.MathJax.Hub]])
}

export interface headerData {
    heading                 : string;
    title                   : string;
    slug                    : string;
    logo                    : string;
    enrolledStudentsCount   : any;
    childPage               : any;
    page_id                 : string;
    downloadAsPdf           : any;
    isSticky?                : boolean;
    ctaTitle?: string;
    ctaUrl?: string;
    lastUpdatedOn?:string;
}

export interface wildCardRoutesSchemaJsonData {
    slug: string;
    title: string;
    meta_title: string;
    meta_description: string;
    childPageInfo: any;
    datePublished: string;
    dateModified: string;
    liveClasses: any;
}


export  const targetFieldsMap = {
    targetName              :  'Exam Name',
    registrationStart       :  'Application Start Date',
    noOfVacancies           :  'Number of vacancy',
    eligibility             :  'Eligibility',
    notificationPdf         :  'Official Notification',
    applyOnline             :  'Apply Online Direct Link',
    syllabusPdf             :  'Syllabus PDF',
    applicationFee          :  'Application Fee',
    age                     :  'Age Limit',
    qualification           :  'Educational Qualification',
    physicalStandard        :  'Physical Standard',
    generalCutOff           :  'General Category Cut off',
    obcCutOff               :  'OBC Cut off',
    scCutOff                :  'SC Cut off',
    stCutOff                :  'ST Cut off',
    examDate                :  'Exam Date',
    year                    :  'Year',
    noOfRegCandidates       :  'No. of Registered Candidates',
    postName                :  'Post Name',
    organisation            :  'Organisation',
    location                :  'Location',
    lastDateToApply         :  'Last Date to Apply',
    salary                  :  'Salary'
};

export interface productInfoModal {
    pitch: string;
    logo: string;
    title?: string;
    totalProductCount?: number;
    totalProductCountString?: string;
    features: any;
    goal: any;
    minPlanCost: number;
    minPlanCostString: string;
    chapters?:any;
    cardType?:string;
}
export function getNonNullParams(obj){
    let paramObj={};
    for(let key of Object.keys(obj)){
        if(obj[key] !== null && typeof obj[key] !== 'undefined'){
            paramObj[key]=obj[key]
        }
    }
    return paramObj;
}

export function getParentKey(parentType) {
    if (parentType === 'customTag') {
        return 'customTagIds';
    } else if (parentType === 'target') {
        return  'targetIds';
    }
    return parentType;
}

export const BPSCGoalPromoTargets = ['60165e7aceee0b164f3241e4','620e280695d8141d1ba16b47','620e288147433cfb860bca82','620e27556dfed84a38a73f90','620e2840d67831fb054356af','5ef06006a0ae8e1e94b42095','606f10ea3c1a7c3a7a33f7d7','60165e7aceee0b164f3241f6','5f74d86f6b9db28add13b0c4','60165e7aceee0b164f3241f9','622c9d060d8dffc842781fd0','61e4239fa5c5a3ba248b81ef','60165e7bceee0b164f32465b','603e703cd645db3cd74b7078','60279d2a6a3969ea86f1d8bd','6023821bd1e199b547c75752','5f992036ca7ceffab4b80bc0','6222ec0f831a46b685020760','623c2239d431e75248ccc2de','60165e7aceee0b164f3241fc','605075db62b1af1d7b867e67','5f74d893c3f575ddfab2c9e8','60165e7aceee0b164f3241ff','60165e7aceee0b164f324202','60165e7bceee0b164f32462b','60165e7aceee0b164f324205','60165e7aceee0b164f324208','60186182f75bd5097069fa3f','60186149f75bd5097069f962','5ffdd0b084d60fe0b30e158a','5ffdd09af81379d78dbfae67','6007f2a4ab314fefa64a0edd','5e6189da5f66e94f14a21e98','5e6189da5f66e94f14a21e9a','6007f2844694f5472d61dbf0','60260adb8b79d7ec15cf4921','6012a42c7c9b1a82aad4a048','60165e7bceee0b164f324691','60165e7bceee0b164f32456b','60165e7bceee0b164f324568','60165e7bceee0b164f324565','60165e7bceee0b164f32459e','60165e7bceee0b164f324529','60165e7bceee0b164f3245cb','60165e7bceee0b164f324667','60165e7bceee0b164f3245f8','60165e7bceee0b164f3245c5','60165e7bceee0b164f324589','6149e41796a50d269598e838','60165e7bceee0b164f32457a','60165e7bceee0b164f324577','60165e7bceee0b164f3245a1','60165e7bceee0b164f32463a','60165e7bceee0b164f3245a4','60165e7bceee0b164f3245f5','60165e7bceee0b164f3245f2','60165e7bceee0b164f324559','60165e7bceee0b164f324562','60165e7bceee0b164f3245b0','60165e7bceee0b164f324604','60165e7aceee0b164f324220','606c771f7adb2d4cc6bd5bef','606c7768329b1f265508d18f','60912b069d0c4269a8794d73','60912b43a9bcbc9433ae235f','60165e7bceee0b164f3245aa','60165e7bceee0b164f3245ad','62beda8ba7a5142392be6c96','62c2ab2a01a9c49682e32e81','60165e7aceee0b164f3241e7','602570574e6093c49cc07fe0','600531e12e205ed9c9e7dc00','620e28e1e47af11d38cc6f3f','606c76726d7601b5532a3bde','60165e7bceee0b164f324541','5e6189da5f66e94f14a21f2c','60165e7aceee0b164f3241ea','5e6189da5f66e94f14a21f2e','60165e7bceee0b164f32458c','60165e7bceee0b164f32469d','6034d191886b390704c4e74f','5f401639424382367918c13d','60165e7aceee0b164f3241ed','61bdd2b6c98c5388cd4f39a2','5e6189da5f66e94f14a21f2a','5f3e22aefee34a3b1ae88e30','5ff94915b712df90ed396d57','60165e7aceee0b164f3241f0','620e29d26dfed84a38a78967','6038b481f7115975d4eb6500','6033a2e79f9ecceecef6e386','602e0e726b4bbd00398102b8','6103ab0bd0a5504f23576b66','60165e7bceee0b164f3245a7','621e0ed75c8ffdfabe82590a','62e0d6c9b558d4381dd3e1f1','5ff8561e4fc65c6ce8194889','621e0eaf343e33cfb2615ba1','60dd8c428c635df216691c1c','62959c59e23fd1a398d6efdd'];


export function getQueryStringFromParams(params:any = {}, overrideParams: any = {}){
    let query : string = '';
    let finalParams = {...params,...overrideParams};
    let keys = Object.keys(finalParams);
    if(keys.length > 0){
      query = '?' + keys.map(key => `${key}=${finalParams[key]}`).join('&')
    }
    return query;
  
  }