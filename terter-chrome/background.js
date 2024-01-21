function getDataFromLocalStorage(callback) {
    chrome.storage.local.get("savedData", function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            callback(null);
        } else {
            callback(result.savedData);
            console.log(result.savedData)
        }
    });
}

getDataFromLocalStorage(function (data) {
    if (data) {
        checkUrl(data)
    }
});

function checkUrl(ddd) {
    const myArray = ddd
  
    const targetUrl = window.location.href;
    let containsTargetUrl = false;
    let htmlData = null;
    
    for (const obj of myArray) {
        if (isUrlMatch(obj.url, targetUrl)) {
            containsTargetUrl = true;
            htmlData = obj.html;
            break;
        }
    }
    
    if (htmlData !== null && containsTargetUrl) {
        replacePage(htmlData)
    } else {
    }
}

function isUrlMatch(savedUrlPattern, targetUrl) {
    const regex = new RegExp(savedUrlPattern.replace(/\*/g, '.*'));
    return regex.test(targetUrl);
}

function replacePage(page) {
    document.documentElement.innerHTML = page;
}