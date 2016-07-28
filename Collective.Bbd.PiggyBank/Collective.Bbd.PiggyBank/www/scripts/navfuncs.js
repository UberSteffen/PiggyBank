var baseUrl = 'http://localhost:50311';

var otp = 1234;
var language = 'ENG';
var childId = -1;
var savingsBalance = null;
var pocketBalance = null;
var exceedText = "Exceeded Limit";
function showContentClick(elem) {
    var elementsToHide = $(elem).data("hide").split(',');
    for (var a = 0; a < elementsToHide.length; a++) {
        $("#" + elementsToHide[a]).hide();
    }
    var elementsToShow = $(elem).data("show").split(',')
    for (var a = 0; a < elementsToShow.length; a++) {
        if (elementsToShow[a] == 'OTP') {
            if (GetData('OTPDone') && childId != -1) {
                $("#MainMenu").show();
            }
            else {
                $("#" + elementsToShow[a]).show();
            }
        }
        else {
            $("#" + elementsToShow[a]).show();
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
                showContentClick(elem);
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

                showContentClick(elem);
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

                showContentClick(elem);
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

document.getElementById("engSelect").addEventListener("click", function () { ChooseLanguage('English'); showContentClick(document.getElementById("engSelect")); });
document.getElementById("afrSelect").addEventListener("click", function () { ChooseLanguage('Afrikaans'); showContentClick(document.getElementById("afrSelect")); });
document.getElementById("zuluSelect").addEventListener("click", function () { ChooseLanguage('isiZulu'); showContentClick(document.getElementById("zuluSelect")); });
document.getElementById("otpSubmit").addEventListener("click", function () { DoOTP(document.getElementById("otpSubmit")); });
document.getElementById("myPocketSelect").addEventListener("click", function () { DoMyPocket(); showContentClick(document.getElementById("myPocketSelect")); });
document.getElementById("withdrawSelect").addEventListener("click", function () { showContentClick(document.getElementById("withdrawSelect")); });
document.getElementById("transferSelect").addEventListener("click", function () { showContentClick(document.getElementById("transferSelect")); });
document.getElementById("btnSettings").addEventListener("click", function () { ClearChild(); showContentClick(document.getElementById("btnSettings")); });
document.getElementById("settingsSelect").addEventListener("click", function () { showContentClick(document.getElementById("settingsSelect")); });
document.getElementById("doTransferSelect").addEventListener("click", function () { DoTransfer(document.getElementById("doTransferSelect")); });
document.getElementById("transferBackSelect").addEventListener("click", function () { showContentClick(document.getElementById("transferBackSelect")); });
document.getElementById("doWithdrawalSelect").addEventListener("click", function () { DoWithdrawl(document.getElementById("doWithdrawalSelect")); });
document.getElementById("withdrawBackSelect").addEventListener("click", function () { showContentClick(document.getElementById("withdrawBackSelect")); });