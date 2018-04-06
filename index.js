function displaySize() {
   var $win = $(window);
   var mobileMode = $win.width() <= 499 ? "Mobile Mode!" : "Desktop Mode!";
   $('#size').html($win.width() + " x " + $win.height() + " " + mobileMode);
}

$(document).ready(function(e) {
   $("#mode").html("Go to List");
   $("#mode").click(function($el) {
      var isMapMode = $("#monitor-page-wrapper").toggleClass("map-mode").hasClass("map-mode");
      console.log(isMapMode);
      $("#mode").html("Go to " + (isMapMode ? "List" : "Map"));
   });

   displaySize();
});

$(window).resize(function() {
   displaySize();
});
