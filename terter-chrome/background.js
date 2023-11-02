// Add a function to retrieve data from local storage
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

// Example of how to use the function to retrieve data
getDataFromLocalStorage(function (data) {
    if (data) {
        checkUrl(data)
        console.log("data", data)
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
        console.log(`No object found with the URL: ${targetUrl}`);
    }
}

function replacePage(page) {
    document.documentElement.innerHTML = page;
}