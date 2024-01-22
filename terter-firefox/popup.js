let savedDataArray = [];

browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;

    document.getElementById('urlInput').value = url;
});

browser.storage.local.get("savedData", function (result) {
    if (!browser.runtime.lastError && result.savedData) {
        savedDataArray = result.savedData;
    }
});

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
                } catch (error) {
                    console.error("Error saving data:", error);
                }
            } else {
                console.log("URL already exists in savedDataArray.");
                buttonAlert('saveButton', "Already exists!");
            }
        }
    });

    deleteButton.addEventListener("click", function () {
        const url = urlInput.value;

        if (url) {
            savedDataArray = savedDataArray.filter(data => data.url !== url);

            browser.storage.local.set({ savedData: savedDataArray });
        }
    });

    displaySavedURLs()
});

function displaySavedURLs() {
    const ulElement = document.getElementById('savedurls');
    ulElement.innerHTML = ""

    savedDataArray.forEach(data => {
      const liElement = document.createElement('li');

      liElement.textContent = data.url;

      ulElement.appendChild(liElement);
    });
}

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
