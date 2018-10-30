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

// config dosyasi icin gerekli olan xml yapisi olusturulur. ruleList'teki her rule icin doneren finds ve extracts nesneleri eklenir.
// uretilen content'in son hali dosyanin tum icerigidir ve return edilir.
function convertToXMLFormat() {
    var xmlContent = '<xml>\n';
    xmlContent += '<rules>\n';

    allRuleList.map(function (rule) {
        xmlContent += "<rule";
        xmlContent += " name ='" + rule.name + "'";
        xmlContent += " type ='" + rule.ruleType + "'";
        xmlContent += ">\n";

        xmlContent += addFindListToXML(rule.findList)
        xmlContent += addTargetListToXML(rule.extracts)

        xmlContent += "</rule>\n";
    });

    xmlContent += '</rules>\n';
    xmlContent += '</xml>\n';

    //config dosyasi olustururken & yazilinca edit ile modal acinca sorunla karsilasildigi icin yapildi.
    xmlContent = xmlContent.split("&").join("&amp;");

    return xmlContent;
}

// parametre olarak gelen findList icindeki findListType'a gore xml'e type'i set edilir. Eger findListTypeValue var ise xml'e typeValue set edilir.
// ardindan findList'te bulunan her bir find icin donerek find nesnesi icin olusturulam xml content eklenir. uretilen content return edilir.
function addFindListToXML(findList) {
    var findListXMLContent = "";
    findListXMLContent += "<finds";
    findListXMLContent += " type='" + findList.findListType + "'";
    if (findList.findListTypeValue) {
        findListXMLContent += " typeValue='" + findList.findListTypeValue + "'";
    }
    findListXMLContent += ">\n";
    if (findList.findArray) {
        findList.findArray.map(function (find) {
            findListXMLContent += addFindToXML(find);
        });
    }
    findListXMLContent += "</finds>\n";
    return findListXMLContent;
}

// parametre olarak gelen find nesnesi icin find xml tag'i uretilir. uretilen content return edilir.
function addFindToXML(find) {
    var findXMLContent = "<find>\n";
    findXMLContent += addNodeToXML(find.nodeXML);
    findXMLContent += addOperatorToXML(find.operator);
    findXMLContent += addParameter(find.parameter);
    findXMLContent += "</find>\n";
    return findXMLContent;
}

// parametre olarak gelen node nesnesi icin node xml tag'i uretilir.
// nodeXMLType var ise eklenir. nodeXMLValue var ise eklenir. uretilen content return edilir.
function addNodeToXML(node) {
    var nodeXMLContent = "<node";
    if (node.nodeXMLType) {
        nodeXMLContent += " type='" + node.nodeXMLType + "'"
    }
    nodeXMLContent += ">";
    if (node.nodeXMLValue) {
        nodeXMLContent += node.nodeXMLValue;
    }
    nodeXMLContent += "</node>\n";
    return nodeXMLContent;
}

// parametre olarak gelen operator nesnesi icin operator xml tag'i uretilir. uretilen content return edilir.
function addOperatorToXML(operator) {
    var operatorXMLContent = "<operator>\n";
    operatorXMLContent += "<" + operator.operatorType + "";
    operatorXMLContent += " startIndexOf='" + operator.startIndexOf + "'";
    operatorXMLContent += " startAdd='" + operator.startAdd + "'";
    operatorXMLContent += " endIndexOf='" + operator.endIndexOf + "'";
    operatorXMLContent += " endAdd='" + operator.endAdd + "'";
    operatorXMLContent += "/>\n";
    operatorXMLContent += "</operator>\n";
    return operatorXMLContent;
}

// parametre olarak gelen parameter icin xml tag uretilir. uretilen content return edilir.
function addParameter(parameter) {
    var parameterContent = "<parameter>";
    parameterContent += parameter;
    parameterContent += "</parameter>\n";
    return parameterContent;
}

// parametre olarak gelen extracts icinde extracts dizisinin boyutu 0'dan buyuk ise icindeki her bir target icin target xml tag'i uretilir. 
// uretilen content return edilir. extracts'in boyutu 0 ise bos string return eder.
function addTargetListToXML(extracts) {
    var targetListXMLContent = "";
    if (extracts.length > 0) {
        targetListXMLContent += "<extracts>\n";
        extracts.map(function (target) {
            targetListXMLContent += addTargetToXML(target);
        });
        targetListXMLContent += "</extracts>\n";
    }
    return targetListXMLContent;
}

// parametre olarak gelen target extractArray dizisinin boyutu 0'dan buyuk ise icindeki her bir extract icin extract xml tag'i uretilir. 
// uretilen content return edilir. extractArray'in boyutu 0 ise bos string return eder.
function addTargetToXML(target) {
    var targetXMLContent = "";
    targetXMLContent += "<target";
    targetXMLContent += " type='" + target.targetType + "'";
    targetXMLContent += " targetQuery='" + target.targetQuery + "'"
    targetXMLContent += ">\n";
    if (target.extractArray.length > 0) {
        target.extractArray.map(function (extract) {
            targetXMLContent += addExtractToXML(extract);
        });
    }
    targetXMLContent += "</target>\n";
    return targetXMLContent;
}

// parametre olarak gelen extract nesnesi icin extract xml tag'i uretilir. uretilen content return edilir.
// extractType'i var ise type olarak setlenerek diger degerleri de eklenir. extractType yok ise bos string return eder.
function addExtractToXML(extract) {
    var extractXMLContent = "";
    if (extract.extractType) {
        extractXMLContent += "<extract"
        extractXMLContent += " type='" + extract.extractType + "'"
        extractXMLContent += ">\n";
        extractXMLContent += addNodeToXML(extract.nodeXML);
        extractXMLContent += addQueryListToXML(extract.queries);
        extractXMLContent += addValueToXML(extract.extractValue);
        extractXMLContent += "</extract>\n";
    }
    return extractXMLContent;
}

// parametre olarak gelen queryList dizisinin boyutu 0'dan buyuk ise her bir query icin query xml tag'i uretilir.
// uretilen content return edilir. queryList'in boyutu 0 ise queries taginin acip kapanmasindan olusan string return eder.
function addQueryListToXML(queryList) {
    var queryListXMLContent = "<queries>\n";
    if (queryList.length > 0) {
        queryList.map(function (query) {
            queryListXMLContent += addQueryToXML(query);
        });
    }
    queryListXMLContent += "</queries>\n";
    return queryListXMLContent;
}

// parametre olarak gelen query nesnesi icin query xml tag'i uretilir. uretilen content return edilir.
function addQueryToXML(query) {
    var queryXMLContent = "<query>\n";
    queryXMLContent += addNodeToXML(query.nodeXML);
    queryXMLContent += addOperatorToXML(query.operator);
    queryXMLContent += addParameter(query.parameter);
    queryXMLContent += "</query>\n";
    return queryXMLContent;
}

// parametre olarak gelen extractValue nesnesi icin value xml tag'i uretilir. uretilen content return edilir.
// extractValue'nun parameterValue tanimli ise xml'e eklenir. uretilen content return edilir.
function addValueToXML(extractValue) {
    var valueXMLContent = "<value";
    valueXMLContent += " startIndexOf='" + extractValue.startIndexOf + "'";
    valueXMLContent += " startAdd='" + extractValue.startAdd + "'";
    valueXMLContent += " endIndexOf='" + extractValue.endIndexOf + "'";
    valueXMLContent += " endAdd='" + extractValue.endAdd + "'";
    valueXMLContent += " wrapper='" + extractValue.wrapper + "'";
    valueXMLContent += " startRegex='" + extractValue.startRegex + "'";
    valueXMLContent += " endRegex='" + extractValue.endRegex + "'>";
    if (extractValue.parameterValue) {
        valueXMLContent += extractValue.parameterValue;
    }
    valueXMLContent += "</value>\n";
    return valueXMLContent;
}