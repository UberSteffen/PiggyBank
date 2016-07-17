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
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };


    document.getElementById('englishClick').addEventListener('click', english, false);

    function english() {
        localStorage.setItem("Language", "en");
        var otppassed = localStorage.getItem("OTPPassed");
        if (otppassed != null && otppassed) {
            window.location = "menu.html";
        }
        else {
            window.location = "otp.html";
        }
    }

    document.getElementById('afrikaansClick').addEventListener('click', afrikaans, false);

    function afrikaans() {
        localStorage.setItem("Language", "af");
        var otppassed = localStorage.getItem("OTPPassed");
        if (otppassed != null && otppassed) {
            window.location = "menu.html";
        }
        else {
            window.location = "otp.html";
        }
    }

    document.getElementById('zuluClick').addEventListener('click', zulu, false);

    function zulu() {
        localStorage.setItem("Language", "zu");
        var otppassed = localStorage.getItem("OTPPassed");
        if (otppassed != null && otppassed) {
            window.location = "menu.html";
        }
        else {
            window.location = "otp.html";
        }
    }
})();