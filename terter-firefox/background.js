function getDataFromLocalStorage(callback) {
    browser.storage.local.get("savedData").then((result) => {
        if (browser.runtime.lastError) {
            console.error(browser.runtime.lastError);
            callback(null);
        } else {
            callback(result.savedData);
        }
    });
}

getDataFromLocalStorage(function (data) {
    if (data) {
        checkUrl(data);
    }
});

function checkUrl(ddd) {
    const myArray = ddd;
  
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
        replacePage(htmlData);
    } else {
        console.error(`No object found with the URL: ${targetUrl}`);
    }
}

function isUrlMatch(savedUrlPattern, targetUrl) {
    const regex = new RegExp(savedUrlPattern.replace(/\*/g, '.*'));
    return regex.test(targetUrl);
}

function replacePage(page) {
    document.documentElement.innerHTML = page;
}
