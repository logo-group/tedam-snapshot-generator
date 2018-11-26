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

var formNameRuleList = [];
var versionRuleList = [];
var ruleList = [];
var allRuleList = [];
var isModified;

// parametre olarak gelen rule icin modal'da gizli olarak yazilan ruleOrder degeri alinir.
// ardindan eger ruleList'te bu order'a ait rule var ise yeni gelen rule icerigi bununla degistirilir.
// eger ruleList'te yok ise yeni eleman eklenir.
function addRuleToArray(rule) {
    var ruleOrder = $("#ruleOrder").html();
    var ruleType = $("#ruleType").html();
    if (isEqual(ruleType, RULE_TYPE.FORMNAME.name)) {
        if (formNameRuleList[ruleOrder]) {
            console.log(ruleOrder + " .siradaki formName rule duzenlendi")
            if (JSON.stringify(formNameRuleList[ruleOrder]) === JSON.stringify(rule)) {
                console.dir(isModified);
                console.log("Degisiklik yapilmadi")
            } else {
                isModified = true;
                console.dir(isModified);
                console.log("Degisiklik yapildi")
                console.dir(formNameRuleList[ruleOrder])
                console.dir(rule)
                formNameRuleList[ruleOrder] = rule;
                $(window).bind('beforeunload', function () {
                    return true;
                });
            }
        } else {
            console.log("yeni formName rule eklenecek")
            formNameRuleList.push(rule);
            $(window).bind('beforeunload', function () {
                return true;
            });
        }
    } else if (isEqual(ruleType, RULE_TYPE.VERSION.name)) {
        if (versionRuleList[ruleOrder]) {
            console.log(ruleOrder + " .siradaki version rule duzenlendi")
            if (JSON.stringify(versionRuleList[ruleOrder]) === JSON.stringify(rule)) {
                console.dir(isModified);
                console.log("Degisiklik yapilmadi")
            } else {
                isModified = true;
                console.dir(isModified);
                console.log("Degisiklik yapildi")
                console.dir(versionRuleList[ruleOrder])
                console.dir(rule)
                versionRuleList[ruleOrder] = rule;
                $(window).bind('beforeunload', function () {
                    return true;
                });
            }
        } else {
            console.log("yeni version rule eklenecek")
            versionRuleList.push(rule);
            $(window).bind('beforeunload', function () {
                return true;
            });
        }
    } else {
        if (ruleList[ruleOrder]) {
            console.log(ruleOrder + " .siradaki rule duzenlendi")
            if (JSON.stringify(ruleList[ruleOrder]) === JSON.stringify(rule)) {
                console.dir(isModified);
                console.log("Degisiklik yapilmadi")
            } else {
                isModified = true;
                console.dir(isModified);
                console.log("Degisiklik yapildi")
                console.dir(ruleList[ruleOrder])
                console.dir(rule)
                ruleList[ruleOrder] = rule;
                $(window).bind('beforeunload', function () {
                    return true;
                });
            }
        } else {
            console.log("yeni rule eklenecek")
            ruleList.push(rule);
            $(window).bind('beforeunload', function () {
                return true;
            });
        }
    }
}

//addRule butonuna basildigi zaman dinamik olarak rule satiri eklenir. 
//addRuleParameterCombo metoduna ilk gonderilen parametre bu rule satirinin hangi alana eklenecegidir.
//addRuleParameterCombo metoduna ikinci gonderilen deger ilk olusturma icin null gonderilir, fakat olusturulmus olan icin ikinci parametrede rule gonderilir.
document.getElementById("addRule").addEventListener("click", function () {
    addRuleParameterCombo("ruleContent", null, true);
});

function addFormNameParameterCombo(isRemoved) {
    var rule = new Rule("", RULE_TYPE.FORMNAME.name, "", [])
    addRuleParameterCombo("ruleFormNameContent", rule, isRemoved);
}

function addVersionParameterCombo(isRemoved) {
    var rule = new Rule("", RULE_TYPE.VERSION.name, "", [])
    addRuleParameterCombo("ruleVersionContent", rule, isRemoved);
}

// gelen documentContent 'e olusturdugu divi ekler. eger rule bos gelmez ise olusturdugu div'in icinde degerlerini setler.
function addRuleParameterCombo(documentContent, rule, isRemoved) {
    var div = document.createElement("div");
    div.className = "form-inline ruleDiv"

    // combobox icin olusturulur.
    var ruleTypeArray = getEnumValuesAsArray(RULE_TYPE);
    var select = document.createElement("select");
    select.className = "selectpicker ruleType";
    select.setAttribute("data-size", "6");
    select.setAttribute("data-container", "body");
    // select.setAttribute("data-style", "btn-sm");
    select.setAttribute("title", "Rule Type");
    for (var i = 0; i < ruleTypeArray.length; i++) {
        var option = document.createElement("option");
        option.value = ruleTypeArray[i];
        option.text = ruleTypeArray[i];
        select.append(option);
    }

    var selectDiv = document.createElement("div");
    selectDiv.className = "input-group col-md-3"
    selectDiv.appendChild(select);

    var input = document.createElement("input")
    input.className = "form-control ruleName";
    input.setAttribute("type", "text");
    input.setAttribute("placeHolder", "Rule Name")

    var inputDiv = document.createElement("div");
    inputDiv.className = "input-group col-md-7"
    inputDiv.appendChild(input)

    var lang = $('option:selected', '#mySelect').attr('id');
    var defineButton = document.createElement("button");
    defineButton.setAttribute("type", "button");
    defineButton.className = "btn btn-info defineButton";
    defineButton.innerHTML = "Define";
    defineButton.setAttribute("key", "define");
    defineButton.innerHTML = arrLang[lang]["define"];
    
    var lang = $('option:selected', '#mySelect').attr('id');
    var removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.className = "btn btn-danger removeButton ";
    removeButton.innerHTML = "Remove";
    removeButton.setAttribute("key", "remove3");
    removeButton.innerHTML = arrLang[lang]["remove3"];
    if (isRemoved == false) {
        removeButton.setAttribute("disabled", "disabled");
    }
    if ("ruleContent" != documentContent) {
        select.setAttribute("disabled", "disabled");
    } else {
        select.remove(0);
        select.remove(0);
    }

    var buttonDiv = document.createElement("div");
    buttonDiv.className = "input-group col-md-2"
    buttonDiv.appendChild(defineButton)
    buttonDiv.appendChild(removeButton)

    div.appendChild(selectDiv)
    div.appendChild(inputDiv)
    div.appendChild(buttonDiv)

    // eger rule tanimli ise degerleri alanlara setlenir.
    if (rule) {
        input.value = rule.name;
        $(select).selectpicker('refresh');
        $(select).val(rule.ruleType).end();
    }
    document.getElementById(documentContent).appendChild(div);
    $('.selectpicker').selectpicker('refresh');

    // sil butonuna basildigi zaman kacinci sil butonu oldugu bulunarak ruleOrder bulunur. Rule satiri ve ruleList icinden ilgili rule silinir.
    removeButton.onclick = function () {
        var buttonList = [];
        var buttonFormNameContentList = $("#ruleFormNameContent .removeButton");
        var buttonFormNameLength = buttonFormNameContentList.length;
        var buttonVersionContentList = $("#ruleVersionContent .removeButton");
        var buttonVersionLength = buttonVersionContentList.length;
        var buttonRuleContentList = $("#ruleContent .removeButton");
        var buttonList = $.merge($.merge(buttonFormNameContentList, buttonVersionContentList), buttonRuleContentList);
        for (var i = 0; i < buttonList.length; i++) {
            if (buttonList[i].isSameNode(removeButton)) {
                this.parentElement.parentElement.remove();
                if (i < buttonFormNameLength) {
                    var ruleOrder = i;
                    console.log(ruleOrder + ".siradaki formName rule silinecek");
                    formNameRuleList.splice(ruleOrder, 1);
                } else if (i < buttonFormNameLength + buttonVersionLength) {
                    var ruleOrder = i - buttonFormNameLength;
                    console.log(ruleOrder + ".siradaki version rule silinecek");
                    versionRuleList.splice(ruleOrder, 1);
                } else {
                    var ruleOrder = i - buttonFormNameLength - buttonVersionLength;
                    console.log(ruleOrder + ".siradaki rule silinecek");
                    ruleList.splice(ruleOrder, 1);
                }
                $(window).bind('beforeunload', function () {
                    return true;
                });
            }
        }
    }

    // tanimla butonuna basildigi zaman kacinci tanimla butonu oldugu bulunarak ruleOrder bulunur. 
    // Eger ruleList[ruleOrder] var ise openModal metoduna parametre olarak false gonderilir aksi takdirde true gonderilir.
    defineButton.onclick = function () {
        var buttonFormNameContentList = $("#ruleFormNameContent .defineButton");
        var buttonFormNameLength = buttonFormNameContentList.length;
        var buttonVersionContentList = $("#ruleVersionContent .defineButton");
        var buttonVersionLength = buttonVersionContentList.length;
        var buttonRuleContentList = $("#ruleContent .defineButton");
        var buttonList = $.merge($.merge(buttonFormNameContentList, buttonVersionContentList), buttonRuleContentList);
        for (var i = 0; i < buttonList.length; i++) {
            if (buttonList[i].isSameNode(defineButton)) {
                if (i < buttonFormNameLength) {
                    var ruleOrder = i;
                    if (formNameRuleList[i]) {
                        openModal(i, input.value, select.value, false);
                    } else {
                        openModal(i, input.value, select.value, true);
                    }
                } else if (i < buttonFormNameLength + buttonVersionLength) {
                    var ruleOrder = i - buttonFormNameLength;
                    if (versionRuleList[ruleOrder]) {
                        openModal(ruleOrder, input.value, select.value, false);
                    } else {
                        openModal(ruleOrder, input.value, select.value, true);
                    }
                } else {
                    var ruleOrder = i - buttonFormNameLength - buttonVersionLength;
                    if (ruleList[ruleOrder]) {
                        openModal(ruleOrder, input.value, select.value, false);
                    } else {
                        openModal(ruleOrder, input.value, select.value, true);
                    }
                }
            }
        }
    }
}


// defineRuleModal acilir. isNew parametresi true gelirse modal sifirlanir, false gelirse modal duzenle olarak acilir.
// ruleOrder parametresini modal'da hidden alan olan ruleOrder'a yazilir. Modal'daki ruleType alanina ruleType ve ruleName alanina ruleName yazilir.
// Modal ilk acildigi zaman step1'in acik gelmesi saglanir.
function openModal(ruleOrder, ruleName, ruleType, isNew) {
    console.log("ruleType : " + ruleType + " icin ruleOrder : " + ruleOrder)
    resetModal();
    if (isNew) {
        console.log("Modal yeni olusturulacak")
    } else {
        if (isEqual(ruleType, RULE_TYPE.FORMNAME.name)) {
            console.log("FormNameRule Modal duzenlenecek")
            var editedRule = formNameRuleList[ruleOrder];
            editModal(editedRule);
        } else if (isEqual(ruleType, RULE_TYPE.VERSION.name)) {
            console.log("VersionRule Modal duzenlenecek")
            var editedRule = versionRuleList[ruleOrder];
            editModal(editedRule);
        } else {
            console.log("Rule Modal duzenlenecek")
            var editedRule = ruleList[ruleOrder];
            editModal(editedRule);
        }
    }
    $('#defineRuleModal').modal({
        backdrop: "static",
        keyboard: false
    });

    $("#ruleOrder").text(ruleOrder);
    $("#ruleType").text(ruleType);
    $("#ruleName").text(ruleName);
    $('#linkStep1').click();
}

// Modal'i edit etmek icin kullanilir. Parametre olarak gonderilen rule'a gore setModalFinds ve setModalExtracts metodlari cagirilacak.
function editModal(rule) {
    console.dir(rule);
    setModalFinds(rule);
    setModalExtracts(rule);
}

// Parametre olarak gelen rule'a ait modal'da findListType degeri setlenecek. Eger findListType degeri 'Element' ise findsTypeValue alani content'e eklenecek.
// Ardindan findList'in icinde findArray'in boyutu 0 dan buyuk ise findArray'in her elemani icin addFindParameterCombo metodu cagirilacak. 
// findArray'in boyutu 0 ise find combolari eklenmeyecek.
function setModalFinds(rule) {
    $("select#findsType").val(rule.findList.findListType);
    $("#addFind").prop('disabled', false);
    if (rule.findList.findListType == FIND_LIST_TYPE.ELEMENT.name) {
        appendFindsTypeValue(rule.findList.findListTypeValue);
    }
    $('.selectpicker').selectpicker('refresh')
    if (rule.findList && rule.findList.findArray.length > 0) {
        rule.findList.findArray.map(function (find) {
            addFindParameterCombo("findContent", find);
        })
    }

};

// Parametre olarak gelen rule'a ait extracts'lar icinde donecek. Her bir target icin target.targetType'a gore switch ederek target.extractArray icinde donerek
// addTargetParameterCombo metodu cagirilacak.
// extracts kontrolu yapilmiyor cunku Tag, Title, Enabled alanlarinin doldurulmasi zorunlu.
function setModalExtracts(rule) {
    rule.extracts.map(function (target) {
        switch (target.targetType) {
            case TARGET_TYPE.TAG.name:
                $('#querySelectorTag').val(target.targetQuery);
                target.extractArray.map(function (extract) {
                    addTargetParameterCombo("tagContent", extract);
                });
                break;
            case TARGET_TYPE.TITLE.name:
                $('#querySelectorTitle').val(target.targetQuery);
                target.extractArray.map(function (extract) {
                    addTargetParameterCombo("titleContent", extract);
                });
                break;
            case TARGET_TYPE.VALUE.name:
                $('#querySelectorValue').val(target.targetQuery);
                if (target.extractArray.length > 0) {
                    if (!$("#hasEnabled").is(":checked")) {
                        $("#hasEnabled").parent().click()
                    }
                }
                target.extractArray.map(function (extract) {
                    addTargetParameterCombo("valueContent", extract);
                });
                break;
            case TARGET_TYPE.ENABLED.name:
                $('#querySelectorEnabled').val(target.targetQuery);
                target.extractArray.map(function (extract) {
                    addTargetParameterCombo("enabledContent", extract);
                });
                break;
        }
    });
}

// parametre olarak gonderilen modalId'nin kapatilmasini saglar.
function closeModal(modalId) {
    $('#' + modalId).modal('hide');
}

// defineRuleModal'in icindeki input,textarea,select componentlerinin degerini bosaltir, stepContent'lerinin icini bosaltir, findsTypeValue
function resetModal() {
    $("#defineRuleModal")
        .find('input,textarea,select')
        .val('')
        .end()
        .find('.stepContent')
        .html('')
        .end()
        .find('div.findsTypeValueDiv')
        .remove()
        .end();
    $('.selectpicker').selectpicker('refresh');
    if ($("#hasEnabled").is(":checked")) {
        $("#hasEnabled").parent().click()
    }
};

// storage'den configFile.fileContent'i cekilir ve xml'e cevrilir. Bu xml'in icinden getRuleFromXml metodu ile rule'lar cikarilir. 
// RuleArray'deki her rule icin addRuleParameterCombo metodu rule gonderilerek cagirilir. ruleList'e ilgili rule eklenir ve modal edit edilir.
function editModalWithConfigFile() {
    var configFileRuleList;
    chrome.storage.local.get(function (items) {
        var configFileContent = items.configFile.fileContent;
        var parser = new DOMParser();
        var xmlDom = parser.parseFromString(configFileContent, "text/xml");
        if (xmlDom) {
            configFileRuleList = getRuleFromXml(xmlDom);
            configFileRuleList.ruleArray.map(function (rule) {
                if (isEqual(rule.ruleType, RULE_TYPE.FORMNAME.name)) {
                    addRuleParameterCombo("ruleFormNameContent", rule, false);
                    console.log(rule)
                    formNameRuleList.push(rule)
                    editModal(rule);
                } else if (isEqual(rule.ruleType, RULE_TYPE.VERSION.name)) {
                    addRuleParameterCombo("ruleVersionContent", rule, false);
                    versionRuleList.push(rule)
                    editModal(rule);
                } else {
                    addRuleParameterCombo("ruleContent", rule, true);
                    ruleList.push(rule)
                    editModal(rule);
                }
            });
        }
        $('#loader').attr('style', 'display: none');
        $('#Settings').attr('style', 'display: block');
    });
}

$(document).ready(function () {
    document.getElementById("findsTypeHelp").setAttribute("data-content", findsTypeHelpContent)
    $('[data-toggle="popover"]').popover();
    isModified = false;
    var urlParameters = document.URL.substring(document.URL.lastIndexOf("?") + 1).split("&");
    var urlParametersMap = new Map();
    urlParameters.map(function (urlParameter) {
        var parametersKeyAndValue = urlParameter.split("=");
        urlParametersMap.set(parametersKeyAndValue[0], parametersKeyAndValue[1]);
    })
    if (urlParametersMap.get("isConfigEdit") == BOOLEAN_TYPE.TRUE.name) {
        console.log("Editing uploaded config file")
        editModalWithConfigFile();
    } else if (urlParametersMap.get("isConfigEdit") == BOOLEAN_TYPE.FALSE.name) {
        console.log("Creating new config file")
        $('#loader').attr('style', 'display: none')
        $('#Settings').attr('style', 'display: block')
        addFormNameParameterCombo(false);
        addVersionParameterCombo(false);
    }
    createFindsTypeOption();

});

function createFindsTypeOption() {
    var selectFindsType = document.getElementById("findsType");
    var findsTypeArray = getEnumValuesAsArray(FIND_LIST_TYPE);
    findsTypeArray.map(function (findsType) {
        var option = document.createElement("option");
        option.text = findsType;
        selectFindsType.add(option);
    })
    $('.selectpicker').selectpicker('refresh');
}

// saveAsConfigFile butonuna basilinca configFileName girilmis ise fileName olarak cekilir.
// convertToXMLFormat metodu ile content olusturulur. saveTextMessageAsFile metoduna configFileName ve content gonderilir.
document.getElementById("exportConfigFile").addEventListener("click", function () {
    $(window).unbind("beforeunload");
    var configFileName = document.getElementById("inputConfigFileName").value;
    if (!configFileName) {
        configFileName = "denemeConfig"
    }
    // formNameRuleList , versionRuleList ve RuleList birlestirilerek allRuleList olusturulur.
    allRuleList = formNameRuleList.concat(versionRuleList, ruleList);
    console.log(allRuleList)
    var content = convertToXMLFormat();
    console.dir(content)
    saveTextMessageAsFile(configFileName, content)
    //closePage();
});

//$("#helpFindsContent").append(createHelpTooltip("Bulunacak olan html tag'inin tipini seciniz.Add find butonu ile kesişim kurallarını ekleyebilirsiniz.", false));

document.getElementById("updateConfigFile").addEventListener("click", function () {
    $(window).unbind("beforeunload");
    // formNameRuleList , versionRuleList ve RuleList birlestirilerek allRuleList olusturulur.
    allRuleList = formNameRuleList.concat(versionRuleList, ruleList);
    var content = convertToXMLFormat();
    var configFileName = document.getElementById("inputConfigFileName").value;
    if (!configFileName) {
        configFileName = "updatedConfig"
    }
    var updatedConfigFile = new ConfigFile(configFileName, content)
    chrome.storage.local.set({
        configFile: updatedConfigFile
    }, function () {
        // Update status to let user know options were saved.
        alert("Config file is updated.");
    });
});

document.getElementById("cancelButton").addEventListener("click", function () {
    closePage();
});

// sayfayi kapamak icin kullanilir.
function closePage() {
    window.close();
}

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