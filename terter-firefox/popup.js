let savedDataArray = [];

browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;

    document.getElementById('urlInput').value = url;
});

function refreshSavedDataArray() {
    browser.storage.local.get("savedData", function (result) {
        if (!browser.runtime.lastError && result.savedData) {
            savedDataArray = result.savedData;
        }
    }); 
};

browser.storage.local.get("savedData", function (result) {
    if (!browser.runtime.lastError && result.savedData) {
        savedDataArray = result.savedData;
        displaySavedURLs();
    }
});

function getAllDataFromLocalStorage(callback) {
    browser.storage.local.get("savedData", function (result) {
        if (browser.runtime.lastError) {
            console.error(browser.runtime.lastError);
            callback([]);
        } else {
            const savedData = result.savedData || [];
            callback(savedData);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const urlInput = document.getElementById("urlInput");
    const htmlTextarea = document.getElementById("htmlTextarea");
    const saveButton = document.getElementById("saveButton");
    const deleteButton = document.getElementById("deleteButton");

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
                    await browser.storage.local.set({ savedData: savedDataArray });
                    refreshSavedDataArray();
                } catch (error) {
                    console.error("Error:", error);
                }
            } else {
                buttonAlert('saveButton', "Already exists!");
            }
        }
    });

    deleteButton.addEventListener("click", function () {
        const url = urlInput.value;

        if (url) {
            savedDataArray = savedDataArray.filter(data => data.url !== url);

            browser.storage.local.set({ savedData: savedDataArray });
            refreshSavedDataArray();
        }
    });
});
function deleteFromSavedDataArray(url) {
    if (url) {
        getAllDataFromLocalStorage(function (savedDataArray) {
            const updatedDataArray = savedDataArray.filter((data) => data.url !== url);
            
            browser.storage.local.set({ savedData: updatedDataArray }, function () {
            });
        });
        refreshSavedDataArray();
    }
}
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
        buttonElem.title = "Delete URL Entry";
        buttonElem.setAttribute('class', 'delete');
        buttonElem.addEventListener('click', function() {
            deleteFromSavedDataArray(this.parentElement.getAttribute('data-url'));
            this.parentElement.remove();
        });

        spanElem.textContent = data.url;
        spanElem.title = data.url.substring(0,30);

        liElem.appendChild(buttonElem);
        liElem.appendChild(spanElem);
        
        ulElement.appendChild(liElem);
    });
};

function buttonAlert(buttonId, alert) {
    const button = document.getElementById(buttonId);
    const ogText = button.textContent;
    const ogBG = button.style.backgroundColor;
    button.textContent = alert;
    button.style.backgroundColor = '#ff8282';
    setTimeout(() => {
        button.textContent = ogText;
        button.style.backgroundColor = ogBG;
    }, 1000);
}