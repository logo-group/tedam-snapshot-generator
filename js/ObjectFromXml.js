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

/**
 * gelen xmlDom icinde tag i rule olan tum elemanlara ulasilir.
 * Bu elemanlar arasında donulerek name, type parametreleri alinir ve finds ve extracts nesnelerinin doldurulması icin getFindList ve getTargetList metoduna finds ve extracts tagi ile baslayan elemanlar yollanir.
 * Bu metodlardan gelen degerlerle birlikte rule nesnesi olusturulur
 */
function getRuleFromXml(xmlDom) {
    var ruleArray = [];
    var rules = xmlDom.getElementsByTagName("rule");
    for (var i = 0; i < rules.length; i++) {
        var name = rules[i].getAttribute("name");
        var ruleType = rules[i].getAttribute("type");
        var findList = getFindListFromXml(rules[i].getElementsByTagName("finds"));
        var extracts = getTargetListFromXml(rules[i].getElementsByTagName("extracts"));
        var rule = new Rule(name, ruleType, findList, extracts);
        ruleArray.push(rule);
    }
    var hasFrame = xmlDom.getElementsByTagName("rules")[0].getAttribute("hasFrame");
    var frameId = xmlDom.getElementsByTagName("rules")[0].getAttribute("frameId");
    var objRules = new Rules(hasFrame, frameId, ruleArray);
    return objRules;
}

/**
 * Gelen findList tek eleman oldugu icin ilk elemana findList[0] ile ulasilir ve findListType'i setlenir. Eger findListType element'e esit ise findListTypeValue da setlenir.
 * Ardindan findList icindeki find'lari bulmak icin getFindArray() metodu cagirilir. En sonunda nesne olarak FindList olusturulur ve dondurulur.
 */
function getFindListFromXml(findList) {
    var objFinds = "";
    if (findList.length > 0) {
        var findListTypeValue = "";
        var findListType = findList[0].getAttribute("type");
        if (isEqual(findListType, FIND_LIST_TYPE.ELEMENT.name)) {
            findListTypeValue = findList[0].getAttribute("typeValue");
        }
        var findArray = getFindArrayFromXml(findList);
        objFinds = new FindList(findListTypeValue, findListType, findArray);
    }
    return objFinds;
}

/**
 * gelen findList icinden find lari dongu ile gezerek getFind() metodu ile olusan Find nesnesi findedArray'e doldurulur ve dondurulur.
 */
function getFindArrayFromXml(finds) {
    var findArray = [];
    if (finds.length > 0) {
        var findList = finds[0].getElementsByTagName("find");
        for (var i = 0; i < findList.length; i++) {
            var find = getFindFromXml(findList[i]);
            findArray.push(find);
        }
    }
    return findArray;
}

/**
 * gelen find icinden node, operator, parameter degerlerini bularak Find nesnesi olusturur ve dondurur.
 */
function getFindFromXml(find) {
    var nodeXML = getNodeXMLFromXml(find.getElementsByTagName("node"));
    var operator = getOperatorFromXml(find.getElementsByTagName("operator"));
    var parameter = getParameterFromXml(find.getElementsByTagName("parameter"));
    var objFind = new Find(nodeXML, operator, parameter);
    return objFind;
}

/**
 * verilen text ile targetText'i kucuk harfe cevirir ve karsilastirir ayni ise true doner.
 */
function isEqual(text, targetText) {
    if (text && targetText && text.toLowerCase().localeCompare(targetText.toLowerCase()) == 0) {
        return true;
    }
    return false;
}

/**
 *  gelen nodes listesinde tek eleman oldugundan ilk elemana nodes[0] ile ulasilir. Ulasilan node'un type'i kontrol edilir, eger type'ı ATTRIBUTE ise innerHTML'i alinir.
 *  TYPE ve TEXT degerleri ile NodeXML nesnesi olusturulur ve dondurulur.
 */
function getNodeXMLFromXml(nodes) {
    var nodeXML = "";
    if (nodes.length > 0) {
        var nodeTypeValue = "";
        var nodeType = "";
        if (nodes[0].getAttribute("type")) {
            nodeType = nodes[0].getAttribute("type")
        }
        if (isEqual(nodeType, NODE_TYPE.ATTRIBUTE.name)) {
            nodeTypeValue = nodes[0].innerHTML;
        }
        var nodeXML = new NodeXML(nodeType, nodeTypeValue);
    }
    return nodeXML;
}

/**
 * gelen operators listesinde tek eleman oldugundan ilk elemana operators[0] ile ulasilir.
 * Ulasilan node'un equals diye tag'i var ise operatorType'i equals, contains diye tag'i var ise operatorType'i contains olarak atanir. operatore ait startIndexOf, startAdd, endIndexOf, endAdd ozellikleri alinarak
 * Operator nesnesi olusturulur ve dondurulur.
 */
function getOperatorFromXml(operators) {
    var objOperator = "";
    if (operators.length > 0) {
        var operatorType = "";
        var operator;
        getEnumValuesAsArray(OPERATOR_TYPE).map(function (enumOperatorType) {
            if (operators[0].getElementsByTagName(enumOperatorType).length != 0) {
                operator = operators[0].getElementsByTagName(enumOperatorType)[0];
                operatorType = enumOperatorType;
            }
            ;
        })
        var startIndexOf = operator.getAttribute("startIndexOf");
        var startAdd = operator.getAttribute("startAdd");
        var endIndexOf = operator.getAttribute("endIndexOf");
        var endAdd = operator.getAttribute("endAdd");
        objOperator = new Operator(operatorType, startIndexOf, startAdd, endIndexOf, endAdd);
    }
    return objOperator;
}

/**
 *  gelen parameters listesinde tek eleman oldugundan ilk elemana parameters[0] ile ulasilir. Ulasilan node 'un innerHTML'i parameter olarak atanir ve geri dondurulur.
 */
function getParameterFromXml(parameters) {
    var parameter = "";
    if (parameters.length > 0) {
        parameter = parameters[0].innerHTML;
    }
    return parameter;
}

/**
 * parametre olarak gelen extracts tek elemanli oldugu icin extracts[0] ile ilk elemanina ulasilir ve target'lar cekilerek targetArray dizisine Target objesi olarak doldurulur.
 */
function getTargetListFromXml(extracts) {
    var targetArray = [];
    if (extracts.length > 0) {
        var targetList = extracts[0].getElementsByTagName("target");
        for (var i = 0; i < targetList.length; i++) {
            var target = getTargetFromXml(targetList[i]);
            targetArray.push(target);
        }
    }
    return targetArray;
}

/**
 * gelen target elementinin icinde bulunan tag leri object olarak alinir ve target objesi olusturulur ve dondurulur.
 */
function getTargetFromXml(target) {
    var extractArray = getExtractArrayFromXml(target.getElementsByTagName("extract"));
    var targetType = target.getAttribute("type");
    var targetQuery = getTagValue(target.getAttribute("targetQuery"));
    var objTarget = new Target(targetType, targetQuery, extractArray);
    return objTarget;
}

function getTagValue(element) {
    if (jQuery.isEmptyObject(element)) {
        return "";
    } else {
        return element;
    }
}

/**
 *  gelen extractList icinde donerek her bir eleman getExtract metoduna gonderilir ve object olarak alinarak extractArray a doldurulur.
 */
function getExtractArrayFromXml(extractList) {
    var extractArray = [];
    if (extractList.length > 0) {
        for (var i = 0; i < extractList.length; i++) {
            var extract = getExtractFromXml(extractList[i]);
            extractArray.push(extract);
        }
    }
    return extractArray;
}

/**
 * gelen her bir extract'ta bulunan tag'ler nesne olarak alinarak Extract nesnesi olusturulur ve dondurulur.
 */
function getExtractFromXml(extract) {
    var extractType = extract.getAttribute("type");
    var nodeXML = getNodeXMLFromXml(extract.getElementsByTagName("node"));
    var queries = getQueryArrayFromXml(extract.getElementsByTagName("queries"));
    var extractValue = getValueFromXml(extractType, extract.getElementsByTagName("value"));
    var objExtract = new Extract(extractType, nodeXML, queries, extractValue);
    return objExtract;
}

/**
 * gelen values listesi tek elemanli oldugu icin ilk elemanina values[0] ile ulasilir ve startIndexOf, startAdd, endIndexOf, endAdd, wrapper ozelliklerine ulasilir.
 * Ardindan gelen type parametresine gore eger BOOLEAN ise bu elemanin innerHTML'i text olarak setlenir. Bu ozellikler ile Value nesnesi olusturularak dondurulur.
 */
function getValueFromXml(extractType, values) {
    var value = "";
    if (values.length > 0) {
        var parameter = "";
        var startIndexOf = values[0].getAttribute("startIndexOf");
        var startAdd = values[0].getAttribute("startAdd");
        var endIndexOf = values[0].getAttribute("endIndexOf");
        var endAdd = values[0].getAttribute("endAdd");
        var wrapper = values[0].getAttribute("wrapper");
        var startRegex = values[0].getAttribute("startRegex");
        var endRegex = values[0].getAttribute("endRegex");
        if (isEqual(extractType, EXTRACT_TYPE.BOOLEAN.name)) {
            parameter = values[0].innerHTML;
        }
        var value = new Value(parameter, startIndexOf, startAdd, endIndexOf, endAdd, wrapper, startRegex, endRegex);
    }
    return value;
}

/**
 * gelen queries listesi tek elemanli oldugundan ilk elemana queries[0] ile ulasilir. Bunun içinden de query tag lerinin oldugu liste queryList'e atanir. Bu listede donerek her bir query icin nesne olusturulup dondurulerek queryArray'e eklenir.
 */
function getQueryArrayFromXml(queries) {
    var queryArray = [];
    if (queries.length > 0) {
        var queryList = queries[0].getElementsByTagName("query");
        for (var i = 0; i < queryList.length; i++) {
            var query = getQueryFromXml(queryList[i]);
            queryArray.push(query);
        }
    }
    return queryArray;
}

/**
 * gelen her bir query'de bulunan tag'ler nesne olarak alinarak Query nesnesi olusturulur ve dondurulur.
 */
function getQueryFromXml(query) {
    var nodeXML = getNodeXMLFromXml(query.getElementsByTagName("node"));
    var operator = getOperatorFromXml(query.getElementsByTagName("operator"));
    var parameter = getParameterFromXml(query.getElementsByTagName("parameter"));
    var objQuery = new Query(nodeXML, operator, parameter);
    return objQuery;
}