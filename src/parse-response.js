
function getParsedHeaders(headersStringArray) {
    const headersMap = new Map();

    for (const header of headersStringArray) {
        const [key, value] = header.split(':');

        const normalizedKey = key.trim().toLowerCase();
        const normalizedValue = value.trim();

        headersMap.set(normalizedKey, normalizedValue);
    }

    return headersMap;

}

function getParsedStatus(statusLineString) {
    const statusLineHeaderArray = statusLineString.split(' ');

    if (!statusLineHeaderArray[0]) {
        throw new Error('Protocol not defined');
    }
    if (!statusLineHeaderArray[1]) {
        throw new Error('Status code does not exist');
    }
    if (!statusLineHeaderArray[2]) {
        throw new Error('Status does not exist');
    }

    return {
        protocol: statusLineHeaderArray[0],
        status: statusLineHeaderArray[1],
        ok: statusLineHeaderArray[2] === 'OK',
    }
}

function getParsedBody(htmlBodyString) {
    if (!htmlBodyString) {
        throw new Error('No response body');
    }

    let text = "";
    let inTag = false;

    const normalizedHtml = htmlBodyString.trim();

    for (let i = 0; i < normalizedHtml.length; i++) {
        const char = normalizedHtml[i];

        if (char === '<') {
            inTag = true;
        } else if (char === '>') {
            inTag = false;
        } else if (!inTag) {
            text += char;
        }
    }

    return text;
}

export function getParsedResponse(responseString) {
    const [headersString, htmlBodyString] = responseString.split("\r\n\r\n");

    if (!headersString) {
        throw new Error('Response string does not contain headers');
    }
    if (!htmlBodyString) {
        throw new Error('Response string does not contain body');
    }

    const [statusHeader, ...restHeaders] = headersString.split('\r\n');

    if (!statusHeader) {
        throw new Error('Status header dont exist')
    }
    if (restHeaders.len === 0) {
        throw new Error('Headers do dont exist')
    }

    return {
        status: getParsedStatus(statusHeader),
        headers: getParsedHeaders(restHeaders),
        body: getParsedBody(htmlBodyString)
    }

}
