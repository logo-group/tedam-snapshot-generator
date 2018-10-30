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

// document_root'un icinden rule nesnesi cikarmak icin gerekli olan degerler alinir ve rule nesnesi olusturulur.
// olusturulan bu rule addRuleToArray metoduna gonderilerek ruleList'e eklenmesi saglanir.
function parseModalElements(document_root) {
    var order = $("#ruleOrder")[0].innerHTML;
    var findListMap = getFindsTypeAndValue(document_root);
    var findArray = [];
    // her bir target icin extractArray olusturulur ve bu tagler icin olan extractlar bu array'lere eklenir.
    var extractArrayTag = [];
    var extractArrayTitle = [];
    var extractArrayValue = [];
    var extractArrayEnabled = [];
    var extractList = [];
    // queryDiv icin olusturulan formlar haric olarak formlar toplanir.
    var forms = $("form:not(.query)");
    for (var i = 0; i < forms.length; i++) {
        // forms[i]'nin class isminde find gecmesi onun find formu oldugunu gosterir.
        if (forms[i].className.includes("find")) {
            findArray.push(getFind(forms[i]));
            // forms[i]'nin class isminde extract gecmesi onun extract formu oldugunu gosterir.
        } else if (forms[i].className.includes("extract")) {
            // forms[i]'nin ustunde degisiklik yapmak icin forms[i] klonlanir.
            var extractContent = $('form:not(.query)').eq(i).clone();
            // tek elemanli oldugu icin ilk elemani secilir.
            extractContent = extractContent[0];
            var queryContentArray = "";
            // forms[i]'nin icinde queryDiv'leri var mi diye kontrol edilir.
            if (forms[i].getElementsByClassName("query").length > 0) {
                // forms[i]'nin icinden tekrar form tagleri cekilir ve bu queryContentArray'a setlenir.
                queryContentArray = forms[i].getElementsByTagName("form");
                console.log(queryContentArray)
                // extractContent'in icinde bulunan formlarin sayisi 0 dan buyuk oldugu surece doner.
                while (extractContent.getElementsByTagName("form").length > 0) {
                    // extractContent'in icinde bulunan formlarin ilkini siler.
                    extractContent.removeChild(extractContent.getElementsByTagName("form")[0]);
                }
                // while'dan ciktiginda extractContent'in icindeki formlar silinmis olur.
            }
            console.log(extractContent)
            if (forms[i].parentElement.getAttribute("id").includes("tag")) {
                extractArrayTag.push(getExtract(extractContent, queryContentArray));
            } else if (forms[i].parentElement.getAttribute("id").includes("title")) {
                extractArrayTitle.push(getExtract(extractContent, queryContentArray));
            } else if (forms[i].parentElement.getAttribute("id").includes("value")) {
                extractArrayValue.push(getExtract(extractContent, queryContentArray));
            } else if (forms[i].parentElement.getAttribute("id").includes("enabled")) {
                extractArrayEnabled.push(getExtract(extractContent, queryContentArray));
            }
        }
    }
    var findList = new FindList(findListMap.get("findsTypeValue"), findListMap.get("findsType"), findArray);
    var targetTag = new Target(TARGET_TYPE.TAG.name, getTagValue($("#querySelectorTag")[0].value), extractArrayTag);
    var targetTitle = new Target(TARGET_TYPE.TITLE.name, getTagValue($("#querySelectorTitle")[0].value), extractArrayTitle);
    extractList.push(targetTag)
    extractList.push(targetTitle)
    if (extractArrayValue.length > 0) {
        var targetValue = new Target(TARGET_TYPE.VALUE.name, getTagValue($("#querySelectorValue")[0].value), extractArrayValue);
        extractList.push(targetValue)
    }
    var targetEnabled = new Target(TARGET_TYPE.ENABLED.name, getTagValue($("#querySelectorEnabled")[0].value), extractArrayEnabled);
    extractList.push(targetEnabled)
    var rule = new Rule($("#ruleName")[0].innerHTML, $("#ruleType")[0].innerHTML, findList, extractList);
    console.log(rule);
    addRuleToArray(rule)
}

function getTagValue(element) {
    if (jQuery.isEmptyObject(element)) {
        return "";
    } else {
        return element;
    }
}

// document_root'un icinde findsListMap olusturulur ve return edilir.
// findsType degeri var ise eklenir, findsTypeValue degeri var ise eklenir degeri yok ise bos degerli olarak eklenir.
function getFindsTypeAndValue(document_root) {
    var findsListMap = new Map();
    if (document_root.getElementById("findsType").value) {
        findsListMap.set("findsType", document_root.getElementById("findsType").value)
    } else {
        findsListMap.set("findsType", "");
    }
    if (document_root.getElementById("findsTypeValue")) {
        findsListMap.set("findsTypeValue", document_root.getElementById("findsTypeValue").value)
    } else {
        findsListMap.set("findsTypeValue", "");
    }
    return findsListMap;
}

// form'dan inputElementsMap ve selectElementsMap map'leri olusturulur.
// find nesnesi olusturmak icin gerekli olan degerler alinarak find nesnesi olusturulur ve return edilir.
function getFind(form) {
    var inputElementsMap = getInputElementsValue(form.getElementsByTagName("input"));
    var selectElementsMap = getSelectElementsValue(form.getElementsByTagName("select"));
    var operator = getOperator(inputElementsMap, selectElementsMap);
    var nodeXML = getNode(inputElementsMap, selectElementsMap);
    var find = new Find(nodeXML, operator, inputElementsMap.get("parameter"));
    return find;
}

// extractContent'ten inputElementsMap ve selectElementsMap map'leri olusturulur. 
// extract nesnesi olusturmak icin gerekli olan degerler alinarak extract nesnesi olusturulur ve return edilir.
function getExtract(extractContent, queryContentArray) {
    var inputElementsMap = getInputElementsValue(extractContent.getElementsByTagName("input"));
    var selectElementsMap = getSelectElementsValue(extractContent.getElementsByTagName("select"));
    var extractType = selectElementsMap.get("extractType");
    var extractQuery = inputElementsMap.get("extractQuery");
    var nodeXML = getNode(inputElementsMap, selectElementsMap);
    var queries = getQueryArray(queryContentArray);
    var value = getValue(inputElementsMap);
    var extract = new Extract(extractType, nodeXML, queries, value);
    return extract;
}

// inputElementArray icindeki her bir inputElement'in class'inda icerdigi degere gore inputElementsMap doldurulur.
// inputElementMap icinde nodeTypeValue, paramValue key'leri olusmamis ise inputElementsMap'e degerleri bos olacak sekilde eklenir ve return edilir.
function getInputElementsValue(inputElementArray) {
    var inputElementsMap = new Map();
    Array.from(inputElementArray).map(function (inputElement) {
        if (inputElement.className.includes("startIndexOf")) {
            inputElementsMap.set("startIndexOf", inputElement.value)
        } else if (inputElement.className.includes("startAdd")) {
            inputElementsMap.set("startAdd", inputElement.value)
        } else if (inputElement.className.includes("endIndexOf")) {
            inputElementsMap.set("endIndexOf", inputElement.value)
        } else if (inputElement.className.includes("endAdd")) {
            inputElementsMap.set("endAdd", inputElement.value)
        } else if (inputElement.className.includes("parameter")) {
            inputElementsMap.set("parameter", inputElement.value)
        } else if (inputElement.className.includes("nodeTypeValue")) {
            inputElementsMap.set("nodeTypeValue", inputElement.value)
        } else if (inputElement.className.includes("wrapper")) {
            inputElementsMap.set("wrapper", inputElement.value)
        } else if (inputElement.className.includes("paramValue")) {
            inputElementsMap.set("paramValue", inputElement.value)
        } else if (inputElement.className.includes("startRegex")) {
            inputElementsMap.set("startRegex", inputElement.value)
        } else if (inputElement.className.includes("endRegex")) {
            inputElementsMap.set("endRegex", inputElement.value)
        }
    });
    if (!inputElementsMap.has("nodeTypeValue")) {
        inputElementsMap.set("nodeTypeValue", "");
    }
    if (!inputElementsMap.has("paramValue")) {
        inputElementsMap.set("paramValue", "");
    }
    console.log(inputElementsMap);
    return inputElementsMap;
}

// selectElementArray icindeki her bir selectElement'in class'inda icerdigi degere gore selectElementsMap doldurulur ve return edilir.
function getSelectElementsValue(selectElementArray) {
    var selectElementsMap = new Map();
    Array.from(selectElementArray).map(function (selectElement) {
        if (selectElement.className.includes("extractType")) {
            selectElementsMap.set("extractType", selectElement.value)
        } else if (selectElement.className.includes("nodeType")) {
            selectElementsMap.set("nodeType", selectElement.value)
        } else if (selectElement.className.includes("operatorType")) {
            selectElementsMap.set("operatorType", selectElement.value)
        }
    });
    if (!selectElementsMap.has("nodeType")) {
        selectElementsMap.set("nodeType", "");
    }
    console.log(selectElementsMap);
    return selectElementsMap;
}

// inputElementsMap ve selectElementsMAp icinden operator nesnesi olusturmak icin gerekli olan degerler alinarak operator nesnesi olusturulur ve return edilir.
function getOperator(inputElementsMap, selectElementsMap) {
    var operatorType = selectElementsMap.get("operatorType");
    var startIndexOf = inputElementsMap.get("startIndexOf");
    var startAdd = inputElementsMap.get("startAdd");
    var endIndexOf = inputElementsMap.get("endIndexOf");
    var endAdd = inputElementsMap.get("endAdd");
    var operator = new Operator(operatorType, startIndexOf, startAdd, endIndexOf, endAdd);
    return operator;
}

// inputElementsMap ve selectElementsMap icinden node nesnesi olusturmak icin gerekli olan degerler alinarak node nesnesi olusturulur ve return edilir.
function getNode(inputElementsMap, selectElementsMap) {
    var nodeXMLType = selectElementsMap.get("nodeType");
    var nodeXMLValue = inputElementsMap.get("nodeTypeValue");
    var nodeXML = new NodeXML(nodeXMLType, nodeXMLValue);
    return nodeXML;
}

// queryContentArray icindeki her bir query icin inputElementsMap ve selectElementsMap map'leri olusturulur ve getQuery metoduna gonderilerek query nesnesi olusturulur.
// olusturulan bu nesne queryArray'e eklenir ve return edilir.
function getQueryArray(queryContentArray) {
    var queryArray = [];
    Array.from(queryContentArray).map(function (query) {
        var inputElementsMap = getInputElementsValue(query.getElementsByTagName("input"));
        var selectElementsMap = getSelectElementsValue(query.getElementsByTagName("select"));
        var queryObj = getQuery(inputElementsMap, selectElementsMap);
        queryArray.push(queryObj);
    });
    return queryArray;
}

// inputElementsMap ve selectElementsMap icinden query nesnesi olusturmak icin gerekli olan degerler alinarak query nesnesi olusturulur ve return edilir.
function getQuery(inputElementsMap, selectElementsMap) {
    var nodeXML = getNode(inputElementsMap, selectElementsMap);
    var operator = getOperator(inputElementsMap, selectElementsMap);
    var parameter = inputElementsMap.get("parameter");
    var query = new Query(nodeXML, operator, parameter);
    return query;
}

// inputELementsMap icinden value nesnesi olusturmak icin gerekli olan degerler alinarak value nesnesi olusturulur ve return edilir.
function getValue(inputElementsMap) {
    var startIndexOf = inputElementsMap.get("startIndexOf");
    var startAdd = inputElementsMap.get("startAdd");
    var endIndexOf = inputElementsMap.get("endIndexOf");
    var endAdd = inputElementsMap.get("endAdd");
    var wrapper = inputElementsMap.get("wrapper");
    var parameterValue = inputElementsMap.get("paramValue");
    var startRegex = inputElementsMap.get("startRegex");
    var endRegex = inputElementsMap.get("endRegex");
    var objValue = new Value(parameterValue, startIndexOf, startAdd, endIndexOf, endAdd, wrapper, startRegex, endRegex);
    return objValue;
}