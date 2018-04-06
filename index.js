function displaySize() {
   var $win = $(window);
   var mobileMode = $win.width() <= 499 ? "Mobile Mode!" : "Desktop Mode!";
   $('#size').html($win.width() + " x " + $win.height() + " " + mobileMode);
}

$(window).resize(function() {
   displaySize();
});

$(document).ready(function() {
   $("#mode").html("Go to List");

   displaySize();

   $("#mode").click(function($el) {
      var isMapMode = $("#monitor-page-wrapper").toggleClass("map-mode").hasClass("map-mode");

      $("#mode").html("Go to " + (isMapMode ? "List" : "Map"));
   });
});
