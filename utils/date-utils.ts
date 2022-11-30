import {getRoundedFloat, padZero} from './math-utils';

export const MILLI_SECOND = 1;
export const NANO_SECOND = 1 / (MILLI_SECOND * 1e6);
export const SECOND = 1000 * MILLI_SECOND;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const MS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
export const NS_IN_A_DAY = 1000000000 * 60 * 60 * 24;
export const REF_DATE_STR = '1970/1/1';
export const DEFAULT_DATE = (new Date(0));
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const shortMonths = ["Jan","Feb","Mar","Apr", "May","Jun","Jul","Aug", "Sep", "Oct","Nov","Dec"];
export const weekDaysFull=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
type format = 'short' | 'long';

export function isValidDate(dateStr,returnDate=false) {
    var d1 = new Date(dateStr).getTime();
    d1 = d1 || -9999999999;
    var refD = new Date(REF_DATE_STR).getTime();
    return returnDate?(refD < d1?dateStr:false):refD < d1;
};

export function isToday(date){
    const today = new Date()
    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
}

export function getOnlyDateFormat(date) {
    var MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var hrs = padZero((new Date(date).getHours() % 12) === 0 ? 12 : (new Date(date).getHours() % 12));
    var mins = padZero(new Date(date).getMinutes());
    var ampm = (new Date(date).getHours() >= 12) ? 'pm' : 'am';
    var dateNum = padZero(new Date(date).getDate());
    var month = isValidDate(date) ? MONTH[new Date(date).getMonth()] : '';
    if (new Date(date).setHours(0, 0, 0, 0) === new Date(new Date()).setHours(0, 0, 0, 0)) {
        return 'Today '
    } else {
        return month + ' ' + dateNum;
    }
}

export function getAllDaysBetween(startDate, endDate, timeAtMidnight = true){
    startDate = new Date(startDate);
    endDate = new Date(endDate);


    let finalArr = [];
    let dayInMilliSeconds = MS_IN_ONE_DAY;

    let totalDays = (endDate.getTime() - startDate.getTime())/dayInMilliSeconds;
    for(let i = 0; i <= totalDays; i++){
        let dayDiff = i * dayInMilliSeconds;
        let date: any = new Date(startDate.getTime()+dayDiff);
        if(timeAtMidnight){
            date = new Date(date).setHours(0,0,0,0);
        }
        finalArr.push(date);
    }

    return finalArr;
}

export function getWeekDates(currdate, isMondayFirst?, timeAtMidnight?){
    currdate = new Date(currdate); 
    let dateBuffer = 0;
    let dayInMilliSeconds = MS_IN_ONE_DAY;
    let currDay = currdate.getDay();
    if(isMondayFirst){
        dateBuffer = 1;
        currDay = currDay ? currDay : 7;
    }
    var first = currdate.getTime() - (currDay - dateBuffer) * dayInMilliSeconds;   

    let firstDate = new Date(first);
    // let lastDate = new Date(currdate.setDate(firstDate.getDate()+6));

    let weekArr = [];
    weekArr[0] = timeAtMidnight ? firstDate.setHours(0,0,0,0) : firstDate;
    for(let i = 1; i < 7; i++){ //iterating from first date to last 
        let dayDiff = i * dayInMilliSeconds;
        let date: any = new Date(firstDate.getTime()+dayDiff);
        if(timeAtMidnight){
            date = new Date(date).setHours(0,0,0,0);
        }
        weekArr.push(date);
    }
    return weekArr;
}
export function getDateByFormat(date, monthFormat: format = 'short', yearFormat: format = 'short') {
        let dateObj = new Date(date);
        let month: string, day: number, year: number;
        month = MONTHS[dateObj.getMonth()];
        day = dateObj.getDate();
        year = dateObj.getFullYear();

        if (monthFormat === 'short') {
            month = month.slice(0,3);
        }
        if (yearFormat === 'short') {
            year %= 100;
        }
        return `${month} ${day}, ${year}`;
}
export function getDateFormat(date, isSuffix?,format?) {
    var MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var hrs = padZero((new Date(date).getHours() % 12) === 0 ? 12 : (new Date(date).getHours() % 12));
    var mins = padZero(new Date(date).getMinutes());
    var ampm = (new Date(date).getHours() >= 12) ? 'PM' : 'AM';
    var dateNum = padZero(new Date(date).getDate());
    var month = isValidDate(date) ? MONTH[new Date(date).getMonth()] : '';
    if (new Date(date).setHours(0, 0, 0, 0) === new Date(new Date()).setHours(0, 0, 0, 0)) {
        if(isSuffix){
            return hrs + ':' + mins + ' ' + ampm + ' Today';
        }
        return 'Today ' + hrs + ':' + mins + ' ' + ampm
    }
    else {
        switch(format){
            case 'HH MM AMPM DD MM' : return hrs + ':' + mins + ' ' + ampm + ', ' + dateNum+ ' ' + month;
            case 'HH MM AMPM MM DD' : return hrs + ':' + mins + ' ' + ampm + ', ' + month+ ' ' + dateNum;
            case 'DD MM HH MM AMPM' : return dateNum + ' ' + month + ', ' + hrs + ':' + mins + ' ' + ampm;
            default : return hrs + ':' + mins + ' ' + ampm + ', ' + dateNum+ ' ' + month;
        }
    }
};

export function nth (d){
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
}


export function getTimeTextWithDay(date,applyPadZero=false){
    let timeText=createTimeText(date,applyPadZero);
    let weekDay=weekDaysFull[date.getDay()]

    return `${weekDay} ${timeText}` 
}


export function createTimeText(date,applyPadZero=false){
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let ampm = 'AM';
    if(hrs >= 12){
        hrs = (hrs - 12) || 12;
        ampm = 'PM';
    }
    if(mins<10){
      mins = '0' + mins;
    }
    if(applyPadZero){
        hrs = padZero((hrs % 12) === 0 ? 12 : (hrs % 12));
    }

    return `${hrs}:${mins} ${ampm}`;
}

export function formatDate(date = new Date, showNth?, showFullMonth?, showMonthYearOnly?){

    let monthArr = ["Jan","Feb","Mar","Apr",
    "May","Jun","Jul","Aug",
    "Sep", "Oct","Nov","Dec"];
    let  monthArrFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let day: any = date.getDate();
    let year: any = date.getFullYear();
    if(showNth){
      day = day + nth(day);
    }

    let monthName="";
    
    if(showFullMonth){
        monthName = monthArrFull[date.getMonth()];
    }
    else{
       monthName = monthArr[date.getMonth()];
    }

    if(showMonthYearOnly){
        return `${monthName} ${year}`;
    }
    return `${day} ${monthName}`;

}

export function toShortFormat(date = new Date, showNth?){

    if(typeof date === "string") {
        date = new Date(date);
    }


    let monthArr = ["Jan","Feb","Mar","Apr",
      "May","Jun","Jul","Aug",
      "Sep", "Oct","Nov","Dec"];

    let day: any = date.getDate();

    if(showNth){
      day = day + nth(day);
    }
    let monthName = monthArr[date.getMonth()];
    let year = date.getFullYear();

    return `${day} ${monthName} ${year}`;

}

export function isSameDate(date1 = new Date(), date2 = new Date()){
  return new Date(date1).setHours(0, 0, 0, 0) === new Date(date2).setHours(0, 0, 0, 0);
}

export function getTimeDifference (d1, currentTime, isRoundInt?) {
    // used to get the most significant time difference in the order of significance :
    // years/months/weeks/days/hours/mins
    var validateDate = function (dateToValidate) {
        return !isNaN(new Date(dateToValidate).getTime());
    };
    var getUnitDiff = function (d1, d2, MS_IN_UNIT) {
        // d1 -= (d1 % MS_IN_ONE_DAY);
        // d2 -= (d2 % MS_IN_ONE_DAY);
        return Math.floor(d1 && d2 && validateDate(d1) && validateDate(d2) ? (d1 - d2) / MS_IN_UNIT: 0);
    };

    // approximation.
    var diffInYears = getUnitDiff(currentTime, d1, MS_IN_ONE_DAY * 365);
    var diffInMonths = getUnitDiff(currentTime, d1, MS_IN_ONE_DAY * 30);
    var diffInWeeks = getUnitDiff(currentTime, d1, MS_IN_ONE_DAY * 7);
    var diffInDays = getUnitDiff(currentTime, d1, MS_IN_ONE_DAY );
    var diffInMins = getRoundedFloat(getUnitDiff(currentTime, d1,60 * 1000), 0);
    var diffInHours = getRoundedFloat(diffInMins / 60, 0);

    if (diffInYears) {
        return diffInYears === 1 ? diffInYears + ' year ago' : diffInYears + ' years ago';
    } else if (diffInMonths) {
        return diffInMonths === 1 ? diffInMonths + ' month ago' : diffInMonths + ' months ago';
    } else if (diffInWeeks) {
        return diffInWeeks === 1 ? diffInWeeks + ' week ago' : diffInWeeks + ' weeks ago';
    } else if (diffInDays) {
        return diffInDays === 1 ? diffInDays + ' day ago' : diffInDays + ' days ago';
    } else if (diffInHours >= 1) {
        return diffInHours === 1 ? '1 hour ago' : diffInHours + ' hours ago';
    } else if(diffInMins >1){
        return diffInMins + ' mins ago';
    }
    return  ' now' ;
};


export function getTimeLeft(_target) {
    let currentTime = new Date().getTime();
    let target = new Date(_target).getTime();
    let returnObj = {h:0,m:0,s:0};

    if(target < currentTime){
        return returnObj;
    }

    let timeLeft = target - currentTime;

    if(timeLeft > HOUR){
        returnObj.h = Math.floor( timeLeft / HOUR);
        timeLeft = timeLeft % HOUR;
    }
    if(timeLeft > MINUTE){
        returnObj.m = Math.floor( timeLeft / MINUTE);
        timeLeft = timeLeft % MINUTE;
    }

    if(timeLeft > SECOND){
        returnObj.s = Math.floor( timeLeft / SECOND);
        timeLeft = timeLeft % SECOND;
    }

    return returnObj;

}


export function getDurationFromMilliSeconds(timeLeft) {
    let returnObj = {h:0,m:0,s:0};

    if(timeLeft > HOUR){
        returnObj.h = Math.floor( timeLeft / HOUR);
        timeLeft = timeLeft % HOUR;
    }
    if(timeLeft > MINUTE){
        returnObj.m = Math.floor( timeLeft / MINUTE);
        timeLeft = timeLeft % MINUTE;
    }

    if(timeLeft > SECOND){
        returnObj.s = Math.floor( timeLeft / SECOND);
        timeLeft = timeLeft % SECOND;
    }

    return returnObj;

}

export function changeTimezone(origdate, ianatz) {
    // ianatz = Asia/Kolkata - for India
    let date = new Date(origdate);
    return date;
    if( date < new Date("2000-01-01T00:00:00Z")) {
        // this function no workey for the past, is future function only
        return date;
    }

    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-US', {
        timeZone: ianatz
    }));

    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    var diff = date.getTime() - invdate.getTime();

    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date.getTime() - diff); // needs to substract

}

export function getExactDaysDiff(d1, d2) {
    d1 = new Date(d1 || 0);
	d2 = new Date(d2 || 0);
	var diffInMS = d1.getTime() - d2.getTime();
	return Math.ceil((diffInMS) / MS_IN_ONE_DAY);
}

export function getTimeString(date){
    if(!date) {
        return;
    }
    if(typeof date === 'string') {
        date = new Date(date);
    }
    //DD MMM,HH:MM
    return `${date.getDate()} ${shortMonths[date.getMonth()]}, ${date.getHours()}:${(date.getMinutes() < 10)? '0'+date.getMinutes() : date.getMinutes()} `;
}
export function getLatestDate(date1, date2){
    var d1:any = new Date(date1|| 0);
    var d2:any = new Date(date2 || 0);
      if(d1&&d2){
        return (d1>d2)? date1:date2;
      }
        return (d1)? date1:date2;
}




