let savedDataArray = [];

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;
  
    document.getElementById('urlInput').value = (url);
});

chrome.storage.local.get("savedData", function (result) {
    if (!chrome.runtime.lastError && result.savedData) {
        savedDataArray = result.savedData;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const urlInput = document.getElementById("urlInput");
    const htmlTextarea = document.getElementById("htmlTextarea");
    const saveButton = document.getElementById("saveButton");

    saveButton.addEventListener("click", async () => {
        const url = urlInput.value;
        const html = htmlTextarea.value;

        if (url && html) {
            const isDuplicate = savedDataArray.some(item => item.url === url);

            if (!isDuplicate) {
                const data = {
                    url: url,
                    html: html,
                };

                savedDataArray.push(data);

                try {
                    await chrome.storage.local.set({ savedData: savedDataArray });
                } catch (error) {
                    console.error("Error saving data:", error);
                }
            } else {
                console.log("URL already exists in savedDataArray.");
                buttonAlert('saveButton', "Already exists!")
            }
        }
    });
});

function displaySavedURLs() {
    const ulElement = document.getElementById('savedurls');
    
    savedDataArray.forEach(data => {
        const liElem = document.createElement('li');
        const spanElem = document.createElement('span');
        const buttonElem = document.createElement('span');
        
        liElem.setAttribute('data-url',data.url);
        spanElem.addEventListener('click', function() {
            urlInput.value = liElem.getAttribute('data-url');
        });
        
        buttonElem.textContent = "-";
        buttonElem.setAttribute('class', 'delete');
        buttonElem.addEventListener('click', function() {
            deleteFromSavedDataArray(this.parentElement.getAttribute('data-url'));
            this.parentElement.remove();
        });

        spanElem.textContent = data.url;

        liElem.appendChild(buttonElem);
        liElem.appendChild(spanElem);
        
        ulElement.appendChild(liElem);
    });
}
document.addEventListener('DOMContentLoaded', function () {
    displaySavedURLs();
});
  
function getAllDataFromLocalStorage(callback) {
    chrome.storage.local.get("savedData", function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            callback([]);
        } else {
            const savedData = result.savedData || [];
            callback(savedData);
        }
    });
}

deleteButton.addEventListener("click", function () {
    const url = urlInput.value;
  
    if (url) {
        getAllDataFromLocalStorage(function (savedDataArray) {
            const updatedDataArray = savedDataArray.filter((data) => data.url !== url);
            
            chrome.storage.local.set({ savedData: updatedDataArray }, function () {
            });
        });
    }
});

function deleteFromSavedDataArray(url) {
    if (url) {
        getAllDataFromLocalStorage(function (savedDataArray) {
            const updatedDataArray = savedDataArray.filter((data) => data.url !== url);
            
            chrome.storage.local.set({ savedData: updatedDataArray }, function () {
            });
        });
    }
}

function buttonAlert(buttonId, alert) {
    const button = document.getElementById(buttonId)
    const ogText = button.textContent
    const ogBG = button.style.backgroundColor
    button.textContent = alert
    button.style.backgroundColor = '#ff8282'
    setTimeout(() => {
        button.textContent = ogText
        button.style.backgroundColor = ogBG
    }, 1000);
}