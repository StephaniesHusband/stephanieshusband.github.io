var c3poc = {
   init: function() {
      var lightDetectVals = [ 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0 ];
      var me = this;
      var chart = c3.generate({
         size: {
            height: 550,
         },
         padding: {
            top: 10,
            right: 50,
            bottom: 10,
            left: 100
         },
         data: {
            bindto: "#chart",
            x: "timestamp",
            xFormat: "%Y-%m-%dT%H:%M:%SZ",
            xLocaltime: false,
            columns: [
               ["timestamp",
                "2015-05-02T01:12:30Z",
                "2015-05-03T02:13:31Z",
                "2015-05-04T05:16:34Z",
                "2015-05-05T06:17:35Z",
                "2015-05-06T07:18:36Z",
                "2015-05-07T10:19:30Z",
                "2015-05-10T11:20:31Z",
                "2015-05-11T12:21:32Z",
                "2015-05-12T13:22:33Z",
                "2015-05-13T14:23:34Z",
                "2015-05-14T15:24:35Z",
                "2015-05-15T16:25:36Z",
                "2015-05-16T17:26:37Z",
                "2015-05-17T20:27:38Z",
                "2015-05-20T21:28:39Z",
                "2015-05-21T22:29:40Z",
                "2015-05-22T23:30:41Z",
                "2015-05-23T24:31:42Z",
                "2015-05-24T15:32:43Z",
                "2015-05-25T16:33:44Z",
                "2015-05-26T17:34:45Z",
                "2015-05-27T18:35:46Z",
                "2015-05-30T19:36:47Z",
                "2015-06-01T20:37:48Z",
                "2015-06-03T21:38:49Z",
                "2015-06-04T22:39:50Z",
                "2015-06-05T03:14:32Z",
                "2015-06-06T04:15:33Z"],

               ["deviceTemp" , 130 , 120 , 150 , 0 , 0 , 160 , 150 , null , null , null , null , null , null , null , 130 , 120 , 150 , 0 , 0 , 160 , 150 , 0 , 0 , 0 , 0 , 5  , 0 , 0] , 
               ["probeTemp"  , 100 , 80  , 100 , 0 , 0 , 130 , 120 , null , null , null , null , null , null , null , 150 , 150 , 170 , 0 , 0 , 170 , 100 , 0 , 0 , 0 , 0 , 50 , 0 , 0] , 
               // On the y2 axis 0-10. This looks weird but it gets us our line of light detect data on the same chart
               // and below the rest of the data being plotted. We need an entry for every data point in this array at
               // the same y value of 2.8. The actual data will be looked up in the lightDetectVals array above.
               ["lightDetect", 2.8, null, null, null, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8 ],
               // These are displayed "grouped" or in a "stacked bar chart" so we have 3 sets of values for the mutex
               // values (i.e., for any index, there should only ever be 1 set).
               ["commOn",  1.5, 1.5, 1.5, 1.5, 0, 0, 0, 1.5, 1.5, 0, 0, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5 ],
               ["commOff", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.75, 0.75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
               ["commAC",  0, 0, 0, 0, 0.75, 0.75, 0.75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]  
            ],
            names: {
               timestamp   : "Timestamp",
               deviceTemp  : "Device Temperature",
               probeTemp   : "Probe Temperature",
               lightDetect : "Light Detected"
            },
            // Type of chart for each dataset
            types: {
               deviceTemp  : "line",
               probeTemp   : "line",
               lightDetect : "line",
               commOn      : "bar",
               commOff     : "bar",
               commAC      : "bar"
            },
            color: function (color, d) {
               // Color our lightDetect point based upon the values in the array we saved off with the light detect
               // values
               if (d.id === "lightDetect") {
                  return lightDetectVals[d.index] ? "#008000" : "#ff0000";
               }
               return color;
            },
            // These are our comm status colors
            colors: {
               commOn:  "#008000",
               commOff: "#ff0000",
               commAC:  "#d3d3d3"
            },
            // Specify what data is plotted on which y axis
            axes: {
               lightDetect: "y2",
               commOn: "y2",
               commOff: "y2",
               commAC: "y2"
            },
            // Stack these and only show one at time based upon value.
            groups: [
               [ "commOn", "commOff", "commAC" ]
            ]
         },
         bar: {
            width: 7 
         },
         axis: {
            x: {
               type: "timeseries",
               height: 100, // for the 45 deg rotation
               tick: {
                  culling: 0,
                  rotate: -45,
                  multiline: false,
                  format: function(x) {
                     //return x.toLocaleString(); // "%Y-%m-%d" // TODO will have to do some magic here to convert the user's date format into their terms
                     return moment(x).tz("America/Chicago").format("M/D/YYYY h:mm A zz");
                  }
               }
            },
            y: {
               label: {
                  text: "Degrees in Celsius",
                  position: "outer-middle"
               },
               padding: {
                  bottom: 200
               },
               tick: {
                  outer: false,
                  format: function(y) {
                     return y>=0 ? y+"\u00b0" : "";
                  }
               }
            },
            y2: {
               max: 10,
               min: 1
            }
         },
         grid: {
            y: {
               lines: [
                  { value: 3.5, text: "Light", axis: "y2", position: "start" },
                  { value: 2, text: "Device Communication", axis: "y2", position: "start" }
               ]
            }
         },
         regions: [
            {axis: 'x', start: "2015-05-05T06:17:35Z", end: "2015-05-10T11:20:31Z", class: "airplaneMode"},
            {axis: 'y', start: 50, end: 125, class: "regionY"}
         ],
         subchart: {
            show: true,
            onbrush: function(domain) {
               me.drawAirplane();
            }
         },
         zoom: {
            enabled: true
         },
         tooltip: {
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
               var $$ = this,
                   config = $$.config,
                   titleFormat = config.tooltip_format_title || defaultTitleFormat,
                   nameFormat = config.tooltip_format_name || function (name) { return name; },
                   valueFormat = config.tooltip_format_value || defaultValueFormat,
                   text, i, title, value, name, bgcolor;
               var commVal = NaN;

               // Recreate the default tooltip with some modifications
               for (i = 0; i < d.length; i++) {

                  if (!(d[i] && (d[i].value || d[i].value === 0))) {
                     continue;
                  }

                  // Init our tooltip table
                  if (!text) {
                     title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                     text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                  }

                  // Save off the appropriate comm value for use later
                  if (d[i].id.match(/^comm/)) {
                     // commOn=2, commOff=1, commAC=0
                     if (d[i].value > 0) {
                        commVal = d[i].id === "commOn" ? 2 : d[i].id === "commOff" ? 1 : 0;
                     }

                     // Don't display the individual data points in the tooltip
                     continue;
                  }
                  else if (d[i].id === "lightDetect") {
                     // we have to lookup our light detect value
                     value = lightDetectVals[d[i].index] ? "Yes" : "No"; // TODO translate
                     bgcolor = lightDetectVals[d[i].index] ? "#008000" : "#f00";
                  }
                  else {
                     value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                     bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
                  }

                  name = nameFormat(d[i].name);

                  // TODO style "name" and "value" classes (and/or figure out tooltipName class)
                  text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                  text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
                  text += "<td class='value'>" + value + "</td>";
                  text += "</tr>";
               }

               // Create our communication row 
               if (!isNaN(commVal)) {
                  switch (commVal) {
                     case 2:
                        value = "Successful"; // TODO
                        bgcolor = "#008000";
                        break;
                     case 1:
                        value = "Delayed"; // TODO
                        bgcolor = "#f00";
                        break;
                     case 0:
                        value = "Delayed due to airplane mode"; // TODO
                        bgcolor = "#d3d3d3";
                        break;
                  }

                  text += "<tr><td class='name'><span style='background-color:" +bgcolor + "'></span>Device Communication</td>";
                  text += "<td class='value'>" + value + "</td>";
                  text += "</tr>";
               }

               return text + "</table>";
            }
         }
      }); 

      // Not sure why this won't work in the declaration above.
      chart.legend.hide(["lightDetect", "commOn", "commOff", "commAC"]);

      // Hide the ticks below 0 on our y axis
      $(".c3-axis-y .tick text tspan:empty").parent().parent().hide();

      d3.selectAll(".c3-axis-x:last-child .tick").remove();

      this.drawAirplane();
   },

   drawAirplane: function() {
      d3.select(".c3-region.airplaneMode text").remove();

      var rectX = d3.select(".c3-region.airplaneMode rect").node().x.baseVal.value;

      d3.select(".c3-region.airplaneMode")
         .append("text")
         .attr("font", "Arial")
         .attr("font-size", "250%")
         .attr("fill", "#AAA")
         .attr("fill-opacity", "1")
         .text("\u2708")
         .attr("x", rectX)
         .attr("y", 20);
   }
};

$(function() {
   c3poc.init();
}); 
