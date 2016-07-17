// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        var element = document.getElementById("balance");
        //Call endpoint and set balance
        element.innerHTML = "1000.00";

        var element = document.getElementById("savings");
        //Call endpoint and set balance
        element.innerHTML = "500.00";

        var lang = localStorage.getItem("Language");

        if (lang == "en") {
            var element = document.getElementById("balancetag");
            element.innerHTML = "Balance:";
            var element = document.getElementById("savingstag");
            element.innerHTML = "Savings:";
            var element = document.getElementById("withdrawClick");
            element.innerHTML = "Withdraw";
            var element = document.getElementById("saveClick");
            element.innerHTML = "Save";
        }

        if (lang == "af") {
            var element = document.getElementById("balancetag");
            element.innerHTML = "Balans:";
            var element = document.getElementById("savingstag");
            element.innerHTML = "Spaar:";
            var element = document.getElementById("withdrawClick");
            element.innerHTML = "Onttrekking";
            var element = document.getElementById("saveClick");
            element.innerHTML = "Red";
        }

        if (lang == "zu") {
            var element = document.getElementById("balancetag");
            element.innerHTML = "Ebhange:";
            var element = document.getElementById("savingstag");
            element.innerHTML = "Savings:";
            var element = document.getElementById("withdrawClick");
            element.innerHTML = "Ukuhoxiswa";
            var element = document.getElementById("saveClick");
            element.innerHTML = "Londoloza";
        }
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    document.getElementById('withdrawClick').addEventListener('click', withdraw, false);

    function withdraw() {
        var withdrawValue = document.getElementById('withdrawAmount').value;

        //Call endpoint and update balance
        alert("You've withdrawn: " + withdrawValue);

        window.location = "menu.html";
    }

    document.getElementById('saveClick').addEventListener('click', save, false);

    function save() {
        var saveValue = document.getElementById('saveAmount').value;

        //Call endpoint and update balance
        alert("You've saved: " + withdrawValue);

        window.location = "menu.html";
    }
})();