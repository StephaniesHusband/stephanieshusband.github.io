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
            scaleControl: true,
            mapTypeControlOptions: {
               position: google.maps.ControlPosition.RIGHT_TOP
            },
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
      this.$stops.append("<p class='stop'>Stop: <input type='text'><a href='#' class='deleteStop'>X</a></p>");

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
   },

   calculateHeading: function(latLng1, latLng2) {
      /*
      var latA = latLng1.lat();
      var lngA = latLng1.lng();
      var latB = latLng2.lat();
      var lngB = latLng2.lng();
      var ra = Math.PI/180;
      var deg = 180/Math.PI;    
      var x = lngB - lngA;
      var y = lngB - lngA;

      var f = 0;

      if (x >= 0 && y >= 0) {
         y = y * ra; x = x * ra;
         f = 90 - Math.atan(y / x) * deg;

      } else if (x >= 0 && y <= 0) {
         y = y * ra; x = x * ra;
         f = 90 + Math.abs(Math.atan(y / x) * deg);

      } else if (x <= 0 && y <= 0) {
         y = y * ra; x = x * ra;
         f = 270 - Math.atan(y / x) * deg;

      } else if (x <= 0 && y >= 0) {
         y = y * ra; x = x * ra;
         f = 270 + Math.abs(Math.atan(y / x) * deg);
      }

      //alert("Angle :" + f + " degree" );
      return f;*/

      var lat1 = latLng1.lat();
      var long1 = latLng1.lng();
      var lat2 = latLng2.lat();
      var long2 = latLng2.lng();

      var degToRad= Math.PI/180.0;
      var phi1= lat1 * degToRad;
      var phi2= lat2 * degToRad;
      var lam1= long1 * degToRad;
      var lam2= long2 * degToRad;

      return Math.atan2(Math.sin(lam2-lam1) * Math.cos(phi2),
         Math.cos(phi1)*Math.sin(phi2) - Math.sin(phi1)*Math.cos(phi2)*Math.cos(lam2-lam1)
      ) * 180/Math.PI;
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

      var op = ROUTE.getDirections().routes[0].overview_path;

      //var ang = ROUTE.calculateHeading(op[0], op[len-1]);

      var ang = google.maps.geometry.spherical.computeHeading(op[0], op[len-1]);

      var sw,ne,se,nw;
      if (ang >= 0) { // 3 km width
         sw = google.maps.geometry.spherical.computeOffset(op[0], 1500, ang + 90);
         se = google.maps.geometry.spherical.computeOffset(op[0], 1500, ang - 90);
         ne = google.maps.geometry.spherical.computeOffset(op[len-1], 1500, ang - 90);
         nw = google.maps.geometry.spherical.computeOffset(op[len-1], 1500, ang + 90);
      }
      else { 
         sw = google.maps.geometry.spherical.computeOffset(op[0], 1500, ang - 90);
         se = google.maps.geometry.spherical.computeOffset(op[0], 1500, ang + 90);
         ne = google.maps.geometry.spherical.computeOffset(op[len-1], 1500, ang + 90);
         nw = google.maps.geometry.spherical.computeOffset(op[len-1], 1500, ang - 90);
      }

      var poly = new google.maps.Polygon({
         paths: [ sw, nw, ne, se ],
         strokeColor: '#FF0000',
         strokeOpacity: 0.8,
         strokeWeight: 3,
         fillColor: '#FF0000',
         fillOpacity: 0.35,
         map: ROUTE._map
      });

      $("#angle").html(ang + "&deg;" + "<br> SW: " + sw + "<br> NE: " + ne);

      $("#results").show();
   });

   $("#useOrigin").click(function(ev) {
      $("#origin").val($("#origin").data("loc"));

      ROUTE.displayRoute();
   });

   $("#useDest").click(function(ev) {
      $("#destination").val($("#destination").data("loc"));

      ROUTE.displayRoute();
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

   $("#left-panel").slideReveal({
      trigger: $("#arrow"),
      width: 500,
      shown: function(slider, trigger) {
         trigger
            .removeClass("fa-arrow-circle-right")
            .addClass("fa-arrow-circle-left");
      },
      hidden: function(slider, trigger) {
         trigger
            .removeClass("fa-arrow-circle-left")
            .addClass("fa-arrow-circle-right");
      }
   });
});
