export function setCookie(name, value) {
    let Days = 30;
    let exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

export function getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    arr = document.cookie.match(reg);
    if (arr)
        return unescape(arr[2]);
    else
        return null;
}
