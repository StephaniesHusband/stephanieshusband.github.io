function displayFiltersDropdown() {
   var isJourney = $("input[type=radio][name=type]:checked", "#type-radio-group").val() === "j";

   $(".dropdown_filters").css("display", isJourney ? "flex" : "none");
}

function displayMode() {
   var isMapMode = $("#monitor-page-wrapper").hasClass("map-mode");

   $("#mode").html("Go to " + (isMapMode ? "List" : "Map"));
}

$(document).ready(function() {
   displayMode();

   displayFiltersDropdown();

   $("#mode").click(function($el) {
      var isMapMode = $("#monitor-page-wrapper").toggleClass("map-mode");

      displayMode();
   });

   $(".button_placard-sort").click(function() {
      $(".wrapper_placard-list-sort").slideToggle({
         start: function() {
            $(this).css("display", "flex");
         }
      });
   });

   $("input[type=radio][name=type]").change(function(ev) {
      displayFiltersDropdown();
   });

   $(".dropdown_filters").click(function() {
      var $body = $("body");
      var $filterDlg = $(".wrapper_filters");
     
      $body.addClass("dlg-open");
      $filterDlg.show();

      $(".wrapper_filters .button-bar button").click(function() {
         $filterDlg.hide();
         $body.removeClass("dlg-open");
      });

      /*
      $(".wrapper_filters").slideToggle({
         start: function() {
            $(this).css("display", "flex");
         }
      });
      */
   });
});

