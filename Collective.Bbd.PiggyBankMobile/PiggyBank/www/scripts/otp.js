// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        var lang = localStorage.getItem("Language");

        if (lang == "en") {
            document.getElementById("mascotimg").src = "images/mascot3ENG.png";
            var element = document.getElementById("submitClick");
            element.innerHTML = "Submit";
            var element = document.getElementById("otptext");
            element.innerHTML = "Enter your One-Time Pin";
        }

        if (lang == "af") {
            document.getElementById("mascotimg").src = "images/mascot3AFR.png";
            var element = document.getElementById("submitClick");
            element.innerHTML = "Indien";
            var element = document.getElementById("otptext");
            element.innerHTML = "Gee jou eenmalige Pinkode";
        }

        if (lang == "zu") {
            document.getElementById("mascotimg").src = "images/mascot3ZUL.png";
            var element = document.getElementById("submitClick");
            element.innerHTML = "Uhambise";
            var element = document.getElementById("otptext");
            element.innerHTML = "Faka yakho Pin-isikhathi esisodwa";
        }
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };


    document.getElementById('submitClick').addEventListener('click', submit, false);

    function submit() {
        //Call endpoint and check otp
        var valid = true;
        if (valid) {
            localStorage.setItem("OTPPassed", true);
            window.location = "menu.html";
        }
        else {
            alert("Fail!!!");
        }
    }
})();