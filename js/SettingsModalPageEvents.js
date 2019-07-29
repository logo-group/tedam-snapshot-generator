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

// next butonuna basildigi zaman active olan step bulunur. next'i var mi diye kontrol eder, next'i var ise nextStep'in id'si bulunur ve onun link'ine tiklanir.
document.getElementById("next").addEventListener("click", function () {
    var activeStep = $("div.active");
    var nextStep = activeStep.next();
    if (nextStep.length != 0) {
        var nextStepId = nextStep.attr("id");
        var nextStepLink = $("a[href='#" + nextStepId + "']");
        console.log("next'e basildi." + nextStepId + " acilacak")
        nextStepLink.click();
    }
});

// previous butonuna basildigi zaman active olan step bulunur. previous'u var mi diye kontrol eder,previous'u var ise previousStep'in id'si bulunur ve onun link'ine tiklanir.
document.getElementById("previous").addEventListener("click", function () {
    var activeStep = $("div.active");
    var previousStep = activeStep.prev();
    if (previousStep.length != 0) {
        var previousStepId = previousStep.attr("id");
        var previousStepLink = $("a[href='#" + previousStepId + "']");
        console.log("previous'a basildi." + previousStepId + " acilacak")
        previousStepLink.click();
    }
});

// step1'de previous butonu disable, next butonu enable, finish butonu disable ayarlanir.
$("#linkStep1").click(function () {
    $("#previous").prop('disabled', true);
    $("#next").prop('disabled', true);
    $("#finish").prop('disabled', true);
});

// step2'de previous butonu enable, next butonu enable, finish butonu disable ayarlanir.
$("#linkStep2").click(function () {
    $("#previous").prop('disabled', false);
    $("#next").prop('disabled', false);
    $("#finish").prop('disabled', true);
});

// step3'de previous butonu enable, next butonu enable, finish butonu disable ayarlanir.
$("#linkStep3").click(function () {
    $("#previous").prop('disabled', false);
    $("#next").prop('disabled', false);
    $("#finish").prop('disabled', true);
});

// step4'te previous butonu enable, next butonu enable, finish butonu disable ayarlanir.
$("#linkStep4").click(function () {
    $("#previous").prop('disabled', false);
    $("#next").prop('disabled', false);
    $("#finish").prop('disabled', true);
});

// step5'te previous butonu enable, next butonu disable, finish butonu enable ayarlanir.
$("#linkStep5").click(function () {
    $("#previous").prop('disabled', false);
    $("#next").prop('disabled', true);
    $("#finish").prop('disabled', false);
});

// finish butonuna basildigi zaman modal'in icindeki degerler parse edilir, 'Finish' uyarisi verilir ve defineRuleModal kapatilir.
document.getElementById("finish").addEventListener("click", function () {
    parseModalElements(document);
    console.log("finish'e basildi")
    closeModal("defineRuleModal");
});

// cancel butonuna basildigi zaman modal kapatilir.
document.getElementById("cancel").addEventListener("click", function () {
    console.log("cancel'a basildi")
    closeModal("defineRuleModal");
});

// combo listesinde secilen deger degisince buraya girer ve secilen deger element ise content'e input alani ekler.
// secilen deger url ise ve input element alani eklenmis ise bu eklenen alani siler.
$("#findsType").change(function () {
    if ($("#findsType").val() == FIND_LIST_TYPE.ELEMENT.name) {
        appendFindsTypeValue(null);
    } else if ($("#findsType").val() == FIND_LIST_TYPE.URL.name) {
        $("#findsTypeValue").parent().remove();
    }
});

// findsTypeValue icin input alan olusturulur ve findsTypeValueContent'e eklenir. 
// Eger parametre olarak gelen findsTypeValue tanimli ise olusturulan input alana degeri setlenir.
function appendFindsTypeValue(findsTypeValue) {
    var inputDiv = document.createElement("div");
    inputDiv.className = "findsTypeValueDiv"

    var lang = $('option:selected', '#mySelect').attr('id');
    var label = document.createElement("label");
    label.innerHTML = "Finds Type Value"
    label.setAttribute("key", "findstypevalue");
    label.innerHTML = arrLang[lang]["findstypevalue"];

    var input = document.createElement("input");
    input.className = "form-control"
    input.setAttribute("type", "text");
    input.setAttribute("id", "findsTypeValue");

    input.onchange = function () {
        if(input.value.length > 2) {
            document.getElementById("next").disabled = false;
        }
        else {
        document.getElementById("next").disabled = true;
        }
    };


    if (findsTypeValue) {
        input.value = findsTypeValue;
    }
    inputDiv.appendChild(label)
    inputDiv.appendChild(input)
    $("div#findsTypeValueContent").append(inputDiv);
};

// step4'te bulunan toggle butonu enable yapildigi zaman addExtract butonunu aktif eder, aksi takdirde pasif eder.
$("#hasEnabled").change(function () {
    if ($("#hasEnabled").is(":checked")) {
        $("#addExtractValue").prop('disabled', false);
    } else {
        $("#addExtractValue").prop('disabled', true);
    }
});

// step1'de bulunan findsType combobox'inda deger secildigi zaman addFind butonunu aktif eder, aksi takdirde pasif eder.
$("#findsType").change(function () {
    if ($("#findsType").val()) {
        $("#addFind").prop('disabled', false);
    } else {
        $("#addExtractValue").prop('disabled', true);
    }
});

// addFind butonuna basildigi zaman find icin olusturulan div findContent'e eklenir.
$("#addFind").click(function () {
    addFindParameterCombo("findContent", null);
});

// addExtractTag butonuna basildigi zaman extract icin olusturulan div tagContent'e eklenir.
$("#addExtractTag").click(function () {
    addTargetParameterCombo("tagContent", null);
});

// addExtractTitle butonuna basildigi zaman extract icin olusturulan div titleContent'e eklenir.
$("#addExtractTitle").click(function () {
    addTargetParameterCombo("titleContent", null);
});

// addExtractValue butonuna basildigi zaman extract icin olusturulan div valueContent'e eklenir.
$("#addExtractValue").click(function () {
    addTargetParameterCombo("valueContent", null);
});

// addExtractEnabled butonuna basildigi zaman extract icin olusturulan div enabledContent'e eklenir.
$("#addExtractEnabled").click(function () {
    addTargetParameterCombo("enabledContent", null);
});

// wizard da bulunan progress barin aktif olan step'e gore duzenlenmesini saglar.
$(document).ready(function () {
    var lang = $('option:selected', '#mySelect').attr('id');
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        lang = $('option:selected', '#mySelect').attr('id');
        
        //update progress
        var step = $(e.target).data('step');
        var percent = (parseInt(step) / 5) * 100;

        $('.progress-bar').css({
            width: percent + '%'
        });
        $('.progress-bar').text(arrLang[lang]['step'] + " " + step + " / 5");

        //e.relatedTarget // previous tab
    })
});