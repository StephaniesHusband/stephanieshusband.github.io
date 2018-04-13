function displayFiltersDropdown() {
   var isJourney = $("input[type=radio][name=type]:checked", "#type-radio-group").val() === "j";
   var $ddf = $(".dropdown-dlg_filters");

   $ddf.toggle(isJourney);

   if (!isJourney) {
      $ddf.removeClass("dd-open");
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

   $("#btn-cancel").one("click", function() {
      //alert("cancel");
   });
   $("#btn-apply").one("click", function() {
      //alert("apply");
   });
   $("#btn-save-as-default").one("click", function() {
      //alert("save as default");
   });

   $(".dropdown-dlg_filters .dd-button").click(function() {
      var $ddf = $(this).parent();

      if (!$ddf.hasClass("dd-open")) {
         $ddf.find(".filter-body").scrollTop(0);

         $ddf.addClass("dd-open");

         $ddf.find(".filter-footer .button").click(function() {
            $ddf.removeClass("dd-open");
         });
      }
   });
});

