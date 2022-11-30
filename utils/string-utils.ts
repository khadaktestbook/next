export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function decodeUTF8 (str) {
    try {
        return decodeURIComponent(escape(str));
    }
    catch(e) {
        return str;
    }
}

export function pad(str, chr, len) {
    if(typeof str !== 'string' && str.toString) {
        str = str.toString();
    }
    if(typeof str == 'string' && str.length < len) {
        return chr.repeat(len - str.length) + str;
    }
    return str;
}

export function htmlspecialchars_decode(str) {
    if (typeof (str) === 'string') {
        /* must do &amp; last */
        str = str.replace(/&gt;/ig, '>').replace(/&lt;/ig, '<').replace(/&#039;/g, "'").replace(/&quot;/ig, '"').replace(/&amp;/ig, '&');
    }
    return str;
};

export function replaceAtIndex(strVal, start, end, replacement) {
    return strVal.substring(0, start) + replacement + strVal.substring(end, strVal.length);
}

const startToken = '@@_';
const endToken = '_@@';

export function replaceTokens(str, tokens, data) {
    let finalStr = '', currStr = '', start = 0, end = str.length, offset = 0, prevEnd = 0;

    for (let i = 0; i < tokens.length; i++) {
        const tokenIdentifier = tokens[i]?.token.replace(startToken, '').replace(endToken, '');
        const isTokenAvailable = Object.keys(data).indexOf(tokenIdentifier) !== -1;
        const currToken = isTokenAvailable ? tokenIdentifier : '';
        if (!currToken){
            return str;
        }

        if (i === tokens.length - 1) {
            currStr = str.substring(prevEnd, str.length);
        }
        else {
            currStr = str.substring(prevEnd, tokens[i].end);
        }

        start = tokens[i].start - offset;
        end = tokens[i].end - offset;

        finalStr = finalStr + replaceAtIndex(currStr, start, end, data[currToken]);

        prevEnd = tokens[i].end;
        offset = offset + currStr.length;
    }
    return finalStr;
}

export function getTokens(stringVal) {
    let cursorIndex = 0;
    const tokenBucket = [];
    let startTokenIndex = 0, endTokenIndex = 0;

    while (cursorIndex < stringVal.length) {

        startTokenIndex = stringVal.indexOf(startToken, cursorIndex);

        if (startTokenIndex !== -1) {
            endTokenIndex = stringVal.indexOf(endToken, cursorIndex);
            cursorIndex = endTokenIndex + 1;

            const end = endTokenIndex + endToken.length;
            const token = stringVal.substring(startTokenIndex, end);
            tokenBucket.push({start: startTokenIndex, end, token});
        }
        else {
            cursorIndex = stringVal.length;
            return tokenBucket;
        }
    }
}

export function transformStringWithTokens(strVal, data) {
    if (!(strVal || data)) {
        return strVal;
    }
    let tokens = getTokens(strVal);
    if (!tokens.length) {
        return strVal;
    }
    return replaceTokens(strVal, tokens , data);
}