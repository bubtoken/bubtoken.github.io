function createCookie(cookieName, cookieValue, daysToExpire) {
    let date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
}

function checkURLForRef() {
    if (window.location.href.indexOf("ref=") < 0) {
        return ""
    } else {
        const index = window.location.href.indexOf("ref=") + 4
        return window.location.href.slice(index, index + 42)
    }
}

if (checkURLForRef().length > 0) {
    createCookie("ref", checkURLForRef(), 10000000)
}