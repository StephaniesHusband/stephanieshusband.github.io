var POC_1167 = {

   toggleCol: function($table, columns, bShow) {
      if (typeof(columns) === "number") {
         columns = [ columns ];
      }

      /* jshint -W083 */
      for (var ndx in columns)
      {
         $table.find("tr").each(function() {
            $(this).find("td:eq("+columns[ndx]+")").toggle(bShow);
         });
      }
   },

   showCols: function()
   {
      var is2way = ($("#cboJourneyType").val() === "2way");
      var configType = $("#cboConfigFor").val();
      var advType = $("input[name='advanced']:checked").val();

      // always show 1
      this.toggleCol($("#byPhaseSettings"), [ 1 ], true);

      if (configType === 'advanced')
      {
         if (advType === 'phase') {
            this.toggleCol($("#byPhaseSettings"), [ 2,3 ], true);
         }

         POC_1167.toggleCol($("#byPhaseSettings"), [ 4, 5 ], is2way);
      }
      else if (configType === "entire")
      {
         POC_1167.toggleCol($("#byPhaseSettings"), [ 2,3,4,5 ], false);
      }
      else if (configType === "segment")
      {
         POC_1167.toggleCol($("#byPhaseSettings"), [ 2,3,5 ], false);
         POC_1167.toggleCol($("#byPhaseSettings"), 4, true);
      }

      $("#byPhaseSettings").toggle(advType === 'phase');
      $("#byLocationSettings").toggle(configType === 'advanced' && advType === 'location');
      $("#byDateSettings").toggle(advType === 'date');
      $("#twoWayHeaderRow").toggle(is2way && configType !== 'entire');
      $("#advRadios").toggle(configType === 'advanced');
      $("#byPhaseHeaderRow").toggle(configType === 'advanced' && advType === 'phase');

      $("#cboConfigFor option[value='segment']").attr("disabled", !is2way);

      if (is2way)
      {
         $("#twoWayHeaderRow th:nth-child(2)").attr("colspan", $("#byPhaseHeaderRow .outbound:visible").length);
         $("#twoWayHeaderRow th:nth-child(3)").attr("colspan", $("#byPhaseHeaderRow .inbound:visible").length);
      }
   },


   showLocFields: function() {
      var locRIType = $("input[name='locRI']:checked").val();

      $("#locInOutGeofence").toggle(locRIType === 'inOut');
      $("#locEnterExitGeofence").toggle(locRIType === 'enterExit');
   },

   populateRIs: function()
   {
      var RIs = {
         "10": "10 minutes",
         "30": "30 minutes",
         "60": "1 hour",
         "120": "2 hours",
         "240": "4 hours",
         "480": "8 hours",
         "720": "12 hours",
         "1440": "24 hours"
      };

      $("select.ri").each(function(ndx, elem) {
         $.each(RIs, function(key, value) {   
            $(elem).append($('<option>', { value: key }).text(value)); 
         });
      });
   }
};

// On DOM ready...
$(function() {
   // INITIALIZE THE SCREEN
   // Hide columns 2-5
   POC_1167.toggleCol($("#byPhaseSettings"), [2,3,4,5], false);
   // Select One-way journey type
   $("#cboJourneyType").val("1way");
   // Disble "By Segment" option
   $("#cboConfigFor option[value='segment']").attr("disabled", true);
   // Select "Entire Journey"
   $("#cboConfigFor").val("entire");
   // Disable all the motion hibernate selects
   //$("tr.motionHib td select").prop("disabled", true);
   $("tr.motionHib td select").hide();

   POC_1167.populateRIs();

   // Handle the checking of the Enable Motion Hibernate checkboxes...
   $("#enableMotionHibernateRow input:checkbox.motionHib").on("change", function() {
      var isMH = $(this).is(":checked");
      var ndx = $(this).parent().index(); // the column index

      // The regular reporting interval selects...
      //$("tr.nonMotionHib td:eq("+ndx+") select").prop("disabled", isMH);
      $("tr.nonMotionHib td:eq("+ndx+") select").toggle(!isMH).prev().toggle(isMH);

      // The motion hibernate reporting interval selects (in-motion and stationary)...
      $("tr.motionHib").each(function() {
         //$(this).find("td:eq("+ndx+") select").prop("disabled", !isMH);
         $(this).find("td:eq("+ndx+") select").toggle(isMH).prev().toggle(!isMH);
      });
   });

   $("#toggleInfoIcons").on("change", function() {
      var chkd = $(this).is(":checked");

      $("img[src*='info.png']").toggle(chkd);
   });

   // Journey Type changes...
   $("#cboJourneyType").on("change", POC_1167.showCols);

   // Configuration for changed...
   $("#cboConfigFor").on("change", function() {

      POC_1167.showCols();

      if (this.value === 'advanced') {
         $('#phase').click();
      }
   });

   // Advanced type changed...
   $("input[name='advanced']").change(function() {
      POC_1167.showCols();

      if (this.value === 'location')
      {
         $("#inOut").click();
      }
   });

   // Advanced type changed...
   $("input[name='locRI']").change(POC_1167.showLocFields);
});


