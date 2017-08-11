/* Unfortunately this is the only way I can see this working. mousemove can't be used because it fires immediately when the
 * mousedown fires OR on mobile is not precise enought to check to see if same coordinates as mousedown. we needed to not
 * process the longpress on the mousemove in case they were just dragging a marker and not long pressing on a single marker.
 *
 * The "click" event fires after the mouse up so you will not see the menu until you let go of the longpress. which is just
 * as well on mobile since you can't read what's under your finger anyways.
 */
function LongPress(options) {
   var me = this;

   this._target = options.target;
   this._timing = options.timing || 500;
   this._isLongPress = false;
   this._start = null;

   google.maps.event.addListener(this._target, 'click', function(ev) {
      if (me._isLongPress) {
         if (typeof options.onLongPress === "function") {
            options.onLongPress(ev)
         }
      }
   });
   google.maps.event.addListener(this._target, 'mousedown', function() {
      me._start = new Date().getTime();
   });
   google.maps.event.addListener(this._target, 'mouseup', function() {
      var end = new Date().getTime();

      me._isLongPress = !(end - me._start < 500); // 500 ms

      delete me._start;
   });
}
