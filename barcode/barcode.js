var BarcodePOC = BarcodePOC || {};

// Create the QuaggaJS config object for the live stream
BarcodePOC.liveStreamConfig = {
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
BarcodePOC.fileConfig = $.extend({}, BarcodePOC.liveStreamConfig, {
   inputStream: {
      size: 800
   }
});

BarcodePOC.init = function($livestream) {
   var me = this;

   // Start the live stream scanner when the modal opens
   $livestream
      .on('shown.bs.modal', function(e) {
         // Define as closure on e so that we can grab the input of the button they clicked on
         var fnDetected = function(data) {
            if (data.codeResult.code){
               var $inputId = $("#" + $(e.relatedTarget).data("input"));

               $inputId.val(data.codeResult.code);

               Quagga.offDetected(fnDetected);

               Quagga.stop();

               setTimeout(function() {
                  $livestream.modal('hide');
               }, 1000);
            }
         };

         // Once a barcode had been read successfully, stop Quagga and close the modal after a second to let the user notice
         // where the barcode had actually been found.
         Quagga.onDetected(fnDetected);

         // Init the Quagga livestream
         Quagga.init(
            BarcodePOC.liveStreamConfig,
            function(err) {
               if (err) {
                  $('.modal-body .error', $livestream).html('<div class="alert alert-danger"><strong><i class="fa fa-exclamation-triangle"></i> '+err.name+'</strong>: '+err.message+'</div>');
                  Quagga.stop();
                  return;
               }
               Quagga.start();
            }
         );
      })
      // Stop quagga in any case, when the modal is closed
      .on('hide.bs.modal', function(){
         if (Quagga){
            try {
               Quagga.stop();
            }
            catch(e) { }
         }
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

   // Call Quagga.decodeSingle() for every file selected in the file input
   $("input:file", this.$livestream).on("change", function(e) {
      if (e.target.files && e.target.files.length) {
         Quagga.decodeSingle($.extend({}, BarcodePOC.fileConfig, {
            src: URL.createObjectURL(e.target.files[0])
         }), function(result) {
            alert(result.codeResult.code);
         });
      }
   });

   //-----------------------------------

   // Define Vue component(s)
   Vue.component("scan-field", {
      template: "#scan-field",
      props: [ "field" ]
   });

   // Create our Vue instance
   this.vm = new Vue({
      el: "#app",
      data: {
         fields: [
            {
               label: "Device ID",
               id: "deviceId",
               placeholder: "Enter or Scan Device ID"
            },
            {
               label: "ASP #",
               id: "aspNumber",
               placeholder: "Enter or Scan ASP #"
            }
         ]
      }
   });

   // Create any tooltips
   $("[data-toggle='tooltip']").tooltip();
};

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

$(document).ready(function() {
   // Fire it up!
   BarcodePOC.init($("#livestream_scanner"));
});
