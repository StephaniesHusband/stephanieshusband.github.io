function displayFiltersDropdown() {
   var isJourney = $("input[type=radio][name=type]:checked", "#type-radio-group").val() === "j";
   var $dd = $(".dropdown-dlg_filters");

   $dd.toggle(isJourney);

   if (!isJourney) {
      $dd.find(".dd-input").prop("checked", false);
   }
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

   $(".dropdown-dlg_filters .dd-button").click(function() {
      var $ddf = $(this).parent();

      if (!$ddf.hasClass("dd-open")) {
         $ddf.addClass("dd-open").find(".filter-footer .button").one("click", function() {
            $ddf.removeClass("dd-open");
         });
      }
   });
});

