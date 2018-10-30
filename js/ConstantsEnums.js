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

var parameterSplitterConstant = "!ips!";

var RULE_TYPE = {
    FORMNAME: {
        value: 0,
        name: "FormName"
    },
    VERSION: {
        value: 1,
        name: "Version"
    },
    CLICK: {
        value: 2,
        name: "Click"
    },
    READ: {
        value: 3,
        name: "Read"
    },
    WRITE: {
        value: 4,
        name: "Write"
    }
};

var NODE_TYPE = {
    URL: {
        value: 0,
        name: "Url"
    },
    ATTRIBUTE: {
        value: 1,
        name: "Attribute"
    },
    INNERTEXT: {
        value: 2,
        name: "InnerText"
    },
    VALUE: {
        value: 3,
        name: "Value"
    },
    XPATH: {
        value: 4,
        name: "XPath"
    }
};

var TARGET_TYPE = {
    TAG: {
        value: 0,
        name: "Tag"
    },
    TITLE: {
        value: 1,
        name: "Title"
    },
    VALUE: {
        value: 2,
        name: "Value"
    },
    ENABLED: {
        value: 3,
        name: "Enabled"
    }
};

var FIND_LIST_TYPE = {
    ELEMENT: {
        value: 0,
        name: "Element"
    },
    URL: {
        value: 1,
        name: "Url"
    }
}

var OPERATOR_TYPE = {
    EQUALS: {
        value: 0,
        name: "equals"
    },
    NOT_EQUALS: {
        value: 1,
        name: "notEquals"
    },
    CONTAINS: {
        value: 2,
        name: "contains"
    },
    NOT_CONTAINS: {
        value: 3,
        name: "notContains"
    }
};

var EXTRACT_TYPE = {
    STRING: {
        value: 0,
        name: "String"
    },
    BOOLEAN: {
        value: 1,
        name: "Boolean"
    }
};

var BOOLEAN_TYPE = {
    FALSE: {
        value: 0,
        name: "false"
    },
    TRUE: {
        value: 1,
        name: "true"
    }
};

function XMLTag(parameter, xmlValue) {
    this.parameter = parameter;
    this.xmlValue = xmlValue;
}

function XMLInfo(tag, title, value, enabled, type) {
    this.tag = tag;
    this.title = title;
    this.value = value;
    this.enabled = enabled;
    this.type = type;
}

function Rule(name, ruleType, findList, extracts) {
    this.name = name;
    this.ruleType = ruleType;
    this.findList = findList;
    this.extracts = extracts;
}

function Find(nodeXML, operator, parameter) {
    this.nodeXML = nodeXML;
    this.operator = operator;
    this.parameter = parameter;
}

function Query(nodeXML, operator, parameter) {
    this.nodeXML = nodeXML;
    this.operator = operator;
    this.parameter = parameter;
}

function Target(targetType, targetQuery, extractArray) {
    this.targetType = targetType;
    this.targetQuery = targetQuery;
    this.extractArray = extractArray;
}

function Operator(operatorType, startIndexOf, startAdd, endIndexOf, endAdd) {
    this.operatorType = operatorType;
    this.startIndexOf = startIndexOf;
    this.startAdd = startAdd;
    this.endIndexOf = endIndexOf;
    this.endAdd = endAdd;
}

function Extract(extractType, nodeXML, queries, extractValue) {
    this.extractType = extractType;
    this.nodeXML = nodeXML;
    this.queries = queries;
    this.extractValue = extractValue;
}

function NodeXML(nodeXMLType, nodeXMLValue) {
    this.nodeXMLType = nodeXMLType;
    this.nodeXMLValue = nodeXMLValue;
}

function Value(parameterValue, startIndexOf, startAdd, endIndexOf, endAdd, wrapper, startRegex, endRegex) {
    this.parameterValue = parameterValue;
    this.startIndexOf = startIndexOf;
    this.startAdd = startAdd;
    this.endIndexOf = endIndexOf;
    this.endAdd = endAdd;
    this.wrapper = wrapper;
    this.startRegex = startRegex;
    this.endRegex = endRegex;
}

function FindList(findListTypeValue, findListType, findArray) {
    this.findListTypeValue = findListTypeValue;
    this.findListType = findListType;
    this.findArray = findArray;
}

function Parameter(text) {
    this.text = text;
}

function Rules(hasFrame, frameId, ruleArray) {
    this.hasFrame = hasFrame;
    this.frameId = frameId;
    this.ruleArray = ruleArray;
}

function ConfigFile(fileName, fileContent) {
    this.fileName = fileName;
    this.fileContent = fileContent;
}

function getEnumValuesAsArray(enumObject) {
    var all = [];
    for (var key in enumObject) {
        all.push(enumObject[key].name);
    }
    return all;
}