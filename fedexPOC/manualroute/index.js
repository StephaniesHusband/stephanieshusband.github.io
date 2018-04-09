var Polyline = (function() {
   return {
      _map: {},
      _route: {},
      _path: {},
      _deleteMenu: {},
      _mousedDown: false,
      _mousedUp: false,

      init: function() {
         var me = this;

         _map = new google.maps.Map(document.getElementById("map_canvas"), {
            zoom: 3,
            center: new google.maps.LatLng(37.94152, -91.94798),
            mapTypeId: google.maps.MapTypeId.ROADMAP
         });

         _route = [
            new google.maps.LatLng(34.0982641, -117.8166831),
            new google.maps.LatLng(37.08207, -94.36232),
            new google.maps.LatLng(42.0189323, -71.2326604)
         ];

         _path = new google.maps.Polyline({
            path: _route,
            strokeColor: "#1F7DA4",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            editable: true,
            draggable: true
         });

         _deleteMenu = new DeleteMenu();

         google.maps.event.addListener(_path, "dragend", this.getPath);
         google.maps.event.addListener(_path.getPath(), "insert_at", this.getPath);
         google.maps.event.addListener(_path.getPath(), "remove_at", this.getPath);
         google.maps.event.addListener(_path.getPath(), "set_at", this.getPath);

         google.maps.event.addListener(_path, 'rightclick', function(e) {
            me._showDeleteMenu(e);
         });

         new LongPress({
            target: _path,
            onLongPress: function(ev) {
               me._showDeleteMenu(ev);
            }
         });

         _path.setMap(_map);
      },

      _showDeleteMenu: function(e) {
         // Check if click was on a vertex control point
         if (e.vertex == undefined) {
            return;
         } else if (e.vertex === 0) { // can't delete origin
            return;
         } else {
            var polyline = _path.getPath();
            var len = polyline.getLength();

            if (e.vertex === len - 1) { // can't delete destination
               return;
            }
         }

         _deleteMenu.open(_map, _path.getPath(), e.vertex);
      },

      getPath: function() {
         var polyline = _path.getPath();
         var len = polyline.getLength();
         var coordStr = "";

         for (var i = 0; i < len; i++) {
            coordStr += polyline.getAt(i).toUrlValue(6) + "<br>";
         }

         document.getElementById('geoCoordinates').innerHTML = coordStr;
      }
   };
})();

$(function() {
   Polyline.init();
});
