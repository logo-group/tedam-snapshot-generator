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

var formName;
var formNames = [];
var iFrameArr = [];
var formTagCounter = 0;

// getHtml metodu ile htmlDocument alinir.Ardindan rules'daki her rule icin
// donerek snapshot olusturulur ve return edilir.
function initialParseHtml(rules, document_root) {
    var content = "";
    console.log("Empty result rules: ")
    rules.ruleArray.map(function (rule) {
        var xmlInfoContent = "";
        var findedArray;
        if (isEqual(RULE_TYPE.FORMNAME.name, rule.ruleType)
            || isEqual(RULE_TYPE.VERSION.name, rule.ruleType)) {
            var docRootArr = [];
            docRootArr.push(document_root);
            findedArray = executeFind(rule.findList, docRootArr);
        } else {
            var iframeHTMLObjectList = getHtml(rules, document_root);
            findedArray = executeFind(rule.findList, iframeHTMLObjectList);
        }
        xmlInfoContent = executeRule(rule.extracts, findedArray, rule.ruleType
            .toLowerCase());
        if (!xmlInfoContent) {
            console.log(rule)
        }
        content += xmlInfoContent;
    });
    console.log("-----------------------------------------")

    if (content) {
        content += "\r</Form>";
    }
    formTagCounter = 0
    return content;
}

// verilen document_root icinden rules nesnesinin hasFrame tanimli ise en
// ustteki ekran htmlDocument olarak atanir.
// eger hasFrame tanimli degil ise document_root htmlDocument olarak setlenir.
function getHtml(rules, document_root) {
    var iframeHTMLObjectList = getIframeElements(document_root);
    return iframeHTMLObjectList;
}

function getIframeElements(htmlDocument) {
    var frames = htmlDocument.getElementsByTagName("iframe");
    if (frames.length > 0) {
        for (var i = 0; i < frames.length; i++) {
            try {
                formNames.push(frames[i].id);
                getIframeElements(frames[i].contentWindow.document);
            } catch (err) {
                console.log(err);
            }

        }
    }

    if (!iFrameArr.includes(htmlDocument)) {
        iFrameArr.push(htmlDocument);
    }

    return iFrameArr;
}

/**
 * findedArray icindeki her bir eleman icin verilen extracts nesnesi icinden
 * xmlTag nesnesi olusturulur. Title, tag, enabled degerleri var ise
 * createXMLInfo metodu ile xmlTagContent olusturularak content'e eklenir.
 */
function executeRule(extracts, findedArray, stepType) {
    var ruleContent = "";
    if (isEqual(RULE_TYPE.VERSION.name, stepType)
        && (!findedArray || findedArray.length == 0)) {
        var xmlInfo = new XMLInfo("", "1", null, true, stepType);
        var xmlInfoContent = createXMLInfo(xmlInfo);
        ruleContent += xmlInfoContent;
    } else if (findedArray) {
        for (var j = 0; j < findedArray.length; j++) {
            var xmlInfo = executeTarget(extracts, findedArray[j]);
            xmlInfo.type = xmlInfo.type + stepType;
            if (xmlInfo.title && xmlInfo.tag && xmlInfo.enabled) {
                var xmlInfoContent = createXMLInfo(xmlInfo);
                ruleContent += xmlInfoContent;
            }
        }
    }
    return ruleContent;
}

/**
 * Verilen HTML sayfasi icinde find komutunu isletir,findListType element'e esit
 * ise htmlDoc icinden o elementler'den liste olusturulur. Node type'ina gore
 * kesisim uygulanir.En son kesisimden gelen resultSet dondurulur.
 */
function executeFind(finds, iframeHTMLObjectList) {
    var findedArray = [];
    var tempArray = [];

    if (isEqual(finds.findListType, FIND_LIST_TYPE.ELEMENT.name)) {
        for (var i = 0; i < iframeHTMLObjectList.length; i++) {
            tempArray = Array.prototype.slice.call(iframeHTMLObjectList[i]
                .getElementsByTagName(finds.findListTypeValue));
            tempArray.forEach(function (temp) {
                findedArray.push(temp);
            });
        }
        for (var j = 0; j < finds.findArray.length; j++) {
            if (finds.findArray[j].nodeXML) {
                findedArray = executeFindOperator(finds.findArray[j],
                    findedArray);
            }
        }
    } else if (isEqual(finds.findListType, FIND_LIST_TYPE.URL.name)) {
        var url = window.location.href;
        findedArray.push(url);
    }

    return findedArray;
}

/**
 * parametre olarak gelen find nesnesinin operator'une gore findedArray'deki
 * elemanlari kontrol eder, uygun olanlari findedLast arrayine ekler.
 */
function executeFindOperator(find, finded) {
    var findedLast = [];
    if (find.operator.operatorType) {
        findedLast = getFindedFromOperator(find, finded)
    }
    return findedLast;
}

/**
 * gelen finded listesinde bulunan elemanlari for icinde operatorune gore
 * islemini yapar ve true donerse findedLast array ine ekler.
 */
function getFindedFromOperator(find, finded) {
    var findedLast = [];
    if (finded.length && finded.length != 0) {
        for (var i = 0; i < finded.length; i++) {
            if (isEqual(find.nodeXML.nodeXMLType, NODE_TYPE.ATTRIBUTE.name)) {
                if (checkStringWithOperator(
                    find.operator.operatorType,
                    getSubstringOfParameter($(finded[i]).attr(
                        find.nodeXML.nodeXMLValue), find.operator, true),
                    find.parameter)) {
                    findedLast.push(finded[i]);
                }
            } else if (isEqual(find.nodeXML.nodeXMLType,
                NODE_TYPE.INNERTEXT.name)) {
                if (checkStringWithOperator(find.operator.operatorType,
                    getSubstringOfParameter(finded[i].innerHTML,
                        find.operator, true), find.parameter)) {
                    findedLast.push(finded[i]);
                }
            } else if (isEqual(find.nodeXML.nodeXMLType, NODE_TYPE.URL.name)) {
                if (checkStringWithOperator(find.operator.operatorType,
                    getSubstringOfParameter(finded[i], find.operator),
                    find.parameter)) {
                    findedLast.push(finded[i]);
                }
            } else if (isEqual(find.nodeXML.nodeXMLType, NODE_TYPE.VALUE.name)) {
            } else if (isEqual(find.nodeXML.nodeXMLType, NODE_TYPE.XPATH.name)) {
            }
        }
    }
    return findedLast;
}

/**
 * verilen operatorType'a gore source ve target arasinda equals veya contains
 * kosulunu isletir, eger kosul calisirsa true doner aksi takdirde false doner.
 */
function checkStringWithOperator(operatorType, source, target) {
    if (isEqual(operatorType, OPERATOR_TYPE.EQUALS.name)) {
        if (source.localeCompare(target) == 0) {
            return true;
        }
    } else if (isEqual(operatorType, OPERATOR_TYPE.NOT_EQUALS.name)) {
        if (source.localeCompare(target) != 0) {
            return true;
        }
    } else if (isEqual(operatorType, OPERATOR_TYPE.CONTAINS.name)) {
        if (source.includes(target)) {
            return true;
        }
    } else if (isEqual(operatorType, OPERATOR_TYPE.NOT_CONTAINS.name)) {
        if (!source.includes(target)) {
            return true;
        }
    }
    return false;
}

/**
 * Verilen targets degerleri parametre olarak gelen findedLine'dan cekilerek
 * buttonXMLInfo nesnesi doldurulur ve dondurulur.
 */
function executeTarget(targetList, tempFindedLine) {
    var xmlTag;
    var tag = "";
    var title = "";
    var value = "";
    var enabled = "";
    var type = "";

    for (var i = 0; i < targetList.length; i++) {
        if (targetList[i].targetQuery) {
            findedLine = tempFindedLine
                .querySelector(targetList[i].targetQuery);
        } else {
            findedLine = tempFindedLine;
        }
        if (!findedLine) {
            continue;
        }
        switch (targetList[i].targetType) {
            case TARGET_TYPE.TAG.name:
                xmlTag = findTargetTypeValue(targetList[i].extractArray, findedLine);
                type = xmlTag.parameter;
                tag = xmlTag.xmlValue;
                break;
            case TARGET_TYPE.TITLE.name:
                title = (findTargetTypeValue(targetList[i].extractArray, findedLine)).xmlValue;
                break;
            case TARGET_TYPE.VALUE.name:
                value = (findTargetTypeValue(targetList[i].extractArray, findedLine)).xmlValue;
                break;
            case TARGET_TYPE.ENABLED.name:
                enabled = (findTargetTypeValue(targetList[i].extractArray,
                    findedLine)).xmlValue;
                break;
        }
    }
    var rowXMLInfo = new XMLInfo(tag.trim(), title.trim(), value, enabled, type
        .trim());
    return rowXMLInfo;
}

/**
 * Verilen extract'lardan olusan array icinde donerek EXTRACT_TYPE'a gore
 * ayrilir ve ona gore finded nesnesinden istenilen parametre
 * getSubValueFromXMLLine metodu yardimi ile cekilir.
 */
function findTargetTypeValue(extractArray, finded) {
    var xmlTag;
    for (var j = 0; j < extractArray.length; j++) {
        if (isEqual(extractArray[j].extractType, EXTRACT_TYPE.STRING.name)) {
            if (!xmlTag || !xmlTag.xmlValue) {
                xmlTag = getStringSubValueFromXMLLine(extractArray[j], finded);
            }
        } else if (isEqual(extractArray[j].extractType,
            EXTRACT_TYPE.BOOLEAN.name)) {
            if (!xmlTag || !xmlTag.xmlValue) {
                xmlTag = getBooleanValueFromXMLLine(extractArray[j], finded);
            }
        }
    }
    return xmlTag;
}

/**
 * gelen extract parametresi icinde queries for icinde gezilerek query
 * calistirilir. eger tum query'ler calisir ise isSuccessfull= true olarak kalir
 * ve parametre degeri doner eger en az bir query calismaz ise
 * isSuccessfull=false a cekilir ve parametre degerinin zitti doner.
 */
function getBooleanValueFromXMLLine(extract, findedXmlLine) {
    var parameter = "";
    var isSuccessfull = true;
    for (var i = 0; i < extract.queries.length; i++) {
        if (!executeQuery(extract.queries[i], findedXmlLine)) {
            isSuccessfull = false;
            break;
        }
    }
    if (isSuccessfull) {
        parameter = getSubstringOfParameter(
            extract.extractValue.parameterValue, extract.extractValue, true);
    } else {
        parameter = getSubstringOfParameter(
            getOppositeBooleanValue(extract.extractValue.parameterValue),
            extract.extractValue, true);

    }
    var xmlTag = new XMLTag("", parameter);
    return xmlTag;
}

/**
 * substring yapilacak olan text verilir ve kullanilacak olan parameter verilir.
 * parameterin startIndexOf degeri ilk olarak 0 setlenir, endIndexOf degeri ilk
 * olarak text'in uzunlugunun bir fazlasi seklinde setlenir, startAdd ve endAdd
 * ilk basta 0 olarak setlenir, ardindan parameter'de bulunan degeri var ise
 * degere setlenir. ardindan setlenen degerler ile substring yapilir.
 */
function getSubstringOfParameter(text, parameter, isChange) {
    var subValue = "";
    if (text) {
        var value = "";
        var startAdd = 0;
        var endAdd = 0;
        var startIndexOf = 0;
        var endIndexOf = text.length + 1;
        var startRegex = "";
        var endRegex = "";
        if (parameter.startAdd) {
            startAdd = parseInt(parameter.startAdd);
        }
        if (parameter.endAdd) {
            endAdd = parseInt(parameter.endAdd);
        }
        if (parameter.endIndexOf) {
            endIndexOf = text.indexOf(parameter.endIndexOf);
        }
        if (parameter.startIndexOf) {
            startIndexOf = text.indexOf(parameter.startIndexOf);
        }
        if (parameter.startIndexOf || parameter.endIndexOf) {
            value = text
                .substring(startIndexOf + startAdd, endIndexOf + endAdd)
                .toString();
        } else if (startAdd > 0 || endAdd > 0) {
            value = text.substring(startAdd, text.length + endAdd + 1)
                .toString();
        } else if (startAdd == 0 && endAdd == 0) {
            value = text.toString();
        }
        // ozel karakterler degistirilir.
        if (isChange) {
            // satir atlamayi siler
            value = value.split("\n").join(" ");
            // value = value.split("&").join("&amp;");
        }

        if (parameter.startRegex) {
            startRegex = value.indexOf(parameter.startRegex);
        }
        if (parameter.endRegex) {
            endRegex = value.indexOf(parameter.endRegex)
                + parameter.endRegex.length;
        }
        // startRegex ve endRegex dolu ise girer ve value'daki start ile end
        // arasinda bulunan degeri regex ifade ile degistirir.
        if (startRegex > 0 && endRegex > 0) {
            value = value.replace(value.substring(startRegex, endRegex), ".*");
        }
        // gonderilen parametrenin wrapper adinda property si var mi ve degeri
        // var mi diye kontrol edilir.
        if (parameter.hasOwnProperty("wrapper") && parameter.wrapper) {
            // var ise bosluga gore split edilir.
            var wrapperArray = parameter.wrapper.split(" ");
            // eger wrapper dogru girilmis ise bosluga gore split edilince iki
            // elemanli bir dizi olmasi gerekir.
            if (wrapperArray.length == 2) {
                // wrapperArray'indeki ilk deger ile son deger arasina value
                // yazilarak subValue olusturulur.
                subValue = wrapperArray[0] + value + wrapperArray[1];
            }
        } else {
            // eger wrapper adinda property yok ise veya degeri yoksa value
            // subValue'ya setlenir.
            subValue = value;
        }
    }

    return subValue;
}

/**
 * verilen boolean parameter degerinin zitti olan deger dondurulur.
 */
function getOppositeBooleanValue(parameter) {
    var newValue;
    if (isEqual(parameter, BOOLEAN_TYPE.TRUE.name)) {
        newValue = BOOLEAN_TYPE.FALSE.name;
    } else {
        newValue = BOOLEAN_TYPE.TRUE.name;
    }
    return newValue;
}

/**
 * parametre olarak gelen findedXmlLine icinden ilk once query calistirilir.
 * executeQuery() metodundan anlamli bir deger donmuyorsa isSuccessfull=false
 * olur ve donguden cikar bos deger doner. eger isSuccessfull=true olarak
 * donguden cikar ise degerler setlenir ve dondurulur.extract edilecek olan
 * parametre bulunur ve getSubstringOfParameter metodu yardimi ile istenilen
 * kadari alinir.
 */
function getStringSubValueFromXMLLine(extract, findedXmlLine) {
    var textValue = "";
    var nodeText = "";
    var parameter = "";
    var isSuccessfull = true;
    if (extract.nodeXML && extract.nodeXML.nodeXMLType) {
        for (var i = 0; i < extract.queries.length; i++) {
            if (!executeQuery(extract.queries[i], findedXmlLine)) {
                isSuccessfull = false;
                break;
            }
        }
        if (isEqual(extract.nodeXML.nodeXMLType, NODE_TYPE.ATTRIBUTE.name)) {
            if (isSuccessfull) {
                nodeText = $(findedXmlLine).attr(extract.nodeXML.nodeXMLValue);
                parameter = NODE_TYPE.ATTRIBUTE.name.toLowerCase()
                    + parameterSplitterConstant
                    + extract.nodeXML.nodeXMLValue
                    + parameterSplitterConstant;
                textValue = getSubstringOfParameter(nodeText,
                    extract.extractValue, true);
            }
        } else if (isEqual(extract.nodeXML.nodeXMLType, NODE_TYPE.URL.name)) {
            if (isSuccessfull) {
                nodeText = findedXmlLine;
                parameter = NODE_TYPE.URL.name.toLowerCase()
                    + parameterSplitterConstant;
                textValue = getSubstringOfParameter(nodeText,
                    extract.extractValue);
            }
        } else if (isEqual(extract.nodeXML.nodeXMLType,
            NODE_TYPE.INNERTEXT.name)) {
            if (isSuccessfull) {
                nodeText = findedXmlLine.innerText;
                parameter = NODE_TYPE.INNERTEXT.name.toLowerCase()
                    + parameterSplitterConstant;
                textValue = getSubstringOfParameter(nodeText,
                    extract.extractValue, true);
            }
        } else if (isEqual(extract.nodeXML.nodeXMLType, NODE_TYPE.VALUE.name)) {
            if (isSuccessfull) {
                nodeText = findedXmlLine.value;
                parameter = NODE_TYPE.VALUE.name.toLowerCase()
                    + parameterSplitterConstant;
                textValue = getSubstringOfParameter(nodeText,
                    extract.extractValue, true);
            }
        } else if (isEqual(extract.nodeXML.nodeXMLType, NODE_TYPE.XPATH.name)) {
            if (isSuccessfull) {
                nodeText = getPathTo(findedXmlLine);
                parameter = NODE_TYPE.XPATH.name.toLowerCase()
                    + parameterSplitterConstant;
                textValue = getSubstringOfParameter(nodeText,
                    extract.extractValue, true);
            }
        }
    }
    var xmlTag = new XMLTag(parameter, textValue);
    return xmlTag;
}

/**
 * verilen elemanin xpathini recursive sekilde bulur ve dondurur.
 */
function getPathTo(element) {
    if (element.id && element.id !== '' && element.childNodes
        && element.childNodes.length > 0 && isUnique(element.id)) {
        return "//*[@id='" + element.id + "']";
    }
    if (element === document.body)
        return "//" + element.tagName.toLowerCase();
    var ix = 0;
    if (element.parentNode != null) {
        var siblings = element.parentNode.childNodes;
        for (var i = 0; i < siblings.length; i++) {
            var sibling = siblings[i];
            if (sibling === element)
                return getPathTo(element.parentNode) + '/'
                    + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                ix++;
            }
        }
    }
}

function escapeFromDots(search) {
    String.prototype.replaceAll = function (search) {
        var target = this;
        return target.replace(new RegExp(search, '.'), "\\.");
    };
}

function isUnique(id) {
    if (id.indexOf('.') != -1) {
        id = escapeFromDots(id);
    }
    var count = $('[id=' + id + ']').length;
    if (count == 1) {
        return true;
    }
    if (formNames != null) {
        for (var i = 0; i < formNames.length; i++) {
            var activeFrame = window.parent.frames[formNames[i]];
            if (activeFrame != null) {
                count = $('[id=' + id + ']', activeFrame.document).length;
                if (count == 1) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * verilen findedXmlLine'da query'deki operator calistirilir ve saglanirsa
 * value=true setlenir ve doner eger saglanmaz ise value false doner.
 */
function executeQuery(query, findedXmlLine) {
    if (isEqual(query.nodeXML.nodeXMLType, NODE_TYPE.ATTRIBUTE.name)) {
        if (checkStringWithOperator(query.operator.operatorType,
            getSubstringOfParameter($(findedXmlLine).attr(
                query.nodeXML.nodeXMLValue), query.operator, true),
            query.parameter)) {
            return true;
        }
    } else if (isEqual(query.nodeXML.nodeXMLType, NODE_TYPE.INNERTEXT.name)) {
        if (checkStringWithOperator(query.operator.operatorType,
            getSubstringOfParameter(findedXmlLine.innerHTML,
                query.operator, true), query.parameter)) {
            return true;
        }
    } else if (isEqual(query.nodeXML.nodeXMLType, NODE_TYPE.URL.name)) {
        if (checkStringWithOperator(query.operator.operatorType,
            getSubstringOfParameter(findedXmlLine, query.operator),
            query.parameter)) {
            return true;
        }
    } else if (isEqual(query.nodeXML.nodeXMLType, NODE_TYPE.VALUE.name)) {

    } else if (isEqual(query.nodeXML.nodeXMLType, NODE_TYPE.XPATH.name)) {

    }
    return false;
}

/**
 * verilen targetArray'deki elemanlar ile uygun xml satirlarini olusturur ve
 * dondurur.
 */
function createXMLInfo(xmlInfo) {
    var xmlInfoContent = "";
    xmlInfo.title = xmlInfo.title.split("&").join("&amp;");
    xmlInfo.tag = xmlInfo.tag.split("&").join("&amp;");
    xmlInfo.title = xmlInfo.title.split("\"").join("&quot;");
    xmlInfo.tag = xmlInfo.tag.split("\"").join("&quot;");
    if (xmlInfo.value) {
        xmlInfo.value = xmlInfo.value.split("\"").join("&quot;");
    }
    if (xmlInfo.type.includes("version") || xmlInfo.type.includes("formname")) {
        if (formTagCounter == 0) {
            xmlInfoContent = '<Form enabled="' + xmlInfo.enabled + '" name="'
                + xmlInfo.title + '%0.jfm" title="' + xmlInfo.title + '"';
            formTagCounter++;
        }
        if (formTagCounter != 0 && xmlInfo.type.includes("version")) {
            xmlInfoContent += ' version="v' + xmlInfo.title + '">';
        }
    } else {
        xmlInfoContent = '\r<Control enabled="' + xmlInfo.enabled
            + '" hasLookup="false" mandatory="false" tag="' + xmlInfo.tag
            + '" text="" title="' + xmlInfo.title + '" type="'
            + xmlInfo.type + '" value="' + xmlInfo.value
            + '" visible="true"/>'
    }
    return xmlInfoContent;
}