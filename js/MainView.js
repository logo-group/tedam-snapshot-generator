/*
* Copyright 2014-2019 Logo Business Solutions
* (a.k.a. LOGO YAZILIM SAN. VE TIC. A.S)
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not
* use this file except in compliance with the License. You may obtain a copy of
* the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/

// activeTab icin content.js 'e mesaj gondererek config dosyasi ismini ve method ismi olarak getDOM gonderir. bununla birlikte activeTab document'i de gonderilir.
function executeScript() {
    // Get the active tab
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        // If there is an active tab...
        if (tabs.length > 0) {
            // ...send a message requesting the DOM...
            chrome.tabs.sendMessage(tabs[0].id, {
                    method: "getDOM",
                    fileName: getFileName()
                }
                //
                /* function (response) {
                     if (chrome.runtime.lastError) {
                         // An error occurred :(
                         console.log("ERROR: ", chrome.runtime.lastError);
                     } else {
                         // Do something useful with the HTML content
                         console.log(
                             response.htmlContent
                         );
                     }
                 }*/
            )
        }
        ;
    });
};

// inputFileNameToSaveAs alanina deger girilmis ise bu deger return edilir eger deger tanimli degil ise 'denemeSnapshot' return edilir.
function getFileName() {
    var fileNameToSaveAs = document.getElementById("inputSnapshotFileName");
    var fileName = "denemeSnapshot";
    if (fileNameToSaveAs.value) {
        fileName = fileNameToSaveAs.value;
    }
    return fileName;
}

//window.onload = dene();

document.getElementById("createConfigFile").addEventListener("click", function () {
    window.open("Settings.html?isConfigEdit=false");
});

document.getElementById("editConfigFile").addEventListener("click", function () {
    window.open("Settings.html?isConfigEdit=true");
});

// saveContent butonuna basildigi zaman executeScript metodu cagirilir. 
document.getElementById("saveContent").addEventListener("click", executeScript);

var configFile;

var configFileChooser = document.getElementById('ConfigFileChooser');

// configFileChooser in degeri degistigi zaman handleFileSelection metodu cagilir.
configFileChooser.addEventListener('change', handleFileSelection, false);

// okunma islemi tamamlandigi zaman fileContent ve fileName ile configFile nesnesi olusturulur ve chrome storage'e kaydedilir.
function waitForTextReadComplete(reader) {
    reader.onloadend = function (event) {
        fileContent = event.target.result;
        fileName = configFileChooser.value.substring(configFileChooser.value.lastIndexOf("\\") + 1);
        configFile = new ConfigFile(fileName, fileContent);
        save_options();
    }
}

// secilen dosya bulunur ve okunur.
function handleFileSelection() {
    var file = configFileChooser.files[0],
        reader = new FileReader();
    waitForTextReadComplete(reader);
    reader.readAsText(file);
}

// olusturuluan configFile nesnesi local storage'e kaydedilir.
function save_options() {
    chrome.storage.local.set({
        configFile: configFile
    }, function () {
        // Update status to let user know options were saved.
        alert("File is uploaded");
    });
}

// storage'deki configFileName degeri cekilerek document'te ilgili alana set edilir.
function restore_options() {
    chrome.storage.local.get(function (items) {
        document.getElementById('ConfigFileName').innerHTML = items.configFile.fileName;
    });
}

//DOMContent yuklendigi zaman restore_options metodu cagirilr.
document.addEventListener('DOMContentLoaded', restore_options, false);

document.getElementById("exportConfigFile").addEventListener("click", function () {
    chrome.storage.local.get(function (items) {
        var configFile = items.configFile;
        saveTextMessageAsFile(configFile.fileName, configFile.fileContent)
    });
});

// parametre olarak gelen text icerigi parametre olarak gelen fileName adinda xml uzantili dosya olusturur.
function saveTextMessageAsFile(fileName, text) {
    var textToWrite = "\ufeff" + text;
    var textFileAsBlob = new Blob([textToWrite], {
        type: 'text/plain'
    });
    var fileNameToSaveAs = fileName;
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs + ".xml";
    downloadLink.innerHTML = "Download File";
    if (window.URL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}