/*function displaySize() {
   var $win = $(window);
   var mobileMode = $win.width() <= 499 ? "Mobile Mode!" : "Desktop Mode!";
   $('#size').html($win.width() + " x " + $win.height() + " " + mobileMode);
}
*/

function displayFiltersDropdown() {
   var isJourney = $("input[type=radio][name=type]:checked", "#type-radio-group").val() === "j";

   $(".dropdown_filters").css("display", isJourney ? "flex" : "none");
}

/*
$(window).resize(function() {
   displaySize();
});
*/

function displayMode() {
   var isMapMode = $("#monitor-page-wrapper").hasClass("map-mode");

   $("#mode").html("Go to " + (isMapMode ? "List" : "Map"));
}

$(document).ready(function() {
   displayMode();

   //displaySize();

   displayFiltersDropdown();

   $("#mode").click(function($el) {
      var isMapMode = $("#monitor-page-wrapper").toggleClass("map-mode");

      displayMode();
   });
});

$("input[type=radio][name=type]").change(function(ev) {
   displayFiltersDropdown();
});
