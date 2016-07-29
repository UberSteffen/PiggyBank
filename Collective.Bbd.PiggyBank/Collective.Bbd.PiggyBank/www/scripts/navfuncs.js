var baseUrl = 'http://localhost:50311';

var otp = 1234;
var language = 'ENG';
var childId = -1;
var savingsBalance = null;
var pocketBalance = null;
var exceedText = "Exceeded Limit";
function navContentClick(elem) {
    var elementsToHide = $(elem).data("hide").split(',');
    for (var a = 0; a < elementsToHide.length; a++) {
        $("#" + elementsToHide[a]).hide(1000, showContentClick(elem));
    }
}

function showContentClick(elem) {
    var elementsToShow = $(elem).data("show").split(',')
    for (var a = 0; a < elementsToShow.length; a++) {
        if (elementsToShow[a] == 'OTP') {
            if (GetData('OTPDone') && childId != -1) {
                $("#MainMenu").show();
            }
            else {
                $("#" + elementsToShow[a]).show(1000);
            }
        }
        else {
            $("#" + elementsToShow[a]).show(1000);
        }
    }
}


function DoMyPocket() {
    if (childId != -1) {
        GetChild(childId);
        $('#PocketValue').text(pocketBalance);
        $('#SavingsValue').text(savingsBalance);
    }

}
function ChooseLanguage(lang) {
    switch (lang) {
        case "English": SaveLanguage("English"); MakeEnglish(); break;
        case "Afrikaans": SaveLanguage("Afrikaans"); MakeAfrikaans(); break;
        case "isiZulu": SaveLanguage("isiZulu"); MakeZulu(); break;
    }
}


$(document).ready(function () {
    GetChildData();
    ChooseLanguage(language);
    $("input").on("keypress", function (event) { return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 0 })
});

function SaveLanguage(lang) {
    language = lang;
    SetData('language', language);
    //save here
}

function OTPCALLBACK(data) {
    childId = data.id;
    GetChild(data.id);
}

function DoOTP(elem) {
    //do server call
    otp = $('#TXTOTP').val();
    jQuery.ajax({
        type: 'GET',
        url: baseUrl + "/Mobile/OTP/" + otp + "?callback=?",
        jsonpCallback: 'OTPCALLBACK',
        dataType: 'jsonp',
        success: function (data) {

            if (childId != -1) {
                $('#TXTOTP').val('');
                SetData('OTPDone', true);
                navContentClick(elem);
            }

            else {
                $('#TXTOTP').val('');
            }
        }
    });
    $('#TXTOTP').val('');

}


function DoWithdrawl(elem) {
    var amount = $('#TXTWithdrawAmount').val();

    if (amount > parseFloat(pocketBalance)) {
        alert(exceedText + "! " + pocketBalance);
        $('#TXTWithdrawAmount').val('');
    }

    else {


        jQuery.ajax({
            type: 'GET',
            url: baseUrl + "/Mobile/Withdraw/" + childId + "/" + amount + "?callback=?",
            dataType: 'jsonp',
            crossDomain: true,

            jsonpCallback: 'WithdrawCALLBACK',
            success: function (data) {

                navContentClick(elem);
            }

        });
    }
    $('#TXTWithdrawAmount').val('');
}


function WithdrawCALLBACK(data) {


}


function ClearChild() {
    localStorage.clear();
}

function GetChild(id) {
    var result = null;
    jQuery.ajax({
        type: 'GET',
        url: baseUrl + "/Mobile/Details/" + id + "?callback=?",
        jsonpCallback: 'GETCHILDBACK',
        dataType: 'jsonp',
        crossDomain: true,
    });
}


function GETCHILDBACK(data) {
    pocketBalance = data.MainBalance;
    savingsBalance = data.SavingsBalance;
    $('#PocketValue').text(pocketBalance);
    $('#SavingsValue').text(savingsBalance);
    SaveChild();

}

function SaveChild() {
    SetData('ChildId', childId);
    SetData('PocketValue', pocketBalance);
    SetData('SavingsValue', savingsBalance);
}

function GetChildData() {
    var id = GetData('ChildId');
    if (id == null || id == -1) {
        $('#LangaugeMenu').show();
    }
    else {
        language = GetData('language');
        ChooseLanguage(language);
        $('#MainMenu').show();
        GetChild(id);
        $('#PocketValue').text(pocketBalance);
        $('#SavingsValue').text(savingsBalance);
    }
}

function DoTransfer(elem) {
    var amount = $('#TXTTransferAmount').val();

    if (amount > parseFloat(savingsBalance)) {
        alert(exceedText + "! " + savingsBalance);
        $('#TXTTransferAmount').text('');
    }

    else {


        jQuery.ajax({
            type: 'GET',
            url: baseUrl + "/Mobile/Transfer/" + childId + "/" + amount + "?callback=?",
            crossDomain: true,
            dataType: 'jsonp',
            jsonpCallback: 'TransferCallback',
            success: function (data) {

                navContentClick(elem);
            }

        });

    }

    $('#TXTTransferAmount').val('');

}

function TransferCallback(data) {


}

function SetData(key, value) {
    localStorage.setItem(key, value);
}

function GetData(key) {
    return localStorage.getItem(key)
}


function MakeEnglish() {
    var logoPath = "images/mascot3ENG.png";
    $('#MainLogo').attr('src', logoPath);
    $('#TXTOTP').attr('placeholder', 'Enter One-Time-Pin');
    $('.btnSubmit').text('Submit');
    $('#btnMyPocket').text('My Pocket');
    $('#btnWithdraw').text('Withdraw');
    $('#btnGoals').text('Goals');
    $('#btnRewards').text('Rewards');
    $('#btnSettings').html('Clear<br/>Settings');
    $('#TXTWithdrawAmount').attr('placeholder', 'Enter Amount Required');
    $('#TXTTransferAmount').attr('placeholder', 'Enter Amount To Transfer');
    exceedText = "Exceeded Limit";
    $('.btnBack').text('Back');
    $('#btnTransfer').text('Transfer');

}

function MakeAfrikaans() {
    var logoPath = "images/mascot3AFR.png";
    $('#MainLogo').attr('src', logoPath);
    $('#TXTOTP').attr('placeholder', 'Gee jou eenmalige Pinkode')
    $('.btnSubmit').text('Stuur')
    $('#btnMyPocket').text('My Beursie');
    $('#btnWithdraw').text('Onttrekking');
    $('#btnGoals').text('Doelwitte');
    $('#btnRewards').text('Belonings');
    $('#btnSettings').html('Herstel<br/>Instellings');
    $('#TXTWithdrawAmount').attr('placeholder', 'Hoveel geld will jy ontrek?');
    exceedText = "Onvoldoende fondse";
    $('.btnBack').text('Terug');
    $('#btnTransfer').text('Oordrag');


}

function MakeZulu() {
    var logoPath = "images/mascot3ZUL.png";
    $('#MainLogo').attr('src', logoPath);
    $('#TXTOTP').attr('placeholder', 'Faka yakho Pin-isikhathi esisodwa')
    $('.btnSubmit').text('Uhambise')
    $('#btnMyPocket').html('Ephaketheni<br/>Lami');
    $('#btnWithdraw').text('Ukuhoxiswa');
    $('#btnGoals').text('Imigomo');
    $('#btnRewards').text('Imivuzo');
    $('#btnSettings').html('Buyisela<br/>amasethingi');
    $('#TXTWithdrawAmount').attr('placeholder', 'Faka lemali edingekayo.');
    exceedText = "imali enganele";
    $('.btnBack').text('Emuva');
    $('#btnTransfer').text('Ukudlulisa');

}

$("#engSelect").click(function () { ChooseLanguage('English'); navContentClick($("#engSelect")); });
$("#afrSelect").click(function () { ChooseLanguage('Afrikaans'); navContentClick($("#afrSelect")); });
$("#zuluSelect").click(function () { ChooseLanguage('isiZulu'); navContentClick($("#zuluSelect")); });

$("#otpSubmit").click(function () { DoOTP($("#otpSubmit")); });

$("#myPocketSelect").click(function () { DoMyPocket(); navContentClick($("#myPocketSelect")); });
$("#pocketBackSelect").click(function () { navContentClick($("#pocketBackSelect")); });

$("#withdrawSelect").click(function () { navContentClick($("#withdrawSelect")); });
$("#doWithdrawalSelect").click(function () { DoWithdrawl($("#doWithdrawalSelect")); });
$("#withdrawBackSelect").click(function () { navContentClick($("#withdrawBackSelect")); });

$("#transferSelect").click(function () { navContentClick($("#transferSelect")); });
$("#doTransferSelect").click(function () { DoTransfer($("#doTransferSelect")); });
$("#transferBackSelect").click(function () { navContentClick($("#transferBackSelect")); });

$("#btnSettings").click(function () { ClearChild(); navContentClick($("#btnSettings")); });

$("#goalsSelect").click(function () { navContentClick($("#goalsSelect")); });
$("#goalsBackSelect").click(function () { navContentClick($("#goalsBackSelect")); });

