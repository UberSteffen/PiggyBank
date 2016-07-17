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
            var element = document.getElementById("balancelink");
            element.innerHTML = "Balance";
            var element = document.getElementById("goalslink");
            element.innerHTML = "Goals";
            var element = document.getElementById("rewardslink");
            element.innerHTML = "Rewards";
        }

        if (lang == "af") {
            document.getElementById("mascotimg").src = "images/mascot3AFR.png";
            var element = document.getElementById("balancelink");
            element.innerHTML = "Balans";
            var element = document.getElementById("goalslink");
            element.innerHTML = "Doelwitte";
            var element = document.getElementById("rewardslink");
            element.innerHTML = "Belonings";
        }

        if (lang == "zu") {
            document.getElementById("mascotimg").src = "images/mascot3ZUL.png";
            var element = document.getElementById("balancelink");
            element.innerHTML = "Ebhange";
            var element = document.getElementById("goalslink");
            element.innerHTML = "Imigomo";
            var element = document.getElementById("rewardslink");
            element.innerHTML = "Imivuzo";
        }
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();