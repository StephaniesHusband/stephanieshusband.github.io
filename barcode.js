$(document).ready(function() {
   // Create the QuaggaJS config object for the live stream
   var liveStreamConfig = {
      inputStream: {
         type: "LiveStream",
         constraints: {
            width: {min: 640},
            height: {min: 480},
            aspectRatio: {min: 1, max: 100},
            facingMode: "environment" // or "user" for the front camera
         }
      },
      locator: {
         patchSize: "medium",
         halfSample: true
      },
      numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
      decoder: {
         readers: [ "upc_reader", "code_128_reader" ]
      },
      multiple: false,
      locate: true
   };

   // The fallback to the file API requires a different inputStream option. The rest is the same.
   var fileConfig = $.extend({}, liveStreamConfig, {
      inputStream: {
         size: 800
      }
   });

   //----------------------------------------------------------------------------------------------

   // Start the live stream scanner when the modal opens
   $('#livestream_scanner').on('shown.bs.modal', function(e) {

      var fnDetected = function(data) {
         if (data.codeResult.code){
            $($(e.relatedTarget).data("input")).val(data.codeResult.code);

            Quagga.offDetected(fnDetected);

            Quagga.stop();

            setTimeout(function() {
               $('#livestream_scanner').modal('hide');
            }, 1000);
         }
      };

      // Once a barcode had been read successfully, stop Quagga and close the modal after a second to let the user notice
      // where the barcode had actually been found.
      Quagga.onDetected(fnDetected);

      Quagga.init(
         liveStreamConfig,
         function(err) {
            if (err) {
               $('#livestream_scanner .modal-body .error').html('<div class="alert alert-danger"><strong><i class="fa fa-exclamation-triangle"></i> '+err.name+'</strong>: '+err.message+'</div>');
               Quagga.stop();
               return;
            }
            Quagga.start();
         }
      );
   });

   // Draw frames around possible barcodes on the live stream
   Quagga.onProcessed(function(result) {
      var drawingCtx = Quagga.canvas.ctx.overlay;
      var drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
         if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));

            result.boxes.filter(function(box) {
               return box !== result.box;
            }).forEach(function (box) {
               // potential barcode
               Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
            });
         }

         if (result.box) {
            // a barcode hit!
            Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "blue", lineWidth: 2});
         }

         // Draw a "match" line across barcode if get a hit
         if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: "red", lineWidth: 3});
         }
      }
   });

   // Stop quagga in any case, when the modal is closed
   $('#livestream_scanner').on('hide.bs.modal', function(){
      if (Quagga){
         try {
            Quagga.stop();
         }
         catch(e) { }
      }
   });

   // Call Quagga.decodeSingle() for every file selected in the file input
   $("#livestream_scanner input:file").on("change", function(e) {
      if (e.target.files && e.target.files.length) {
         Quagga.decodeSingle($.extend({}, fileConfig, {
            src: URL.createObjectURL(e.target.files[0])
         }), function(result) {
            alert(result.codeResult.code);
         });
      }
   });
});
