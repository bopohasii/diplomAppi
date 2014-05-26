$(function() {
    $( "#accordion" ).accordion();
    $("section").css("min-height", $(window).height() - $("header").height()-$("footer").height() +'px');
});