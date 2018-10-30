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

var findParameterHelpContent = "Arama isleminin yapilacagi parametre yazilir";
var nodeTypeContent = "Bulunan html satirinin hangi ozelliginin kullanilacagi secilmelidir. Attribute secilirse acilan input alanina ismi yazilmalidir.";
var queryParameterContent = "Kosulda aranmasi gereken parametre yazilir";
var startDivContent = "TestLogo kelimesi icin Start Index:Logo Start Add:1 olur ise = ogo";
var endDivContent = "TestLogo kelimesi icin End Index:Logo End Add:1 olur ise = TestL";
var operatorTypeContent = "Hangi islemin yapilacagi secilir.";
var wrapperContent = "Snapshot olustururken tag icin kullanilacak olan ayıraç yazilir.";
var paramValueContent = "Snapshot olustururken kullanilacak olan deger yazilir.";
var findsTypeHelpContent = "Html sayfa icinde aranmasini istediginiz elemanin tipini secmelisiniz. Attribute secilirse tag ismi acilan input alanina yazilmalidir.";
var regexDivContent = "Regex'in başlayacağı ve biteceği aralık seçilir. Bu iki değerin arasına .* regexi konulur."


// addFind butonuna basildigi zaman eklenecek olan form dinamik olarak olusturulur ve eklenir. 
function addFindParameterCombo(documentContent, find) {
    var mainDiv = document.createElement("form");
    mainDiv.className = "well find";

    var inputParameter = document.createElement("input")
    inputParameter.className = "form-control parameter";
    inputParameter.setAttribute("type", "text");

    var label = document.createElement("label");
    label.className = "input-group-addon"
    label.innerHTML = "Find Parameter";

    var inputDiv = document.createElement("div");
    inputDiv.className = "input-group col-md-11";
    inputDiv.appendChild(label);
    inputDiv.appendChild(inputParameter);

    var parameterDiv = document.createElement("div");
    parameterDiv.className = "form-inline parameterDiv"
    parameterDiv.appendChild(inputDiv)
    parameterDiv.appendChild(createHelpTooltip(findParameterHelpContent))

    var removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.className = "btn btn-danger";
    removeButton.innerHTML = "Remove";

    var buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("style", "float:right")
    buttonDiv.appendChild(removeButton);

    var labelHeader = document.createElement("label");
    labelHeader.innerHTML = "Find Parameter Panel"

    var labelDiv = document.createElement("div");
    labelDiv.setAttribute("style", "float:left")
    labelDiv.appendChild(labelHeader);


    removeButton.onclick = function () {
        this.parentElement.parentElement.remove();
    }

    mainDiv.appendChild(labelDiv);
    mainDiv.appendChild(buttonDiv);

    // find nesnesi tanimli gelirse olusturulan div'in icindeki degerler setlenir.
    if (find) {
        mainDiv.appendChild(createNode(find.nodeXML));
        mainDiv.appendChild(createOperatorType(find.operator));
        inputParameter.value = find.parameter;
    } else {
        mainDiv.appendChild(createNode(null))
        mainDiv.appendChild(createOperatorType(null))
    }
    mainDiv.appendChild(parameterDiv)

    document.getElementById(documentContent).appendChild(mainDiv);

    $('[data-toggle="popover"]').popover();
    $('.selectpicker').selectpicker('refresh');
}

// addExtract butonuna basildigi zaman eklenecek olan form dinamik olarak olusturulur ve eklenir. 
// divTypeString ve divTypeBoolean olarak iki adet div olusturulur ve secilen extractType'a gore o div eklenir.
function addTargetParameterCombo(documentContent, extract) {
    var extractStringComponentArray = getExtractStringComponentArray(extract);
    var extractBooleanComponentArray = getExtractBooleanComponentArray(extract);

    var mainDiv = document.createElement("form");
    mainDiv.className = "well extract";

    var addQueryButton = document.createElement("button");
    addQueryButton.setAttribute("type", "button");
    addQueryButton.className = "btn btn-info";
    addQueryButton.innerHTML = "Add Query";
    addQueryButton.setAttribute("style", "margin-left:1%;margin-top:1%");
    addQueryButton.setAttribute("disabled", "disabled");
    addQueryButton.onclick = function () {
        if (selectExtractType.value == EXTRACT_TYPE.STRING.name) {
            extractStringComponentArray.push(createQuery(null));
        } else if (selectExtractType.value == EXTRACT_TYPE.BOOLEAN.name) {
            extractBooleanComponentArray.push(createQuery(null));
        }
        buildMainDiv(selectExtractType, extractStringComponentArray, extractBooleanComponentArray, mainDiv);
    }

    var extractTypeArray = getEnumValuesAsArray(EXTRACT_TYPE);
    var selectExtractType = document.createElement("select");
    selectExtractType.className = "selectpicker extractType";
    selectExtractType.setAttribute("title", "Extract Type");
    for (var i = 0; i < extractTypeArray.length; i++) {
        var option = document.createElement("option");
        option.value = extractTypeArray[i];
        option.text = extractTypeArray[i];
        selectExtractType.append(option);
    }

    var div = document.createElement("div");
    div.className = "form-inline"
    div.setAttribute("style", "clear:both");
    div.appendChild(selectExtractType);
    div.appendChild(addQueryButton);

    //extractType degeri secilince addQuery butonu enable edilir. ExtractType degerine gore divTypeBoolean veya divTypeString eklenir digeri silinir.
    selectExtractType.addEventListener("change", function () {
        addQueryButton.removeAttribute("disabled")
        buildMainDiv(selectExtractType, extractStringComponentArray, extractBooleanComponentArray, mainDiv);
    });

    var removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.className = "btn btn-danger";
    removeButton.innerHTML = "Remove";

    var buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("style", "float:right")
    buttonDiv.appendChild(removeButton);

    var labelHeader = document.createElement("label");
    labelHeader.innerHTML = "Extract Parameter Panel"

    var labelDiv = document.createElement("div");
    labelDiv.setAttribute("style", "float:left")
    labelDiv.appendChild(labelHeader);

    removeButton.onclick = function () {
        this.parentElement.parentElement.remove();
    }

    mainDiv.appendChild(labelDiv)
    mainDiv.appendChild(buttonDiv)
    mainDiv.appendChild(div)

    if (extract) {
        $(selectExtractType).selectpicker('refresh');
        $(selectExtractType).val(extract.extractType);
        addQueryButton.removeAttribute("disabled")
        buildMainDiv(selectExtractType, extractStringComponentArray, extractBooleanComponentArray, mainDiv);
    }
    document.getElementById(documentContent).appendChild(mainDiv);
    $('[data-toggle="popover"]').popover();
    $('.selectpicker').selectpicker('refresh');
}

// extract tanimli ise extractStringArray'e degerleri ile birlikte olusturulmus componentler eklenir. tanimli degil ise sadece component eklenir.
function getExtractStringComponentArray(extract) {
    var extractStringComponentArray = [];
    if (extract) {
        extractStringComponentArray.push(createNode(extract.nodeXML));
        extractStringComponentArray.push(createExtractValue(false, extract.extractValue));
        extract.queries.map(function (query) {
            extractStringComponentArray.push(createQuery(query));
        });
    } else {
        extractStringComponentArray.push(createNode(null));
        extractStringComponentArray.push(createExtractValue(false, null));
    }
    return extractStringComponentArray;
}

// extract tanimli ise extractBooleanArray'e degerleri ile birlikte olusturulmus componentler eklenir. tanimli degil ise sadece component eklenir.
function getExtractBooleanComponentArray(extract) {
    var extractBooleanComponentArray = [];
    if (extract) {
        extractBooleanComponentArray.push(createExtractValue(true, extract.extractValue));
        extract.queries.map(function (query) {
            extractBooleanComponentArray.push(createQuery(query));
        });
    } else {
        extractBooleanComponentArray.push(createExtractValue(true, null));
    }
    return extractBooleanComponentArray;
}

// mainDiv icin secilen extractType'a gore componentler mainDiv'e eklenir. Diger extractType tipi olan componentler silinir.
function buildMainDiv(selectExtractType, extractStringComponentList, extractBooleanComponentList, mainDiv) {
    if (selectExtractType.value == EXTRACT_TYPE.STRING.name) {
        extractStringComponentList.map(function (stringComponent) {
            mainDiv.appendChild(stringComponent);
        });
        extractBooleanComponentList.map(function (booleanComponent) {
            if (mainDiv.contains(booleanComponent)) {
                mainDiv.removeChild(booleanComponent);
            }
        });
    } else if (selectExtractType.value == EXTRACT_TYPE.BOOLEAN.name) {
        extractBooleanComponentList.map(function (stringComponent) {
            mainDiv.appendChild(stringComponent);
        });
        extractStringComponentList.map(function (booleanComponent) {
            if (mainDiv.contains(booleanComponent)) {
                mainDiv.removeChild(booleanComponent);
            }
        });
    }
    $('[data-toggle="popover"]').popover();
    $('.selectpicker').selectpicker('refresh');
}

function createHelpTooltip(content) {
    var button = document.createElement("button");
    button.className = "btn btn-warning helpButton";
    button.setAttribute("type", "button");
    button.setAttribute("data-container", "body");
    button.setAttribute("data-toggle", "popover");
    button.setAttribute("data-placement", "top");
    button.setAttribute("data-trigger", "hover");
    button.setAttribute("data-content", content);

    var span = document.createElement("span");
    span.className = "glyphicon glyphicon-question-sign";

    button.appendChild(span);
    return button;
}

// node icin gerekli olan div dinamik olarak olusturulur.
function createNode(node) {
    var div = document.createElement("div");
    div.className = "form-inline nodeDiv";
    div.setAttribute("style", "clear:both");

    var nodeTypeArray = getEnumValuesAsArray(NODE_TYPE);
    var selectNodeType = document.createElement("select");
    selectNodeType.className = "selectpicker nodeType";
    // selectNodeType.setAttribute("data-width", "auto")
    selectNodeType.setAttribute("title", "Node Type");
    for (var i = 0; i < nodeTypeArray.length; i++) {
        var option = document.createElement("option");
        option.value = nodeTypeArray[i];
        option.text = nodeTypeArray[i];
        selectNodeType.append(option);
    }
    ;

    //nodeType 'Attribute' secilir ise input alani eklenir, aksi takdirde input alani var ise silinir.
    selectNodeType.addEventListener("change", function () {
        if (selectNodeType.value == "Attribute") {
            div.appendChild(inputDiv);
        } else if (div.contains(inputDiv)) {
            div.removeChild(inputDiv);
        }
    });

    var label1 = document.createElement("label");
    label1.className = "input-group-addon"
    label1.innerHTML = "Node Type";

    var selectDiv = document.createElement("div");
    selectDiv.className = "input-group col-md-11";
    selectDiv.appendChild(label1);
    selectDiv.appendChild(selectNodeType);

    var inputNodeTypeValue = document.createElement("input");
    inputNodeTypeValue.className = "form-control nodeTypeValue";
    inputNodeTypeValue.setAttribute("type", "text");

    var label2 = document.createElement("label");
    label2.className = "input-group-addon"
    label2.innerHTML = "Node Type Value";

    var inputDiv = document.createElement("div");
    inputDiv.className = "input-group col-md-11";
    inputDiv.appendChild(label2);
    inputDiv.appendChild(inputNodeTypeValue);

    div.appendChild(selectDiv);
    div.appendChild(createHelpTooltip(nodeTypeContent));


    // node tanimli gelirse degerleri setli getirilir.
    if (node) {
        if (node.nodeXMLType == NODE_TYPE.ATTRIBUTE.name) {
            div.append(inputDiv)
            inputNodeTypeValue.value = node.nodeXMLValue;
        }
        $(selectNodeType).selectpicker('refresh');
        $(selectNodeType).val(node.nodeXMLType).end();
    }

    return div;
}


// query icin gerekli olan div dinamik olarak olusturulur.
function createQuery(query) {
    var mainDiv = document.createElement("form");
    mainDiv.className = "well form-inline query";

    var removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.className = "btn btn-danger";
    removeButton.innerHTML = "Remove";

    var buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("style", "float:right")
    buttonDiv.appendChild(removeButton);

    var labelHeader = document.createElement("label");
    labelHeader.innerHTML = "Query Parameter Panel"

    var labelDiv = document.createElement("div");
    labelDiv.setAttribute("style", "float:left")
    labelDiv.appendChild(labelHeader);

    var inputParameter = document.createElement("input")
    inputParameter.className = "form-control parameter";
    inputParameter.setAttribute("type", "text");

    var label = document.createElement("label");
    label.className = "input-group-addon"
    label.innerHTML = "Query Parameter";

    var inputDiv = document.createElement("div");
    inputDiv.className = "input-group col-md-11";
    inputDiv.appendChild(label);
    inputDiv.appendChild(inputParameter);

    removeButton.onclick = function () {
        this.parentElement.parentElement.remove();
    }

    mainDiv.appendChild(labelDiv);
    mainDiv.appendChild(buttonDiv);

    // query tanimli gelirse degerler setli getirilir.
    if (query) {
        mainDiv.appendChild(createNode(query.nodeXML))
        mainDiv.appendChild(createOperatorType(query.operator))
        inputParameter.value = query.parameter;
    } else {
        mainDiv.appendChild(createNode(null))
        mainDiv.appendChild(createOperatorType(null))
    }
    mainDiv.appendChild(inputDiv);
    mainDiv.appendChild(createHelpTooltip(queryParameterContent));

    $('.selectpicker').selectpicker('refresh');
    $('[data-toggle="popover"]').popover();

    return mainDiv;

}

// query icin gerekli olan div dinamik olarak olusturulur.
function createOperatorType(operator) {
    var div = document.createElement("div");
    div.className = "form-inline operatorDiv"

    var operatorTypeArray = getEnumValuesAsArray(OPERATOR_TYPE);
    var selectOperatorType = document.createElement("select");
    selectOperatorType.className = "selectpicker operatorType";
    // selectOperatorType.setAttribute("data-width", "auto")
    selectOperatorType.setAttribute("title", "Operator Type");
    for (var i = 0; i < operatorTypeArray.length; i++) {
        var option = document.createElement("option");
        option.value = operatorTypeArray[i];
        option.text = operatorTypeArray[i];
        selectOperatorType.append(option);
    }
    var label1 = document.createElement("label");
    label1.className = "input-group-addon"
    label1.innerHTML = "Operator Type";

    var selectDiv = document.createElement("div");
    selectDiv.className = "input-group col-md-11";
    selectDiv.appendChild(label1);
    selectDiv.appendChild(selectOperatorType);

    var inputStartIndexOf = document.createElement("input")
    inputStartIndexOf.className = "form-control startIndexOf";
    inputStartIndexOf.setAttribute("type", "text");
    var label2 = document.createElement("label");
    label2.className = "input-group-addon"
    label2.innerHTML = "Start Index";
    var inputStartIndexOfDiv = document.createElement("div");
    inputStartIndexOfDiv.className = "input-group col-md-5";
    inputStartIndexOfDiv.appendChild(label2);
    inputStartIndexOfDiv.appendChild(inputStartIndexOf);

    var inputStartAdd = document.createElement("input")
    inputStartAdd.className = "form-control startAdd";
    inputStartAdd.setAttribute("type", "text");
    var label3 = document.createElement("label");
    label3.className = "input-group-addon"
    label3.innerHTML = "Start Add";
    var inputStartAddDiv = document.createElement("div");
    inputStartAddDiv.className = "input-group col-md-5 col-sm-offset-1";
    inputStartAddDiv.appendChild(label3);
    inputStartAddDiv.appendChild(inputStartAdd);

    var startDiv = document.createElement("div");
    startDiv.className = "form-inline"
    startDiv.appendChild(inputStartIndexOfDiv);
    startDiv.appendChild(inputStartAddDiv);
    startDiv.appendChild(createHelpTooltip(startDivContent));


    var inputEndIndexOf = document.createElement("input")
    inputEndIndexOf.className = "form-control endIndexOf";
    inputEndIndexOf.setAttribute("type", "text");
    var label4 = document.createElement("label");
    label4.className = "input-group-addon"
    label4.innerHTML = "End Index";
    var inputEndIndexOfDiv = document.createElement("div");
    inputEndIndexOfDiv.className = "input-group col-md-5";
    inputEndIndexOfDiv.appendChild(label4);
    inputEndIndexOfDiv.appendChild(inputEndIndexOf);

    var inputEndAdd = document.createElement("input")
    inputEndAdd.className = "form-control endAdd";
    inputEndAdd.setAttribute("type", "text");
    var label5 = document.createElement("label");
    label5.className = "input-group-addon"
    label5.innerHTML = "End Add";
    var inputEndAddDiv = document.createElement("div");
    inputEndAddDiv.className = "input-group col-md-5 col-sm-offset-1";
    inputEndAddDiv.appendChild(label5);
    inputEndAddDiv.appendChild(inputEndAdd);

    var endDiv = document.createElement("div");
    endDiv.className = "form-inline"
    endDiv.appendChild(inputEndIndexOfDiv);
    endDiv.appendChild(inputEndAddDiv);
    endDiv.appendChild(createHelpTooltip(endDivContent));

    div.appendChild(selectDiv);
    div.appendChild(createHelpTooltip(operatorTypeContent));
    div.appendChild(startDiv);
    div.appendChild(endDiv);

    // operator tanimli gelirse degerler setli getirilir.
    if (operator) {
        $(selectOperatorType).selectpicker('refresh');
        $(selectOperatorType).val(operator.operatorType).end();
        inputStartIndexOf.value = operator.startIndexOf;
        inputStartAdd.value = operator.startAdd;
        inputEndIndexOf.value = operator.endIndexOf;
        inputEndAdd.value = operator.endAdd;
    }

    return div;
}

// extractValue icin gerekli olan div dinamik olarak olusturulur.
function createExtractValue(isExtractTypeBoolean, operator) {
    var div = document.createElement("div");
    div.className = "form-inline extractValueDiv"

    var inputStartIndexOf = document.createElement("input")
    inputStartIndexOf.className = "form-control startIndexOf";
    inputStartIndexOf.setAttribute("type", "text");
    var label2 = document.createElement("label");
    label2.className = "input-group-addon"
    label2.innerHTML = "Start Index";
    var inputStartIndexOfDiv = document.createElement("div");
    inputStartIndexOfDiv.className = "input-group col-md-5";
    inputStartIndexOfDiv.appendChild(label2);
    inputStartIndexOfDiv.appendChild(inputStartIndexOf);

    var inputStartAdd = document.createElement("input")
    inputStartAdd.className = "form-control startAdd";
    inputStartAdd.setAttribute("type", "text");
    var label3 = document.createElement("label");
    label3.className = "input-group-addon"
    label3.innerHTML = "Start Add";
    var inputStartAddDiv = document.createElement("div");
    inputStartAddDiv.className = "input-group col-md-5 col-sm-offset-1";
    inputStartAddDiv.appendChild(label3);
    inputStartAddDiv.appendChild(inputStartAdd);

    var startDiv = document.createElement("div");
    startDiv.className = "form-inline"
    startDiv.appendChild(inputStartIndexOfDiv);
    startDiv.appendChild(inputStartAddDiv);
    startDiv.appendChild(createHelpTooltip(startDivContent));


    var inputEndIndexOf = document.createElement("input")
    inputEndIndexOf.className = "form-control endIndexOf";
    inputEndIndexOf.setAttribute("type", "text");
    var label4 = document.createElement("label");
    label4.className = "input-group-addon"
    label4.innerHTML = "End Index";
    var inputEndIndexOfDiv = document.createElement("div");
    inputEndIndexOfDiv.className = "input-group col-md-5";
    inputEndIndexOfDiv.appendChild(label4);
    inputEndIndexOfDiv.appendChild(inputEndIndexOf);

    var inputEndAdd = document.createElement("input")
    inputEndAdd.className = "form-control endAdd";
    inputEndAdd.setAttribute("type", "text");
    var label5 = document.createElement("label");
    label5.className = "input-group-addon"
    label5.innerHTML = "End Add";
    var inputEndAddDiv = document.createElement("div");
    inputEndAddDiv.className = "input-group col-md-5 col-sm-offset-1";
    inputEndAddDiv.appendChild(label5);
    inputEndAddDiv.appendChild(inputEndAdd);

    var endDiv = document.createElement("div");
    endDiv.className = "form-inline"
    endDiv.appendChild(inputEndIndexOfDiv);
    endDiv.appendChild(inputEndAddDiv);
    endDiv.appendChild(createHelpTooltip(endDivContent));

    var inputWrapper = document.createElement("input")
    inputWrapper.className = "form-control wrapper";
    inputWrapper.setAttribute("type", "text");
    var label6 = document.createElement("label");
    label6.className = "input-group-addon"
    label6.innerHTML = "Wrapper";
    var inputWrapperDiv = document.createElement("div");
    inputWrapperDiv.className = "input-group col-md-11 wrapperDiv";
    inputWrapperDiv.appendChild(label6);
    inputWrapperDiv.appendChild(inputWrapper);

    var inputStartRegex = document.createElement("input")
    inputStartRegex.className = "form-control startRegex";
    inputStartRegex.setAttribute("type", "text");
    var label7 = document.createElement("label");
    label7.className = "input-group-addon"
    label7.innerHTML = "Start Regex";
    var inputStartRegexDiv = document.createElement("div");
    inputStartRegexDiv.className = "input-group col-md-5";
    inputStartRegexDiv.appendChild(label7);
    inputStartRegexDiv.appendChild(inputStartRegex);

    var inputEndRegex = document.createElement("input")
    inputEndRegex.className = "form-control endRegex";
    inputEndRegex.setAttribute("type", "text");
    var label8 = document.createElement("label");
    label8.className = "input-group-addon"
    label8.innerHTML = "End Regex";
    var inputEndRegexDiv = document.createElement("div");
    inputEndRegexDiv.className = "input-group col-md-5 col-sm-offset-1";
    inputEndRegexDiv.appendChild(label8);
    inputEndRegexDiv.appendChild(inputEndRegex);

    var regexDiv = document.createElement("div");
    regexDiv.className = "form-inline"
    regexDiv.appendChild(inputStartRegexDiv);
    regexDiv.appendChild(inputEndRegexDiv);
    regexDiv.appendChild(createHelpTooltip(regexDivContent));


    var inputValue = document.createElement("input")
    inputValue.className = "form-control paramValue";
    inputValue.setAttribute("type", "text");
    var label7 = document.createElement("label");
    label7.className = "input-group-addon"
    label7.innerHTML = "Value";
    var inputValueDiv = document.createElement("div");
    inputValueDiv.className = "input-group col-md-11 paramValueDiv";
    inputValueDiv.appendChild(label7);
    inputValueDiv.appendChild(inputValue);

    div.appendChild(startDiv);
    div.appendChild(endDiv);
    div.appendChild(inputWrapperDiv);
    div.appendChild(createHelpTooltip(wrapperContent));
    div.appendChild(regexDiv);


    // isExtractTypeBoolean ise inputValue alani eklenir.
    if (isExtractTypeBoolean) {
        div.appendChild(inputValueDiv)
        div.appendChild(createHelpTooltip(paramValueContent));
    }
    // operator tanimli gelir ise degerler setli getirilir.
    if (operator) {
        inputStartIndexOf.value = operator.startIndexOf;
        inputStartAdd.value = operator.startAdd;
        inputEndIndexOf.value = operator.endIndexOf;
        inputEndAdd.value = operator.endAdd;
        inputWrapper.value = operator.wrapper;
        inputValue.value = operator.parameterValue;
        inputStartRegex.value = operator.startRegex;
        inputEndRegex.value = operator.endRegex;
    }
    return div;
}