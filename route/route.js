var ROUTE = {
   // "Private"
   _directionsService: new google.maps.DirectionsService,
   _directionsDisplay: undefined,
   _map: undefined,
   _current: undefined,
   //$stops

   onDirectionsChanged: function() {},

   initMap: function($stops, onDirectionsChangedCallback) {
      var me = this;

      if (onDirectionsChangedCallback) {
         this.onDirectionsChanged = onDirectionsChangedCallback;
      }

      this.$stops = $stops;

      if (!this._map) {
         this._map = new google.maps.Map(document.getElementById("map"), {
            zoom: 4,
            center: new google.maps.LatLng(35.042881, -89.756791) // FHI
         });
      }

      if (!this._directionsDisplay) {
         this._directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: true,
            map: this._map
         });
      }

      this._directionsDisplay.addListener('directions_changed', this.onDirectionsChanged);

      new google.maps.places.Autocomplete($("#origin")[0], {
         componentRestrictions: {
            country: "US"
         }
      });

      new google.maps.places.Autocomplete($("#destination")[0], {
         componentRestrictions: {
            country: "US"
         }
      });

      this.$stops.on("click", ".deleteStop", function(ev) {
         ev.preventDefault();

         ROUTE.deleteStop($(this));

         ROUTE.displayRoute();
      });
   },

   addStop: function() {
      this.$stops.append("<p class='stop'><input type='text'><a href='#' class='deleteStop'>X</a></p>");

      new google.maps.places.Autocomplete($(".stop:last-child input", this.$stops)[0], {
         componentRestrictions: {
            country: "US"
         }
      });
   },

   deleteStop: function($el) {
      $el.parents(".stop").remove();
   },

   displayRoute: function() {
      var me = this;

      var waypoints = $("input", this.$stops).map(function() {
         return {
            location: $(this).val(),
            stopover: true
         };
      });

      this.resetCurrent();

      this._directionsService.route({
         origin: $("#origin").val(),
         destination: $("#destination").val(),
         waypoints: waypoints,
         travelMode: google.maps.TravelMode.DRIVING,
         avoidTolls: true
      }, function(response, status) {
         if (status === google.maps.DirectionsStatus.OK) {
            me._directionsDisplay.setDirections(response);
         }
         else {
            alert('Could not display directions due to: ' + status);
         }
      });

      $("#results").hide();
   },

   resetCurrent: function() {
      if (this._current) {
         this._current.setMap(null);
      }
   },

   getDirections: function() {
      return this._directionsDisplay.getDirections();
   },

   plotCurrent: function(lat, lng) {
      var latLng = new google.maps.LatLng(lat, lng);

      this.resetCurrent();

      this._current = new google.maps.Marker({
         position: new google.maps.LatLng(lat, lng),
         map: this._map,
         title: "Lat: " + lat + " Long: " + lng
      });
   }
};

$(document).ready(function() {
   ROUTE.initMap($("#stops"), function() {
      $("#results").hide();
      $("#waypoints").empty();
      ROUTE.resetCurrent();
   });

   // Display initial O/D route
   ROUTE.displayRoute();

   $("#route").click(function() {
      ROUTE.displayRoute();
   });

   $("#addStop").click(function() {
      ROUTE.addStop();
   });

   $("#save").click(function() {
      var len = ROUTE.getDirections().routes[0].overview_path.length;
      var options = "";

      document.getElementById("numSteps").innerHTML = len;

      for (var i=0; i<len; i++) {
         options += "<option>"+ROUTE.getDirections().routes[0].overview_path[i]+"</option>";
      }
      $("#waypoints").empty().append(options);

      $("#results").show();
   });

   $("#useOrigin").change(function(ev) {
      var checked = $(this).is(":checked");

      $("#origin").prop("disabled", checked);

      if (checked) {
         $("#origin").val("Memphis, TN");

         ROUTE.displayRoute();
      }
   });

   $("#useDest").change(function(ev) {
      var checked = $(this).is(":checked");

      $("#destination").prop("disabled", checked);

      if (checked) {
         $("#destination").val("Dallas, TX");

         ROUTE.displayRoute();
      }
   });

   $("#waypoints").change(function(ev) {
      var a = $("#waypoints").val();

      var pts = a.match(/\(([\d-\.]+), ([\d-\.]+)\)/);

      ROUTE.plotCurrent(pts[1], pts[2]);
   });

   $(".accordion").each(function () {
      var $accordian = $(this);

      $accordian.find(".accordion-head").on("click", function () {
         $(this).removeClass("open").addClass("close");

         $accordian.find(".accordion-body").slideUp();

         if (!$(this).next().is(":visible")) {
            $(this).removeClass("close").addClass("open");
            $(this).next().slideDown();
         }
      });
   });
});
