let savedDataArray = [];

// Get the current tab's URL
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;
  
    // Now 'url' contains the URL of the current tab
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
            // Check if the URL already exists in savedDataArray
            const isDuplicate = savedDataArray.some(item => item.url === url);

            if (!isDuplicate) {
                const data = {
                    url: url,
                    html: html,
                };

                savedDataArray.push(data);

                // Save data to local storage
                try {
                    await chrome.storage.local.set({ savedData: savedDataArray });
                } catch (error) {
                    console.error("Error saving data:", error);
                }
            } else {
                // URL is already in the array
                console.log("URL already exists in savedDataArray.");
                buttonAlert('saveButton', "Already exists!")
            }
        }
    });
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
            // Find and remove the data entry with a matching URL
            const updatedDataArray = savedDataArray.filter((data) => data.url !== url);
            
            // Save the updated array to local storage
            chrome.storage.local.set({ savedData: updatedDataArray }, function () {
            });
        });
    }
});

function buttonAlert(buttonId, alert) {
    const button = document.getElementById(buttonId)
    const ogText = button.textContent
    const ogBG = button.style.backgroundColor
    button.textContent = alert
    button.style.backgroundColor = '#ff8282'
    setTimeout(() => {
        button.textContent = ogText
        button.style.backgroundColor = ogBG
    }, 1000); // 1000 milliseconds = 1 second
}