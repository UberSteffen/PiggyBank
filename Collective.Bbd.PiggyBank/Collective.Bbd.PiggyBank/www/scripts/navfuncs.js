var baseUrl = 'http://192.168.43.215:50311';

var otp = 1234;
var language = 'ENG';
var childId = -1;
var savingsBalance = null;
var pocketBalance = null;
var exceedText = "Exceeded Limit";
var visibleElm = null;

function goBack() {
    if (visibleElm.attr('id') == $("#MainMenu").attr('id')) {
        navigator.app.exitApp();
    }
    else if (visibleElm.attr('id') == $("#LangaugeMenu").attr('id')) {
        navigator.app.exitApp();
    }
    else if (visibleElm.attr('id') == $("#OTP").attr('id')) {
        visibleElm.hide(500);
        visibleElm = $("#LangaugeMenu");
        visibleElm.show(500);
    }
    else if (visibleElm != null) {
        visibleElm.hide(500);
        visibleElm = $('#' + visibleElm.data('backloc'));
        visibleElm.show(500);
    }

    toggleButtons();
}

function toggleButtons() {
    if (typeof visibleElm.data("back") !== typeof undefined && visibleElm.data("back") == true) {
        $('#backButton').show(500);
    }
    else {
        $('#backButton').hide(500);
    }

    if (typeof visibleElm.data("exit") !== typeof undefined && visibleElm.data("exit") == true) {
        $('#exitButton').show(500);
    }
    else {
        $('#exitButton').hide(500);
    }

    if (typeof visibleElm.data("add") !== typeof undefined && visibleElm.data("add") == true) {
        $('#addButton').show(500);
    }
    else {
        $('#addButton').hide(500);
    }
}

function navContentClick(elem) {
    var elementsToHide = $(elem).data("hide").split(',');
    for (var a = 0; a < elementsToHide.length; a++) {
        $("#" + elementsToHide[a]).hide(500, showContentClick(elem));
    }
}

function showContentClick(elem) {
    var elementsToShow = $(elem).data("show").split(',')
    for (var a = 0; a < elementsToShow.length; a++) {
        if (elementsToShow[a] == 'OTP') {
            if (GetData('OTPDone') && childId != -1) {
                visibleElm = $("#MainMenu")
                $("#MainMenu").show();
            }
            else {
                visibleElm = $("#" + elementsToShow[a]);
                $("#" + elementsToShow[a]).show(500);
            }
        }
        else {
            visibleElm = $("#" + elementsToShow[a]);
            $("#" + elementsToShow[a]).show(500);
        }

        toggleButtons();
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
    $(".numberInput").on("keypress", function (event) { return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 0 })
    toggleButtons()
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
        visibleElm = $('#LangaugeMenu');
        $('#LangaugeMenu').show();
    }
    else {
        language = GetData('language');
        ChooseLanguage(language);
        visibleElm = $('#MainMenu');
        $('#MainMenu').show();
        GetChild(id);
        childId = id;
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

function DoGoals() {
    var result = null;
    jQuery.ajax({
        type: 'GET',
        url: baseUrl + "/Mobile/GetGoals/" + childId + "?callback=?",
        jsonpCallback: 'GETGOALSBACK',
        dataType: 'jsonp',
        crossDomain: true,
    });
}


function GETGOALSBACK(data) {
    var items = [];
    $("#goalsList").empty();

    $.each(data, function (i, item) {
        var goalid = 'goalItem' + item.Id;
        var makeItRain = savingsBalance < parseFloat(item.GoalAmount);
        var spanClass = "GoalPocket";
        if (makeItRain) {
            spanClass += " insufficient"
        }

        if (item.Image != null && item.Image != "" && item.Image != "none") {
            items.push('<li><p id="' + goalid + '" data-delid="' + item.Id + '">X</p><span class="RewardTask">' + item.GoalName + '</span><br/><span class="' + spanClass + '"> ' + item.GoalAmount + '</span></div><img style="width:60px;height:40px" src="' + item.Image + '" /></li>');
        }
        else {
            items.push('<li><p id="' + goalid + '" data-delid="' + item.Id + '">X</p><span class="RewardTask">' + item.GoalName + '</span><br/><span class="' + spanClass + '"> ' + item.GoalAmount + '</span> </li>');
        }
    });

    $('#goalsList').append(items.join(''));

    $.each(data, function (i, item) {
        var goalid = 'goalItem' + item.Id;
        $("#" + goalid).click(function () { DoDeleteGoal($("#" + goalid)); });
    });
}

function DoAddGoal() {
    navigator.notification.confirm(
        'Would you like to add a picture?',
        HandlePicture,
        'Goal',
        ['New', 'Gallery', 'No thanks']
    );
}

function HandlePicture(buttonIndex) {
    if (buttonIndex == 1) {
        navigator.camera.getPicture(function (imageUri) { CallAddGoal(imageUri); }, function (message) { CallAddGoal(""); }, {
            quality: 10,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA
        });
    }
    else if (buttonIndex == 2) {
        navigator.camera.getPicture(function (imageUri) { CallAddGoal(imageUri); }, function (message) { CallAddGoal(""); }, {
            quality: 10,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
    }
    else {
        CallAddGoal("");
    }
}

function CallAddGoal(image) {
    var name = $('#TXTGoalName').val();
    var amount = $('#TXTGoalAmount').val();

    var data = { 'ChildId': childId, "GoalName": name, "GoalAmount": amount, "Image": image };

    jQuery.ajax({
        type: 'POST',
        url: baseUrl + "/Mobile/AddGoal/",
        data: data,
        dataType: 'jsonp',
        crossDomain: true,
        success: function (responseData, textStatus, jqXHR) {
            DoGoals();
        },
        error: function (responseData, textStatus, errorThrown) {
            DoGoals();
        }
    });

    $('#TXTGoalName').val('');
    $('#TXTGoalAmount').val('');
}

function DoDeleteGoal(elem) {
    navigator.notification.confirm(
        'Are you sure you want to delete this goal?',
        function (buttonIndex) {
            if (buttonIndex == 1) {
                jQuery.ajax({
                    type: 'GET',
                    url: baseUrl + "/Mobile/DeleteGoal/" + elem.data("delid") + "?callback=?",
                    jsonpCallback: 'DELETEGOALBACK',
                    dataType: 'jsonp',
                    crossDomain: true,
                });
            }
        },
        'Goal',
        ['Yes', 'No']
    );
}

function DELETEGOALBACK(data) {
    DoGoals();
}

function DoRewards() {
    var result = null;
    jQuery.ajax({
        type: 'GET',
        url: baseUrl + "/Mobile/GetRewards/" + childId + "?callback=?",
        jsonpCallback: 'GETREWARDSBACK',
        dataType: 'jsonp',
        crossDomain: true,
    });
}


function GETREWARDSBACK(data) {
    var items = [];
    $("#rewardsList").empty();

    $.each(data, function (i, item) {
        var savingsMoney = parseFloat(item.RewardAmount) * parseFloat(item.SplitPercentage) / 100;
        var task = item.TaskToDo != null ? item.TaskToDo : "Extra Reward";
        items.push('<li><span class="RewardTask"> ' + task + '</span><br/><span class="RewardPocket"> ' + (item.RewardAmount - savingsMoney).toString() + '</span> <span class="RewardSavings"> ' + savingsMoney.toString() + '</span></li>');
    });

    $('#rewardsList').append(items.join(''));
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
    $('#backButton').attr('src', 'images/backEng.png');
    $('#exitButton').attr('src', 'images/exitEng.png');
    $('#addButton').attr('src', 'images/addEng.png');
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
    $('#btnTransfer').text('Transfer');
    $('#spanAddGoal').html('Add');
    $('#TXTGoalName').attr('placeholder', 'Enter Name');
    $('#TXTGoalAmount').attr('placeholder', 'Enter Amount');
}

function MakeAfrikaans() {
    var logoPath = "images/mascot3AFR.png";
    $('#MainLogo').attr('src', logoPath);
    $('#backButton').attr('src', 'images/backAfr.png');
    $('#exitButton').attr('src', 'images/exitAfr.png');
    $('#addButton').attr('src', 'images/addAfr.png');
    $('#TXTOTP').attr('placeholder', 'Gee jou eenmalige Pinkode')
    $('.btnSubmit').text('Stuur')
    $('#btnMyPocket').text('My Beursie');
    $('#btnWithdraw').text('Onttrekking');
    $('#btnGoals').text('Doelwitte');
    $('#btnRewards').text('Belonings');
    $('#btnSettings').html('Herstel<br/>Instellings');
    $('#TXTWithdrawAmount').attr('placeholder', 'Hoveel geld will jy ontrek?');
    exceedText = "Onvoldoende fondse";
    $('#btnTransfer').text('Oordrag');
    $('#spanAddGoal').html('Voeg');
    $('#TXTGoalName').attr('placeholder', 'Tik Naam');
    $('#TXTGoalAmount').attr('placeholder', 'Gee Bedrag');
}

function MakeZulu() {
    var logoPath = "images/mascot3ZUL.png";
    $('#MainLogo').attr('src', logoPath);
    $('#backButton').attr('src', 'images/backZul.png');
    $('#exitButton').attr('src', 'images/exitZul.png');
    $('#addButton').attr('src', 'images/addZul.png');
    $('#TXTOTP').attr('placeholder', 'Faka yakho Pin-isikhathi esisodwa')
    $('.btnSubmit').text('Uhambise')
    $('#btnMyPocket').html('Ephaketheni<br/>Lami');
    $('#btnWithdraw').text('Ukuhoxiswa');
    $('#btnGoals').text('Imigomo');
    $('#btnRewards').text('Imivuzo');
    $('#btnSettings').html('Buyisela<br/>amasethingi');
    $('#TXTWithdrawAmount').attr('placeholder', 'Faka lemali edingekayo.');
    exceedText = "imali enganele";
    $('#btnTransfer').text('Ukudlulisa');
    $('#spanAddGoal').html('Engeza');
    $('#TXTGoalName').attr('placeholder', 'Faka Igama');
    $('#TXTGoalAmount').attr('placeholder', 'Faka inani');
}

$("#engSelect").click(function () { ChooseLanguage('English'); navContentClick($("#engSelect")); });
$("#afrSelect").click(function () { ChooseLanguage('Afrikaans'); navContentClick($("#afrSelect")); });
$("#zuluSelect").click(function () { ChooseLanguage('isiZulu'); navContentClick($("#zuluSelect")); });

$("#otpSubmit").click(function () { DoOTP($("#otpSubmit")); });

$("#myPocketSelect").click(function () { DoMyPocket(); navContentClick($("#myPocketSelect")); });

$("#withdrawSelect").click(function () { navContentClick($("#withdrawSelect")); });
$("#doWithdrawalSelect").click(function () { DoWithdrawl($("#doWithdrawalSelect")); });

$("#transferSelect").click(function () { navContentClick($("#transferSelect")); });
$("#doTransferSelect").click(function () { DoTransfer($("#doTransferSelect")); });

$("#btnSettings").click(function () { ClearChild(); navContentClick($("#btnSettings")); });

$("#goalsSelect").click(function () { DoGoals(); navContentClick($("#goalsSelect")); });
$("#doAddGoalSubmit").click(function () { DoAddGoal(); navContentClick($("#doAddGoalSubmit")); });

$("#rewardsSelect").click(function () { DoRewards(); navContentClick($("#rewardsSelect")); });

$("#backButton").click(function () { goBack(); });
$("#exitButton").click(function () { navigator.app.exitApp(); });
$("#addButton").click(function () { navContentClick($("#addButton")); });

