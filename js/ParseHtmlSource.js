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

// storage'de kayitli olan fileContent cekilir. Ardindan gelen document ile birlikte fileContent ve snapshot icin gerekli olan fileName
//parametre olarak parseTextAsXml metoduna gonderilir.
function getXMLConfig(document_root, fileName) {
    chrome.storage.local.get(function (items) {
        var configFileContent = items.configFile.fileContent;
        parseTextAsXml(configFileContent, fileName, document_root);
    });
}

// content xml dosyasina kaydedilir.
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

// gelen configFileContent xml formatina cevrilir ve bunun icinden getRuleFromXml metodu ile rule'lar cekilir.
// initialParseHtml metoduna gelen document ve olusturulan rules gonderilir, bu metodun gonderildigi deger source'a setlenerek
// saveTextMessageAsFile metodu yardimi ile xml dosya olusturulur.
function parseTextAsXml(configFileContent, fileName, document_root) {
    var parser = new DOMParser();
    var xmlDom = parser.parseFromString(configFileContent, "text/xml");
    if (xmlDom) {
        var rules = getRuleFromXml(xmlDom);
        var source = initialParseHtml(rules, document_root);
        saveTextMessageAsFile(fileName, source);
    } else {
        alert("dosya yukleyiniz.")
    }
}