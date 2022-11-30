
export function padZero(p) {
    return p < 10 ? "0" + p : p;
};

export function getRoundedFloat(m, digits) {
    if (!digits && digits != 0)		{ digits = 2; }
    var hundreds = Math.pow(10, digits);
    return (Math.round(m * hundreds) / hundreds) || 0;
}

export function numberWithUnits(number){
    let count="";
    let resultant="";
    if(number/100000 > 0){
        count=(number/100000).toFixed(1);
        resultant=count+"L+";
    }
    else{
        count=(number/1000).toFixed(1);
        resultant=count+"k+"
    }    
    return resultant;
}
