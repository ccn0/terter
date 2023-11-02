function getDataFromLocalStorage(callback) {
    chrome.storage.local.get("savedData", function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            callback(null);
        } else {
            callback(result.savedData);
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
        if (obj.url === targetUrl) {
            containsTargetUrl = true;
            htmlData = obj.html;
            break; // Exit the loop early since we found a match
        }
    }
    
    if (htmlData !== null && containsTargetUrl) {
        replacePage(htmlData)
    } else {
        console.error(`No object found with the URL: ${targetUrl}`);
    }
}

function replacePage(page) {
    document.documentElement.innerHTML = page;
}