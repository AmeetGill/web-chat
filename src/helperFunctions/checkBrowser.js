

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== "undefined";

// Safari 3.0+ "[object HTMLElementConstructor]"
var is_safari = navigator.userAgent.indexOf("Safari") > -1;


// Internet Explorer 6-11
var isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection

let browser = 1;



if (isFirefox) {
    browser =  1;
}


if (isIE) {
    browser = 3;
}

if (isEdge) {
    browser = 4;
}

if (isChrome) {
    browser = 5;
}

if (is_safari){
	browser = 6;
}



export default browser;