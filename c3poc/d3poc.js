var d3poc = {
   init: function() {

      var margin = { top: 10, right: 40, bottom: 150, left: 60 };
      var width = 940 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;
      var contextHeight = 50;
      var contextWidth = width;

      var svg = d3.select("#chart1")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom);

      this.createChart();
   },

   createChart: function(data) {
   }
};

$(function() {
   d3poc.init();
}); 
